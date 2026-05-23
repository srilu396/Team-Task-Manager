# Team Task Manager

A full-stack project management application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **Authentication:** JWT-based login and signup.
- **Role-Based Access:** Admin and Member roles with different permissions.
- **Dashboard:** Overview of statistics, recent tasks, and overdue items.
- **Projects:** Create, edit, delete, and manage team members in projects.
- **Tasks:** Kanban board for tasks, assignments, priorities, due dates, and comments.
- **Team Management:** Admin controls for promoting/demoting users.

## Tech Stack

- **Frontend:** React (Create React App), Tailwind CSS, React Router v6, Lucide React icons, Recharts, Axios.
- **Backend:** Node.js, Express, MongoDB (Mongoose), JSON Web Tokens (JWT), bcrypt.

## Setup Instructions

1. **Install dependencies**
   ```bash
   npm run install-all
   ```

2. **Configure Environment Variables**
   Ensure `backend/.env` contains:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://teamtask:taskadmin123@cluster0.abcde.mongodb.net/taskmanager?retryWrites=true&w=majority
   JWT_SECRET=super_secret_team_task_jwt_key_2023
   ```
   *Note: Using the placeholder connection string from requirements.*

3. **Seed the Database** (Optional)
   ```bash
   npm run seed
   ```
   This will create a default admin user:
   - Email: `admin@example.com`
   - Password: `password123`

4. **Run the Application Locally**
   ```bash
   npm run dev
   ```
   - Frontend runs on `http://localhost:3000`
   - Backend runs on `http://localhost:5000`

## Deployment

### Vercel
A `vercel.json` file is provided for deploying the monorepo to Vercel.

### Heroku / Render
A `Procfile` is provided for Heroku/Render deployments. Make sure to build the React app and serve it from Express in production, or deploy frontend and backend separately.
