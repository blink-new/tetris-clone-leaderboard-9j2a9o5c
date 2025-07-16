import React from 'react'
import { Button } from './ui/button'
import { Play, Pause, RotateCw, ArrowLeft, ArrowRight, ArrowDown, Space } from 'lucide-react'
import { GameState } from '../types/tetris'

interface GameControlsProps {
  gameState: GameState
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onMove: (direction: 'left' | 'right' | 'down') => void
  onRotate: () => void
}

export function GameControls({ 
  gameState, 
  onStart, 
  onPause, 
  onResume, 
  onMove, 
  onRotate 
}: GameControlsProps) {
  return (
    <div className="glass-panel rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-4">Controls</h3>
      
      {/* Main game control */}
      <div className="mb-4">
        {!gameState.playing ? (
          <Button 
            onClick={onStart}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Game
          </Button>
        ) : gameState.paused ? (
          <Button 
            onClick={onResume}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            Resume
          </Button>
        ) : (
          <Button 
            onClick={onPause}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            <Pause className="w-4 h-4 mr-2" />
            Pause
          </Button>
        )}
      </div>

      {/* Mobile controls */}
      <div className="space-y-3 md:hidden">
        <div className="grid grid-cols-3 gap-2">
          <div></div>
          <Button
            variant="outline"
            size="sm"
            onClick={onRotate}
            disabled={!gameState.playing || gameState.paused}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RotateCw className="w-4 h-4" />
          </Button>
          <div></div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMove('left')}
            disabled={!gameState.playing || gameState.paused}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMove('down')}
            disabled={!gameState.playing || gameState.paused}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowDown className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMove('right')}
            disabled={!gameState.playing || gameState.paused}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => {/* Hard drop will be implemented */}}
          disabled={!gameState.playing || gameState.paused}
          className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <Space className="w-4 h-4 mr-2" />
          Drop
        </Button>
      </div>

      {/* Keyboard shortcuts info */}
      <div className="mt-4 pt-3 border-t border-white/10 hidden md:block">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Keyboard</h4>
        <div className="space-y-1 text-xs text-gray-400">
          <div className="flex justify-between">
            <span>Move</span>
            <span>← →</span>
          </div>
          <div className="flex justify-between">
            <span>Rotate</span>
            <span>↑</span>
          </div>
          <div className="flex justify-between">
            <span>Soft Drop</span>
            <span>↓</span>
          </div>
          <div className="flex justify-between">
            <span>Hard Drop</span>
            <span>Space</span>
          </div>
          <div className="flex justify-between">
            <span>Pause</span>
            <span>P</span>
          </div>
        </div>
      </div>
    </div>
  )
}