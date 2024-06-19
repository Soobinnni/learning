import {useState} from 'react';

const initalGameBoard = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
];

export default function GameBoard({onSelectSquere, activePlayerSymbol}) {
    const [gameBoard, setGameBoard] = useState(initalGameBoard);
    function handleSelectSquare(rowIndex, colIndex){
        setGameBoard(preGameBoard=>{
            let copyPreGameBoard = [...preGameBoard.map(innerArray=>[...innerArray])];
            copyPreGameBoard[rowIndex][colIndex] = activePlayerSymbol; // It will be changed
            return copyPreGameBoard;
        });
        onSelectSquere(); // 상위 컴포넌트 함수 호출.
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
                                        <button
                                            onClick={()=>handleSelectSquare(rowIndex, colIndex)}
                                        >{playerSymbol}</button>
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