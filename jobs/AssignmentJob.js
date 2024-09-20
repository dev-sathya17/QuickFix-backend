const cron = require("node-cron");
const assignEmployeeToTicket = require("../helpers/ticketHelper");

// Schedule the job to run every hour
cron.schedule("10 * * * * *", () => {
  console.log("Checking deadlines...");
  assignEmployeeToTicket();
});
