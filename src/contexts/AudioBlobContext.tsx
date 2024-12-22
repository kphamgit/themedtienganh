import React, { ReactNode, createContext, useState } from "react";

//export const AudioBlobContext = createContext<Blob | undefined>(undefined)

interface AudioBlobContextType {
    audioBlob: Blob | null;
    setAudioBlob: (blob: Blob | null) => void;
  }
  
  interface MyComponentProps {
    children?: ReactNode; 
    // Other props...
  }

  const AudioBlobContext = createContext<AudioBlobContextType>({
    audioBlob: null,
    setAudioBlob: () => {},
  });

//const AudioProvider = ({ children:any }) => {
    const AudioBlobProvider: React.FC<MyComponentProps> = ({ children }) => {
        const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

    return (
        <AudioBlobContext.Provider value={{ audioBlob, setAudioBlob }}>
          {children}
        </AudioBlobContext.Provider>
      );
  };

  export const useAudioBlobContext = () => React.useContext(AudioBlobContext);
  export default AudioBlobProvider;