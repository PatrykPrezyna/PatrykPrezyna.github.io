/**
 * Automated Test Script for Summary Tab Navigation
 * 
 * This script tests the week and day navigation functionality in the Pomodoro Timer app.
 * Run this in the browser console after loading test-synthetic-data.json
 * 
 * Usage:
 * 1. Open pomodoro.html in browser
 * 2. Import test-synthetic-data.json
 * 3. Open browser console (F12)
 * 4. Copy and paste this entire script
 * 5. Run: runAllTests()
 */

// Test utilities
const TestUtils = {
  log: (message, type = 'info') => {
    const styles = {
      info: 'color: blue; font-weight: bold',
      success: 'color: green; font-weight: bold',
      error: 'color: red; font-weight: bold',
      warning: 'color: orange; font-weight: bold'
    };
    console.log(`%c${message}`, styles[type]);
  },
  
  assert: (condition, message) => {
    if (condition) {
      TestUtils.log(`✓ ${message}`, 'success');
      return true;
    } else {
      TestUtils.log(`✗ ${message}`, 'error');
      return false;
    }
  },
  
  sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  getVueApp: () => {
    // Access the Vue app instance
    const appElement = document.querySelector('#app');
    return appElement?.__vue_app__?.config?.globalProperties?.$root || null;
  }
};

// Test data verification
const TestDataVerification = {
  async verifyDataLoaded() {
    TestUtils.log('=== Verifying Test Data ===', 'info');
    
    const projects = JSON.parse(localStorage.getItem('pomodoro_projects') || '[]');
    const tasks = JSON.parse(localStorage.getItem('pomodoro_tasks') || '[]');
    const timeEntries = JSON.parse(localStorage.getItem('pomodoro_time_entries') || '[]');
    
    const results = [];
    results.push(TestUtils.assert(projects.length === 5, `5 projects loaded (found ${projects.length})`));
    results.push(TestUtils.assert(tasks.length === 25, `25 tasks loaded (found ${tasks.length})`));
    results.push(TestUtils.assert(timeEntries.length === 125, `125 time entries loaded (found ${timeEntries.length})`));
    
    // Verify date distribution
    const dates = [...new Set(timeEntries.map(e => e.date))].sort();
    const expectedDates = ['2026-05-19', '2026-05-23', '2026-05-27', '2026-05-31', '2026-06-04'];
    results.push(TestUtils.assert(
      JSON.stringify(dates) === JSON.stringify(expectedDates),
      `Correct date distribution (${dates.join(', ')})`
    ));
    
    // Verify entries per date
    expectedDates.forEach(date => {
      const count = timeEntries.filter(e => e.date === date).length;
      results.push(TestUtils.assert(count === 25, `${date}: 25 entries (found ${count})`));
    });
    
    return results.every(r => r);
  },
  
  getEntriesByDate(date) {
    const timeEntries = JSON.parse(localStorage.getItem('pomodoro_time_entries') || '[]');
    return timeEntries.filter(e => e.date === date);
  },
  
  getEntriesByWeek(weekStart) {
    const timeEntries = JSON.parse(localStorage.getItem('pomodoro_time_entries') || '[]');
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    
    return timeEntries.filter(e => {
      const entryDate = new Date(e.date);
      return entryDate >= start && entryDate < end;
    });
  }
};

// Week navigation tests
const WeekNavigationTests = {
  async testCurrentWeek() {
    TestUtils.log('=== Testing Current Week (June 2-8, 2026) ===', 'info');
    
    // Expected: entries from June 4
    const entries = TestDataVerification.getEntriesByWeek('2026-06-02');
    const expectedCount = 25;
    const expectedMinutes = 625;
    
    const results = [];
    results.push(TestUtils.assert(
      entries.length === expectedCount,
      `Current week has ${expectedCount} entries (found ${entries.length})`
    ));
    
    const totalMinutes = entries.reduce((sum, e) => sum + (e.duration / 60), 0);
    results.push(TestUtils.assert(
      Math.abs(totalMinutes - expectedMinutes) < 1,
      `Current week total: ${expectedMinutes} minutes (found ${totalMinutes.toFixed(0)})`
    ));
    
    return results.every(r => r);
  },
  
  async testPreviousWeek() {
    TestUtils.log('=== Testing Previous Week (May 26 - June 1, 2026) ===', 'info');
    
    // Expected: entries from May 27 and May 31
    const entries = TestDataVerification.getEntriesByWeek('2026-05-26');
    const expectedCount = 50;
    const expectedMinutes = 1250;
    
    const results = [];
    results.push(TestUtils.assert(
      entries.length === expectedCount,
      `Previous week has ${expectedCount} entries (found ${entries.length})`
    ));
    
    const totalMinutes = entries.reduce((sum, e) => sum + (e.duration / 60), 0);
    results.push(TestUtils.assert(
      Math.abs(totalMinutes - expectedMinutes) < 1,
      `Previous week total: ${expectedMinutes} minutes (found ${totalMinutes.toFixed(0)})`
    ));
    
    return results.every(r => r);
  },
  
  async testTwoWeeksAgo() {
    TestUtils.log('=== Testing Two Weeks Ago (May 19-25, 2026) ===', 'info');
    
    // Expected: entries from May 19 and May 23
    const entries = TestDataVerification.getEntriesByWeek('2026-05-19');
    const expectedCount = 50;
    const expectedMinutes = 1250;
    
    const results = [];
    results.push(TestUtils.assert(
      entries.length === expectedCount,
      `Two weeks ago has ${expectedCount} entries (found ${entries.length})`
    ));
    
    const totalMinutes = entries.reduce((sum, e) => sum + (e.duration / 60), 0);
    results.push(TestUtils.assert(
      Math.abs(totalMinutes - expectedMinutes) < 1,
      `Two weeks ago total: ${expectedMinutes} minutes (found ${totalMinutes.toFixed(0)})`
    ));
    
    return results.every(r => r);
  }
};

// Day navigation tests
const DayNavigationTests = {
  async testDayWithData(date, expectedCount = 25) {
    TestUtils.log(`=== Testing Day: ${date} ===`, 'info');
    
    const entries = TestDataVerification.getEntriesByDate(date);
    const expectedMinutes = expectedCount * 25;
    
    const results = [];
    results.push(TestUtils.assert(
      entries.length === expectedCount,
      `${date} has ${expectedCount} entries (found ${entries.length})`
    ));
    
    const totalMinutes = entries.reduce((sum, e) => sum + (e.duration / 60), 0);
    results.push(TestUtils.assert(
      Math.abs(totalMinutes - expectedMinutes) < 1,
      `${date} total: ${expectedMinutes} minutes (found ${totalMinutes.toFixed(0)})`
    ));
    
    // Verify all 5 projects are represented
    const projectIds = [...new Set(entries.map(e => e.projectId))];
    results.push(TestUtils.assert(
      projectIds.length === 5,
      `${date} has entries from all 5 projects (found ${projectIds.length})`
    ));
    
    return results.every(r => r);
  },
  
  async testDayWithoutData(date) {
    TestUtils.log(`=== Testing Day Without Data: ${date} ===`, 'info');
    
    const entries = TestDataVerification.getEntriesByDate(date);
    
    return TestUtils.assert(
      entries.length === 0,
      `${date} has no entries (found ${entries.length})`
    );
  },
  
  async testAllDaysWithData() {
    const datesWithData = ['2026-05-19', '2026-05-23', '2026-05-27', '2026-05-31', '2026-06-04'];
    const results = [];
    
    for (const date of datesWithData) {
      results.push(await this.testDayWithData(date));
    }
    
    return results.every(r => r);
  },
  
  async testDaysWithoutData() {
    const datesWithoutData = ['2026-05-20', '2026-05-21', '2026-05-22', '2026-06-08'];
    const results = [];
    
    for (const date of datesWithoutData) {
      results.push(await this.testDayWithoutData(date));
    }
    
    return results.every(r => r);
  }
};

// Project distribution tests
const ProjectDistributionTests = {
  async testProjectDistribution() {
    TestUtils.log('=== Testing Project Distribution ===', 'info');
    
    const timeEntries = JSON.parse(localStorage.getItem('pomodoro_time_entries') || '[]');
    const projects = JSON.parse(localStorage.getItem('pomodoro_projects') || '[]');
    
    const results = [];
    
    // Each project should have 25 entries (5 tasks × 5 entries per task)
    projects.forEach(project => {
      const projectEntries = timeEntries.filter(e => e.projectId === project.id);
      results.push(TestUtils.assert(
        projectEntries.length === 25,
        `${project.name}: 25 entries (found ${projectEntries.length})`
      ));
      
      const totalMinutes = projectEntries.reduce((sum, e) => sum + (e.duration / 60), 0);
      results.push(TestUtils.assert(
        Math.abs(totalMinutes - 625) < 1,
        `${project.name}: 625 minutes total (found ${totalMinutes.toFixed(0)})`
      ));
    });
    
    return results.every(r => r);
  }
};

// Main test runner
async function runAllTests() {
  console.clear();
  TestUtils.log('╔════════════════════════════════════════════════════════╗', 'info');
  TestUtils.log('║   POMODORO TIMER - SUMMARY NAVIGATION TEST SUITE      ║', 'info');
  TestUtils.log('╚════════════════════════════════════════════════════════╝', 'info');
  console.log('');
  
  const testSuites = [
    { name: 'Data Verification', fn: () => TestDataVerification.verifyDataLoaded() },
    { name: 'Current Week', fn: () => WeekNavigationTests.testCurrentWeek() },
    { name: 'Previous Week', fn: () => WeekNavigationTests.testPreviousWeek() },
    { name: 'Two Weeks Ago', fn: () => WeekNavigationTests.testTwoWeeksAgo() },
    { name: 'Days With Data', fn: () => DayNavigationTests.testAllDaysWithData() },
    { name: 'Days Without Data', fn: () => DayNavigationTests.testDaysWithoutData() },
    { name: 'Project Distribution', fn: () => ProjectDistributionTests.testProjectDistribution() }
  ];
  
  const results = [];
  
  for (const suite of testSuites) {
    console.log('');
    const result = await suite.fn();
    results.push({ name: suite.name, passed: result });
    await TestUtils.sleep(100);
  }
  
  // Summary
  console.log('');
  TestUtils.log('╔════════════════════════════════════════════════════════╗', 'info');
  TestUtils.log('║                    TEST SUMMARY                        ║', 'info');
  TestUtils.log('╚════════════════════════════════════════════════════════╝', 'info');
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  results.forEach(r => {
    const status = r.passed ? '✓' : '✗';
    const type = r.passed ? 'success' : 'error';
    TestUtils.log(`${status} ${r.name}`, type);
  });
  
  console.log('');
  if (passed === total) {
    TestUtils.log(`🎉 ALL TESTS PASSED (${passed}/${total})`, 'success');
  } else {
    TestUtils.log(`⚠️  SOME TESTS FAILED (${passed}/${total})`, 'warning');
  }
  
  return { passed, total, results };
}

// Export for console use
console.log('%c📋 Test script loaded successfully!', 'color: green; font-weight: bold; font-size: 14px');
console.log('%cRun: runAllTests()', 'color: blue; font-weight: bold');
console.log('');
console.log('Available test functions:');
console.log('  - runAllTests()                          // Run all tests');
console.log('  - TestDataVerification.verifyDataLoaded() // Verify data is loaded');
console.log('  - WeekNavigationTests.testCurrentWeek()   // Test current week');
console.log('  - DayNavigationTests.testDayWithData()    // Test specific day');

// Made with Bob
