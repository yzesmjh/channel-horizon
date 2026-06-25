import React, { useState, useEffect } from "react";
import { ThreeCircles } from "react-loader-spinner";

const LoaderModal = ({ showLoader, setShowLoader }) => {
  const [isOpen, setIsOpen] = useState(true); // Modal is open by default
  const [progress, setProgress] = useState(3); // Initial progress is 1%

  // Simulate the loading progress from 1 to 100%
  useEffect(() => {
    if (progress < 100) {
      const timer = setTimeout(() => {
        setProgress((prevProgress) => prevProgress + 1);
      }, 100); // Increase the progress every 100ms

      return () => clearTimeout(timer); // Cleanup the timer if component unmounts
    } else {
      // Once it reaches 100%, you can close the modal or do something else
      const closeTimer = setTimeout(() => {
        setIsOpen(false);
        setShowLoader(!showLoader);
      }, 6000); // Keep the modal for 1 more second before closing

      return () => clearTimeout(closeTimer);
    }
  }, [progress, showLoader]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center p-5 ">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full min-h-[85%] flex flex-col justify-center items-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Loading...
              </h2>
              {/* Loader Progress */}
              <div className="relative w-full h-4  rounded-full flex justify-center items-center">
                <ThreeCircles
                  height="25"
                  width="25"
                  radius="5"
                  color="#100257"
                  ariaLabel="three-circles-loading"
                />
              </div>
              <p className="text-gray-600 mt-2">
                {progress - Math.floor(Math.random() * 3)}%
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoaderModal;
