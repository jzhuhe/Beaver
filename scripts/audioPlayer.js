class AudioPlayer {
    constructor() {
        this.audio = null;
        this.isPlaying = false;
        this.playPauseButton = document.getElementById('playPause');
        this.skipForwardButton = document.getElementById('skipForward');
        this.skipBackwardButton = document.getElementById('skipBackward');
        this.progressBar = document.getElementById('progressBar');
        this.currentTimeDisplay = document.getElementById('currentTime');
        this.durationDisplay = document.getElementById('duration');
        this.speedControl = document.getElementById('playbackSpeed');
    }

    initialize(audio) {
        this.audio = audio;
        this.setupEventListeners();
        this.updateDuration();
        
        // Set initial playback rate
        this.audio.playbackRate = parseFloat(this.speedControl.value);
        this.playPauseButton.textContent = '▶';
    }

    setupEventListeners() {
        this.playPauseButton.addEventListener('click', () => {
            if (!this.audio) return;
            
            if (this.isPlaying) {
                this.audio.pause();
            } else {
                this.audio.play();
            }
        });

        this.skipForwardButton.addEventListener('click', () => this.skipForward());
        this.skipBackwardButton.addEventListener('click', () => this.skipBackward());
        this.progressBar.addEventListener('input', () => this.seek());
        
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('ended', () => {
            this.isPlaying = false;
            this.playPauseButton.textContent = '▶';
        });

        // Handle actual play/pause state changes
        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.playPauseButton.textContent = '⏸';
        });

        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            this.playPauseButton.textContent = '▶';
        });

        // Add speed control event listener
        this.speedControl.addEventListener('change', () => {
            if (this.audio) {
                this.audio.playbackRate = parseFloat(this.speedControl.value);
            }
        });
    }

    skipForward() {
        if (!this.audio) return;
        this.audio.currentTime = Math.min(this.audio.duration, this.audio.currentTime + 30);
    }

    skipBackward() {
        if (!this.audio) return;
        this.audio.currentTime = Math.max(0, this.audio.currentTime - 30);
    }

    seek() {
        if (!this.audio) return;
        const time = (this.progressBar.value / 100) * this.audio.duration;
        this.audio.currentTime = time;
    }

    updateProgress() {
        if (!this.audio) return;
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        this.progressBar.value = progress;
        this.currentTimeDisplay.textContent = this.formatTime(this.audio.currentTime);
    }

    updateDuration() {
        if (!this.audio) return;
        this.durationDisplay.textContent = this.formatTime(this.audio.duration);
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    getCurrentTime() {
        return this.audio ? this.audio.currentTime : 0;
    }

    setCurrentTime(time) {
        if (this.audio) {
            this.audio.currentTime = time;
        }
    }

    cleanup() {
        if (this.audio) {
            this.audio.pause();
            this.audio.src = '';
            this.audio = null;
        }
        this.isPlaying = false;
        this.playPauseButton.textContent = '▶';
        this.progressBar.value = 0;
        this.currentTimeDisplay.textContent = '00:00:00';
        this.durationDisplay.textContent = '00:00:00';
    }
}

// Initialize the audio player when the page loads
window.addEventListener('DOMContentLoaded', () => {
    window.audioPlayer = new AudioPlayer();
}); 