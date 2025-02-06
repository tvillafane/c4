import { useState, useEffect } from 'react'
import './App.css'
import Grid from './Grid'

const createGame = (gridWidth: number, gridHeight: number) => {
  return [...Array(gridWidth)].map(_ => Array(gridHeight).fill(0))
}

function App() {
  const [gameState, setGame] = useState([])

  const updateGame = (i: number, j: number) => {
    const copy = JSON.parse(JSON.stringify(gameState))
    copy[i][j] = 1

    setGame(copy)
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
