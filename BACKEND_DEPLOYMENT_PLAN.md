# Backend Deployment Plan - Persistent Cross-Device Storage

## Executive Summary

This document outlines the architecture and implementation plan to migrate the Pomodoro Timer from localStorage to a cloud-based backend, enabling:
- ✅ Data persistence across browser cache clears
- ✅ Multi-device synchronization
- ✅ Future user management capabilities
- ✅ Data backup and recovery

---

## Current Architecture Analysis

### Data Storage (localStorage)
The application currently stores 7 types of data locally:

```javascript
STORAGE_KEYS = {
  SETTINGS: 'pomodoro_settings',           // User preferences
  PROGRESS: 'pomodoro_progress',           // Daily completion count
  LAST_DATE: 'pomodoro_last_date',         // Last activity date
  PROJECTS: 'pomodoro_projects',           // Project list
  TASKS: 'pomodoro_tasks',                 // Task list
  TIME_ENTRIES: 'pomodoro_time_entries',   // Time tracking records
  ACTIVE_TASK: 'pomodoro_active_task',     // Currently selected task
  LAST_CONFIRMATION: 'pomodoro_last_confirmation' // Morning confirmation state
}
```

### Data Models

**Settings Object:**
```javascript
{
  pomodoroDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  longBreakInterval: 4,
  notificationsEnabled: true,
  soundEnabled: true,
  volume: 50,
  dailyGoal: 8,
  ambientSoundEnabled: false,
  ambientSoundType: 'none',
  ambientSoundVolume: 30
}
```

**Project Object:**
```javascript
{
  id: "uuid",
  name: "Project Name",
  color: "#D95550",
  createdAt: timestamp,
  archived: false
}
```

**Task Object:**
```javascript
{
  id: "uuid",
  projectId: "project-uuid",
  name: "Task Name",
  description: "Description",
  createdAt: timestamp,
  completed: false,
  estimatedPomodoros: 4
}
```

**Time Entry Object:**
```javascript
{
  id: "uuid",
  taskId: "task-uuid",
  projectId: "project-uuid",
  startTime: timestamp,
  endTime: timestamp,
  duration: 1500,
  date: "2026-04-13",
  pomodorosCompleted: 1
}
```

---

## Backend Architecture Options

### Option 1: Firebase (Recommended for MVP) ⭐

**Pros:**
- ✅ Free tier: 1GB storage, 10GB/month bandwidth
- ✅ Real-time sync across devices
- ✅ Built-in authentication (Google, Email, Anonymous)
- ✅ No server management required
- ✅ Excellent documentation and Vue.js integration
- ✅ Offline support with automatic sync
- ✅ Security rules for data protection

**Cons:**
- ❌ Vendor lock-in
- ❌ Costs scale with usage
- ❌ Limited query capabilities

**Cost Estimate:**
- Free tier sufficient for personal use
- Paid tier starts at $25/month (only if exceeding free limits)

**Implementation Complexity:** ⭐⭐ (Low-Medium)

---

### Option 2: Supabase (Best for Future Scalability) ⭐⭐

**Pros:**
- ✅ Free tier: 500MB database, 1GB file storage
- ✅ PostgreSQL database (powerful queries)
- ✅ Built-in authentication
- ✅ Real-time subscriptions
- ✅ RESTful API auto-generated
- ✅ Open source (can self-host)
- ✅ Row-level security

**Cons:**
- ❌ Slightly more complex setup than Firebase
- ❌ Smaller community than Firebase

**Cost Estimate:**
- Free tier sufficient for personal use
- Pro tier: $25/month (unlimited API requests)

**Implementation Complexity:** ⭐⭐⭐ (Medium)

---

### Option 3: Custom Backend (Node.js + MongoDB/PostgreSQL)

**Pros:**
- ✅ Complete control over infrastructure
- ✅ No vendor lock-in
- ✅ Can optimize for specific needs
- ✅ Learning opportunity

**Cons:**
- ❌ Requires server management
- ❌ Need to implement authentication
- ❌ Higher maintenance overhead
- ❌ Deployment complexity

**Cost Estimate:**
- Hosting: $5-10/month (DigitalOcean, Railway, Render)
- Database: Included or $5/month

**Implementation Complexity:** ⭐⭐⭐⭐⭐ (High)

---

### Option 4: PocketBase (Lightweight Alternative)

**Pros:**
- ✅ Single executable file
- ✅ Built-in authentication
- ✅ Real-time subscriptions
- ✅ Admin dashboard included
- ✅ Very lightweight
- ✅ Open source

**Cons:**
- ❌ Requires hosting
- ❌ Smaller ecosystem
- ❌ Less mature than Firebase/Supabase

**Cost Estimate:**
- Hosting: $5/month (any VPS)

**Implementation Complexity:** ⭐⭐⭐ (Medium)

---

## Recommended Solution: Firebase

### Why Firebase?

1. **Fastest Time to Market**: Can be implemented in 1-2 days
2. **Zero Infrastructure Management**: Focus on features, not servers
3. **Built-in Features**: Authentication, real-time sync, offline support
4. **Free Tier**: Sufficient for personal use and small user base
5. **Easy Migration Path**: Can migrate to Supabase or custom backend later

---

## Implementation Plan - Firebase

### Phase 1: Setup & Configuration (2-4 hours)

#### Step 1.1: Create Firebase Project
```bash
# 1. Go to https://console.firebase.google.com
# 2. Click "Add project"
# 3. Name: "pomodoro-timer-app"
# 4. Disable Google Analytics (optional for personal use)
# 5. Create project
```

#### Step 1.2: Enable Firebase Services
- **Firestore Database**: For storing user data
- **Authentication**: For user management
- **Hosting**: For deploying the app (optional, can keep GitHub Pages)

#### Step 1.3: Install Firebase SDK
```html
<!-- Add to pomodoro.html before closing </body> -->
<script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js"></script>
```

#### Step 1.4: Initialize Firebase
```javascript
// Add to js/pomodoro-app.js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "pomodoro-timer-app.firebaseapp.com",
  projectId: "pomodoro-timer-app",
  storageBucket: "pomodoro-timer-app.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
```

---

### Phase 2: Authentication Implementation (4-6 hours)

#### Step 2.1: Anonymous Authentication (MVP)
```javascript
// Enable anonymous sign-in for immediate use
async function initAuth() {
  try {
    await auth.signInAnonymously();
    console.log('Signed in anonymously');
  } catch (error) {
    console.error('Auth error:', error);
  }
}
```

#### Step 2.2: Add Login UI (Future Enhancement)
```html
<!-- Simple login modal -->
<div id="auth-modal" v-if="!isAuthenticated">
  <button @click="signInAnonymously">Continue as Guest</button>
  <button @click="signInWithGoogle">Sign in with Google</button>
  <button @click="signInWithEmail">Sign in with Email</button>
</div>
```

---

### Phase 3: Data Migration (6-8 hours)

#### Step 3.1: Create Firestore Collections

**Collection Structure:**
```
users/
  {userId}/
    settings/          (document)
    projects/          (collection)
      {projectId}/     (document)
    tasks/             (collection)
      {taskId}/        (document)
    timeEntries/       (collection)
      {entryId}/       (document)
    progress/          (collection)
      {date}/          (document)
```

#### Step 3.2: Create Data Service Layer
```javascript
// js/firebase-service.js
class FirebaseDataService {
  constructor(userId) {
    this.userId = userId;
    this.userRef = db.collection('users').doc(userId);
  }

  // Settings
  async saveSettings(settings) {
    await this.userRef.collection('settings').doc('current').set(settings);
  }

  async getSettings() {
    const doc = await this.userRef.collection('settings').doc('current').get();
    return doc.exists ? doc.data() : DEFAULT_SETTINGS;
  }

  // Projects
  async saveProject(project) {
    await this.userRef.collection('projects').doc(project.id).set(project);
  }

  async getProjects() {
    const snapshot = await this.userRef.collection('projects').get();
    return snapshot.docs.map(doc => doc.data());
  }

  // Tasks
  async saveTask(task) {
    await this.userRef.collection('tasks').doc(task.id).set(task);
  }

  async getTasks(projectId = null) {
    let query = this.userRef.collection('tasks');
    if (projectId) {
      query = query.where('projectId', '==', projectId);
    }
    const snapshot = await query.get();
    return snapshot.docs.map(doc => doc.data());
  }

  // Time Entries
  async saveTimeEntry(entry) {
    await this.userRef.collection('timeEntries').doc(entry.id).set(entry);
  }

  async getTimeEntries(startDate, endDate) {
    const snapshot = await this.userRef.collection('timeEntries')
      .where('date', '>=', startDate)
      .where('date', '<=', endDate)
      .get();
    return snapshot.docs.map(doc => doc.data());
  }

  // Progress
  async saveProgress(date, count) {
    await this.userRef.collection('progress').doc(date).set({
      date,
      count,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  async getProgress(date) {
    const doc = await this.userRef.collection('progress').doc(date).get();
    return doc.exists ? doc.data().count : 0;
  }
}
```

#### Step 3.3: Migrate localStorage to Firebase
```javascript
// One-time migration function
async function migrateLocalStorageToFirebase(dataService) {
  // Migrate settings
  const settings = loadFromStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  await dataService.saveSettings(settings);

  // Migrate projects
  const projects = loadFromStorage(STORAGE_KEYS.PROJECTS, []);
  for (const project of projects) {
    await dataService.saveProject(project);
  }

  // Migrate tasks
  const tasks = loadFromStorage(STORAGE_KEYS.TASKS, []);
  for (const task of tasks) {
    await dataService.saveTask(task);
  }

  // Migrate time entries
  const timeEntries = loadFromStorage(STORAGE_KEYS.TIME_ENTRIES, []);
  for (const entry of timeEntries) {
    await dataService.saveTimeEntry(entry);
  }

  // Migrate progress
  const progress = loadFromStorage(STORAGE_KEYS.PROGRESS, 0);
  const today = getTodayString();
  await dataService.saveProgress(today, progress);

  console.log('Migration complete!');
}
```

---

### Phase 4: Real-time Sync (4-6 hours)

#### Step 4.1: Enable Real-time Listeners
```javascript
// Listen for settings changes
dataService.userRef.collection('settings').doc('current')
  .onSnapshot((doc) => {
    if (doc.exists) {
      this.settings = doc.data();
    }
  });

// Listen for project changes
dataService.userRef.collection('projects')
  .onSnapshot((snapshot) => {
    this.projects = snapshot.docs.map(doc => doc.data());
  });

// Listen for task changes
dataService.userRef.collection('tasks')
  .onSnapshot((snapshot) => {
    this.tasks = snapshot.docs.map(doc => doc.data());
  });
```

#### Step 4.2: Implement Offline Support
```javascript
// Enable offline persistence
firebase.firestore().enablePersistence()
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code == 'unimplemented') {
      console.log('Browser doesn\'t support persistence');
    }
  });
```

---

### Phase 5: Security Rules (2-3 hours)

#### Step 5.1: Configure Firestore Security Rules
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

### Phase 6: Testing & Deployment (4-6 hours)

#### Step 6.1: Testing Checklist
- [ ] Anonymous authentication works
- [ ] Data saves to Firestore
- [ ] Data loads from Firestore
- [ ] Real-time sync works across tabs
- [ ] Offline mode works
- [ ] Migration from localStorage works
- [ ] Security rules prevent unauthorized access

#### Step 6.2: Deployment Options

**Option A: Keep GitHub Pages + Firebase**
- Frontend: GitHub Pages (free)
- Backend: Firebase (free tier)
- Total cost: $0/month

**Option B: Firebase Hosting**
- Everything on Firebase
- Better integration
- Total cost: $0/month (free tier)

---

## Database Schema Design

### Firestore Collections

```
users/
  {userId}/
    settings/
      current/
        - pomodoroDuration: number
        - shortBreakDuration: number
        - longBreakDuration: number
        - autoStartBreaks: boolean
        - autoStartPomodoros: boolean
        - longBreakInterval: number
        - notificationsEnabled: boolean
        - soundEnabled: boolean
        - volume: number
        - dailyGoal: number
        - ambientSoundEnabled: boolean
        - ambientSoundType: string
        - ambientSoundVolume: number
        - createdAt: timestamp
        - updatedAt: timestamp

    projects/
      {projectId}/
        - id: string
        - name: string
        - color: string
        - createdAt: timestamp
        - archived: boolean
        - updatedAt: timestamp

    tasks/
      {taskId}/
        - id: string
        - projectId: string
        - name: string
        - description: string
        - createdAt: timestamp
        - completed: boolean
        - completedAt: timestamp | null
        - estimatedPomodoros: number
        - updatedAt: timestamp

    timeEntries/
      {entryId}/
        - id: string
        - taskId: string
        - projectId: string
        - startTime: timestamp
        - endTime: timestamp
        - duration: number
        - date: string (YYYY-MM-DD)
        - pomodorosCompleted: number
        - createdAt: timestamp

    progress/
      {date}/  (YYYY-MM-DD)
        - date: string
        - count: number
        - updatedAt: timestamp

    metadata/
      info/
        - lastSync: timestamp
        - version: string
        - deviceCount: number
```

---

## Future User Management Features

### Phase 7: Enhanced Authentication (Future)

#### Email/Password Authentication
```javascript
// Sign up
await auth.createUserWithEmailAndPassword(email, password);

// Sign in
await auth.signInWithEmailAndPassword(email, password);

// Password reset
await auth.sendPasswordResetEmail(email);
```

#### Google Sign-In
```javascript
const provider = new firebase.auth.GoogleAuthProvider();
await auth.signInWithPopup(provider);
```

#### User Profile Management
```javascript
// Update profile
await auth.currentUser.updateProfile({
  displayName: 'Patryk Prężyna',
  photoURL: 'https://example.com/photo.jpg'
});

// Update email
await auth.currentUser.updateEmail(newEmail);
```

---

## Cost Analysis

### Firebase Free Tier Limits
- **Firestore**: 1 GB storage, 50K reads/day, 20K writes/day
- **Authentication**: Unlimited users
- **Hosting**: 10 GB storage, 360 MB/day bandwidth

### Estimated Usage (Single User)
- **Storage**: ~10 MB (years of data)
- **Reads**: ~100/day (loading data)
- **Writes**: ~50/day (saving progress)

**Conclusion**: Free tier is more than sufficient for personal use and even small teams (5-10 users).

### Scaling Costs
If you exceed free tier:
- **Blaze Plan**: Pay-as-you-go
- **Estimated cost for 100 users**: ~$5-10/month
- **Estimated cost for 1000 users**: ~$50-100/month

---

## Migration Strategy

### Step-by-Step Migration

1. **Week 1: Setup & Development**
   - Create Firebase project
   - Implement authentication
   - Create data service layer
   - Test with sample data

2. **Week 2: Integration**
   - Integrate Firebase into existing app
   - Add migration function
   - Test real-time sync
   - Implement offline support

3. **Week 3: Testing**
   - Test on multiple devices
   - Test offline scenarios
   - Test data migration
   - Fix bugs

4. **Week 4: Deployment**
   - Deploy to production
   - Monitor for issues
   - Gather user feedback

### Rollback Plan
- Keep localStorage as fallback
- Add feature flag to switch between localStorage and Firebase
- Can revert to localStorage-only if issues arise

---

## Alternative: Hybrid Approach

### Best of Both Worlds
- Use localStorage for immediate writes (fast)
- Sync to Firebase in background (persistent)
- Load from Firebase on app start
- Merge conflicts using timestamps

```javascript
class HybridDataService {
  async save(key, value) {
    // Save locally first (instant)
    localStorage.setItem(key, JSON.stringify(value));
    
    // Sync to Firebase in background
    this.syncQueue.push({ key, value });
    this.processSyncQueue();
  }

  async load(key) {
    // Try Firebase first (most recent)
    const firebaseData = await this.loadFromFirebase(key);
    if (firebaseData) return firebaseData;
    
    // Fallback to localStorage
    return JSON.parse(localStorage.getItem(key));
  }
}
```

---

## Implementation Timeline

### Minimal Viable Product (MVP)
- **Time**: 2-3 days
- **Features**: Anonymous auth, basic sync, data persistence
- **Cost**: $0/month

### Full Implementation
- **Time**: 2-3 weeks
- **Features**: User accounts, real-time sync, offline support, migration
- **Cost**: $0/month (free tier)

### With User Management
- **Time**: 3-4 weeks
- **Features**: Email/Google auth, user profiles, team features
- **Cost**: $0-5/month

---

## Recommended Next Steps

1. **Immediate (This Week)**
   - Create Firebase project
   - Set up development environment
   - Implement anonymous authentication
   - Test basic data sync

2. **Short-term (Next 2 Weeks)**
   - Migrate all data models to Firebase
   - Implement real-time sync
   - Add offline support
   - Deploy to production

3. **Medium-term (Next Month)**
   - Add email/Google authentication
   - Implement user profiles
   - Add data export feature
   - Optimize performance

4. **Long-term (Next Quarter)**
   - Add team collaboration features
   - Implement analytics dashboard
   - Add mobile app (PWA)
   - Consider premium features

---

## Conclusion

**Recommended Path**: Start with Firebase using anonymous authentication for immediate cross-device sync, then gradually add user management features as needed.

**Key Benefits**:
- ✅ Data persists across devices and browsers
- ✅ No server management required
- ✅ Free for personal use
- ✅ Easy to scale in the future
- ✅ Can add user management incrementally

**Total Estimated Cost**: $0/month (free tier sufficient)

**Total Implementation Time**: 2-3 weeks for full implementation

---

## Resources

### Documentation
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Getting Started](https://firebase.google.com/docs/firestore/quickstart)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

### Tutorials
- [Firebase + Vue.js Tutorial](https://www.youtube.com/watch?v=p9pgI3Mg-So)
- [Firestore Data Modeling](https://firebase.google.com/docs/firestore/data-model)

### Tools
- [Firebase Console](https://console.firebase.google.com)
- [Firebase CLI](https://firebase.google.com/docs/cli)

---

**Document Version**: 1.0  
**Last Updated**: April 13, 2026  
**Author**: Patryk Prężyna (with Bob)