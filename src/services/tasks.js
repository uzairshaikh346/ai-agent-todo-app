// frontend/src/services/tasks.js
import api from './api';

export const taskService = {
  async getTasks(userId) {
    try {
      const response = await api.get(`/api/${userId}/tasks`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch tasks');
    }
  },

  async createTask(userId, taskData) {
    try {
      const response = await api.post(`/api/${userId}/tasks`, taskData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to create task');
    }
  },

  async updateTask(userId, taskId, taskData) {
    try {
      const response = await api.put(`/api/${userId}/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to update task');
    }
  },

  async deleteTask(userId, taskId) {
    try {
      const response = await api.delete(`/api/${userId}/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to delete task');
    }
  },

  async toggleTaskCompletion(userId, taskId) {
    try {
      const response = await api.patch(`/api/${userId}/tasks/${taskId}/complete`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to toggle task completion');
    }
  },
};