import React from "react";

function CommentInput({ value, setValue, replyingTo, onSubmit, onCancel }) {
  return (
    <div className="mb-6">
      {replyingTo && (
        <p className="text-sm text-gray-600 mb-1">
          Replying to{" "}
          <span className="font-semibold">{value.split(" ")[0]}</span>
        </p>
      )}
      <input
        type="text"
        placeholder={replyingTo ? "Replying..." : "Add a comment..."}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      <div className="flex gap-2">
        <button
          onClick={onSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {replyingTo ? "Reply" : "Comment"}
        </button>
        {replyingTo && (
          <button
            onClick={onCancel}
            className="text-sm text-gray-500 hover:underline"
          >
            Cancel reply
          </button>
        )}
      </div>
    </div>
  );
}

export default CommentInput;
