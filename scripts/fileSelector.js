class FileSelector {
    constructor() {
        this.audioFile = null;
        this.transcriptFile = null;
        this.audioFileInput = document.getElementById('audioFile');
        this.transcriptFileInput = document.getElementById('transcriptFile');
        this.loadButton = document.getElementById('loadFiles');
        this.fileSelectionScreen = document.getElementById('fileSelectionScreen');
        this.playerScreen = document.getElementById('playerScreen');
        this.backButton = document.getElementById('backButton');
        this.currentFileName = document.getElementById('currentFileName');

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.audioFileInput.addEventListener('change', (e) => this.handleAudioFileSelect(e));
        this.transcriptFileInput.addEventListener('change', (e) => this.handleTranscriptFileSelect(e));
        this.loadButton.addEventListener('click', () => this.loadFiles());
        this.backButton.addEventListener('click', () => this.goBack());
    }

    handleAudioFileSelect(event) {
        const file = event.target.files[0];
        if (file && file.type === 'audio/mpeg') {
            this.audioFile = file;
            this.updateLoadButton();
        } else {
            alert('Please select a valid MP3 file');
            this.audioFileInput.value = '';
            this.audioFile = null;
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
        this.loadButton.disabled = !(this.audioFile && this.transcriptFile);
    }

    async loadFiles() {
        try {
            // Read the transcript file
            const transcriptText = await this.transcriptFile.text();
            const transcriptData = JSON.parse(transcriptText);

            // Create audio element and set source
            const audio = new Audio(URL.createObjectURL(this.audioFile));
            
            // Switch to player screen
            this.showPlayerScreen();
            
            // Initialize the player with the loaded data
            window.audioPlayer.initialize(audio);
            window.transcriptManager.initialize(transcriptData);
            window.syncManager.initialize(audio, transcriptData);

            // Update the current file name
            this.currentFileName.textContent = this.audioFile.name;
        } catch (error) {
            console.error('Error loading files:', error);
            alert('Error loading files. Please make sure both files are valid.');
        }
    }

    showPlayerScreen() {
        this.fileSelectionScreen.classList.remove('active');
        this.playerScreen.classList.add('active');
    }

    goBack() {
        this.playerScreen.classList.remove('active');
        this.fileSelectionScreen.classList.add('active');
        
        // Reset file inputs
        this.audioFileInput.value = '';
        this.transcriptFileInput.value = '';
        this.audioFile = null;
        this.transcriptFile = null;
        this.updateLoadButton();

        // Clean up resources
        window.audioPlayer.cleanup();
        window.transcriptManager.cleanup();
        window.syncManager.cleanup();
    }
}

// Initialize the file selector when the page loads
window.addEventListener('DOMContentLoaded', () => {
    window.fileSelector = new FileSelector();
}); 
