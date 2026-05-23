const Task = require('../models/Task');
const Comment = require('../models/Comment');
const Project = require('../models/Project');
const { sendNotification } = require('../utils/notification.helper');

exports.getTasks = async (req, res) => {
  try {
    const { projectId, status, priority, assignedTo, search } = req.query;
    
    let query = {};
    if (projectId) query.project = projectId;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (req.user.role !== 'admin') {
      const userProjects = await Project.find({ 'members.user': req.user.id });
      const projectIds = userProjects.map(p => p._id);
      
      if (!projectId) {
        query.assignedTo = req.user.id;
      } else if (!projectIds.some(id => id.toString() === projectId)) {
        return res.status(403).json({ message: 'Access denied to this project' });
      }
    }

    const tasks = await Task.find(query)
      .populate('project', 'name')
      .populate('assignedTo', 'fullName email profileImage avatar')
      .populate('createdBy', 'fullName email profileImage avatar')
      .sort({ createdAt: -1 })
      .lean();

    const tasksWithComments = await Promise.all(tasks.map(async (task) => {
      const commentsCount = await Comment.countDocuments({ task: task._id });
      return { ...task, commentsCount };
    }));

    res.json(tasksWithComments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, project, assignedTo } = req.body;

    const task = new Task({
      title,
      description,
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate,
      project,
      assignedTo,
      createdBy: req.user.id
    });

    await task.save();
    
    const populatedTask = await Task.findById(task._id)
      .populate('project', 'name')
      .populate('assignedTo', 'fullName email profileImage avatar')
      .populate('createdBy', 'fullName email profileImage avatar');

    // Notify assigned member
    if (assignedTo) {
      await sendNotification(
        req.app, 
        assignedTo, 
        `You have been assigned to task: "${title}"`, 
        task._id
      );
    }

    res.status(201).json(populatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name')
      .populate('assignedTo', 'fullName email profileImage avatar')
      .populate('createdBy', 'fullName email profileImage avatar');

    if (!task) return res.status(404).json({ message: 'Task not found' });

    const comments = await Comment.find({ task: req.params.id })
      .populate('user', 'fullName email profileImage avatar')
      .sort({ createdAt: 1 });

    res.json({ task, comments });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const originalAssignedTo = task.assignedTo ? task.assignedTo.toString() : null;
    const originalStatus = task.status;

    const allowedUpdates = ['title', 'description', 'status', 'priority', 'dueDate', 'assignedTo'];
    allowedUpdates.forEach(update => {
      if (req.body[update] !== undefined) {
        task[update] = req.body[update];
      }
    });

    await task.save();
    
    const populatedTask = await Task.findById(task._id)
      .populate('project', 'name')
      .populate('assignedTo', 'fullName email profileImage avatar')
      .populate('createdBy', 'fullName email profileImage avatar');

    // Trigger notifications if needed
    const newAssignedTo = task.assignedTo ? task.assignedTo.toString() : null;
    
    // Scenario 1: Re-assignment
    if (newAssignedTo && newAssignedTo !== originalAssignedTo) {
      await sendNotification(
        req.app,
        task.assignedTo,
        `You have been assigned to task: "${task.title}"`,
        task._id
      );
    }
    
    // Scenario 2: Status update
    if (originalStatus !== task.status) {
      const friendlyStatus = task.status.toUpperCase().replace('_', ' ');
      
      // 1. Notify the assigned member (if updated by someone else)
      if (task.assignedTo && req.user.id !== task.assignedTo.toString()) {
        await sendNotification(
          req.app,
          task.assignedTo,
          `Task "${task.title}" status updated to: ${friendlyStatus}`,
          task._id
        );
      }
      
      // 2. Notify all admins (if updated by a member)
      if (req.user.role !== 'admin') {
        const User = require('../models/User');
        const admins = await User.find({ role: 'admin' });
        for (const admin of admins) {
          await sendNotification(
            req.app,
            admin._id,
            `${req.user.fullName} updated task "${task.title}" status to: ${friendlyStatus}`,
            task._id
          );
        }
      }
    }

    res.json(populatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await Comment.deleteMany({ task: req.params.id });
    await task.deleteOne();

    res.json({ message: 'Task removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    
    const comment = new Comment({
      content,
      task: req.params.id,
      user: req.user.id
    });

    await comment.save();
    
    const populatedComment = await Comment.findById(comment._id).populate('user', 'fullName email profileImage avatar');
    
    // Send notifications
    const task = await Task.findById(req.params.id);
    if (task) {
      // 1. Notify the assigned member (if comment added by someone else)
      if (task.assignedTo && req.user.id !== task.assignedTo.toString()) {
        await sendNotification(
          req.app,
          task.assignedTo,
          `${req.user.fullName} commented on your task "${task.title}": "${content.substring(0, 30)}${content.length > 30 ? '...' : ''}"`,
          task._id
        );
      }
      
      // 2. Notify all admins (if comment added by a member)
      if (req.user.role !== 'admin') {
        const User = require('../models/User');
        const admins = await User.find({ role: 'admin' });
        for (const admin of admins) {
          await sendNotification(
            req.app,
            admin._id,
            `${req.user.fullName} commented on task "${task.title}": "${content.substring(0, 30)}${content.length > 30 ? '...' : ''}"`,
            task._id
          );
        }
      }
    }

    res.status(201).json(populatedComment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ task: req.params.id })
      .populate('user', 'fullName email')
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
