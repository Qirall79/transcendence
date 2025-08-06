import React from 'react';

type SquareProps = {
  value: 'X' | 'O' | null;
  onClick: () => void;
  disabled?: boolean;
};

const Square = ({ value, onClick, disabled = false }: SquareProps) => {
  return (
    <button
      className={`w-full h-full border border-gray-700 bg-gray-900 flex items-center justify-center text-8xl font-bold
                 ${disabled ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-800 cursor-pointer"}`}
      onClick={onClick}
      disabled={disabled}
      style={{ minHeight: "100px", minWidth: "100px" }}
    >
      {value === 'X' && <span className="text-red-500">X</span>}
      {value === 'O' && <span className="text-blue-500">O</span>}
    </button>
  );
};

export default Square;