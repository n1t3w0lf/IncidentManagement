// ============================================
// MSW HANDLERS - Users
// ============================================

import { http, HttpResponse } from 'msw';
import { mockUsers, mockOrganizations, sessionStorage, findUserById } from '../data';
import type { User, UserRole } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

// ============================================
// HELPER FUNCTIONS
// ============================================

const generateUserId = (): string => {
  return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// ============================================
// USER HANDLERS
// ============================================

export const userHandlers = [
  // GET /users - List users
  http.get(`${API_URL}/users`, async ({ request }) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = sessionStorage.getUser();
    if (!user) {
      return HttpResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Only admins and super_admins can list users
    if (user.role !== 'admin' && user.role !== 'super_admin') {
      return HttpResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const url = new URL(request.url);
    const role = url.searchParams.get('role') as UserRole | null;
    const isActive = url.searchParams.get('isActive');
    const search = url.searchParams.get('search');

    let users = [...mockUsers];

    // Filter by organization (except super_admin)
    if (user.role !== 'super_admin') {
      users = users.filter(u => u.organizationId === user.organizationId);
    }

    // Filter by role
    if (role) {
      users = users.filter(u => u.role === role);
    }

    // Filter by active status
    if (isActive !== null) {
      users = users.filter(u => u.isActive === (isActive === 'true'));
    }

    // Search by name or email
    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter(
        u =>
          u.email.toLowerCase().includes(searchLower) ||
          u.firstName.toLowerCase().includes(searchLower) ||
          u.lastName.toLowerCase().includes(searchLower)
      );
    }

    // Sort by created date (newest first)
    users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return HttpResponse.json({
      success: true,
      data: users,
    });
  }),

  // GET /users/:id - Get single user
  http.get(`${API_URL}/users/:id`, async ({ params }) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const currentUser = sessionStorage.getUser();
    if (!currentUser) {
      return HttpResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const user = findUserById(params.id as string);
    if (!user) {
      return HttpResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Users can view their own profile or org members (if admin/manager)
    if (
      user.id !== currentUser.id &&
      currentUser.role !== 'super_admin' &&
      currentUser.role !== 'admin' &&
      currentUser.role !== 'manager'
    ) {
      return HttpResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: user,
    });
  }),

  // POST /users - Create new user
  http.post(`${API_URL}/users`, async ({ request }) => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const currentUser = sessionStorage.getUser();
    if (!currentUser) {
      return HttpResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Only admins and super_admins can create users
    if (currentUser.role !== 'admin' && currentUser.role !== 'super_admin') {
      return HttpResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json() as Partial<User> & { password: string };

    // Validate required fields
    if (!body.email || !body.firstName || !body.lastName || !body.role || !body.password) {
      return HttpResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email === body.email);
    if (existingUser) {
      return HttpResponse.json(
        { success: false, error: 'Email already exists' },
        { status: 409 }
      );
    }

    // Validate role permissions
    if (currentUser.role === 'admin' && body.role === 'super_admin') {
      return HttpResponse.json(
        { success: false, error: 'Admins cannot create super_admin users' },
        { status: 403 }
      );
    }

    // Create new user
    const newUser: User = {
      id: generateUserId(),
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      role: body.role,
      organizationId: currentUser.role === 'super_admin' ? (body.organizationId || currentUser.organizationId) : currentUser.organizationId,
      isActive: body.isActive !== undefined ? body.isActive : true,
      createdAt: new Date().toISOString(),
      avatar: body.avatar,
    };

    mockUsers.push(newUser);

    return HttpResponse.json({
      success: true,
      data: newUser,
      message: 'User created successfully',
    });
  }),

  // PATCH /users/:id - Update user
  http.patch(`${API_URL}/users/:id`, async ({ params, request }) => {
    await new Promise(resolve => setTimeout(resolve, 600));

    const currentUser = sessionStorage.getUser();
    if (!currentUser) {
      return HttpResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const user = findUserById(params.id as string);
    if (!user) {
      return HttpResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const body = await request.json() as Partial<User>;

    // Users can update their own profile (limited fields)
    // Admins can update users in their org
    // Super admins can update anyone
    const canUpdate =
      user.id === currentUser.id ||
      currentUser.role === 'super_admin' ||
      (currentUser.role === 'admin' && user.organizationId === currentUser.organizationId);

    if (!canUpdate) {
      return HttpResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    // Prevent users from changing their own role
    if (user.id === currentUser.id && body.role && body.role !== user.role) {
      return HttpResponse.json(
        { success: false, error: 'You cannot change your own role' },
        { status: 403 }
      );
    }

    // Prevent admins from creating super_admins
    if (currentUser.role === 'admin' && body.role === 'super_admin') {
      return HttpResponse.json(
        { success: false, error: 'Admins cannot assign super_admin role' },
        { status: 403 }
      );
    }

    // Update user
    Object.assign(user, {
      firstName: body.firstName || user.firstName,
      lastName: body.lastName || user.lastName,
      email: body.email || user.email,
      role: body.role || user.role,
      isActive: body.isActive !== undefined ? body.isActive : user.isActive,
      avatar: body.avatar !== undefined ? body.avatar : user.avatar,
    });

    return HttpResponse.json({
      success: true,
      data: user,
      message: 'User updated successfully',
    });
  }),

  // DELETE /users/:id - Delete user (deactivate)
  http.delete(`${API_URL}/users/:id`, async ({ params }) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const currentUser = sessionStorage.getUser();
    if (!currentUser) {
      return HttpResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Only admins and super_admins can delete users
    if (currentUser.role !== 'admin' && currentUser.role !== 'super_admin') {
      return HttpResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const user = findUserById(params.id as string);
    if (!user) {
      return HttpResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent users from deleting themselves
    if (user.id === currentUser.id) {
      return HttpResponse.json(
        { success: false, error: 'You cannot delete yourself' },
        { status: 403 }
      );
    }

    // Soft delete - deactivate user
    user.isActive = false;

    return HttpResponse.json({
      success: true,
      message: 'User deactivated successfully',
    });
  }),

  // GET /organizations/:id - Get organization
  http.get(`${API_URL}/organizations/:id`, async ({ params }) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const user = sessionStorage.getUser();
    if (!user) {
      return HttpResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const organization = mockOrganizations.find(o => o.id === params.id);
    if (!organization) {
      return HttpResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Users can only view their own organization (unless super_admin)
    if (user.role !== 'super_admin' && organization.id !== user.organizationId) {
      return HttpResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: organization,
    });
  }),

  // PATCH /organizations/:id - Update organization
  http.patch(`${API_URL}/organizations/:id`, async ({ params, request }) => {
    await new Promise(resolve => setTimeout(resolve, 600));

    const user = sessionStorage.getUser();
    if (!user) {
      return HttpResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Only admins and super_admins can update org settings
    if (user.role !== 'admin' && user.role !== 'super_admin') {
      return HttpResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const organization = mockOrganizations.find(o => o.id === params.id);
    if (!organization) {
      return HttpResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 }
      );
    }

    if (user.role !== 'super_admin' && organization.id !== user.organizationId) {
      return HttpResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    const body = await request.json() as Partial<typeof organization>;

    // Update organization
    Object.assign(organization, {
      name: body.name || organization.name,
      settings: { ...organization.settings, ...body.settings },
    });

    return HttpResponse.json({
      success: true,
      data: organization,
      message: 'Organization updated successfully',
    });
  }),
];
