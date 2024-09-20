# Quick Fix - Backend

## Project Overview

Quick Fix is a ticket management system that handles ticket creation, real-time chat between users and employees, and ticket resolution. The backend is built using Node.js, Express, MongoDB, and Socket.io. The admin manages users, employees, and categories, and can assign tickets either manually.

---

## Features

### 1. **User Authentication and Authorization**

- Users can sign in via Google OAuth (implemented with Passport.js).
- Roles: Admin, Employee, and User. Each role has specific privileges.
- JSON Web Tokens (JWT) are used for user authentication.

### 2. **Ticket Management**

- Users can raise support tickets, which are categorized by predefined categories.
- Employees are assigned to tickets either manually by the admin or automatically via a cron job.
- Tickets have various statuses (e.g., open, assigned, closed).

### 3. **Real-Time Chat**

- Real-time communication is enabled between the user and the assigned employee.
- Chat history is stored in MongoDB, and Socket.io is used for real-time messaging.

### 4. **Admin Dashboard**

- Admins can view analytics about users, tickets, and employees.
- The dashboard provides graphs and charts (e.g., number of tickets resolved, employee workload).

### 5. **Category and User Management**

- Admins can manage ticket categories, create new categories, and assign users or employees.
- Admins have the power to create or remove employee and user accounts.

---

## Tech Stack

- **Node.js** - Server-side JavaScript runtime.
- **Express.js** - Web framework for building RESTful APIs.
- **MongoDB** - NoSQL database for storing user, ticket, and chat data.
- **Socket.io** - For real-time communication between users and employees.
- **JWT** - For handling secure user sessions.

---

## Folder Structure

```
src/
│
├── controllers/    # Controllers for handling requests
├── helpers/        # Helper functions and utilities
├── socket/         # For socket communication
├── middlewares/    # Middleware functions for authentication and authorization
├── models/         # Mongoose models for database entities
├── routes/         # Route definitions
├── utils/          # Utility functions and configurations
├── app.js          # Main application file
└── ...
```

---

## Entities

- **Users:** Manage user data and authentication.
- **Ticket:** Handle ticket-related operations.
- **Categories:** Manage ticket category-related operations.
- **Comment:** Handle chat-related operations.

---

## Installation

### Prerequisites

Ensure you have the following installed:

- Node.js
- npm
- MongoDB

### Installation

1. Pull the repository to your local machine.

```
git pull
```

2. To install all the dependencies:

```
npm install
```

3. Once everything is installed successfully, now it's time to run the server.

```
npm run dev
```

---

### Configuration

```
PORT=3000
MONGODB_URI=your_mongodb_uri
SECRET_KEY=your_jwt_secret
EMAIL_ID=your_email_id
APP_PASSWORD=your_email_app_password
```

### To have a walkthrough into Quick Fix

#### Here are admin credentials

> - vsvs2209@gmail.com
> - password: Admin@1212
