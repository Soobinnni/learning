import Player from "./components/Player.jsx"
import GameBoard from "./components/GameBoard.jsx"
import Log from "./components/Log.jsx"
import GameOver from "./components/GameOver.jsx"

import { useState } from "react"

import { WINNING_COMBINATIONS } from "./winning-combination.js"

// ================== HELPER , CONST ==================
const PLAYERS = {
    X:'Player 1',
    O:'Player 2'
};
const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];
function deriveActivePlayer(gameTurns){
  let curActivePlayer = 'X';

  if(gameTurns.length>0 && gameTurns[0].player === 'X'){
    curActivePlayer='O';
  } else {
    curActivePlayer='X';
  }

  return curActivePlayer;
}
function deriveWinner(gameBoard, players){
  let winner=null;
  for (const combination of WINNING_COMBINATIONS){
    const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column];

    if(firstSquareSymbol&&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol){
        winner = players[firstSquareSymbol];
    }
  }
  return winner;
}
function deriveGameBoard(gameTurns){
  let gameBoard = [...INITIAL_GAME_BOARD.map(array=>[...array])];

  for(const turn of gameTurns){
      const {square, player} = turn;
      const {row, col} = square;

      gameBoard[row][col]=player;
  }
  return gameBoard;
}
// ================== ================== ==================

function App() {
  const [players, setPlayers]= useState({PLAYERS})
  const [gameTurns, setGameTurns] = useState([]);
  const activePlayer = deriveActivePlayer(gameTurns);
  const hasDraw = gameTurns.length===9 && !winner; 
  const gameBoard = deriveGameBoard(gameTurns);

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
  function handlePlayerNameChange(symbol, newName){
    setPlayers(prePlayers=>{
      return {
        ...prePlayers,
        [symbol]:newName
      }
    })
  }

  const winner = deriveWinner(gameBoard, players);

  function handleRestart(){
    setGameTurns([]);
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player 
            initialName={PLAYERS.X}
            symbol="X" 
            isActive={activePlayer === "X"}
            onChangeName = {handlePlayerNameChange}
            />
          <Player 
            initialName={PLAYERS.O}
            symbol="O" 
            isActive={activePlayer === "O"} 
            onChangeName = {handlePlayerNameChange}
            />
        </ol>
        { (winner || hasDraw) && <GameOver winner={winner} onRestart={handleRestart}/>}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard}/>
      </div>
      <Log turns = {gameTurns}/>
    </main>
  )
}

export default App