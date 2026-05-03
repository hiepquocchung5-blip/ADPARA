import React, { useState } from 'react';

// Very basic visual representation for the chess board layout
const initialBoard = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
];

const pieceMap: Record<string, string> = {
  'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
  'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};

export default function ChessAiGame() {
  const [board] = useState(initialBoard);

  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-900 overflow-hidden relative">
      <div className="absolute top-8 text-center text-white">
        <h2 className="text-xl font-bold uppercase tracking-widest text-brand-indigo mb-1">Grandmaster AI</h2>
        <p className="text-xs text-slate-400">Stockfish engine initializing in background...</p>
      </div>

      <div className="border-4 border-slate-700 rounded bg-slate-200">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((piece, colIndex) => {
              const isBlack = (rowIndex + colIndex) % 2 === 1;
              return (
                <div 
                  key={colIndex} 
                  className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-3xl sm:text-4xl ${isBlack ? 'bg-indigo-900/60' : 'bg-slate-200'}`}
                >
                  {piece ? <span className={piece.toUpperCase() === piece ? 'text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]' : 'text-black'}>{pieceMap[piece]}</span> : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
