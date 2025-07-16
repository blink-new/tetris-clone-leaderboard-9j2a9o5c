import React, { useState, useEffect } from 'react'
import { GameBoard } from './components/GameBoard'
import { NextPiece } from './components/NextPiece'
import { GameStats } from './components/GameStats'
import { GameControls } from './components/GameControls'
import { Leaderboard } from './components/Leaderboard'
import { GameOverModal } from './components/GameOverModal'
import { useGame } from './hooks/useGame'
import { blink } from './blink/client'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const { gameState, startGame, pauseGame, resumeGame, movePiece, rotatePiece } = useGame()
  
  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <h1 className="text-4xl font-bold text-white mb-4">Tetris Clone</h1>
          <p className="text-gray-400 mb-8">Please sign in to play and compete on the leaderboard</p>
          <button
            onClick={() => blink.auth.login()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Sign In to Play
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Tetris Clone</h1>
          <p className="text-gray-400">Classic block-stacking puzzle game</p>
        </div>
        
        {/* Game Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Stats and Next Piece */}
          <div className="lg:col-span-1 space-y-4">
            <GameStats gameState={gameState} />
            <NextPiece nextPiece={gameState.nextPiece} />
            <GameControls
              gameState={gameState}
              onStart={startGame}
              onPause={pauseGame}
              onResume={resumeGame}
              onMove={movePiece}
              onRotate={rotatePiece}
            />
          </div>
          
          {/* Center - Game Board */}
          <div className="lg:col-span-2 flex justify-center">
            <GameBoard gameState={gameState} />
          </div>
          
          {/* Right Panel - Leaderboard */}
          <div className="lg:col-span-1">
            <Leaderboard currentScore={gameState.gameOver ? gameState.score : undefined} />
          </div>
        </div>
        
        {/* Game Over Modal */}
        <GameOverModal gameState={gameState} onNewGame={startGame} />
        
        {/* Instructions */}
        <div className="mt-8 text-center">
          <div className="glass-panel rounded-lg p-4 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-white mb-3">How to Play</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <p><strong>Move:</strong> ← → Arrow Keys</p>
                <p><strong>Rotate:</strong> ↑ Arrow Key</p>
                <p><strong>Soft Drop:</strong> ↓ Arrow Key</p>
              </div>
              <div>
                <p><strong>Hard Drop:</strong> Spacebar</p>
                <p><strong>Pause:</strong> P Key</p>
                <p><strong>Goal:</strong> Clear lines by filling rows</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App