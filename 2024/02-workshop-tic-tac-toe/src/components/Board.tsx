import { useState } from "react";

import Field from "./Field";
import checkWinner from "../utils/checkWinner";

const Board = () => {
  const [boardArray, setBoardArray] = useState([null, null, null, null, null, null, null, null, null]);
  const [isCurrentPlayerX, setIsCurrentPlayerX] = useState(true);
  const [winner, setWinner] = useState(null);
  const [history, setHistory] = useState([]);
  const [stepNumber, setStepNumber] = useState(0);
  const [isHistoricalMove, setIsHistoricalMove] = useState(false);

  const fieldClick = (index) => {
    if (winner !== null || (isHistoricalMove && stepNumber !== history.length - 1)) {
      return;
    }

    setBoardArray((previousBoardArray) => {
      let newBoardArray = [...previousBoardArray];

      if (previousBoardArray[index] !== null) {
        return previousBoardArray;
      }

      newBoardArray[index] = isCurrentPlayerX ? "X" : "O";

      const winner = checkWinner(newBoardArray);

      if (winner !== null) {
        setWinner(winner);
      }

      setIsCurrentPlayerX(!isCurrentPlayerX);
      setHistory([...history, newBoardArray])
      return newBoardArray;
    });
  };

  const resetGame = () => {
    setBoardArray([null, null, null, null, null, null, null, null, null]);
    setIsCurrentPlayerX(true);
    setWinner(null);
    setHistory([]);
  }

  return (
    <>
      <h2>{winner ? `Winner is ${winner}` : `Current Player is ${isCurrentPlayerX ? "X" : "O"}`}</h2>
      {boardArray.map((_, index) => {
        if(index % 3 === 0) {
          return (
            <div key={index}>
              {[0, 1, 2].map((i) => (
                <Field 
                  key={index + i} 
                  element={boardArray[index + i]}
                  clickFieldHandler={fieldClick} 
                  index={index + i} />
            ))}
            </div>
          )
        }        
      })}
      <br />
      <button style={{ background: 'green'}} onClick={resetGame}>Reset Game</button>

      <h2>History</h2>
      {history.map((board, index) => (
        <button 
          onClick={() => {
            setBoardArray(board);
            setIsCurrentPlayerX(index % 2 !== 0);
            setIsHistoricalMove(true);
            setStepNumber(index);
          }}
          style={{ margin: '3px', background: 'blue'}} 
          key={index}>
          Step {index + 1}
        </button>
      ))}
    </>
  ); 
};

export default Board;