# Team Task Manager

A full-stack task management application for teams, featuring role-based access control, project management, and a real-time dashboard.

## 🚀 Features

- **Authentication**: Secure JWT-based login and signup with password hashing.
- **Role-Based Access**:
  - **Admin**: Create projects, manage team members, and assign tasks.
  - **Member**: View assigned tasks and update status.
- **Project Management**: Group tasks into projects and collaborate with team members.
- **Task Management**: Create, assign, and track tasks with status and due dates.
- **Dashboard**: Visual overview of total tasks, tasks by status, and overdue alerts.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Axios, React Router, Lucide Icons.
- **Backend**: Node.js, Express.
- **Database**: MongoDB (Mongoose).
- **Authentication**: JWT, BcryptJS.
- **Styling**: Vanilla CSS (Modern Design System).

## 📦 Setup Instructions

### Prerequisites
- Node.js installed.
- MongoDB instance running locally or a MongoDB Atlas URI.

### 1. Clone the repository
```bash
git clone <https://github.com/sakethlingerker/Team-Task-Manager-Full-Stack-.git>
cd team-task-manager
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=your_secret_key
NODE_ENV=development
```
**Seed Data (Optional):**
```bash
node seed.js
```
**Start Backend:**
```bash
npm start
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
**Start Frontend:**
```bash
npm run dev
```

## 📝 Credentials (if seeded)
- **Admin**: `admin@example.com` / `password123`
- **Member**: `john@example.com` / `password123`

## 📄 License
This project is for educational purposes.
