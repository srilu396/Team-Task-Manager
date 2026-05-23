const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateUniqueTeamCode = async () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  let isUnique = false;
  
  while (!isUnique) {
    let randomPart = '';
    for (let i = 0; i < 6; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    code = `TEAM-${randomPart}`;
    
    const existing = await User.findOne({ teamCode: code });
    if (!existing) {
      isUnique = true;
    }
  }
  return code;
};

exports.signup = async (req, res) => {
  try {
    const { fullName, email, password, role, teamCode } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const normalizedRole = role ? role.toLowerCase() : 'member';
    let assignedTeamCode = '';

    if (normalizedRole === 'admin') {
      assignedTeamCode = await generateUniqueTeamCode();
    } else {
      if (!teamCode) {
        return res.status(400).json({ message: 'Team code is required for members' });
      }
      const adminUser = await User.findOne({ role: 'admin', teamCode: teamCode.toUpperCase().trim() });
      if (!adminUser) {
        return res.status(400).json({ message: 'Invalid Team Code. Please contact your administrator.' });
      }
      assignedTeamCode = teamCode.toUpperCase().trim();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      fullName,
      email,
      password: hashedPassword,
      role: normalizedRole,
      teamCode: assignedTeamCode
    });

    await user.save();

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ 
      token, 
      user: { 
        id: user.id, 
        fullName: user.fullName, 
        email: user.email, 
        role: user.role,
        profileImage: user.profileImage,
        avatar: user.avatar,
        teamCode: user.teamCode
      } 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ 
      token, 
      user: { 
        id: user.id, 
        fullName: user.fullName, 
        email: user.email, 
        role: user.role,
        profileImage: user.profileImage,
        avatar: user.avatar,
        teamCode: user.teamCode
      } 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

