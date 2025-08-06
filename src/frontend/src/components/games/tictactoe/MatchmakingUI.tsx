import React from "react";

type MatchmakingUIProps = {
  onCancel: () => void;
};

const MatchmakingUI = ({ onCancel }: MatchmakingUIProps) => {
  return (
    <div className="mb-6">
      <div className="animate-pulse flex space-x-2 mb-4 justify-center">
        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
      </div>
      <button
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded transition-colors"
        onClick={onCancel}
      >
        Cancel Matchmaking
      </button>
    </div>
  );
};

export default MatchmakingUI;
