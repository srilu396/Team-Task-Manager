const Task = require('../models/Task');
const Project = require('../models/Project');

exports.getStats = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';

    if (isAdmin) {
      const totalProjects = await Project.countDocuments({ owner: req.user.id });
      const allProjects = await Project.find({ owner: req.user.id }).populate('members.user', 'fullName').lean();
      
      // Calculate unique members across all projects
      const uniqueMembers = new Set();
      allProjects.forEach(p => p.members.forEach(m => uniqueMembers.add(m.user?._id?.toString())));
      const totalMembers = uniqueMembers.size;

      const projectIds = allProjects.map(p => p._id);

      const totalTasks = await Task.countDocuments({ project: { $in: projectIds } });
      const completedTasks = await Task.countDocuments({ project: { $in: projectIds }, status: 'done' });
      const overdueTasks = await Task.countDocuments({ project: { $in: projectIds }, status: { $ne: 'done' }, dueDate: { $lt: new Date() } });

      const tasksByStatus = {
        todo: await Task.countDocuments({ project: { $in: projectIds }, status: 'todo' }),
        in_progress: await Task.countDocuments({ project: { $in: projectIds }, status: 'in_progress' }),
        review: await Task.countDocuments({ project: { $in: projectIds }, status: 'review' }),
        done: completedTasks
      };

      const tasksByPriority = {
        low: await Task.countDocuments({ project: { $in: projectIds }, priority: 'low' }),
        medium: await Task.countDocuments({ project: { $in: projectIds }, priority: 'medium' }),
        high: await Task.countDocuments({ project: { $in: projectIds }, priority: 'high' })
      };

      const recentTasks = await Task.find({ project: { $in: projectIds } })
        .populate('project', 'name')
        .populate('createdBy', 'fullName email')
        .sort({ createdAt: -1 })
        .limit(10);
      
      const recentActivity = recentTasks.map(task => ({
        _id: task._id,
        user: task.createdBy,
        action: 'created task',
        target: task.title,
        createdAt: task.createdAt
      }));

      const overdueTasksList = await Task.find({ project: { $in: projectIds }, status: { $ne: 'done' }, dueDate: { $lt: new Date() } })
        .populate('project', 'name')
        .populate('assignedTo', 'fullName email')
        .sort({ dueDate: 1 });

      const projectsProgress = await Promise.all(allProjects.map(async (project) => {
        const pTasksTotal = await Task.countDocuments({ project: project._id });
        const pTasksCompleted = await Task.countDocuments({ project: project._id, status: 'done' });
        return {
          ...project,
          totalTasks: pTasksTotal,
          tasksCompleted: pTasksCompleted
        };
      }));

      // Calculate team overview
      const userQuery = { role: { $ne: 'admin' } };
      if (req.user.teamCode) {
        userQuery.teamCode = req.user.teamCode;
      }
      const allUsers = await require('../models/User').find(userQuery).select('fullName email profileImage').lean();
      const teamOverview = await Promise.all(allUsers.map(async (u) => {
        const uTasks = await Task.countDocuments({ assignedTo: u._id });
        const uCompleted = await Task.countDocuments({ assignedTo: u._id, status: 'done' });
        const uInProgress = await Task.countDocuments({ assignedTo: u._id, status: 'in_progress' });
        return {
          ...u,
          totalTasks: uTasks,
          completedTasks: uCompleted,
          inProgressTasks: uInProgress
        };
      }));

      return res.json({
        totalProjects,
        totalMembers,
        totalTasks,
        completedTasks,
        overdueTasks,
        tasksByStatus,
        tasksByPriority,
        recentActivity,
        overdueTasksList,
        projectsProgress,
        teamOverview
      });
    } else {
      // Member specific response
      const myTaskQuery = { assignedTo: req.user.id };
      
      const myTotalTasks = await Task.countDocuments(myTaskQuery);
      const myCompletedTasks = await Task.countDocuments({ ...myTaskQuery, status: 'done' });
      const myInProgressTasks = await Task.countDocuments({ ...myTaskQuery, status: 'in_progress' });
      const myOverdueTasks = await Task.countDocuments({ ...myTaskQuery, status: { $ne: 'done' }, dueDate: { $lt: new Date() } });

      const myTasksByStatus = {
        todo: await Task.countDocuments({ ...myTaskQuery, status: 'todo' }),
        in_progress: myInProgressTasks,
        review: await Task.countDocuments({ ...myTaskQuery, status: 'review' }),
        done: myCompletedTasks
      };

      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

      const myUpcomingTasks = await Task.find({ 
        ...myTaskQuery, 
        status: { $ne: 'done' },
        dueDate: { $gte: new Date(), $lte: sevenDaysFromNow }
      })
      .populate('project', 'name')
      .sort({ dueDate: 1 });

      const userProjects = await Project.find({ 'members.user': req.user.id }).lean();
      
      const myProjects = await Promise.all(userProjects.map(async (project) => {
        const pTasksTotal = await Task.countDocuments({ project: project._id, assignedTo: req.user.id });
        const pTasksCompleted = await Task.countDocuments({ project: project._id, assignedTo: req.user.id, status: 'done' });
        return {
          ...project,
          myTasksTotal: pTasksTotal,
          myTasksCompleted: pTasksCompleted
        };
      }));

      return res.json({
        myTotalTasks,
        myCompletedTasks,
        myInProgressTasks,
        myOverdueTasks,
        myTasksByStatus,
        myUpcomingTasks,
        myProjects
      });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
