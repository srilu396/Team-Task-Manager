import React from 'react';
import TaskCard from './TaskCard';
import Button from '../ui/Button';
import { Plus } from 'lucide-react';

const KanbanColumn = ({ title, status, tasks, onTaskClick, onAddTask }) => {
  const statusColors = {
    todo: 'bg-gray-100 text-gray-700',
    in_progress: 'bg-blue-100 text-blue-700',
    review: 'bg-yellow-100 text-yellow-700',
    done: 'bg-green-100 text-green-700'
  };

  return (
    <div className="flex flex-col bg-gray-50 rounded-xl w-80 shrink-0 max-h-full">
      <div className="p-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-700">{title}</h3>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[status]}`}>
            {tasks.length}
          </span>
        </div>
        <button 
          onClick={() => onAddTask(status)}
          className="text-gray-400 hover:text-gray-700 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>
      
      <div className="p-3 overflow-y-auto flex-1 space-y-3 custom-scrollbar">
        {tasks.map(task => (
          <TaskCard 
            key={task._id} 
            task={task} 
            onClick={() => onTaskClick(task)} 
          />
        ))}
        {tasks.length === 0 && (
          <div className="text-center p-4 text-sm text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
