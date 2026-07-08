# Synthetic Data Test Guide

## Overview
This guide provides instructions for testing the Pomodoro Timer's time tracking and summary features using synthetic test data.

## Test Data Summary

### Generated Data
- **File**: `test-synthetic-data.json`
- **Projects**: 5 projects with different colors
- **Tasks**: 25 tasks (5 per project)
- **Time Entries**: 125 time entries (5 per task)
- **Date Range**: May 19, 2026 to June 8, 2026 (3 weeks)
- **Distribution**: Entries on days 0, 4, 8, 13, and 17 of the 21-day period

### Projects
1. **Frontend Development** (#D95550 - Red)
2. **Backend API** (#4A90E2 - Blue)
3. **Database Design** (#50C878 - Green)
4. **Testing & QA** (#FFB347 - Orange)
5. **Documentation** (#9B59B6 - Purple)

### Tasks per Project
Each project has 5 tasks:
- Task 1: 4 estimated pomodoros
- Task 2: 5 estimated pomodoros
- Task 3: 6 estimated pomodoros (marked as completed)
- Task 4: 7 estimated pomodoros
- Task 5: 8 estimated pomodoros

### Time Entry Distribution
Each task has 5 time entries (25 minutes each) on the following dates:
- **Week 1**: May 19, May 23
- **Week 2**: May 27, May 31
- **Week 3**: June 4

## How to Load Test Data

### Method 1: Using Import Feature
1. Open the Pomodoro Timer app (`pomodoro.html`)
2. Navigate to the **Projects** tab
3. Click the **Import** button
4. Select `test-synthetic-data.json`
5. Confirm the import

### Method 2: Direct Browser Console
```javascript
// Load the test data
fetch('test-synthetic-data.json')
  .then(r => r.json())
  .then(data => {
    localStorage.setItem('pomodoro_projects', JSON.stringify(data.data.projects));
    localStorage.setItem('pomodoro_tasks', JSON.stringify(data.data.tasks));
    localStorage.setItem('pomodoro_time_entries', JSON.stringify(data.data.timeEntries));
    location.reload();
  });
```

## Test Scenarios

### Test 1: Week Navigation in Summary Tab

**Objective**: Verify that week navigation correctly displays time entries for different weeks.

**Steps**:
1. Load the test data
2. Navigate to the **Summary** tab
3. Select **Week** view
4. Note the current week's data

**Expected Results**:
- **Current Week (June 2-8, 2026)**: Should show entries from June 4
  - Expected: ~25 entries (5 entries × 5 tasks that have June 4 entries)
  - Total time: ~625 minutes (10.4 hours)

5. Click **Previous Week** button

**Expected Results**:
- **Previous Week (May 26 - June 1, 2026)**: Should show entries from May 27 and May 31
  - Expected: ~50 entries (25 tasks × 2 days)
  - Total time: ~1,250 minutes (20.8 hours)

6. Click **Previous Week** again

**Expected Results**:
- **Two Weeks Ago (May 19-25, 2026)**: Should show entries from May 19 and May 23
  - Expected: ~50 entries (25 tasks × 2 days)
  - Total time: ~1,250 minutes (20.8 hours)

7. Click **Next Week** to navigate forward

**Verification Points**:
- [ ] Week range displays correctly in header
- [ ] Time entries match the expected dates
- [ ] Project breakdown shows correct distribution
- [ ] Total hours calculation is accurate
- [ ] Navigation buttons work correctly
- [ ] Can navigate back to current week

### Test 2: Day Navigation in Summary Tab

**Objective**: Verify that day navigation correctly displays time entries for specific days.

**Steps**:
1. Ensure test data is loaded
2. Navigate to the **Summary** tab
3. Select **Day** view
4. Note today's data (June 8, 2026)

**Expected Results**:
- **June 8, 2026**: Should show 0 entries (no data for this day)
  - Total time: 0 minutes

5. Click **Previous Day** repeatedly to navigate to June 4

**Expected Results**:
- **June 4, 2026**: Should show 25 entries (1 per task)
  - Total time: 625 minutes (10.4 hours)
  - All 5 projects should be represented

6. Continue clicking **Previous Day** to May 31

**Expected Results**:
- **May 31, 2026**: Should show 25 entries
  - Total time: 625 minutes (10.4 hours)

7. Navigate to May 27, May 23, and May 19

**Expected Results for each date**:
- 25 entries per day
- 625 minutes (10.4 hours) per day
- All 5 projects represented

8. Navigate to dates without entries (e.g., May 20, May 21, May 22)

**Expected Results**:
- 0 entries
- 0 minutes
- Empty state message displayed

**Verification Points**:
- [ ] Date displays correctly in header
- [ ] Time entries match the selected date
- [ ] Project breakdown is accurate
- [ ] Total hours calculation is correct
- [ ] Navigation buttons work correctly
- [ ] Empty states display properly for days without data
- [ ] Can navigate to future dates (should show 0 entries)

### Test 3: Project Filtering

**Objective**: Verify that project filtering works correctly in summary view.

**Steps**:
1. Navigate to **Summary** tab
2. Select **Week** view for the week of May 26 - June 1
3. Click on different projects in the project breakdown

**Expected Results**:
- Clicking a project should filter/highlight entries for that project
- Each project should have 10 entries in this week (2 days × 5 tasks)
- Time should be evenly distributed (125 minutes per project)

**Verification Points**:
- [ ] Project filtering works
- [ ] Filtered data is accurate
- [ ] Can clear filter to see all projects
- [ ] Visual indicators show active filter

### Test 4: Data Consistency

**Objective**: Verify data consistency across different views.

**Steps**:
1. Navigate to **Projects** tab
2. Note the number of projects (should be 5)
3. Expand each project and count tasks (should be 5 per project)
4. Navigate to **Summary** tab
5. Check that all projects appear in the breakdown

**Verification Points**:
- [ ] All 5 projects are visible
- [ ] All 25 tasks are accessible
- [ ] Time entries are correctly associated with tasks and projects
- [ ] Completed tasks are marked correctly (task 3 of each project)

### Test 5: Edge Cases

**Objective**: Test edge cases and boundary conditions.

**Test Cases**:
1. Navigate to the earliest date with data (May 19, 2026)
   - Should show 25 entries
   - Previous day should show 0 entries

2. Navigate to the latest date with data (June 4, 2026)
   - Should show 25 entries
   - Next days should show 0 entries

3. Switch between Day and Week views rapidly
   - Data should update correctly
   - No errors in console

4. Navigate to dates far in the past or future
   - Should handle gracefully with 0 entries

**Verification Points**:
- [ ] No JavaScript errors in console
- [ ] UI remains responsive
- [ ] Data displays correctly at boundaries
- [ ] Navigation doesn't break at edges

## Expected Data Distribution by Week

### Week 1 (May 19-25, 2026)
- **Days with data**: May 19, May 23
- **Total entries**: 50
- **Total time**: 1,250 minutes (20.8 hours)

### Week 2 (May 26 - June 1, 2026)
- **Days with data**: May 27, May 31
- **Total entries**: 50
- **Total time**: 1,250 minutes (20.8 hours)

### Week 3 (June 2-8, 2026)
- **Days with data**: June 4
- **Total entries**: 25
- **Total time**: 625 minutes (10.4 hours)

### Total Across All Weeks
- **Total entries**: 125
- **Total time**: 3,125 minutes (52.1 hours)
- **Average per day with data**: 625 minutes (10.4 hours)
- **Average per task**: 125 minutes (2.1 hours)

## Troubleshooting

### Data Not Loading
1. Check browser console for errors
2. Verify `test-synthetic-data.json` is in the correct directory
3. Clear localStorage and try importing again:
   ```javascript
   localStorage.clear();
   location.reload();
   ```

### Incorrect Dates Showing
1. Verify your system date is set correctly
2. Check that the test data dates are in the expected range
3. Inspect the `date` field in time entries

### Missing Entries
1. Check that all 125 entries were imported
2. Verify in browser console:
   ```javascript
   JSON.parse(localStorage.getItem('pomodoro_time_entries')).length
   // Should return 125
   ```

## Success Criteria

The test is successful if:
- ✅ All 5 projects are visible
- ✅ All 25 tasks are accessible
- ✅ All 125 time entries are loaded
- ✅ Week navigation shows correct data for each week
- ✅ Day navigation shows correct data for each day
- ✅ Dates without entries show empty state
- ✅ Project breakdown is accurate
- ✅ Time calculations are correct
- ✅ No JavaScript errors occur
- ✅ UI remains responsive during navigation

## Cleanup

To remove test data and start fresh:
```javascript
localStorage.removeItem('pomodoro_projects');
localStorage.removeItem('pomodoro_tasks');
localStorage.removeItem('pomodoro_time_entries');
location.reload();
```

Or use the Export/Import feature to backup your real data before testing, then restore it afterward.