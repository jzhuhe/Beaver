# Audio Transcript Synchronizer

A web-based tool for synchronizing audio playback with transcript text, similar to Otter.ai. This application allows users to load an MP3 file and its corresponding JSON transcript file to create an interactive audio-text experience.

## Features

- **File Selection Interface**
  - Select MP3 audio file
  - Select corresponding JSON transcript file
  - Simple and intuitive file selection process

- **Interactive Transcript Player**
  - Audio player controls (play, pause, skip forward/backward)
  - Progress slider for scrubbing through audio
  - Word-level highlighting synchronized with audio playback
  - Click-to-seek functionality on transcript text
  - Visual feedback for current playback position

## Technical Structure

The application is built using the following technologies:

- **Frontend**
  - HTML5 for structure
  - CSS3 for styling
  - JavaScript for interactivity
  - Web Audio API for audio manipulation

- **File Structure**
  ```
  audio-transcript-sync/
  ├── index.html          # Main application page
  ├── styles/
  │   └── main.css       # Styling for the application
  ├── scripts/
  │   ├── fileSelector.js # File selection handling
  │   ├── audioPlayer.js  # Audio playback controls
  │   ├── transcript.js   # Transcript parsing and display
  │   └── sync.js        # Audio-text synchronization
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
2. Select your MP3 audio file
3. Select the corresponding JSON transcript file
4. Use the audio controls to play/pause and navigate through the transcript
5. Click on any word in the transcript to jump to that position in the audio
6. Use the slider to scrub through the audio file

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
- Multiple audio file support
- Dark mode
- Keyboard shortcuts
- Mobile device support 
## Legacy Video Version

The repository previously included experimental video support. You can restore that version by checking out commit e4409a7.

