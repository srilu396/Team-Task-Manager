const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  description: { type: String },
  status: { type: String, enum: ['active','completed','archived'], default: 'active' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['admin','member'], default: 'member' }
  }],
  customStatuses: [{
    name: { type: String, required: true },
    color: { type: String, required: true },
    bg: { type: String, required: true },
    order: { type: Number, default: 0 }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
