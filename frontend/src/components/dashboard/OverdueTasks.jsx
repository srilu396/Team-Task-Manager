import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const OverdueTasks = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return null;
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="text-red-500" size={20} />
        <h3 className="text-lg font-semibold text-gray-800">Overdue Tasks</h3>
      </div>
      
      <div className="space-y-3">
        {tasks.map(task => (
          <Link to={`/projects/${task.project._id}?task=${task._id}`} key={task._id} className="block">
            <div className="p-3 bg-red-50 border border-red-100 border-l-4 border-l-red-500 rounded-r-md hover:bg-red-100 transition-colors">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-medium text-gray-900 truncate">{task.title}</h4>
                <Badge color="red">{new Date(task.dueDate).toLocaleDateString()}</Badge>
              </div>
              <p className="text-sm text-gray-600 truncate">{task.project.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
};

export default OverdueTasks;
