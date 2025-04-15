class VideoPlayer {
    constructor() {
        this.video = null;
        this.isPlaying = false;
        this.playPauseButton = document.getElementById('videoPlayPause');
        this.skipForwardButton = document.getElementById('videoSkipForward');
        this.skipBackwardButton = document.getElementById('videoSkipBackward');
        this.progressBar = document.getElementById('videoProgressBar');
        this.currentTimeDisplay = document.getElementById('videoCurrentTime');
        this.durationDisplay = document.getElementById('videoDuration');
        this.speedControl = document.getElementById('videoPlaybackSpeed');
        this.autoScrollButton = document.getElementById('videoToggleAutoScroll');
        this.autoScrollEnabled = true;
    }

    initialize(videoElement) {
        this.video = videoElement;
        this.setupEventListeners();
        this.updateDuration();
    }

    setupEventListeners() {
        this.playPauseButton.addEventListener('click', () => {
            if (!this.video) return;
            
            if (this.isPlaying) {
                this.video.pause();
            } else {
                this.video.play();
            }
        });

        this.skipForwardButton.addEventListener('click', () => this.skipForward());
        this.skipBackwardButton.addEventListener('click', () => this.skipBackward());
        this.progressBar.addEventListener('input', () => this.seek());
        
        this.video.addEventListener('timeupdate', () => this.updateProgress());
        this.video.addEventListener('loadedmetadata', () => this.updateDuration());
        this.video.addEventListener('ended', () => {
            this.isPlaying = false;
            this.playPauseButton.textContent = '▶';
        });

        this.video.addEventListener('play', () => {
            this.isPlaying = true;
            this.playPauseButton.textContent = '⏸';
        });

        this.video.addEventListener('pause', () => {
            this.isPlaying = false;
            this.playPauseButton.textContent = '▶';
        });

        this.speedControl.addEventListener('change', () => {
            if (this.video) {
                this.video.playbackRate = parseFloat(this.speedControl.value);
            }
        });

        this.autoScrollButton.addEventListener('click', () => {
            this.autoScrollEnabled = !this.autoScrollEnabled;
            this.autoScrollButton.classList.toggle('active');
            this.autoScrollButton.textContent = `Auto-scroll: ${this.autoScrollEnabled ? 'On' : 'Off'}`;
        });
    }

    skipForward() {
        if (this.video) {
            this.video.currentTime = Math.min(this.video.duration, this.video.currentTime + 5);
        }
    }

    skipBackward() {
        if (this.video) {
            this.video.currentTime = Math.max(0, this.video.currentTime - 5);
        }
    }

    seek() {
        if (this.video) {
            const time = (this.progressBar.value / 100) * this.video.duration;
            this.video.currentTime = time;
        }
    }

    updateProgress() {
        if (this.video) {
            const progress = (this.video.currentTime / this.video.duration) * 100;
            this.progressBar.value = progress;
            this.currentTimeDisplay.textContent = this.formatTime(this.video.currentTime);
        }
    }

    updateDuration() {
        if (this.video) {
            this.durationDisplay.textContent = this.formatTime(this.video.duration);
        }
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    cleanup() {
        if (this.video) {
            this.video.pause();
            this.video.src = '';
            this.video = null;
        }
        this.isPlaying = false;
        this.playPauseButton.textContent = '▶';
        this.progressBar.value = 0;
        this.currentTimeDisplay.textContent = '00:00:00';
        this.durationDisplay.textContent = '00:00:00';
    }
}

// Initialize the video player when the page loads
window.addEventListener('DOMContentLoaded', () => {
    window.videoPlayer = new VideoPlayer();
});

// Export the VideoPlayer class
export default VideoPlayer; 