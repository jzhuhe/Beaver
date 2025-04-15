class SyncManager {
    constructor() {
        this.media = null;
        this.transcriptData = null;
        this.mediaType = null;
        this.currentSegmentIndex = -1;
        this.autoScrollEnabled = true;
    }

    initialize(mediaElement, transcriptData, mediaType = 'audio') {
        this.media = mediaElement;
        this.transcriptData = transcriptData;
        this.mediaType = mediaType;
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.media.addEventListener('timeupdate', () => this.updateHighlighting());
        this.media.addEventListener('seeked', () => this.updateHighlighting());
    }

    updateHighlighting() {
        if (!this.media || !this.transcriptData) return;

        const currentTime = this.media.currentTime * 100; // Convert to centiseconds
        const transcriptContainer = document.getElementById(this.mediaType === 'video' ? 'videoTranscriptText' : 'transcriptText');
        
        // Find the current segment
        let newSegmentIndex = this.findCurrentSegment(currentTime);
        
        if (newSegmentIndex !== this.currentSegmentIndex) {
            // Remove highlight from previous segment
            if (this.currentSegmentIndex >= 0) {
                const prevSegment = transcriptContainer.children[this.currentSegmentIndex];
                if (prevSegment) {
                    prevSegment.classList.remove('active');
                }
            }
            
            // Add highlight to new segment
            if (newSegmentIndex >= 0) {
                const newSegment = transcriptContainer.children[newSegmentIndex];
                if (newSegment) {
                    newSegment.classList.add('active');
                    
                    // Auto-scroll if enabled
                    if (this.autoScrollEnabled) {
                        newSegment.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            }
            
            this.currentSegmentIndex = newSegmentIndex;
        }
    }

    findCurrentSegment(currentTime) {
        for (let i = 0; i < this.transcriptData.length; i++) {
            const segment = this.transcriptData[i];
            if (currentTime >= segment.start && currentTime <= segment.stop) {
                return i;
            }
        }
        return -1;
    }

    seekToTime(timeInSeconds) {
        if (this.media) {
            this.media.currentTime = timeInSeconds;
        }
    }

    cleanup() {
        if (this.media) {
            this.media.removeEventListener('timeupdate', () => this.updateHighlighting());
            this.media.removeEventListener('seeked', () => this.updateHighlighting());
        }
        this.media = null;
        this.transcriptData = null;
        this.currentSegmentIndex = -1;
    }
}

// Initialize the sync manager when the page loads
window.addEventListener('DOMContentLoaded', () => {
    window.syncManager = new SyncManager();
}); 