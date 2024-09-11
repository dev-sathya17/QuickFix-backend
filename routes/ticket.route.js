// Importing the express library
const express = require("express");

// Importing the tickets Controller
const ticketController = require("../controllers/ticket.controller");

// Importing the authentication middleware
const auth = require("../middlewares/auth");

// Importing the multer middleware
const files = require("../middlewares/multer");

// Creating a router
const ticketRouter = express.Router();

// Route to add a category
ticketRouter.post(
  "/",
  auth.authenticate,
  files.array("attachments", 10),
  ticketController.addTicket
);

// Route to get all categories
ticketRouter.get("/", auth.authenticate, ticketController.getAllTickets);

// Route for updating categories
ticketRouter.put("/:id", auth.authenticate, ticketController.updateTicket);

// Route for deleting categories
ticketRouter.delete("/:id", auth.authenticate, ticketController.deleteTicket);

// Exporting the router
module.exports = ticketRouter;
