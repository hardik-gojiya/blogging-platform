import React from "react";
import { X } from "lucide-react";

function ShowPic({ url, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs">
      <div className="relative bg-white p-4 rounded-lg shadow-lg">
        <button
          onClick={onCancel}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
        >
          <X className="w-5 h-5" />
        </button>
        <img
          src={url}
          alt="Preview"
          className="max-w-[90vw] max-h-[80vh] rounded-md"
        />
      </div>
    </div>
  );
}

export default ShowPic;
