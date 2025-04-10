class SyncManager {
    constructor() {
        this.audio = null;
        this.transcriptData = null;
        this.updateInterval = null;
    }

    initialize(audio, transcriptData) {
        this.audio = audio;
        this.transcriptData = transcriptData;
        this.startSync();
    }

    startSync() {
        // Update the active word every 100ms
        this.updateInterval = setInterval(() => {
            if (this.audio && window.audioPlayer.isPlaying) {
                const currentTime = this.audio.currentTime;
                window.transcriptManager.updateActiveWord(currentTime);
            }
        }, 100);
    }

    cleanup() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        this.audio = null;
        this.transcriptData = null;
    }
}

// Initialize the sync manager when the page loads
window.addEventListener('DOMContentLoaded', () => {
    window.syncManager = new SyncManager();
}); 