const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, minlength: 2 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8 },
  role: { type: String, enum: ['admin','member'], default: 'member' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
