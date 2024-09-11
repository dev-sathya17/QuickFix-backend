const User = require("../models/user");
const Ticket = require("../models/ticket");

const adminController = {
  getUserCount: async (req, res) => {
    try {
      const allUsers = await User.find({
        role: { $ne: "admin" },
      });

      const users = allUsers.filter((user) => user.role === "user");

      const employees = allUsers.filter((user) => user.role === "employee");

      res.json({ users: users.length, employees: employees.length });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({ role: "user" });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getAllEmployees: async (req, res) => {
    try {
      const employees = await User.find({ role: "employee" });
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getTicketsCountByStatus: async (req, res) => {
    try {
      const tickets = await Ticket.find();
      const openTickets = tickets.filter((ticket) => ticket.status === "open");
      const assignedTickets = tickets.filter(
        (ticket) => ticket.status === "in progress"
      );
      const closedTickets = tickets.filter(
        (ticket) => ticket.status === "closed"
      );
      res.json({
        openTickets: openTickets.length,
        assignedTickets: assignedTickets.length,
        closedTickets: closedTickets.length,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = adminController;
