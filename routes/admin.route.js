// Importing the express library
const express = require("express");

// Importing the category Controller
const adminController = require("../controllers/admin.controller");

// Importing the authentication middleware
const auth = require("../middlewares/auth");

// Creating a router
const adminRouter = express.Router();

// Route to add a category
adminRouter.get(
  "/employees",
  auth.authenticate,
  auth.authorize,
  adminController.getAllEmployees
);

// Route to get all categories
adminRouter.get(
  "/users",
  auth.authenticate,
  auth.authorize,
  adminController.getAllUsers
);

// Route for deleting categories
adminRouter.get(
  "/tickets/count",
  auth.authenticate,
  auth.authorize,
  adminController.getTicketsCountByStatus
);

adminRouter.get(
  "/users/count",
  auth.authenticate,
  auth.authorize,
  adminController.getUserCount
);

// Exporting the router
module.exports = adminRouter;
