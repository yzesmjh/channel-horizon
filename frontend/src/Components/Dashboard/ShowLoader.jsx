import React, { useState, useEffect } from "react";
import { Circles } from "react-loader-spinner";

function ShowLoader({ showLoader, setShowLoader }) {
  const [isOpen, setIsOpen] = useState(showLoader);

  useEffect(() => {
    // Update modal state when `showLoader` prop changes
    if (showLoader) {
      setIsOpen(true);
    }
  }, [showLoader]);

  const closeModal = () => {
    setIsOpen(false);
    setShowLoader(false);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              &times;
            </button>
            <div className="flex flex-col items-center justify-center">
              <Circles
                visible={true}
                height="80"
                width="80"
                color="#100257"
                ariaLabel="grid-loading"
                radius="12.5"
                wrapperStyle={{}}
                wrapperClass="grid-wrapper"
              />
              <p className="mt-4 text-lg">Loading...</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ShowLoader;
