import React from "react";

const Loader = ({ loading }) => {
  return (
    <>
      {loading && (
        <div className="fixed top-8 left-1/2 z-100 w-12 h-12 animate-[spin988_2s_linear_infinite]">
          <div className="absolute w-5 h-5 bg-gray-800 rounded-full top-0 left-0"></div>
          <div className="absolute w-5 h-5 bg-gray-800 rounded-full top-0 right-0"></div>
          <div className="absolute w-5 h-5 bg-gray-800 rounded-full bottom-0 left-0"></div>
          <div className="absolute w-5 h-5 bg-gray-800 rounded-full bottom-0 right-0"></div>
          <style>
            {`
          @keyframes spin988 {
            0% {
              transform: scale(1) rotate(0deg);
            }
            20%, 25% {
              transform: scale(1.3) rotate(90deg);
            }
            45%, 50% {
              transform: scale(1) rotate(180deg);
            }
            70%, 75% {
              transform: scale(1.3) rotate(270deg);
            }
            95%, 100% {
              transform: scale(1) rotate(360deg);
            }
          }
        `}
          </style>
        </div>
      )}
    </>
  );
};

export default Loader;
