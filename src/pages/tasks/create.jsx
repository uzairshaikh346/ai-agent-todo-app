// frontend/src/pages/tasks/create.jsx
import React from 'react';
import TaskForm from '../../components/tasks/TaskForm';
import { taskService } from '../../services/tasks';
import { useRouter } from 'next/router';

const CreateTaskPage = () => {
  const router = useRouter();
  const userId = '12345678-1234-1234-1234-123456789012'; // This would come from auth context in real app

  const handleCreateTask = async (taskData) => {
    try {
      await taskService.createTask(userId, taskData);
      // Redirect back to dashboard after creating task
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error; // Let the component handle the error
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Create New Task
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <TaskForm 
                userId={userId} 
                onSubmit={handleCreateTask} 
                onCancel={handleCancel} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskPage;