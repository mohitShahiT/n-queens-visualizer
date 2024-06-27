import { useState } from "react";
import placeSound from "./assets/sounds/piece-place.m4a";
import removeSound from "./assets/sounds/piece-remove.m4a";
const n = 6;
function App() {
  return (
    <>
      <div className="h-dvh bg-theme overflow-auto p-7">
        <Board />
      </div>
    </>
  );
}

function getRowCol(index) {
  const row = Math.floor(index / n);
  const col = index % n;
  return [row, col];
}

function getIndex(row, col) {
  return row * n + col;
}

function isValidMove(board, index) {
  const [row, col] = getRowCol(index);
  //row validity
  for (let i = 0; i < n; i++) {
    if (board[getIndex(row, i)] === 1) return false;
  }
  //column validity
  for (let i = 0; i < n; i++) {
    if (board[getIndex(i, col)] === 1) return false;
  }
  //top left diagonal validity
  for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
    if (board[getIndex(i, j)] === 1) return false;
  }

  //top right diagonal validity
  for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
    if (board[getIndex(i, j)] === 1) return false;
  }
  //bottom left diagonal validity
  for (let i = row + 1, j = col - 1; i < n && j >= 0; i++, j--) {
    if (board[getIndex(i, j)] === 1) return false;
  }
  //bottom right diagonal validity
  for (let i = row + 1, j = col + 1; i < n && j < n; i++, j++) {
    if (board[getIndex(i, j)] === 1) return false;
  }
  return true;
}

function placeQueen(board, setBoard, index) {
  const newBoard = [...board];
  newBoard[index] = 1;
  // playPlaceSound();
  setBoard([...newBoard]);
}

function removeQueen(board, setBoard, index) {
  const newBoard = [...board];
  newBoard[index] = 0;
  // playRemoveSound();
  setBoard([...newBoard]);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function visualizeNQueen(board, setBoard, index) {
  if (index === n * n) return true;
  const [row] = getRowCol(index);
  for (let col = 0; col < n; col++) {
    // console.log("col", col);
    const indx = getIndex(row, col);
    const newBoard = [...board];
    if (isValidMove(board, indx)) {
      newBoard[indx] = 1;
      await sleep(300);
      placeQueen(newBoard, setBoard, indx);
      if (await visualizeNQueen(newBoard, setBoard, getIndex(row + 1, 0))) {
        return true;
      }
    }
    newBoard[indx] = 0;
    // console.log("removing");
    removeQueen(newBoard, setBoard, indx);
    await sleep(300);
  }
  return false;
}

const piecePlaceSound = new Audio(placeSound);
const pieceRemoveSound = new Audio(removeSound);

function playPlaceSound() {
  piecePlaceSound.currentTime = 50 / 1000;
  piecePlaceSound.play();
}

function playRemoveSound() {
  pieceRemoveSound.currentTime = 100 / 1000;
  pieceRemoveSound.play();
}

function Board() {
  const [board, setBoard] = useState(Array(n * n).fill(0));
  const [isSolving, setIsSolving] = useState(false);
  const [isSolved, setIsSolved] = useState(false);

  async function startNQueen() {
    setBoard(() => Array(n * n).fill(0));
    setIsSolving(true);
    setIsSolved(false);
    setBoard(Array(n * n).fill(0));
    await visualizeNQueen(board, setBoard, 0);
    setIsSolved(true);
    setIsSolving(false);
  }

  // console.log(board);

  function onCellClick(pos) {
    //if the position is empty and the move is valid

    const isValid = !isSolving && isValidMove(board, pos);
    if (board[pos] === 0 && isValid) {
      playPlaceSound();
      placeQueen(board, setBoard, pos);
    }
    //if the placement is not valid
    else if (board[pos] === 0 && !isValid) {
      return;
    } else {
      playRemoveSound();
      removeQueen(board, setBoard, pos);
    }
  }
  function resetBoard() {
    setIsSolved(false);
    setBoard(Array(n * n).fill(0));
  }

  const cells = board.map((cell, i) => {
    const [row, col] = getRowCol(i);
    return (
      <div
        className={`${
          (row + col) % 2 == 0 ? "bg-[#ebecd0]" : "bg-[#779556]"
        } h-28 w-28 p-2 hover:ring-3 hover:cursor-pointer`}
        key={`${row}${col}`}
        onClick={() => onCellClick(i)}
      >
        {cell === 1 && <img src="/queen-piece2.png" alt="queen" />}
      </div>
    );
  });
  return (
    <>
      <div className="flex justify-center items-center h-full flex-col  mt-6">
        <div className={`grid grid-cols-6 w-fit`}>{cells}</div>
        <div className="flex items-center content-center mt-5 gap-3">
          <button
            disabled={isSolving || isSolved}
            onClick={startNQueen}
            className="text-white border-2 border-black-500 px-4 py-2 uppercase rounded-md text-xl  bg-black hover:bg-slate-500"
          >
            {isSolving ? "Solving..." : isSolved ? "Solved" : "Start"}
          </button>
          {isSolved && (
            <button
              onClick={resetBoard}
              className="text-white border-2 border-black-500 px-4 py-2 uppercase rounded-md text-xl  bg-black hover:bg-slate-500"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
