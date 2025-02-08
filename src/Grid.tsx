import { motion } from 'framer-motion'
import './App.css'
import { Move, GameState } from './App'

interface GridProps {
  gameState: GameState,
  onPress(move: Move): void
}

function Grid(props: GridProps) {
  const { gameState, onPress } = props
  const { boardSize }          = gameState

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
            const isLatest  = gameState.mostRecentMove?.i == i && gameState.mostRecentMove?.j == j
            const fillColor = gameState.winningMoves.filter((move) => {
              return move.i == i && move.j == j
            }).length > 0 ? '#05DB05' : '#F7F700'

            return (
              <g key={`${i}${j}`}>
                <rect 
                  key={`${i}${j}`}
                  width={sideLength} 
                  height={sideLength} 
                  x={i * sideLength} 
                  y={j * sideLength} 
                  fill={fillColor}
                  stroke="#000"
                  onClick={() => {
                    onPress({ i, j, dropJ: j })
                  }}
                />

                { val != -1 && 
                  <motion.circle
                    key={`c_${i}${j}`}
                    r={circleRadius}
                    cx={(i * sideLength) + (sideLength / 2)}
                    cy={(j * sideLength) + (sideLength / 2)}
                    fill={ gameState.players[val].checkerColor }
                    initial={isLatest ? { cy: gameState.mostRecentMove!.dropJ * sideLength } : {}}
                    animate={isLatest ? { cy: (j * sideLength) + (sideLength / 2) } : {}}
                    transition={isLatest ? { duration: .400 } : {}}
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