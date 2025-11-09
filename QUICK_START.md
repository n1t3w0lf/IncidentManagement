# ⚡ Quick Start Guide

**Get the Incident Management System running on your laptop in 5 minutes!**

---

## 🎯 For Complete Beginners

### What You Need
- A laptop with 8GB RAM
- 20GB free disk space
- Internet connection (for first-time setup only)

### What You'll Get
- A complete incident management system
- Running on YOUR laptop
- No cloud services needed
- 100% free and open source

---

## 📥 Step 1: Install Docker Desktop

### Windows
1. Download Docker Desktop: https://www.docker.com/products/docker-desktop
2. Double-click the installer
3. Follow the installation wizard (use all default settings)
4. Restart your computer
5. Look for the Docker whale icon in your system tray (bottom-right)

### Mac
1. Download Docker Desktop for Mac: https://www.docker.com/products/docker-desktop
2. Drag Docker.app to Applications folder
3. Open Docker from Applications
4. Wait for the whale icon to appear in the menu bar (top-right)

### Linux (Ubuntu)
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker
```

**How do I know if it's working?**
- Open Terminal (Mac/Linux) or PowerShell (Windows)
- Type: `docker --version`
- You should see: `Docker version 24.x.x` or similar

---

## 📥 Step 2: Download the Project

### Easy Way (Using Git)
```bash
# Open Terminal/PowerShell and run:
git clone <repository-url>
cd IncidentManagement
```

### Alternative Way (Without Git)
1. Download ZIP from GitHub
2. Extract to a folder (e.g., `C:\Projects\IncidentManagement` or `~/Projects/IncidentManagement`)
3. Open Terminal/PowerShell in that folder

---

## 🚀 Step 3: Start Everything

### On Windows
1. Double-click `start.bat`
2. Wait 1-2 minutes
3. Done!

### On Mac/Linux
```bash
./start.sh
```

**That's it!** The system is now starting.

---

## 🌐 Step 4: Open the Application

After 1-2 minutes, open your web browser and go to:

```
http://localhost:3000
```

You should see the login/registration page!

---

## 👤 Step 5: Create an Account

1. Click "Create Account" or "Register"
2. Fill in:
   - **Email**: Use any email (it won't be sent anywhere)
   - **Password**: At least 8 characters
   - **First Name**: Your first name
   - **Last Name**: Your last name
   - **Organization Name**: Your company name
   - **Organization Type**: Choose one:
     - Corporate/IT (general business)
     - Healthcare (hospitals, clinics)
     - Mining (industrial operations)
3. Click "Create Account"
4. You're in!

---

## ✅ What's Running Now?

Your laptop is now running:
- **Frontend** (the website you see)
- **10 Backend Services** (handling data, files, notifications, etc.)
- **7 Databases** (storing your data)
- **Search Engine** (for finding incidents quickly)
- **Message Queue** (for notifications)
- **File Storage** (for attachments)
- **Email Catcher** (for testing emails)

**All of this is running on YOUR laptop - no cloud needed!**

---

## 🎮 Try These Features

### Report an Incident (Anonymous)
1. Go to home page
2. Click "Report Anonymously"
3. Fill out the form
4. Click Submit
5. Save your tracking ID!

### Track an Incident
1. Click "Track Incident"
2. Enter your tracking ID
3. See the status

### View Test Emails
1. Open http://localhost:8025
2. See all "sent" emails (they're not really sent, just caught for testing)

### Explore Admin Panels
- **RabbitMQ**: http://localhost:15672 (username: `guest`, password: `guest`)
- **MinIO**: http://localhost:9001 (username: `minioadmin`, password: `minioadmin`)

---

## 🛑 When You're Done

### Stop Everything (Save Data)
**Windows**: Double-click `stop.bat`

**Mac/Linux**:
```bash
./stop.sh
```

Your data is saved! When you start again, everything is still there.

### Start Again Tomorrow
Just run `start.bat` (Windows) or `./start.sh` (Mac/Linux)

---

## 🔥 Start Fresh (Delete Everything)

**Windows**: Double-click `reset.bat`

**Mac/Linux**:
```bash
./reset.sh
```

This deletes all data and gives you a clean start.

---

## 📊 Check If Everything Is Working

### See What's Running
**Windows**: Double-click `status.bat`

**Mac/Linux**:
```bash
./status.sh
```

You should see all services with status "Up"

### View Logs (See What's Happening)
**Windows**: Double-click `logs.bat`

**Mac/Linux**:
```bash
./logs.sh
```

Press `Ctrl+C` to stop viewing logs.

---

## 🚨 Something Went Wrong?

### Quick Fixes

**Problem: Port already in use**
- Close any programs using port 3000 (like other web servers)
- Or restart your computer

**Problem: Docker not running**
- Make sure Docker Desktop is running (look for whale icon)
- On Windows/Mac: Open Docker Desktop manually
- On Linux: `sudo systemctl start docker`

**Problem: Services won't start**
1. Try resetting: `./reset.sh` (Mac/Linux) or `reset.bat` (Windows)
2. Then start fresh: `./start.sh` or `start.bat`

**Problem: Browser shows error**
- Wait 2-3 minutes for everything to start
- Refresh the page (F5)
- Clear browser cache (Ctrl+Shift+Delete)

**Still having issues?**
- See [LOCAL_DEVELOPMENT_GUIDE.md](./LOCAL_DEVELOPMENT_GUIDE.md) for detailed troubleshooting

---

## 💡 Tips

### Save Resources
When not using the system:
```bash
./stop.sh    # Mac/Linux
stop.bat     # Windows
```

This stops services and frees up RAM/CPU.

### See What's Using Disk Space
```bash
docker system df
```

### Clean Up Old Data
```bash
docker system prune -a
```
(This removes old unused images to free disk space)

---

## 🎓 Next Steps

Now that you have it running:

1. **Explore Features**:
   - Create incidents
   - Upload files
   - Test notifications
   - View dashboards

2. **Customize**:
   - Add your company logo
   - Change colors
   - Add custom incident categories

3. **Learn More**:
   - Read [LOCAL_DEVELOPMENT_GUIDE.md](./LOCAL_DEVELOPMENT_GUIDE.md)
   - Check [MICROSERVICES_ARCHITECTURE.md](./MICROSERVICES_ARCHITECTURE.md)
   - Explore industry use cases in `AppReq/` folder

---

## ❓ Common Questions

**Q: Do I need internet?**
A: Only for first setup. After that, works offline!

**Q: Is this really free?**
A: Yes! 100% free and open source.

**Q: Can I use this for my company?**
A: Yes! No restrictions.

**Q: How much data can it store?**
A: Limited only by your hard drive space.

**Q: Can multiple people use it?**
A: Yes! Each person runs their own copy on their laptop.

**Q: Will this slow down my computer?**
A: Uses about 4-6GB RAM when running. Stop it when not in use.

**Q: Can I customize it?**
A: Yes! All code is available and editable.

---

## 🎉 Success!

If you can:
- ✅ Open http://localhost:3000
- ✅ Create an account
- ✅ Submit an incident

**You're all set!** 🚀

---

## 📞 Need Help?

- **Full Documentation**: [LOCAL_DEVELOPMENT_GUIDE.md](./LOCAL_DEVELOPMENT_GUIDE.md)
- **Architecture Details**: [MICROSERVICES_ARCHITECTURE.md](./MICROSERVICES_ARCHITECTURE.md)
- **Deployment Guide**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

**Made with ❤️ for developers of all skill levels**

Happy incident managing! 🎊
