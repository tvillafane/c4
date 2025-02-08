import { GameState } from "./App";

export interface GameInfoHeaderProps {
  gameState: GameState
}


function GameInfoHeader(props: GameInfoHeaderProps) {
  const { gameState } = props

  const player = gameState.players[gameState.playerTurnIndex]
  const text = gameState.winningPlayerIndex > -1 ? `${gameState.players[gameState.winningPlayerIndex].name} wins!` : `${player.name} to play`

  return (
    <div className='gameInfo'>
      <svg width={30} height={30} xmlns="http://www.w3.org/2000/svg">
        <circle
          r={15}
          cx={15}
          cy={15}
          fill={ player.checkerColor }
        />
      </svg>
      <h3>{ text }</h3>
    </div>
  )
}

export default GameInfoHeader