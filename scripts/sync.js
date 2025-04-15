class SyncManager {
    constructor(mediaElement, transcriptContainer) {
        this.mediaElement = mediaElement;
        this.transcriptContainer = transcriptContainer;
        this.transcriptData = null;
        this.currentSegmentIndex = -1;
        this.currentWordIndex = -1;
        this.isInitialized = false;
    }

    initialize(transcriptData) {
        this.transcriptData = transcriptData;
        this.setupEventListeners();
        this.renderTranscript();
        this.isInitialized = true;
    }

    setupEventListeners() {
        this.mediaElement.addEventListener('timeupdate', () => this.updateHighlighting());
        this.mediaElement.addEventListener('seeked', () => this.updateHighlighting());
        this.mediaElement.addEventListener('ended', () => this.cleanup());
    }

    renderTranscript() {
        if (!this.transcriptData) return;

        this.transcriptContainer.innerHTML = '';
        this.transcriptData.segments.forEach((segment, segmentIndex) => {
            const segmentElement = document.createElement('div');
            segmentElement.className = 'transcript-segment';
            segmentElement.dataset.segmentIndex = segmentIndex;
            segmentElement.dataset.startTime = segment.start;
            segmentElement.dataset.endTime = segment.end;

            const timeElement = document.createElement('span');
            timeElement.className = 'segment-time';
            timeElement.textContent = this.formatTime(segment.start);
            segmentElement.appendChild(timeElement);

            const textElement = document.createElement('span');
            textElement.className = 'segment-text';
            segment.words.forEach((word, wordIndex) => {
                const wordSpan = document.createElement('span');
                wordSpan.className = 'transcript-word';
                wordSpan.dataset.wordIndex = wordIndex;
                wordSpan.dataset.startTime = word.start;
                wordSpan.dataset.endTime = word.end;
                wordSpan.textContent = word.text + ' ';
                textElement.appendChild(wordSpan);
            });
            segmentElement.appendChild(textElement);

            this.transcriptContainer.appendChild(segmentElement);
        });
    }

    updateHighlighting() {
        if (!this.isInitialized) return;

        const currentTime = this.mediaElement.currentTime;
        
        // Update segment highlighting
        const segments = this.transcriptContainer.querySelectorAll('.transcript-segment');
        let newSegmentIndex = -1;
        
        segments.forEach((segment, index) => {
            const startTime = parseFloat(segment.dataset.startTime);
            const endTime = parseFloat(segment.dataset.endTime);
            
            if (currentTime >= startTime && currentTime <= endTime) {
                newSegmentIndex = index;
                segment.classList.add('active');
            } else {
                segment.classList.remove('active');
            }
        });

        // Update word highlighting
        const words = this.transcriptContainer.querySelectorAll('.transcript-word');
        let newWordIndex = -1;
        
        words.forEach((word, index) => {
            const startTime = parseFloat(word.dataset.startTime);
            const endTime = parseFloat(word.dataset.endTime);
            
            if (currentTime >= startTime && currentTime <= endTime) {
                newWordIndex = index;
                word.classList.add('active');
            } else {
                word.classList.remove('active');
            }
        });

        // Auto-scroll to current segment
        if (newSegmentIndex !== this.currentSegmentIndex) {
            this.currentSegmentIndex = newSegmentIndex;
            if (newSegmentIndex !== -1) {
                const currentSegment = segments[newSegmentIndex];
                currentSegment.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        this.currentWordIndex = newWordIndex;
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    cleanup() {
        this.currentSegmentIndex = -1;
        this.currentWordIndex = -1;
        this.transcriptContainer.querySelectorAll('.transcript-segment, .transcript-word').forEach(element => {
            element.classList.remove('active');
        });
    }
}

// Export the SyncManager class
export default SyncManager; 