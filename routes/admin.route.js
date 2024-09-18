// Importing the express library
const express = require("express");

// Importing the admin Controller
const adminController = require("../controllers/admin.controller");

// Importing the authentication middleware
const auth = require("../middlewares/auth");

// Creating a router
const adminRouter = express.Router();

// Route to get all employees
adminRouter.get(
  "/employees",
  auth.authenticate,
  auth.authorize,
  adminController.getAllEmployees
);

// Route to get all users
adminRouter.get(
  "/users",
  auth.authenticate,
  auth.authorize,
  adminController.getAllUsers
);

// Route to get tickets by status
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

adminRouter.get(
  "/employees/unassigned",
  auth.authenticate,
  auth.authorize,
  adminController.getUnassignedEmployees
);

adminRouter.get(
  "/tickets/completion",
  auth.authenticate,
  auth.authorize,
  adminController.getTicketsCompletion
);

// Exporting the router
module.exports = adminRouter;
