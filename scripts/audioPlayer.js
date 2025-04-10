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
    }

    initialize(audio) {
        this.audio = audio;
        this.setupEventListeners();
        this.updateDuration();
    }

    setupEventListeners() {
        this.playPauseButton.addEventListener('click', () => this.togglePlayPause());
        this.skipForwardButton.addEventListener('click', () => this.skipForward());
        this.skipBackwardButton.addEventListener('click', () => this.skipBackward());
        this.progressBar.addEventListener('input', () => this.seek());
        
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('ended', () => this.handleEnded());
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        this.audio.play();
        this.isPlaying = true;
        this.playPauseButton.textContent = '⏸ Pause';
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.playPauseButton.textContent = '▶ Play';
    }

    skipForward() {
        this.audio.currentTime = Math.min(this.audio.duration, this.audio.currentTime + 30);
    }

    skipBackward() {
        this.audio.currentTime = Math.max(0, this.audio.currentTime - 30);
    }

    seek() {
        const time = (this.progressBar.value / 100) * this.audio.duration;
        this.audio.currentTime = time;
    }

    updateProgress() {
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        this.progressBar.value = progress;
        this.currentTimeDisplay.textContent = this.formatTime(this.audio.currentTime);
    }

    updateDuration() {
        this.durationDisplay.textContent = this.formatTime(this.audio.duration);
    }

    handleEnded() {
        this.isPlaying = false;
        this.playPauseButton.textContent = '▶ Play';
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
        this.playPauseButton.textContent = '▶ Play';
        this.progressBar.value = 0;
        this.currentTimeDisplay.textContent = '0:00';
        this.durationDisplay.textContent = '0:00';
    }
}

// Initialize the audio player when the page loads
window.addEventListener('DOMContentLoaded', () => {
    window.audioPlayer = new AudioPlayer();
}); 