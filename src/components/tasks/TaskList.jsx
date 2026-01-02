// frontend/src/components/tasks/TaskList.jsx
import React, { useState, useEffect } from 'react';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import { taskService } from '../../services/tasks';

const TaskList = ({ userId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [userId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const tasksData = await taskService.getTasks(userId);
      setTasks(tasksData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskToggle = async (taskId) => {
    try {
      const updatedTask = await taskService.toggleTaskCompletion(userId, taskId);
      setTasks(tasks.map(task =>
        task.id === taskId ? updatedTask : task
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await taskService.deleteTask(userId, taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTaskEdit = (task) => {
    setEditingTask(task);
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const updatedTask = await taskService.updateTask(userId, editingTask.id, taskData);
      setTasks(tasks.map(task =>
        task.id === editingTask.id ? updatedTask : task
      ));
      setEditingTask(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  if (loading) return <div className="text-center py-4">Loading tasks...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      {editingTask && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <TaskForm
            userId={userId}
            initialData={editingTask}
            onSubmit={handleUpdateTask}
            onCancel={handleCancelEdit}
          />
        </div>
      )}
      <ul className="divide-y divide-gray-200">
        {tasks.length === 0 ? (
          <li className="px-4 py-4 sm:px-6">
            <p className="text-gray-500">No tasks yet. Create your first task!</p>
          </li>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleTaskToggle}
              onDelete={handleTaskDelete}
              onEdit={handleTaskEdit}
            />
          ))
        )}
      </ul>
    </div>
  );
};

export default TaskList;