import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { LogOut, Plus, CheckCircle2, Clock, AlertCircle, TrendingUp, Calendar, Filter, Loader2, Edit2, X, Save, Bot, Sparkles } from 'lucide-react';
import { taskService } from '../../services/tasks';
import { authService } from '../../services/auth';

const DashboardPage = () => {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', priority: 'medium', dueDate: '', description: '' });
  const [filter, setFilter] = useState('all');
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', priority: '', dueDate: '', description: '' });

  useEffect(() => {
    setMounted(true);
    const id = authService.getUserId();
    if (!id) {
      router.push('/auth/login');
      return;
    }
    setUserId(id);
    loadTasks(id);
  }, [router]);

  const loadTasks = async (id) => {
    try {
      setLoading(true);
      const fetchedTasks = await taskService.getTasks(id);
      setTasks(fetchedTasks);
      setError(null);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (newTask.title.trim()) {
      try {
        const taskData = {
          title: newTask.title,
          description: newTask.description || '',
          completed: false,
          priority: newTask.priority,
          due_date: newTask.dueDate ? new Date(newTask.dueDate).toISOString() : null
        };
        await taskService.createTask(userId, taskData);
        await loadTasks(userId);
        setNewTask({ title: '', priority: 'medium', dueDate: '', description: '' });
      } catch (err) {
        console.error('Failed to create task:', err);
        setError('Failed to create task');
      }
    }
  };

  const handleStatusChange = async (taskId, completed) => {
    try {
      // Toggle the completed status
      await taskService.updateTask(userId, taskId, { completed: !completed });
      await loadTasks(userId);
    } catch (err) {
      console.error('Failed to update task:', err);
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(userId, taskId);
      await loadTasks(userId);
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError('Failed to delete task');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task.id);
    // Format the date for the input field (YYYY-MM-DD)
    let formattedDate = '';
    if (task.due_date) {
      const date = new Date(task.due_date);
      formattedDate = date.toISOString().split('T')[0];
    }
    setEditForm({
      title: task.title,
      priority: task.priority || 'medium',
      dueDate: formattedDate,
      description: task.description || ''
    });
  };

  const handleSaveEdit = async (taskId) => {
    try {
      const updateData = {
        title: editForm.title,
        priority: editForm.priority,
        description: editForm.description,
        due_date: editForm.dueDate ? new Date(editForm.dueDate).toISOString() : null
      };
      await taskService.updateTask(userId, taskId, updateData);
      await loadTasks(userId);
      setEditingTask(null);
      setEditForm({ title: '', priority: '', dueDate: '', description: '' });
    } catch (err) {
      console.error('Failed to update task:', err);
      setError('Failed to update task');
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditForm({ title: '', priority: '', dueDate: '', description: '' });
  };

  const handleLogout = () => {
    authService.signout();
    router.push('/auth/login');
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    inProgress: 0, // Backend doesn't have in-progress status
    pending: tasks.filter(t => !t.completed).length
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  if (!userId || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl top-1/2 -right-48 animate-pulse delay-700"></div>
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl bottom-0 left-1/3 animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 backdrop-blur-sm bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">TaskFlow</h1>
                <p className="text-sm text-gray-400">Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/ai-assistant')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30"
              >
                <Bot className="w-4 h-4" />
                <span className="hidden sm:inline">AI Assistant</span>
                <Sparkles className="w-3 h-3 text-yellow-400" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/30"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 ${mounted ? 'animate-slide-up' : 'opacity-0'}`}>
          {[
            { label: 'Total Tasks', value: stats.total, icon: <TrendingUp className="w-5 h-5" />, color: 'from-blue-500 to-cyan-500' },
            { label: 'Completed', value: stats.completed, icon: <CheckCircle2 className="w-5 h-5" />, color: 'from-green-500 to-emerald-500' },
            { label: 'In Progress', value: stats.inProgress, icon: <Clock className="w-5 h-5" />, color: 'from-blue-500 to-indigo-500' },
            { label: 'Pending', value: stats.pending, icon: <AlertCircle className="w-5 h-5" />, color: 'from-yellow-500 to-orange-500' },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-4 md:p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs md:text-sm">{stat.label}</span>
                <div className={`p-2 bg-gradient-to-br ${stat.color} rounded-lg shadow-lg`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task List */}
          <div className={`lg:col-span-2 space-y-4 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <h2 className="text-2xl font-bold">Your Tasks</h2>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 w-full sm:w-auto overflow-x-auto">
                  {['all', 'pending', 'completed'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                        filter === f ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-4">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            <div className="space-y-3">
              {filteredTasks.length === 0 ? (
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-12 border border-white/10 text-center animate-fade-in">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No tasks found</p>
                  <p className="text-sm text-gray-500 mt-2">Create a new task to get started</p>
                </div>
              ) : (
                filteredTasks.map((task, index) => (
                  <div
                    key={task.id}
                    className="group bg-white/5 backdrop-blur-lg rounded-xl p-5 border border-white/10 hover:border-blue-500/30 transition-all duration-300 hover:scale-102 hover:shadow-xl hover:shadow-blue-500/10 animate-slide-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {editingTask === task.id ? (
                      // Edit Mode
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                          placeholder="Task title"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <select
                            value={editForm.priority}
                            onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-sm"
                          >
                            <option value="low" className="bg-slate-800">Low</option>
                            <option value="medium" className="bg-slate-800">Medium</option>
                            <option value="high" className="bg-slate-800">High</option>
                          </select>
                          <input
                            type="date"
                            value={editForm.dueDate}
                            onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-sm"
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={handleCancelEdit}
                            className="flex items-center gap-1 px-3 py-1.5 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 rounded-lg transition-all duration-300 text-sm"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(task.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg transition-all duration-300 text-sm hover:shadow-lg hover:shadow-green-500/30"
                          >
                            <Save className="w-4 h-4" />
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => handleStatusChange(task.id, task.completed)}
                          className={`mt-1 w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all duration-300 ${
                            task.completed
                              ? 'bg-green-500 border-green-500 shadow-lg shadow-green-500/50'
                              : 'border-gray-500 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-400/30'
                          }`}
                        >
                          {task.completed && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold mb-2 break-words ${task.completed ? 'line-through text-gray-500' : ''}`}>
                            {task.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                            <span className={`px-2 py-1 rounded-md border ${getStatusColor(task.completed ? 'completed' : 'pending')}`}>
                              {task.completed ? 'Completed' : 'Pending'}
                            </span>
                            <span className={`flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
                              <AlertCircle className="w-3 h-3" />
                              {task.priority}
                            </span>
                            {task.due_date && (
                              <span className="flex items-center gap-1 text-gray-400">
                                <Calendar className="w-3 h-3" />
                                {new Date(task.due_date).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={() => handleEditTask(task)}
                            className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-all duration-300 text-xs sm:text-sm flex-shrink-0 hover:shadow-lg hover:shadow-blue-500/30 flex items-center gap-1"
                          >
                            <Edit2 className="w-3 h-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg transition-all duration-300 text-xs sm:text-sm flex-shrink-0 hover:shadow-lg hover:shadow-red-500/30"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Task Form */}
          <div className={`${mounted ? 'animate-slide-right' : 'opacity-0'}`}>
            {/* AI Assistant Card */}
            <div
              onClick={() => router.push('/ai-assistant')}
              className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30 mb-6 cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/50">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    AI Assistant
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                  </h3>
                  <p className="text-sm text-gray-400">Powered by Gemini AI</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 mb-3">
                Manage your tasks using natural language. Just tell the AI what you need!
              </p>
              <div className="flex items-center gap-2 text-purple-400 text-sm font-medium">
                <span>Try it now</span>
                <span className="animate-pulse">→</span>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 sticky top-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50">
                  <Plus className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Create Task</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Task Title</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-500"
                    placeholder="Enter task title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="low" className="bg-slate-800">Low Priority</option>
                    <option value="medium" className="bg-slate-800">Medium Priority</option>
                    <option value="high" className="bg-slate-800">High Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <button
                  onClick={handleCreateTask}
                  disabled={!newTask.title.trim()}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Plus className="w-5 h-5" />
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out backwards;
        }
        .animate-slide-right {
          animation: slide-right 0.6s ease-out backwards;
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .delay-700 {
          animation-delay: 700ms;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;