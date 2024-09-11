// Importing the express library
const express = require("express");

// Importing the comment Controller
const commentsController = require("../controllers/comments.controller");

// Importing the authentication middleware
const auth = require("../middlewares/auth");

// Creating a router
const commentRouter = express.Router();

// Route to add a comment
commentRouter.post(
  "/ticket/:id",
  auth.authenticate,
  commentsController.addComment
);

// Route to get all comment
commentRouter.put(
  "/:commentId",
  auth.authenticate,
  commentsController.updateComment
);

// Route for deleting comment
commentRouter.delete(
  "/:commentId",
  auth.authenticate,
  commentsController.deleteComment
);

// Exporting the router
module.exports = commentRouter;
