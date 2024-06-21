import Player from "./components/Player.jsx"
import GameBoard from "./components/GameBoard.jsx"
import Log from "./components/Log.jsx"
import GameOver from "./components/GameOver.jsx"

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

  // 아래는 참조 때문에 restart시 오류를 낼 수 있기 때문에 스프레드연산자로 깊은 복사를 해야함
  // let gameBoard = initalGameBoard;
  let gameBoard = [...initalGameBoard.map(array=>[...array])];
  let winner = null;
  const hasDraw = gameTurns.length===9 && !winner; // 9개의 판이 모두 채워지면 끝(무승부)

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

  function handleRestart(){
    setGameTurns([]);
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player initialName="Player1" symbol="X" isActive={activePlayer === "X"}/>
          <Player initialName="Player2" symbol="O" isActive={activePlayer === "O"} />
        </ol>
        { (winner || hasDraw) && <GameOver winner={winner} onRestart={handleRestart}/>}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard}/>
      </div>
      <Log turns = {gameTurns}/>
    </main>
  )
}

export default App