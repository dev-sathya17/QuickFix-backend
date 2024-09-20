const Ticket = require("../models/ticket");
const User = require("../models/user");
const sendEmail = require("./emailHelper");

const assignEmployeeToTicket = async () => {
  try {
    const employees = await User.find({
      role: "employee",
    });
    const openTickets = await Ticket.find({
      status: "open",
      assignedTo: null,
    });
    const assignedTickets = await Ticket.find({
      status: "assigned",
    });
    if (employees.length === 0 || openTickets.length === 0) {
      console.log("No available employees or open tickets found.");
      return;
    }
    const unassignedEmployees = [];

    const employeeIds = employees.map((employee) => employee._id);

    if (assignedTickets.length === 0) {
      unassignedEmployees.push([...employeeIds]);
    } else {
      assignedTickets.forEach(async (ticket, index) => {
        if (!employeeIds.includes(ticket.assignedTo)) {
          unassignedEmployees.push(employees[index]);
        }
      });
    }

    if (unassignedEmployees.length === 0) {
      console.log("All employees are already assigned to open tickets.");
      return;
    }

    openTickets.forEach(async (ticket) => {
      const randomEmployee =
        unassignedEmployees[
          Math.floor(Math.random() * unassignedEmployees.length)
        ];

      const updatedTicket = await Ticket.findByIdAndUpdate(ticket._id, {
        assignedTo: randomEmployee._id,
        status: "assigned",
      }).populate("owner");

      const subject = "Ticket Assignment";
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
                  <p>Dear ${updatedTicket.owner.name},</p>
                  <p>We wanted to let you know that one of our employees has been assigned to your ticket.</p>
                  <p><strong>Ticket ID:</strong> ${updatedTicket._id}</p>
                  <p><strong>Assigned To:</strong> ${randomEmployee.name}</p>
                  <p><strong>New Status:</strong> ${updatedTicket.status}</p>
                  <p><strong>Details:</strong> ${updatedTicket.description}</p>
                  <p>You can view and manage your ticket by logging into your account at <a href="https://quick-fix-tickets.netlify.app/">QuickFix</a>.</p>
                  <p>Thank you for using QuickFix!</p>
              </div>
              <div class="footer">
                  <p>©QuickFix. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
      `;
      sendEmail(ticket.owner.email, subject, text);

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
                      <p>Dear ${randomEmployee.name},</p>
                      <p>You have been assigned to a new ticket in QuickFix. Please review the details below:</p>
                      <p><strong>Ticket ID:</strong> ${updatedTicket._id}</p>
                      <p><strong>Ticket Title:</strong> ${updatedTicket.title}</p>
                      <p><strong>Description:</strong> ${updatedTicket.description}</p>
                      <p>You can view and start working on the ticket by logging into your account: <a href="https://quick-fix-tickets.netlify.app/">QuickFix Dashboard</a>.</p>
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
      sendEmail(randomEmployee.email, subject, message);
      console.log(
        `Assigned ticket ${ticket._id} to employee ${randomEmployee.name}`
      );
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = assignEmployeeToTicket;
