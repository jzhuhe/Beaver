// Import the SyncManager
import SyncManager from './sync.js';

class FileSelector {
    constructor() {
        console.log('FileSelector constructor called');
        
        // Wait for the DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }
    
    initialize() {
        console.log('FileSelector initialize called');
        
        this.mediaFile = null;
        this.transcriptFile = null;
        this.mediaFileInput = document.getElementById('audioFile');
        this.transcriptFileInput = document.getElementById('transcriptFile');
        this.loadButton = document.getElementById('loadFiles');
        this.fileSelectionScreen = document.getElementById('fileSelectionScreen');
        this.playerScreen = document.getElementById('playerScreen');
        this.videoPlayerScreen = document.getElementById('videoPlayerScreen');
        this.backButton = document.getElementById('backButton');
        this.currentFileName = document.getElementById('currentFileName');

        console.log('FileSelector constructor - Elements found:');
        console.log('Media file input:', this.mediaFileInput);
        console.log('Transcript file input:', this.transcriptFileInput);
        console.log('Load button:', this.loadButton);

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        console.log('Initializing event listeners');
        this.mediaFileInput.addEventListener('change', (e) => {
            console.log('Media file input change event fired');
            this.handleMediaFileSelect(e);
        });
        this.transcriptFileInput.addEventListener('change', (e) => {
            console.log('Transcript file input change event fired');
            this.handleTranscriptFileSelect(e);
        });
        this.loadButton.addEventListener('click', () => {
            console.log('Load button clicked');
            this.loadFiles();
        });
        this.backButton.addEventListener('click', () => {
            console.log('Back button clicked');
            this.goBack();
        });
        console.log('Event listeners initialized');
    }

    handleMediaFileSelect(event) {
        const file = event.target.files[0];
        console.log('Media file selected:', file);
        
        // Check file extension instead of MIME type
        const fileName = file ? file.name.toLowerCase() : '';
        const isMP3 = fileName.endsWith('.mp3');
        const isMP4 = fileName.endsWith('.mp4');
        
        if (file && (isMP3 || isMP4)) {
            this.mediaFile = file;
            console.log('Valid media file:', file.name, file.type);
            this.updateLoadButton();
        } else {
            console.log('Invalid media file type:', file ? file.type : 'no file');
            alert('Please select a valid MP3 or MP4 file');
            this.mediaFileInput.value = '';
            this.mediaFile = null;
            this.updateLoadButton();
        }
    }

    handleTranscriptFileSelect(event) {
        const file = event.target.files[0];
        console.log('Transcript file selected:', file);
        
        // Check file extension instead of MIME type
        const fileName = file ? file.name.toLowerCase() : '';
        const isJSON = fileName.endsWith('.json');
        
        if (file && isJSON) {
            this.transcriptFile = file;
            console.log('Valid transcript file:', file.name, file.type);
            this.updateLoadButton();
        } else {
            console.log('Invalid transcript file type:', file ? file.type : 'no file');
            alert('Please select a valid JSON file');
            this.transcriptFileInput.value = '';
            this.transcriptFile = null;
            this.updateLoadButton();
        }
    }

    updateLoadButton() {
        console.log('Updating load button. Media file:', this.mediaFile, 'Transcript file:', this.transcriptFile);
        this.loadButton.disabled = !(this.mediaFile && this.transcriptFile);
        console.log('Load button disabled:', this.loadButton.disabled);
    }

    async loadFiles() {
        try {
            // Read the transcript file
            const transcriptText = await this.transcriptFile.text();
            const transcriptData = JSON.parse(transcriptText);

            // Determine if it's an audio or video file
            const isVideo = this.mediaFile.type === 'video/mp4';
            
            if (isVideo) {
                // Create video element and set source
                const video = document.getElementById('videoPlayer');
                video.src = URL.createObjectURL(this.mediaFile);
                
                // Switch to video player screen
                this.showVideoPlayerScreen();
                
                // Initialize the video player with the loaded data
                window.videoPlayer.initialize(video);
                
                // Initialize the sync manager with the video element and transcript container
                const transcriptContainer = document.getElementById('videoTranscriptText');
                window.syncManager = new SyncManager(video, transcriptContainer);
                window.syncManager.initialize(transcriptData);
            } else {
                // Create audio element and set source
                const audio = new Audio(URL.createObjectURL(this.mediaFile));
                
                // Switch to audio player screen
                this.showPlayerScreen();
                
                // Initialize the audio player with the loaded data
                window.audioPlayer.initialize(audio);
                
                // Initialize the sync manager with the audio element and transcript container
                const transcriptContainer = document.getElementById('transcriptText');
                window.syncManager = new SyncManager(audio, transcriptContainer);
                window.syncManager.initialize(transcriptData);
            }

            // Update the current file name
            this.currentFileName.textContent = this.mediaFile.name;
        } catch (error) {
            console.error('Error loading files:', error);
            alert('Error loading files. Please make sure both files are valid.');
        }
    }

    showPlayerScreen() {
        this.fileSelectionScreen.classList.remove('active');
        this.videoPlayerScreen.classList.remove('active');
        this.playerScreen.classList.add('active');
    }

    showVideoPlayerScreen() {
        this.fileSelectionScreen.classList.remove('active');
        this.playerScreen.classList.remove('active');
        this.videoPlayerScreen.classList.add('active');
    }

    goBack() {
        this.fileSelectionScreen.classList.add('active');
        this.playerScreen.classList.remove('active');
        this.videoPlayerScreen.classList.remove('active');
        
        // Reset file inputs
        this.mediaFileInput.value = '';
        this.transcriptFileInput.value = '';
        this.mediaFile = null;
        this.transcriptFile = null;
        this.updateLoadButton();

        // Cleanup players
        window.audioPlayer.cleanup();
        window.videoPlayer.cleanup();
        window.syncManager.cleanup();
    }
}

// Export the FileSelector class
export default FileSelector; 