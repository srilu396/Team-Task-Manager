import React, { useState, useEffect, useContext } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import taskService from '../../services/task.service';
import { AuthContext } from '../../context/AuthContext';
import { ToastContext } from '../../context/ToastContext';

const TaskModal = ({ isOpen, onClose, task, project, onTaskUpdated, isNew = false, initialStatus = 'todo' }) => {
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: initialStatus,
    priority: 'medium',
    dueDate: '',
    assignedTo: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (task && !isNew) {
        setFormData({
          title: task.title || '',
          description: task.description || '',
          status: task.status || 'todo',
          priority: task.priority || 'medium',
          dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
          assignedTo: task.assignedTo?._id || ''
        });
        fetchComments();
      } else {
        setFormData({
          title: '',
          description: '',
          status: initialStatus,
          priority: 'medium',
          dueDate: '',
          assignedTo: ''
        });
        setComments([]);
      }
    }
  }, [isOpen, task, isNew, initialStatus]);

  const fetchComments = async () => {
    if (!task?._id) return;
    try {
      const data = await taskService.getTaskById(task._id);
      setComments(data.comments || []);
    } catch (error) {
      console.error('Failed to fetch comments', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isNew) {
        await taskService.createTask({ ...formData, project: project._id });
        showToast('Task created successfully', 'success');
      } else {
        await taskService.updateTask(task._id, formData);
        showToast('Task updated successfully', 'success');
      }
      onTaskUpdated();
      onClose();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to save task', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !task) return;
    
    try {
      const addedComment = await taskService.addComment(task._id, newComment);
      setComments([...comments, addedComment]);
      setNewComment('');
      onTaskUpdated(); // Update comment count in parent
    } catch (error) {
      showToast('Failed to add comment', 'error');
    }
  };

  const canEdit = user?.role === 'admin' || isNew || task?.assignedTo?._id === user?.id || task?.createdBy?._id === user?.id;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isNew ? 'Create New Task' : 'Task Details'}
      maxWidth="max-w-2xl"
    >
      <div className="flex flex-col md:flex-row gap-6 max-h-[70vh] overflow-y-auto pr-2">
        {/* Left column: Form */}
        <div className="flex-1 space-y-4">
          <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={!canEdit}
            />
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={!canEdit}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                  disabled={!canEdit}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Assignee</label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                  disabled={!canEdit}
                >
                  <option value="">Unassigned</option>
                  {project?.members?.map(m => (
                    <option key={m.user._id} value={m.user._id}>{m.user.fullName}</option>
                  ))}
                </select>
              </div>
              
              <Input
                label="Due Date"
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                disabled={!canEdit}
              />
            </div>
          </form>
        </div>
        
        {/* Right column: Comments (only if not new) */}
        {!isNew && (
          <div className="w-full md:w-1/3 flex flex-col border-l pl-4 border-gray-200">
            <h4 className="font-medium text-gray-900 mb-4">Comments</h4>
            
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {comments.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No comments yet.</p>
              ) : (
                comments.map(comment => (
                  <div key={comment._id} className="bg-gray-50 p-3 rounded-lg text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar name={comment.user.fullName} size="sm" />
                      <span className="font-medium text-gray-900">{comment.user.fullName}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-2">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
            
            <form onSubmit={handleAddComment} className="mt-auto flex flex-col gap-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                rows="2"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <Button type="submit" variant="secondary" className="self-end py-1 px-3 text-sm" disabled={!newComment.trim()}>
                Post
              </Button>
            </form>
          </div>
        )}
      </div>
      
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
        <Button variant="secondary" onClick={onClose} type="button">
          Cancel
        </Button>
        <Button type="submit" form="task-form" disabled={loading}>
          {loading ? 'Saving...' : 'Save Task'}
        </Button>
      </div>
    </Modal>
  );
};

export default TaskModal;
