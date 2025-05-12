class TranscriptManager {
    constructor() {
        this.transcriptContainer = document.getElementById('transcriptText');
        this.videoTranscriptContainer = document.getElementById('videoTranscriptText');
        this.transcriptData = null;
        this.wordElements = new Map(); // Map to store word elements and their timestamps
        this.autoScrollEnabled = true;
        this.userScrolling = false;
        this.scrollTimeout = null;
<<<<<<< HEAD
        this.lastActiveSegment = null;
        this.currentContainer = null;
=======
>>>>>>> parent of aee0385 (Changes?)
        
        // Get the toggle buttons
        this.toggleButton = document.getElementById('toggleAutoScroll');
        this.videoToggleButton = document.getElementById('videoToggleAutoScroll');
        
        // Add event listener for the toggle buttons
        this.toggleButton.addEventListener('click', () => {
            this.autoScrollEnabled = !this.autoScrollEnabled;
            this.toggleButton.textContent = `Auto-scroll: ${this.autoScrollEnabled ? 'On' : 'Off'}`;
            this.toggleButton.classList.toggle('active');
        });
        
        this.videoToggleButton.addEventListener('click', () => {
            this.autoScrollEnabled = !this.autoScrollEnabled;
            this.videoToggleButton.textContent = `Auto-scroll: ${this.autoScrollEnabled ? 'On' : 'Off'}`;
            this.videoToggleButton.classList.toggle('active');
        });
        
        // Add scroll event listeners to detect manual scrolling
        this.transcriptContainer.addEventListener('scroll', () => this.handleScroll(this.transcriptContainer));
        this.videoTranscriptContainer.addEventListener('scroll', () => this.handleScroll(this.videoTranscriptContainer));
    }

    handleScroll(container) {
        this.userScrolling = true;
        this.currentContainer = container;
        
        // Clear any existing timeout
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }
        
        // Set a timeout to resume automatic scrolling after 2 seconds of no manual scrolling
        this.scrollTimeout = setTimeout(() => {
            this.userScrolling = false;
        }, 2000);
    }

    initialize(transcriptData, containerId = 'transcriptText') {
        this.transcriptData = transcriptData;
        this.currentContainer = document.getElementById(containerId);
        this.renderTranscript();
    }

    renderTranscript() {
        if (!this.currentContainer) return;
        
        this.currentContainer.innerHTML = '';
        this.wordElements.clear();

        this.transcriptData.forEach((segment, segmentIndex) => {
            const segmentElement = document.createElement('div');
            segmentElement.className = 'transcript-segment';
            segmentElement.dataset.start = segment.start;
            segmentElement.dataset.stop = segment.stop;

            // Add timestamp
            const timestamp = document.createElement('span');
            timestamp.className = 'transcript-timestamp';
            const startTime = this.formatTime(segment.start / 100); // Convert centiseconds to seconds
            timestamp.textContent = `[${startTime}] `;
            segmentElement.appendChild(timestamp);

            // Split the text into words and create spans for each word
            const words = segment.text.trim().split(/\s+/);
            words.forEach((word, wordIndex) => {
                const wordElement = document.createElement('span');
                wordElement.className = 'transcript-word';
                wordElement.textContent = word + ' ';
                wordElement.dataset.start = segment.start;
                wordElement.dataset.stop = segment.stop;
                
                // Store the word element for later reference
                const key = `${segmentIndex}-${wordIndex}`;
                this.wordElements.set(key, wordElement);

                // Add click event listener for seeking
                wordElement.addEventListener('click', () => {
<<<<<<< HEAD
                    const startTime = wordStart / 100; // Convert centiseconds to seconds
                    if (window.audioPlayer && window.audioPlayer.audio) {
                        window.audioPlayer.setCurrentTime(startTime);
                        window.audioPlayer.play();
                    } else if (window.videoPlayer && window.videoPlayer.video) {
                        window.videoPlayer.video.currentTime = startTime;
                        window.videoPlayer.video.play();
                    }
=======
                    const startTime = parseInt(wordElement.dataset.start) / 100; // Convert centiseconds to seconds
                    window.audioPlayer.setCurrentTime(startTime);
                    window.audioPlayer.play();
>>>>>>> parent of aee0385 (Changes?)
                });

                segmentElement.appendChild(wordElement);
            });

            this.currentContainer.appendChild(segmentElement);
        });
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    updateActiveWord(currentTime) {
        // Convert current time to centiseconds (multiply by 100)
        const currentTimeCentiseconds = Math.floor(currentTime * 100);

        // Remove active class from all words
        this.wordElements.forEach(element => {
            element.classList.remove('active');
        });

        // Find and highlight the current word
        this.wordElements.forEach((element, key) => {
            const start = parseInt(element.dataset.start);
            const stop = parseInt(element.dataset.stop);
            
            if (currentTimeCentiseconds >= start && currentTimeCentiseconds <= stop) {
                element.classList.add('active');
                
                // Only scroll if auto-scroll is enabled
                if (this.autoScrollEnabled) {
                    const rect = element.getBoundingClientRect();
                    const isVisible = (
                        rect.top >= 0 &&
                        rect.left >= 0 &&
                        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                    );
                    
                    if (!isVisible) {
                        element.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }
                }
            }
        });
    }

    cleanup() {
        if (this.transcriptContainer) {
            this.transcriptContainer.innerHTML = '';
        }
        if (this.videoTranscriptContainer) {
            this.videoTranscriptContainer.innerHTML = '';
        }
        this.wordElements.clear();
        this.transcriptData = null;
<<<<<<< HEAD
        this.lastActiveSegment = null;
        this.currentContainer = null;
=======
>>>>>>> parent of aee0385 (Changes?)
    }
}

// Export the TranscriptManager class
export default TranscriptManager; 