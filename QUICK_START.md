# 🚀 Quick Start Guide - Pomodoro Timer

Get up and running with your Pomodoro Timer in 5 minutes!

---

## 📦 What You Have

Your project now includes:

```
PatrykPrezyna.github.io/
├── 📄 pomodoro.html          # Main Pomodoro timer page
├── 📄 index.html             # Your portfolio (with Pomodoro link added)
├── 📁 js/
│   └── pomodoro-app.js       # Timer application logic
├── 📁 assets/
│   ├── patryk.jpg            # Your profile image
│   └── sounds/               # (Empty - for future audio files)
├── 📄 README.md              # Project documentation
├── 📄 DEPLOYMENT_GUIDE.md    # Step-by-step Vercel deployment
├── 📄 TESTING_CHECKLIST.md   # Comprehensive testing guide
├── 📄 .gitignore             # Git ignore rules
└── 📄 vercel.json            # Vercel configuration
```

---

## ⚡ Instant Local Testing

### Option 1: Double-Click (Easiest)
1. Navigate to your project folder
2. Double-click `pomodoro.html`
3. It opens in your default browser
4. Start using the timer! 🎉

### Option 2: VS Code Live Server
1. Install "Live Server" extension in VS Code
2. Right-click `pomodoro.html`
3. Select "Open with Live Server"
4. Browser opens automatically

### Option 3: Python Server
```bash
# Python 3
python -m http.server 8000

# Then open: http://localhost:8000/pomodoro.html
```

---

## 🎮 How to Use

### Basic Usage

1. **Choose a Mode**
   - Click "Pomodoro" for 25-minute work session
   - Click "Short Break" for 5-minute break
   - Click "Long Break" for 15-minute break

2. **Start the Timer**
   - Click the "Start" button
   - Or click the timer display
   - Or press `Space` key

3. **Work/Rest**
   - Focus during Pomodoro
   - Relax during breaks
   - Timer will notify you when complete

4. **Track Progress**
   - See completed pomodoros in the progress bar
   - Work towards your daily goal

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Start/Pause timer |
| `R` | Reset timer |
| `S` | Skip to next session |
| `1` | Switch to Pomodoro |
| `2` | Switch to Short Break |
| `3` | Switch to Long Break |
| `,` | Open settings |
| `Esc` | Close settings |

---

## ⚙️ Customize Settings

1. Click the **⚙️ gear icon** (bottom-right)
2. Adjust timer durations
3. Enable/disable auto-start
4. Configure notifications
5. Set your daily goal
6. Click "Close" to save

**All settings are saved automatically!**

---

## 🌓 Dark Mode

Click the **🌙 moon icon** (top-right) to toggle dark mode.

Your preference is saved and persists across sessions.

---

## 🔔 Enable Notifications

### First Time Setup

1. Start a timer session
2. Browser will ask for notification permission
3. Click "Allow"
4. You'll now get notifications when timers complete!

### If You Missed It

1. Open Settings (⚙️)
2. Toggle "Browser Notifications"
3. Grant permission when prompted

---

## 📱 Mobile Usage

The timer works great on mobile devices:

- **Responsive design** adapts to your screen
- **Touch-friendly** controls
- **Works offline** after first load
- **Add to home screen** for app-like experience

### Add to Home Screen (iOS)

1. Open in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Tap "Add"

### Add to Home Screen (Android)

1. Open in Chrome
2. Tap the menu (⋮)
3. Select "Add to Home Screen"
4. Tap "Add"

---

## 🚀 Deploy to Vercel (5 Minutes)

### Prerequisites
- GitHub account
- Vercel account (free)

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_URL
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Deploy"
   - Done! 🎉

**For detailed instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**

---

## 🎯 Pomodoro Technique Tips

### The Classic Method

1. **Choose a task** you want to work on
2. **Set timer to 25 minutes** (1 Pomodoro)
3. **Work without interruption** until timer rings
4. **Take a 5-minute break**
5. **Repeat** steps 1-4
6. **After 4 Pomodoros**, take a 15-30 minute break

### Best Practices

✅ **Do:**
- Eliminate distractions before starting
- Focus on one task per Pomodoro
- Take breaks seriously (rest your mind)
- Track what you accomplish
- Adjust durations to fit your needs

❌ **Don't:**
- Check phone during Pomodoro
- Skip breaks (they're essential!)
- Multitask during focus time
- Work through fatigue
- Ignore the timer

---

## 🔧 Troubleshooting

### Timer Not Starting
- Check browser console (F12) for errors
- Ensure JavaScript is enabled
- Try refreshing the page

### Notifications Not Working
- Grant notification permission in browser settings
- Check if notifications are enabled in Settings (⚙️)
- Ensure browser supports notifications

### Settings Not Saving
- Check if localStorage is enabled
- Try a different browser
- Clear browser cache and try again

### Dark Mode Not Working
- Click the theme toggle (🌙/☀️)
- Check browser console for errors
- Try refreshing the page

---

## 📊 Features Overview

### ✅ Implemented Features

- ✅ Three timer modes (Pomodoro, Short Break, Long Break)
- ✅ Customizable timer durations
- ✅ Visual progress ring
- ✅ Audio notifications
- ✅ Browser notifications
- ✅ Progress tracking
- ✅ Daily goal setting
- ✅ Auto-start options
- ✅ Dark mode
- ✅ Keyboard shortcuts
- ✅ Responsive design
- ✅ Persistent settings
- ✅ Accessibility features

### 🎨 Design Features

- Clean, minimal interface
- Smooth animations
- Color-coded modes
- Mobile-optimized
- Touch-friendly controls
- High contrast support

---

## 📚 Learn More

- **Full Documentation**: [README.md](README.md)
- **Deployment Guide**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Testing Checklist**: [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)
- **Pomodoro Technique**: [Wikipedia](https://en.wikipedia.org/wiki/Pomodoro_Technique)

---

## 🆘 Need Help?

### Common Questions

**Q: Can I use this offline?**
A: Yes! After the first load, it works offline (except for CDN resources).

**Q: Where is my data stored?**
A: Locally in your browser's localStorage. It never leaves your device.

**Q: Can I customize the colors?**
A: Yes! Edit the CSS variables in `pomodoro.html` (lines 14-30).

**Q: Does it work on mobile?**
A: Absolutely! It's fully responsive and touch-optimized.

**Q: Can I add custom sounds?**
A: Yes! Add audio files to `assets/sounds/` and update the code.

---

## 🎉 You're Ready!

Your Pomodoro Timer is fully functional and ready to use.

**Next Steps:**
1. ✅ Test it locally (open `pomodoro.html`)
2. ✅ Customize settings to your preference
3. ✅ Deploy to Vercel (optional)
4. ✅ Start being productive!

---

**Happy Focusing! 🍅**

*Remember: The Pomodoro Technique is about working smarter, not harder.*