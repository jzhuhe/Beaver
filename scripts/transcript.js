class TranscriptManager {
    constructor() {
        this.transcriptContainer = document.getElementById('transcriptText');
        this.transcriptData = null;
        this.wordElements = new Map(); // Map to store word elements and their timestamps
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
                
                // Scroll the word into view if needed
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
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