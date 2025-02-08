import { useState, useEffect } from 'react'
import './App.css'
import { Move, GameState } from './App'

interface GridProps {
  gameState: GameState,
  onPress(move: Move): void
}

function Grid(props: GridProps) {
  const { gameState } = props
  const { boardSize } = gameState

  if (boardSize.width == 0 || boardSize.height == 0) {
    return null
  }

  const numberOfRows = boardSize.width
  const numberOfCols = boardSize.height
  const sideLength   = 40
  const circleRadius = 15

  return (
    <div>
      <svg width={ numberOfRows * sideLength } height={ numberOfCols * sideLength } xmlns="http://www.w3.org/2000/svg">
        { gameState.grid.map((row, i) => {
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
                    props.onPress({ i, j })
                  }}
                />

                { val != -1 && 
                  <circle
                    key={`c_${i}${j}`}
                    r={ circleRadius }
                    cx={ (i * sideLength) + (sideLength / 2) }
                    cy={ (j * sideLength) + (sideLength / 2) }
                    fill={ val == 1 ? 'red' : 'black' }
                  >
                    <animate
                      attributeName="cy"
                      begin="0s"
                      dur="1s"
                      from={0}
                      to={ (j * sideLength) + (sideLength / 2) }
                      fill="freeze" 
                    />
                  </circle>

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
