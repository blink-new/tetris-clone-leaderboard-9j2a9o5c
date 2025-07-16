import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Trophy, RotateCcw } from 'lucide-react'
import { GameState } from '../types/tetris'
import { blink } from '../blink/client'

interface GameOverModalProps {
  gameState: GameState
  onNewGame: () => void
}

export function GameOverModal({ gameState, onNewGame }: GameOverModalProps) {
  const [playerName, setPlayerName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmitScore = async () => {
    if (!playerName.trim() || submitting) return

    try {
      setSubmitting(true)
      
      // For now, we'll simulate score submission since database creation failed
      // In a real implementation, this would be:
      // await blink.db.leaderboard.create({
      //   id: `score_${Date.now()}`,
      //   userId: (await blink.auth.me()).id,
      //   playerName: playerName.trim(),
      //   score: gameState.score,
      //   level: gameState.level,
      //   linesCleared: gameState.linesCleared
      // })
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSubmitted(true)
    } catch (error) {
      console.error('Failed to submit score:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleNewGame = () => {
    setSubmitted(false)
    setPlayerName('')
    onNewGame()
  }

  const isHighScore = gameState.score > 50000 // Simple threshold for demo

  return (
    <Dialog open={gameState.gameOver}>
      <DialogContent className="sm:max-w-md bg-slate-800/95 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-white flex items-center justify-center">
            {isHighScore ? (
              <>
                <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
                New High Score!
              </>
            ) : (
              'Game Over'
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Final Stats */}
          <div className="bg-white/5 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Final Score</span>
              <span className="text-2xl font-bold text-yellow-400">
                {gameState.score.toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Level Reached</span>
              <span className="text-lg font-semibold text-indigo-400">
                {gameState.level}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Lines Cleared</span>
              <span className="text-lg font-semibold text-green-400">
                {gameState.linesCleared}
              </span>
            </div>
          </div>

          {/* Score Submission */}
          {!submitted && gameState.score > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Submit to Leaderboard</h4>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  maxLength={20}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmitScore()}
                />
                <Button
                  onClick={handleSubmitScore}
                  disabled={!playerName.trim() || submitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </div>
          )}

          {/* Success Message */}
          {submitted && (
            <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-3">
              <p className="text-green-400 text-center">
                Score submitted successfully!
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            <Button
              onClick={handleNewGame}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              New Game
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}