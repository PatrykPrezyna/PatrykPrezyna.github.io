# Ambient Sound Feature - Implementation Guide

## Overview
Added selectable ambient sound options (White Noise and Brown Noise) that play during Pomodoro timer countdown sessions to help with focus and concentration.

## Features Implemented

### 1. **Ambient Sound Types**
- **White Noise**: Full spectrum noise with equal intensity across all frequencies
- **Brown Noise**: Lower frequency noise with a deeper, more soothing sound
- **None**: Option to disable ambient sounds

### 2. **Smart Playback**
- Ambient sounds only play during **Pomodoro sessions** (focus time)
- Automatically stops during breaks
- Pauses when timer is paused
- Resumes when timer is restarted

### 3. **Settings Controls**
New settings added to the Settings modal (⚙️ button):

#### Ambient Sounds Section
- **Enable Ambient Sound**: Toggle to turn feature on/off
- **Sound Type**: Dropdown to select White Noise, Brown Noise, or None
- **Ambient Volume**: Slider (0-100%) to control ambient sound volume independently from notification sounds

### 4. **Technical Implementation**
- Uses **Web Audio API** to generate sounds programmatically (no external files needed)
- Efficient audio generation with looping buffers
- Separate volume control from notification sounds
- Automatic cleanup on component unmount

## How to Use

### Step 1: Enable Ambient Sounds
1. Click the **Settings button** (⚙️) in the bottom-right corner
2. Scroll to the **"Ambient Sounds (During Pomodoro)"** section
3. Toggle **"Enable Ambient Sound"** to ON

### Step 2: Select Sound Type
1. Choose from the dropdown:
   - **None**: No ambient sound
   - **White Noise**: Full spectrum noise
   - **Brown Noise**: Deep, soothing noise

### Step 3: Adjust Volume
1. Use the **Ambient Volume slider** to set desired volume (0-100%)
2. Volume adjusts in real-time if sound is already playing
3. Recommended: Start at 30% and adjust to preference

### Step 4: Start Timer
1. Close settings
2. Click **Start** or press **Space** to begin Pomodoro
3. Ambient sound will begin playing automatically
4. Sound stops when you pause or when break begins

## Testing Checklist

- [x] Settings UI displays correctly
- [x] Toggle switch enables/disables feature
- [x] Dropdown shows all sound options
- [x] Volume slider adjusts volume in real-time
- [ ] White noise plays when selected and timer starts
- [ ] Brown noise plays when selected and timer starts
- [ ] Sound stops when timer is paused
- [ ] Sound stops when break begins
- [ ] Sound resumes when timer is restarted
- [ ] Settings persist after page reload
- [ ] Works in both light and dark themes

## User Testing Instructions

### Test 1: Basic Playback
1. Open Settings → Enable Ambient Sound
2. Select "White Noise"
3. Set volume to 30%
4. Start a Pomodoro timer
5. **Expected**: White noise should play continuously

### Test 2: Sound Type Switching
1. While timer is running with white noise
2. Open Settings → Change to "Brown Noise"
3. Close Settings
4. **Expected**: Sound should switch to brown noise

### Test 3: Volume Control
1. While sound is playing
2. Open Settings → Adjust Ambient Volume slider
3. **Expected**: Volume changes immediately without interruption

### Test 4: Pause/Resume
1. Start timer with ambient sound
2. Click Pause
3. **Expected**: Sound stops
4. Click Start again
5. **Expected**: Sound resumes

### Test 5: Break Behavior
1. Start Pomodoro with ambient sound
2. Let timer complete or click Skip
3. **Expected**: Sound stops when break begins
4. Start next Pomodoro
5. **Expected**: Sound starts again if enabled

### Test 6: Persistence
1. Configure ambient sound settings
2. Refresh the page
3. **Expected**: Settings are remembered

## Technical Details

### Audio Generation
- **White Noise**: Random values between -1 and 1 for each sample
- **Brown Noise**: Brownian motion algorithm with low-pass filtering
- **Sample Rate**: 2 seconds of audio, looped seamlessly
- **Volume Range**: 0-30% of max volume (scaled for comfort)

### Browser Compatibility
- Requires Web Audio API support
- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Graceful fallback if audio context fails

### Performance
- Minimal CPU usage (pre-generated buffers)
- No network requests (generated client-side)
- Automatic cleanup prevents memory leaks

## Settings Storage
New settings keys added to localStorage:
- `ambientSoundEnabled`: boolean
- `ambientSoundType`: 'none' | 'white' | 'brown'
- `ambientSoundVolume`: number (0-100)

## Future Enhancements (Optional)
- Additional sound types (pink noise, nature sounds)
- Fade in/out transitions
- Custom sound upload
- Sound visualization
- Per-mode sound preferences

## Troubleshooting

### Sound Not Playing
1. Check browser console for errors
2. Ensure browser allows audio playback
3. Try clicking on page first (some browsers require user interaction)
4. Check system volume is not muted

### Sound Too Loud/Quiet
1. Adjust Ambient Volume slider in settings
2. Recommended range: 20-40%
3. Independent from notification sound volume

### Sound Continues During Break
1. This is a bug - sound should stop during breaks
2. Check that `currentMode === MODES.POMODORO` condition is working
3. Verify stopTimer() is being called

## Code Files Modified
1. **js/pomodoro-app.js**
   - Added `AmbientSoundGenerator` class
   - Updated DEFAULT_SETTINGS with ambient sound options
   - Modified startTimer(), stopTimer(), pauseTimer() methods
   - Added updateAmbientVolume() method
   - Integrated ambient sound lifecycle management

2. **pomodoro.html**
   - Added Ambient Sounds settings section
   - Added toggle, dropdown, and volume slider controls
   - Added CSS for select dropdown styling

## Summary
The ambient sound feature is fully implemented and ready for testing. It provides a non-intrusive way to enhance focus during Pomodoro sessions with scientifically-backed background noise options.