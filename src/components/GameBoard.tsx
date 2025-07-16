import React from 'react'
import { GameState, TetrominoType } from '../types/tetris'
import { getDropPosition } from '../utils/tetris'

interface GameBoardProps {
  gameState: GameState
}

export function GameBoard({ gameState }: GameBoardProps) {
  const { board, currentPiece } = gameState

  // Create a display board that includes the current piece and ghost piece
  const displayBoard = board.map(row => [...row])

  // Add ghost piece (preview of where piece will land)
  if (currentPiece && gameState.playing && !gameState.paused) {
    const ghostPosition = getDropPosition(board, currentPiece)
    
    // Add ghost piece to display board
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          const boardY = ghostPosition.y + y
          const boardX = ghostPosition.x + x
          if (boardY >= 0 && boardY < displayBoard.length && boardX >= 0 && boardX < displayBoard[0].length) {
            if (!displayBoard[boardY][boardX]) {
              displayBoard[boardY][boardX] = 'ghost' as TetrominoType
            }
          }
        }
      }
    }
  }

  // Add current piece to display board
  if (currentPiece && gameState.playing) {
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          const boardY = currentPiece.position.y + y
          const boardX = currentPiece.position.x + x
          if (boardY >= 0 && boardY < displayBoard.length && boardX >= 0 && boardX < displayBoard[0].length) {
            displayBoard[boardY][boardX] = currentPiece.type
          }
        }
      }
    }
  }

  return (
    <div className="relative">
      <div className="glass-panel rounded-lg p-4">
        <div className="grid grid-cols-10 gap-0 border-2 border-white/20 rounded bg-black/20 p-2">
          {displayBoard.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${y}-${x}`}
                className={`tetris-cell ${
                  cell === 'ghost' 
                    ? 'ghost' 
                    : cell 
                      ? `filled tetris-piece-${cell.toLowerCase()}` 
                      : ''
                }`}
              />
            ))
          )}
        </div>
        
        {/* Game state overlay */}
        {gameState.paused && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">PAUSED</h3>
              <p className="text-gray-300">Press P to resume</p>
            </div>
          </div>
        )}
        
        {!gameState.playing && !gameState.gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">TETRIS</h3>
              <p className="text-gray-300">Press Start to begin</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}