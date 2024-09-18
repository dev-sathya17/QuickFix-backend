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

// Route to add a ticket
ticketRouter.post(
  "/",
  auth.authenticate,
  files.array("attachments", 10),
  ticketController.addTicket
);

// Route to get all ticket
ticketRouter.get("/", auth.authenticate, ticketController.getAllTickets);

// Route to get all user tickets
ticketRouter.get("/user", auth.authenticate, ticketController.getUserTickets);

// Route to get all employee tickets
ticketRouter.get(
  "/employee",
  auth.authenticate,
  ticketController.getEmployeeTickets
);

// Route to get all ticket
ticketRouter.get("/:id", auth.authenticate, ticketController.getTicket);

// Route for updating ticket
ticketRouter.put("/:id", auth.authenticate, ticketController.updateTicket);

// Route for deleting ticket
ticketRouter.delete("/:id", auth.authenticate, ticketController.deleteTicket);

ticketRouter.get(
  "/download/:filename",
  auth.authenticate,
  ticketController.downloadAttachment
);

// Exporting the router
module.exports = ticketRouter;
