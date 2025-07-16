import { 
  TetrominoType, 
  Tetromino, 
  GameState, 
  Position, 
  TETROMINO_SHAPES, 
  TETROMINO_TYPES, 
  BOARD_WIDTH, 
  BOARD_HEIGHT 
} from '../types/tetris'

export function createEmptyBoard(): (TetrominoType | null)[][] {
  return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null))
}

export function getRandomTetromino(): TetrominoType {
  return TETROMINO_TYPES[Math.floor(Math.random() * TETROMINO_TYPES.length)]
}

export function createTetromino(type: TetrominoType): Tetromino {
  return {
    type,
    shape: TETROMINO_SHAPES[type][0],
    position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
    rotation: 0
  }
}

export function isValidPosition(
  board: (TetrominoType | null)[][],
  piece: Tetromino,
  newPosition?: Position
): boolean {
  const pos = newPosition || piece.position
  
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const newX = pos.x + x
        const newY = pos.y + y
        
        // Check boundaries
        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return false
        }
        
        // Check collision with existing pieces (but allow negative Y for spawning)
        if (newY >= 0 && board[newY][newX]) {
          return false
        }
      }
    }
  }
  
  return true
}

export function placePiece(
  board: (TetrominoType | null)[][],
  piece: Tetromino
): (TetrominoType | null)[][] {
  const newBoard = board.map(row => [...row])
  
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] && piece.position.y + y >= 0) {
        newBoard[piece.position.y + y][piece.position.x + x] = piece.type
      }
    }
  }
  
  return newBoard
}

export function clearLines(board: (TetrominoType | null)[][]): {
  newBoard: (TetrominoType | null)[][]
  linesCleared: number
} {
  const fullLines: number[] = []
  
  // Find full lines
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    if (board[y].every(cell => cell !== null)) {
      fullLines.push(y)
    }
  }
  
  if (fullLines.length === 0) {
    return { newBoard: board, linesCleared: 0 }
  }
  
  // Remove full lines and add empty lines at top
  const newBoard = board.filter((_, index) => !fullLines.includes(index))
  const emptyLines = Array(fullLines.length).fill(null).map(() => Array(BOARD_WIDTH).fill(null))
  
  return {
    newBoard: [...emptyLines, ...newBoard],
    linesCleared: fullLines.length
  }
}

export function rotatePiece(piece: Tetromino): Tetromino {
  const rotations = TETROMINO_SHAPES[piece.type]
  const nextRotation = (piece.rotation + 1) % rotations.length
  
  return {
    ...piece,
    shape: rotations[nextRotation],
    rotation: nextRotation
  }
}

export function getDropPosition(
  board: (TetrominoType | null)[][],
  piece: Tetromino
): Position {
  let dropY = piece.position.y
  
  while (isValidPosition(board, piece, { x: piece.position.x, y: dropY + 1 })) {
    dropY++
  }
  
  return { x: piece.position.x, y: dropY }
}

export function calculateScore(linesCleared: number, level: number): number {
  const baseScores = [0, 40, 100, 300, 1200]
  return baseScores[linesCleared] * (level + 1)
}

export function calculateLevel(totalLines: number): number {
  return Math.floor(totalLines / 10)
}

export function getDropSpeed(level: number): number {
  // Drop speed in milliseconds, gets faster with each level
  return Math.max(50, 1000 - (level * 50))
}

export function createInitialGameState(): GameState {
  const firstPiece = getRandomTetromino()
  const nextPiece = getRandomTetromino()
  
  return {
    board: createEmptyBoard(),
    currentPiece: createTetromino(firstPiece),
    nextPiece,
    score: 0,
    level: 0,
    linesCleared: 0,
    gameOver: false,
    paused: false,
    playing: false,
    dropTime: getDropSpeed(0),
    lastDrop: Date.now()
  }
}