// Import pipeline from Transformers.js
import { pipeline } from '@xenova/transformers';

document.addEventListener('DOMContentLoaded', function() {

    // --- Loading screen handling ---
    const loadingScreen = document.getElementById('loading-screen');
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        // Hide after animation ends to avoid blocking interactions
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500); // This timeout should match CSS transition duration
    }, 1500); // Start fade out after 1.5 seconds
    
    // Get required DOM elements
    let video1 = document.getElementById('video1');
    let video2 = document.getElementById('video2');
    const micButton = document.getElementById('mic-button');
    const favorabilityBar = document.getElementById('favorability-bar');
    const floatingButton = document.getElementById('floating-button');
    const menuContainer = document.getElementById('menu-container');
    const menuItems = document.querySelectorAll('.menu-item');

    // --- Sentiment analysis elements ---
    const sentimentInput = document.getElementById('sentiment-input');
    const analyzeButton = document.getElementById('analyze-button');
    const sentimentResult = document.getElementById('sentiment-result');

    let activeVideo = video1;
    let inactiveVideo = video2;

    // Video list
    const videoList = [
        'videos/3D-modeling-image.mp4',
        'videos/jimeng-2025-07-16-1043-smiling-gracefully.mp4',
        'videos/jimeng-2025-07-16-4437-peace-sign-smiling.mp4',
        'videos/generated-cheering.mp4',
        'videos/generated-dancing.mp4',
        'videos/negative/jimeng-2025-07-16-9418-hands-on-hips-slightly-angry.mp4'
    ];

    // --- Crossfade video switching ---
    function switchVideo() {
        // 1. Choose next video
        const currentVideoSrc = activeVideo.querySelector('source').getAttribute('src');
        let nextVideoSrc = currentVideoSrc;
        while (nextVideoSrc === currentVideoSrc) {
            const randomIndex = Math.floor(Math.random() * videoList.length);
            nextVideoSrc = videoList[randomIndex];
        }

        // 2. Set inactive video source
        inactiveVideo.querySelector('source').setAttribute('src', nextVideoSrc);
        inactiveVideo.load();

        // 3. When inactive video can play, switch
        inactiveVideo.addEventListener('canplaythrough', function onCanPlayThrough() {
            // Make sure the event triggers only once
            inactiveVideo.removeEventListener('canplaythrough', onCanPlayThrough);

            // 4. Play the new video
            inactiveVideo.play().catch(error => {
                console.error("Video play failed:", error);
            });

            // 5. Switch active class to trigger CSS transition
            activeVideo.classList.remove('active');
            inactiveVideo.classList.add('active');

            // 6. Update active and inactive video references
            [activeVideo, inactiveVideo] = [inactiveVideo, activeVideo];

            // Bind ended event to new activeVideo
            activeVideo.addEventListener('ended', switchVideo, { once: true });
        }, { once: true }); // Use { once: true } to ensure one-time handling
    }

    // Initial start
    activeVideo.addEventListener('ended', switchVideo, { once: true });

    // --- Speech recognition core ---
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;

    // Check if browser supports speech recognition
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = true; // Continuous recognition
        recognition.lang = 'zh-CN'; // Set language to Chinese
        recognition.interimResults = true; // Get interim results

        recognition.onresult = (event) => {
            const transcriptContainer = document.getElementById('transcript');
            let final_transcript = '';
            let interim_transcript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;
                } else {
                    interim_transcript += event.results[i][0].transcript;
                }
            }
            
            // Display final recognized text
            transcriptContainer.textContent = final_transcript || interim_transcript;
            
            // Perform sentiment analysis and video switching based on keywords
            if (final_transcript) {
                analyzeAndReact(final_transcript);
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
        };

    } else {
        console.log('Your browser does not support speech recognition.');
        // You may want to show a message to the user here
    }

    // --- Microphone button interaction ---
    let isListening = false;

    micButton.addEventListener('click', function() {
        if (!SpeechRecognition) return; // Do nothing if not supported

        isListening = !isListening;
        micButton.classList.toggle('is-listening', isListening);
        const transcriptContainer = document.querySelector('.transcript-container');
        const transcriptText = document.getElementById('transcript');

        if (isListening) {
            transcriptText.textContent = 'Listening...'; // Show prompt immediately
            transcriptContainer.classList.add('visible');
            recognition.start();
        } else {
            recognition.stop();
            transcriptContainer.classList.remove('visible');
            transcriptText.textContent = ''; // Clear text
        }
    });


    // --- Floating button interaction ---
    floatingButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent event bubbling to document
        menuContainer.classList.toggle('hidden');
    });

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const videoSrc = this.getAttribute('data-video');
            playSpecificVideo(videoSrc);
            menuContainer.classList.add('hidden');
        });
    });

    // Close menu when clicking outside of it
    document.addEventListener('click', () => {
        if (!menuContainer.classList.contains('hidden')) {
            menuContainer.classList.add('hidden');
        }
    });

    // Prevent menu click event from bubbling up
    menuContainer.addEventListener('click', (event) => {
        event.stopPropagation();
    });


    function playSpecificVideo(videoSrc) {
        const currentVideoSrc = activeVideo.querySelector('source').getAttribute('src');
        if (videoSrc === currentVideoSrc) return;

        inactiveVideo.querySelector('source').setAttribute('src', videoSrc);
        inactiveVideo.load();

        inactiveVideo.addEventListener('canplaythrough', function onCanPlayThrough() {
            inactiveVideo.removeEventListener('canplaythrough', onCanPlayThrough);
            activeVideo.pause(); // Pause current video to prevent 'ended' event triggering switch
            inactiveVideo.play().catch(error => console.error("Video play failed:", error));
            activeVideo.classList.remove('active');
            inactiveVideo.classList.add('active');
            [activeVideo, inactiveVideo] = [inactiveVideo, activeVideo];
            activeVideo.addEventListener('ended', switchVideo, { once: true });
        }, { once: true });
    }

    // --- Sentiment analysis and reaction ---
    const positiveWords = ['happy', 'glad', 'like', 'awesome', 'hello', 'beautiful'];
    const negativeWords = ['sad', 'angry', 'hate', 'upset'];

    const positiveVideos = [
        'videos/jimeng-2025-07-16-1043-smiling-gracefully.mp4',
        'videos/jimeng-2025-07-16-4437-peace-sign-smiling.mp4',
        'videos/generated-cheering.mp4',
        'videos/generated-dancing.mp4'
    ];
    const negativeVideo = 'videos/negative/jimeng-2025-07-16-9418-hands-on-hips-slightly-angry.mp4';

    // --- Local model sentiment analysis ---
    let classifier;
    analyzeButton.addEventListener('click', async () => {
        const text = sentimentInput.value;
        if (!text) return;

        sentimentResult.textContent = 'Analyzing...';

        // Initialize classifier on first click
        if (!classifier) {
            try {
                classifier = await pipeline('sentiment-analysis');
            } catch (error) {
                console.error('Model loading failed:', error);
                sentimentResult.textContent = 'Sorry, model loading failed.';
                return;
            }
        }

        // Perform sentiment analysis
        try {
            const result = await classifier(text);
            // Display primary emotion and score
            const primaryEmotion = result[0];
            sentimentResult.textContent = `Emotion: ${primaryEmotion.label}, Score: ${primaryEmotion.score.toFixed(2)}`;
        } catch (error) {
            console.error('Sentiment analysis failed:', error);
            sentimentResult.textContent = 'Error during analysis.';
        }
    });


    // --- Local speech recognition --- //
    const localMicButton = document.getElementById('local-mic-button');
    const localAsrResult = document.getElementById('local-asr-result');

    let recognizer = null;
    let mediaRecorder = null;
    let isRecording = false;

    const handleRecord = async () => {
        // Toggle recording state: stop if recording
        if (isRecording) {
            mediaRecorder.stop();
            isRecording = false;
            localMicButton.textContent = 'Start Local Recognition';
            localMicButton.classList.remove('recording');
            return;
        }

        // Initialize model (once only)
        if (!recognizer) {
            localAsrResult.textContent = 'Loading speech recognition model...';
            try {
                recognizer = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny');
                localAsrResult.textContent = 'Model loaded, please start speaking...';
            } catch (error) {
                console.error('Model loading failed:', error);
                localAsrResult.textContent = 'Sorry, model loading failed.';
                return;
            }
        }

        // Start recording
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            const audioChunks = [];

            mediaRecorder.addEventListener("dataavailable", event => {
                audioChunks.push(event.data);
            });

            mediaRecorder.addEventListener("stop", async () => {
                const audioBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType });
                const arrayBuffer = await audioBlob.arrayBuffer();
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                
                // Check if audio data is empty
                if (arrayBuffer.byteLength === 0) {
                    localAsrResult.textContent = 'No audio recorded, please try again.';
                    return;
                }

                try {
                    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
                    const rawAudio = audioBuffer.getChannelData(0);
    
                    localAsrResult.textContent = 'Recognizing...';
                    const output = await recognizer(rawAudio);
                    localAsrResult.textContent = output.text || 'No speech detected.';
                } catch(e) {
                    console.error('Audio decoding or recognition failed:', e);
                    localAsrResult.textContent = 'Error processing audio, please try again.';
                }
            });

            mediaRecorder.start();
            isRecording = true;
            localMicButton.textContent = 'Recording... Click to stop';
            localMicButton.classList.add('recording');

        } catch (error) {
            console.error('Speech recognition failed:', error);
            localAsrResult.textContent = 'Cannot access microphone or recognition error.';
            isRecording = false; // Reset state
            localMicButton.textContent = 'Start Local Recognition';
            localMicButton.classList.remove('recording');
        }
    };

    localMicButton.addEventListener('click', handleRecord);


    function analyzeAndReact(text) {
        let reaction = 'neutral'; // Default neutral

        if (positiveWords.some(word => text.includes(word))) {
            reaction = 'positive';
        } else if (negativeWords.some(word => text.includes(word))) {
            reaction = 'negative';
        }

        if (reaction !== 'neutral') {
            switchVideoByEmotion(reaction);
        }
    }

    function switchVideoByEmotion(emotion) {
        let nextVideoSrc;
        if (emotion === 'positive') {
            const randomIndex = Math.floor(Math.random() * positiveVideos.length);
            nextVideoSrc = positiveVideos[randomIndex];
        } else { // negative
            nextVideoSrc = negativeVideo;
        }

        // Avoid playing the same video repeatedly
        const currentVideoSrc = activeVideo.querySelector('source').getAttribute('src');
        if (nextVideoSrc === currentVideoSrc) return;

        // --- Similar logic to switchVideo function for switching videos ---
        inactiveVideo.querySelector('source').setAttribute('src', nextVideoSrc);
        inactiveVideo.load();

        inactiveVideo.addEventListener('canplaythrough', function onCanPlayThrough() {
            inactiveVideo.removeEventListener('canplaythrough', onCanPlayThrough);
            activeVideo.pause(); // Pause current video to prevent 'ended' event triggering switch
            inactiveVideo.play().catch(error => console.error("Video play failed:", error));
            activeVideo.classList.remove('active');
            inactiveVideo.classList.add('active');
            [activeVideo, inactiveVideo] = [inactiveVideo, activeVideo];
            // After emotion-triggered video ends, return to random play
            activeVideo.addEventListener('ended', switchVideo, { once: true });
        }, { once: true });
    }

});
