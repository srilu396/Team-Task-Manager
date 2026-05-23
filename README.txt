================================================================
TASKNOVA - COLLABORATIVE TASK MANAGEMENT PLATFORM
================================================================

A premium full-stack project management web application
built for modern high-velocity teams. Manage projects,
assign tasks, track progress, and collaborate in
real-time - all in one unified workspace.

----------------------------------------------------------------
LIVE DEMO AND LINKS
----------------------------------------------------------------
Live Application : https://team-task-manager-frontend-azure.vercel.app
GitHub Repository: https://github.com/srilu396/Team-Task-Manager-frontend
Demo Video       : Coming Soon

----------------------------------------------------------------
LOGIN CREDENTIALS
----------------------------------------------------------------

ADMIN ACCOUNT:
  Email    : admin1@tasknova.com
  Password : Admin1@1234
  TeamCode : TEAM-JBD8TH
  Access   : Full admin dashboard and all features

MEMBER ACCOUNTS (Password for all: Member@1234)

  1. John Anderson
     Email: john@tasknova.com
     Password: Member@1234

  2. Sarah Mitchell
     Email: sarah@tasknova.com
     Password: Member@1234

  3. Alex Johnson
     Email: alex@tasknova.com
     Password: Member@1234

----------------------------------------------------------------
FEATURES
----------------------------------------------------------------

AUTHENTICATION AND SECURITY
- JWT based secure authentication system
- Bcrypt password hashing for security
- Role based access control (Admin and Member)
- Protected routes on both frontend and backend
- Team code system for member registration

ADMIN FEATURES
- Full dashboard with team wide statistics
- Create and manage multiple projects
- Assign tasks to specific team members
- View all member activity and progress
- Manage team members and their roles
- Send real time notifications to members
- Custom task status colors
- Project progress tracking with charts
- Bulk assign members to projects

MEMBER FEATURES
- Personal dashboard showing only assigned work
- View only projects they are part of
- Update task status in real time
- Add comments on tasks
- Receive instant notifications when assigned a task
- Upcoming deadline tracking
- Grid and list view toggle for tasks

PROJECT MANAGEMENT
- Create projects with name and description
- Add and remove members from projects
- Kanban board view with status columns
- Task filtering by status and priority
- Project progress visualization with progress bars

TASK MANAGEMENT
- Create tasks with title description and priority
- Assign tasks to specific team members
- Custom status columns Todo In Progress Review Testing Done
- Due date tracking with overdue alerts highlighted in red
- Comment system on each task for collaboration
- Priority levels Low Medium High with color coding

DASHBOARD AND ANALYTICS
- Real time statistics cards
- Task status donut chart using Recharts
- Task priority bar chart
- Team activity feed
- Overdue task alerts and warnings
- Project completion progress bars

REAL TIME NOTIFICATIONS
- Instant notification when task is assigned
- Socket.io powered live updates
- Notification bell with unread count badge
- Mark as read and mark all as read functionality

----------------------------------------------------------------
TECH STACK
----------------------------------------------------------------

FRONTEND:
- React.js 18 (UI Framework)
- Vite (Build Tool)
- Tailwind CSS (Styling)
- React Router v6 (Navigation)
- Axios (HTTP API Calls)
- Socket.io Client (Real Time Updates)
- Recharts (Data Visualization)
- Lucide React (Icons)
- Framer Motion (Animations)

BACKEND:
- Node.js (Runtime Environment)
- Express.js (REST API Framework)
- MongoDB Atlas (Cloud Database)
- Mongoose (ODM for MongoDB)
- JWT (Authentication Tokens)
- Bcrypt.js (Password Hashing)
- Socket.io (WebSocket Server)
- Multer (Profile Image Upload)
- Cors and Helmet (Security Middleware)

----------------------------------------------------------------
PROJECT STRUCTURE
----------------------------------------------------------------

tasknova/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── project.controller.js
│   │   ├── task.controller.js
│   │   ├── user.controller.js
│   │   ├── dashboard.controller.js
│   │   └── notification.controller.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Task.js
│   │   ├── Comment.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── project.routes.js
│   │   ├── task.routes.js
│   │   ├── user.routes.js
│   │   ├── dashboard.routes.js
│   │   └── notification.routes.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   └── upload.middleware.js
│   ├── seed/
│   │   └── createAccounts.js
│   └── server.js
├── frontend/
│   ├── public/
│   │   ├── logo.svg
│   │   └── hero_image.png
│   └── src/
│       ├── components/
│       │   ├── layout/
│       │   ├── ui/
│       │   ├── tasks/
│       │   ├── projects/
│       │   └── dashboard/
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   ├── ToastContext.jsx
│       │   └── NotificationContext.jsx
│       ├── pages/
│       │   ├── Landing.jsx
│       │   ├── Login.jsx
│       │   ├── Signup.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Projects.jsx
│       │   ├── ProjectDetail.jsx
│       │   ├── MyTasks.jsx
│       │   └── Team.jsx
│       ├── services/
│       ├── hooks/
│       ├── App.jsx
│       └── main.jsx
├── package.json
└── README.md

----------------------------------------------------------------
LOCAL SETUP GUIDE
----------------------------------------------------------------

Prerequisites:
- Node.js v18 or higher
- npm v9 or higher
- MongoDB Atlas free account
- Git installed

Step 1 - Clone Repository
Command:
git clone https://github.com/srilu396/Team-Task-Manager-frontend.git
cd Team-Task-Manager-frontend

Step 2 - Install All Dependencies
Command:
npm run install-all

Step 3 - Configure Environment Variables

Create backend/.env file:
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=super_secret_tasknova_jwt_key_2026
NODE_ENV=development
CLIENT_URL=http://localhost:3000

Create frontend/.env file:
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

Step 4 - Seed Database
Command:
npm run seed

This creates all test accounts, 3 projects, and 15 tasks automatically.

Step 5 - Start Application
Command:
npm run dev

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

----------------------------------------------------------------
DEPLOYMENT
----------------------------------------------------------------

DATABASE - MONGODB ATLAS
1. Create free account at mongodb.com/atlas
2. Create M0 free cluster
3. Add IP 0.0.0.0/0 to allow all connections
4. Copy connection string to MONGODB_URI

FRONTEND - VERCEL
1. Push code to GitHub
2. Import project at vercel.com
3. Set root directory to frontend
4. Add environment variable VITE_API_URL
5. Deploy and get live URL

BACKEND - RAILWAY
1. Go to railway.app
2. New Project from GitHub repo
3. Set root directory to backend
4. Add all environment variables
5. Deploy and get live API URL

----------------------------------------------------------------
API ENDPOINTS REFERENCE
----------------------------------------------------------------

AUTHENTICATION:
POST  /api/auth/signup     Register new user
POST  /api/auth/login      Login and get JWT token
GET   /api/auth/me         Get current logged in user

PROJECTS:
GET    /api/projects              Get all projects for user
POST   /api/projects              Create new project (Admin)
GET    /api/projects/:id          Get single project detail
PUT    /api/projects/:id          Update project (Admin)
DELETE /api/projects/:id          Delete project (Admin)
POST   /api/projects/:id/members  Add member to project
DELETE /api/projects/:id/members/:userId  Remove member

TASKS:
GET    /api/tasks                 Get tasks with filters
POST   /api/tasks                 Create new task
GET    /api/tasks/:id             Get single task detail
PUT    /api/tasks/:id             Update task
DELETE /api/tasks/:id             Delete task (Admin)
POST   /api/tasks/:id/comments    Add comment to task
GET    /api/tasks/:id/comments    Get task comments

USERS:
GET  /api/users                   Get all members (Admin)
PUT  /api/users/:id/role          Update user role (Admin)
POST /api/users/upload-avatar     Upload profile picture

DASHBOARD:
GET  /api/dashboard/stats         Get all dashboard statistics

NOTIFICATIONS:
GET  /api/notifications           Get my notifications
PUT  /api/notifications/:id/read  Mark one as read
PUT  /api/notifications/read-all  Mark all as read

----------------------------------------------------------------
ROLE BASED ACCESS CONTROL
----------------------------------------------------------------

Feature                          | Admin | Member
---------------------------------|-------|-------
View Admin Dashboard             | Yes   | No
Create Projects                  | Yes   | No
Delete Projects                  | Yes   | No
Add Team Members                 | Yes   | No
Remove Members                   | Yes   | No
Create Tasks                     | Yes   | No
Assign Tasks to Others           | Yes   | No
Delete Tasks                     | Yes   | No
View All Team Tasks              | Yes   | No
Access Team Page                 | Yes   | No
View Personal Dashboard          | Yes   | Yes
Update Own Task Status           | Yes   | Yes
Add Task Comments                | Yes   | Yes
View Assigned Projects           | Yes   | Yes
Receive Notifications            | Yes   | Yes

----------------------------------------------------------------
SCREENSHOTS
----------------------------------------------------------------

LANDING PAGE
Clean modern landing page with TaskNova branding

ADMIN DASHBOARD
Full statistics cards, charts, team overview, project progress, and activity feed

MEMBER DASHBOARD
Personal task view with status tracking, deadline alerts, and assigned projects

KANBAN BOARD
Drag and drop task management across Todo, In Progress, Review, Testing, Done columns

TEAM MANAGEMENT
Member list with role management and bulk project assignment feature

----------------------------------------------------------------
DEVELOPER INFO
----------------------------------------------------------------
Developer : Srilu
GitHub    : https://github.com/srilu396
Live App  : https://team-task-manager-frontend-azure.vercel.app
Project   : TaskNova Team Task Manager

----------------------------------------------------------------
ASSIGNMENT DETAILS
----------------------------------------------------------------
Project Name : TaskNova - Team Task Manager
Type         : Full Stack Web Application
Stack        : MERN + Socket.io
Database     : MongoDB Atlas
Deployment   : Vercel + Railway
Timeline     : 1 to 2 days

----------------------------------------------------------------
Built with love using MERN Stack and Socket.io
(C) 2026 TaskNova - All Rights Reserved
