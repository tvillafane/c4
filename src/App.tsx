import { useState, useEffect } from 'react'
import './App.css'
import Grid from './Grid'

const NUM_HORIZONTAL_CELLS = 20
const NUM_VERTICAL_CELLS   = 10 

const createGame = (gridWidth: number, gridHeight: number) => {
  return [...Array(gridWidth)].map(_ => Array(gridHeight).fill(-1))
}

const checkPoints = (values: number[], valueToMatch: number): boolean => {
  let currentStreak = 0

  for (let index = 0; index < values.length; index++) {
    if (values[index] == valueToMatch) {
      currentStreak++
    } else {
      currentStreak = 0
    }

    if (currentStreak == 4) {
      return true
    }
  }

  return false
}

const buildBearDiagonalValues = (startX, startY, gameState) => {
  const values = []

  //  moving right and up on the grid
  let rhsXrunner = startX
  let rhsYrunner = startY


  while (rhsXrunner < NUM_HORIZONTAL_CELLS && rhsYrunner < NUM_VERTICAL_CELLS && rhsXrunner >= 0 && rhsYrunner >= 0) {
    values.push(gameState[rhsXrunner][rhsYrunner])

    rhsXrunner++
    rhsYrunner++
  }

  let lhsXrunner = startX - 1
  let lhsYrunner = startY - 1

  //  moving left and down
  while (lhsXrunner < NUM_HORIZONTAL_CELLS && lhsYrunner < NUM_VERTICAL_CELLS && lhsXrunner >= 0 && lhsYrunner >= 0) {
    values.push(gameState[lhsXrunner][lhsYrunner])

    lhsXrunner--
    lhsYrunner--
  }

  return values
}

const buildBullDiagonalValues = (startX, startY, gameState) => {
  const values = []

  //  moving right and down on the grid
  let rhsXrunner = startX
  let rhsYrunner = startY

  while (rhsXrunner < NUM_HORIZONTAL_CELLS && rhsYrunner < NUM_VERTICAL_CELLS && rhsXrunner >= 0 && rhsYrunner >= 0) {
    values.push(gameState[rhsXrunner][rhsYrunner])

    rhsXrunner++
    rhsYrunner--
  }

  //  moving left and up
  let lhsXrunner = startX - 1
  let lhsYrunner = startY - 1

  while (lhsXrunner < NUM_HORIZONTAL_CELLS && lhsYrunner < NUM_VERTICAL_CELLS && lhsXrunner >= 0 && lhsYrunner >= 0) {
    values.unshift(gameState[lhsXrunner][lhsYrunner])

    lhsXrunner--
    lhsYrunner++
  }

  return values
}

//  i and j here are the coordinates of the latest checker
const checkGame = (i: number, j: number, gameState) => {
  const valueToMatch = gameState[i][j]
 
  const columnValues = gameState[i]
  const rowValues    = gameState.map((col) => {
    return col[j]
  })

  const bullDiagonalValues = buildBullDiagonalValues(i, j, gameState)
  const bearDiagonalValues = buildBearDiagonalValues(i, j, gameState)

  console.log(bullDiagonalValues, "bull")

  return

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
  const [gameState, setGame] = useState([])
  const [turn, setTurn]      = useState(0)

  const updateGame = (i: number, j: number) => {
    let lowestOpenColumn = null

    //  TOOD: for performance we could start at the end of the array and work backwards :D
    for (let index = 0; index < gameState[i].length; index ++) {
      if (gameState[i][index] == -1) {
        lowestOpenColumn = index
      }
    }

    if (lowestOpenColumn != null && gameState[i][lowestOpenColumn] != -1) {
      return 
    }

    const copy = JSON.parse(JSON.stringify(gameState))
    copy[i][lowestOpenColumn] = turn

    setGame(copy)

    const hasUserWon = checkGame(i, lowestOpenColumn, copy)

    if (hasUserWon) {
      console.log("WE HAVE A WINNER!!")
    }

    setTurn((turn + 1) % 2)
  }

  useEffect(() => {
    const initialState = createGame(NUM_HORIZONTAL_CELLS, NUM_VERTICAL_CELLS)
    setGame(initialState)
  }, [])

  return (
    <>
      <h1>Connect 4</h1>
      <Grid
        gameState={gameState}
        onPress={updateGame}
      />
    </>
  )
}

export default App
