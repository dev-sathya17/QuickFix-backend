// Importing the express library
const express = require("express");

// Importing the morgan library to log requests
const morgan = require("morgan");

// Importing the cookie parser library
const cookieParser = require("cookie-parser");

// Importing the cors library
const cors = require("cors");

// Router Imports
const userRouter = require("./routes/user.route");
const categoryRouter = require("./routes/category.route");
const ticketRouter = require("./routes/ticket.route");
const commentRouter = require("./routes/comment.route");
const adminRouter = require("./routes/admin.route");

// Creating an express application
const app = express();

// app.use(
//   cors({
//     origin: "https://quick-fix-tickets.netlify.app",
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// parse the cookies of the request
app.use(cookieParser());

// Adding middleware to parse the request body
app.use(express.json());

// Adding a job to assign Employees to tickets
require("./jobs/AssignmentJob");

// to log requests
app.use(morgan("dev"));

// Serving static files from the 'uploads' directory
app.use("/uploads", express.static("uploads"));

// Creating routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/tickets", ticketRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/admin", adminRouter);

module.exports = app;
