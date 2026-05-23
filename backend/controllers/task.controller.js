const Task = require('../models/Task');
const Comment = require('../models/Comment');
const Project = require('../models/Project');

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
        query.project = { $in: projectIds };
      } else if (!projectIds.some(id => id.toString() === projectId)) {
        return res.status(403).json({ message: 'Access denied to this project' });
      }
    }

    const tasks = await Task.find(query)
      .populate('project', 'name')
      .populate('assignedTo', 'fullName email')
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 });

    res.json(tasks);
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
      .populate('assignedTo', 'fullName email')
      .populate('createdBy', 'fullName email');

    res.status(201).json(populatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name')
      .populate('assignedTo', 'fullName email')
      .populate('createdBy', 'fullName email');

    if (!task) return res.status(404).json({ message: 'Task not found' });

    const comments = await Comment.find({ task: req.params.id })
      .populate('user', 'fullName email')
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

    const allowedUpdates = ['title', 'description', 'status', 'priority', 'dueDate', 'assignedTo'];
    allowedUpdates.forEach(update => {
      if (req.body[update] !== undefined) {
        task[update] = req.body[update];
      }
    });

    await task.save();
    
    const populatedTask = await Task.findById(task._id)
      .populate('project', 'name')
      .populate('assignedTo', 'fullName email')
      .populate('createdBy', 'fullName email');

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
    
    const populatedComment = await Comment.findById(comment._id).populate('user', 'fullName email');
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
