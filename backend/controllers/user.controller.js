const User = require('../models/User');
const Task = require('../models/Task');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: { $ne: 'admin' },
      _id: { $ne: req.user.id }
    }).select('-password').lean();
    
    const usersWithTaskCount = await Promise.all(users.map(async (user) => {
      const assignedTasksCount = await Task.countDocuments({ assignedTo: user._id });
      return { ...user, assignedTasksCount };
    }));
    
    res.json(usersWithTaskCount);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { fullName, profileImage } = req.body;
    const user = await User.findById(req.user.id).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (fullName) user.fullName = fullName;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const avatarPath = `/uploads/avatars/${req.file.filename}`;
    user.avatar = avatarPath;
    // Keep profileImage in sync too just in case
    user.profileImage = avatarPath;
    await user.save();
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

