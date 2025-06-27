// PronunciationAssessment.tsx
import React, { useEffect, useState } from 'react';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

const AzureSpeechAssessor = () => {
  const [recognizedText, setRecognizedText] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const subscriptionKey = '0a1e83a35c7642c49b193de23611e07f';
  const serviceRegion = 'eastus'; // e.g., 'eastus'
  const referenceText = 'Mother';
  
  // config: SpeechConfig.fromSubscription('0a1e83a35c7642c49b193de23611e07f', 'eastus')

  const startAssessment = () => {
    setIsRecording(true);

    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
    speechConfig.speechRecognitionLanguage = 'en-US';

    const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

    const config = new SpeechSDK.PronunciationAssessmentConfig(
      referenceText,
      SpeechSDK.PronunciationAssessmentGradingSystem.HundredMark,
      SpeechSDK.PronunciationAssessmentGranularity.Word,
      true // enable miscue
    );

    config.applyTo(recognizer);

    recognizer.recognizeOnceAsync(result => {
      setIsRecording(false);
      setRecognizedText(result.text);

      const json = result.properties.getProperty(SpeechSDK.PropertyId.SpeechServiceResponse_JsonResult);
      const parsed = JSON.parse(json);
      console.log('Recognition Result:', parsed);

      if (parsed && parsed.NBest && parsed.NBest[0].PronunciationAssessment) {
        const accuracyScore = parsed.NBest[0].PronunciationAssessment.AccuracyScore;
        setScore(accuracyScore);
      } else {
        setScore(null);
      }

      recognizer.close();
    });
  };

  useEffect(() => {
    console.log('Recognized Text:', recognizedText);
  }, [recognizedText]);

  return (
    <div className="p-4 border rounded shadow max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Pronunciation Assessment</h2>
      <p className="mb-2">Reference Text:</p>
      <blockquote className="italic mb-4">"{referenceText}"</blockquote>

      <button
        onClick={startAssessment}
        disabled={isRecording}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {isRecording ? 'Listening...' : 'Start Speaking'}
      </button>

      {recognizedText && (
        <div className="mt-4">
          <p><strong>You said:</strong> {recognizedText}</p>
          {score !== null && (
            <p><strong>Accuracy Score:</strong> {score.toFixed(2)}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AzureSpeechAssessor;
