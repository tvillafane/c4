import { useState, useEffect } from 'react'
import './App.css'
import Grid from './Grid'

const createGame = (gridWidth: number, gridHeight: number) => {
  return [...Array(gridWidth)].map(_ => Array(gridHeight).fill(-1))
}

function App() {
  const [gameState, setGame] = useState([])
  const [turn, setTurn]      = useState(0)

  const updateGame = (i: number, j: number) => {
    if (gameState[i][j] != -1) {
      return
    }

    const copy = JSON.parse(JSON.stringify(gameState))
    copy[i][j] = turn

    setGame(copy)
    setTurn((turn + 1) % 2)
  }

  useEffect(() => {
    const initialState = createGame(10,10)
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
