// Importing bcrypt library for encrypting passwords
const bcrypt = require("bcrypt");

// Importing the User model
const User = require("../models/user");

const Ticket = require("../models/ticket");

// Importing helper function to send email
const sendEmail = require("../helpers/emailHelper");

// Importing the jwt library
const jwt = require("jsonwebtoken");

// Importing the EMAIL_ID from the configuration file
const { SECRET_KEY } = require("../utils/config");
const generateOtp = require("../helpers/userHelper");

const fs = require("fs");
const path = require("path");

const userController = {
  // API for registering users
  register: async (req, res) => {
    try {
      // Destructuring the request body
      const { name, email, password, mobile, role } = req.body;

      // Checking if user already exists
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.json({ message: "User with this email already exists" });
      }

      // Checking if mobile number already exists
      const existingMobile = await User.findOne({ mobile });

      if (existingMobile) {
        return res.json({ message: "Mobile number must be unique" });
      }

      // Encrypting the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Creating a new user
      const user = new User({
        name,
        email,
        password: hashedPassword,
        mobile,
        image: req.file ? req.file.path : "uploads/avatar.png",
        role: role || "user",
      });

      // Saving the user to the database
      await user.save();

      const subject = "Welcome to Quick Fix!";
      if (role === "employee") {
        const text = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to QuickFix - Employee Login</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                    color: #333;
                }
                .email-container {
                    max-width: 600px;
                    margin: 30px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
                .email-header {
                    background-color: #3b5998;
                    padding: 20px;
                    text-align: center;
                    color: #ffffff;
                }
                .email-header h1 {
                    margin: 0;
                    font-size: 24px;
                    font-weight: bold;
                }
                .email-body {
                    padding: 30px;
                    font-size: 16px;
                    line-height: 1.6;
                }
                .email-body h2 {
                    font-size: 20px;
                    color: #333;
                }
                .email-body p {
                    margin: 15px 0;
                }
                .email-body .credentials {
                    background-color: #f9f9f9;
                    padding: 15px;
                    border-radius: 4px;
                    border: 1px solid #ddd;
                    margin: 20px 0;
                }
                .email-body .credentials strong {
                    display: block;
                    margin-bottom: 5px;
                }
                .cta-button {
                    display: inline-block;
                    padding: 10px 20px;
                    margin-top: 20px;
                    background-color: #3b5998;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 4px;
                }
                .cta-button:hover {
                    background-color: #2a4480;
                }
                .email-footer {
                    background-color: #f4f4f4;
                    padding: 15px;
                    text-align: center;
                    font-size: 12px;
                    color: #888;
                }
            </style>
        </head>
        <body>

            <div class="email-container">
                <!-- Header -->
                <div class="email-header">
                    <h1>Welcome to QuickFix</h1>
                </div>

                <!-- Body -->
                <div class="email-body">
                    <h2>Hi ${name},</h2>
                    <p>
                        Congratulations on joining <strong>QuickFix</strong> as part of our team! We are excited to have you on board.
                        As an employee, you'll be responsible for helping our users resolve their tickets efficiently and maintaining high-quality support.
                    </p>

                    <p>
                        Below are your login credentials to access your employee dashboard and begin managing tickets:
                    </p>

                    <div class="credentials">
                        <strong>Email:</strong> ${email} <br>
                        <strong>Password:</strong> ${password}
                    </div>

                    <p style="text-align: center;">
                        <a href="https://quick-fix-tickets.netlify.app/" class="cta-button">Log In to QuickFix</a>
                    </p>

                    <p>Looking forward to great teamwork!</p>

                    <p>Best Regards,<br>The QuickFix Team</p>
                </div>

                <!-- Footer -->
                <div class="email-footer">
                    &copy; 2024 QuickFix. All Rights Reserved.
                </div>
            </div>

        </body>
        </html>
`;

        // Sending an email notification
        sendEmail(email, subject, text);
      } else {
        const text = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Welcome to QuickFix</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                            color: #333;
                        }
                        .email-container {
                            max-width: 600px;
                            margin: 30px auto;
                            background-color: #ffffff;
                            border-radius: 8px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                            overflow: hidden;
                        }
                        .email-header {
                            background-color: #3b5998;
                            padding: 20px;
                            text-align: center;
                            color: #ffffff;
                        }
                        .email-header h1 {
                            margin: 0;
                            font-size: 24px;
                            font-weight: bold;
                        }
                        .email-body {
                            padding: 30px;
                            font-size: 16px;
                            line-height: 1.6;
                        }
                        .email-body h2 {
                            font-size: 20px;
                            color: #333;
                        }
                        .email-body p {
                            margin: 15px 0;
                        }
                        .cta-button {
                            display: inline-block;
                            padding: 10px 20px;
                            margin-top: 20px;
                            background-color: #3b5998;
                            color: #ffffff;
                            text-decoration: none;
                            border-radius: 4px;
                        }
                        .cta-button:hover {
                            background-color: #2a4480;
                        }
                        .email-footer {
                            background-color: #f4f4f4;
                            padding: 15px;
                            text-align: center;
                            font-size: 12px;
                            color: #888;
                        }
                    </style>
                </head>
                <body>

                    <div class="email-container">
                        <!-- Header -->
                        <div class="email-header">
                            <h1>Welcome to QuickFix</h1>
                        </div>

                        <!-- Body -->
                        <div class="email-body">
                            <h2>Hi ${name},</h2>
                            <p>
                                Thank you for registering with <strong>QuickFix</strong>! We are thrilled to have you on board.
                                QuickFix is your all-in-one solution for managing support tickets efficiently. As a registered user, 
                                you can create, track, and resolve tickets with ease, ensuring all your issues are taken care of in no time.
                            </p>

                            <p>
                                Your account has been successfully created. Now, you can log in to start creating and tracking your tickets 
                                or collaborating with support teams.
                            </p>

                            <p style="text-align: center;">
                                <a href="https://quick-fix-tickets.netlify.app/" class="cta-button">Log In to QuickFix</a>
                            </p>

                            <p>
                                We're excited to help you resolve your tickets quickly and efficiently!
                            </p>

                            <p>Best Regards,<br>The QuickFix Team</p>
                        </div>

                        <!-- Footer -->
                        <div class="email-footer">
                            &copy; 2024 QuickFix. All Rights Reserved.
                        </div>
                    </div>

                </body>
                </html>`;

        // Sending an email notification
        sendEmail(email, subject, text);
      }

      // Sending a success response
      res.status(201).json({
        message: "Your account has been created successfully.",
        user,
      });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API for user login
  login: async (req, res) => {
    try {
      // getting the user email and password from the request body
      const { email, password } = req.body;

      // checking if the user exists in the database
      const user = await User.findOne({ email });

      // if the user does not exist, return an error response
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      // if the user exists check the password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      // if the password is invalid, return an error response
      if (!isPasswordValid) {
        return res.status(400).send({ message: "Invalid password" });
      }

      // generating a JWT token
      const token = jwt.sign({ id: user._id }, SECRET_KEY);

      // setting the token as a cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + 24 * 3600000), // 24 hours from login
        path: "/",
      });

      // Setting user role as cookie
      res.cookie("role", user.role, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + 24 * 3600000), // 24 hours from login
        path: "/",
      });

      // sending a success response
      res.status(200).json({
        message: "Login successful",
        user,
      });
    } catch (error) {
      // sending an error response
      res.status(500).send({ message: error.message });
    }
  },

  googleSignIn: async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        const token = jwt.sign({ id: user._id }, SECRET_KEY);
        const { password: pass, ...data } = user._doc;
        res.cookie("role", user.role, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          expires: new Date(Date.now() + 24 * 3600000), // 24 hours from login
          path: "/",
        });
        res
          .cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            expires: new Date(Date.now() + 24 * 3600000), // 24 hours from login
            path: "/",
          })
          .status(200)
          .json(data);
      } else {
        const generatedPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
          image: req.body.photo,
          mobile: "",
          role: "user",
        });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, SECRET_KEY);
        const { password: pass, ...data } = newUser._doc;
        res.cookie("role", newUser.role, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          expires: new Date(Date.now() + 24 * 3600000), // 24 hours from login
          path: "/",
        });
        res
          .cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            expires: new Date(Date.now() + 24 * 3600000), // 24 hours from login
            path: "/",
          })
          .status(200)
          .json(data);
      }
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },

  // API for user logout
  logout: async (req, res) => {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(400).send({ message: "User not authenticated" });
      }

      // clearing the cookie
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
      res.clearCookie("role", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });

      // sending a success response
      res.status(200).send({ message: "Logged out successfully" });
    } catch (error) {
      // Sending an error response
      res.status(500).send({ message: error.message });
    }
  },

  // API for sending email for the user when user wants to reset password
  forgotPassword: async (req, res) => {
    try {
      // Extracting values from request body
      const { email } = req.body;

      // Checking if this email is of a valid user
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ message: "User with this email does not exist" });
      }

      // Generating otp
      const otp = generateOtp();

      // Update user
      user.otp = otp;
      await user.save();

      const subject = "Password Reset Request";
      const message = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Reset Your Quick Fix Password</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f9f9f9;
                            margin: 0;
                            padding: 20px;
                        }
                        .container {
                            max-width: 600px;
                            background-color: #ffffff;
                            padding: 30px;
                            border-radius: 10px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            margin: auto;
                        }
                        h1 {
                            color: #333333;
                            font-size: 24px;
                        }
                        p {
                            font-size: 16px;
                            line-height: 1.6;
                            color: #555555;
                        }
                        .otp {
                            font-size: 24px;
                            font-weight: bold;
                            color: #28a745;
                            letter-spacing: 2px;
                            margin: 20px 0;
                            padding: 10px 20px;
                            border: 1px dashed #28a745;
                            display: inline-block;
                            background-color: #f0f9f4;
                            border-radius: 5px;
                        }
                        
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Password Reset Request</h1>
                        <p>Hi ${user.name},</p>
                        <p>You recently requested to reset your password for your Quick Fix account. Use the following OTP (One Time Password) to reset your password:</p>
                        <div class="otp">${otp}</div>
                        <p>This OTP is valid for the next 10 minutes. If you did not request a password reset, please ignore this email or contact support if you have any concerns.</p>
                        <p>Thank you,<br>The Quick Fix Team</p>
                    </div>
                </body>
                </html>
                `;

      // Sending an email
      sendEmail(email, subject, message);

      // Sending a success response
      res.status(200).json({
        message: "OTP successfully sent to your email address.",
      });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to verify OTP
  verifyOtp: async (req, res) => {
    try {
      const { otp, email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(404)
          .send({ message: "user not found with this email id" });
      }

      if (user.otp === otp) {
        user.otp = 0;
        await user.save();
        res.status(200).send({ message: "OTP verified successfully" });
      } else {
        return res.status(400).send({ message: "Invalid OTP" });
      }
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },

  // API for resetting password
  resetPassword: async (req, res) => {
    try {
      // Extracting values from request body
      const { email, password } = req.body;

      // Checking if this email is of a valid user
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ message: "User with this email does not exist" });
      }

      // Encrypting the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update user
      user.password = hashedPassword;
      await user.save();

      // Sending a success response
      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to get user profile information
  getProfile: async (req, res) => {
    try {
      // Getting user id from request parameters
      const id = req.userId;

      // Fetching the user from the database
      const user = await User.findById(id, "-password -otp -__v");

      // If user not found, return error response
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // If user found, return the user data
      res.json(user);
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to update user profile information
  updateProfile: async (req, res) => {
    try {
      // Getting user id from request parameters
      const { id } = req.params;
      const { name, email, mobile } = req.body;

      const user = await User.findById(id);

      // If user not found, return error response
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Updating user profile information
      user.name = name || user.name;
      user.email = email || user.email;
      user.mobile = mobile || user.mobile;
      user.image = req.file ? req.file.path : user.image;

      // Saving info to the database
      const updatedUser = await user.save();

      // If user found, return the updated user data
      res.json({ message: "User profile updated successfully", updatedUser });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to delete user
  deleteProfile: async (req, res) => {
    try {
      // Getting user id from request parameters
      const { id } = req.params;

      // Finding and deleting the user from the database using the id in the request parameters.
      const user = await User.findByIdAndDelete(id);

      // If user not found, return error response
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.image && user.image !== "uploads/avatar.png") {
        fs.unlinkSync(path.join(__dirname, "..", user.image));
      }

      user.tickets.forEach(async (ticket) => {
        await Ticket.findByIdAndDelete(ticket._id);
      });

      const currentUser = await User.findById(req.userId);

      if (currentUser.role !== "admin") {
        res.clearCookie("token");
        res.clearCookie("role");
      }

      // returning success response, if user is deleted
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to check authentication
  checkAuthentication: async (req, res) => {
    try {
      const token = req.cookies.token;
      const role = req.cookies.role;

      // If token does not exist
      if (!token) {
        return res.status(401).json({ message: "Access Denied" });
      }

      // Verifying the token using JWT
      try {
        const verified = jwt.verify(token, SECRET_KEY);
        res.status(200).json({ message: "Authentication successful", role });
      } catch (error) {
        // Sending an error response
        return res.status(401).json({ message: "Invalid token" });
      }
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },

  // API to view user tickets
  getTickets: async (req, res) => {
    try {
      // Getting user id from request parameters
      const user = await User.findById(req.userId).populate("tickets");

      // If user not found, return error response
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // If user found, return the user's tickets
      res.json({ tickets: user.tickets });
    } catch (error) {
      // Sending an error response
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = userController;
