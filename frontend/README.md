# Incident Management System - Frontend

A comprehensive, industry-specific incident management system built with Next.js 14, TypeScript, and Mock Service Worker (MSW) for complete frontend prototyping.

## 🎯 Overview

This frontend application provides a complete incident management solution for **Mining**, **Healthcare**, and **Retail** industries with:

- ✅ **64 Industry-Specific Categories** with custom fields
- ✅ **3 Reporting Methods**: Anonymous, Guest, and Authenticated
- ✅ **Complete RBAC System**: 6 user roles with permissions
- ✅ **4-Level Escalation Workflow**: From auto-approved to executive approval
- ✅ **Real-time Updates**: Notifications and status tracking
- ✅ **100% Free Stack**: No proprietary or limited tools

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Git** for version control

### Installation

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# Visit http://localhost:3000
```

That's it! The Mock Service Worker (MSW) will automatically handle all API calls.

### Demo Credentials

**Super Admin**
- Email: `admin@example.com`
- Password: `password`

**Manager**
- Email: `manager@example.com`
- Password: `password`

**Reviewer**
- Email: `reviewer@example.com`
- Password: `password`

**Regular User**
- Email: `user@example.com`
- Password: `password`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                      # Next.js 14 App Router
│   │   ├── auth/                # Authentication pages
│   │   │   ├── login/           # Login page
│   │   │   └── register/        # Registration page
│   │   ├── dashboard/           # Protected dashboard routes
│   │   │   ├── incidents/       # Incident list & detail
│   │   │   ├── report/          # Authenticated reporting
│   │   │   ├── approvals/       # Approval queues (planned)
│   │   │   ├── analytics/       # Analytics dashboard (planned)
│   │   │   └── page.tsx         # Dashboard home
│   │   ├── report/              # Public reporting
│   │   │   ├── anonymous/       # Anonymous reporting flow
│   │   │   └── guest/           # Guest reporting flow
│   │   ├── track/               # Public incident tracking
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   └── providers.tsx        # App providers (MSW init)
│   ├── components/
│   │   ├── ui/                  # Reusable UI components
│   │   │   ├── Button.tsx       # 6 variants
│   │   │   ├── Input.tsx        # Input, Textarea, Select
│   │   │   ├── Badge.tsx        # 6 variants
│   │   │   ├── Alert.tsx        # 4 variants
│   │   │   ├── Card.tsx         # Card components
│   │   │   └── Spinner.tsx      # Loading states
│   │   ├── layout/              # Layout components
│   │   │   ├── DashboardHeader.tsx   # Header with notifications
│   │   │   ├── DashboardSidebar.tsx  # Role-based sidebar
│   │   │   ├── DashboardLayout.tsx   # Combined layout
│   │   │   └── ProtectedRoute.tsx    # Auth guard
│   │   └── forms/
│   │       └── DynamicIncidentForm.tsx  # Universal form for all categories
│   ├── lib/
│   │   ├── categories.ts        # All 64 incident categories
│   │   ├── constants.ts         # App constants & configs
│   │   └── utils.ts             # Utility functions
│   ├── mocks/
│   │   ├── browser.ts           # MSW browser setup
│   │   ├── data.ts              # Mock database
│   │   └── handlers/            # API endpoint handlers
│   │       ├── auth.ts          # Authentication APIs
│   │       ├── incidents.ts     # Incident CRUD APIs
│   │       ├── approvals.ts     # Approval workflow APIs
│   │       ├── notifications.ts # Notification APIs
│   │       └── users.ts         # User management APIs
│   ├── stores/
│   │   ├── authStore.ts         # Authentication state
│   │   ├── incidentStore.ts     # Incident management state
│   │   └── notificationStore.ts # Notifications state
│   └── types/
│       └── index.ts             # TypeScript definitions
├── public/                      # Static assets
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── tailwind.config.js           # Tailwind CSS config
└── next.config.js               # Next.js config
```

## 🏭 Industry-Specific Categories

### Mining (22 Categories)
- Underground Equipment Fire
- Haul Truck Collision
- Chemical Spill
- Confined Space Incident
- Electrical Shock
- Near Miss Event
- Environmental Discharge
- Equipment Malfunction
- Ground Fall/Rockfall
- Explosion/Detonation
- Ventilation Failure
- Conveyor Belt Incident
- Crush Injury
- Drowning/Water Inrush
- Radiation Exposure
- Heat Stress/Exhaustion
- Noise Exposure
- Ergonomic Injury
- Inhalation/Dust Exposure
- Mobile Equipment Fire
- Structural Collapse
- Mobile Equipment Incident

### Healthcare (20 Categories)
- Medication Administration Error
- Patient Fall
- Wrong Site/Procedure Surgery
- Healthcare Associated Infection
- Medical Device Malfunction
- Patient Identification Error
- Pressure Injury/Ulcer
- Patient Elopement
- Laboratory Error
- Blood Transfusion Reaction
- Restraint-Related Injury
- Specimen Loss/Mislabeling
- Maternal/Fetal Event
- Delayed Diagnosis
- Consent Violation
- Patient Burn Injury
- Workplace Violence
- Equipment Contamination
- Neonatal Incident
- Anesthesia Complication

### Retail (20 Categories)
- Customer Slip/Trip/Fall
- Shoplifting/Theft
- Cash Discrepancy
- Equipment Malfunction
- Food Safety Violation
- Workplace Violence
- Fire/Emergency Evacuation
- Product Recall
- Parking Lot Incident
- Employee Injury
- Customer Complaint
- Chemical Spill
- Power Outage
- Data Breach/POS Issue
- Vendor/Delivery Incident
- Product Tampering
- Suspicious Activity
- Price/Scanning Error
- Emergency Exit Blocked
- Underage Sale Attempt

## 🎨 Features

### Authentication & Authorization
- User registration with organization setup
- Login with email/password
- Role-based access control (RBAC)
- Protected routes with automatic redirects
- Session persistence

### Incident Reporting
**Anonymous Reporting**
- No personal information required
- Generates tracking ID for status checks
- Complete privacy and confidentiality

**Guest Reporting**
- Provide contact details for follow-up
- Receive email updates (simulated)
- Tracking ID + email verification

**Authenticated Reporting**
- Full dashboard access
- Real-time notifications
- Incident history tracking
- Comment and collaborate

### Dynamic Forms
- Industry selection (Mining, Healthcare, Retail)
- Category selection (64 options total)
- Auto-generated custom fields based on category
- Field types: text, textarea, email, phone, number, date, select, boolean
- Real-time validation with error messages
- Location information capture

### Incident Management
- List view with filters (status, severity, search)
- Pagination for large datasets
- Detailed incident view with timeline
- Status management workflow
- Comment system
- Role-based actions

### Dashboard
- Statistics overview (total, open, critical, pending approval)
- Recent incidents feed
- Recent notifications
- Quick action buttons
- Role-based navigation

## 🔐 User Roles & Permissions

### Super Admin
- Full system access
- Manage all organizations
- Create/edit/delete users
- View all incidents across organizations
- Approve level 4 escalations

### Admin
- Manage organization settings
- Create/edit users in organization
- View all org incidents
- Approve level 3 & 4 escalations
- Access analytics

### Manager
- View org incidents
- Assign incidents
- Approve level 2 & 3 escalations
- Access team reports

### Reviewer
- Review incident details
- Add comments
- View assigned incidents
- No approval rights

### User
- Report incidents
- View own incidents
- Add comments
- Track status

### Reporter
- Report incidents only
- Limited dashboard access

## 📊 Escalation Levels

### Level 1: Auto Approved
- No manual approval required
- Immediate processing
- Low-risk categories

### Level 2: Manager Approval
- Requires manager review
- 24-hour timeout
- Medium-risk categories

### Level 3: Senior Manager
- Requires admin/manager approval
- 12-hour timeout
- High-risk categories

### Level 4: Executive
- Requires super admin approval
- 4-hour timeout
- Critical incidents (fires, explosions, serious injuries)

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Custom Design System** - Consistent colors and components

### State Management
- **Zustand** - Lightweight state management
- **Persistent Storage** - Auth token persistence

### API Mocking
- **Mock Service Worker (MSW)** - Complete API simulation
- **In-memory Database** - Realistic data operations

### Form Handling
- **React Hook Form** - Form state management (ready to use)
- **Zod** - Schema validation (ready to use)

### Data Visualization
- **Recharts** - Charts and graphs (dependency included, implementation planned)

### Icons & UI
- **Lucide React** - Icon library (dependency included)
- **Heroicons** - Additional icons (via Tailwind)

## 🧪 Development Workflow

### Running Development Server

```bash
npm run dev
```

Access at: http://localhost:3000

### Building for Production

```bash
npm run build
npm start
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## 📝 Adding a New Incident Category

1. **Open** `src/lib/categories.ts`

2. **Add your category** to the appropriate industry array:

```typescript
{
  id: 'unique_category_id',
  name: 'Category Display Name',
  description: 'Brief description',
  type: 'mining', // or 'healthcare' or 'retail'
  requiresApproval: true, // Does it need approval?
  defaultSeverity: 'high', // low, medium, high, critical
  escalationLevel: 'level_3', // level_1 through level_4
  requiredFields: ['field_id_1', 'field_id_2'], // IDs of required custom fields
  customFields: [
    {
      id: 'field_id_1',
      name: 'Field Display Name',
      type: 'text', // text, textarea, email, phone, number, date, select, boolean
      required: true,
      placeholder: 'Enter value...',
      helpText: 'Helper text for users',
      validation: {
        min: 0, // For numbers
        max: 100,
        pattern: '^[A-Z]+$', // Regex pattern
        message: 'Custom error message'
      }
    },
    // Add more custom fields...
  ]
}
```

3. **Save** - The form will automatically render your new category!

## 🎯 Mock Service Worker (MSW)

MSW intercepts API requests and provides realistic responses without a backend.

### How It Works

1. **Browser Setup** - `src/mocks/browser.ts` initializes MSW
2. **Handlers** - `src/mocks/handlers/` define API endpoints
3. **Mock Data** - `src/mocks/data.ts` stores in-memory data
4. **Automatic Init** - Starts automatically in development

### Available Endpoints

**Authentication**
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `POST /auth/refresh` - Refresh token

**Incidents**
- `GET /incidents` - List incidents with filters
- `GET /incidents/:id` - Get single incident
- `POST /incidents` - Create incident
- `PATCH /incidents/:id` - Update incident
- `DELETE /incidents/:id` - Delete incident
- `POST /incidents/:id/comments` - Add comment

**Categories**
- `GET /categories` - List all categories
- `GET /categories/:id` - Get single category

**Approvals**
- `GET /approvals` - List approval requests
- `POST /approvals` - Create approval request
- `POST /approvals/:id/approve` - Approve
- `POST /approvals/:id/reject` - Reject

**Notifications**
- `GET /notifications` - List notifications
- `GET /notifications/unread-count` - Get unread count
- `PATCH /notifications/:id/read` - Mark as read
- `POST /notifications/mark-all-read` - Mark all as read

**Users**
- `GET /users` - List users
- `GET /users/:id` - Get user
- `POST /users` - Create user
- `PATCH /users/:id` - Update user

## 🐛 Troubleshooting

### MSW Not Working

**Symptom**: API calls fail with "network error"

**Solution**:
1. Check browser console for MSW initialization message
2. Ensure you're in development mode (`npm run dev`)
3. Clear browser cache and reload

### Module Not Found Errors

**Symptom**: Import errors after installation

**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

**Symptom**: Type errors in IDE

**Solution**:
```bash
# Restart TypeScript server
# In VS Code: Cmd+Shift+P > "TypeScript: Restart TS Server"

# Or run type check
npm run type-check
```

### Port Already in Use

**Symptom**: "Port 3000 is already in use"

**Solution**:
```bash
# Kill process on port 3000
# Mac/Linux:
lsof -ti:3000 | xargs kill

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## 📚 Common Tasks

### Change Default Port

Edit `package.json`:
```json
{
  "scripts": {
    "dev": "next dev -p 3001"
  }
}
```

### Add Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

### Customize Theme Colors

Edit `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          // ... customize colors
        }
      }
    }
  }
}
```

## 🔮 Next Steps (Planned Features)

- [ ] **Approval Queues Page** - Manager/admin approval interface
- [ ] **Analytics Dashboard** - Charts and statistics with Recharts
- [ ] **Notification Center** - Full notification management page
- [ ] **File Upload** - Attach documents with virus scan simulation
- [ ] **User Management Page** - Admin user CRUD interface
- [ ] **Settings Page** - User profile and org settings
- [ ] **Export Reports** - Download incident data as CSV/PDF
- [ ] **Email Notifications** - Integration with MailHog
- [ ] **Advanced Search** - Full-text search with filters
- [ ] **Mobile App** - React Native version

## 📖 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [MSW Documentation](https://mswjs.io/)
- [Zustand Guide](https://github.com/pmndrs/zustand)

## 🤝 Support

For questions or issues:
1. Check this README
2. Review the code comments
3. Check browser console for errors
4. Ask your team lead

## 📄 License

This project uses 100% free and open-source technologies:
- Next.js (MIT License)
- React (MIT License)
- TypeScript (Apache 2.0)
- Tailwind CSS (MIT License)
- MSW (MIT License)
- Zustand (MIT License)

---

**Built with ❤️ for Mining, Healthcare, and Retail incident management**
