import Player from "./components/Player.jsx"
import GameBoard from "./components/GameBoard.jsx"
import Log from "./components/Log.jsx"

import { useState } from "react"

import { WINNING_COMBINATIONS } from "./winning-combination.js"

// ================== HELPER , CONST ==================
function deriveActivePlayer(gameTurns){
  let curActivePlayer = 'X';

  if(gameTurns.length>0 && gameTurns[0].player === 'X'){
    curActivePlayer='O';
  } else {
    curActivePlayer='X';
  }

  return curActivePlayer;
}

const initalGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];
// ================== ================== ==================

function App() {
  const [gameTurns, setGameTurns] = useState([]);
  const [hasWinner, setHasWinner] = useState(false);

  const activePlayer = deriveActivePlayer(gameTurns);

  // GameBoad.jsx component에서 가져옴(승리 조건 확인을 위해 board를 살펴볼 필요가 있으므로)
  let gameBoard = initalGameBoard;
  let winner = null;

  // gameBoard가 저장해 놓은 turns에 의해서 update
  for(const turn of gameTurns){
      const {square, player} = turn;
      const {row, col} = square;

      gameBoard[row][col]=player;
  }

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

  for (const combination of WINNING_COMBINATIONS){
    const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column];

    if(firstSquareSymbol&&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol){
        winner = firstSquareSymbol;
    }
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player initialName="Player1" symbol="X" isActive={activePlayer === "X"}/>
          <Player initialName="Player2" symbol="O" isActive={activePlayer === "O"} />
        </ol>
        { winner && <p>You won, {winner}!</p>}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard}/>
      </div>
      <Log turns = {gameTurns}/>
    </main>
  )
}

export default App