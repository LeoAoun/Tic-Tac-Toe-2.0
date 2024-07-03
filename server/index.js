const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: { origin: "http://localhost:3000" },
});

const PORT = 3001;

let startBoard = ["", "", "", "", "", "", "", "", ""];

io.on("connection", (socket) => {
  console.log("Player connected");

  // Send the current board and player to the new player
  socket.emit("board", startBoard);

  // Emits the new board to all players
  socket.on("move", ({ board }) => {
    io.emit("board", board);
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
