import React from 'react';
import Square from './Square';

type BoardProps = {
  board: Array<'X' | 'O' | null>;
  onSquareClick: (index: number) => void;
  disabledSquares?: boolean[];
};

const Board = ({ board, onSquareClick, disabledSquares = [] }: BoardProps) => {
  return (
    <div className="grid grid-cols-3 gap-2 aspect-square w-full max-w-xl mb-6">
      {board.map((value, index) => (
        <div key={index} className="aspect-square">
          <Square
            key={index}
            value={value}
            onClick={() => onSquareClick(index)}
            disabled={disabledSquares[index] || false}
          />
        </div>
      ))}
    </div>
  );
};

export default Board;