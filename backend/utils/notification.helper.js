const Notification = require('../models/Notification');

exports.sendNotification = async (app, recipientId, message, taskId) => {
  try {
    const notification = new Notification({
      recipient: recipientId,
      message,
      task: taskId
    });
    await notification.save();
    
    const populated = await Notification.findById(notification._id).populate('task', 'title');

    const io = app.get('io');
    const userSockets = app.get('userSockets');
    
    if (io && userSockets) {
      const targetSocket = userSockets.get(recipientId.toString());
      if (targetSocket) {
        io.to(targetSocket).emit('notification', populated);
      }
    }
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
};
