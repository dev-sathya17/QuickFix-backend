// Importing the express library
const express = require("express");

// Importing the morgan library to log requests
const morgan = require("morgan");

// Importing the cookie parser library
const cookieParser = require("cookie-parser");

// Router Imports
const userRouter = require("./routes/user.route");
const categoryRouter = require("./routes/category.route");
const ticketRouter = require("./routes/ticket.route");

// Creating an express application
const app = express();

// parse the cookies of the request
app.use(cookieParser());

// Adding middleware to parse the request body
app.use(express.json());

// to log requests
app.use(morgan("dev"));

// Creating routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/tickets", ticketRouter);

module.exports = app;
