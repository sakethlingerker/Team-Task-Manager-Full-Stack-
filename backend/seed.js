const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();

    // Create Users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'Admin',
    });

    const member1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'Member',
    });

    const member2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
      role: 'Member',
    });

    console.log('Users created');

    // Create Project
    const project = await Project.create({
      name: 'E-commerce Redesign',
      description: 'Revamping the frontend and backend of our main e-commerce platform.',
      createdBy: admin._id,
      members: [admin._id, member1._id, member2._id],
    });

    console.log('Project created');

    // Create Tasks
    await Task.create([
      {
        title: 'Setup Database Schema',
        description: 'Design and implement the initial Mongoose models.',
        status: 'done',
        dueDate: new Date(),
        project: project._id,
        assignedTo: admin._id,
        createdBy: admin._id,
      },
      {
        title: 'Implement Auth API',
        description: 'Create login and signup endpoints with JWT.',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        project: project._id,
        assignedTo: member1._id,
        createdBy: admin._id,
      },
      {
        title: 'Design Dashboard UI',
        description: 'Create a clean dashboard with task statistics.',
        status: 'todo',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        project: project._id,
        assignedTo: member2._id,
        createdBy: admin._id,
      },
      {
        title: 'Fix Navigation Bug',
        description: 'The navbar is overlapping with content on mobile.',
        status: 'todo',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Overdue
        project: project._id,
        assignedTo: member1._id,
        createdBy: admin._id,
      },
    ]);

    console.log('Tasks created');
    console.log('Seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
