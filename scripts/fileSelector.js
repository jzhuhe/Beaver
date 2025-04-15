class FileSelector {
    constructor() {
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

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.mediaFileInput.addEventListener('change', (e) => this.handleMediaFileSelect(e));
        this.transcriptFileInput.addEventListener('change', (e) => this.handleTranscriptFileSelect(e));
        this.loadButton.addEventListener('click', () => this.loadFiles());
        this.backButton.addEventListener('click', () => this.goBack());
    }

    handleMediaFileSelect(event) {
        const file = event.target.files[0];
        if (file && (file.type === 'audio/mpeg' || file.type === 'video/mp4')) {
            this.mediaFile = file;
            this.updateLoadButton();
        } else {
            alert('Please select a valid MP3 or MP4 file');
            this.mediaFileInput.value = '';
            this.mediaFile = null;
            this.updateLoadButton();
        }
    }

    handleTranscriptFileSelect(event) {
        const file = event.target.files[0];
        if (file && file.type === 'application/json') {
            this.transcriptFile = file;
            this.updateLoadButton();
        } else {
            alert('Please select a valid JSON file');
            this.transcriptFileInput.value = '';
            this.transcriptFile = null;
            this.updateLoadButton();
        }
    }

    updateLoadButton() {
        this.loadButton.disabled = !(this.mediaFile && this.transcriptFile);
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
                window.transcriptManager.initialize(transcriptData, 'videoTranscriptText');
                window.syncManager.initialize(video, transcriptData, 'video');
            } else {
                // Create audio element and set source
                const audio = new Audio(URL.createObjectURL(this.mediaFile));
                
                // Switch to audio player screen
                this.showPlayerScreen();
                
                // Initialize the audio player with the loaded data
                window.audioPlayer.initialize(audio);
                window.transcriptManager.initialize(transcriptData, 'transcriptText');
                window.syncManager.initialize(audio, transcriptData, 'audio');
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
        window.transcriptManager.cleanup();
        window.syncManager.cleanup();
    }
}

// Initialize the file selector when the page loads
window.addEventListener('DOMContentLoaded', () => {
    window.fileSelector = new FileSelector();
}); 