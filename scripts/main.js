// Import the necessary classes
import FileSelector from './fileSelector.js';
import AudioPlayer from './audioPlayer.js';
import VideoPlayer from './videoPlayer.js';
import TranscriptManager from './transcript.js';

console.log('Main.js loaded');

// Initialize the application when the DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

function initializeApp() {
    console.log('DOMContentLoaded event fired in main.js');
    
    // Initialize the audio and video players
    window.audioPlayer = new AudioPlayer();
    console.log('AudioPlayer initialized');
    
    window.videoPlayer = new VideoPlayer();
    console.log('VideoPlayer initialized');
    
    // Initialize the transcript manager
    window.transcriptManager = new TranscriptManager();
    console.log('TranscriptManager initialized');
    
    // Initialize the file selector
    window.fileSelector = new FileSelector();
    console.log('FileSelector initialized');
} 