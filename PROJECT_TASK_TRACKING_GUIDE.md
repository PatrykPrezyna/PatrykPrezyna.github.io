# Project & Task Tracking Feature - User Guide

## Overview
The Pomodoro Timer now includes comprehensive project and task tracking with automatic time recording. This feature helps you understand where your time goes and maintain accountability for your work.

## Features Implemented

### ✅ 1. Project Management
- Create unlimited projects with custom names and colors
- Edit project details anytime
- Delete projects (removes all associated tasks)
- Visual color coding for easy identification

### ✅ 2. Task Management
- Create tasks within projects
- Add descriptions and estimated pomodoros
- Mark tasks as complete
- Edit or delete tasks
- Select active task before starting timer

### ✅ 3. Automatic Time Tracking
- Time is automatically recorded when you complete a pomodoro with a task selected
- Each time entry includes:
  - Task and project association
  - Start and end timestamps
  - Duration in seconds
  - Number of pomodoros completed
  - Date of work

### ✅ 4. Three View Tabs
- **Timer View**: Original pomodoro timer with task selector
- **Projects View**: Manage projects and tasks
- **Summary View**: See time spent per project/task

### ✅ 5. Morning Confirmation
- On first visit each day, see what you worked on yesterday
- Quick confirmation to acknowledge the summary
- Option to edit if you forgot to start the timer

### ✅ 6. Manual Time Entry
- Add time entries manually if you forgot to start the timer
- Edit existing time entries
- Delete incorrect entries
- Specify task, date, start time, and end time

### ✅ 7. Daily Summary
- See total time and pomodoros for today
- Breakdown by project and task
- Visual representation with project colors
- Human-readable time format (e.g., "2h 30m")

## How to Use

### Getting Started

1. **Open the Pomodoro Timer**
   - Navigate to `pomodoro.html` in your browser
   - You'll see three tabs: Timer, Projects, Summary

2. **Create Your First Project**
   - Click the "Projects" tab
   - Click "+ New Project"
   - Enter project name and choose a color
   - Click "Save"

3. **Add Tasks to Your Project**
   - In the Projects view, click the ➕ icon next to your project
   - Enter task name, description (optional), and estimated pomodoros
   - Click "Save"

4. **Start Working**
   - Go back to the "Timer" tab
   - Select your task from the "Working on:" dropdown
   - Start the pomodoro timer as usual
   - Time will be automatically tracked!

### Managing Projects & Tasks

#### Create a Project
1. Go to Projects tab
2. Click "+ New Project"
3. Fill in name and color
4. Click "Save"

#### Edit a Project
1. Click the ✏️ icon next to the project
2. Modify name or color
3. Click "Save"

#### Delete a Project
1. Click the 🗑️ icon next to the project
2. Confirm deletion
3. All tasks in the project will also be deleted

#### Create a Task
1. Click the ➕ icon next to a project
2. Enter task details
3. Click "Save"

#### Select Active Task
- **From Timer View**: Use the dropdown at the top
- **From Projects View**: Click "Select" button next to a task

#### Complete a Task
- Check the checkbox next to the task name
- Completed tasks are shown with strikethrough
- Completed tasks cannot be selected as active

### Viewing Time Summary

1. Click the "Summary" tab
2. See today's total time and pomodoros
3. View breakdown by project
4. Each project shows its tasks and time spent

### Manual Time Entry

If you forgot to start the timer:

1. Go to Summary tab
2. Click "+ Add Time"
3. Select the task
4. Enter date, start time, and end time
5. Click "Save"

The system will calculate duration and pomodoros automatically.

### Morning Confirmation

Each morning when you first open the app:
- A modal shows yesterday's work
- Review the summary
- Click "Got it!" to confirm
- Or go to Summary tab to edit entries

## Keyboard Shortcuts

### Timer View
- `Space` - Start/Pause timer
- `R` - Reset timer
- `S` - Skip to next session
- `1` - Switch to Pomodoro mode
- `2` - Switch to Short Break mode
- `3` - Switch to Long Break mode

### Navigation
- `T` - Switch to Timer view
- `P` - Switch to Projects view
- `U` - Switch to Summary view
- `,` - Open settings
- `Esc` - Close any open modal

## Data Storage

All data is stored locally in your browser using localStorage:
- Projects: `pomodoro_projects`
- Tasks: `pomodoro_tasks`
- Time Entries: `pomodoro_time_entries`
- Active Task: `pomodoro_active_task`
- Last Confirmation: `pomodoro_last_confirmation`

**Important**: Data is stored per browser. If you clear browser data, you'll lose your tracking history.

## Tips & Best Practices

1. **Create Projects for Different Areas**
   - Work projects
   - Personal projects
   - Learning/courses
   - Side projects

2. **Break Down Large Tasks**
   - Create smaller, manageable tasks
   - Estimate pomodoros realistically
   - Mark tasks complete as you finish them

3. **Review Your Summary Daily**
   - Check the Summary tab at end of day
   - See where your time went
   - Adjust planning for tomorrow

4. **Use Morning Confirmation**
   - Review yesterday's work each morning
   - Catch any missed timer starts
   - Add manual entries if needed

5. **Select Task Before Starting**
   - Always select a task before starting a pomodoro
   - Time won't be tracked without a selected task
   - You'll see "No task selected" if nothing is chosen

## Troubleshooting

### Time Not Being Tracked
- **Issue**: Completed pomodoro but no time entry
- **Solution**: Make sure you selected a task before starting the timer

### Can't See Projects Tab
- **Issue**: Only seeing timer view
- **Solution**: Look for the view tabs at the top (⏱️ Timer | 📁 Projects | 📊 Summary)

### Morning Confirmation Not Showing
- **Issue**: No modal on first visit
- **Solution**: This only shows if you had time entries yesterday

### Lost Data
- **Issue**: Projects/tasks disappeared
- **Solution**: Data is stored in browser localStorage. Clearing browser data removes it. No recovery possible.

### Task Dropdown Empty
- **Issue**: Can't select a task
- **Solution**: Create a project and add tasks first in the Projects view

## Technical Details

### Data Structure

```javascript
// Project
{
  id: "uuid",
  name: "Project Name",
  color: "#D95550",
  createdAt: 1234567890,
  archived: false
}

// Task
{
  id: "uuid",
  projectId: "project-uuid",
  name: "Task Name",
  description: "Optional description",
  createdAt: 1234567890,
  completed: false,
  estimatedPomodoros: 4
}

// Time Entry
{
  id: "uuid",
  taskId: "task-uuid",
  projectId: "project-uuid",
  startTime: 1234567890,
  endTime: 1234567900,
  duration: 1500, // seconds
  date: "2026-04-13",
  pomodorosCompleted: 1
}
```

### Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Responsive design

## Future Enhancements (Not Yet Implemented)

Potential features for future versions:
- Export data to CSV/JSON
- Weekly/monthly summaries
- Charts and visualizations
- Task priorities
- Project archiving
- Time entry editing from summary view
- Bulk operations
- Search and filter
- Tags for tasks
- Recurring tasks

## Support

For issues or questions:
1. Check this guide first
2. Review the implementation plan in `PROJECT_TASK_TRACKING_PLAN.md`
3. Inspect browser console for errors
4. Check localStorage in browser DevTools

---

**Version**: 1.0.0  
**Last Updated**: April 13, 2026  
**Author**: Patryk Prężyna (with Bob)