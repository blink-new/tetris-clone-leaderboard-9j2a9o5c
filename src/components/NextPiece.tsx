import React from 'react'
import { TetrominoType, TETROMINO_SHAPES } from '../types/tetris'

interface NextPieceProps {
  nextPiece: TetrominoType | null
}

export function NextPiece({ nextPiece }: NextPieceProps) {
  if (!nextPiece) return null

  const shape = TETROMINO_SHAPES[nextPiece][0]
  const maxSize = 4

  return (
    <div className="glass-panel rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-3">Next</h3>
      <div className="flex justify-center">
        <div 
          className="grid gap-0 bg-black/20 p-2 rounded border border-white/10"
          style={{ 
            gridTemplateColumns: `repeat(${maxSize}, minmax(0, 1fr))`,
            width: 'fit-content'
          }}
        >
          {Array(maxSize).fill(null).map((_, y) =>
            Array(maxSize).fill(null).map((_, x) => {
              const hasBlock = y < shape.length && x < shape[y].length && shape[y][x]
              return (
                <div
                  key={`${y}-${x}`}
                  className={`w-4 h-4 border border-slate-700/30 ${
                    hasBlock ? `tetris-piece-${nextPiece.toLowerCase()}` : ''
                  }`}
                />
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}