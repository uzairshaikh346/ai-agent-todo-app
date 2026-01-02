// frontend/src/pages/tasks/edit/[id].jsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import TaskForm from '../../../components/tasks/TaskForm';
import { taskService } from '../../../services/tasks';

const EditTaskPage = () => {
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

  const handleUpdateTask = async (taskData) => {
    try {
      await taskService.updateTask(userId, parseInt(id), taskData);
      // Redirect back to task list after updating
      router.push('/tasks');
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error; // Let the component handle the error
    }
  };

  const handleCancel = () => {
    router.back();
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
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Edit Task
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <TaskForm 
                userId={userId} 
                initialData={task} 
                onSubmit={handleUpdateTask} 
                onCancel={handleCancel} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTaskPage;