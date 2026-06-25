import React, { useState } from 'react';
import TransferForm from './TransferForm';

const MyModal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center w-full justify-center z-50">
      <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
      <div className="bg-white rounded-lg p-8 z-50 sm:w-1/2 w-[90%]">
        <div className="flex justify-between">
        <p className="text-lg">{title}</p>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Modal = ({caption, captionButton, modalContent}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
    {
        captionButton ?
        <button onClick={openModal} className="bg-gradient-to-r from-[#100257] to-[#BA0D76] 
                  dark:from-[#100257] dark:to-[#BA0D76] hover:from-[#0d0148] hover:to-[#e01c92]
 text-white cursor-pointer font-bold py-2 px-4 rounded">
        {caption}
      </button>
         : <span onClick={openModal} className='cursor-pointer'>
         
         {caption}
         </span>
    }
      
      <MyModal isOpen={isOpen} title={caption} onClose={closeModal}>
        <div className='flex justify-center max-h-[70vh] h-auto overflow-auto'>
        
        {modalContent}
        </div>
      </MyModal>
    </div>
  );
};

export default Modal;
