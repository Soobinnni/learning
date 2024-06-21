import Player from "./components/Player.jsx"
import GameBoard from "./components/GameBoard.jsx"
import Log from "./components/Log.jsx"

import { useState } from "react"

function deriveActivePlayer(gameTurns){
  let curActivePlayer = 'X';

  if(gameTurns.length>0 && gameTurns[0].player === 'X'){
    curActivePlayer='O';
  } else {
    curActivePlayer='X';
  }

  return curActivePlayer;
}
function App() {
  const [gameTurns, setGameTurns] = useState([]);
  const activePlayer = deriveActivePlayer(gameTurns);

  function handleSelectSquare(rowIndex, colIndex){
      setGameTurns(preTurns=>{
        const currentPlayer = deriveActivePlayer(preTurns);

        const updatedTurns = [
          {square: {row:rowIndex, col:colIndex}, player: currentPlayer}
          ,...preTurns
        ];
        return updatedTurns;
      });
  }
  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player initialName="Player1" symbol="X" isActive={activePlayer === "X"}/>
          <Player initialName="Player2" symbol="O" isActive={activePlayer === "O"} />
        </ol>
        <GameBoard onSelectSquare={handleSelectSquare} turns={gameTurns}/>
      </div>
      <Log turns = {gameTurns}/>
    </main>
  )
}

export default App