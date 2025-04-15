// Check if the modules are loaded correctly
console.log('checkModules.js loaded');

// Check if the window object has the expected properties
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkModules);
} else {
    checkModules();
}

function checkModules() {
    console.log('DOMContentLoaded event fired in checkModules.js');
    
    // Check if the FileSelector is initialized
    if (window.fileSelector) {
        console.log('FileSelector is initialized');
    } else {
        console.error('FileSelector is not initialized');
    }
    
    // Check if the AudioPlayer is initialized
    if (window.audioPlayer) {
        console.log('AudioPlayer is initialized');
    } else {
        console.error('AudioPlayer is not initialized');
    }
    
    // Check if the VideoPlayer is initialized
    if (window.videoPlayer) {
        console.log('VideoPlayer is initialized');
    } else {
        console.error('VideoPlayer is not initialized');
    }
    
    // Check if the TranscriptManager is initialized
    if (window.transcriptManager) {
        console.log('TranscriptManager is initialized');
    } else {
        console.error('TranscriptManager is not initialized');
    }
    
    // Check if the file input elements are found
    const mediaFileInput = document.getElementById('audioFile');
    const transcriptFileInput = document.getElementById('transcriptFile');
    const loadButton = document.getElementById('loadFiles');
    
    if (mediaFileInput) {
        console.log('Media file input found');
    } else {
        console.error('Media file input not found');
    }
    
    if (transcriptFileInput) {
        console.log('Transcript file input found');
    } else {
        console.error('Transcript file input not found');
    }
    
    if (loadButton) {
        console.log('Load button found');
    } else {
        console.error('Load button not found');
    }
} 