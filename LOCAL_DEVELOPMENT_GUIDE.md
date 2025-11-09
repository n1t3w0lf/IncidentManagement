# 🚀 Local Development Guide

**Complete step-by-step guide for running the Incident Management System on your laptop**

This guide is written for developers and support staff with **any skill level**. No prior Docker or microservices experience required!

---

## 📋 Table of Contents

1. [System Requirements](#system-requirements)
2. [Quick Start (5 Minutes)](#quick-start-5-minutes)
3. [Detailed Setup Guide](#detailed-setup-guide)
4. [Daily Development Workflow](#daily-development-workflow)
5. [Accessing the Application](#accessing-the-application)
6. [Common Tasks](#common-tasks)
7. [Troubleshooting](#troubleshooting)
8. [Getting Help](#getting-help)

---

## 💻 System Requirements

### Minimum Requirements
- **RAM**: 8GB (16GB recommended)
- **Disk Space**: 20GB free
- **Operating System**:
  - Windows 10/11 with WSL2
  - macOS 10.15+ (Catalina or newer)
  - Linux (Ubuntu 20.04+, Fedora, etc.)

### Required Software
- **Docker Desktop** (for Windows/Mac) or **Docker Engine** (for Linux)
- **Git** (for downloading the code)
- **Text Editor** (VS Code recommended, but any will work)

### Don't have these installed? See [Installation Guide](#software-installation) below.

---

## 🚀 Quick Start (5 Minutes)

If you already have Docker and Git installed, run these commands:

```bash
# 1. Download the code
git clone <repository-url>
cd IncidentManagement

# 2. Copy environment file (no changes needed!)
cp .env.local .env

# 3. Start everything
docker-compose -f docker-compose.local.yml up -d

# 4. Wait 1-2 minutes for everything to start, then open:
# http://localhost:3000
```

That's it! The application should now be running.

---

## 📖 Detailed Setup Guide

### Step 1: Install Required Software

#### Option A: Windows

1. **Install WSL2** (if not already installed):
   ```powershell
   # Open PowerShell as Administrator and run:
   wsl --install
   # Restart your computer
   ```

2. **Install Docker Desktop**:
   - Download from: https://www.docker.com/products/docker-desktop
   - Run the installer
   - Follow the setup wizard
   - Ensure "Use WSL 2 instead of Hyper-V" is checked
   - Restart your computer

3. **Install Git**:
   - Download from: https://git-scm.com/download/win
   - Run the installer with default settings

#### Option B: macOS

```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Docker Desktop
brew install --cask docker

# Install Git
brew install git

# Start Docker Desktop from Applications folder
```

#### Option C: Linux (Ubuntu/Debian)

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group (no sudo needed)
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo apt-get update
sudo apt-get install docker-compose-plugin

# Install Git
sudo apt-get install git
```

### Step 2: Verify Installation

Open a terminal/command prompt and run:

```bash
# Check Docker
docker --version
# Should show: Docker version 24.0.x or higher

# Check Docker Compose
docker-compose --version
# Should show: Docker Compose version 2.x or higher

# Check Git
git --version
# Should show: git version 2.x or higher
```

If any of these fail, please see [Troubleshooting](#troubleshooting) section.

### Step 3: Download the Project

```bash
# Navigate to where you want to store the project
# For example:
cd ~/Projects        # macOS/Linux
cd C:\Projects       # Windows

# Clone the repository
git clone <repository-url>

# Enter the project directory
cd IncidentManagement

# Verify you're in the right place
ls -la  # macOS/Linux
dir     # Windows

# You should see files like: docker-compose.local.yml, README.md, etc.
```

### Step 4: Configure Environment

```bash
# Copy the local development configuration
cp .env.local .env

# Optional: Open .env to see the settings (you don't need to change anything)
# The defaults are perfect for local development!
```

**What's in the .env file?**
- Database passwords (simple ones for local dev)
- JWT secrets (for authentication)
- Service URLs (automatically set by Docker)

You can use it as-is without any changes!

### Step 5: Start the Application

```bash
# Start all services (this will take 2-5 minutes the first time)
docker-compose -f docker-compose.local.yml up -d

# What's happening?
# - Docker downloads required images (one-time, ~2GB)
# - Builds your application services
# - Starts databases, cache, message queue, etc.
# - Starts the frontend and backend services
```

**First-time setup takes longer!** Docker needs to download images. Subsequent starts take only 10-30 seconds.

### Step 6: Verify Everything Started

```bash
# Check if all services are running
docker-compose -f docker-compose.local.yml ps

# You should see all services with status "Up" or "Up (healthy)"
# If any service shows "Exit" or "Restarting", see Troubleshooting section
```

### Step 7: Access the Application

Open your web browser and go to:
- **Main Application**: http://localhost:3000
- **RabbitMQ Admin**: http://localhost:15672 (user: guest, pass: guest)
- **MinIO Console**: http://localhost:9001 (user: minioadmin, pass: minioadmin)
- **Email Catcher**: http://localhost:8025 (to see test emails)
- **OpenSearch Dashboards**: http://localhost:5601 (search analytics)

**You should see the login/registration page!**

---

## 💼 Daily Development Workflow

### Starting Your Work Day

```bash
# Navigate to project
cd IncidentManagement

# Start all services
docker-compose -f docker-compose.local.yml up -d

# Wait 30 seconds for everything to start
# Open http://localhost:3000
```

### Making Code Changes

The system supports **hot reload** - your changes appear automatically!

1. Edit files in your code editor (VS Code, etc.)
2. Save the file
3. Refresh your browser - changes appear automatically!

**No need to restart Docker!**

### Stopping for the Day

```bash
# Stop all services (saves resources)
docker-compose -f docker-compose.local.yml stop

# Your data is preserved! Next time you start, everything is still there.
```

### Complete Reset (Fresh Start)

```bash
# Stop and remove everything (including data)
docker-compose -f docker-compose.local.yml down -v

# Start fresh
docker-compose -f docker-compose.local.yml up -d

# This deletes all database data, uploaded files, etc.
# Use this if things get messed up!
```

---

## 🔍 Accessing the Application

### Main Interfaces

| Service | URL | Username | Password | Purpose |
|---------|-----|----------|----------|---------|
| **Frontend** | http://localhost:3000 | (create account) | - | Main application |
| **API Gateway** | http://localhost:4000/health | - | - | Backend API |
| **RabbitMQ** | http://localhost:15672 | guest | guest | Message queue admin |
| **MinIO** | http://localhost:9001 | minioadmin | minioadmin | File storage admin |
| **MailHog** | http://localhost:8025 | - | - | Test email inbox |
| **OpenSearch** | http://localhost:5601 | - | - | Search analytics |

### First Time Setup

1. Open http://localhost:3000
2. Click "Register" or "Create Account"
3. Fill in your details:
   - Email: `test@example.com`
   - Password: `password123` (or anything 8+ characters)
   - Organization: `My Test Company`
   - Organization Type: Choose one (Corporate, Healthcare, Mining)
4. Click "Create Account"
5. You're now logged in!

### Testing Features

**Create an Anonymous Report:**
1. Go to homepage
2. Click "Report Anonymously"
3. Fill out the incident form
4. Submit
5. Save the tracking ID!

**Track Your Report:**
1. Go to "Track Incident"
2. Enter your tracking ID
3. See the status

**View Test Emails:**
1. Go to http://localhost:8025
2. See all emails sent by the system
3. No real emails are sent in local development!

---

## 🛠️ Common Tasks

### Viewing Logs

```bash
# View logs from all services
docker-compose -f docker-compose.local.yml logs -f

# View logs from specific service
docker-compose -f docker-compose.local.yml logs -f frontend
docker-compose -f docker-compose.local.yml logs -f incident-service

# View last 100 lines
docker-compose -f docker-compose.local.yml logs --tail=100

# Stop viewing logs: Press Ctrl+C
```

### Restarting a Service

```bash
# Restart frontend
docker-compose -f docker-compose.local.yml restart frontend

# Restart database
docker-compose -f docker-compose.local.yml restart postgres-auth
```

### Accessing Database

```bash
# Connect to auth database
docker-compose -f docker-compose.local.yml exec postgres-auth psql -U ims_user -d auth_db

# Inside PostgreSQL:
\dt              # List tables
SELECT * FROM users;  # View users
\q               # Quit
```

### Viewing Resource Usage

```bash
# See CPU/Memory usage
docker stats

# Press Ctrl+C to stop
```

### Cleaning Up Disk Space

```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything not running (CAREFUL!)
docker system prune -a
```

### Updating Code

```bash
# Pull latest changes
git pull

# Rebuild services
docker-compose -f docker-compose.local.yml build

# Restart with new code
docker-compose -f docker-compose.local.yml up -d
```

---

## 🚨 Troubleshooting

### Problem: "Port already in use"

**Error**: `Bind for 0.0.0.0:3000 failed: port is already allocated`

**Solution**:
```bash
# Find what's using the port (example for port 3000)
# On macOS/Linux:
lsof -i :3000

# On Windows:
netstat -ano | findstr :3000

# Kill the process or change the port in docker-compose.local.yml
```

### Problem: "Cannot connect to Docker daemon"

**Error**: `Cannot connect to the Docker daemon`

**Solution**:
1. Make sure Docker Desktop is running (look for whale icon in system tray)
2. On Linux, ensure Docker service is running:
   ```bash
   sudo systemctl start docker
   ```

### Problem: Services won't start

**Error**: Container exits immediately

**Solution**:
```bash
# Check logs for the failing service
docker-compose -f docker-compose.local.yml logs <service-name>

# Common fixes:
# 1. Make sure .env file exists
cp .env.local .env

# 2. Remove and recreate
docker-compose -f docker-compose.local.yml down
docker-compose -f docker-compose.local.yml up -d

# 3. Complete reset
docker-compose -f docker-compose.local.yml down -v
docker-compose -f docker-compose.local.yml up -d
```

### Problem: Out of memory

**Error**: `Cannot allocate memory`

**Solution**:

**Docker Desktop (Windows/Mac)**:
1. Open Docker Desktop
2. Go to Settings → Resources
3. Increase Memory to 8GB or more
4. Click "Apply & Restart"

**Linux**:
```bash
# Check available memory
free -h

# Close other applications
# Or add more RAM to your system
```

### Problem: Slow performance

**Solution**:
1. **Increase Docker resources** (Settings → Resources → 4 CPUs, 8GB RAM)
2. **Restart Docker Desktop** (sometimes helps)
3. **Close unused applications**
4. **Run fewer services at once**:
   ```bash
   # Start only essential services
   docker-compose -f docker-compose.local.yml up -d \
     postgres-auth postgres-incidents \
     redis opensearch rabbitmq \
     api-gateway auth-service incident-service frontend
   ```

### Problem: Database connection errors

**Error**: `Connection refused` or `Could not connect to database`

**Solution**:
```bash
# Wait for database to be ready (takes 10-30 seconds)
# Check if database is running
docker-compose -f docker-compose.local.yml ps postgres-auth

# Restart database
docker-compose -f docker-compose.local.yml restart postgres-auth

# Check database logs
docker-compose -f docker-compose.local.yml logs postgres-auth
```

### Problem: Changes don't appear

**Issue**: Code changes not showing in browser

**Solution**:
1. **Hard refresh browser**: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
2. **Clear browser cache**: Settings → Privacy → Clear browsing data
3. **Restart the service**:
   ```bash
   docker-compose -f docker-compose.local.yml restart frontend
   ```

### Problem: "npm install" errors in logs

**Error**: `npm ERR!` in logs

**Solution**:
```bash
# Rebuild the service
docker-compose -f docker-compose.local.yml build --no-cache frontend

# Restart
docker-compose -f docker-compose.local.yml up -d frontend
```

---

## 📞 Getting Help

### Self-Help Resources

1. **Check logs first**:
   ```bash
   docker-compose -f docker-compose.local.yml logs -f
   ```

2. **Verify all services are running**:
   ```bash
   docker-compose -f docker-compose.local.yml ps
   ```

3. **Try a fresh start**:
   ```bash
   docker-compose -f docker-compose.local.yml down -v
   docker-compose -f docker-compose.local.yml up -d
   ```

### Common Questions

**Q: How much disk space does this use?**
A: About 5-10GB total (Docker images + data)

**Q: Can I run this without internet?**
A: Yes! After first setup, everything runs offline.

**Q: How do I stop using so much RAM?**
A: Stop services when not using: `docker-compose -f docker-compose.local.yml stop`

**Q: Where is my data stored?**
A: In Docker volumes. Run `docker volume ls` to see them.

**Q: How do I backup my data?**
A: See the "Database Management" section in [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

**Q: Can multiple developers run this at the same time?**
A: Yes! Each developer runs their own local copy.

**Q: Do I need to be connected to a network?**
A: After initial setup, you can work completely offline.

---

## ✅ Success Checklist

After setup, verify:

- [ ] Docker Desktop is running
- [ ] All services show "Up" status: `docker-compose -f docker-compose.local.yml ps`
- [ ] Frontend loads: http://localhost:3000
- [ ] Can create account and login
- [ ] Can submit an incident report
- [ ] Can view emails at http://localhost:8025

**All green? You're ready to develop!** 🎉

---

## 🚀 Next Steps

Now that you have the system running:

1. **Explore the Features**:
   - Try anonymous reporting
   - Create guest reports
   - Test file uploads
   - View RabbitMQ messages

2. **Start Development**:
   - Make code changes
   - See changes appear instantly
   - Check logs for errors

3. **Learn the Architecture**:
   - Read [MICROSERVICES_ARCHITECTURE.md](./MICROSERVICES_ARCHITECTURE.md)
   - Understand how services communicate
   - Explore the industry use cases

4. **Customize for Your Needs**:
   - Add new incident categories
   - Modify workflows
   - Change branding/colors

---

## 📚 Additional Resources

- **Full Documentation**: [README.md](./README.md)
- **Deployment Guide**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Architecture Details**: [MICROSERVICES_ARCHITECTURE.md](./MICROSERVICES_ARCHITECTURE.md)
- **Docker Docs**: https://docs.docker.com/get-started/
- **Docker Compose Docs**: https://docs.docker.com/compose/

---

**Happy Coding! 🎉**

If you get stuck, remember: most problems can be solved with a fresh restart!

```bash
docker-compose -f docker-compose.local.yml down -v && docker-compose -f docker-compose.local.yml up -d
```
