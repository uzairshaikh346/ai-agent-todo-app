// frontend/src/pages/tasks/index.jsx
import React from 'react';
import TaskList from '../../components/tasks/TaskList';

const TaskListPage = () => {
  const userId = '12345678-1234-1234-1234-123456789012'; // This would come from auth context in real app

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                My Tasks
              </h2>
            </div>
          </div>

          <div className="mt-8">
            <TaskList userId={userId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskListPage;