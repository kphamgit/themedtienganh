//import React, { useState } from "react";
import { useImperativeHandle, useState, forwardRef } from 'react';
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import ChatPage, { MessageProps } from '../chat/ChatPage';

export interface ModalHandle {
  openModal: (newValue: boolean, message: MessageProps) => void;
  isModalOpen: () => boolean;
}




//const ModalPopup: React.FC = () => {
  //const ModalPopup = forwardRef<ModalHandle, MessageProps >((message, ref) => {
    const ModalPopup = forwardRef<ModalHandle >((_, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<MessageProps>();
 // const [text, setText] = useState<string>('');
 // const [name, setName] = useState<string>('');

  //const testmessage: MessageProps = {
  //  id: "1",
  //  name: "test",
   // text: "test"
 // }

  useImperativeHandle(ref, () => ({
    openModal(newValue: boolean, message: MessageProps) {
      console.log("openModal YYYY  message", message)
      setMessage(message);
      setIsOpen(newValue);
    },
    isModalOpen() {
      return isOpen;
    }
  }));

  const openPopup = () => {
    setIsOpen(true);
  };
  
  const closePopup = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex justify-center items-center">
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Open Chat in Modal
      </button>

      <Popup open={isOpen} closeOnDocumentClick onClose={() => setIsOpen(false)} modal>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Chat box</h2>
            <p></p>
            
             
            
            {/* Add your content here */}
            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      </Popup>
    </div>
  );
});

export default ModalPopup;
