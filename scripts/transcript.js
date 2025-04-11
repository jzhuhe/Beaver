class TranscriptManager {
    constructor() {
        this.transcriptContainer = document.getElementById('transcriptText');
        this.transcriptData = null;
        this.wordElements = new Map(); // Map to store word elements and their timestamps
        this.autoScrollEnabled = true;
        this.userScrolling = false;
        this.scrollTimeout = null;
        this.lastActiveSegment = null;
        
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
        this.lastActiveSegment = null;

        this.transcriptData.forEach((segment, segmentIndex) => {
            const segmentElement = document.createElement('div');
            segmentElement.className = 'transcript-segment';
            segmentElement.dataset.start = segment.start;
            segmentElement.dataset.stop = segment.stop;
            segmentElement.dataset.index = segmentIndex;

            // Add timestamp
            const timestamp = document.createElement('span');
            timestamp.className = 'transcript-timestamp';
            const startTime = this.formatTime(segment.start / 100);
            timestamp.textContent = `[${startTime}] `;
            segmentElement.appendChild(timestamp);

            // Split the text into words and create spans for each word
            const words = segment.text.trim().split(/\s+/);
            const wordTimeInterval = (segment.stop - segment.start) / words.length;

            words.forEach((word, wordIndex) => {
                const wordElement = document.createElement('span');
                wordElement.className = 'transcript-word';
                wordElement.textContent = word;
                
                // Calculate individual word timings
                const wordStart = segment.start + (wordIndex * wordTimeInterval);
                const wordStop = wordStart + wordTimeInterval;
                
                wordElement.dataset.start = Math.floor(wordStart);
                wordElement.dataset.stop = Math.floor(wordStop);
                wordElement.dataset.segmentIndex = segmentIndex;
                
                // Store the word element for later reference
                const key = `${segmentIndex}-${wordIndex}`;
                this.wordElements.set(key, {
                    element: wordElement,
                    start: wordStart,
                    stop: wordStop,
                    segmentIndex: segmentIndex
                });

                // Add click event listener for seeking
                wordElement.addEventListener('click', () => {
                    const startTime = wordStart / 100; // Convert centiseconds to seconds
                    window.audioPlayer.setCurrentTime(startTime);
                    window.audioPlayer.play();
                });

                segmentElement.appendChild(wordElement);
            });

            this.transcriptContainer.appendChild(segmentElement);
        });
    }

    updateActiveWord(currentTime) {
        // Convert current time to centiseconds
        const currentTimeCentiseconds = Math.floor(currentTime * 100);
        
        // Find the current segment first
        let activeSegmentIndex = this.transcriptData.findIndex(segment => 
            currentTimeCentiseconds >= segment.start && currentTimeCentiseconds <= segment.stop
        );

        // If we're between segments, use the previous segment
        if (activeSegmentIndex === -1) {
            activeSegmentIndex = this.transcriptData.findIndex(segment => 
                currentTimeCentiseconds < segment.start
            ) - 1;
        }

        // Remove active class from all words
        this.wordElements.forEach(({element}) => {
            element.classList.remove('active');
        });

        // Find and highlight the current word
        let activeWordFound = false;
        this.wordElements.forEach((wordData, key) => {
            if (wordData.segmentIndex === activeSegmentIndex &&
                currentTimeCentiseconds >= wordData.start && 
                currentTimeCentiseconds <= wordData.stop) {
                
                wordData.element.classList.add('active');
                activeWordFound = true;

                // Handle scrolling if auto-scroll is enabled
                if (this.autoScrollEnabled) {
                    const segment = wordData.element.closest('.transcript-segment');
                    
                    // Only scroll if we're moving to a new segment
                    if (this.lastActiveSegment !== segment) {
                        this.lastActiveSegment = segment;
                        
                        segment.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }
                }
            }
        });

        // If no word is active in the current time, highlight the last word of the previous segment
        if (!activeWordFound && activeSegmentIndex >= 0) {
            const lastWordKey = `${activeSegmentIndex}-${this.getSegmentWordCount(activeSegmentIndex) - 1}`;
            const lastWord = this.wordElements.get(lastWordKey);
            if (lastWord) {
                lastWord.element.classList.add('active');
            }
        }
    }

    getSegmentWordCount(segmentIndex) {
        return this.transcriptData[segmentIndex].text.trim().split(/\s+/).length;
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    cleanup() {
        this.transcriptContainer.innerHTML = '';
        this.wordElements.clear();
        this.transcriptData = null;
        this.lastActiveSegment = null;
    }
}

// Initialize the transcript manager when the page loads
window.addEventListener('DOMContentLoaded', () => {
    window.transcriptManager = new TranscriptManager();
}); 