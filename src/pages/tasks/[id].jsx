// frontend/src/pages/tasks/[id].jsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { taskService } from '../../services/tasks';

const TaskDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const userId = '12345678-1234-1234-1234-123456789012'; // This would come from auth context in real app
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchTask();
    }
  }, [id]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      // In a real app, we would fetch the specific task by ID
      // For now, we'll simulate by getting all tasks and finding the one with the matching ID
      const tasks = await taskService.getTasks(userId);
      const foundTask = tasks.find(t => t.id === parseInt(id));
      if (foundTask) {
        setTask(foundTask);
      } else {
        setError('Task not found');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCompletion = async () => {
    try {
      const updatedTask = await taskService.toggleTaskCompletion(userId, parseInt(id));
      setTask(updatedTask);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center py-4">Loading task...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  if (!task) return <div className="text-center py-4">Task not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Task Details
                </h3>
                <button
                  onClick={handleToggleCompletion}
                  className={`inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md ${
                    task.completed 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                </button>
              </div>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Title</h4>
                <p className={`text-xl ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {task.title}
                </p>
              </div>
              
              {task.description && (
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Description</h4>
                  <p className={`text-gray-700 ${task.completed ? 'line-through' : ''}`}>
                    {task.description}
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <p className={`mt-1 text-sm ${task.completed ? 'text-green-600' : 'text-yellow-600'}`}>
                    {task.completed ? 'Completed' : 'Pending'}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Created</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(task.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;