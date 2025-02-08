import { useState, useEffect } from 'react'
import './App.css'
import Grid from './Grid'
import GameInfoHeader from './GameInfoHeader'

const NUM_HORIZONTAL_CELLS = 10
const NUM_VERTICAL_CELLS   = 10 
const WINNING_PATH_LENGTH  = 4

export interface Move {
  i: number,
  j: number,
  dropJ: number
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
  winningPlayerIndex: number,
  winningMoves: Move[]
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
    winningPlayerIndex: -1,
    winningMoves: []
  }
}

const checkValues = (values: number[], valueToMatch: number): number[] => {
  let currentStreakIndicies = []

  for (let index = 0; index < values.length; index++) {
    if (values[index] == valueToMatch) {
      currentStreakIndicies.push(index)
    } else {
      currentStreakIndicies = []
    }

    if (currentStreakIndicies.length == WINNING_PATH_LENGTH) {
      return currentStreakIndicies
    }
  }

  return []
}

//  negative slope line
const buildBearDiagonalValues = (startX: number, startY: number, grid: number[][]): [number[], Move[]] => {
  const values = []
  const moves  = []

  let rhsXrunner = startX
  let rhsYrunner = startY


  while (rhsXrunner < NUM_HORIZONTAL_CELLS && rhsYrunner < NUM_VERTICAL_CELLS && rhsXrunner >= 0 && rhsYrunner >= 0) {
    values.push(grid[rhsXrunner][rhsYrunner])
    moves.push({ i: rhsXrunner, j: rhsYrunner, dropJ: 0 })

    rhsXrunner++
    rhsYrunner++
  }

  let lhsXrunner = startX - 1
  let lhsYrunner = startY - 1

  while (lhsXrunner < NUM_HORIZONTAL_CELLS && lhsYrunner < NUM_VERTICAL_CELLS && lhsXrunner >= 0 && lhsYrunner >= 0) {
    values.unshift(grid[lhsXrunner][lhsYrunner])
    moves.unshift({ i: lhsXrunner, j: lhsYrunner, dropJ: 0 })

    lhsXrunner--
    lhsYrunner--
  }

  return [values, moves]
}

//  positive slope line
const buildBullDiagonalValues = (startX: number, startY: number, grid: number[][]): [number[], Move[]] => {
  const values = []
  const moves  = []

  let rhsXrunner = startX
  let rhsYrunner = startY

  while (rhsXrunner < NUM_HORIZONTAL_CELLS && rhsYrunner < NUM_VERTICAL_CELLS && rhsXrunner >= 0 && rhsYrunner >= 0) {
    values.push(grid[rhsXrunner][rhsYrunner])
    moves.push({ i: rhsXrunner, j: rhsYrunner, dropJ: 0 })

    rhsXrunner++
    rhsYrunner--
  }

  let lhsXrunner = startX - 1
  let lhsYrunner = startY + 1

  while (lhsXrunner < NUM_HORIZONTAL_CELLS && lhsYrunner < NUM_VERTICAL_CELLS && lhsXrunner >= 0 && lhsYrunner >= 0) {
    values.unshift(grid[lhsXrunner][lhsYrunner])
    moves.unshift({ i: lhsXrunner, j: lhsYrunner, dropJ: 0 })

    lhsXrunner--
    lhsYrunner++
  }

  return [values, moves]
}

const checkGame = (latestMove: Move, grid: number[][]): Move[] => {
  const { i, j }           = latestMove

  const valueToMatch       = grid[i][j]

  const columnValues       = grid[i]
  const columnCoords       = grid[i].map((_, index) => {
    return {
      i,
      j: index,
      dropJ: 0
    } as Move
  })

  const rowValues          = grid.map((col) => col[j])
  const rowCoords          = grid.map((_, index) => {
    return {
      i: index, 
      j,
      dropJ: 0
    } as Move
  })

  const [bullDiagonalValues, bullDiagonalCoords] = buildBullDiagonalValues(i, j, grid)
  const [bearDiagonalValues, bearDiagonalCoords] = buildBearDiagonalValues(i, j, grid)

  const rowIndices  = checkValues(rowValues, valueToMatch)
  const colIndices  = checkValues(columnValues, valueToMatch)
  const bullIndices = checkValues(bullDiagonalValues, valueToMatch)
  const bearIndices = checkValues(bearDiagonalValues, valueToMatch)

  // console.log("COL", columnCoords)
  // console.log("ROW", rowCoords)
  // console.log("BULL", bullDiagonalCoords)
  // console.log("BEAR", bearDiagonalCoords)

  if (rowIndices.length > 0) {
    return rowIndices.map(index => rowCoords[index])
  } else if (colIndices.length > 0) {
    return colIndices.map(index => columnCoords[index])
  } else if (bullIndices.length > 0) {
    return bullIndices.map(index => bullDiagonalCoords[index])
  } else if (bearIndices.length > 0) {
    return bearIndices.map(index => bearDiagonalCoords[index])
  }

  return []
}

function App() {
  const [gameState, setGameState] = useState<GameState>()

  const resetGame = () => {
    setGameState(createGame(NUM_HORIZONTAL_CELLS, NUM_VERTICAL_CELLS))
  }

  const updateGame = (drop: Move) => {
    //  TODO: error handling/notification
    if (gameState!.grid[drop.i][drop.j] != -1) {
      return
    }

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

    const mostRecentMove: Move = { 
      i: drop.i, 
      j: lowestOpenColumn!, 
      dropJ: drop.j
    }

    const mutableGrid = JSON.parse(JSON.stringify(gameState!.grid))
 
    mutableGrid[mostRecentMove.i][mostRecentMove.j] = gameState!.playerTurnIndex

    const winningMoves = checkGame(mostRecentMove, mutableGrid)

    if (winningMoves.length > 0) {
      setGameState({
        ...gameState!, 
        grid: mutableGrid, 
        winningPlayerIndex: gameState!.playerTurnIndex,
        mostRecentMove,
        winningMoves
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
      <div>
        <button onClick={resetGame}>Reset Game</button>
      </div>
    </>
  )
}

export default App
