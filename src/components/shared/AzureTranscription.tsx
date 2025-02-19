import React, { useState } from 'react';
import { SpeechConfig, AudioConfig, SpeechRecognizer } from 'microsoft-cognitiveservices-speech-sdk';

const AzureTranscription: React.FC = () => {
    const [transcript, setTranscript] = useState<string>('');
    const [isRecording, setIsRecording] = useState<boolean>(false);

    const startRecognition = async () => {
        //const speechConfig = SpeechConfig.fromSubscription('YourAzureSubscriptionKey', 'YourServiceRegion');
        const speechConfig = SpeechConfig.fromSubscription(
              '0a1e83a35c7642c49b193de23611e07f',
              'eastus'
            );
        const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
        const recognizer = new SpeechRecognizer(speechConfig, audioConfig);

        recognizer.recognizing = (s, e) => {
            setTranscript(e.result.text);
        };

        recognizer.recognized = (s, e) => {
            //if (e.result.reason === ResultReason.RecognizedSpeech) {
            console.log(`RECOGNIZED: Text=${e.result.text}`);
                setTranscript(e.result.text);
           // } else if (e.result.reason === ResultReason.NoMatch) {
            //    console.log('No speech could be recognized.');
           // }
        };

        recognizer.canceled = (s, e) => {
            console.error(`CANCELED: Reason=${e.reason}`);
            //if (e.reason === CancellationReason.Error) {
               // console.error(`CANCELED: ErrorDetails=${e.errorDetails}`);
           // }
            recognizer.stopContinuousRecognitionAsync();
        };

        recognizer.sessionStopped = (s, e) => {
            console.log('Session stopped.');
            recognizer.stopContinuousRecognitionAsync();
        };

        recognizer.startContinuousRecognitionAsync();
        setIsRecording(true);
    };

    const stopRecognition = () => {
        setIsRecording(false);
    };

    return (
        <div>
            <h1>Azure Speech to to Text</h1>
            <button onClick={isRecording ? stopRecognition : startRecognition}>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            <p>{transcript}</p>
        </div>
    );
};

export default AzureTranscription;