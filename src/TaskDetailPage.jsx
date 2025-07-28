import React, { useState } from 'react';
import { Plus, Users, Clock, Calendar, CheckCircle, ArrowLeft, Edit2, Save, X } from 'lucide-react';

// TaskDetail Page Component
const TaskDetailPage = ({ task, onBack, onUpdateTask, sprintData }) => {
  const [editingField, setEditingField] = useState(null);
  const [editValues, setEditValues] = useState({});

  const startEditing = (field, value) => {
    setEditingField(field);
    if (field === 'assignees') {
      setEditValues({ [field]: value ? value.join(', ') : '' });
    } else {
      setEditValues({ [field]: value || '' });
    }
  };

  const saveEdit = () => {
    if (!editingField || !task) return;

    let newValue = editValues[editingField];
    if (editingField === 'assignees') {
      newValue = newValue.split(',').map(name => name.trim()).filter(name => name);
    }
    
    onUpdateTask(task.id, editingField, newValue);
    setEditingField(null);
    setEditValues({});
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValues({});
  };

  const handleColumnChange = (newColumn) => {
    onUpdateTask(task.id, 'column', newColumn);
  };

  const getColumnColor = (columnName) => {
    const column = sprintData.columns.find(col => col.name === columnName);
    return column ? column.color : 'bg-gray-100';
  };

  const EditableField = ({ label, value, field, icon }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex items-center space-x-2">
        {icon}
        {editingField === field ? (
          <div className="flex items-center space-x-2 flex-1">
            <input
              type="text"
              value={editValues[field] || ''}
              onChange={(e) => setEditValues({ ...editValues, [field]: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={saveEdit}
              className="p-2 text-green-600 hover:text-green-700"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={cancelEdit}
              className="p-2 text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2 flex-1 group">
            <span className="text-gray-800">
              {field === 'assignees' ? (value ? value.join(', ') : 'Not assigned') : (value || 'Not set')}
            </span>
            <button
              onClick={() => startEditing(field, value)}
              className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-opacity"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Board
            </button>
            <div className="border-l border-gray-300 pl-4">
              <h1 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="text-blue-600 mr-2">#{task.id}</span>
                {task.title}
                {task.completed && <CheckCircle className="w-5 h-5 text-green-500 ml-2" />}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Task Details</h2>
            
            <EditableField 
              label="Title" 
              value={task.title} 
              field="title" 
            />
            
            <EditableField 
              label="Summary" 
              value={task.summary} 
              field="summary" 
            />
            
            {task.name && (
              <EditableField 
                label="Project Name" 
                value={task.name} 
                field="name" 
              />
            )}
            
            <EditableField 
              label="Duration" 
              value={task.duration} 
              field="duration" 
              icon={<Clock className="w-4 h-4 text-gray-400" />}
            />
            
            <EditableField 
              label="Start Date" 
              value={task.start} 
              field="start" 
              icon={<Calendar className="w-4 h-4 text-gray-400" />}
            />
            
            <EditableField 
              label="Finish Date" 
              value={task.finish} 
              field="finish" 
              icon={<Calendar className="w-4 h-4 text-gray-400" />}
            />
            
            <EditableField 
              label="Work Hours" 
              value={task.work} 
              field="work" 
            />
            
            <EditableField 
              label="Assignees" 
              value={task.assignees} 
              field="assignees" 
              icon={<Users className="w-4 h-4 text-gray-400" />}
            />
          </div>
        </div>

        {/* Status and Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Status & Actions</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Current Status</label>
              <div className={`${getColumnColor(task.column)} rounded-lg p-3 text-center`}>
                <span className="font-medium text-gray-800">{task.column}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Move to Column</label>
              <div className="grid grid-cols-2 gap-2">
                {sprintData.columns.map((column) => (
                  <button
                    key={column.name}
                    onClick={() => handleColumnChange(column.name)}
                    disabled={task.column === column.name}
                    className={`${column.color} rounded-lg p-2 text-sm font-medium transition-colors ${
                      task.column === column.name 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:opacity-80 cursor-pointer'
                    }`}
                  >
                    {column.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <div>Task ID: #{task.id}</div>
              <div>Column: {task.column}</div>
              {task.completed && (
                <div className="text-green-600 font-medium">✓ Completed</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// SprintBoard Page Component
const SprintBoardPage = ({ tasks, onTaskClick, onUpdateTask, sprintData }) => {
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedOver, setDraggedOver] = useState(null);

  const getTasksByColumn = (columnName) => {
    return tasks.filter(task => task.column === columnName);
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    e.dataTransfer.setDragImage(e.target, 0, 0);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e, columnName) => {
    e.preventDefault();
    setDraggedOver(columnName);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDraggedOver(null);
  };

  const handleDrop = (e, columnName) => {
    e.preventDefault();
    setDraggedOver(null);
    
    if (draggedTask && draggedTask.column !== columnName) {
      onUpdateTask(draggedTask.id, 'column', columnName);
    }
    setDraggedTask(null);
  };

  const TaskCard = ({ task }) => (
    <div 
      draggable
      onDragStart={(e) => handleDragStart(e, task)}
      onClick={() => onTaskClick(task)}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 hover:shadow-md transition-shadow cursor-pointer ${
        draggedTask && draggedTask.id === task.id ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600">{task.id}</span>
          <span className="text-sm font-semibold text-gray-800">{task.title}</span>
          {task.completed && <CheckCircle className="w-4 h-4 text-green-500" />}
        </div>
      </div>
      
      <div className="text-xs text-gray-500 mb-2">
        <div className="flex items-center space-x-4">
          <span>Task Summary Name: <span className="text-gray-700">{task.summary}</span></span>
        </div>
        {task.name && (
          <div className="flex items-center space-x-4 mt-1">
            <span>Name: <span className="text-gray-700">{task.name}</span></span>
          </div>
        )}
        <div className="flex items-center space-x-4 mt-1">
          <span className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            Duration: <span className="text-gray-700 ml-1">{task.duration}</span>
          </span>
        </div>
        <div className="flex items-center space-x-4 mt-1">
          <span className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            Start: <span className="text-gray-700 ml-1">{task.start}</span>
          </span>
        </div>
        <div className="flex items-center space-x-4 mt-1">
          <span className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            Finish: <span className="text-gray-700 ml-1">{task.finish}</span>
          </span>
        </div>
        <div className="flex items-center space-x-4 mt-1">
          <span>Work: <span className="text-gray-700">{task.work}</span></span>
        </div>
      </div>

      {task.assignees && (
        <div className="mt-3 pt-2 border-t border-gray-100">
          <div className="flex items-center text-xs text-gray-600">
            <Users className="w-3 h-3 mr-1" />
            <span className="truncate">{task.assignees.join(', ')}</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Sprint Header */}
      <div className="bg-white rounded-lg shadow-sm border-2 border-orange-400 mb-6 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-orange-600 mb-1">
              {sprintData.title}
            </h1>
            <p className="text-gray-600 text-sm">{sprintData.duration}</p>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-4 gap-4 overflow-x-auto">
        {sprintData.columns.map((column, index) => (
          <div 
            key={`${column.name}-${index}`} 
            className={`${column.color} rounded-lg shadow-sm min-h-96 transition-all duration-200 ${
              draggedOver === column.name ? 'ring-2 ring-blue-400 ring-opacity-50 transform scale-105' : ''
            }`}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, column.name)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.name)}
          >
            {/* Column Header */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-1">{column.name}</h3>
              <p className="text-xs text-gray-600">% COMPLETE: {column.complete}</p>
            </div>

            {/* Column Content */}
            <div className="p-4">
              {column.name === "TODO" && (
                <button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-md p-3 mb-4 flex items-center justify-center text-sm font-medium transition-colors">
                  <Plus className="w-4 h-4 mr-2" />
                  New Task
                </button>
              )}

              {/* Tasks */}
              <div className="space-y-3">
                {getTasksByColumn(column.name).map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>

              {/* Drop Zone Indicator */}
              {draggedOver === column.name && (
                <div className="border-2 border-dashed border-blue-400 rounded-lg p-4 text-center text-blue-600 bg-blue-50">
                  Drop task here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default TaskDetailPage;