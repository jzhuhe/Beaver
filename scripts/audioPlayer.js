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
    }

    setupEventListeners() {
        this.playPauseButton.addEventListener('click', () => this.togglePlayPause());
        this.skipForwardButton.addEventListener('click', () => this.skipForward());
        this.skipBackwardButton.addEventListener('click', () => this.skipBackward());
        this.progressBar.addEventListener('input', () => this.seek());
        
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('ended', () => this.handleEnded());

        // Add speed control event listener
        this.speedControl.addEventListener('change', () => {
            if (this.audio) {
                this.audio.playbackRate = parseFloat(this.speedControl.value);
            }
        });
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
        this.playPauseButton.textContent = '⏸';
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.playPauseButton.textContent = '▶';
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
        this.playPauseButton.textContent = '▶';
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
        this.currentTimeDisplay.textContent = '0:00';
        this.durationDisplay.textContent = '0:00';
    }
}

// Export the AudioPlayer class
export default AudioPlayer; 