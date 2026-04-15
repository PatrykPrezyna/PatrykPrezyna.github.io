# Export/Import Data Guide

## Overview

The Pomodoro Timer now includes a complete data backup and restore system. You can export all your projects, tasks, and time entries to a JSON file, and import them back whenever needed.

## Features

✅ **Complete Backup**: Export all projects, tasks, time entries, and settings  
✅ **Easy Restore**: Import data with a single click  
✅ **Data Validation**: Automatic validation prevents corrupted imports  
✅ **User-Friendly**: Clear confirmation dialogs and success messages  
✅ **Portable Format**: Standard JSON format, human-readable  

## How to Export Data

1. Click the **Settings** button (⚙️) in the top-right corner
2. Scroll down to the **Data Management** section
3. Click the **📥 Export Data** button
4. A file named `pomodoro-backup-YYYY-MM-DD.json` will be downloaded automatically
5. Save this file in a safe location (cloud storage, external drive, etc.)

### What Gets Exported

- All projects with their names and colors
- All tasks with descriptions, estimates, and completion status
- All time entries with dates, durations, and timestamps
- Your settings (timer durations, notifications, etc.)
- Export metadata (version, date, app name)

## How to Import Data

1. Click the **Settings** button (⚙️)
2. Scroll down to the **Data Management** section
3. Click the **📤 Import Data** button
4. Select your previously exported JSON file
5. Review the confirmation dialog showing what will be imported
6. Click **OK** to confirm or **Cancel** to abort
7. Your data will be restored immediately

### Important Notes

⚠️ **Importing replaces all current data** - Make sure to export your current data first if you want to keep it  
⚠️ **Only import files exported from this app** - Other JSON files may not work  
⚠️ **Check the confirmation dialog** - It shows exactly what will be imported  

## Use Cases

### 1. Regular Backups
Export your data weekly or monthly to prevent data loss.

### 2. Device Migration
Moving to a new computer? Export from the old device and import on the new one.

### 3. Data Recovery
Accidentally deleted something? Import your last backup to restore it.

### 4. Multiple Profiles
Maintain separate backup files for work and personal projects.

### 5. Sharing Templates
Export a project structure and share it with team members.

## File Format

The exported JSON file has the following structure:

```json
{
  "version": "1.0",
  "exportDate": "2026-04-14T19:00:00.000Z",
  "appName": "Pomodoro Timer",
  "data": {
    "projects": [
      {
        "id": "uuid",
        "name": "Project Name",
        "color": "#D95550"
      }
    ],
    "tasks": [
      {
        "id": "uuid",
        "name": "Task Name",
        "description": "Description",
        "projectId": "uuid",
        "estimatedPomodoros": 4,
        "completed": false
      }
    ],
    "timeEntries": [
      {
        "id": "uuid",
        "taskId": "uuid",
        "projectId": "uuid",
        "startTime": 1713118800000,
        "endTime": 1713120300000,
        "duration": 1500,
        "date": "2026-04-14",
        "pomodorosCompleted": 1
      }
    ],
    "settings": {
      "pomodoroDuration": 25,
      "shortBreakDuration": 5,
      "longBreakDuration": 15,
      "longBreakInterval": 4,
      "autoStartBreaks": false,
      "autoStartPomodoros": false,
      "notificationsEnabled": true,
      "soundEnabled": true,
      "volume": 50,
      "ambientSoundEnabled": false,
      "ambientSoundType": "none",
      "ambientSoundVolume": 30,
      "dailyGoal": 8
    }
  }
}
```

## Troubleshooting

### "Invalid file format" Error
- Make sure you're importing a file that was exported from this app
- Check that the file hasn't been corrupted or manually edited incorrectly
- Try exporting a new backup and importing that

### "Error reading file" Error
- The file may be corrupted
- Try downloading/copying the file again
- Make sure the file extension is `.json`

### Import Doesn't Show My Data
- Refresh the page after importing
- Check that you confirmed the import in the dialog
- Verify the file contains the expected data by opening it in a text editor

### Lost Data After Import
- Import replaces all current data
- If you didn't export before importing, the old data is lost
- Always export current data before importing a backup

## Best Practices

1. **Export regularly** - Set a reminder to export weekly
2. **Name your backups** - Add descriptive names like `pomodoro-backup-work-2026-04-14.json`
3. **Store safely** - Keep backups in cloud storage (Google Drive, Dropbox, etc.)
4. **Test imports** - Occasionally test that your backups can be imported successfully
5. **Multiple backups** - Keep several backup versions, not just the latest one
6. **Before major changes** - Export before deleting projects or making bulk changes

## Privacy & Security

- All data stays on your device - nothing is sent to any server
- Export files are stored locally on your computer
- You control where backup files are saved
- No data is transmitted during export/import operations
- Files are standard JSON format - you can inspect them with any text editor

## Technical Details

- **File Format**: JSON (JavaScript Object Notation)
- **File Size**: Typically 1-100 KB depending on data volume
- **Compatibility**: Works in all modern browsers
- **Storage**: Uses browser's localStorage API
- **Validation**: Automatic structure and data type validation on import

## Support

If you encounter any issues with export/import:

1. Check this guide for troubleshooting steps
2. Verify your browser is up to date
3. Try in a different browser to isolate the issue
4. Check the browser console for error messages (F12 → Console tab)

---

**Version**: 1.0  
**Last Updated**: April 14, 2026  
**Feature Status**: ✅ Stable