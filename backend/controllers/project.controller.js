const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

exports.getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'admin') {
      projects = await Project.find().populate('owner', 'fullName email').populate('members.user', 'fullName email');
    } else {
      projects = await Project.find({ 'members.user': req.user.id }).populate('owner', 'fullName email').populate('members.user', 'fullName email');
    }
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = new Project({
      name,
      description,
      owner: req.user.id,
      members: [{ user: req.user.id, role: 'admin' }]
    });

    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'fullName email')
      .populate('members.user', 'fullName email role avatar');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isMember = project.members.some(member => member.user._id.toString() === req.user.id);
    if (req.user.role !== 'admin' && !isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const tasks = await Task.find({ project: req.params.id })
      .populate('assignedTo', 'fullName email')
      .populate('createdBy', 'fullName email');

    res.json({ project, tasks });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description, status },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await Task.deleteMany({ project: req.params.id });
    await project.deleteOne();

    res.json({ message: 'Project removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { email } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: 'Project not found' });

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) return res.status(404).json({ message: 'User not found' });

    if (project.members.some(member => member.user.toString() === userToAdd.id)) {
      return res.status(400).json({ message: 'User already a member' });
    }

    project.members.push({ user: userToAdd.id, role: 'member' });
    await project.save();

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: 'Project not found' });

    project.members = project.members.filter(member => member.user.toString() !== req.params.userId);
    await project.save();

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
