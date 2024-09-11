const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  text: {
    type: String,
    required: true,
  },
  recepient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", commentSchema, "comments");
