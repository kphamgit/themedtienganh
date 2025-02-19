import React, { useState, useRef } from "react";


interface IBMSTTProps {
  apiKey: string;
  serviceUrl: string;
}

const IBMSTTNew: React.FC<IBMSTTProps> = ({ apiKey, serviceUrl }) => {
  const [transcript, setTranscript] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const ws = useRef<WebSocket | null>(null);

  const getWatsonToken = async () => {
    console.log("apiKey=", apiKey)
    console.log("serviceUrl=", serviceUrl)

    const response = await fetch("https://safe-everglades-30895-04aad70efa48.herokuapp.com/" + `${serviceUrl}/v1/recognize?access_token=${apiKey}`);
    const data = await response.json();
    return data.access_token;
  };

  const startRecording = async () => {
    try {
      const token = await getWatsonToken();
      ws.current = new WebSocket(
        `wss://api.us-south.speech-to-text.watson.cloud.ibm.com/instances/bbcafcae-2824-4e97-a564-92b779fa9830/v1/recognize?access_token=${token}`
      );

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.results) {
          setTranscript(data.results[0].alternatives[0].transcript);
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (event) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          ws.current.send(event.data);
        }
      };
      mediaRecorder.current.start(1000);
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    ws.current?.close();
    setIsRecording(false);
  };

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">IBM Watson Speech-to-Text</h2>
      <p className="mb-4">{transcript || "Start speaking..."}</p>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
    </div>
  );
};

export default IBMSTTNew;