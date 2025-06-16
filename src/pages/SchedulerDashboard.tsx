import React, { useState } from 'react';
import { Calendar, Clock, Plus, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, parseISO, addMonths, subMonths, addWeeks, subWeeks, isBefore, isEqual } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useStats } from '../contexts/StatsContext';
import Navbar from '../components/Navbar';

interface Task {
  id: string;
  title: string;
  description: string;
  dateTime: Date;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  type: 'task' | 'reminder' | 'meeting';
  reminderType?: 'dinner' | 'meeting' | 'flight' | 'other';
  customReminderText?: string;
}

const SchedulerDashboard: React.FC = () => {
  const { incrementTasksCompleted, logActivity } = useStats();
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Task | null>(null);
  const [showTaskActions, setShowTaskActions] = useState<string | null>(null);
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
    priority: 'medium' as 'low' | 'medium' | 'high',
    type: 'task' as 'task' | 'reminder' | 'meeting',
    reminderType: 'dinner' as 'dinner' | 'meeting' | 'flight' | 'other',
    customReminderText: ''
  });

  // Start with empty tasks array - no pre-existing schedules
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dateTime = new Date(`${newTask.date}T${newTask.time}`);
    
    const task: Task = {
      id: selectedEvent?.id || Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      dateTime,
      priority: newTask.priority,
      completed: false,
      type: newTask.type,
      reminderType: newTask.type === 'reminder' ? newTask.reminderType : undefined,
      customReminderText: newTask.type === 'reminder' && newTask.reminderType === 'other' ? newTask.customReminderText : undefined
    };

    if (selectedEvent) {
      setTasks(tasks.map(t => t.id === selectedEvent.id ? task : t));
      logActivity('Event updated', newTask.title);
    } else {
      setTasks([...tasks, task]);
      logActivity('Event created', newTask.title);
    }

    // Set reminder alarm if it's a reminder and in the future
    if (task.type === 'reminder' && task.dateTime > new Date()) {
      const timeUntilReminder = task.dateTime.getTime() - new Date().getTime();
      setTimeout(() => {
        alert(`Reminder: ${task.title}`);
      }, timeUntilReminder);
    }

    resetForm();
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  const resetForm = () => {
    setNewTask({
      title: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '09:00',
      priority: 'medium',
      type: 'task',
      reminderType: 'dinner',
      customReminderText: ''
    });
  };

  const handleTaskAction = (taskId: string, action: 'complete' | 'cancel') => {
    if (action === 'complete') {
      setTasks(tasks.map(task => {
        if (task.id === taskId) {
          const updatedTask = { ...task, completed: true };
          incrementTasksCompleted();
          logActivity('Task completed', task.title);
          return updatedTask;
        }
        return task;
      }));
    } else if (action === 'cancel') {
      const task = tasks.find(t => t.id === taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
      if (task) {
        logActivity('Task cancelled', task.title);
      }
    }
    setShowTaskActions(null);
  };

  const handleDateClick = (date: Date) => {
    setCurrentDate(date);
    setNewTask(prev => ({
      ...prev,
      date: format(date, 'yyyy-MM-dd')
    }));
    setShowEventModal(true);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    if (viewMode === 'month') {
      setCurrentDate(direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1));
    } else {
      setCurrentDate(direction === 'next' ? addDays(currentDate, 1) : addDays(currentDate, -1));
    }
  };

  const getCalendarDays = () => {
    if (viewMode === 'month') {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      const startWeek = startOfWeek(start);
      const endWeek = addDays(end, 6 - end.getDay());
      return eachDayOfInterval({ start: startWeek, end: endWeek });
    } else if (viewMode === 'week') {
      const start = startOfWeek(currentDate);
      return eachDayOfInterval({ start, end: addDays(start, 6) });
    } else {
      return [currentDate];
    }
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => isSameDay(task.dateTime, date) && !task.completed);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Calendar className="h-4 w-4" />;
      case 'reminder': return <AlertCircle className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const upcomingTasks = tasks.filter(task => !task.completed).sort((a, b) => 
    a.dateTime.getTime() - b.dateTime.getTime()
  );

  const calendarDays = getCalendarDays();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Smart Scheduler
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your tasks, reminders, and appointments
            </p>
          </div>

          {/* View Toggle */}
          <div className="mt-4 md:mt-0 flex space-x-2">
            {['day', 'week', 'month'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as 'day' | 'week' | 'month')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === mode
                    ? 'bg-primary-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => setShowEventModal(true)}
            className="flex items-center justify-center space-x-2 p-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Task</span>
          </button>
          
          <button 
            onClick={() => {
              setNewTask(prev => ({ ...prev, type: 'reminder' }));
              setShowEventModal(true);
              logActivity('Reminder creation started', 'Quick reminder');
            }}
            className="flex items-center justify-center space-x-2 p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <AlertCircle className="h-5 w-5" />
            <span>Set Reminder</span>
          </button>
          
          <button 
            onClick={() => {
              setNewTask(prev => ({ ...prev, type: 'meeting' }));
              setShowEventModal(true);
              logActivity('Meeting creation started', 'Quick meeting');
            }}
            className="flex items-center justify-center space-x-2 p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Calendar className="h-5 w-5" />
            <span>Schedule Meeting</span>
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  {format(currentDate, 'MMMM yyyy', { locale: enUS })}
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigateDate('prev')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => navigateDate('next')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {calendarDays.map((day, index) => {
                  const dayTasks = getTasksForDate(day);
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                  
                  return (
                    <div
                      key={index}
                      onClick={() => handleDateClick(day)}
                      className={`min-h-[80px] p-2 border border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        isToday(day) ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                      } ${!isCurrentMonth ? 'opacity-50' : ''}`}
                    >
                      <div className={`text-sm font-medium mb-1 ${
                        isToday(day) ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'
                      }`}>
                        {format(day, 'd')}
                      </div>
                      <div className="space-y-1">
                        {dayTasks.slice(0, 2).map(task => (
                          <div
                            key={task.id}
                            className={`text-xs p-1 rounded truncate ${
                              task.priority === 'high' ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' :
                              task.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' :
                              'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                            }`}
                          >
                            {task.title}
                          </div>
                        ))}
                        {dayTasks.length > 2 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            +{dayTasks.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-6">
            {/* Upcoming Tasks */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Upcoming ({upcomingTasks.length})
              </h3>
              
              <div className="space-y-3">
                {upcomingTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No upcoming tasks. Click "Add New Task" to get started!
                    </p>
                  </div>
                ) : (
                  upcomingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="relative flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <button
                        onClick={() => setShowTaskActions(showTaskActions === task.id ? null : task.id)}
                        className="mt-1 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                      >
                        <CheckCircle className="h-4 w-4 text-gray-400" />
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          {getTypeIcon(task.type)}
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {task.title}
                          </h4>
                          <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          {task.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {format(task.dateTime, 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>

                      {/* Task Actions Popup */}
                      {showTaskActions === task.id && (
                        <div className="absolute top-0 right-0 mt-2 mr-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                          <button
                            onClick={() => handleTaskAction(task.id, 'complete')}
                            className="block w-full px-4 py-2 text-left text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-t-lg"
                          >
                            Mark as Done
                          </button>
                          <button
                            onClick={() => handleTaskAction(task.id, 'cancel')}
                            className="block w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-lg"
                          >
                            Cancel Task
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Event Modal */}
        {showEventModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedEvent ? 'Edit Event' : 'Add New Event'}
                </h3>
                <button
                  onClick={() => {
                    setShowEventModal(false);
                    setSelectedEvent(null);
                    resetForm();
                  }}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleSaveEvent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={newTask.date}
                      onChange={(e) => setNewTask({...newTask, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      value={newTask.time}
                      onChange={(e) => setNewTask({...newTask, time: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value as 'low' | 'medium' | 'high'})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Type
                    </label>
                    <select
                      value={newTask.type}
                      onChange={(e) => setNewTask({...newTask, type: e.target.value as 'task' | 'reminder' | 'meeting'})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="task">Task</option>
                      <option value="reminder">Reminder</option>
                      <option value="meeting">Meeting</option>
                    </select>
                  </div>
                </div>

                {/* Reminder Type Selection */}
                {newTask.type === 'reminder' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Reminder Type
                    </label>
                    <select
                      value={newTask.reminderType}
                      onChange={(e) => setNewTask({...newTask, reminderType: e.target.value as 'dinner' | 'meeting' | 'flight' | 'other'})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="dinner">Dinner</option>
                      <option value="meeting">Meeting</option>
                      <option value="flight">Flight</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                )}

                {/* Custom Reminder Text */}
                {newTask.type === 'reminder' && newTask.reminderType === 'other' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Custom Reminder
                    </label>
                    <input
                      type="text"
                      value={newTask.customReminderText}
                      onChange={(e) => setNewTask({...newTask, customReminderText: e.target.value})}
                      placeholder="Describe your custom reminder"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                )}
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    {selectedEvent ? 'Update Event' : 'Add Event'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEventModal(false);
                      setSelectedEvent(null);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulerDashboard;