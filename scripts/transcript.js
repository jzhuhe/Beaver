class TranscriptManager {
    constructor() {
        this.transcriptContainer = document.getElementById('transcriptText');
        this.transcriptData = null;
        this.wordElements = new Map(); // Map to store word elements and their timestamps
        this.autoScrollEnabled = true;
        this.userScrolling = false;
        this.scrollTimeout = null;
        
        // Get the toggle button
        this.toggleButton = document.getElementById('toggleAutoScroll');
        
        // Add event listener for the toggle button
        this.toggleButton.addEventListener('click', () => {
            this.autoScrollEnabled = !this.autoScrollEnabled;
            this.toggleButton.textContent = `Auto-scroll: ${this.autoScrollEnabled ? 'On' : 'Off'}`;
            this.toggleButton.classList.toggle('active');
        });
        
        // Add scroll event listener to detect manual scrolling
        this.transcriptContainer.addEventListener('scroll', () => {
            this.userScrolling = true;
            
            // Clear any existing timeout
            if (this.scrollTimeout) {
                clearTimeout(this.scrollTimeout);
            }
            
            // Set a timeout to resume automatic scrolling after 2 seconds of no manual scrolling
            this.scrollTimeout = setTimeout(() => {
                this.userScrolling = false;
            }, 2000);
        });
    }

    initialize(transcriptData) {
        this.transcriptData = transcriptData;
        this.renderTranscript();
    }

    renderTranscript() {
        this.transcriptContainer.innerHTML = '';
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
                    const startTime = parseInt(wordElement.dataset.start) / 100; // Convert centiseconds to seconds
                    window.audioPlayer.setCurrentTime(startTime);
                    window.audioPlayer.play();
                });

                segmentElement.appendChild(wordElement);
            });

            this.transcriptContainer.appendChild(segmentElement);
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
        this.transcriptContainer.innerHTML = '';
        this.wordElements.clear();
        this.transcriptData = null;
    }
}

// Initialize the transcript manager when the page loads
window.addEventListener('DOMContentLoaded', () => {
    window.transcriptManager = new TranscriptManager();
}); 