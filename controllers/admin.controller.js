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
        (ticket) => ticket.status === "assigned"
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
  getUnassignedEmployees: async (req, res) => {
    try {
      const users = await User.find({ role: "employee" });
      const tickets = await Ticket.find();

      const assignedEmployees = tickets.map((ticket) => {
        if (ticket.assignedTo !== null) {
          return ticket.assignedTo.toString();
        }
      });

      const unassignedEmployees = users.filter(
        (user) => !assignedEmployees.includes(user._id.toString())
      );

      res.json(unassignedEmployees);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },
  getTicketsCompletion: async (req, res) => {
    try {
      // Find tickets where closedAt is not null
      const completedTickets = await Ticket.find({
        closedAt: { $exists: true, $ne: null },
      });

      // Create a map to store counts by formatted date
      const countsByDate = {};

      completedTickets.forEach((ticket) => {
        const formattedDate = new Date(ticket.closedAt)
          .toISOString()
          .split("T")[0]
          .replace(/-/g, "/");

        if (countsByDate[formattedDate]) {
          countsByDate[formattedDate]++;
        } else {
          countsByDate[formattedDate] = 1;
        }
      });

      res.json(countsByDate);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = adminController;
