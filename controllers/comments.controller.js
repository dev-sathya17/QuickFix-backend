const Comment = require("../models/comment");
const Ticket = require("../models/ticket");
const sendEmail = require("../helpers/emailHelper");

const commentsController = {
  addComment: async (req, res) => {
    try {
      const { recepient, text } = req.body;
      const { id } = req.params;

      const ticket = await Ticket.findById(id).populate("owner");

      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      if (req.userId === ticket.assignedTo.toString()) {
        const subject = "Comment added from employee";
        const message = `<!DOCTYPE html>
                  <html lang="en">
                  <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <title>New Comment on Your Ticket</title>
                      <style>
                          body {
                              font-family: Arial, sans-serif;
                              background-color: #f4f4f4;
                              margin: 0;
                              padding: 0;
                          }
                          .container {
                              width: 100%;
                              max-width: 600px;
                              margin: 0 auto;
                              background: #ffffff;
                              border-radius: 8px;
                              box-shadow: 0 0 10px rgba(0,0,0,0.1);
                              padding: 20px;
                          }
                          .header {
                              text-align: center;
                              padding: 10px 0;
                              border-bottom: 2px solid #007bff;
                          }
                          .header h1 {
                              margin: 0;
                              color: #007bff;
                          }
                          .content {
                              padding: 20px;
                          }
                          .content p {
                              margin: 0 0 10px;
                          }
                          .footer {
                              text-align: center;
                              padding: 10px;
                              border-top: 1px solid #e0e0e0;
                              font-size: 12px;
                              color: #777;
                          }
                          .footer a {
                              color: #007bff;
                              text-decoration: none;
                          }
                      </style>
                  </head>
                  <body>
                      <div class="container">
                          <div class="header">
                              <h1>QuickFix</h1>
                          </div>
                          <div class="content">
                              <p>Dear ${ticket.owner.name},</p>
                              <p>We wanted to let you know that a new comment has been added to your ticket.</p>
                              <p><strong>Ticket ID:</strong> ${ticket._id}</p>
                              <p><strong>Comment:</strong> ${text}</p>
                              <p>You can view the updated ticket and all comments by logging into your account at <a href="{{appUrl}}">QuickFix</a>.</p>
                              <p>Thank you for using QuickFix!</p>
                          </div>
                          <div class="footer">
                              <p>Thank you.</p>
                              <p>QuickFix team.</p>
                          </div>
                      </div>
                  </body>
                  </html>
`;
        sendEmail(ticket.owner.email, subject, message);
      }

      const comment = await Comment.create({
        sender: req.userId,
        recepient,
        text,
        ticket: id,
      });

      await comment.save();

      req.app.get("io").emit("commented", comment);

      ticket.comments.push(comment._id);
      await ticket.save();

      return res.status(201).json(comment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  updateComment: async (req, res) => {
    try {
      const { commentId } = req.params;
      const { text } = req.body;
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      comment.text = text;

      await comment.save();

      req.app.get("io").emit("updated comment", comment);
      return res.json({ message: "Comment updated" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  deleteComment: async (req, res) => {
    try {
      const { commentId } = req.params;

      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      await comment.deleteOne();

      req.app.get("io").emit("deleted comment", comment._id);
      return res.json({ message: "Comment deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = commentsController;
