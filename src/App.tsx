import { useState, useEffect } from 'react'
import './App.css'
import Grid from './Grid'
import GameInfoHeader from './GameInfoHeader'

const NUM_HORIZONTAL_CELLS = 20
const NUM_VERTICAL_CELLS   = 10 

export interface Move {
  i: number,
  j: number
}

export interface Player {
  name: string,
  checkerColor: string
}

export interface Dimension {
  height: number,
  width: number
}

export interface GameState {
  grid: number[][],
  playerTurnIndex: number,
  players: Player[],
  mostRecentMove?: Move,
  boardSize: Dimension,
  winningPlayerIndex: number 
}

const createGame = (gridWidth: number, gridHeight: number): GameState => {
  return {
    grid: [...Array(gridWidth)].map(_ => Array(gridHeight).fill(-1)),
    playerTurnIndex: 0,
    players: [{ name: "Player 1", checkerColor: '#000000' }, { name: "Player 2", checkerColor: '#F6040A' }],
    boardSize: {
      width: gridWidth,
      height: gridHeight
    },
    winningPlayerIndex: -1
  }
}

const checkPoints = (values: number[], valueToMatch: number): boolean => {
  let currentStreak = 0

  for (let index = 0; index < values.length; index++) {
    if (values[index] == valueToMatch) {
      currentStreak++
    } else {
      currentStreak = 0
    }

    //  TODO: could make this dynamic for flair
    if (currentStreak == 4) {
      return true
    }
  }

  return false
}

//  negative slope line
const buildBearDiagonalValues = (startX: number, startY: number, grid: number[][]) => {
  const values = []

  let rhsXrunner = startX
  let rhsYrunner = startY


  while (rhsXrunner < NUM_HORIZONTAL_CELLS && rhsYrunner < NUM_VERTICAL_CELLS && rhsXrunner >= 0 && rhsYrunner >= 0) {
    values.push(grid[rhsXrunner][rhsYrunner])

    rhsXrunner++
    rhsYrunner++
  }

  let lhsXrunner = startX - 1
  let lhsYrunner = startY - 1

  while (lhsXrunner < NUM_HORIZONTAL_CELLS && lhsYrunner < NUM_VERTICAL_CELLS && lhsXrunner >= 0 && lhsYrunner >= 0) {
    values.push(grid[lhsXrunner][lhsYrunner])

    lhsXrunner--
    lhsYrunner--
  }

  return values
}

//  positive slope line
const buildBullDiagonalValues = (startX: number, startY: number, grid: number[][]) => {
  const values = []

  let rhsXrunner = startX
  let rhsYrunner = startY

  while (rhsXrunner < NUM_HORIZONTAL_CELLS && rhsYrunner < NUM_VERTICAL_CELLS && rhsXrunner >= 0 && rhsYrunner >= 0) {
    values.push(grid[rhsXrunner][rhsYrunner])

    rhsXrunner++
    rhsYrunner--
  }

  let lhsXrunner = startX - 1
  let lhsYrunner = startY + 1

  while (lhsXrunner < NUM_HORIZONTAL_CELLS && lhsYrunner < NUM_VERTICAL_CELLS && lhsXrunner >= 0 && lhsYrunner >= 0) {
    values.unshift(grid[lhsXrunner][lhsYrunner])

    lhsXrunner--
    lhsYrunner++
  }

  return values
}

const checkGame = (latestMove: Move, grid: number[][]) => {
  const { i, j }           = latestMove

  const valueToMatch       = grid[i][j]
  const columnValues       = grid[i]
  const rowValues          = grid.map((col) => col[j])

  const bullDiagonalValues = buildBullDiagonalValues(i, j, grid)
  const bearDiagonalValues = buildBearDiagonalValues(i, j, grid)

  if (checkPoints(columnValues, valueToMatch)) {
    return true
  } else if (checkPoints(rowValues, valueToMatch)) {
    return true
  } else if (checkPoints(bullDiagonalValues, valueToMatch)) {
    return true
  } else if (checkPoints(bearDiagonalValues, valueToMatch)) {
    return true
  }

  return false
}

function App() {
  const [gameState, setGameState] = useState<GameState>()

  const updateGame = (drop: Move) => {
    if (gameState!.winningPlayerIndex > -1) {
      return
    }

    let lowestOpenColumn = null

    //  TOOD: for performance we could start at the end of the array and work backwards :D
    for (let index = 0; index < gameState!.grid[drop.i].length; index ++) {
      if (gameState!.grid[drop.i][index] == -1) {
        lowestOpenColumn = index
      }
    }

    //  already played here!
    if (lowestOpenColumn != null && gameState!.grid[drop.i][lowestOpenColumn] != -1) {
      return 
    }

    const mostRecentMove: Move = { i: drop.i, j: lowestOpenColumn }

    const mutableGrid = JSON.parse(JSON.stringify(gameState!.grid))
 
    mutableGrid[mostRecentMove.i][mostRecentMove.j] = gameState!.playerTurnIndex

    const hasUserWon = checkGame(mostRecentMove, mutableGrid)

    if (hasUserWon) {
      setGameState({
        ...gameState!, 
        grid: mutableGrid, 
        winningPlayerIndex: gameState!.playerTurnIndex,
        mostRecentMove
      })
    } else {
      setGameState({
        ...gameState!, 
        grid: mutableGrid, 
        playerTurnIndex: (gameState!.playerTurnIndex + 1) % 2,
        mostRecentMove
      })
    }
  }

  useEffect(() => {
    const initialState = createGame(NUM_HORIZONTAL_CELLS, NUM_VERTICAL_CELLS)
    setGameState(initialState)
  }, [])

  if (!gameState) {
    return null
  }

  return (
    <>
      <h1>Connect 4</h1>
      <Grid
        gameState={gameState}
        onPress={updateGame}
      />
      <GameInfoHeader
        gameState={gameState}
      />
    </>
  )
}

export default App
