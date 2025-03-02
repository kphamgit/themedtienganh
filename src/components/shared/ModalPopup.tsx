import React, { useState } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const ModalPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

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
        Help
      </button>

      <Popup open={isOpen} closeOnDocumentClick onClose={() => setIsOpen(false)} modal>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Modal Title</h2>
            <p>This is a modal popup reactjs-popup.</p>
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
};

export default ModalPopup;
