# Project & Task Tracking Feature - Implementation Plan

## Overview
Add project/task management with time tracking to the existing Pomodoro timer application. Users can create projects, assign tasks, track time spent, and receive morning confirmations.

## Data Structure Design

### LocalStorage Schema
```javascript
// New storage keys
STORAGE_KEYS = {
  PROJECTS: 'pomodoro_projects',
  TASKS: 'pomodoro_tasks', 
  TIME_ENTRIES: 'pomodoro_time_entries',
  ACTIVE_TASK: 'pomodoro_active_task',
  LAST_CONFIRMATION: 'pomodoro_last_confirmation'
}

// Project structure
Project = {
  id: string (UUID),
  name: string,
  color: string (hex),
  createdAt: timestamp,
  archived: boolean
}

// Task structure  
Task = {
  id: string (UUID),
  projectId: string,
  name: string,
  description: string,
  createdAt: timestamp,
  completed: boolean,
  estimatedPomodoros: number
}

// Time entry structure
TimeEntry = {
  id: string (UUID),
  taskId: string,
  projectId: string,
  startTime: timestamp,
  endTime: timestamp,
  duration: number (seconds),
  date: string (YYYY-MM-DD),
  pomodorosCompleted: number
}
```

## UI Components

### 1. Main Timer View Enhancement
- Add task selector dropdown above timer
- Display current project/task name
- Show "No task selected" state
- Quick task switch button

### 2. Projects Tab (New Section)
```
Layout:
┌─────────────────────────────────────┐
│ Projects                    [+ New] │
├─────────────────────────────────────┤
│ ● Project A          [Edit] [Del]  │
│   └─ Task 1          [Select]      │
│   └─ Task 2          [Select]      │
│                                     │
│ ● Project B          [Edit] [Del]  │
│   └─ Task 3          [Select]      │
└─────────────────────────────────────┘
```

### 3. Time Summary View (New Section)
```
Layout:
┌─────────────────────────────────────┐
│ Time Summary - Today                │
├─────────────────────────────────────┤
│ Project A: 2h 30m (5 pomodoros)    │
│   └─ Task 1: 1h 15m (3 pomodoros)  │
│   └─ Task 2: 1h 15m (2 pomodoros)  │
│                                     │
│ Project B: 50m (2 pomodoros)       │
│   └─ Task 3: 50m (2 pomodoros)     │
├─────────────────────────────────────┤
│ Total: 3h 20m (7 pomodoros)        │
└─────────────────────────────────────┘
```

### 4. Morning Confirmation Modal
```
┌─────────────────────────────────────┐
│ Good morning! 🌅                    │
│                                     │
│ Yesterday you worked on:            │
│ • Task 1 - 2h 30m                  │
│ • Task 3 - 50m                     │
│                                     │
│ [✓ Correct] [Edit Times]           │
└─────────────────────────────────────┘
```

### 5. Quick Edit Modal
```
┌─────────────────────────────────────┐
│ Edit Time Entry                     │
│                                     │
│ Task: [Dropdown]                   │
│ Date: [Date picker]                │
│ Start: [Time input]                │
│ End: [Time input]                  │
│                                     │
│ [Cancel] [Save]                    │
└─────────────────────────────────────┘
```

## Implementation Steps

### Phase 1: Data Layer (Backend Logic)
1. Create utility functions for UUID generation
2. Implement CRUD operations for projects
3. Implement CRUD operations for tasks
4. Create time entry recording system
5. Add data migration for existing users

### Phase 2: UI Components
1. Add tab navigation to pomodoro.html
2. Create project list component
3. Create task list component  
4. Add task selector to main timer view
5. Build time summary component
6. Create morning confirmation modal
7. Create quick edit modal

### Phase 3: Integration
1. Connect timer to active task tracking
2. Auto-create time entries on pomodoro completion
3. Implement morning notification system
4. Add edit functionality for time entries
5. Update progress tracking to include task context

### Phase 4: Polish
1. Add keyboard shortcuts (P for projects, T for tasks)
2. Add export functionality (CSV/JSON)
3. Add filtering/search for tasks
4. Implement task completion tracking
5. Add visual indicators for active task

## Key Features

### Time Tracking
- Automatically track time when pomodoro is running
- Associate each completed pomodoro with active task
- Store start/end timestamps for accuracy
- Support manual time entry corrections

### Morning Confirmation
- Check on first page load each day
- Show notification if previous day has entries
- Allow quick confirmation or editing
- Persist confirmation state to avoid repeated prompts

### Quick Edit
- Edit task assignment for past pomodoros
- Adjust start/end times if timer was forgotten
- Bulk edit multiple entries
- Validation to prevent overlapping entries

## Technical Considerations

### Performance
- Use indexed data structures for fast lookups
- Lazy load historical data (only current week by default)
- Debounce search/filter operations
- Cache computed summaries

### Data Integrity
- Validate all user inputs
- Prevent orphaned tasks (cascade delete)
- Handle timezone correctly for date boundaries
- Backup data before migrations

### User Experience
- Smooth transitions between views
- Loading states for operations
- Confirmation dialogs for destructive actions
- Keyboard navigation support
- Mobile-responsive design

## File Changes Required

### New Files
- None (all integrated into existing files)

### Modified Files
1. **pomodoro.html** (~300 lines added)
   - Add Projects tab HTML
   - Add Summary tab HTML
   - Add task selector UI
   - Add morning confirmation modal
   - Add quick edit modal

2. **js/pomodoro-app.js** (~500 lines added)
   - Project management methods
   - Task management methods
   - Time entry tracking
   - Morning confirmation logic
   - Summary calculations
   - Quick edit functionality

## Estimated Token Usage
- Reading files: ~2,000 tokens
- Planning: ~3,000 tokens  
- Implementation: ~15,000 tokens
- Testing/refinement: ~5,000 tokens
- **Total: ~25,000 tokens**

## Success Criteria
- ✓ Can create/edit/delete projects
- ✓ Can create/edit/delete tasks per project
- ✓ Can select active task before starting timer
- ✓ Time is automatically tracked per task
- ✓ Morning confirmation appears once per day
- ✓ Can edit past time entries
- ✓ Summary shows accurate time per project/task
- ✓ All data persists in localStorage
- ✓ Existing pomodoro functionality unchanged