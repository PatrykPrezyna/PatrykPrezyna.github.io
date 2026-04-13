# 🚀 Pomodoro Timer - Vercel Deployment Guide

This guide will walk you through deploying your Pomodoro Timer application to Vercel, step by step. No prior deployment experience required!

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Prepare Your Project](#prepare-your-project)
3. [Create a GitHub Repository](#create-a-github-repository)
4. [Deploy to Vercel](#deploy-to-vercel)
5. [Configure Custom Domain (Optional)](#configure-custom-domain-optional)
6. [Troubleshooting](#troubleshooting)
7. [Updating Your Site](#updating-your-site)

---

## 1. Prerequisites

Before you begin, make sure you have:

- ✅ A GitHub account ([Sign up here](https://github.com/join))
- ✅ A Vercel account ([Sign up here](https://vercel.com/signup))
- ✅ Git installed on your computer ([Download here](https://git-scm.com/downloads))
- ✅ Your Pomodoro Timer files ready

**What you'll need:**
- `index.html` - Your main website
- `pomodoro.html` - The Pomodoro timer page
- `js/pomodoro-app.js` - The timer application logic
- `assets/` folder - Your images and assets

---

## 2. Prepare Your Project

### Step 2.1: Verify Your Files

Make sure your project structure looks like this:

```
PatrykPrezyna.github.io/
├── index.html
├── pomodoro.html
├── js/
│   └── pomodoro-app.js
└── assets/
    ├── patryk.jpg
    └── sounds/
```

### Step 2.2: Create a `.gitignore` File

Create a file named `.gitignore` in your project root to exclude unnecessary files:

```gitignore
# Operating System Files
.DS_Store
Thumbs.db

# Editor Files
.vscode/
.idea/
*.swp
*.swo

# Logs
*.log
npm-debug.log*

# Environment Variables
.env
.env.local
```

### Step 2.3: Create a `vercel.json` Configuration (Optional)

Create a `vercel.json` file in your project root for better routing:

```json
{
  "version": 2,
  "routes": [
    {
      "src": "/pomodoro",
      "dest": "/pomodoro.html"
    }
  ]
}
```

This allows users to access your Pomodoro timer at both `/pomodoro.html` and `/pomodoro`.

---

## 3. Create a GitHub Repository

### Step 3.1: Initialize Git Repository

Open your terminal/command prompt in your project directory and run:

```bash
# Initialize Git repository
git init

# Add all files to staging
git add .

# Create your first commit
git commit -m "Initial commit: Pomodoro Timer application"
```

### Step 3.2: Create GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the **"+"** icon in the top-right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `PatrykPrezyna.github.io` (or your preferred name)
   - **Description**: "Personal website with Pomodoro Timer"
   - **Visibility**: Public (recommended for GitHub Pages compatibility)
   - **DO NOT** initialize with README, .gitignore, or license (we already have files)
5. Click **"Create repository"**

### Step 3.3: Push Your Code to GitHub

GitHub will show you commands to push your code. Run these in your terminal:

```bash
# Add GitHub as remote origin (replace with your repository URL)
git remote add origin https://github.com/YOUR-USERNAME/PatrykPrezyna.github.io.git

# Rename branch to main (if needed)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

**Note:** Replace `YOUR-USERNAME` with your actual GitHub username.

---

## 4. Deploy to Vercel

### Step 4.1: Sign Up / Log In to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"** for easiest integration
4. Authorize Vercel to access your GitHub account

### Step 4.2: Import Your Project

1. On the Vercel dashboard, click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find your `PatrykPrezyna.github.io` repository
4. Click **"Import"**

### Step 4.3: Configure Your Project

Vercel will automatically detect your project settings:

**Framework Preset:** Other (or leave as detected)

**Build Settings:**
- **Build Command:** Leave empty (static site, no build needed)
- **Output Directory:** Leave empty (root directory)
- **Install Command:** Leave empty

**Root Directory:** `./` (default)

**Environment Variables:** None needed for this project

### Step 4.4: Deploy!

1. Review your settings
2. Click **"Deploy"**
3. Wait 30-60 seconds while Vercel deploys your site
4. 🎉 **Success!** Your site is now live!

Vercel will provide you with a URL like: `https://your-project-name.vercel.app`

---

## 5. Configure Custom Domain (Optional)

### Step 5.1: Add Your Domain to Vercel

1. In your Vercel project dashboard, go to **"Settings"** → **"Domains"**
2. Click **"Add"**
3. Enter your domain name (e.g., `patrykprezyna.com`)
4. Click **"Add"**

### Step 5.2: Configure DNS Settings

Vercel will provide you with DNS records to add. You'll need to add these to your domain registrar:

**For Root Domain (example.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For WWW Subdomain (www.example.com):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 5.3: Wait for DNS Propagation

- DNS changes can take 24-48 hours to propagate globally
- Vercel will automatically provision an SSL certificate
- Your site will be accessible via HTTPS once complete

---

## 6. Troubleshooting

### Issue: "Page Not Found" Error

**Solution:**
- Check that your `index.html` is in the root directory
- Verify file names are correct (case-sensitive on some systems)
- Check Vercel deployment logs for errors

### Issue: Pomodoro Timer Not Working

**Solution:**
- Open browser console (F12) to check for JavaScript errors
- Verify `js/pomodoro-app.js` path is correct
- Ensure Vue.js CDN is loading properly
- Check that all file paths are relative (no absolute paths)

### Issue: Dark Mode Not Persisting

**Solution:**
- This is expected behavior - localStorage works per domain
- Once deployed, dark mode preference will persist on your live site

### Issue: Notifications Not Working

**Solution:**
- Browser notifications require HTTPS (Vercel provides this automatically)
- Users must grant notification permission when prompted
- Check browser notification settings

### Issue: Custom Domain Not Working

**Solution:**
- Verify DNS records are correct
- Wait 24-48 hours for DNS propagation
- Use [DNS Checker](https://dnschecker.org) to verify propagation
- Contact your domain registrar if issues persist

---

## 7. Updating Your Site

### Making Changes

Whenever you want to update your site:

```bash
# 1. Make your changes to the files

# 2. Stage your changes
git add .

# 3. Commit your changes
git commit -m "Description of your changes"

# 4. Push to GitHub
git push origin main
```

**That's it!** Vercel automatically detects the push and redeploys your site within seconds.

### Viewing Deployment Status

1. Go to your Vercel dashboard
2. Click on your project
3. View the **"Deployments"** tab
4. See real-time deployment progress and logs

### Rolling Back

If something goes wrong:

1. Go to **"Deployments"** in Vercel
2. Find a previous successful deployment
3. Click the **"..."** menu
4. Select **"Promote to Production"**

---

## 🎯 Quick Reference Commands

```bash
# Check Git status
git status

# View commit history
git log --oneline

# Create a new branch for testing
git checkout -b feature-name

# Switch back to main branch
git checkout main

# Pull latest changes from GitHub
git pull origin main

# View remote repository URL
git remote -v
```

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Guides](https://guides.github.com)
- [Git Basics](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)
- [Vue.js Documentation](https://vuejs.org/guide/introduction.html)

---

## 🆘 Getting Help

If you encounter issues:

1. **Check Vercel Logs:** Project → Deployments → Click deployment → View logs
2. **Browser Console:** Press F12 to check for JavaScript errors
3. **Vercel Support:** [vercel.com/support](https://vercel.com/support)
4. **GitHub Issues:** Check if others have similar problems

---

## ✅ Deployment Checklist

Before going live, verify:

- [ ] All pages load correctly
- [ ] Pomodoro timer starts/stops properly
- [ ] Settings save and persist
- [ ] Notifications work (after granting permission)
- [ ] Dark mode toggles correctly
- [ ] Responsive design works on mobile
- [ ] All navigation links work
- [ ] No console errors in browser
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active (HTTPS)

---

## 🎉 Congratulations!

Your Pomodoro Timer is now live and accessible to the world! Share your URL with friends and colleagues.

**Your site is now:**
- ✅ Deployed on Vercel's global CDN
- ✅ Automatically HTTPS secured
- ✅ Auto-deploying on every Git push
- ✅ Backed up on GitHub
- ✅ Accessible worldwide

---

## 📝 Notes

- **Free Tier:** Vercel's free tier is generous and perfect for personal projects
- **Performance:** Your site is served from Vercel's global CDN for fast loading
- **Analytics:** Consider adding Vercel Analytics for visitor insights
- **Monitoring:** Vercel provides uptime monitoring and error tracking

---

**Need help?** Feel free to reach out or consult the resources above. Happy coding! 🚀