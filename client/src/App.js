import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import "./main.css";
import "./tailwind.css";
import clickSrc from "./audios/click.mp3";
import drawSrc from "./audios/draw.mp3";
import winSrc from "./audios/win.mp3";

const socket = io("http://localhost:3001");

function App() {
  // Board state
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);

  // Player time
  const [playerTime, setPlayerTime] = useState("X");

  // Audios references
  const clickRef = useRef(null);
  const winRef = useRef(null);
  const drawRef = useRef(null);

  // Get the initial board from the server
  useEffect(() => {
    socket.on("board", (startBoard) => {
      setBoard(startBoard);
    });
  }, []);

  // Square clicked by the player and update the board array with the new move
  function handleClick(index) {
    if (board[index] === "") {
      let updatedBoard = updateBoard(index);
      clickSound();
      changeTurn();
      socket.emit("move", { board: updatedBoard });
    }
  }

  // Change the player turn after a move
  function changeTurn() {
    setPlayerTime(playerTime === "X" ? "O" : "X");
  }

  // Update the board array with the new move of the player and return it
  function updateBoard(index) {
    let updatedBoard = [...board];
    updatedBoard[index] = playerTime;
    setBoard(updatedBoard);
    return updatedBoard;
  }

  // Play the click sound
  function clickSound() {
    clickRef.current.volume = 0.7;
    clickRef.current.play();
  }

  // Play the draw sound
  function drawSound() {
    drawRef.current.volume = 0.5;
    drawRef.current.currentTime = 0.2;
    drawRef.current.play();
  }

  // Play the win sound
  function winSound() {
    winRef.current.volume = 0.5;
    winRef.current.play();
  }

  // Restart the game and reload the page
  function Restart() {
    clickSound();
    setBoard(["", "", "", "", "", "", "", "", ""]);
    setTimeout(() => window.location.reload(), 100);
  }

  // Return the winner or draw message component
  function VerifyWinner() {
    if (
      (board[0] && board[0] === board[1] && board[1] === board[2]) ||
      (board[3] && board[3] === board[4] && board[4] === board[5]) ||
      (board[6] && board[6] === board[7] && board[7] === board[8]) ||
      (board[0] && board[0] === board[3] && board[3] === board[6]) ||
      (board[1] && board[1] === board[4] && board[4] === board[7]) ||
      (board[2] && board[2] === board[5] && board[5] === board[8]) ||
      (board[0] && board[0] === board[4] && board[4] === board[8]) ||
      (board[2] && board[2] === board[4] && board[4] === board[6])
    ) {
      winSound();

      return (
        <div
          className="
      bg-black
        bg-opacity-90
        absolute
        top-0
        left-0
        right-0
        bottom-0
        flex
        flex-col
        items-center
        justify-center
        "
        >
          <h1
            className="
          text-white 
          text-7xl 
          md:text-8xl 
          font-poppins
          font-bold
          mb-8
          "
          >
            PLAYER
          </h1>

          <h1
            className="
        text-cyan-400
          text-7xl 
          md:text-8xl 
          font-poppins
          font-bold
          mb-8
          "
          >
            {playerTime === "X" ? "O" : "X"}
          </h1>

          <h1
            className="
          text-white 
          text-7xl 
          md:text-8xl 
          font-poppins 
          font-bold
          "
          >
            WINS!
          </h1>

          <button
            onClick={() => Restart()}
            className="
          bg-yellow-500
          hover:bg-yellow-600
          opacity-100
          w-60
          h-16
          text-white
          text-2xl
          font-semibold
          mt-24
          "
            style={{ textShadow: "0px 0px 4px black" }}
          >
            New Game
          </button>
        </div>
      );
    } else if (
      board[0] &&
      board[1] &&
      board[2] &&
      board[3] &&
      board[4] &&
      board[5] &&
      board[6] &&
      board[7] &&
      board[8]
    ) {
      drawSound();

      return (
        <div
          className="
        bg-black
        bg-opacity-90
        absolute
        top-0
        left-0
        right-0
        bottom-0
        flex
        flex-col
        items-center
        justify-center
        "
        >
          <h1
            className="
          text-cyan-400
          text-7xl 
          md:text-8xl 
          font-poppins
          font-bold
          mb-8
          "
          >
            DRAW
          </h1>

          <button
            onClick={() => Restart()}
            className="
          bg-yellow-500
          hover:bg-yellow-600
          opacity-100
          w-60
          h-16
          text-white
          text-2xl
          font-semibold
          mt-24
          "
            style={{ textShadow: "0px 0px 4px black" }}
          >
            New Game
          </button>
        </div>
      );
    }
  }

  return (
    <div className="h-screen">
      <div
        className="
      h-screen
      flex
      flex-col
      items-center 
      justify-center
      "
      >
        <h1
          className="
        text-white 
        text-5xl
        md:text-7xl 
        font-poppins
        font-bold
        mb-9
        "
        >
          Tic Tac Toe
        </h1>

        <div
          className="
        grid 
        grid-cols-3 
        gap-2
        "
        >
          {board.map((square, i) => (
            <button
              onClick={() => handleClick(i)}
              className="
              bg-white 
              rounded-lg
              w-24
              h-24
              md:w-44
              md:h-44 
              text-6xl
              md:text-8xl
              text-indigo-700
              font-semibold
              "
              key={i}
            >
              {square}
            </button>
          ))}
        </div>
      </div>

      <VerifyWinner />

      <audio ref={clickRef} src={clickSrc} />
      <audio ref={drawRef} src={drawSrc} />
      <audio ref={winRef} src={winSrc} />
    </div>
  );
}

export default App;
