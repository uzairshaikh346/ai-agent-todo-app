import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Bot,
  Send,
  Sparkles,
  ListTodo,
  CheckCircle2,
  Trash2,
  Edit3,
  ArrowLeft,
  Loader2,
  MessageSquare,
  Zap,
  Brain,
  Clock
} from 'lucide-react';
import { authService } from '../../services/auth';

const AIAssistantPage = () => {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const id = authService.getUserId();
    if (!id) {
      router.push('/auth/login');
      return;
    }
    setUserId(id);

    // Add welcome message
    setMessages([{
      id: 1,
      role: 'assistant',
      content: "Hello! I'm your AI-powered Todo Assistant. I can help you manage your tasks using natural language. Try saying things like:\n\n• \"Add a task to buy groceries\"\n• \"Show me all my tasks\"\n• \"Mark task 1 as complete\"\n• \"Delete task 2\"\n\nHow can I help you today?",
      timestamp: new Date().toISOString()
    }]);
  }, [router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !userId) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_URL}api/${userId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          message: userMessage.content
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.response,
        tool_calls: data.tool_calls || [],
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        isError: true,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const getToolIcon = (toolName) => {
    switch (toolName) {
      case 'add_task': return <ListTodo className="w-3 h-3" />;
      case 'list_tasks': return <ListTodo className="w-3 h-3" />;
      case 'complete_task': return <CheckCircle2 className="w-3 h-3" />;
      case 'delete_task': return <Trash2 className="w-3 h-3" />;
      case 'update_task': return <Edit3 className="w-3 h-3" />;
      default: return <Zap className="w-3 h-3" />;
    }
  };

  const quickActions = [
    { label: 'Show my tasks', action: 'Show me all my tasks' },
    { label: 'Add a task', action: 'Add a new task called ' },
    { label: 'Completed tasks', action: 'Show my completed tasks' },
    { label: 'Pending tasks', action: 'Show my pending tasks' },
  ];

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading AI Assistant...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl top-1/2 -right-48 animate-pulse delay-700"></div>
        <div className="absolute w-96 h-96 bg-pink-500/10 rounded-full blur-3xl bottom-0 left-1/3 animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-sm bg-white/5 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/50">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold flex items-center gap-2">
                    AI Assistant
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                  </h1>
                  <p className="text-sm text-gray-400">Powered by Gemini AI</p>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
              <Brain className="w-4 h-4" />
              <span>Natural Language Task Management</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="relative z-10 flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-6">
        {/* Feature Cards - Show only when few messages */}
        {messages.length <= 1 && (
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
            {[
              { icon: <ListTodo className="w-5 h-5" />, label: 'Add Tasks', desc: 'Create new todos' },
              { icon: <CheckCircle2 className="w-5 h-5" />, label: 'Complete', desc: 'Mark as done' },
              { icon: <Edit3 className="w-5 h-5" />, label: 'Update', desc: 'Edit task details' },
              { icon: <Trash2 className="w-5 h-5" />, label: 'Delete', desc: 'Remove tasks' },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center mb-2 text-purple-400">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-sm">{feature.label}</h3>
                <p className="text-xs text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Messages Container */}
        <div className="flex-1 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 flex flex-col overflow-hidden shadow-2xl">
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} ${mounted ? 'animate-slide-up' : ''}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                      : 'bg-gradient-to-br from-purple-500 to-pink-500'
                  }`}>
                    {message.role === 'user' ? (
                      <MessageSquare className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white'
                      : message.isError
                      ? 'bg-red-500/20 text-red-200 border border-red-500/30'
                      : 'bg-white/10 text-gray-100'
                  }`}>
                    <div className="whitespace-pre-wrap break-words text-sm md:text-base">
                      {message.content}
                    </div>

                    {/* Tool Calls Display */}
                    {message.tool_calls && message.tool_calls.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/20">
                        <div className="flex flex-wrap gap-2">
                          {message.tool_calls.map((tc, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-white/10 rounded-full text-xs"
                            >
                              {getToolIcon(tc.name)}
                              {tc.name.replace('_', ' ')}
                              {tc.result?.success && <CheckCircle2 className="w-3 h-3 text-green-400" />}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Timestamp */}
                    <div className={`text-xs mt-2 flex items-center gap-1 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                    }`}>
                      <Clock className="w-3 h-3" />
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white/10 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-400">Processing your request...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 pb-2">
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => setInputValue(action.action)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 rounded-full text-xs text-gray-300 hover:text-white transition-all duration-300"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-white/10 p-4 bg-white/5">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
                placeholder="Type your message... (e.g., 'Add a task to call mom')"
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out backwards;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .delay-700 {
          animation-delay: 700ms;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
};

export default AIAssistantPage;
