// Importing the express library
const express = require("express");

// Importing the category Controller
const categoryController = require("../controllers/category.controller");

// Importing the authentication middleware
const auth = require("../middlewares/auth");

// Creating a router
const categoryRouter = express.Router();

// Route to add a category
categoryRouter.post(
  "/",
  auth.authenticate,
  auth.authorize,
  categoryController.addCategory
);

// Route to get all categories
categoryRouter.get(
  "/",
  auth.authenticate,
  auth.authorize,
  categoryController.getAllCategories
);

// Route for deleting categories
categoryRouter.delete(
  "/:id",
  auth.authenticate,
  auth.authorize,
  categoryController.deleteCategory
);

// Exporting the router
module.exports = categoryRouter;
