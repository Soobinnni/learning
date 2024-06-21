import Player from "./components/Player.jsx"
import GameBoard from "./components/GameBoard.jsx"
import Log from "./components/Log.jsx"

import { useState } from "react"

function deriveActivePlayer(gameTurns){
  // helper함수: 컴포넌트와 관련된 그 어떤 상태나 데이터에 접근하지 않으므로
  // 컴포넌트 함수 내에 있지 않는다.
  // 또한 그렇기 때문에 컴포넌트가 마운트, 재마운트될 때 실행되지 않는다.
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
  // const [activePlayer, setActivePlayer] = useState('X');

  // gameTurns 상태변수가 변할 때 마다 재 호출된다. 따라서 이를 사용하는
  // 자식컴포넌트도 재로딩된다.
  const activePlayer = deriveActivePlayer(gameTurns);

  function handleSelectSquare(rowIndex, colIndex){
      // setActivePlayer(curActivePlayer =>curActivePlayer==='X'?'O':'X');
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