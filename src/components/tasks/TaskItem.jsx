// frontend/src/components/tasks/TaskItem.jsx
import React from 'react';

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
};

const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

const getPriority = (priority) => (priority || 'medium').toLowerCase();

const formatDueDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  const formatted = date.toLocaleDateString('en-US', options);

  if (diffDays < 0) return { text: formatted, label: 'Overdue' };
  if (diffDays === 0) return { text: formatted, label: 'Due today' };
  if (diffDays === 1) return { text: formatted, label: 'Due tomorrow' };
  return { text: formatted, label: null };
};

const TaskItem = ({ task, onToggle, onDelete, onEdit }) => {
  const handleToggle = () => {
    onToggle(task.id);
  };

  const handleDelete = () => {
    onDelete(task.id);
  };

  const handleEdit = () => {
    onEdit(task);
  };

  const dueInfo = formatDueDate(task.due_date);
  const isOverdue = task.is_overdue;

  return (
    <li className={`px-4 py-4 sm:px-6 ${isOverdue ? 'bg-red-50 border-l-4 border-red-500' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggle}
            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <div className="ml-3 flex-1">
            <div className="flex items-center gap-2">
              <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : isOverdue ? 'text-red-900' : 'text-gray-900'}`}>
                {task.title}
              </p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${priorityColors[getPriority(task.priority)]}`}>
                {priorityLabels[getPriority(task.priority)]}
              </span>
            </div>
            {task.description && (
              <p className={`text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-500'}`}>
                {task.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={handleEdit}
            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-900 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
        {dueInfo && (
          <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{dueInfo.text}</span>
            {dueInfo.label && (
              <span className={`ml-1 px-1.5 py-0.5 rounded text-xs ${isOverdue ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {dueInfo.label}
              </span>
            )}
          </div>
        )}
        <div className="flex items-center gap-2">
          {task.completed ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Completed
            </span>
          ) : isOverdue ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Overdue
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Pending
            </span>
          )}
        </div>
      </div>
    </li>
  );
};

export default TaskItem;