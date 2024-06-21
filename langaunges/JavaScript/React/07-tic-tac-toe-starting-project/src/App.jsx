import Player from "./components/Player.jsx"
import GameBoard from "./components/GameBoard.jsx"
import Log from "./components/Log.jsx"

import { useState } from "react"


function App() {
  const [gameTurns, setGameTurns] = useState([]);
  const [activePlayer, setActivePlayer] = useState('X');

  function handleSelectSquare(rowIndex, colIndex){
      setActivePlayer(curActivePlayer =>curActivePlayer==='X'?'O':'X');
      setGameTurns(preTurns=>{
        let curActivePlayer = 'X';

        if(preTurns.length>0 && gameTurns[0].player === 'X'){
          curActivePlayer='O';
        } else {
          curActivePlayer='X';
        }
        const updatedTurns = [
          {square: {row:rowIndex, col:colIndex}, player: curActivePlayer}
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