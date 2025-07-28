// import React, { useState, useEffect } from 'react';
// import { Plus, Users, Clock, Calendar, CheckCircle, ArrowLeft, Edit2, Save, X, ChevronDown, Upload, Image, FileText } from 'lucide-react';

// // TaskDetail Component - Separate page for task details
// const TaskDetail = ({ task, onBack, onUpdateTask, sprintData }) => {
//   const [editingField, setEditingField] = useState(null);
//   const [editValues, setEditValues] = useState({});
//   const [showStoryPointDropdown, setShowStoryPointDropdown] = useState(false);

//   const fibonacciValues = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

//   const startEditing = (field, value) => {
//     if (field === 'storyPointEstimate') {
//       setShowStoryPointDropdown(true);
//       return;
//     }
    
//     setEditingField(field);
//     if (field === 'assignees') {
//       setEditValues({ [field]: value ? value.join(', ') : '' });
//     } else {
//       setEditValues({ [field]: value || '' });
//     }
//   };

//   const saveEdit = () => {
//     if (!editingField || !task) return;

//     let newValue = editValues[editingField];
//     if (editingField === 'assignees') {
//       newValue = newValue.split(',').map(name => name.trim()).filter(name => name);
//     }
    
//     onUpdateTask(task.id, editingField, newValue);
//     setEditingField(null);
//     setEditValues({});
//   };

//   const handleStoryPointSelect = (value) => {
//     onUpdateTask(task.id, 'storyPointEstimate', value);
//     setShowStoryPointDropdown(false);
//   };

//   const cancelEdit = () => {
//     setEditingField(null);
//     setEditValues({});
//     setShowStoryPointDropdown(false);
//   };

//   const handleColumnChange = (newColumn) => {
//     onUpdateTask(task.id, 'column', newColumn);
//   };

//   const getColumnColor = (columnName) => {
//     const column = sprintData.columns.find(col => col.name === columnName);
//     return column ? column.color : 'bg-gray-100';
//   };

//   const EditableField = ({ label, value, field, icon }) => {
//     const [dragOver, setDragOver] = useState(false);
//     const [attachments, setAttachments] = useState(task.attachments?.[field] || []);

//     const handleFileUpload = (files) => {
//       const newAttachments = Array.from(files).map(file => ({
//         id: Date.now() + Math.random(),
//         name: file.name,
//         type: file.type,
//         size: file.size,
//         url: URL.createObjectURL(file)
//       }));
      
//       const updatedAttachments = [...attachments, ...newAttachments];
//       setAttachments(updatedAttachments);
      
//       // Update task with new attachments
//       const taskAttachments = { ...task.attachments, [field]: updatedAttachments };
//       onUpdateTask(task.id, 'attachments', taskAttachments);
//     };

//     const handleDrop = (e) => {
//       e.preventDefault();
//       setDragOver(false);
//       const files = e.dataTransfer.files;
//       if (files.length > 0) {
//         handleFileUpload(files);
//       }
//     };

//     const handleDragOver = (e) => {
//       e.preventDefault();
//       setDragOver(true);
//     };

//     const handleDragLeave = (e) => {
//       e.preventDefault();
//       setDragOver(false);
//     };

//     const removeAttachment = (attachmentId) => {
//       const updatedAttachments = attachments.filter(att => att.id !== attachmentId);
//       setAttachments(updatedAttachments);
//       const taskAttachments = { ...task.attachments, [field]: updatedAttachments };
//       onUpdateTask(task.id, 'attachments', taskAttachments);
//     };

//     return (
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
//         <div className="space-y-2">
//           {editingField === field ? (
//             <div className="space-y-3">
//               {/* Text Input with File Upload Area - Consistent Design */}
//               <div 
//                 className={`relative border-2 rounded-lg transition-colors ${
//                   dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-white'
//                 }`}
//                 onDrop={handleDrop}
//                 onDragOver={handleDragOver}
//                 onDragLeave={handleDragLeave}
//               >
//                 <div className="flex items-center space-x-2 p-3">
//                   {icon && <div className="text-gray-400">{icon}</div>}
//                   <input
//                     type="text"
//                     value={editValues[field] || ''}
//                     onChange={(e) => setEditValues({ ...editValues, [field]: e.target.value })}
//                     className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
//                     placeholder={`Enter ${label.toLowerCase()}...`}
//                     autoFocus
//                   />
//                   <div className="flex items-center space-x-2 border-l border-gray-200 pl-2">
//                     <input
//                       type="file"
//                       multiple
//                       accept="image/*,.pdf,.doc,.docx,.txt"
//                       onChange={(e) => handleFileUpload(e.target.files)}
//                       className="hidden"
//                       id={`file-upload-${field}`}
//                     />
//                     <label 
//                       htmlFor={`file-upload-${field}`} 
//                       className="cursor-pointer p-1 text-gray-400 hover:text-gray-600 transition-colors"
//                       title="Upload files"
//                     >
//                       <Upload className="w-4 h-4" />
//                     </label>
//                     <button
//                       onClick={saveEdit}
//                       className="p-1 text-green-600 hover:text-green-700 transition-colors"
//                       title="Save"
//                     >
//                       <Save className="w-4 h-4" />
//                     </button>
//                     <button
//                       onClick={cancelEdit}
//                       className="p-1 text-red-600 hover:text-red-700 transition-colors"
//                       title="Cancel"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
                
//                 {/* Drop Zone Indicator */}
//                 {dragOver && (
//                   <div className="absolute inset-0 flex items-center justify-center bg-blue-50 bg-opacity-90 rounded-lg border-2 border-dashed border-blue-400">
//                     <div className="text-center">
//                       <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
//                       <p className="text-sm text-blue-600 font-medium">Drop files here</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
              
//               {/* File Upload Area Description */}
//               <p className="text-xs text-gray-500 ml-1">
//                 You can also drag and drop images, PDFs, and documents directly into the text field above.
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-2">
//               {/* Display Field with Consistent Styling */}
//               <div className="border-2 border-gray-300 rounded-lg bg-white hover:border-gray-400 transition-colors group">
//                 <div className="flex items-center space-x-2 p-3">
//                   {icon && <div className="text-gray-400">{icon}</div>}
//                   <span className="flex-1 text-gray-800">
//                     {field === 'assignees' ? (value ? value.join(', ') : 'Not assigned') : (value || 'Not set')}
//                   </span>
//                   <button
//                     onClick={() => startEditing(field, value)}
//                     className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-all"
//                     title="Edit field"
//                   >
//                     <Edit2 className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
              
//               {/* Display Attachments */}
//               {attachments.length > 0 && (
//                 <div className="space-y-2 ml-1">
//                   <p className="text-xs text-gray-500 font-medium">Attachments ({attachments.length})</p>
//                   {attachments.map((attachment) => (
//                     <div key={attachment.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors">
//                       {attachment.type.startsWith('image/') ? (
//                         <Image className="w-4 h-4 text-blue-500" />
//                       ) : (
//                         <FileText className="w-4 h-4 text-gray-500" />
//                       )}
//                       <span className="text-sm text-gray-700 flex-1 truncate">{attachment.name}</span>
//                       <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
//                         {(attachment.size / 1024).toFixed(1)}KB
//                       </span>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           removeAttachment(attachment.id);
//                         }}
//                         className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
//                         title="Remove attachment"
//                       >
//                         <X className="w-3 h-3" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const StoryPointField = () => (
//     <div className="mb-4">
//       <label className="block text-sm font-medium text-gray-700 mb-2">Story Point Estimate</label>
//       <div className="relative">
//         <button
//           onClick={() => setShowStoryPointDropdown(!showStoryPointDropdown)}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <span className="text-gray-800">
//             {task.storyPointEstimate || '10'}
//           </span>
//           <ChevronDown className="w-4 h-4 text-gray-400" />
//         </button>
        
//         {showStoryPointDropdown && (
//           <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
//             <div className="py-1 max-h-60 overflow-auto">
//               {fibonacciValues.map((value) => (
//                 <button
//                   key={value}
//                   onClick={() => handleStoryPointSelect(value)}
//                   className={`w-full px-3 py-2 text-left hover:bg-blue-50 focus:outline-none focus:bg-blue-50 ${
//                     (task.storyPointEstimate || 10) === value ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
//                   }`}
//                 >
//                   {value}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}
//         <p className="text-xs text-gray-500 mt-1">Measurement of complexity and/or size of a requirement.</p>
//       </div>
//     </div>
//   );

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={onBack}
//               className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
//             >
//               <ArrowLeft className="w-5 h-5 mr-2" />
//               Back to Board
//             </button>
//             <div className="border-l border-gray-300 pl-4">
//               <h1 className="text-xl font-bold text-gray-800 flex items-center">
//                 <span className="text-blue-600 mr-2">#{task.id}</span>
//                 {task.title}
//                 {task.completed && <CheckCircle className="w-5 h-5 text-green-500 ml-2" />}
//               </h1>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Task Details */}
//         <div className="lg:col-span-2">
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <h2 className="text-lg font-semibold text-gray-800 mb-6">Task Details</h2>
            
//             <StoryPointField />
            
//             <EditableField 
//               label="Title" 
//               value={task.title} 
//               field="title" 
//             />
            
//             <EditableField 
//               label="Summary" 
//               value={task.summary} 
//               field="summary" 
//             />
            
//             {task.name && (
//               <EditableField 
//                 label="Project Name" 
//                 value={task.name} 
//                 field="name" 
//               />
//             )}
            
//             <EditableField 
//               label="Duration" 
//               value={task.duration} 
//               field="duration" 
//               icon={<Clock className="w-4 h-4 text-gray-400" />}
//             />
            
//             <EditableField 
//               label="Start Date" 
//               value={task.start} 
//               field="start" 
//               icon={<Calendar className="w-4 h-4 text-gray-400" />}
//             />
            
//             <EditableField 
//               label="Finish Date" 
//               value={task.finish} 
//               field="finish" 
//               icon={<Calendar className="w-4 h-4 text-gray-400" />}
//             />
            
//             <EditableField 
//               label="Work Hours" 
//               value={task.work} 
//               field="work" 
//             />
//              <EditableField 
//               label="Story ID" 
//               value={task.story_id} 
//               field="story_id" 
//             />
//              <EditableField 
//               label="Epic ID" 
//               value={task.epic_id} 
//               field="epic_id" 
//             />
            
//             <EditableField 
//               label="Assignees" 
//               value={task.assignees} 
//               field="assignees" 
//               icon={<Users className="w-4 h-4 text-gray-400" />}
//             />
//           </div>
//         </div>

//         {/* Status and Actions */}
//         <div className="lg:col-span-1">
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <h2 className="text-lg font-semibold text-gray-800 mb-6">Status & Actions</h2>
            
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-3">Current Status</label>
//               <div className={`${getColumnColor(task.column)} rounded-lg p-3 text-center`}>
//                 <span className="font-medium text-gray-800">{task.column}</span>
//               </div>
//             </div>

//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-3">Move to Column</label>
//               <div className="grid grid-cols-2 gap-2">
//                 {sprintData.columns.map((column) => (
//                   <button
//                     key={column.name}
//                     onClick={() => handleColumnChange(column.name)}
//                     disabled={task.column === column.name}
//                     className={`${column.color} rounded-lg p-2 text-sm font-medium transition-colors ${
//                       task.column === column.name 
//                         ? 'opacity-50 cursor-not-allowed' 
//                         : 'hover:opacity-80 cursor-pointer'
//                     }`}
//                   >
//                     {column.name}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="text-xs text-gray-500 space-y-1">
//               <div>Task ID: #{task.id}</div>
//               <div>Story Points: {task.storyPointEstimate || 10}</div>
//               <div>Column: {task.column}</div>
//               {task.completed && (
//                 <div className="text-green-600 font-medium">✓ Completed</div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main SprintBoard Component
// const SprintBoard = () => {
//   const [sprintData, setSprintData] = useState({
//     title: "Loading Sprint...",
//     duration: "",
//     columns: [
//       { name: "To Do", complete: 0, color: "bg-orange-100" },
//       { name: "In Progress", complete: 50, color: "bg-blue-100" },
//       { name: "Blocked", complete: 0, color: "bg-red-100" },
//       { name: "Done", complete: 100, color: "bg-green-100" }
//     ]
//   });

//   const [tasks, setTasks] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [draggedTask, setDraggedTask] = useState(null);
//   const [draggedOver, setDraggedOver] = useState(null);
//   const [selectedTaskId, setSelectedTaskId] = useState(null);

//   // Fetch sprint data when component mounts
//   useEffect(() => {
//     fetchSprintData();
//   }, []);

//   const fetchSprintData = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);

//       // Get sprint info from localStorage (from SprintManager)
//       const selectedSprintInfo = localStorage.getItem('selectedSprintInfo');
//       const sprintInfo = selectedSprintInfo ? JSON.parse(selectedSprintInfo) : null;

//       if (!sprintInfo) {
//         throw new Error('No sprint selected. Please select a sprint from Sprint Manager.');
//       }

//       // Fetch specific sprint stories from API
//       const response = await fetch(`http://127.0.0.1:8000/stories/${sprintInfo.id}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`API Error: ${response.status} ${response.statusText}`);
//       }

//       const data = await response.json();
//       console.log('Fetched sprint stories data:', data);

//       // Update sprint data
//       setSprintData({
//         title: `${sprintInfo.name} (Current)`,
//         duration: `${sprintInfo.start} - ${sprintInfo.endDate}`,
//         columns: [
//           { name: "To Do", complete: 0, color: "bg-orange-100" },
//           { name: "In Progress", complete: 50, color: "bg-blue-100" },
//           { name: "Blocked", complete: 0, color: "bg-red-100" },
//           { name: "Done", complete: 100, color: "bg-green-100" }
//         ]
//       });

//       // Convert API data to tasks format
//       const convertedTasks = [];
//       let taskIdCounter = 1;

//       // Process assigned stories
//       if (data.assigned_stories && Array.isArray(data.assigned_stories)) {
//         data.assigned_stories.forEach(story => {
//           convertedTasks.push({
//             id: taskIdCounter++,
//             title: story.title || 'Untitled Story',
//             summary: story.description || 'No description',
//             duration: story.duration || '1 day',
//             start: story.start_date || 'TBD',
//             finish: story.end_date || 'TBD',
//             work: story.work_hours || '8h',
//                story_id: story.story_id || "US-001",
//             epic_id:  story.epic_id || "EPIC-001",
//             storyPointEstimate: story.story_points || 5,
//             assignees: story.assigned_to ? [story.assigned_to] : [],
//             attachments: {},
//             column: story.status === 'To Do' ? 'To Do' : 
//                    story.status === 'In Progress' ? 'In Progress' :
//                    story.status === 'Done' ? 'Done' : 'To Do',
//             completed: story.status === 'Done',
//             priority: story.priority || 'Medium',
//             role: story.role || 'General'
//           });
//         });
//       }

//       // Process backlog stories
//       if (data.backlog_stories && Array.isArray(data.backlog_stories)) {
//         data.backlog_stories.forEach(story => {
//           convertedTasks.push({
//             id: taskIdCounter++,
//             title: story.title || 'Backlog Story',
//             summary: story.description || 'No description',
//             duration: story.duration || '1 day',
//             start: story.start_date || 'TBD',
//             finish: story.end_date || 'TBD',
//             work: story.work_hours || '8h',
//             story_id: story.story_id || "US-001",
//             epic_id:  story.epic_id || "EPIC-001",
//             storyPointEstimate: story.story_points || 3,
//             assignees: story.assigned_to ? [story.assigned_to] : [],
//             attachments: {},
//             column: 'To Do', // Backlog items start in To Do
//             completed: false,
//             priority: story.priority || 'Low',
//             role: story.role || 'General'
//           });
//         });
//       }

//       setTasks(convertedTasks);

//     } catch (error) {
//       console.error('Error fetching sprint data:', error);
//       setError(error.message);
      
//       // Fallback to default data
//       setSprintData({
//         title: "Sprint 1 (Current)",
//         duration: "Mon 9/12/22 - Sun 9/25/22",
//         columns: [
//           { name: "To Do", complete: 0, color: "bg-orange-100" },
//           { name: "In Progress", complete: 50, color: "bg-blue-100" },
//           { name: "Blocked", complete: 0, color: "bg-red-100" },
//           { name: "Done", complete: 100, color: "bg-green-100" }
//         ]
//       });
      
//       setTasks([
//         {
//           id: 1,
//           title: "Sample Task",
//           summary: "This is a sample task",
//           duration: "1 day",
//           start: "Today",
//           finish: "Today",
//           work: "8h",
//           story_id: "US-001",
//           epic_id: "EPIC-001",
//           storyPointEstimate: 5,
//           assignees: [],
//           attachments: {},
//           column: "To Do"
//         }
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Get the selected task from tasks array to ensure we always have the latest data
//   const selectedTask = selectedTaskId ? tasks.find(task => task.id === selectedTaskId) : null;

//   const getTasksByColumn = (columnName) => {
//     return tasks.filter(task => task.column === columnName);
//   };

//   const handleDragStart = (e, task) => {
//     setDraggedTask(task);
//     e.dataTransfer.effectAllowed = 'move';
//     e.dataTransfer.setData('text/html', e.target.outerHTML);
//     e.dataTransfer.setDragImage(e.target, 0, 0);
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     e.dataTransfer.dropEffect = 'move';
//   };

//   const handleDragEnter = (e, columnName) => {
//     e.preventDefault();
//     setDraggedOver(columnName);
//   };

//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     setDraggedOver(null);
//   };

//   const handleDrop = (e, columnName) => {
//     e.preventDefault();
//     setDraggedOver(null);
    
//     if (draggedTask && draggedTask.column !== columnName) {
//       updateTaskField(draggedTask.id, 'column', columnName);
//     }
//     setDraggedTask(null);
//   };

//   const updateTaskField = (taskId, field, value) => {
//     const updatedTasks = tasks.map(task => {
//       if (task.id === taskId) {
//         const updatedTask = { ...task, [field]: value };
        
//         // Update completion status based on column
//         if (field === 'column') {
//           if (value === 'Done') {
//             updatedTask.completed = true;
//           } else if (task.completed) {
//             updatedTask.completed = false;
//           }
//         }
        
//         return updatedTask;
//       }
//       return task;
//     });
//     setTasks(updatedTasks);
//   };

//   const handleTaskClick = (task) => {
//     setSelectedTaskId(task.id);
//   };

//   const handleBackToBoard = () => {
//     setSelectedTaskId(null);
//   };

//   const TaskCard = ({ task }) => {
//     const totalAttachments = task.attachments ? Object.values(task.attachments).flat().length : 0;
    
//     return (
//       <div 
//         draggable
//         onDragStart={(e) => handleDragStart(e, task)}
//         onClick={() => handleTaskClick(task)}
//         className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 hover:shadow-md transition-shadow cursor-pointer ${
//           draggedTask && draggedTask.id === task.id ? 'opacity-50' : ''
//         }`}
//       >
//         <div className="flex items-start justify-between mb-2">
//           <div className="flex items-center space-x-2">
//             <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
//               {task.storyPointEstimate || 5}
//             </span>
//             <span className="text-sm font-medium text-gray-600">#{task.id}</span>
//             <span className="text-sm font-semibold text-gray-800">{task.title}</span>
//             {task.completed && <CheckCircle className="w-4 h-4 text-green-500" />}
//             {totalAttachments > 0 && (
//               <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded flex items-center">
//                 <Upload className="w-3 h-3 mr-1" />
//                 {totalAttachments}
//               </span>
//             )}
//           </div>
//         </div>
        
//         <div className="text-xs text-gray-500 mb-2">
//           {/* <div className="flex items-center space-x-4">
//             <span>Description: <span className="text-gray-700">{task.summary}</span></span>
//           </div> */}
//           {/* {task.role && (
//             <div className="flex items-center space-x-4 mt-1">
//               <span>Role: <span className="text-gray-700">{task.role}</span></span>
//             </div>
//           )} */}
//           {task.priority && (
//             <div className="flex items-center space-x-4 mt-1">
//               <span>Priority: <span className={`font-medium ${
//                 task.priority === 'High' ? 'text-red-600' :
//                 task.priority === 'Medium' ? 'text-yellow-600' : 'text-green-600'
//               }`}>{task.priority}</span></span>
//             </div>
//           )}
//           {/* <div className="flex items-center space-x-4 mt-1">
//             <span className="flex items-center">
//               <Clock className="w-3 h-3 mr-1" />
//               Duration: <span className="text-gray-700 ml-1">{task.duration}</span>
//             </span>
//           </div> */}
//           {/* <div className="flex items-center space-x-4 mt-1">
//             <span className="flex items-center">
//               <Calendar className="w-3 h-3 mr-1" />
//               Start: <span className="text-gray-700 ml-1">{task.start}</span>
//             </span>
//           </div> */}
//           {/* <div className="flex items-center space-x-4 mt-1">
//             <span className="flex items-center">
//               <Calendar className="w-3 h-3 mr-1" />
//               Finish: <span className="text-gray-700 ml-1">{task.finish}</span>
//             </span>
//           </div> */}
//           {/* <div className="flex items-center space-x-4 mt-1">
//             <span>Work: <span className="text-gray-700">{task.work}</span></span>
//           </div> */}
//           <div className="flex items-center space-x-4 mt-1">
//             <span>Story_ID: <span className="text-gray-700">{task.story_id}</span></span>
//           </div>
//           <div className="flex items-center space-x-4 mt-1">
//             <span>Epic_ID: <span className="text-gray-700">{task.epic_id}</span></span>
//           </div>
//         </div>

//         {task.assignees && task.assignees.length > 0 && (
//           <div className="mt-3 pt-2 border-t border-gray-100">
//             <div className="flex items-center text-xs text-gray-600">
//               <Users className="w-3 h-3 mr-1" />
//               <span className="truncate">{task.assignees.join(', ')}</span>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="p-6 bg-gray-50 min-h-screen">
//         <div className="flex items-center justify-center min-h-96">
//           <div className="text-center">
//             <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//             <p className="text-gray-600">Loading sprint data...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // If a task is selected, show the TaskDetail component
//   if (selectedTask) {
//     return (
//       <TaskDetail 
//         task={selectedTask}
//         onBack={handleBackToBoard}
//         onUpdateTask={updateTaskField}
//         sprintData={sprintData}
//       />
//     );
//   }

//   // Otherwise, show the main SprintBoard
//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Error Display */}
//       {error && (
//         <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
//           <div className="flex items-center">
//             <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             <span className="text-red-700 text-sm">Error loading sprint: {error}</span>
//             <button 
//               onClick={fetchSprintData}
//               className="ml-4 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
//             >
//               Retry
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Sprint Header */}
//       <div className="bg-white rounded-lg shadow-sm border-2 border-orange-400 mb-6 p-4">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-xl font-bold text-orange-600 mb-1">
//               {sprintData.title}
//             </h1>
//             <p className="text-gray-600 text-sm">{sprintData.duration}</p>
//           </div>
//           <div className="flex items-center space-x-4">
//             <div className="text-sm text-gray-600">
//               <span className="font-medium">{tasks.length}</span> tasks total
//             </div>
//             <button 
//               onClick={fetchSprintData}
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
//             >
//               Refresh
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Kanban Board */}
//       <div className="grid grid-cols-4 gap-4 overflow-x-auto">
//         {sprintData.columns.map((column, index) => (
//           <div 
//             key={`${column.name}-${index}`} 
//             className={`${column.color} rounded-lg shadow-sm min-h-96 transition-all duration-200 ${
//               draggedOver === column.name ? 'ring-2 ring-blue-400 ring-opacity-50 transform scale-105' : ''
//             }`}
//             onDragOver={handleDragOver}
//             onDragEnter={(e) => handleDragEnter(e, column.name)}
//             onDragLeave={handleDragLeave}
//             onDrop={(e) => handleDrop(e, column.name)}
//           >
//             {/* Column Header */}
//             <div className="p-4 border-b border-gray-200">
//               <div className="flex items-center justify-between">
//                 <h3 className="font-semibold text-gray-800 mb-1">{column.name}</h3>
//                 <span className="text-sm text-gray-600 bg-white bg-opacity-50 px-2 py-1 rounded">
//                   {getTasksByColumn(column.name).length}
//                 </span>
//               </div>
//               <p className="text-xs text-gray-600">% COMPLETE: {column.complete}</p>
//             </div>

//             {/* Column Content */}
//             <div className="p-4">
//               {column.name === "To Do" && (
//                 <button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-md p-3 mb-4 flex items-center justify-center text-sm font-medium transition-colors">
//                   <Plus className="w-4 h-4 mr-2" />
//                   New Task
//                 </button>
//               )}

//               {/* Tasks */}
//               <div className="space-y-3">
//                 {getTasksByColumn(column.name).map(task => (
//                   <TaskCard key={task.id} task={task} />
//                 ))}
//               </div>

//               {/* Empty State */}
//               {getTasksByColumn(column.name).length === 0 && (
//                 <div className="text-center text-gray-500 text-sm py-8">
//                   <div className="text-gray-400 mb-2">No tasks</div>
//                   {draggedOver === column.name ? (
//                     <div className="text-blue-600 font-medium">Drop task here</div>
//                   ) : (
//                     <div>Drag tasks here</div>
//                   )}
//                 </div>
//               )}

//               {/* Drop Zone Indicator */}
//               {draggedOver === column.name && getTasksByColumn(column.name).length > 0 && (
//                 <div className="border-2 border-dashed border-blue-400 rounded-lg p-4 text-center text-blue-600 bg-blue-50 mt-3">
//                   Drop task here
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Debug Panel - Remove in production */}
//       <div className="mt-6 p-4 bg-gray-100 rounded-lg">
//         <h3 className="text-sm font-medium text-gray-700 mb-2">Debug: Sprint Data</h3>
//         <div className="text-xs text-gray-600 bg-white p-2 rounded border">
//           <div>Tasks loaded: {tasks.length}</div>
//           <div>To Do: {getTasksByColumn('To Do').length}</div>
//           <div>In Progress: {getTasksByColumn('In Progress').length}</div>
//           <div>Blocked: {getTasksByColumn('Blocked').length}</div>
//           <div>Done: {getTasksByColumn('Done').length}</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SprintBoard;


import React, { useState, useEffect } from 'react';
import { Plus, Users, Clock, Calendar, CheckCircle, ArrowLeft, Edit2, Save, X, ChevronDown, Upload, Image, FileText, AlertTriangle, Tag } from 'lucide-react';

// TaskDetail Component - Separate page for task details
const TaskDetail = ({ task, onBack, onUpdateTask, sprintData }) => {
  const [editingField, setEditingField] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [showStoryPointDropdown, setShowStoryPointDropdown] = useState(false);

  const fibonacciValues = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

  const startEditing = (field, value) => {
    if (field === 'storyPointEstimate') {
      setShowStoryPointDropdown(true);
      return;
    }
    
    setEditingField(field);
    if (field === 'assignees') {
      setEditValues({ [field]: value ? value.join(', ') : '' });
    } else if (field === 'tags') {
      setEditValues({ [field]: value ? value.join(', ') : '' });
    } else if (field === 'dependencies') {
      setEditValues({ [field]: value ? value.join(', ') : '' });
    } else {
      setEditValues({ [field]: value || '' });
    }
  };

  const saveEdit = () => {
    if (!editingField || !task) return;

    let newValue = editValues[editingField];
    if (editingField === 'assignees' || editingField === 'tags' || editingField === 'dependencies') {
      newValue = newValue.split(',').map(item => item.trim()).filter(item => item);
    }
    
    onUpdateTask(task.id, editingField, newValue);
    setEditingField(null);
    setEditValues({});
  };

  const handleStoryPointSelect = (value) => {
    onUpdateTask(task.id, 'storyPointEstimate', value);
    setShowStoryPointDropdown(false);
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValues({});
    setShowStoryPointDropdown(false);
  };

  const handleColumnChange = (newColumn) => {
    onUpdateTask(task.id, 'column', newColumn);
  };

  const toggleRiskFlag = () => {
    onUpdateTask(task.id, 'riskFlag', !task.riskFlag);
  };

  const getColumnColor = (columnName) => {
    const column = sprintData.columns.find(col => col.name === columnName);
    return column ? column.color : 'bg-gray-100';
  };

  const EditableField = ({ label, value, field, icon }) => {
    const [dragOver, setDragOver] = useState(false);
    const [attachments, setAttachments] = useState(task.attachments?.[field] || []);

    const handleFileUpload = (files) => {
      const newAttachments = Array.from(files).map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file)
      }));
      
      const updatedAttachments = [...attachments, ...newAttachments];
      setAttachments(updatedAttachments);
      
      // Update task with new attachments
      const taskAttachments = { ...task.attachments, [field]: updatedAttachments };
      onUpdateTask(task.id, 'attachments', taskAttachments);
    };

    const handleDrop = (e) => {
      e.preventDefault();
      setDragOver(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files);
      }
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      setDragOver(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      setDragOver(false);
    };

    const removeAttachment = (attachmentId) => {
      const updatedAttachments = attachments.filter(att => att.id !== attachmentId);
      setAttachments(updatedAttachments);
      const taskAttachments = { ...task.attachments, [field]: updatedAttachments };
      onUpdateTask(task.id, 'attachments', taskAttachments);
    };

    const formatValue = (field, value) => {
      if (field === 'assignees' || field === 'tags' || field === 'dependencies') {
        return value && value.length > 0 ? value.join(', ') : 'None';
      }
      return value || 'Not set';
    };

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="space-y-2">
          {editingField === field ? (
            <div className="space-y-3">
              {/* Text Input with File Upload Area - Consistent Design */}
              <div 
                className={`relative border-2 rounded-lg transition-colors ${
                  dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-white'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <div className="flex items-center space-x-2 p-3">
                  {icon && <div className="text-gray-400">{icon}</div>}
                  <input
                    type="text"
                    value={editValues[field] || ''}
                    onChange={(e) => setEditValues({ ...editValues, [field]: e.target.value })}
                    className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
                    placeholder={`Enter ${label.toLowerCase()}...`}
                    autoFocus
                  />
                  <div className="flex items-center space-x-2 border-l border-gray-200 pl-2">
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx,.txt"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                      id={`file-upload-${field}`}
                    />
                    <label 
                      htmlFor={`file-upload-${field}`} 
                      className="cursor-pointer p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Upload files"
                    >
                      <Upload className="w-4 h-4" />
                    </label>
                    <button
                      onClick={saveEdit}
                      className="p-1 text-green-600 hover:text-green-700 transition-colors"
                      title="Save"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-1 text-red-600 hover:text-red-700 transition-colors"
                      title="Cancel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Drop Zone Indicator */}
                {dragOver && (
                  <div className="absolute inset-0 flex items-center justify-center bg-blue-50 bg-opacity-90 rounded-lg border-2 border-dashed border-blue-400">
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-sm text-blue-600 font-medium">Drop files here</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* File Upload Area Description */}
              <p className="text-xs text-gray-500 ml-1">
                You can also drag and drop images, PDFs, and documents directly into the text field above.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Display Field with Consistent Styling */}
              <div className="border-2 border-gray-300 rounded-lg bg-white hover:border-gray-400 transition-colors group">
                <div className="flex items-center space-x-2 p-3">
                  {icon && <div className="text-gray-400">{icon}</div>}
                  <span className="flex-1 text-gray-800">
                    {formatValue(field, value)}
                  </span>
                  <button
                    onClick={() => startEditing(field, value)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-all"
                    title="Edit field"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Display Attachments */}
              {attachments.length > 0 && (
                <div className="space-y-2 ml-1">
                  <p className="text-xs text-gray-500 font-medium">Attachments ({attachments.length})</p>
                  {attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors">
                      {attachment.type.startsWith('image/') ? (
                        <Image className="w-4 h-4 text-blue-500" />
                      ) : (
                        <FileText className="w-4 h-4 text-gray-500" />
                      )}
                      <span className="text-sm text-gray-700 flex-1 truncate">{attachment.name}</span>
                      <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                        {(attachment.size / 1024).toFixed(1)}KB
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeAttachment(attachment.id);
                        }}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        title="Remove attachment"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const StoryPointField = () => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Story Point Estimate</label>
      <div className="relative">
        <button
          onClick={() => setShowStoryPointDropdown(!showStoryPointDropdown)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span className="text-gray-800">
            {task.storyPointEstimate || '10'}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
        
        {showStoryPointDropdown && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
            <div className="py-1 max-h-60 overflow-auto">
              {fibonacciValues.map((value) => (
                <button
                  key={value}
                  onClick={() => handleStoryPointSelect(value)}
                  className={`w-full px-3 py-2 text-left hover:bg-blue-50 focus:outline-none focus:bg-blue-50 ${
                    (task.storyPointEstimate || 10) === value ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-1">Measurement of complexity and/or size of a requirement.</p>
      </div>
    </div>
  );

  const RiskFlagField = () => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Risk Flag</label>
      <button
        onClick={toggleRiskFlag}
        className={`w-full px-3 py-2 border-2 rounded-md text-left flex items-center justify-between transition-colors ${
          task.riskFlag 
            ? 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100' 
            : 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100'
        }`}
      >
        <div className="flex items-center space-x-2">
          <AlertTriangle className={`w-4 h-4 ${task.riskFlag ? 'text-red-500' : 'text-green-500'}`} />
          <span className="font-medium">
            {task.riskFlag ? 'Risk Present' : 'No Risk'}
          </span>
        </div>
        <span className="text-xs opacity-75">Click to toggle</span>
      </button>
      <p className="text-xs text-gray-500 mt-1">Indicates whether this task has associated risks.</p>
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
                {task.riskFlag && <AlertTriangle className="w-5 h-5 text-red-500 ml-2" />}
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
            
            <StoryPointField />
            
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

            <EditableField 
              label="Status" 
              value={task.status} 
              field="status" 
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
              label="Due Date" 
              value={task.dueDate} 
              field="dueDate" 
              icon={<Calendar className="w-4 h-4 text-gray-400" />}
            />
            
            <EditableField 
              label="Work Hours" 
              value={task.work} 
              field="work" 
            />
             <EditableField 
              label="Story ID" 
              value={task.story_id} 
              field="story_id" 
            />
             <EditableField 
              label="Epic ID" 
              value={task.epic_id} 
              field="epic_id" 
            />
            
            <EditableField 
              label="Assignees" 
              value={task.assignees} 
              field="assignees" 
              icon={<Users className="w-4 h-4 text-gray-400" />}
            />

            <EditableField 
              label="Dependencies" 
              value={task.dependencies} 
              field="dependencies" 
            />

            <EditableField 
              label="Tags/Labels" 
              value={task.tags} 
              field="tags" 
              icon={<Tag className="w-4 h-4 text-gray-400" />}
            />

            <RiskFlagField />
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
              <div>Story Points: {task.storyPointEstimate || 10}</div>
              <div>Status: {task.status || 'Not set'}</div>
              <div>Column: {task.column}</div>
              <div>Risk Flag: {task.riskFlag ? '⚠️ Yes' : '✅ No'}</div>
              {task.dueDate && <div>Due: {task.dueDate}</div>}
              {task.dependencies && task.dependencies.length > 0 && (
                <div>Dependencies: {task.dependencies.length}</div>
              )}
              {task.tags && task.tags.length > 0 && (
                <div>Tags: {task.tags.length}</div>
              )}
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

// Main SprintBoard Component
const SprintBoard = () => {
  const [sprintData, setSprintData] = useState({
    title: "Loading Sprint...",
    duration: "",
    columns: [
      { name: "To Do", complete: 0, color: "bg-orange-100" },
      { name: "In Progress", complete: 50, color: "bg-blue-100" },
      { name: "Blocked", complete: 0, color: "bg-red-100" },
      { name: "Done", complete: 100, color: "bg-green-100" }
    ]
  });

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedOver, setDraggedOver] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // Fetch sprint data when component mounts
  useEffect(() => {
    fetchSprintData();
  }, []);

  const fetchSprintData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get sprint info from localStorage (from SprintManager)
      const selectedSprintInfo = localStorage.getItem('selectedSprintInfo');
      const sprintInfo = selectedSprintInfo ? JSON.parse(selectedSprintInfo) : null;

      if (!sprintInfo) {
        throw new Error('No sprint selected. Please select a sprint from Sprint Manager.');
      }

      // Fetch specific sprint stories from API
      const response = await fetch(`http://127.0.0.1:8000/stories/${sprintInfo.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Fetched sprint stories data:', data);

      // Update sprint data
      setSprintData({
        title: `${sprintInfo.name} (Current)`,
        duration: `${sprintInfo.start} - ${sprintInfo.endDate}`,
        columns: [
          { name: "To Do", complete: 0, color: "bg-orange-100" },
          { name: "In Progress", complete: 50, color: "bg-blue-100" },
          { name: "Blocked", complete: 0, color: "bg-red-100" },
          { name: "Done", complete: 100, color: "bg-green-100" }
        ]
      });

      // Convert API data to tasks format
      const convertedTasks = [];
      let taskIdCounter = 1;

      // Process assigned stories
      if (data.assigned_stories && Array.isArray(data.assigned_stories)) {
        data.assigned_stories.forEach(story => {
          convertedTasks.push({
            id: taskIdCounter++,
            title: story.title || 'Untitled Story',
            summary: story.description || 'No description',
            status: story.status || 'Planned',
            duration: story.duration || '1 day',
            start: story.start_date || 'TBD',
            finish: story.end_date || 'TBD',
            dueDate: story.due_date || 'TBD',
            work: story.work_hours || '8h',
            story_id: story.story_id || "US-001",
            epic_id: story.epic_id || "EPIC-001",
            storyPointEstimate: story.story_points || 5,
            assignees: story.assigned_to ? [story.assigned_to] : [],
            dependencies: story.dependencies || [],
            tags: story.tags || ['Feature'],
            riskFlag: story.risk_flag || false,
            attachments: {},
            column: story.status === 'To Do' ? 'To Do' : 
                   story.status === 'In Progress' ? 'In Progress' :
                   story.status === 'Done' ? 'Done' : 'To Do',
            completed: story.status === 'Done',
            priority: story.priority || 'Medium',
            role: story.role || 'General'
          });
        });
      }

      // Process backlog stories
      if (data.backlog_stories && Array.isArray(data.backlog_stories)) {
        data.backlog_stories.forEach(story => {
          convertedTasks.push({
            id: taskIdCounter++,
            title: story.title || 'Backlog Story',
            summary: story.description || 'No description',
            status: story.status || 'Planned',
            duration: story.duration || '1 day',
            start: story.start_date || 'TBD',
            finish: story.end_date || 'TBD',
            dueDate: story.due_date || 'TBD',
            work: story.work_hours || '8h',
            story_id: story.story_id || "US-001",
            epic_id: story.epic_id || "EPIC-001",
            storyPointEstimate: story.story_points || 3,
            assignees: story.assigned_to ? [story.assigned_to] : [],
            dependencies: story.dependencies || [],
            tags: story.tags || ['Backlog'],
            riskFlag: story.risk_flag || false,
            attachments: {},
            column: 'To Do', // Backlog items start in To Do
            completed: false,
            priority: story.priority || 'Low',
            role: story.role || 'General'
          });
        });
      }

      setTasks(convertedTasks);

    } catch (error) {
      console.error('Error fetching sprint data:', error);
      setError(error.message);
      
      // Fallback to default data
      setSprintData({
        title: "Sprint 1 (Current)",
        duration: "Mon 9/12/22 - Sun 9/25/22",
        columns: [
          { name: "To Do", complete: 0, color: "bg-orange-100" },
          { name: "In Progress", complete: 50, color: "bg-blue-100" },
          { name: "Blocked", complete: 0, color: "bg-red-100" },
          { name: "Done", complete: 100, color: "bg-green-100" }
        ]
      });
      
      setTasks([
        {
          id: 1,
          title: "Sample Task",
          summary: "This is a sample task",
          status: "Planned",
          duration: "1 day",
          start: "Today",
          finish: "Today",
          dueDate: "Tomorrow",
          work: "8h",
          story_id: "US-001",
          epic_id: "EPIC-001",
          storyPointEstimate: 5,
          assignees: [],
          dependencies: [],
          tags: ['Sample', 'Demo'],
          riskFlag: false,
          attachments: {},
          column: "To Do"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Get the selected task from tasks array to ensure we always have the latest data
  const selectedTask = selectedTaskId ? tasks.find(task => task.id === selectedTaskId) : null;

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
      updateTaskField(draggedTask.id, 'column', columnName);
    }
    setDraggedTask(null);
  };

  const updateTaskField = (taskId, field, value) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, [field]: value };
        
        // Update completion status based on column
        if (field === 'column') {
          if (value === 'Done') {
            updatedTask.completed = true;
          } else if (task.completed) {
            updatedTask.completed = false;
          }
        }
        
        return updatedTask;
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const handleTaskClick = (task) => {
    setSelectedTaskId(task.id);
  };

  const handleBackToBoard = () => {
    setSelectedTaskId(null);
  };

  const TaskCard = ({ task }) => {
    const totalAttachments = task.attachments ? Object.values(task.attachments).flat().length : 0;
    
    return (
      <div 
        draggable
        onDragStart={(e) => handleDragStart(e, task)}
        onClick={() => handleTaskClick(task)}
        className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 hover:shadow-md transition-shadow cursor-pointer ${
          draggedTask && draggedTask.id === task.id ? 'opacity-50' : ''
        }`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
              {task.storyPointEstimate || 5}
            </span>
            <span className="text-sm font-medium text-gray-600">#{task.id}</span>
            <span className="text-sm font-semibold text-gray-800">{task.title}</span>
            {task.completed && <CheckCircle className="w-4 h-4 text-green-500" />}
            {task.riskFlag && <AlertTriangle className="w-4 h-4 text-red-500" />}
            {totalAttachments > 0 && (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded flex items-center">
                <Upload className="w-3 h-3 mr-1" />
                {totalAttachments}
              </span>
            )}
          </div>
        </div>
        
        <div className="text-xs text-gray-500 mb-2">
          <div className="flex items-center space-x-4 mt-1">
            <span>Status: <span className={`font-medium ${
              task.status === 'Done' ? 'text-green-600' :
              task.status === 'In Progress' ? 'text-blue-600' :
              task.status === 'Blocked' ? 'text-red-600' : 'text-gray-600'
            }`}>{task.status || 'Planned'}</span></span>
          </div>
          
          {task.dueDate && task.dueDate !== 'TBD' && (
            <div className="flex items-center space-x-4 mt-1">
              <span className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                Due: <span className="text-gray-700 ml-1">{task.dueDate}</span>
              </span>
            </div>
          )}

          {task.dependencies && task.dependencies.length > 0 && (
            <div className="flex items-center space-x-4 mt-1">
              <span className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-1 ${task.dependencies.length > 0 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                Dependencies: <span className="text-red-600 font-medium ml-1">{task.dependencies.length} present</span>
              </span>
            </div>
          )}

          {(!task.dependencies || task.dependencies.length === 0) && (
            <div className="flex items-center space-x-4 mt-1">
              <span className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                Dependencies: <span className="text-green-600 font-medium ml-1">None</span>
              </span>
            </div>
          )}

          {task.priority && (
            <div className="flex items-center space-x-4 mt-1">
              <span>Priority: <span className={`font-medium ${
                task.priority === 'High' ? 'text-red-600' :
                task.priority === 'Medium' ? 'text-yellow-600' : 'text-green-600'
              }`}>{task.priority}</span></span>
            </div>
          )}

          <div className="flex items-center space-x-4 mt-1">
            <span>Story_ID: <span className="text-gray-700">{task.story_id}</span></span>
          </div>
          <div className="flex items-center space-x-4 mt-1">
            <span>Epic_ID: <span className="text-gray-700">{task.epic_id}</span></span>
          </div>

          {task.tags && task.tags.length > 0 && (
            <div className="flex items-center space-x-4 mt-1">
              <span className="flex items-center">
                <Tag className="w-3 h-3 mr-1" />
                Tags:
              </span>
              <div className="flex flex-wrap gap-1">
                {task.tags.slice(0, 3).map((tag, index) => (
                  <span 
                    key={index} 
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      tag.toLowerCase() === 'bug' ? 'bg-red-100 text-red-700' :
                      tag.toLowerCase() === 'feature' ? 'bg-blue-100 text-blue-700' :
                      tag.toLowerCase() === 'tech' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
                {task.tags.length > 3 && (
                  <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                    +{task.tags.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {task.assignees && task.assignees.length > 0 && (
          <div className="mt-3 pt-2 border-t border-gray-100">
            <div className="flex items-center text-xs text-gray-600">
              <Users className="w-3 h-3 mr-1" />
              <span className="truncate">{task.assignees.join(', ')}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading sprint data...</p>
          </div>
        </div>
      </div>
    );
  }

  // If a task is selected, show the TaskDetail component
  if (selectedTask) {
    return (
      <TaskDetail 
        task={selectedTask}
        onBack={handleBackToBoard}
        onUpdateTask={updateTaskField}
        sprintData={sprintData}
      />
    );
  }

  // Otherwise, show the main SprintBoard
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700 text-sm">Error loading sprint: {error}</span>
            <button 
              onClick={fetchSprintData}
              className="ml-4 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Sprint Header */}
      <div className="bg-white rounded-lg shadow-sm border-2 border-orange-400 mb-6 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-orange-600 mb-1">
              {sprintData.title}
            </h1>
            <p className="text-gray-600 text-sm">{sprintData.duration}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{tasks.length}</span> tasks total
            </div>
            <button 
              onClick={fetchSprintData}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Refresh
            </button>
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
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 mb-1">{column.name}</h3>
                <span className="text-sm text-gray-600 bg-white bg-opacity-50 px-2 py-1 rounded">
                  {getTasksByColumn(column.name).length}
                </span>
              </div>
              <p className="text-xs text-gray-600">% COMPLETE: {column.complete}</p>
            </div>

            {/* Column Content */}
            <div className="p-4">
              {column.name === "To Do" && (
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

              {/* Empty State */}
              {getTasksByColumn(column.name).length === 0 && (
                <div className="text-center text-gray-500 text-sm py-8">
                  <div className="text-gray-400 mb-2">No tasks</div>
                  {draggedOver === column.name ? (
                    <div className="text-blue-600 font-medium">Drop task here</div>
                  ) : (
                    <div>Drag tasks here</div>
                  )}
                </div>
              )}

              {/* Drop Zone Indicator */}
              {draggedOver === column.name && getTasksByColumn(column.name).length > 0 && (
                <div className="border-2 border-dashed border-blue-400 rounded-lg p-4 text-center text-blue-600 bg-blue-50 mt-3">
                  Drop task here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Debug Panel - Remove in production */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Debug: Sprint Data</h3>
        <div className="text-xs text-gray-600 bg-white p-2 rounded border">
          <div>Tasks loaded: {tasks.length}</div>
          <div>To Do: {getTasksByColumn('To Do').length}</div>
          <div>In Progress: {getTasksByColumn('In Progress').length}</div>
          <div>Blocked: {getTasksByColumn('Blocked').length}</div>
          <div>Done: {getTasksByColumn('Done').length}</div>
          <div>Tasks with risks: {tasks.filter(t => t.riskFlag).length}</div>
          <div>Tasks with dependencies: {tasks.filter(t => t.dependencies && t.dependencies.length > 0).length}</div>
        </div>
      </div>
    </div>
  );
};

export default SprintBoard;