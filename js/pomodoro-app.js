/**
 * ═══════════════════════════════════════════════════════════════════════
 * POMODORO TIMER APPLICATION
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * A fully-featured Pomodoro timer application built with Vue.js 3.
 * Features include customizable timers, progress tracking, notifications,
 * and persistent settings storage.
 * 
 * @author Patryk Prężyna
 * @version 1.0.0
 */

const { createApp } = Vue;

/**
 * ═══════════════════════════════════════════════════════════════════════
 * CONSTANTS & CONFIGURATION
 * ═══════════════════════════════════════════════════════════════════════
 */

// Timer mode identifiers
const MODES = {
  POMODORO: 'pomodoro',
  SHORT_BREAK: 'shortBreak',
  LONG_BREAK: 'longBreak'
};

// Default settings configuration
const DEFAULT_SETTINGS = {
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
};

// Local storage keys
const STORAGE_KEYS = {
  SETTINGS: 'pomodoro_settings',
  PROGRESS: 'pomodoro_progress',
  LAST_DATE: 'pomodoro_last_date'
};

/**
 * ═══════════════════════════════════════════════════════════════════════
 * UTILITY FUNCTIONS
 * ═══════════════════════════════════════════════════════════════════════
 */

/**
 * Format seconds into MM:SS display format
 * @param {number} seconds - Total seconds to format
 * @returns {string} Formatted time string (e.g., "25:00")
 */
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get today's date as a string (YYYY-MM-DD)
 * @returns {string} Today's date
 */
function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Load data from localStorage with fallback
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} Stored value or default
 */
function loadFromStorage(key, defaultValue) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from storage:`, error);
    return defaultValue;
  }
}

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 */
function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
}

/**
 * Request browser notification permission
 * @returns {Promise<boolean>} True if permission granted
 */
async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('Browser does not support notifications');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
}

/**
 * Show browser notification
 * @param {string} title - Notification title
 * @param {string} body - Notification body text
 */
function showNotification(title, body) {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body,
      icon: '🍅',
      badge: '🍅',
      tag: 'pomodoro-timer',
      requireInteraction: false
    });
    
    // Auto-close after 5 seconds
    setTimeout(() => notification.close(), 5000);
    
    // Focus window when notification is clicked
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
}

/**
 * Play audio notification sound
 * @param {number} volume - Volume level (0-100)
 */
function playSound(volume) {
  try {
    // Create audio context for better browser support
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Configure sound (pleasant bell tone)
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.value = volume / 100 * 0.3; // Scale volume
    
    // Play sound
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
    
    // Cleanup
    setTimeout(() => {
      oscillator.disconnect();
      gainNode.disconnect();
      audioContext.close();
    }, 500);
  } catch (error) {
    console.error('Error playing sound:', error);
  }
}

/**
 * Update document title with timer
 * @param {string} time - Formatted time string
 * @param {string} mode - Current mode name
 */
function updateDocumentTitle(time, mode) {
  document.title = `${time} - ${mode}`;
}

/**
 * Update CSS custom property for current mode color
 * @param {string} mode - Mode identifier
 */
function updateModeColor(mode) {
  const root = document.documentElement;
  const colors = {
    [MODES.POMODORO]: {
      color: '#D95550',
      dark: '#C44742'
    },
    [MODES.SHORT_BREAK]: {
      color: '#4C9F70',
      dark: '#3D8A5C'
    },
    [MODES.LONG_BREAK]: {
      color: '#457CA3',
      dark: '#366A8C'
    }
  };
  
  const modeColors = colors[mode];
  root.style.setProperty('--current-color', modeColors.color);
  root.style.setProperty('--current-color-dark', modeColors.dark);
}

/**
 * ═══════════════════════════════════════════════════════════════════════
 * VUE APPLICATION
 * ═══════════════════════════════════════════════════════════════════════
 */

createApp({
  /**
   * ─────────────────────────────────────────────────────────────────────
   * DATA - Application State
   * ─────────────────────────────────────────────────────────────────────
   */
  data() {
    return {
      // Timer modes configuration
      modes: [
        { id: MODES.POMODORO, name: 'Pomodoro' },
        { id: MODES.SHORT_BREAK, name: 'Short Break' },
        { id: MODES.LONG_BREAK, name: 'Long Break' }
      ],
      
      // Current state
      currentMode: MODES.POMODORO,
      isRunning: false,
      timeRemaining: 25 * 60, // seconds
      totalTime: 25 * 60,     // seconds
      
      // Timer interval reference
      timerInterval: null,
      
      // Settings (loaded from localStorage or defaults)
      settings: { ...DEFAULT_SETTINGS },
      
      // Progress tracking
      completedPomodoros: 0,
      pomodorosUntilLongBreak: 4,
      
      // UI state
      showSettings: false,
      showNotification: false,
      notificationTitle: '',
      notificationMessage: '',
      
      // Daily goal
      dailyGoal: 8
    };
  },

  /**
   * ─────────────────────────────────────────────────────────────────────
   * COMPUTED PROPERTIES
   * ─────────────────────────────────────────────────────────────────────
   */
  computed: {
    /**
     * Format remaining time as MM:SS
     */
    formattedTime() {
      return formatTime(this.timeRemaining);
    },
    
    /**
     * Get current timer label
     */
    timerLabel() {
      const labels = {
        [MODES.POMODORO]: 'Focus Time',
        [MODES.SHORT_BREAK]: 'Short Break',
        [MODES.LONG_BREAK]: 'Long Break'
      };
      return labels[this.currentMode];
    },
    
    /**
     * Calculate progress ring style
     */
    progressStyle() {
      const circumference = 2 * Math.PI * 152; // radius = 152
      const progress = this.timeRemaining / this.totalTime;
      const offset = circumference * (1 - progress);
      
      return {
        strokeDasharray: `${circumference} ${circumference}`,
        strokeDashoffset: offset
      };
    },
    
    /**
     * Calculate daily progress percentage
     */
    progressPercentage() {
      return Math.min((this.completedPomodoros / this.dailyGoal) * 100, 100);
    }
  },

  /**
   * ─────────────────────────────────────────────────────────────────────
   * LIFECYCLE HOOKS
   * ─────────────────────────────────────────────────────────────────────
   */
  mounted() {
    // Load saved settings and progress
    this.loadSettings();
    this.loadProgress();
    
    // Set initial mode color
    updateModeColor(this.currentMode);
    
    // Update document title
    updateDocumentTitle(this.formattedTime, this.timerLabel);
    
    // Setup keyboard shortcuts
    this.setupKeyboardShortcuts();
    
    // Setup page visibility handling (for background tabs)
    this.setupVisibilityHandling();
    
    // Setup theme toggle
    this.setupThemeToggle();
    
    // Check if we need to reset daily progress
    this.checkDailyReset();
  },

  /**
   * Cleanup before component unmounts
   */
  beforeUnmount() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  },

  /**
   * ─────────────────────────────────────────────────────────────────────
   * METHODS - Core Timer Logic
   * ─────────────────────────────────────────────────────────────────────
   */
  methods: {
    /**
     * Switch between timer modes (Pomodoro, Short Break, Long Break)
     * @param {string} mode - Mode identifier
     */
    switchMode(mode) {
      // Stop current timer
      this.stopTimer();
      
      // Update mode
      this.currentMode = mode;
      
      // Reset timer to new duration
      this.resetTimer();
      
      // Update UI colors
      updateModeColor(mode);
    },

    /**
     * Toggle timer between running and paused states
     */
    toggleTimer() {
      if (this.isRunning) {
        this.pauseTimer();
      } else {
        this.startTimer();
      }
    },

    /**
     * Start the countdown timer
     */
    startTimer() {
      if (this.isRunning) return;
      
      this.isRunning = true;
      
      // Store start timestamp for accurate timing
      let lastTick = Date.now();
      
      this.timerInterval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - lastTick) / 1000);
        
        if (elapsed >= 1) {
          lastTick = now;
          this.timeRemaining -= elapsed;
          
          // Update document title
          updateDocumentTitle(this.formattedTime, this.timerLabel);
          
          // Check if timer completed
          if (this.timeRemaining <= 0) {
            this.completeTimer();
          }
        }
      }, 100); // Check every 100ms for accuracy
    },

    /**
     * Pause the timer
     */
    pauseTimer() {
      this.stopTimer();
    },

    /**
     * Stop the timer (clear interval)
     */
    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
      this.isRunning = false;
    },

    /**
     * Reset timer to initial duration for current mode
     */
    resetTimer() {
      this.stopTimer();
      
      // Get duration based on current mode
      const durations = {
        [MODES.POMODORO]: this.settings.pomodoroDuration,
        [MODES.SHORT_BREAK]: this.settings.shortBreakDuration,
        [MODES.LONG_BREAK]: this.settings.longBreakDuration
      };
      
      const duration = durations[this.currentMode] * 60;
      this.timeRemaining = duration;
      this.totalTime = duration;
      
      // Update document title
      updateDocumentTitle(this.formattedTime, this.timerLabel);
    },

    /**
     * Skip to next session
     */
    skipTimer() {
      this.stopTimer();
      this.completeTimer(true);
    },

    /**
     * Handle timer completion
     * @param {boolean} skipped - Whether timer was skipped
     */
    completeTimer(skipped = false) {
      this.stopTimer();
      this.timeRemaining = 0;
      
      if (!skipped) {
        // Play notification sound
        if (this.settings.soundEnabled) {
          playSound(this.settings.volume);
        }
        
        // Show browser notification
        if (this.settings.notificationsEnabled) {
          const messages = {
            [MODES.POMODORO]: {
              title: 'Pomodoro Complete! 🎉',
              body: 'Great work! Time for a break.'
            },
            [MODES.SHORT_BREAK]: {
              title: 'Break Complete! ⏰',
              body: 'Ready to focus again?'
            },
            [MODES.LONG_BREAK]: {
              title: 'Long Break Complete! 🌟',
              body: 'Refreshed and ready to go!'
            }
          };
          
          const message = messages[this.currentMode];
          showNotification(message.title, message.body);
          this.showToast(message.title, message.body);
        }
        
        // Update progress if completing a pomodoro
        if (this.currentMode === MODES.POMODORO) {
          this.completedPomodoros++;
          this.pomodorosUntilLongBreak--;
          this.saveProgress();
        }
      }
      
      // Auto-switch to next mode
      this.autoSwitchMode();
    },

    /**
     * Automatically switch to next appropriate mode
     */
    autoSwitchMode() {
      let nextMode;
      let autoStart = false;
      
      if (this.currentMode === MODES.POMODORO) {
        // After pomodoro, take a break
        if (this.pomodorosUntilLongBreak <= 0) {
          nextMode = MODES.LONG_BREAK;
          this.pomodorosUntilLongBreak = this.settings.longBreakInterval;
        } else {
          nextMode = MODES.SHORT_BREAK;
        }
        autoStart = this.settings.autoStartBreaks;
      } else {
        // After break, start pomodoro
        nextMode = MODES.POMODORO;
        autoStart = this.settings.autoStartPomodoros;
      }
      
      this.switchMode(nextMode);
      
      // Auto-start if enabled
      if (autoStart) {
        setTimeout(() => this.startTimer(), 1000);
      }
    },

    /**
     * ─────────────────────────────────────────────────────────────────
     * SETTINGS MANAGEMENT
     * ─────────────────────────────────────────────────────────────────
     */

    /**
     * Open settings modal
     */
    openSettings() {
      this.showSettings = true;
    },

    /**
     * Close settings modal and save
     */
    closeSettings() {
      this.showSettings = false;
      this.saveSettings();
      
      // Update daily goal
      this.dailyGoal = this.settings.dailyGoal;
      
      // Reset timer if duration changed
      if (!this.isRunning) {
        this.resetTimer();
      }
    },

    /**
     * Toggle notifications with permission request
     */
    async toggleNotifications() {
      if (!this.settings.notificationsEnabled) {
        const granted = await requestNotificationPermission();
        this.settings.notificationsEnabled = granted;
      } else {
        this.settings.notificationsEnabled = false;
      }
    },

    /**
     * Load settings from localStorage
     */
    loadSettings() {
      const saved = loadFromStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
      this.settings = { ...DEFAULT_SETTINGS, ...saved };
      this.dailyGoal = this.settings.dailyGoal;
    },

    /**
     * Save settings to localStorage
     */
    saveSettings() {
      saveToStorage(STORAGE_KEYS.SETTINGS, this.settings);
    },

    /**
     * ─────────────────────────────────────────────────────────────────
     * PROGRESS TRACKING
     * ─────────────────────────────────────────────────────────────────
     */

    /**
     * Load progress from localStorage
     */
    loadProgress() {
      const progress = loadFromStorage(STORAGE_KEYS.PROGRESS, {
        completedPomodoros: 0,
        pomodorosUntilLongBreak: this.settings.longBreakInterval
      });
      
      this.completedPomodoros = progress.completedPomodoros;
      this.pomodorosUntilLongBreak = progress.pomodorosUntilLongBreak;
    },

    /**
     * Save progress to localStorage
     */
    saveProgress() {
      const progress = {
        completedPomodoros: this.completedPomodoros,
        pomodorosUntilLongBreak: this.pomodorosUntilLongBreak
      };
      saveToStorage(STORAGE_KEYS.PROGRESS, progress);
      saveToStorage(STORAGE_KEYS.LAST_DATE, getTodayString());
    },

    /**
     * Check if we need to reset daily progress
     */
    checkDailyReset() {
      const lastDate = loadFromStorage(STORAGE_KEYS.LAST_DATE, getTodayString());
      const today = getTodayString();
      
      if (lastDate !== today) {
        // New day - reset progress
        this.completedPomodoros = 0;
        this.pomodorosUntilLongBreak = this.settings.longBreakInterval;
        this.saveProgress();
      }
    },

    /**
     * ─────────────────────────────────────────────────────────────────
     * UI HELPERS
     * ─────────────────────────────────────────────────────────────────
     */

    /**
     * Show toast notification
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     */
    showToast(title, message) {
      this.notificationTitle = title;
      this.notificationMessage = message;
      this.showNotification = true;
      
      setTimeout(() => {
        this.showNotification = false;
      }, 4000);
    },

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
      document.addEventListener('keydown', (e) => {
        // Ignore if typing in input
        if (e.target.tagName === 'INPUT') return;
        
        switch(e.key.toLowerCase()) {
          case ' ':
            e.preventDefault();
            this.toggleTimer();
            break;
          case 'r':
            this.resetTimer();
            break;
          case 's':
            this.skipTimer();
            break;
          case '1':
            this.switchMode(MODES.POMODORO);
            break;
          case '2':
            this.switchMode(MODES.SHORT_BREAK);
            break;
          case '3':
            this.switchMode(MODES.LONG_BREAK);
            break;
          case ',':
            this.openSettings();
            break;
          case 'escape':
            if (this.showSettings) {
              this.closeSettings();
            }
            break;
        }
      });
    },

    /**
     * Setup page visibility handling for background tabs
     */
    setupVisibilityHandling() {
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden && this.isRunning) {
          // Tab became visible - update title
          updateDocumentTitle(this.formattedTime, this.timerLabel);
        }
      });
    },

    /**
     * Setup theme toggle functionality
     */
    setupThemeToggle() {
      const themeToggle = document.getElementById('themeToggle');
      const themeIcon = themeToggle.querySelector('.theme-icon');
      const html = document.documentElement;
      
      // Load saved theme
      const savedTheme = localStorage.getItem('theme') || 'light';
      html.setAttribute('data-theme', savedTheme);
      themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
      
      // Toggle theme
      themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
      });
    }
  }
}).mount('#app');

/**
 * ═══════════════════════════════════════════════════════════════════════
 * INITIALIZATION COMPLETE
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * The Pomodoro Timer is now ready to use!
 * 
 * Keyboard Shortcuts:
 * - Space: Start/Pause timer
 * - R: Reset timer
 * - S: Skip to next session
 * - 1: Switch to Pomodoro mode
 * - 2: Switch to Short Break mode
 * - 3: Switch to Long Break mode
 * - ,: Open settings
 * - Esc: Close settings
 */

// Made with Bob
