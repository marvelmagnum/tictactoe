import { useState } from "react";

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  let isAscending = true;
  let testVal = 1;

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    console.log(testVal);
  }

  function toggleMovesOrder() {
    isAscending = !isAscending;
    console.log(isAscending);
    testVal = 2;
    console.log(testVal);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = `Go to move #${move}`;
    } else {
      description = `Go to game start`;
    }
    return (
      <li key={move}> 
        {
          move !== history.length - 1 ? 
            <button onClick={() => jumpTo(move)}>
              {description}
            </button>
          :
            <p>{`You are at move #${move +1}`}</p>
        } 
      </li>
    )
  });

  function moveList() {
    moveList = isAscending ? moves : moves.toReversed();
    console.log(isAscending);
    console.log(testVal);
    return moveList;
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
        <br></br>
        <button onClick={toggleMovesOrder}>Toggle Order</button>
      </div>
      <div className="game-info">
        <ol>{moveList()}</ol>
      </div>
    </div>
  );
}

function Board({xIsNext, squares, onPlay}) {
  function handleClick(i) {
    if (squares[i] !== null || calculateWinner(squares) !== null) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next Player: ' + (xIsNext ? 'X' : 'O');
  }
  console.log(winner);

  const grid = () => {
    const grid = [];
    for (let i = 0; i < 3; i++) {
      const cols = [];
      for (let j = 0; j < 3; j++){
        cols.push(
          <Square key={i*3+j} value={squares[i*3+j]} onSquareClick={() => handleClick(i*3+j)}/>
        );
      }
      grid.push(
        <div key={i} className="board-row">{cols}</div>
      );
    }
    
    return grid;
  };

  return (
    <>
      <div className="status">{status}</div>
      {grid()}
    </>
  );
}

function Square({value, onSquareClick}) { 
  return (
    <button 
      className="square"
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}