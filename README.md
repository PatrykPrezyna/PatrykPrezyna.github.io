# 🍅 Pomodoro Timer Application

A clean, feature-rich Pomodoro timer application inspired by [pomofocus.io](https://pomofocus.io/), built with Vue.js 3 and integrated into a personal portfolio website.

![Pomodoro Timer](https://img.shields.io/badge/Status-Production%20Ready-success)
![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?logo=vue.js)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## ✨ Features

### Core Functionality
- ⏱️ **Three Timer Modes**: Pomodoro (25 min), Short Break (5 min), Long Break (15 min)
- ▶️ **Intuitive Controls**: Start, Pause, Reset, and Skip buttons
- 🎨 **Visual Progress Ring**: Animated circular progress indicator
- 🔔 **Dual Notifications**: Browser notifications + audio alerts
- 📊 **Progress Tracking**: Daily completion counter with visual progress bar
- 💾 **Persistent Settings**: All preferences saved to localStorage

### Customization
- ⚙️ **Adjustable Durations**: Customize timer lengths for each mode
- 🔄 **Auto-start Options**: Automatically start breaks or pomodoros
- 🔊 **Volume Control**: Adjustable notification sound volume
- 🎯 **Daily Goals**: Set and track your daily pomodoro target
- 🌓 **Dark Mode**: Automatic theme switching with persistence

### User Experience
- 📱 **Fully Responsive**: Optimized for mobile, tablet, and desktop
- ⌨️ **Keyboard Shortcuts**: Quick access to all major functions
- ♿ **Accessible**: ARIA labels, keyboard navigation, screen reader support
- 🎭 **Smooth Animations**: Polished transitions and visual feedback
- 🌐 **No Build Required**: Pure HTML/CSS/JS with Vue.js CDN

---

## 🚀 Quick Start

### Option 1: Open Locally

1. Clone or download this repository
2. Open `pomodoro.html` in your web browser
3. Start being productive! 🎉

### Option 2: Deploy to Vercel

See the comprehensive [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for step-by-step instructions.

---

## 📁 Project Structure

```
PatrykPrezyna.github.io/
├── index.html              # Main portfolio website
├── pomodoro.html           # Pomodoro timer application
├── js/
│   └── pomodoro-app.js    # Vue.js application logic
├── assets/
│   ├── patryk.jpg         # Profile image
│   └── sounds/            # Audio notification files (optional)
├── DEPLOYMENT_GUIDE.md    # Vercel deployment instructions
└── README.md              # This file
```

---

## 🎮 Usage

### Basic Controls

**Mouse/Touch:**
- Click timer display to start/pause
- Use mode buttons to switch between Pomodoro/Breaks
- Click settings icon (⚙️) to customize

**Keyboard Shortcuts:**
- `Space` - Start/Pause timer
- `R` - Reset current timer
- `S` - Skip to next session
- `1` - Switch to Pomodoro mode
- `2` - Switch to Short Break
- `3` - Switch to Long Break
- `,` - Open settings
- `Esc` - Close settings modal

### Timer Workflow

1. **Start a Pomodoro**: Click "Pomodoro" mode and press Start
2. **Focus**: Work for 25 minutes (or your custom duration)
3. **Take a Break**: Timer automatically suggests a break
4. **Repeat**: After 4 pomodoros, take a long break
5. **Track Progress**: View your daily completion count

---

## ⚙️ Configuration

### Default Settings

```javascript
{
  pomodoroDuration: 25,        // minutes
  shortBreakDuration: 5,       // minutes
  longBreakDuration: 15,       // minutes
  autoStartBreaks: false,      // auto-start break timers
  autoStartPomodoros: false,   // auto-start pomodoro after break
  longBreakInterval: 4,        // pomodoros before long break
  notificationsEnabled: true,  // browser notifications
  soundEnabled: true,          // audio alerts
  volume: 50,                  // volume percentage (0-100)
  dailyGoal: 8                 // target pomodoros per day
}
```

All settings are customizable through the settings modal (⚙️ icon).

---

## 🛠️ Technical Details

### Technologies Used

- **Vue.js 3**: Reactive UI framework (CDN version)
- **Vanilla CSS**: Custom styling with CSS variables
- **LocalStorage API**: Persistent settings and progress
- **Notifications API**: Browser notifications
- **Web Audio API**: Sound generation for alerts
- **Page Visibility API**: Background tab handling

### Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Performance Features

- Efficient timer updates (100ms intervals)
- Minimal DOM manipulations
- Debounced settings saves
- Lazy-loaded audio
- Optimized re-renders

---

## 🎨 Design System

The application integrates seamlessly with the portfolio website's design system:

### Color Palette

**Pomodoro Mode:**
- Primary: `#D95550` (Red)
- Dark: `#C44742`

**Short Break Mode:**
- Primary: `#4C9F70` (Green)
- Dark: `#3D8A5C`

**Long Break Mode:**
- Primary: `#457CA3` (Blue)
- Dark: `#366A8C`

### Typography

- Font Family: Plus Jakarta Sans
- Responsive sizing with `clamp()`
- Optimized for readability

---

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 640px (stacked layout)
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile Optimizations

- Touch-friendly controls (48px minimum)
- Stacked mode selector
- Full-width buttons
- Optimized font sizes
- Reduced motion support

---

## ♿ Accessibility

### Features

- ✅ ARIA labels on all interactive elements
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Screen reader announcements
- ✅ High contrast mode support
- ✅ Reduced motion respect
- ✅ Semantic HTML structure

### WCAG Compliance

- Color contrast meets WCAG AA standards
- All functionality accessible via keyboard
- Proper heading hierarchy
- Alternative text for icons

---

## 🔒 Privacy

- **No tracking**: Zero analytics or tracking scripts
- **Local storage only**: All data stored locally in your browser
- **No external requests**: Except for Vue.js CDN and fonts
- **No cookies**: No cookies used
- **No data collection**: Your data never leaves your device

---

## 🐛 Known Issues

None currently! If you find a bug, please report it.

---

## 🚧 Future Enhancements

Potential features for future versions:

- [ ] Statistics dashboard with charts
- [ ] Task list integration
- [ ] Export/import settings
- [ ] Multiple timer presets
- [ ] Spotify integration
- [ ] Team collaboration features
- [ ] Mobile app (PWA)
- [ ] Browser extension

---

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

## 🙏 Acknowledgments

- Inspired by [pomofocus.io](https://pomofocus.io/)
- Built with [Vue.js](https://vuejs.org/)
- Fonts from [Google Fonts](https://fonts.google.com/)
- Icons: Unicode emoji

---

## 📞 Contact

**Patryk Prężyna**
- Website: [Your Website URL]
- GitHub: [@PatrykPrezyna](https://github.com/PatrykPrezyna)

---

## 🌟 Show Your Support

If you find this project helpful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting features
- 🔀 Contributing improvements

---

**Made with ❤️ and ☕ by Patryk Prężyna**

*Stay focused, stay productive!* 🍅