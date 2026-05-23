const Task = require('../models/Task');
const Project = require('../models/Project');

exports.getStats = async (req, res) => {
  try {
    let projectQuery = {};
    let taskQuery = {};

    if (req.user.role !== 'admin') {
      const userProjects = await Project.find({ 'members.user': req.user.id });
      const projectIds = userProjects.map(p => p._id);
      projectQuery = { _id: { $in: projectIds } };
      taskQuery = { project: { $in: projectIds } };
    }

    const totalProjects = await Project.countDocuments(projectQuery);
    const totalTasks = await Task.countDocuments(taskQuery);
    
    const completedTasks = await Task.countDocuments({ ...taskQuery, status: 'done' });
    const overdueTasksCount = await Task.countDocuments({ 
      ...taskQuery, 
      status: { $ne: 'done' }, 
      dueDate: { $lt: new Date() } 
    });

    const tasksByStatus = {
      todo: await Task.countDocuments({ ...taskQuery, status: 'todo' }),
      in_progress: await Task.countDocuments({ ...taskQuery, status: 'in_progress' }),
      review: await Task.countDocuments({ ...taskQuery, status: 'review' }),
      done: completedTasks
    };

    const myTasks = await Task.find({ ...taskQuery, assignedTo: req.user.id })
      .populate('project', 'name')
      .sort({ dueDate: 1 })
      .limit(5);

    const recentTasks = await Task.find(taskQuery)
      .populate('project', 'name')
      .populate('assignedTo', 'fullName email')
      .sort({ updatedAt: -1 })
      .limit(5);

    res.json({
      totalProjects,
      totalTasks,
      completedTasks,
      overdueTasks: overdueTasksCount,
      myTasks,
      tasksByStatus,
      recentTasks
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
