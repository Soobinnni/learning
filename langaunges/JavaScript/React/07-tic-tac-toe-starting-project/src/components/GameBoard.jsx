const initalGameBoard = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
export default function GameBoard({onSelectSquare, turns}) {
    let gameBoard=initalGameBoard;
    for(const turn of turns){
        // 빈 배열일 경우, 실행되지 않음
        // const row = turn.square.row;
        // const col = turn.square.col;
        // const player=turn.player;
        const {square, player} = turn;
        const {row, col} = square;

        gameBoard[row][col]=player;
    }
    return (
        <ol id="game-board">
            {
                gameBoard.map((row, rowIndex) => (
                    <li key={rowIndex}>
                        <ol>
                            {
                                row.map((playerSymbol, colIndex) => (
                                    <li key={colIndex}>
                                        <button onClick={()=>{onSelectSquare(rowIndex, colIndex)}}>{playerSymbol}</button>
                                    </li>
                                ))
                            }
                        </ol>
                    </li>
                ))
            }
        </ol>
    )
}