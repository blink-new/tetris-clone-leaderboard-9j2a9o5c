import React from 'react'
import { GameState } from '../types/tetris'

interface GameStatsProps {
  gameState: GameState
}

export function GameStats({ gameState }: GameStatsProps) {
  return (
    <div className="glass-panel rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-4">Stats</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Score</span>
          <span className="text-xl font-bold text-yellow-400">
            {gameState.score.toLocaleString()}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Level</span>
          <span className="text-lg font-semibold text-indigo-400">
            {gameState.level}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Lines</span>
          <span className="text-lg font-semibold text-green-400">
            {gameState.linesCleared}
          </span>
        </div>
        
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Next Level</span>
            <span className="text-gray-400">
              {10 - (gameState.linesCleared % 10)} lines
            </span>
          </div>
          <div className="mt-2 bg-black/30 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(gameState.linesCleared % 10) * 10}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}