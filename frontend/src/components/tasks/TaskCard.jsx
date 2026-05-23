import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import { MessageSquare, Calendar } from 'lucide-react';

const TaskCard = ({ task, onClick }) => {
  const priorityColors = {
    low: 'gray',
    medium: 'blue',
    high: 'red'
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <Card 
      onClick={onClick}
      className={`mb-3 last:mb-0 hover:border-primary/50 transition-colors ${isOverdue ? 'border-l-4 border-l-red-500' : ''}`}
    >
      <div className="flex justify-between items-start mb-2">
        <Badge color={priorityColors[task.priority]}>{task.priority}</Badge>
        {task.dueDate && (
          <div className={`flex items-center text-xs ${isOverdue ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
            <Calendar size={12} className="mr-1" />
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}
      </div>
      
      <h4 className="font-medium text-gray-900 mb-3 line-clamp-2">{task.title}</h4>
      
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center text-gray-500 text-sm">
          <MessageSquare size={14} className="mr-1" />
          <span>{task.commentsCount || 0}</span>
        </div>
        <Avatar name={task.assignedTo?.fullName} size="sm" />
      </div>
    </Card>
  );
};

export default TaskCard;
