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
  dailyGoal: 8,                // target pomodoros per day
  ambientSoundEnabled: false,  // ambient sound during timer
  ambientSoundType: 'none',    // 'none', 'white', 'brown'
  ambientSoundVolume: 30       // ambient sound volume (0-100)
};

// Local storage keys
const STORAGE_KEYS = {
  SETTINGS: 'pomodoro_settings',
  PROGRESS: 'pomodoro_progress',
  LAST_DATE: 'pomodoro_last_date',
  PROJECTS: 'pomodoro_projects',
  TASKS: 'pomodoro_tasks',
  TIME_ENTRIES: 'pomodoro_time_entries',
  ACTIVE_TASK: 'pomodoro_active_task',
  LAST_CONFIRMATION: 'pomodoro_last_confirmation'
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
    
    // Play 5 beeps in succession
    const beepCount = 5;
    const beepDuration = 0.15; // Duration of each beep
    const beepInterval = 0.3;  // Time between beeps
    
    for (let i = 0; i < beepCount; i++) {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Configure sound (pleasant bell tone)
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = volume / 100 * 0.3; // Scale volume
      
      // Schedule beep start and stop
      const startTime = audioContext.currentTime + (i * beepInterval);
      oscillator.start(startTime);
      oscillator.stop(startTime + beepDuration);
    }
    
    // Cleanup after all beeps complete
    const totalDuration = (beepCount * beepInterval) + beepDuration;
    setTimeout(() => {
      audioContext.close();
    }, totalDuration * 1000 + 100);
  } catch (error) {
    console.error('Error playing sound:', error);
  }
}

/**
 * ═══════════════════════════════════════════════════════════════════════
 * AMBIENT SOUND GENERATION
 * ═══════════════════════════════════════════════════════════════════════
 */

/**
 * Ambient sound generator class
 */
class AmbientSoundGenerator {
  constructor() {
    this.audioContext = null;
    this.gainNode = null;
    this.sourceNode = null;
    this.isPlaying = false;
    this.currentType = 'none';
  }

  /**
   * Initialize audio context
   */
  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
    }
  }

  /**
   * Generate white noise
   */
  createWhiteNoise() {
    const bufferSize = 2 * this.audioContext.sampleRate;
    const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    const whiteNoise = this.audioContext.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    
    return whiteNoise;
  }

  /**
   * Generate brown noise (Brownian noise)
   */
  createBrownNoise() {
    const bufferSize = 2 * this.audioContext.sampleRate;
    const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Compensate for volume drop
    }
    
    const brownNoise = this.audioContext.createBufferSource();
    brownNoise.buffer = noiseBuffer;
    brownNoise.loop = true;
    
    return brownNoise;
  }

  /**
   * Start playing ambient sound
   * @param {string} type - 'white' or 'brown'
   * @param {number} volume - Volume level (0-100)
   */
  start(type, volume) {
    if (this.isPlaying && this.currentType === type) {
      // Just update volume
      this.setVolume(volume);
      return;
    }

    // Stop current sound if playing
    this.stop();

    if (type === 'none') return;

    this.init();
    
    // Create appropriate noise type
    if (type === 'white') {
      this.sourceNode = this.createWhiteNoise();
    } else if (type === 'brown') {
      this.sourceNode = this.createBrownNoise();
    } else {
      return;
    }

    // Connect and start
    this.sourceNode.connect(this.gainNode);
    this.setVolume(volume);
    this.sourceNode.start(0);
    
    this.isPlaying = true;
    this.currentType = type;
  }

  /**
   * Stop playing ambient sound
   */
  stop() {
    if (this.sourceNode && this.isPlaying) {
      try {
        this.sourceNode.stop();
        this.sourceNode.disconnect();
      } catch (e) {
        // Ignore errors if already stopped
      }
      this.sourceNode = null;
      this.isPlaying = false;
      this.currentType = 'none';
    }
  }

  /**
   * Set volume
   * @param {number} volume - Volume level (0-100)
   */
  setVolume(volume) {
    if (this.gainNode) {
      // Convert 0-100 to 0-0.3 (ambient sounds should be subtle)
      this.gainNode.gain.value = (volume / 100) * 0.3;
    }
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

/**
 * Generate a simple UUID v4
 * @returns {string} UUID string
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
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
      dailyGoal: 8,
      
      // Ambient sound generator
      ambientSound: null,
      
      // Project & Task Management
      projects: [],
      tasks: [],
      timeEntries: [],
      activeTaskId: null,
      sessionStartTime: null, // Track when current pomodoro started
      currentView: 'timer', // 'timer', 'projects', 'summary'
      summaryPeriod: 'day', // 'day' or 'week'
      
      // Project/Task UI state
      showProjectModal: false,
      showTaskModal: false,
      showTimeEditModal: false,
      showMorningConfirmation: false,
      editingProject: null,
      editingTask: null,
      editingTimeEntry: null,
      
      // Form data
      projectForm: { name: '', color: '#D95550' },
      taskForm: { name: '', description: '', projectId: null, estimatedPomodoros: 4 },
      timeEditForm: { taskId: null, date: '', startTime: '', endTime: '' }
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
    },
    
    /**
     * Get active task object
     */
    activeTask() {
      return this.tasks.find(t => t.id === this.activeTaskId) || null;
    },
    
    /**
     * Get active project object
     */
    activeProject() {
      if (!this.activeTask) return null;
      return this.projects.find(p => p.id === this.activeTask.projectId) || null;
    },
    
    /**
     * Get tasks grouped by project
     */
    tasksByProject() {
      const grouped = {};
      this.projects.forEach(project => {
        grouped[project.id] = this.tasks.filter(t => t.projectId === project.id && !t.completed);
      });
      return grouped;
    },
    
    /**
     * Calculate today's time summary
     */
    todaySummary() {
      const today = getTodayString();
      const todayEntries = this.timeEntries.filter(e => e.date === today);
      
      const summary = {
        totalTime: 0,
        totalPomodoros: 0,
        byProject: {}
      };
      
      todayEntries.forEach(entry => {
        summary.totalTime += entry.duration;
        summary.totalPomodoros += entry.pomodorosCompleted;
        
        const project = this.projects.find(p => p.id === entry.projectId);
        const task = this.tasks.find(t => t.id === entry.taskId);
        
        if (project) {
          if (!summary.byProject[project.id]) {
            summary.byProject[project.id] = {
              project,
              time: 0,
              pomodoros: 0,
              tasks: {}
            };
          }
          
          summary.byProject[project.id].time += entry.duration;
          summary.byProject[project.id].pomodoros += entry.pomodorosCompleted;
          
          if (task) {
            if (!summary.byProject[project.id].tasks[task.id]) {
              summary.byProject[project.id].tasks[task.id] = {
                task,
                time: 0,
                pomodoros: 0
              };
            }
            summary.byProject[project.id].tasks[task.id].time += entry.duration;
            summary.byProject[project.id].tasks[task.id].pomodoros += entry.pomodorosCompleted;
          }
        }
      });
      
      return summary;
    },
    
    /**
     * Calculate week's time summary
     */
    weekSummary() {
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const monday = new Date(today);
      monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      monday.setHours(0, 0, 0, 0);
      
      const weekEntries = this.timeEntries.filter(e => {
        const entryDate = new Date(e.date);
        return entryDate >= monday;
      });
      
      const summary = {
        totalTime: 0,
        totalPomodoros: 0,
        byProject: {}
      };
      
      weekEntries.forEach(entry => {
        summary.totalTime += entry.duration;
        summary.totalPomodoros += entry.pomodorosCompleted;
        
        const project = this.projects.find(p => p.id === entry.projectId);
        const task = this.tasks.find(t => t.id === entry.taskId);
        
        if (project) {
          if (!summary.byProject[project.id]) {
            summary.byProject[project.id] = {
              project,
              time: 0,
              pomodoros: 0,
              tasks: {}
            };
          }
          
          summary.byProject[project.id].time += entry.duration;
          summary.byProject[project.id].pomodoros += entry.pomodorosCompleted;
          
          if (task) {
            if (!summary.byProject[project.id].tasks[task.id]) {
              summary.byProject[project.id].tasks[task.id] = {
                task,
                time: 0,
                pomodoros: 0
              };
            }
            summary.byProject[project.id].tasks[task.id].time += entry.duration;
            summary.byProject[project.id].tasks[task.id].pomodoros += entry.pomodorosCompleted;
          }
        }
      });
      
      return summary;
    },
    
    /**
     * Get current summary based on selected period
     */
    currentSummary() {
      return this.summaryPeriod === 'week' ? this.weekSummary : this.todaySummary;
    }
  },

  /**
   * ─────────────────────────────────────────────────────────────────────
   * LIFECYCLE HOOKS
   * ─────────────────────────────────────────────────────────────────────
   */
  mounted() {
    // Initialize ambient sound generator
    this.ambientSound = new AmbientSoundGenerator();
    
    // Load saved settings and progress
    this.loadSettings();
    this.loadProgress();
    
    // Load projects, tasks, and time entries
    this.loadProjects();
    this.loadTasks();
    this.loadTimeEntries();
    this.loadActiveTask();
    
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
    
    // Check for morning confirmation
    this.checkMorningConfirmation();
  },

  /**
   * Cleanup before component unmounts
   */
  beforeUnmount() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    if (this.ambientSound) {
      this.ambientSound.cleanup();
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
      
      // Record start time for time tracking (only for pomodoro mode)
      if (this.currentMode === MODES.POMODORO) {
        this.sessionStartTime = Date.now();
      }
      
      // Start ambient sound if enabled and in pomodoro mode
      if (this.settings.ambientSoundEnabled &&
          this.currentMode === MODES.POMODORO &&
          this.settings.ambientSoundType !== 'none') {
        this.ambientSound.start(
          this.settings.ambientSoundType,
          this.settings.ambientSoundVolume
        );
      }
      
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
      // Stop ambient sound when pausing
      if (this.ambientSound) {
        this.ambientSound.stop();
      }
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
      // Stop ambient sound when stopping
      if (this.ambientSound) {
        this.ambientSound.stop();
      }
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
          
          // Record time entry if task is selected
          if (this.activeTaskId && this.sessionStartTime) {
            this.recordTimeEntry();
          }
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
      
      // Update ambient sound if timer is running
      if (this.isRunning && this.currentMode === MODES.POMODORO) {
        if (this.settings.ambientSoundEnabled && this.settings.ambientSoundType !== 'none') {
          this.ambientSound.start(
            this.settings.ambientSoundType,
            this.settings.ambientSoundVolume
          );
        } else {
          this.ambientSound.stop();
        }
      }
      
      // Reset timer if duration changed
      if (!this.isRunning) {
        this.resetTimer();
      }
    },

    /**
     * Update ambient sound volume in real-time
     */
    updateAmbientVolume() {
      if (this.ambientSound && this.ambientSound.isPlaying) {
        this.ambientSound.setVolume(this.settings.ambientSoundVolume);
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
        // Ignore if typing in input or textarea
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
        
        switch(e.key.toLowerCase()) {
          case ' ':
            e.preventDefault();
            if (this.currentView === 'timer') {
              this.toggleTimer();
            }
            break;
          case 'r':
            if (this.currentView === 'timer') {
              this.resetTimer();
            }
            break;
          case 's':
            if (this.currentView === 'timer') {
              this.skipTimer();
            }
            break;
          case '1':
            if (this.currentView === 'timer') {
              this.switchMode(MODES.POMODORO);
            }
            break;
          case '2':
            if (this.currentView === 'timer') {
              this.switchMode(MODES.SHORT_BREAK);
            }
            break;
          case '3':
            if (this.currentView === 'timer') {
              this.switchMode(MODES.LONG_BREAK);
            }
            break;
          case 't':
            this.switchView('timer');
            break;
          case 'p':
            this.switchView('projects');
            break;
          case 'u':
            this.switchView('summary');
            break;
          case ',':
            this.openSettings();
            break;
          case 'escape':
            if (this.showSettings) {
              this.closeSettings();
            } else if (this.showProjectModal) {
              this.closeProjectModal();
            } else if (this.showTaskModal) {
              this.closeTaskModal();
            } else if (this.showTimeEditModal) {
              this.closeTimeEditModal();
            } else if (this.showMorningConfirmation) {
              this.confirmMorningReview();
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
    },

    /**
     * ─────────────────────────────────────────────────────────────────
     * PROJECT & TASK MANAGEMENT
     * ─────────────────────────────────────────────────────────────────
     */

    /**
     * Load projects from localStorage
     */
    loadProjects() {
      this.projects = loadFromStorage(STORAGE_KEYS.PROJECTS, []);
    },

    /**
     * Save projects to localStorage
     */
    saveProjects() {
      saveToStorage(STORAGE_KEYS.PROJECTS, this.projects);
    },

    /**
     * Load tasks from localStorage
     */
    loadTasks() {
      this.tasks = loadFromStorage(STORAGE_KEYS.TASKS, []);
    },

    /**
     * Save tasks to localStorage
     */
    saveTasks() {
      saveToStorage(STORAGE_KEYS.TASKS, this.tasks);
    },

    /**
     * Load time entries from localStorage
     */
    loadTimeEntries() {
      this.timeEntries = loadFromStorage(STORAGE_KEYS.TIME_ENTRIES, []);
    },

    /**
     * Save time entries to localStorage
     */
    saveTimeEntries() {
      saveToStorage(STORAGE_KEYS.TIME_ENTRIES, this.timeEntries);
    },

    /**
     * Load active task from localStorage
     */
    loadActiveTask() {
      this.activeTaskId = loadFromStorage(STORAGE_KEYS.ACTIVE_TASK, null);
    },

    /**
     * Save active task to localStorage
     */
    saveActiveTask() {
      saveToStorage(STORAGE_KEYS.ACTIVE_TASK, this.activeTaskId);
    },

    /**
     * Switch view
     */
    switchView(view) {
      this.currentView = view;
    },

    /**
     * Select active task
     */
    selectTask(taskId) {
      this.activeTaskId = taskId;
      this.saveActiveTask();
    },

    /**
     * Open project modal for creating new project
     */
    openNewProjectModal() {
      this.editingProject = null;
      this.projectForm = { name: '', color: '#D95550' };
      this.showProjectModal = true;
    },

    /**
     * Open project modal for editing
     */
    openEditProjectModal(project) {
      this.editingProject = project;
      this.projectForm = { name: project.name, color: project.color };
      this.showProjectModal = true;
    },

    /**
     * Close project modal
     */
    closeProjectModal() {
      this.showProjectModal = false;
      this.editingProject = null;
    },

    /**
     * Save project (create or update)
     */
    saveProject() {
      if (!this.projectForm.name.trim()) {
        alert('Project name is required');
        return;
      }

      if (this.editingProject) {
        // Update existing project
        const index = this.projects.findIndex(p => p.id === this.editingProject.id);
        if (index !== -1) {
          this.projects[index].name = this.projectForm.name.trim();
          this.projects[index].color = this.projectForm.color;
        }
      } else {
        // Create new project
        const newProject = {
          id: generateUUID(),
          name: this.projectForm.name.trim(),
          color: this.projectForm.color,
          createdAt: Date.now(),
          archived: false
        };
        this.projects.push(newProject);
      }

      this.saveProjects();
      this.closeProjectModal();
    },

    /**
     * Delete project
     */
    deleteProject(projectId) {
      if (!confirm('Delete this project and all its tasks?')) return;

      // Remove project
      this.projects = this.projects.filter(p => p.id !== projectId);
      
      // Remove associated tasks
      this.tasks = this.tasks.filter(t => t.projectId !== projectId);
      
      // Clear active task if it belonged to this project
      if (this.activeTask && this.activeTask.projectId === projectId) {
        this.activeTaskId = null;
        this.saveActiveTask();
      }

      this.saveProjects();
      this.saveTasks();
    },

    /**
     * Open task modal for creating new task
     */
    openNewTaskModal(projectId) {
      this.editingTask = null;
      this.taskForm = {
        name: '',
        description: '',
        projectId: projectId,
        estimatedPomodoros: 4
      };
      this.showTaskModal = true;
    },

    /**
     * Open task modal for editing
     */
    openEditTaskModal(task) {
      this.editingTask = task;
      this.taskForm = {
        name: task.name,
        description: task.description || '',
        projectId: task.projectId,
        estimatedPomodoros: task.estimatedPomodoros || 4
      };
      this.showTaskModal = true;
    },

    /**
     * Close task modal
     */
    closeTaskModal() {
      this.showTaskModal = false;
      this.editingTask = null;
    },

    /**
     * Save task (create or update)
     */
    saveTask() {
      if (!this.taskForm.name.trim()) {
        alert('Task name is required');
        return;
      }

      if (this.editingTask) {
        // Update existing task
        const index = this.tasks.findIndex(t => t.id === this.editingTask.id);
        if (index !== -1) {
          this.tasks[index].name = this.taskForm.name.trim();
          this.tasks[index].description = this.taskForm.description.trim();
          this.tasks[index].estimatedPomodoros = this.taskForm.estimatedPomodoros;
        }
      } else {
        // Create new task
        const newTask = {
          id: generateUUID(),
          projectId: this.taskForm.projectId,
          name: this.taskForm.name.trim(),
          description: this.taskForm.description.trim(),
          createdAt: Date.now(),
          completed: false,
          estimatedPomodoros: this.taskForm.estimatedPomodoros
        };
        this.tasks.push(newTask);
      }

      this.saveTasks();
      this.closeTaskModal();
    },

    /**
     * Delete task
     */
    deleteTask(taskId) {
      if (!confirm('Delete this task?')) return;

      this.tasks = this.tasks.filter(t => t.id !== taskId);
      
      // Clear active task if it was deleted
      if (this.activeTaskId === taskId) {
        this.activeTaskId = null;
        this.saveActiveTask();
      }

      this.saveTasks();
    },

    /**
     * Toggle task completion
     */
    toggleTaskComplete(taskId) {
      const task = this.tasks.find(t => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
        this.saveTasks();
      }
    },

    /**
     * Record time entry for completed pomodoro
     */
    recordTimeEntry() {
      if (!this.activeTaskId || !this.sessionStartTime) return;

      const task = this.tasks.find(t => t.id === this.activeTaskId);
      if (!task) return;

      const endTime = Date.now();
      const duration = Math.floor((endTime - this.sessionStartTime) / 1000);

      const timeEntry = {
        id: generateUUID(),
        taskId: this.activeTaskId,
        projectId: task.projectId,
        startTime: this.sessionStartTime,
        endTime: endTime,
        duration: duration,
        date: getTodayString(),
        pomodorosCompleted: 1
      };

      this.timeEntries.push(timeEntry);
      this.saveTimeEntries();
      this.sessionStartTime = null;
    },

    /**
     * Open time edit modal
     */
    openTimeEditModal(entry = null) {
      if (entry) {
        this.editingTimeEntry = entry;
        const startDate = new Date(entry.startTime);
        const endDate = new Date(entry.endTime);
        this.timeEditForm = {
          taskId: entry.taskId,
          date: entry.date,
          startTime: startDate.toTimeString().slice(0, 5),
          endTime: endDate.toTimeString().slice(0, 5)
        };
      } else {
        this.editingTimeEntry = null;
        const now = new Date();
        this.timeEditForm = {
          taskId: this.activeTaskId,
          date: getTodayString(),
          startTime: new Date(now.getTime() - 25 * 60000).toTimeString().slice(0, 5),
          endTime: now.toTimeString().slice(0, 5)
        };
      }
      this.showTimeEditModal = true;
    },

    /**
     * Close time edit modal
     */
    closeTimeEditModal() {
      this.showTimeEditModal = false;
      this.editingTimeEntry = null;
    },

    /**
     * Save time entry edit
     */
    saveTimeEdit() {
      if (!this.timeEditForm.taskId) {
        alert('Please select a task');
        return;
      }

      const task = this.tasks.find(t => t.id === this.timeEditForm.taskId);
      if (!task) return;

      // Parse times
      const [startHour, startMin] = this.timeEditForm.startTime.split(':').map(Number);
      const [endHour, endMin] = this.timeEditForm.endTime.split(':').map(Number);
      
      const dateObj = new Date(this.timeEditForm.date);
      const startTime = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), startHour, startMin).getTime();
      const endTime = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), endHour, endMin).getTime();
      
      if (endTime <= startTime) {
        alert('End time must be after start time');
        return;
      }

      const duration = Math.floor((endTime - startTime) / 1000);
      const pomodoros = Math.round(duration / (25 * 60));

      if (this.editingTimeEntry) {
        // Update existing entry
        const index = this.timeEntries.findIndex(e => e.id === this.editingTimeEntry.id);
        if (index !== -1) {
          this.timeEntries[index].taskId = this.timeEditForm.taskId;
          this.timeEntries[index].projectId = task.projectId;
          this.timeEntries[index].startTime = startTime;
          this.timeEntries[index].endTime = endTime;
          this.timeEntries[index].duration = duration;
          this.timeEntries[index].date = this.timeEditForm.date;
          this.timeEntries[index].pomodorosCompleted = pomodoros;
        }
      } else {
        // Create new entry
        const newEntry = {
          id: generateUUID(),
          taskId: this.timeEditForm.taskId,
          projectId: task.projectId,
          startTime: startTime,
          endTime: endTime,
          duration: duration,
          date: this.timeEditForm.date,
          pomodorosCompleted: pomodoros
        };
        this.timeEntries.push(newEntry);
      }

      this.saveTimeEntries();
      this.closeTimeEditModal();
    },

    /**
     * Delete time entry
     */
    deleteTimeEntry(entryId) {
      if (!confirm('Delete this time entry?')) return;
      this.timeEntries = this.timeEntries.filter(e => e.id !== entryId);
      this.saveTimeEntries();
    },

    /**
     * Check for morning confirmation
     */
    checkMorningConfirmation() {
      const lastConfirmation = loadFromStorage(STORAGE_KEYS.LAST_CONFIRMATION, null);
      const today = getTodayString();
      
      if (lastConfirmation === today) return;

      // Check if there were entries yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      const yesterdayEntries = this.timeEntries.filter(e => e.date === yesterdayStr);
      
      if (yesterdayEntries.length > 0) {
        // Show morning confirmation after a short delay
        setTimeout(() => {
          this.showMorningConfirmation = true;
        }, 1000);
      }
    },

    /**
     * Confirm morning review
     */
    confirmMorningReview() {
      saveToStorage(STORAGE_KEYS.LAST_CONFIRMATION, getTodayString());
      this.showMorningConfirmation = false;
    },

    /**
     * Format duration in seconds to human readable
     */
    formatDuration(seconds) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      }
      return `${minutes}m`;
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
