import { useState, useEffect } from 'react'
import './App.css'

function Grid(props) {
  const { gameState } = props

  if (gameState.length == 0 || gameState[0].length == 0) {
    return null
  }

  const numberOfRows = gameState.length
  const numberOfCols = gameState[0].length
  const sideLength = 40
  const circleRadius = 15

  return (
    <div>
      <svg width={ numberOfRows * sideLength } height={ numberOfCols * sideLength } xmlns="http://www.w3.org/2000/svg">
        { gameState.map((row, i) => {
          return (row.map((val, j) => {
            return (
              <g key={`${i}${j}`}>
                <rect 
                  key={`${i}${j}`}
                  width={sideLength} 
                  height={sideLength} 
                  x={i * sideLength} 
                  y={j * sideLength} 
                  fill="yellow"
                  stroke="#000"
                  onClick={() => {
                    props.onPress(i, j)
                  }}
                />

                { val != -1 && 
                  <circle
                    key={`c_${i}${j}`}
                    r={ circleRadius }
                    cx={ (i * sideLength) + (sideLength / 2) }
                    cy={ (j * sideLength) + (sideLength / 2) }
                    fill={ val == 1 ? 'red' : 'black' }
                  />
                }
              </g>
            )
          }))
        })}
      </svg>
    </div>
  )
}

export default Grid
