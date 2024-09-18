// socketHandler.js
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};
