// Importing the express library
const express = require("express");

// Importing the category Controller

// Importing the authentication middleware
const auth = require("../middlewares/auth");
const categoryController = require("../controllers/category.controller");

// Creating a router
const categoryRouter = express.Router();

// Route to register a user
categoryRouter.post(
  "/",
  auth.authenticate,
  auth.authorize,
  categoryController.addCategory
);

// Route to check authentication
categoryRouter.get(
  "/",
  auth.authenticate,
  auth.authorize,
  categoryController.getAllCategories
);

// Route for deleting user
categoryRouter.delete(
  "/:id",
  auth.authenticate,
  auth.authorize,
  categoryController.deleteCategory
);

// Exporting the router
module.exports = categoryRouter;
