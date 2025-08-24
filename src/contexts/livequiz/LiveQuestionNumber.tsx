import React, { createContext, useContext, useState } from "react";

// Define the shape of the context
interface LiveQuestionNumberContextProps {
  questionNumber: string | undefined;
  setQuestionNumber: (number: string) => void;
}

// Create the context
const LiveQuestionNumberContext = createContext<LiveQuestionNumberContextProps | undefined>(undefined);

// Create the provider component
export const LiveQuestionNumberProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [questionNumber, setQuestionNumber] = useState<string | undefined>("");

  return (
    <LiveQuestionNumberContext.Provider value={{ questionNumber, setQuestionNumber }}>
      {children}
    </LiveQuestionNumberContext.Provider>
  );
};

// Custom hook to use the LiveQuestionNumberContext
export const useLiveQuestionNumber = (): LiveQuestionNumberContextProps => {
  const context = useContext(LiveQuestionNumberContext);
  if (!context) {
    throw new Error("useLiveQuestionNumber must be used within a LiveQuestionNumberProvider");
  }
  return context;
};