// Importing the mongoose library
const mongoose = require("mongoose");
const { MONGODB_URI, PORT } = require("./utils/config");
const app = require("./app");
const http = require("http");
const socketIo = require("socket.io");
const socketHandler = require("./socket/socket.handler");

const server = http.createServer(app);

const io = socketIo(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173", // Update this to match your frontend URL
    credentials: true,
  },
});

socketHandler(io);

app.set("io", io);

// Connecting to MongoDB and starting the server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    // Running server
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  });
