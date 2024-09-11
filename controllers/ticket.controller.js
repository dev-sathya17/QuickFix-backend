const sendEmail = require("../helpers/emailHelper");
const Ticket = require("../models/ticket");
const User = require("../models/user");
const fs = require("fs");
const path = require("path");

const ticketController = {
  addTicket: async (req, res) => {
    try {
      const { title, description, category } = req.body;

      const attachments = req.files ? req.files.map((file) => file.path) : [];

      const newTicket = await Ticket.create({
        title,
        description,
        category,
        owner: req.userId,
        attachments,
      });

      const user = await User.findById(req.userId);

      user.tickets.push(newTicket._id);
      await user.save();

      res.status(201).json(newTicket);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getAllTickets: async (req, res) => {
    try {
      const tickets = await Ticket.find()
        .populate("owner")
        .populate("assignedTo")
        .populate("category");
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateTicket: async (req, res) => {
    try {
      const { title, description, category, status, assignedTo } = req.body;
      const { id } = req.params;
      const ticket = await Ticket.findById(id);

      const user = await User.findById(req.userId);

      if (!ticket) return res.status(404).json({ message: "Ticket not found" });

      ticket.title = title || ticket.title;
      ticket.description = description || ticket.description;
      ticket.category = category || ticket.category;
      ticket.status = status || ticket.status;
      ticket.assignedTo = assignedTo || ticket.assignedTo;

      if (status === "closed") {
        ticket.closedAt = new Date();
      }

      if (assignedTo) {
        const subject = "Ticket Assignment";
        const assignedUser = await User.findById(assignedTo);

        if (!assignedUser)
          return res
            .status(404)
            .json({ message: "User to be assigned is not found." });

        ticket.status = "assigned";

        // TODO: Modify url after frontend deployment
        const text = `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Ticket Taken Up</title>
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
                            <p>Dear ${user.name},</p>
                            <p>We wanted to let you know that one of our employees has been assigned to your ticket.</p>
                            <p><strong>Ticket ID:</strong> ${ticket._id}</p>
                            <p><strong>Assigned To:</strong> ${assignedUser.name}</p>
                            <p><strong>New Status:</strong> ${ticket.status}</p>
                            <p><strong>Details:</strong> ${ticket.description}</p>
                            <p>You can view and manage your ticket by logging into your account at <a href="{{appUrl}}">QuickFix</a>.</p>
                            <p>Thank you for using QuickFix!</p>
                        </div>
                        <div class="footer">
                            <p>©QuickFix. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                `;
        sendEmail(user.email, subject, text);

        // TODO: Modify url after frontend deployment
        const message = `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>New Ticket Assignment</title>
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
                            .content a {
                                color: #007bff;
                                text-decoration: none;
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
                                <p>Dear ${assignedUser.name},</p>
                                <p>You have been assigned to a new ticket in QuickFix. Please review the details below:</p>
                                <p><strong>Ticket ID:</strong> ${ticket._id}</p>
                                <p><strong>Ticket Title:</strong> ${ticket.title}</p>
                                <p><strong>Description:</strong> ${ticket.description}</p>
                                <p>You can view and start working on the ticket by logging into your account: <a href="{{appUrl}}">QuickFix Dashboard</a>.</p>
                                <p>Thank you for your attention and timely efforts!</p>
                            </div>
                            <div class="footer">
                                <p>If you have any questions, feel free to <a href="{{supportUrl}}">contact support</a>.</p>
                                <p>© {{currentYear}} QuickFix. All rights reserved.</p>
                            </div>
                        </div>
                    </body>
                    </html>
`;
        sendEmail(assignedUser.email, subject, message);
      }

      if (status) {
        const subject = "Status Updated for ticket";

        // TODO: Modify url after frontend deployment
        const text = `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Ticket Status Update</title>
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
                            <p>Dear ${user.name},</p>
                            <p>We wanted to let you know that the status of your ticket has been updated.</p>
                            <p><strong>Ticket ID:</strong> ${ticket._id}</p>
                            <p><strong>New Status:</strong> ${status}</p>
                            <p><strong>Details:</strong> ${ticket.description}</p>
                            <p>You can view and manage your ticket by logging into your account at <a href="{{appUrl}}">QuickFix</a>.</p>
                            <p>Thank you for using QuickFix!</p>
                        </div>
                        <div class="footer">
                            <p>If you have any questions, feel free to <a href="{{supportUrl}}">contact our support team</a>.</p>
                        </div>
                    </div>
                </body>
                </html>
                `;

        sendEmail(user.email, subject, text);
      }

      await ticket.save();

      res.json(ticket);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  deleteTicket: async (req, res) => {
    try {
      const { id } = req.params;
      const ticket = await Ticket.findById(id);
      if (!ticket) return res.status(404).json({ message: "Ticket not found" });

      // Deleting ticket from database
      await ticket.deleteOne();

      // Deleting files in attachments array
      if (ticket.attachments) {
        ticket.attachments.forEach((attachment) => {
          fs.unlinkSync(path.join(__dirname, "..", attachment));
        });
      }

      res.json({ message: "Ticket deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = ticketController;
