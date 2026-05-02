TEAM TASK MANAGER - FULL STACK APPLICATION
==========================================

A modern, full-stack task management application for teams, featuring role-based access control, project management, and a real-time dashboard. Built with a premium dark-themed design system.

KEY FEATURES
------------

- Authentication: Secure JWT-based login and signup with password hashing.
- Role-Based Access:
  - Admin: Create projects, manage team members, and assign tasks.
  - Member: View assigned tasks and update status.
- Project Management: Group tasks into projects and collaborate with team members.
- Task Management: Create, assign, and track tasks with status and due dates.
- Dashboard: Visual overview of total tasks, tasks by status, and overdue alerts.

DEPLOYMENT (RAILWAY SINGLE-SERVICE)
-----------------------------------

This project is configured as a monorepo that deploys both Frontend and Backend as a single service.

1. Railway Configuration
- Connect your GitHub repository.
- Root Directory: Leave empty (Root).
- Environment Variables:
  - MONGO_URI: Your MongoDB Atlas connection string.
  - JWT_SECRET: A secret key for tokens.
  - PORT: 5000
  - NIXPACKS_NODE_VERSION: 22

2. Manual Setup (Local)
- Run 'npm install' in the root directory.
- Start development servers:
  - 'npm run dev -w frontend'
  - 'npm run dev -w backend'

TECH STACK
----------
- Frontend: React, Vite, Axios, Lucide-React
- Backend: Node.js, Express, Mongoose
- Database: MongoDB Atlas
- Auth: JWT & Bcryptjs

SETUP INSTRUCTIONS
------------------

1. Clone the repository:
git clone https://github.com/sakethlingerker/Team-Task-Manager-Full-Stack-.git

2. Backend Setup:
- cd backend
- npm install
- Create .env with MONGO_URI, JWT_SECRET, PORT=5000, NODE_ENV=development.
- (Optional) Run 'node seed.js' for sample data.
- Run 'npm start'.

3. Frontend Setup:
- cd frontend
- npm install
- Create .env with VITE_API_URL=http://localhost:5000/api.
- Run 'npm run dev'.

LICENSE
-------
This project is for educational purposes.
