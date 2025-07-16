import { useState, useEffect, useCallback, useRef } from 'react'
import { GameState, Position } from '../types/tetris'
import {
  createInitialGameState,
  isValidPosition,
  placePiece,
  clearLines,
  rotatePiece,
  getRandomTetromino,
  createTetromino,
  calculateScore,
  calculateLevel,
  getDropSpeed
} from '../utils/tetris'

export function useGame() {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState())
  const gameLoopRef = useRef<number>()
  const lastDropRef = useRef<number>(Date.now())

  const startGame = useCallback(() => {
    const newState = createInitialGameState()
    newState.playing = true
    setGameState(newState)
    lastDropRef.current = Date.now()
  }, [])

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, paused: true }))
  }, [])

  const resumeGame = useCallback(() => {
    setGameState(prev => ({ ...prev, paused: false }))
    lastDropRef.current = Date.now()
  }, [])

  const endGame = useCallback(() => {
    setGameState(prev => ({ ...prev, gameOver: true, playing: false }))
  }, [])

  const spawnNewPiece = useCallback((state: GameState): GameState => {
    const newPiece = createTetromino(state.nextPiece!)
    const nextPiece = getRandomTetromino()

    // Check if new piece can be placed
    if (!isValidPosition(state.board, newPiece)) {
      return { ...state, gameOver: true, playing: false }
    }

    return {
      ...state,
      currentPiece: newPiece,
      nextPiece
    }
  }, [])

  const dropPiece = useCallback(() => {
    setGameState(prev => {
      if (!prev.playing || prev.paused || prev.gameOver || !prev.currentPiece) {
        return prev
      }

      const newPosition: Position = {
        x: prev.currentPiece.position.x,
        y: prev.currentPiece.position.y + 1
      }

      // Check if piece can move down
      if (isValidPosition(prev.board, prev.currentPiece, newPosition)) {
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            position: newPosition
          },
          lastDrop: Date.now()
        }
      }

      // Piece can't move down, place it on the board
      const newBoard = placePiece(prev.board, prev.currentPiece)
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard)
      
      const newTotalLines = prev.linesCleared + linesCleared
      const newLevel = calculateLevel(newTotalLines)
      const scoreGained = calculateScore(linesCleared, prev.level)
      
      const newState: GameState = {
        ...prev,
        board: clearedBoard,
        score: prev.score + scoreGained,
        level: newLevel,
        linesCleared: newTotalLines,
        dropTime: getDropSpeed(newLevel),
        lastDrop: Date.now()
      }

      return spawnNewPiece(newState)
    })
  }, [spawnNewPiece])

  const movePiece = useCallback((direction: 'left' | 'right' | 'down') => {
    setGameState(prev => {
      if (!prev.playing || prev.paused || prev.gameOver || !prev.currentPiece) {
        return prev
      }

      const deltaX = direction === 'left' ? -1 : direction === 'right' ? 1 : 0
      const deltaY = direction === 'down' ? 1 : 0

      const newPosition: Position = {
        x: prev.currentPiece.position.x + deltaX,
        y: prev.currentPiece.position.y + deltaY
      }

      if (isValidPosition(prev.board, prev.currentPiece, newPosition)) {
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            position: newPosition
          }
        }
      }

      return prev
    })
  }, [])

  const hardDrop = useCallback(() => {
    setGameState(prev => {
      if (!prev.playing || prev.paused || prev.gameOver || !prev.currentPiece) {
        return prev
      }

      let dropY = prev.currentPiece.position.y
      while (isValidPosition(prev.board, prev.currentPiece, { 
        x: prev.currentPiece.position.x, 
        y: dropY + 1 
      })) {
        dropY++
      }

      const droppedPiece = {
        ...prev.currentPiece,
        position: { x: prev.currentPiece.position.x, y: dropY }
      }

      const newBoard = placePiece(prev.board, droppedPiece)
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard)
      
      const newTotalLines = prev.linesCleared + linesCleared
      const newLevel = calculateLevel(newTotalLines)
      const scoreGained = calculateScore(linesCleared, prev.level) + (dropY - prev.currentPiece.position.y) * 2
      
      const newState: GameState = {
        ...prev,
        board: clearedBoard,
        score: prev.score + scoreGained,
        level: newLevel,
        linesCleared: newTotalLines,
        dropTime: getDropSpeed(newLevel),
        lastDrop: Date.now()
      }

      return spawnNewPiece(newState)
    })
  }, [spawnNewPiece])

  const rotatePieceAction = useCallback(() => {
    setGameState(prev => {
      if (!prev.playing || prev.paused || prev.gameOver || !prev.currentPiece) {
        return prev
      }

      const rotatedPiece = rotatePiece(prev.currentPiece)

      if (isValidPosition(prev.board, rotatedPiece)) {
        return {
          ...prev,
          currentPiece: rotatedPiece
        }
      }

      // Try wall kicks
      const kicks = [
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: -1 },
        { x: -2, y: 0 },
        { x: 2, y: 0 }
      ]

      for (const kick of kicks) {
        const kickedPiece = {
          ...rotatedPiece,
          position: {
            x: rotatedPiece.position.x + kick.x,
            y: rotatedPiece.position.y + kick.y
          }
        }

        if (isValidPosition(prev.board, kickedPiece)) {
          return {
            ...prev,
            currentPiece: kickedPiece
          }
        }
      }

      return prev
    })
  }, [])

  // Game loop
  useEffect(() => {
    if (!gameState.playing || gameState.paused || gameState.gameOver) {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
      return
    }

    const gameLoop = () => {
      const now = Date.now()
      if (now - lastDropRef.current >= gameState.dropTime) {
        dropPiece()
        lastDropRef.current = now
      }
      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameState.playing, gameState.paused, gameState.gameOver, gameState.dropTime, dropPiece])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!gameState.playing || gameState.gameOver) return

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          movePiece('left')
          break
        case 'ArrowRight':
          event.preventDefault()
          movePiece('right')
          break
        case 'ArrowDown':
          event.preventDefault()
          movePiece('down')
          break
        case 'ArrowUp':
          event.preventDefault()
          rotatePieceAction()
          break
        case ' ':
          event.preventDefault()
          hardDrop()
          break
        case 'p':
        case 'P':
          event.preventDefault()
          if (gameState.paused) {
            resumeGame()
          } else {
            pauseGame()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameState.playing, gameState.paused, gameState.gameOver, movePiece, rotatePieceAction, hardDrop, pauseGame, resumeGame])

  return {
    gameState,
    startGame,
    pauseGame,
    resumeGame,
    movePiece,
    rotatePiece: rotatePieceAction,
    hardDrop
  }
}