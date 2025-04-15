# Audio/Video Transcript Synchronizer

A web-based tool for synchronizing audio/video playback with transcript text, similar to Otter.ai. This application allows users to load either an MP3 or MP4 file and its corresponding JSON transcript file to create an interactive audio/video-text experience.

## Features

- **File Selection Interface**
  - Select MP3 audio file or MP4 video file
  - Select corresponding JSON transcript file
  - Simple and intuitive file selection process

- **Interactive Transcript Player**
  - Audio/video player controls (play, pause, skip forward/backward)
  - Progress slider for scrubbing through audio/video
  - Word-level highlighting synchronized with playback
  - Click-to-seek functionality on transcript text
  - Visual feedback for current playback position

- **Video Player Features** (for MP4 files)
  - Full-width video display
  - Synchronized transcript display on the right
  - Controls positioned below the video
  - Same playback controls as audio mode

## Technical Structure

The application is built using the following technologies:

- **Frontend**
  - HTML5 for structure
  - CSS3 for styling
  - JavaScript for interactivity
  - Web Audio API for audio manipulation
  - HTML5 Video API for video playback

- **File Structure**
  ```
  audio-transcript-sync/
  ├── index.html          # Main application page
  ├── styles/
  │   └── main.css       # Styling for the application
  ├── scripts/
  │   ├── fileSelector.js # File selection handling
  │   ├── audioPlayer.js  # Audio playback controls
  │   ├── videoPlayer.js  # Video playback controls
  │   ├── transcript.js   # Transcript parsing and display
  │   └── sync.js        # Audio/video-text synchronization
  └── assets/            # Icons and other static assets
  ```

## JSON Transcript Format

The application expects JSON transcript files in the following format:

```json
{
    "start": 35100,  // Timestamp in centiseconds
    "stop": 35700,   // End timestamp in centiseconds
    "text": "This is the transcript text for this segment."
}
```

## Usage

1. Open the application in a web browser
2. Select your MP3 or MP4 file
3. Select the corresponding JSON transcript file
4. Use the audio/video controls to play/pause and navigate through the transcript
5. Click on any word in the transcript to jump to that position in the audio/video
6. Use the slider to scrub through the audio/video file

## Browser Compatibility

The application uses modern web APIs and is compatible with:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Development

To run the application locally:
1. Clone the repository
2. Open `index.html` in a web browser
3. No build process required - it's a pure frontend application

## Future Enhancements

- Support for different transcript formats
- Export functionality for edited transcripts
- Multiple audio/video file support
- Dark mode
- Keyboard shortcuts
- Mobile device support 