require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Comment = require('../models/Comment');
const connectDB = require('../config/db');

const seedDB = async () => {
  await connectDB();

  try {
    console.log('Clearing old data...');
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    await Comment.deleteMany({});

    console.log('Creating users...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const admin = await User.create({
      fullName: 'Admin User',
      email: 'admin@test.com',
      password: passwordHash,
      role: 'admin'
    });

    const memberJohn = await User.create({
      fullName: 'John Member',
      email: 'member@test.com',
      password: passwordHash,
      role: 'member'
    });

    const memberSarah = await User.create({
      fullName: 'Sarah Dev',
      email: 'sarah@test.com',
      password: passwordHash,
      role: 'member'
    });

    console.log('Creating projects...');
    const project1 = await Project.create({
      name: 'Website Redesign',
      status: 'active',
      owner: admin._id,
      members: [
        { user: admin._id, role: 'admin' },
        { user: memberJohn._id, role: 'member' },
        { user: memberSarah._id, role: 'member' }
      ]
    });

    const project2 = await Project.create({
      name: 'Mobile App Development',
      status: 'active',
      owner: admin._id,
      members: [
        { user: admin._id, role: 'admin' },
        { user: memberJohn._id, role: 'member' },
        { user: memberSarah._id, role: 'member' }
      ]
    });

    console.log('Creating tasks...');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const task1 = await Task.create({
      title: 'Design Homepage',
      status: 'done',
      priority: 'high',
      project: project1._id,
      assignedTo: memberJohn._id,
      createdBy: admin._id
    });

    const task2 = await Task.create({
      title: 'Setup API Routes',
      status: 'in_progress',
      priority: 'high',
      project: project2._id,
      assignedTo: memberSarah._id,
      createdBy: admin._id
    });

    const task3 = await Task.create({
      title: 'Create Login Page',
      status: 'review',
      priority: 'medium',
      project: project1._id,
      assignedTo: memberJohn._id,
      createdBy: admin._id
    });

    const task4 = await Task.create({
      title: 'Database Schema',
      status: 'done',
      priority: 'high',
      project: project2._id,
      assignedTo: admin._id,
      createdBy: admin._id
    });

    const task5 = await Task.create({
      title: 'Write Unit Tests',
      status: 'todo',
      priority: 'low',
      project: project1._id,
      assignedTo: memberSarah._id,
      createdBy: admin._id
    });

    const task6 = await Task.create({
      title: 'Deploy to Railway',
      status: 'todo',
      priority: 'high',
      dueDate: yesterday,
      project: project2._id,
      assignedTo: admin._id,
      createdBy: admin._id
    });

    console.log('Creating comments...');
    await Comment.create({
      content: 'Looks great! Approved.',
      task: task1._id,
      user: admin._id
    });

    await Comment.create({
      content: 'Thanks, I will start on the next task.',
      task: task1._id,
      user: memberJohn._id
    });

    console.log('Database seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
