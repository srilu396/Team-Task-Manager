import React from 'react';
import KanbanColumn from './KanbanColumn';

const KanbanBoard = ({ tasks, onTaskClick, onAddTask }) => {
  const columns = [
    { id: 'todo', title: 'TODO' },
    { id: 'in_progress', title: 'IN PROGRESS' },
    { id: 'review', title: 'REVIEW' },
    { id: 'done', title: 'DONE' }
  ];

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 h-[calc(100vh-220px)]">
      {columns.map(col => (
        <KanbanColumn
          key={col.id}
          title={col.title}
          status={col.id}
          tasks={tasks.filter(t => t.status === col.id)}
          onTaskClick={onTaskClick}
          onAddTask={onAddTask}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;
