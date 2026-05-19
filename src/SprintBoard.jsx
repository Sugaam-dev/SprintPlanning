// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Plus,
//   Users,
//   Clock,
//   Calendar,
//   CheckCircle,
//   ArrowLeft,
//   Edit2,
//   Save,
//   X,
//   ChevronDown,
//   Upload,
//   Image,
//   FileText,
//   AlertTriangle,
//   Tag,
//   Star,
//   Target,
//   BarChart,
//   User,
//   MoreVertical,
//   MessageCircle,
// } from "lucide-react";
// import pmrgLogo from "../src/assets/pmrglogo.png";
// import API_ENDPOINTS from "./Auths";
// // import API_ENDPOINTS from './components/apis/Auths';
// // Utility functions for localStorage management
// const getBacklogItems = () => {
//   const items = localStorage.getItem("backlogItems");
//   return items ? JSON.parse(items) : [];
// };

// const setBacklogItems = (items) => {
//   localStorage.setItem("backlogItems", JSON.stringify(items));
// };

// const addToBacklog = (task) => {
//   const existingItems = getBacklogItems();

//   // Convert sprint task to backlog item format
//   const backlogItem = {
//     id: task.story_id || task.id,
//     title: task.title,
//     description: task.summary || task.description,
//     priority: task.priority || "Medium",
//     storyPoints: task.storyPointEstimate || 0,
//     epic: task.epic_id || "Unassigned",
//     status: "Moved from Sprint",
//     assignee: Array.isArray(task.assignees)
//       ? task.assignees.join(", ")
//       : task.assignees || "Unassigned",
//     estimatedHours: parseInt(task.work?.replace("h", "")) || 0,
//     tags: task.tags || [],
//     acceptanceCriteria: task.acceptance_criteria || [],
//     createdDate: new Date().toISOString().split("T")[0],
//     lastModified: new Date().toISOString().split("T")[0],
//     businessValue: task.priority || "Medium",
//     riskFlag: task.riskFlag || false,
//     dependencies: task.dependencies || [],
//     attachments: task.attachments
//       ? Object.values(task.attachments).flat().length
//       : 0,
//     movedFromSprint: true,
//     originalSprintId: task.sprint_id,
//     comments: task.comments || [],
//   };

//   // Check if item already exists in backlog
//   const existingIndex = existingItems.findIndex(
//     (item) => item.id === backlogItem.id
//   );

//   if (existingIndex !== -1) {
//     // Update existing item
//     existingItems[existingIndex] = {
//       ...existingItems[existingIndex],
//       ...backlogItem,
//     };
//   } else {
//     // Add new item
//     existingItems.unshift(backlogItem); // Add to beginning of array
//   }

//   setBacklogItems(existingItems);

//   // Show success notification
//   const event = new CustomEvent("backlogItemAdded", {
//     detail: {
//       item: backlogItem,
//       action: existingIndex !== -1 ? "updated" : "added",
//     },
//   });
//   window.dispatchEvent(event);
// };

// // TaskDetail Component - Separate page for task details
// const TaskDetail = ({ task, onBack, onUpdateTask, sprintData }) => {
//   const navigate = useNavigate();
//   const [editingField, setEditingField] = useState(null);
//   const [editValues, setEditValues] = useState({});
//   const [showStoryPointDropdown, setShowStoryPointDropdown] = useState(false);
//   const [showDropdownMenu, setShowDropdownMenu] = useState(false);
//   const [isMovingToBacklog, setIsMovingToBacklog] = useState(false);
//   const fibonacciValues = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

//   const startEditing = (field, value) => {
//     if (field === "storyPointEstimate") {
//       setShowStoryPointDropdown(true);
//       return;
//     }

//     setEditingField(field);
//     if (field === "assignees") {
//       setEditValues({ [field]: value ? value.join(", ") : "" });
//     } else if (field === "tags") {
//       setEditValues({ [field]: value ? value.join(", ") : "" });
//     } else if (field === "dependencies") {
//       setEditValues({ [field]: value ? value.join(", ") : "" });
//     } else if (field === "acceptance_criteria") {
//       setEditValues({
//         [field]: Array.isArray(value) ? value.join("\n") : value || "",
//       });
//     } else {
//       setEditValues({ [field]: value || "" });
//     }
//   };

//   const saveEdit = () => {
//     if (!editingField || !task) return;

//     let newValue = editValues[editingField];
//     if (
//       editingField === "assignees" ||
//       editingField === "tags" ||
//       editingField === "dependencies"
//     ) {
//       newValue = newValue
//         .split(",")
//         .map((item) => item.trim())
//         .filter((item) => item);
//     } else if (editingField === "acceptance_criteria") {
//       newValue = newValue
//         .split("\n")
//         .map((item) => item.trim())
//         .filter((item) => item);
//     }

//     onUpdateTask(task.id, editingField, newValue);
//     setEditingField(null);
//     setEditValues({});
//   };

//   const handleStoryPointSelect = (value) => {
//     onUpdateTask(task.id, "storyPointEstimate", value);
//     setShowStoryPointDropdown(false);
//   };

//   const cancelEdit = () => {
//     setEditingField(null);
//     setEditValues({});
//     setShowStoryPointDropdown(false);
//   };

//   const handleColumnChange = (newColumn) => {
//     onUpdateTask(task.id, "column", newColumn);
//   };

//   const toggleRiskFlag = () => {
//     onUpdateTask(task.id, "riskFlag", !task.riskFlag);
//   };

//   const getColumnColor = (columnName) => {
//     const column = sprintData.columns.find((col) => col.name === columnName);
//     return column ? column.color : "bg-gray-100";
//   };

//   const handleMoveToBacklog = async () => {
//     setIsMovingToBacklog(true);
//     setShowDropdownMenu(false);

//     try {
//       // Add task to backlog
//       addToBacklog(task);

//       // Show success message
//       alert(`Story "${task.title}" has been moved to backlog successfully!`);

//       // Navigate to backlog page
//       navigate("/backlog");
//     } catch (error) {
//       console.error("Error moving to backlog:", error);
//       alert("Failed to move story to backlog. Please try again.");
//     } finally {
//       setIsMovingToBacklog(false);
//     }
//   };

//   const handleDropdownToggle = () => {
//     setShowDropdownMenu(!showDropdownMenu);
//   };

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (!event.target.closest(".dropdown-container")) {
//         setShowDropdownMenu(false);
//       }
//     };

//     if (showDropdownMenu) {
//       document.addEventListener("click", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("click", handleClickOutside);
//     };
//   }, [showDropdownMenu]);

//   const EditableField = ({ label, value, field, icon, isTextArea = false }) => {
//     const [dragOver, setDragOver] = useState(false);
//     const [attachments, setAttachments] = useState(
//       task.attachments?.[field] || []
//     );

//     const handleFileUpload = (files) => {
//       const newAttachments = Array.from(files).map((file) => ({
//         id: Date.now() + Math.random(),
//         name: file.name,
//         type: file.type,
//         size: file.size,
//         url: URL.createObjectURL(file),
//       }));

//       const updatedAttachments = [...attachments, ...newAttachments];
//       setAttachments(updatedAttachments);

//       // Update task with new attachments
//       const taskAttachments = {
//         ...task.attachments,
//         [field]: updatedAttachments,
//       };
//       onUpdateTask(task.id, "attachments", taskAttachments);
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
//       const updatedAttachments = attachments.filter(
//         (att) => att.id !== attachmentId
//       );
//       setAttachments(updatedAttachments);
//       const taskAttachments = {
//         ...task.attachments,
//         [field]: updatedAttachments,
//       };
//       onUpdateTask(task.id, "attachments", taskAttachments);
//     };

//     const formatValue = (field, value) => {
//       if (
//         field === "assignees" ||
//         field === "tags" ||
//         field === "dependencies"
//       ) {
//         return value && value.length > 0 ? value.join(", ") : "None";
//       } else if (field === "acceptance_criteria") {
//         return Array.isArray(value) && value.length > 0
//           ? value.join("\n")
//           : "No criteria defined";
//       }
//       return value || "Not set";
//     };

//     return (
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           {label}
//         </label>
//         <div className="space-y-2">
//           {editingField === field ? (
//             <div className="space-y-3">
//               <div
//                 className={`relative border-2 rounded-lg transition-colors ${
//                   dragOver
//                     ? "border-blue-400 bg-blue-50"
//                     : "border-gray-300 bg-white"
//                 }`}
//                 onDrop={handleDrop}
//                 onDragOver={handleDragOver}
//                 onDragLeave={handleDragLeave}
//               >
//                 <div className="flex items-start space-x-2 p-3">
//                   {icon && <div className="text-gray-400 mt-1">{icon}</div>}
//                   {isTextArea ? (
//                     <textarea
//                       value={editValues[field] || ""}
//                       onChange={(e) =>
//                         setEditValues({
//                           ...editValues,
//                           [field]: e.target.value,
//                         })
//                       }
//                       className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 resize-none min-h-[100px]"
//                       placeholder={`Enter ${label.toLowerCase()}...`}
//                       autoFocus
//                     />
//                   ) : (
//                     <input
//                       type="text"
//                       value={editValues[field] || ""}
//                       onChange={(e) =>
//                         setEditValues({
//                           ...editValues,
//                           [field]: e.target.value,
//                         })
//                       }
//                       className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
//                       placeholder={`Enter ${label.toLowerCase()}...`}
//                       autoFocus
//                     />
//                   )}
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

//                 {dragOver && (
//                   <div className="absolute inset-0 flex items-center justify-center bg-blue-50 bg-opacity-90 rounded-lg border-2 border-dashed border-blue-400">
//                     <div className="text-center">
//                       <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
//                       <p className="text-sm text-blue-600 font-medium">
//                         Drop files here
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <p className="text-xs text-gray-500 ml-1">
//                 You can also drag and drop images, PDFs, and documents directly
//                 into the text field above.
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-2">
//               <div className="border-2 border-gray-300 rounded-lg bg-white hover:border-gray-400 transition-colors group">
//                 <div className="flex items-start space-x-2 p-3">
//                   {icon && <div className="text-gray-400 mt-1">{icon}</div>}
//                   <span className="flex-1 text-gray-800 whitespace-pre-wrap">
//                     {formatValue(field, value)}
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

//               {attachments.length > 0 && (
//                 <div className="space-y-2 ml-1">
//                   <p className="text-xs text-gray-500 font-medium">
//                     Attachments ({attachments.length})
//                   </p>
//                   {attachments.map((attachment) => (
//                     <div
//                       key={attachment.id}
//                       className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors"
//                     >
//                       {attachment.type.startsWith("image/") ? (
//                         <Image className="w-4 h-4 text-blue-500" />
//                       ) : (
//                         <FileText className="w-4 h-4 text-gray-500" />
//                       )}
//                       <span className="text-sm text-gray-700 flex-1 truncate">
//                         {attachment.name}
//                       </span>
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
//       <label className="block text-sm font-medium text-gray-700 mb-2">
//         Story Point Estimate
//       </label>
//       <div className="relative">
//         <button
//           onClick={() => setShowStoryPointDropdown(!showStoryPointDropdown)}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <span className="text-gray-800">
//             {task.storyPointEstimate || "10"}
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
//                     (task.storyPointEstimate || 10) === value
//                       ? "bg-blue-100 text-blue-900"
//                       : "text-gray-900"
//                   }`}
//                 >
//                   {value}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}
//         <p className="text-xs text-gray-500 mt-1">
//           Measurement of complexity and/or size of a requirement.
//         </p>
//       </div>
//     </div>
//   );

//   const RiskFlagField = () => (
//     <div className="mb-4">
//       <label className="block text-sm font-medium text-gray-700 mb-2">
//         Risk Flag
//       </label>
//       <button
//         onClick={toggleRiskFlag}
//         className={`w-full px-3 py-2 border-2 rounded-md text-left flex items-center justify-between transition-colors ${
//           task.riskFlag
//             ? "border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
//             : "border-green-300 bg-green-50 text-green-700 hover:bg-green-100"
//         }`}
//       >
//         <div className="flex items-center space-x-2">
//           <AlertTriangle
//             className={`w-4 h-4 ${
//               task.riskFlag ? "text-red-500" : "text-green-500"
//             }`}
//           />
//           <span className="font-medium">
//             {task.riskFlag ? "Risk Present" : "No Risk"}
//           </span>
//         </div>
//         <span className="text-xs opacity-75">Click to toggle</span>
//       </button>
//       <p className="text-xs text-gray-500 mt-1">
//         Indicates whether this task has associated risks.
//       </p>
//     </div>
//   );

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-4 sticky top-0 z-10">
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
//               <div className="text-sm font-semibold text-orange-600 mb-1">
//                 {sprintData.title}
//               </div>
//               <h1 className="text-xl font-bold text-gray-800 flex items-center">
//                 <span className="text-blue-600 mr-2">#{task.id}</span>
//                 {task.title}
//                 {task.completed && (
//                   <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
//                 )}
//                 {task.riskFlag && (
//                   <AlertTriangle className="w-5 h-5 text-red-500 ml-2" />
//                 )}
//               </h1>
//             </div>
//           </div>

//           {/* Three-dot menu */}
//           <div className="relative dropdown-container">
//             <button
//               onClick={handleDropdownToggle}
//               className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//               title="More actions"
//               disabled={isMovingToBacklog}
//             >
//               {isMovingToBacklog ? (
//                 <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//               ) : (
//                 <MoreVertical className="w-5 h-5" />
//               )}
//             </button>

//             {showDropdownMenu && (
//               <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
//                 <div className="py-1">
//                   <button
//                     onClick={handleMoveToBacklog}
//                     disabled={isMovingToBacklog}
//                     className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
//                   >
//                     <ArrowLeft className="w-4 h-4 mr-3 text-blue-500" />
//                     {isMovingToBacklog
//                       ? "Moving to Backlog..."
//                       : "Move to Backlog"}
//                   </button>
//                   <div className="border-t border-gray-100 my-1"></div>
//                   <button
//                     onClick={() => {
//                       setShowDropdownMenu(false);
//                       // Add other actions here if needed
//                     }}
//                     className="flex items-center w-full px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 transition-colors"
//                   >
//                     <Target className="w-4 h-4 mr-3" />
//                     Archive Story
//                   </button>
//                   <button
//                     onClick={() => {
//                       setShowDropdownMenu(false);
//                       // Add clone functionality here if needed
//                     }}
//                     className="flex items-center w-full px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 transition-colors"
//                   >
//                     <Plus className="w-4 h-4 mr-3" />
//                     Clone Story
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Task Details */}
//         <div className="lg:col-span-2">
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <h2 className="text-lg font-semibold text-gray-800 mb-6">
//               Story Details
//             </h2>

//             <StoryPointField />

//             <EditableField
//               label="Story Name"
//               value={task.title}
//               field="title"
//             />

//             <EditableField
//               label="Description"
//               value={task.summary}
//               field="summary"
//               isTextArea={true}
//             />

//             <EditableField
//               label="Acceptance Criteria"
//               value={task.acceptance_criteria}
//               field="acceptance_criteria"
//               icon={<CheckCircle className="w-4 h-4 text-gray-400" />}
//               isTextArea={true}
//             />

//             <EditableField label="Status" value={task.status} field="status" />

//             <EditableField
//               label="Priority"
//               value={task.priority}
//               field="priority"
//               icon={<Star className="w-4 h-4 text-gray-400" />}
//             />

//             <EditableField
//               label="Epic ID"
//               value={task.epic_id}
//               field="epic_id"
//               icon={<Target className="w-4 h-4 text-gray-400" />}
//             />

//             <EditableField
//               label="Story ID"
//               value={task.story_id}
//               field="story_id"
//               icon={<BarChart className="w-4 h-4 text-gray-400" />}
//             />

//             <EditableField
//               label="Estimated Effort (Hours)"
//               value={task.work}
//               field="work"
//               icon={<Clock className="w-4 h-4 text-gray-400" />}
//             />

//             <EditableField
//               label="Assigned To"
//               value={task.assignees}
//               field="assignees"
//               icon={<User className="w-4 h-4 text-gray-400" />}
//             />

//             <EditableField
//               label="Dependencies"
//               value={task.dependencies}
//               field="dependencies"
//             />

//             <EditableField
//               label="Tags/Labels"
//               value={task.tags}
//               field="tags"
//               icon={<Tag className="w-4 h-4 text-gray-400" />}
//             />

//             <RiskFlagField />

//             {/* Comments Section */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
//                 <svg
//                   className="w-4 h-4 mr-2 text-blue-500"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.418 8-9.875 8A9.875 9.875 0 0112 12c0-4.418 4.418-8 9.875-8S21 7.582 21 12z"
//                   />
//                 </svg>
//                 Comments ({(task.comments || []).length})
//               </label>

//               <div className="space-y-3">
//                 {/* Add Comment Form */}
//                 <form
//                   onSubmit={(e) => {
//                     e.preventDefault();
//                     const formData = new FormData(e.target);
//                     const commentText = formData.get("comment");

//                     if (commentText.trim()) {
//                       const comment = {
//                         id: Date.now() + Math.random(),
//                         text: commentText.trim(),
//                         author: "Current User",
//                         timestamp: new Date().toISOString(),
//                         avatar: "CU",
//                       };

//                       const updatedComments = [
//                         ...(task.comments || []),
//                         comment,
//                       ];
//                       onUpdateTask(task.id, "comments", updatedComments);
//                       e.target.reset();
//                     }
//                   }}
//                   className="border border-gray-300 rounded-lg bg-white"
//                 >
//                   <div className="flex items-start space-x-3 p-3">
//                     <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
//                       CU
//                     </div>
//                     <div className="flex-1">
//                       <textarea
//                         name="comment"
//                         placeholder="Add a comment..."
//                         className="w-full bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 resize-none min-h-[80px]"
//                         required
//                       />
//                       <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
//                         <button
//                           type="submit"
//                           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
//                         >
//                           Comment
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </form>

//                 {/* Existing Comments */}
//                 {task.comments && task.comments.length > 0 && (
//                   <div className="space-y-3">
//                     <div className="text-sm font-medium text-gray-600 border-b border-gray-200 pb-2">
//                       Activity
//                     </div>
//                     <div className="space-y-4 max-h-96 overflow-y-auto">
//                       {task.comments.map((comment) => (
//                         <div
//                           key={comment.id}
//                           className="flex items-start space-x-3"
//                         >
//                           <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
//                             {comment.avatar}
//                           </div>
//                           <div className="flex-1">
//                             <div className="bg-gray-50 rounded-lg p-3">
//                               <div className="flex items-center justify-between mb-2">
//                                 <span className="font-medium text-gray-800 text-sm">
//                                   {comment.author}
//                                 </span>
//                                 <span className="text-xs text-gray-500">
//                                   {new Date(comment.timestamp).toLocaleString()}
//                                 </span>
//                               </div>
//                               <p className="text-gray-700 text-sm leading-relaxed">
//                                 {comment.text}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Status and Actions */}
//         <div className="lg:col-span-1">
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <h2 className="text-lg font-semibold text-gray-800 mb-6">
//               Status & Actions
//             </h2>

//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-3">
//                 Current Status
//               </label>
//               <div
//                 className={`${getColumnColor(
//                   task.column
//                 )} rounded-lg p-3 text-center`}
//               >
//                 <span className="font-medium text-gray-800">{task.column}</span>
//               </div>
//             </div>

//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-3">
//                 Move to Column
//               </label>
//               <div className="grid grid-cols-2 gap-2">
//                 {sprintData.columns.map((column) => (
//                   <button
//                     key={column.name}
//                     onClick={() => handleColumnChange(column.name)}
//                     disabled={task.column === column.name}
//                     className={`${
//                       column.color
//                     } rounded-lg p-2 text-sm font-medium transition-colors ${
//                       task.column === column.name
//                         ? "opacity-50 cursor-not-allowed"
//                         : "hover:opacity-80 cursor-pointer"
//                     }`}
//                   >
//                     {column.name}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Move to Backlog Button */}
//             {/* <div className="mb-6">
//                           <button
//                             onClick={handleMoveToBacklog}
//                             disabled={isMovingToBacklog}
//                             className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                           >
//                             {isMovingToBacklog ? (
//                               <>
//                                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                                 <span>Moving to Backlog...</span>
//                               </>
//                             ) : (
//                               <>
//                                 <ArrowLeft className="w-4 h-4" />
//                                 <span>Move to Backlog</span>
//                               </>
//                             )}
//                           </button>
//                           <p className="text-xs text-gray-500 mt-2 text-center">
//                             This will remove the story from the current sprint and add it to the product backlog
//                           </p>
//                         </div> */}

//             <div className="text-xs text-gray-500 space-y-1">
//               <div>Story ID: {task.story_id}</div>
//               <div>Epic ID: {task.epic_id}</div>
//               <div>Story Points: {task.storyPointEstimate || 10}</div>
//               <div>Priority: {task.priority || "Not set"}</div>
//               <div>Status: {task.status || "Not set"}</div>
//               <div>Column: {task.column}</div>
//               <div>Risk Flag: {task.riskFlag ? "⚠️ Yes" : "✅ No"}</div>
//               {task.dependencies && task.dependencies.length > 0 && (
//                 <div>Dependencies: {task.dependencies.length}</div>
//               )}
//               {task.tags && task.tags.length > 0 && (
//                 <div>Tags: {task.tags.length}</div>
//               )}
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
//       { name: "Done", complete: 100, color: "bg-green-100" },
//     ],
//   });

//   const [tasks, setTasks] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [draggedTask, setDraggedTask] = useState(null);
//   const [draggedOver, setDraggedOver] = useState(null);
//   const [selectedTaskId, setSelectedTaskId] = useState(null);
//   const [notification, setNotification] = useState(null);
//   // Listen for backlog events
//   useEffect(() => {
//     const handleBacklogItemAdded = (event) => {
//       const { item, action } = event.detail;
//       setNotification({
//         type: "success",
//         message: `Story "${item.title}" has been ${action} in backlog successfully!`,
//         timestamp: Date.now(),
//       });

//       // Auto-hide notification after 5 seconds
//       setTimeout(() => setNotification(null), 5000);
//     };

//     window.addEventListener("backlogItemAdded", handleBacklogItemAdded);
//     return () =>
//       window.removeEventListener("backlogItemAdded", handleBacklogItemAdded);
//   }, []);

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
//       const sprintName =
//   localStorage.getItem(
//     'selectedSprintName'
//   );


//       if (!sprintInfo) {
//         throw new Error(
//           "No sprint selected. Please select a sprint from Sprint Manager."
//         );
//       }

//       console.log("Fetching data for sprint:", sprintInfo.id);

//       // Fetch specific sprint stories from API
//       // const response = await fetch(`http://127.0.0.1:8000/stories/${sprintInfo.id}`, {
//       const response = await fetch(
//         API_ENDPOINTS.GET_SPRINT_STORIES(sprintInfo.id),
//         {
//           //  const response = await fetch(`https://sprint-backend-73ho.onrender.com/stories/${sprintInfo.id}`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`API Error: ${response.status} ${response.statusText}`);
//       }

//       const data = await response.json();
//       console.log("Fetched sprint stories data:", data);

//       // Update sprint data with the API response
//       if (data.sprint_info) {
//         setSprintData({
//           title: `${data.sprint_info.name} (Current)`,
//           // duration: `${data.sprint_info.start_date} - ${data.sprint_info.end_date}`,
//           duration: `${
//   sprintInfo.startDate || '--'
// } - ${
//   sprintInfo.endDate || '--'
// }`,
//           columns: [
//             { name: "To Do", complete: 0, color: "bg-orange-100" },
//             { name: "In Progress", complete: 50, color: "bg-blue-100" },
//             { name: "Blocked", complete: 0, color: "bg-red-100" },
//             { name: "Done", complete: 100, color: "bg-green-100" },
//           ],
//         });
//       }

//       // Convert API data to tasks format
//       const convertedTasks = [];
//       let taskIdCounter = 1;

//       // Process stories from the API response - the structure matches your API response
//       if (data.stories && Array.isArray(data.stories)) {
//         data.stories.forEach((story) => {
//           // Process stories from the API response
//     convertedTasks.push({
//       id: taskIdCounter++,
//       title: story.name,
//       summary: story.description,
//       acceptance_criteria: story.acceptance_criteria || [],
//       status: story.status,
//       priority: story.priority,
//       work: story.estimated_effort_hours
//         ? `${story.estimated_effort_hours}h`
//         : null,

//       story_id: story.story_id,
//       epic_id: story.epic_id,

//       // ✅ Correct mapping
//       storyPointEstimate: story.story_points ?? 0,

//       // ✅ Column mapping
//       column: story.status || "To Do",

//       completed: story.status === "Done",

//       assignees: story.assigned_to_resource_id
//         ? [story.assigned_to_resource_id]
//         : [],
//       dependencies: story.dependencies || [],
//       tags: story.tags || [],
//       riskFlag: story.risk_flag || false,
//       attachments: {},
//       comments: [],
//       sprint_id: story.sprint_id,
//     });
//   });
// }


//       console.log("Converted tasks:", convertedTasks);
//       setTasks(convertedTasks);

//       if (convertedTasks.length === 0) {
//         console.log("No stories found in API response");
//         setError("No stories found for this sprint");
//       }
//     } catch (error) {
//       console.error("Error fetching sprint data:", error);
//       setError(error.message);
//       setTasks([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Get the selected task from tasks array to ensure we always have the latest data
//   const selectedTask = selectedTaskId
//     ? tasks.find((task) => task.id === selectedTaskId)
//     : null;

//   const getTasksByColumn = (columnName) => {
//     return tasks.filter((task) => task.column === columnName);
//   };

//   const handleDragStart = (e, task) => {
//     setDraggedTask(task);
//     e.dataTransfer.effectAllowed = "move";
//     e.dataTransfer.setData("text/html", e.target.outerHTML);
//     e.dataTransfer.setDragImage(e.target, 0, 0);
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     e.dataTransfer.dropEffect = "move";
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
//       updateTaskField(draggedTask.id, "column", columnName);
//     }
//     setDraggedTask(null);
//   };

//   const updateTaskField = (taskId, field, value) => {
//     const updatedTasks = tasks.map((task) => {
//       if (task.id === taskId) {
//         const updatedTask = { ...task, [field]: value };

//         // Update completion status based on column
//         if (field === "column") {
//           if (value === "Done") {
//             updatedTask.completed = true;
//             updatedTask.status = "Done";
//           } else if (task.completed) {
//             updatedTask.completed = false;
//             updatedTask.status = value;
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
//   const removeTaskFromSprint = (taskId) => {
//     setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
//   };
//   const TaskCard = ({ task }) => {
//     const totalAttachments = task.attachments
//       ? Object.values(task.attachments).flat().length
//       : 0;
    // const [showComments, setShowComments] = useState(false);
    // const [newComment, setNewComment] = useState("");
//     const [showDropdown, setShowDropdown] = useState(false);
//     const lastComment =
//       task.comments && task.comments.length > 0
//         ? task.comments[task.comments.length - 1]
//         : null;

//     const handleCommentSubmit = (e) => {
//       e.preventDefault();
//       e.stopPropagation(); // Prevent card click

//       if (newComment.trim()) {
//         const comment = {
//           id: Date.now() + Math.random(),
//           text: newComment.trim(),
//           author: "Current User", // In real app, get from auth context
//           timestamp: new Date().toISOString(),
//           avatar: "CU", // User initials
//         };

//         const updatedComments = [...(task.comments || []), comment];
//         updateTaskField(task.id, "comments", updatedComments);
//         setNewComment("");
//         setShowComments(false);
//       }
//     };

//     const handleCommentClick = (e) => {
//       e.stopPropagation(); // Prevent card click
//       setShowComments(!showComments);
//     };
//     const handleMoveToBacklog = (e) => {
//       e.stopPropagation(); // Prevent card click
//       setShowDropdown(false);

//       // Add to backlog
//       addToBacklog(task);

//       // Remove from current sprint
//       removeTaskFromSprint(task.id);

//       // Show success notification
//       setNotification({
//         type: "success",
//         message: `Story "${task.title}" moved to backlog successfully!`,
//         timestamp: Date.now(),
//       });

//       setTimeout(() => setNotification(null), 5000);
//     };

//     return (
//       <div
//         draggable
//         onDragStart={(e) => handleDragStart(e, task)}
//         onClick={() => handleTaskClick(task)}
//         className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 hover:shadow-md transition-shadow cursor-pointer ${
//           draggedTask && draggedTask.id === task.id ? "opacity-50" : ""
//         }`}
//       >
//         {/* Card Header */}
//         <div className="flex items-start justify-between mb-3">
//           <div className="flex items-center space-x-2">
//             {task.storyPointEstimate && (
//               <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
//                 {task.storyPointEstimate} SP
//               </span>
//             )}
//             <span className="text-sm font-medium text-gray-600">
//               #{task.story_id}
//             </span>
//             {task.completed && (
//               <CheckCircle className="w-4 h-4 text-green-500" />
//             )}
//             {task.riskFlag && (
//               <AlertTriangle className="w-4 h-4 text-red-500" />
//             )}
//             {totalAttachments > 0 && (
//               <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded flex items-center">
//                 <Upload className="w-3 h-3 mr-1" />
//                 {totalAttachments}
//               </span>
//             )}
//           </div>
//           <div className="flex items-center space-x-1">
//             {task.priority && (
//               <span
//                 className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//                   task.priority === "High"
//                     ? "bg-red-100 text-red-800"
//                     : task.priority === "Medium"
//                     ? "bg-yellow-100 text-yellow-800"
//                     : "bg-green-100 text-green-800"
//                 }`}
//               >
//                 {task.priority}
//               </span>
//             )}
//             {/* Quick Action Menu */}
//             <div className="relative">
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setShowDropdown(!showDropdown);
//                 }}
//                 className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
//               >
//                 <MoreVertical className="w-3 h-3" />
//               </button>

//               {showDropdown && (
//                 <div className="absolute right-0 top-6 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-10">
//                   <div className="py-1">
//                     <button
//                       onClick={handleMoveToBacklog}
//                       className="flex items-center w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
//                     >
//                       <ArrowLeft className="w-3 h-3 mr-2 text-purple-500" />
//                       Move to Backlog
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Story Title */}
//         {task.title && (
//           <div className="mb-3">
//             <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
//               {task.title}
//             </h3>
//           </div>
//         )}

//         {/* Story Description */}
//         {task.summary && (
//           <div className="mb-3">
//             <p className="text-xs text-gray-600 line-clamp-3">{task.summary}</p>
//           </div>
//         )}

//         {/* Story Details */}
//         <div className="space-y-2 mb-3">
//           <div className="flex items-center justify-between text-xs text-gray-500">
//             {task.story_id && (
//               <span>
//                 <strong>Story ID:</strong> {task.story_id}
//               </span>
//             )}
//             {task.epic_id && (
//               <span>
//                 <strong>Epic:</strong> {task.epic_id}
//               </span>
//             )}
//           </div>

//           <div className="flex items-center justify-between text-xs text-gray-500">
//             {task.work && (
//               <span>
//                 <strong>Effort:</strong> {task.work}
//               </span>
//             )}
//             {task.status && (
//               <span>
//                 <strong>Status:</strong>
//                 <span
//                   className={`ml-1 font-medium ${
//                     task.status === "Done"
//                       ? "text-green-600"
//                       : task.status === "In Progress"
//                       ? "text-blue-600"
//                       : task.status === "Blocked"
//                       ? "text-red-600"
//                       : "text-gray-600"
//                   }`}
//                 >
//                   {task.status}
//                 </span>
//               </span>
//             )}
//           </div>

//           {/* Acceptance Criteria Count */}
//           {task.acceptance_criteria && task.acceptance_criteria.length > 0 && (
//             <div className="flex items-center text-xs text-gray-500">
//               <CheckCircle className="w-3 h-3 mr-1" />
//               <span>{task.acceptance_criteria.length} acceptance criteria</span>
//             </div>
//           )}

//           {/* Dependencies */}
//           {task.dependencies && task.dependencies.length > 0 && (
//             <div className="flex items-center text-xs text-red-500">
//               <AlertTriangle className="w-3 h-3 mr-1" />
//               <span>{task.dependencies.length} dependencies</span>
//             </div>
//           )}
//         </div>

//         {/* Tags */}
//         {task.tags && task.tags.length > 0 && (
//           <div className="flex flex-wrap gap-1 mb-3">
//             {task.tags.slice(0, 2).map((tag, index) => (
//               <span
//                 key={index}
//                 className={`px-2 py-1 rounded text-xs font-medium ${
//                   tag.toLowerCase() === "bug"
//                     ? "bg-red-100 text-red-700"
//                     : tag.toLowerCase() === "feature"
//                     ? "bg-blue-100 text-blue-700"
//                     : tag.toLowerCase() === "enhancement"
//                     ? "bg-purple-100 text-purple-700"
//                     : "bg-gray-100 text-gray-700"
//                 }`}
//               >
//                 {tag}
//               </span>
//             ))}
//             {task.tags.length > 2 && (
//               <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
//                 +{task.tags.length - 2}
//               </span>
//             )}
//           </div>
//         )}

//         {/* Assignee */}
//         {task.assignees && task.assignees.length > 0 && (
//           <div className="pt-2 border-t border-gray-100">
//             <div className="flex items-center text-xs text-gray-600">
//               <User className="w-3 h-3 mr-1" />
//               <span className="truncate">{task.assignees.join(", ")}</span>
//             </div>
//           </div>
//         )}

//         {/* Comments Section */}
//         <div className="mt-3 pt-3 border-t border-gray-100">
//           <div className="flex items-center justify-between">
//             <button
//               onClick={handleCommentClick}
//               className="flex items-center text-xs text-gray-500 hover:text-blue-600 transition-colors"
//             >
//               <svg
//                 className="w-3 h-3 mr-1"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.418 8-9.875 8A9.875 9.875 0 0112 12c0-4.418 4.418-8 9.875-8S21 7.582 21 12z"
//                 />
//               </svg>
//               Comment ({(task.comments || []).length})
//             </button>

//             {lastComment && (
//               <div className="flex items-center text-xs text-gray-400">
//                 <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] mr-1">
//                   {lastComment.avatar}
//                 </div>
//                 <span className="truncate max-w-20">"{lastComment.text}"</span>
//               </div>
//             )}
//           </div>

//           {/* Comment Input */}
//           {showComments && (
//             <form
//               onSubmit={handleCommentSubmit}
//               className="mt-2"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex items-start space-x-2">
//                 <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
//                   CU
//                 </div>
//                 <div className="flex-1">
//                   <textarea
//                     value={newComment}
//                     onChange={(e) => setNewComment(e.target.value)}
//                     placeholder="Add a comment..."
//                     className="w-full text-xs border border-gray-300 rounded-md p-2 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     rows="2"
//                     autoFocus
//                   />
//                   <div className="flex items-center justify-end space-x-2 mt-1">
//                     <button
//                       type="button"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setShowComments(false);
//                         setNewComment("");
//                       }}
//                       className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       disabled={!newComment.trim()}
//                       className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       Save
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Existing Comments */}
//               {task.comments && task.comments.length > 0 && (
//                 <div className="mt-3 space-y-2 max-h-32 overflow-y-auto">
//                   {task.comments.map((comment) => (
//                     <div
//                       key={comment.id}
//                       className="flex items-start space-x-2 text-xs"
//                     >
//                       <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center text-white text-[10px]">
//                         {comment.avatar}
//                       </div>
//                       <div className="flex-1">
//                         <div className="flex items-center space-x-2">
//                           <span className="font-medium text-gray-700">
//                             {comment.author}
//                           </span>
//                           <span className="text-gray-400">
//                             {new Date(comment.timestamp).toLocaleDateString()}
//                           </span>
//                         </div>
//                         <p className="text-gray-600 mt-1">{comment.text}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </form>
//           )}
//         </div>
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
//       {/* Notification */}
//       {notification && (
//         <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2">
//           <CheckCircle className="w-5 h-5 text-green-600" />
//           <span className="text-sm font-medium">{notification.message}</span>
//           <button
//             onClick={() => setNotification(null)}
//             className="ml-2 text-green-600 hover:text-green-800"
//           >
//             <X className="w-4 h-4" />
//           </button>
//         </div>
//       )}

//       {/* Error Display */}
//       {error && (
//         <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
//           <div className="flex items-center">
//             <svg
//               className="w-5 h-5 text-red-500 mr-2"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//               />
//             </svg>
//             <span className="text-red-700 text-sm">
//               Error loading sprint: {error}
//             </span>
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
//       <div className="bg-white rounded-lg shadow-sm border-2 border-orange-400 mb-6 p-4 sticky top-0 z-10">
//         <div className="flex items-center justify-between">
//           {/* <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center"> */}
//           <img src={pmrgLogo} alt="PMRG Logo" className="w-50 h-30" />
//           {/* </div> */}
//           <div>
//           <div className="text-sm font-semibold text-gray-500 mb-1">
//             {sprintData.title}
//           </div>
            
//              <h1 className="text-xl font-bold text-orange-600 mb-1">
//               Current Sprint
//             </h1>
//             <p className="text-gray-600 text-sm">{sprintData.duration}</p>
//           </div>
//           <div className="flex items-center space-x-4">
//             <div className="text-sm text-gray-600">
//               <span className="font-medium">{tasks.length}</span> stories total
//             </div>
//             <div className="text-sm text-gray-600">
//               <span className="font-medium">
//                 {tasks.reduce(
//                   (sum, task) => sum + (task.storyPointEstimate || 0),
//                   0
//                 )}
//               </span>{" "}
//               story points
//             </div>
//             {/* <button 
//               onClick={fetchSprintData}
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
//             >
//               Refresh
//             </button> */}
//           </div>
//         </div>
//       </div>

//       {/* Sprint Stats */}
//       <div className="grid grid-cols-4 gap-4 mb-6">
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Stories</p>
//               <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
//             </div>
//             <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//               <BarChart className="w-5 h-5 text-blue-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Story Points</p>
//               <p className="text-2xl font-bold text-gray-900">
//                 {tasks.reduce(
//                   (sum, task) => sum + (task.storyPointEstimate || 0),
//                   0
//                 ) || 0}
//               </p>
//             </div>
//             <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
//               <Star className="w-5 h-5 text-purple-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Completed</p>
//               <p className="text-2xl font-bold text-green-600">
//                 {tasks.filter((task) => task.completed).length}
//               </p>
//             </div>
//             <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
//               <CheckCircle className="w-5 h-5 text-green-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Progress</p>
//               <p className="text-2xl font-bold text-indigo-600">
//                 {tasks.length > 0
//                   ? Math.round(
//                       (tasks.filter((task) => task.completed).length /
//                         tasks.length) *
//                         100
//                     )
//                   : 0}
//                 %
//               </p>
//             </div>
//             <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
//               <Target className="w-5 h-5 text-indigo-600" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Kanban Board */}
//       <div className="grid grid-cols-4 gap-4 overflow-x-auto">
//         {sprintData.columns.map((column, index) => (
//           <div
//             key={`${column.name}-${index}`}
//             className={`${
//               column.color
//             } rounded-lg shadow-sm min-h-96 transition-all duration-200 ${
//               draggedOver === column.name
//                 ? "ring-2 ring-blue-400 ring-opacity-50 transform scale-105"
//                 : ""
//             }`}
//             onDragOver={handleDragOver}
//             onDragEnter={(e) => handleDragEnter(e, column.name)}
//             onDragLeave={handleDragLeave}
//             onDrop={(e) => handleDrop(e, column.name)}
//           >
//             {/* Column Header */}
//             <div className="p-4 border-b border-gray-200">
//               <div className="flex items-center justify-between">
//                 <h3 className="font-semibold text-gray-800 mb-1">
//                   {column.name}
//                 </h3>
//                 <span className="text-sm text-gray-600 bg-white bg-opacity-50 px-2 py-1 rounded">
//                   {getTasksByColumn(column.name).length}
//                 </span>
//               </div>
//               <p className="text-xs text-gray-600">
//                 {getTasksByColumn(column.name).reduce(
//                   (sum, task) => sum + (task.storyPointEstimate || 0),
//                   0
//                 )}{" "}
//                 story points
//               </p>
//             </div>

//             {/* Column Content */}
//             <div className="p-4">
//               {/* {column.name === "To Do" && (
//                 <button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-md p-3 mb-4 flex items-center justify-center text-sm font-medium transition-colors">
//                   <Plus className="w-4 h-4 mr-2" />
//                   New Story
//                 </button>
//               )} */}

//               {/* Tasks */}
//               <div className="space-y-3">
//                 {getTasksByColumn(column.name).map((task) => (
//                   <TaskCard key={task.id} task={task} />
//                 ))}
//               </div>

//               {/* Empty State */}
//               {getTasksByColumn(column.name).length === 0 && (
//                 <div className="text-center text-gray-500 text-sm py-8">
//                   <div className="text-gray-400 mb-2">No stories</div>
//                   {draggedOver === column.name ? (
//                     <div className="text-blue-600 font-medium">
//                       Drop story here
//                     </div>
//                   ) : (
//                     <div>Drag stories here</div>
//                   )}
//                 </div>
//               )}

//               {/* Drop Zone Indicator */}
//               {draggedOver === column.name &&
//                 getTasksByColumn(column.name).length > 0 && (
//                   <div className="border-2 border-dashed border-blue-400 rounded-lg p-4 text-center text-blue-600 bg-blue-50 mt-3">
//                     Drop story here
//                   </div>
//                 )}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Sprint Summary */}
//       <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">
//             Sprint Breakdown
//           </h3>
//           <div className="space-y-3">
//             {sprintData.columns.map((column) => {
//               const columnTasks = getTasksByColumn(column.name);
//               const columnPoints = columnTasks.reduce(
//                 (sum, task) => sum + (task.storyPointEstimate || 0),
//                 0
//               );
//               return (
//                 <div
//                   key={column.name}
//                   className="flex items-center justify-between"
//                 >
//                   <div className="flex items-center space-x-2">
//                     <div
//                       className={`w-3 h-3 rounded-full ${column.color
//                         .replace("bg-", "bg-")
//                         .replace("-100", "-500")}`}
//                     ></div>
//                     <span className="text-sm font-medium text-gray-700">
//                       {column.name}
//                     </span>
//                   </div>
//                   <div className="text-sm text-gray-600">
//                     {columnTasks.length} stories • {columnPoints} points
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">
//             Story Analysis
//           </h3>
//           <div className="space-y-3">
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-gray-600">High Priority</span>
//               <span className="text-sm font-medium text-red-600">
//                 {tasks.filter((t) => t.priority === "High").length} stories
//               </span>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-gray-600">Medium Priority</span>
//               <span className="text-sm font-medium text-yellow-600">
//                 {tasks.filter((t) => t.priority === "Medium").length} stories
//               </span>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-gray-600">Low Priority</span>
//               <span className="text-sm font-medium text-green-600">
//                 {tasks.filter((t) => t.priority === "Low").length} stories
//               </span>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-gray-600">With Dependencies</span>
//               <span className="text-sm font-medium text-orange-600">
//                 {
//                   tasks.filter(
//                     (t) => t.dependencies && t.dependencies.length > 0
//                   ).length
//                 }{" "}
//                 stories
//               </span>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-gray-600">
//                 With Acceptance Criteria
//               </span>
//               <span className="text-sm font-medium text-blue-600">
//                 {
//                   tasks.filter(
//                     (t) =>
//                       t.acceptance_criteria && t.acceptance_criteria.length > 0
//                   ).length
//                 }{" "}
//                 stories
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Debug Panel - Shows actual API data for troubleshooting */}
//       {/* <div className="mt-6 p-4 bg-gray-100 rounded-lg">
//         <h3 className="text-sm font-medium text-gray-700 mb-2">Debug: Sprint Data</h3>
//         <div className="text-xs text-gray-600 bg-white p-2 rounded border">
//           <div>Stories loaded: {tasks.length}</div>
//           <div>To Do: {getTasksByColumn('To Do').length}</div>
//           <div>In Progress: {getTasksByColumn('In Progress').length}</div>
//           <div>Blocked: {getTasksByColumn('Blocked').length}</div>
//           <div>Done: {getTasksByColumn('Done').length}</div>
//           <div>Total Story Points: {tasks.reduce((sum, task) => sum + (task.storyPointEstimate || 0), 0)}</div>
//           <div>Stories with acceptance criteria: {tasks.filter(t => t.acceptance_criteria && t.acceptance_criteria.length > 0).length}</div>
//           {tasks.length > 0 && (
//             <div className="mt-2">
//               <div>Sample task data: {JSON.stringify(tasks[0], null, 2)}</div>
//             </div>
//           )}
//         </div>
//       </div> */}
//     </div>
//   );
// };

// export default SprintBoard;



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Users,
  Clock,
  Calendar,
  CheckCircle,
  ArrowLeft,
  Edit2,
  Save,
  X,
  ChevronDown,
  Upload,
  Image,
  FileText,
  AlertTriangle,
  Tag,
  Star,
  Target,
  BarChart,
  User,
  MoreVertical,
  MessageCircle,
} from "lucide-react";
import pmrgLogo from "../src/assets/pmrglogo.png";
import API_ENDPOINTS from "./Auths";
// import API_ENDPOINTS from './components/apis/Auths';
// Utility functions for localStorage management
const getBacklogItems = () => {
  const items = localStorage.getItem("backlogItems");
  return items ? JSON.parse(items) : [];
};

const setBacklogItems = (items) => {
  localStorage.setItem("backlogItems", JSON.stringify(items));
};

const addToBacklog = (task) => {
  const existingItems = getBacklogItems();

  // Convert sprint task to backlog item format
  const backlogItem = {
    id: task.story_id || task.id,
    title: task.title,
    description: task.summary || task.description,
    priority: task.priority || "Medium",
    storyPoints: task.storyPointEstimate || 0,
    epic: task.epic_id || "Unassigned",
    status: "Moved from Sprint",
    assignee: Array.isArray(task.assignees)
      ? task.assignees.join(", ")
      : task.assignees || "Unassigned",
    estimatedHours: parseInt(task.work?.replace("h", "")) || 0,
    tags: task.tags || [],
    acceptanceCriteria: task.acceptance_criteria || [],
    createdDate: new Date().toISOString().split("T")[0],
    lastModified: new Date().toISOString().split("T")[0],
    businessValue: task.priority || "Medium",
    riskFlag: task.riskFlag || false,
    dependencies: task.dependencies || [],
    attachments: task.attachments
      ? Object.values(task.attachments).flat().length
      : 0,
    movedFromSprint: true,
    originalSprintId: task.sprint_id,
    comments: task.comments || [],
  };

  // Check if item already exists in backlog
  const existingIndex = existingItems.findIndex(
    (item) => item.id === backlogItem.id
  );

  if (existingIndex !== -1) {
    // Update existing item
    existingItems[existingIndex] = {
      ...existingItems[existingIndex],
      ...backlogItem,
    };
  } else {
    // Add new item
    existingItems.unshift(backlogItem); // Add to beginning of array
  }

  setBacklogItems(existingItems);

  // Show success notification
  const event = new CustomEvent("backlogItemAdded", {
    detail: {
      item: backlogItem,
      action: existingIndex !== -1 ? "updated" : "added",
    },
  });
  window.dispatchEvent(event);
};

// TaskDetail Component - Separate page for task details
const TaskDetail = ({ task, onBack, onUpdateTask, sprintData }) => {
  const navigate = useNavigate();
  const [editingField, setEditingField] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [showStoryPointDropdown, setShowStoryPointDropdown] = useState(false);
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const [isMovingToBacklog, setIsMovingToBacklog] = useState(false);
  const fibonacciValues = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

  const startEditing = (field, value) => {
    if (field === "storyPointEstimate") {
      setShowStoryPointDropdown(true);
      return;
    }

    setEditingField(field);
    if (field === "assignees") {
      setEditValues({ [field]: value ? value.join(", ") : "" });
    } else if (field === "tags") {
      setEditValues({ [field]: value ? value.join(", ") : "" });
    } else if (field === "dependencies") {
      setEditValues({ [field]: value ? value.join(", ") : "" });
    } else if (field === "acceptance_criteria") {
      setEditValues({
        [field]: Array.isArray(value) ? value.join("\n") : value || "",
      });
    } else {
      setEditValues({ [field]: value || "" });
    }
  };

  const saveEdit = () => {
    if (!editingField || !task) return;

    let newValue = editValues[editingField];
    if (
      editingField === "assignees" ||
      editingField === "tags" ||
      editingField === "dependencies"
    ) {
      newValue = newValue
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item);
    } else if (editingField === "acceptance_criteria") {
      newValue = newValue
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item);
    }

    onUpdateTask(task.id, editingField, newValue);
    setEditingField(null);
    setEditValues({});
  };

  const handleStoryPointSelect = (value) => {
    onUpdateTask(task.id, "storyPointEstimate", value);
    setShowStoryPointDropdown(false);
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValues({});
    setShowStoryPointDropdown(false);
  };

  const handleColumnChange = (newColumn) => {
    onUpdateTask(task.id, "column", newColumn);
  };

  const toggleRiskFlag = () => {
    onUpdateTask(task.id, "riskFlag", !task.riskFlag);
  };

  const getColumnColor = (columnName) => {
    const column = sprintData.columns.find((col) => col.name === columnName);
    return column ? column.color : "bg-gray-100";
  };

  const handleMoveToBacklog = async () => {
    setIsMovingToBacklog(true);
    setShowDropdownMenu(false);

    try {
      // Add task to backlog
      addToBacklog(task);

      // Show success message
      alert(`Story "${task.title}" has been moved to backlog successfully!`);

      // Navigate to backlog page
      navigate("/backlog");
    } catch (error) {
      console.error("Error moving to backlog:", error);
      alert("Failed to move story to backlog. Please try again.");
    } finally {
      setIsMovingToBacklog(false);
    }
  };

  const handleDropdownToggle = () => {
    setShowDropdownMenu(!showDropdownMenu);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setShowDropdownMenu(false);
      }
    };

    if (showDropdownMenu) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showDropdownMenu]);

  const EditableField = ({ label, value, field, icon, isTextArea = false }) => {
    const [dragOver, setDragOver] = useState(false);
    const [attachments, setAttachments] = useState(
      task.attachments?.[field] || []
    );

    const handleFileUpload = (files) => {
      const newAttachments = Array.from(files).map((file) => ({
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
      }));

      const updatedAttachments = [...attachments, ...newAttachments];
      setAttachments(updatedAttachments);

      // Update task with new attachments
      const taskAttachments = {
        ...task.attachments,
        [field]: updatedAttachments,
      };
      onUpdateTask(task.id, "attachments", taskAttachments);
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
      const updatedAttachments = attachments.filter(
        (att) => att.id !== attachmentId
      );
      setAttachments(updatedAttachments);
      const taskAttachments = {
        ...task.attachments,
        [field]: updatedAttachments,
      };
      onUpdateTask(task.id, "attachments", taskAttachments);
    };

    const formatValue = (field, value) => {
      if (
        field === "assignees" ||
        field === "tags" ||
        field === "dependencies"
      ) {
        return value && value.length > 0 ? value.join(", ") : "None";
      } else if (field === "acceptance_criteria") {
        return Array.isArray(value) && value.length > 0
          ? value.join("\n")
          : "No criteria defined";
      }
      return value || "Not set";
    };

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="space-y-2">
          {editingField === field ? (
            <div className="space-y-3">
              <div
                className={`relative border-2 rounded-lg transition-colors ${
                  dragOver
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 bg-white"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <div className="flex items-start space-x-2 p-3">
                  {icon && <div className="text-gray-400 mt-1">{icon}</div>}
                  {isTextArea ? (
                    <textarea
                      value={editValues[field] || ""}
                      onChange={(e) =>
                        setEditValues({
                          ...editValues,
                          [field]: e.target.value,
                        })
                      }
                      className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 resize-none min-h-[100px]"
                      placeholder={`Enter ${label.toLowerCase()}...`}
                      autoFocus
                    />
                  ) : (
                    <input
                      type="text"
                      value={editValues[field] || ""}
                      onChange={(e) =>
                        setEditValues({
                          ...editValues,
                          [field]: e.target.value,
                        })
                      }
                      className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
                      placeholder={`Enter ${label.toLowerCase()}...`}
                      autoFocus
                    />
                  )}
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

                {dragOver && (
                  <div className="absolute inset-0 flex items-center justify-center bg-blue-50 bg-opacity-90 rounded-lg border-2 border-dashed border-blue-400">
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-sm text-blue-600 font-medium">
                        Drop files here
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-500 ml-1">
                You can also drag and drop images, PDFs, and documents directly
                into the text field above.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="border-2 border-gray-300 rounded-lg bg-white hover:border-gray-400 transition-colors group">
                <div className="flex items-start space-x-2 p-3">
                  {icon && <div className="text-gray-400 mt-1">{icon}</div>}
                  <span className="flex-1 text-gray-800 whitespace-pre-wrap">
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

              {attachments.length > 0 && (
                <div className="space-y-2 ml-1">
                  <p className="text-xs text-gray-500 font-medium">
                    Attachments ({attachments.length})
                  </p>
                  {attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      {attachment.type.startsWith("image/") ? (
                        <Image className="w-4 h-4 text-blue-500" />
                      ) : (
                        <FileText className="w-4 h-4 text-gray-500" />
                      )}
                      <span className="text-sm text-gray-700 flex-1 truncate">
                        {attachment.name}
                      </span>
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
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Story Point Estimate
      </label>
      <div className="relative">
        <button
          onClick={() => setShowStoryPointDropdown(!showStoryPointDropdown)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span className="text-gray-800">
            {task.storyPointEstimate || "10"}
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
                    (task.storyPointEstimate || 10) === value
                      ? "bg-blue-100 text-blue-900"
                      : "text-gray-900"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Measurement of complexity and/or size of a requirement.
        </p>
      </div>
    </div>
  );

  const RiskFlagField = () => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Risk Flag
      </label>
      <button
        onClick={toggleRiskFlag}
        className={`w-full px-3 py-2 border-2 rounded-md text-left flex items-center justify-between transition-colors ${
          task.riskFlag
            ? "border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
            : "border-green-300 bg-green-50 text-green-700 hover:bg-green-100"
        }`}
      >
        <div className="flex items-center space-x-2">
          <AlertTriangle
            className={`w-4 h-4 ${
              task.riskFlag ? "text-red-500" : "text-green-500"
            }`}
          />
          <span className="font-medium">
            {task.riskFlag ? "Risk Present" : "No Risk"}
          </span>
        </div>
        <span className="text-xs opacity-75">Click to toggle</span>
      </button>
      <p className="text-xs text-gray-500 mt-1">
        Indicates whether this task has associated risks.
      </p>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-4 sticky top-0 z-10">
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
              <div className="text-sm font-semibold text-orange-600 mb-1">
                {sprintData.title}
              </div>
              <h1 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="text-blue-600 mr-2">#{task.id}</span>
                {task.title}
                {task.completed && (
                  <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                )}
                {task.riskFlag && (
                  <AlertTriangle className="w-5 h-5 text-red-500 ml-2" />
                )}
              </h1>
            </div>
          </div>

          {/* Three-dot menu */}
          <div className="relative dropdown-container">
            <button
              onClick={handleDropdownToggle}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="More actions"
              disabled={isMovingToBacklog}
            >
              {isMovingToBacklog ? (
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <MoreVertical className="w-5 h-5" />
              )}
            </button>

            {showDropdownMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <button
                    onClick={handleMoveToBacklog}
                    disabled={isMovingToBacklog}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-3 text-blue-500" />
                    {isMovingToBacklog
                      ? "Moving to Backlog..."
                      : "Move to Backlog"}
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={() => {
                      setShowDropdownMenu(false);
                      // Add other actions here if needed
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    <Target className="w-4 h-4 mr-3" />
                    Archive Story
                  </button>
                  <button
                    onClick={() => {
                      setShowDropdownMenu(false);
                      // Add clone functionality here if needed
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-3" />
                    Clone Story
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              Story Details
            </h2>

            <StoryPointField />

            <EditableField
              label="Story Name"
              value={task.title}
              field="title"
            />

            <EditableField
              label="Description"
              value={task.summary}
              field="summary"
              isTextArea={true}
            />

            <EditableField
              label="Acceptance Criteria"
              value={task.acceptance_criteria}
              field="acceptance_criteria"
              icon={<CheckCircle className="w-4 h-4 text-gray-400" />}
              isTextArea={true}
            />

            <EditableField label="Status" value={task.status} field="status" />

            <EditableField
              label="Priority"
              value={task.priority}
              field="priority"
              icon={<Star className="w-4 h-4 text-gray-400" />}
            />

            <EditableField
              label="Epic ID"
              value={task.epic_id}
              field="epic_id"
              icon={<Target className="w-4 h-4 text-gray-400" />}
            />

            <EditableField
              label="Story ID"
              value={task.story_id}
              field="story_id"
              icon={<BarChart className="w-4 h-4 text-gray-400" />}
            />

            <EditableField
              label="Estimated Effort (Hours)"
              value={task.work}
              field="work"
              icon={<Clock className="w-4 h-4 text-gray-400" />}
            />

            <EditableField
              label="Assigned To"
              value={task.assignees}
              field="assignees"
              icon={<User className="w-4 h-4 text-gray-400" />}
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

            {/* Comments Section */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.418 8-9.875 8A9.875 9.875 0 0112 12c0-4.418 4.418-8 9.875-8S21 7.582 21 12z"
                  />
                </svg>
                Comments ({(task.comments || []).length})
              </label>

              <div className="space-y-3">
                {/* Add Comment Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const commentText = formData.get("comment");

                    if (commentText.trim()) {
                      const comment = {
                        id: Date.now() + Math.random(),
                        text: commentText.trim(),
                        author: "Current User",
                        timestamp: new Date().toISOString(),
                        avatar: "CU",
                      };

                      const updatedComments = [
                        ...(task.comments || []),
                        comment,
                      ];
                      onUpdateTask(task.id, "comments", updatedComments);
                      e.target.reset();
                    }
                  }}
                  className="border border-gray-300 rounded-lg bg-white"
                >
                  <div className="flex items-start space-x-3 p-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      CU
                    </div>
                    <div className="flex-1">
                      <textarea
                        name="comment"
                        placeholder="Add a comment..."
                        className="w-full bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 resize-none min-h-[80px]"
                        required
                      />
                      <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                {/* Existing Comments */}
                {task.comments && task.comments.length > 0 && (
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-gray-600 border-b border-gray-200 pb-2">
                      Activity
                    </div>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {task.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="flex items-start space-x-3"
                        >
                          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {comment.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-800 text-sm">
                                  {comment.author}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(comment.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-gray-700 text-sm leading-relaxed">
                                {comment.text}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status and Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              Status & Actions
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Current Status
              </label>
              <div
                className={`${getColumnColor(
                  task.column
                )} rounded-lg p-3 text-center`}
              >
                <span className="font-medium text-gray-800">{task.column}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Move to Column
              </label>
              <div className="grid grid-cols-2 gap-2">
                {sprintData.columns.map((column) => (
                  <button
                    key={column.name}
                    onClick={() => handleColumnChange(column.name)}
                    disabled={task.column === column.name}
                    className={`${
                      column.color
                    } rounded-lg p-2 text-sm font-medium transition-colors ${
                      task.column === column.name
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:opacity-80 cursor-pointer"
                    }`}
                  >
                    {column.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Move to Backlog Button */}
            {/* <div className="mb-6">
                          <button
                            onClick={handleMoveToBacklog}
                            disabled={isMovingToBacklog}
                            className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isMovingToBacklog ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Moving to Backlog...</span>
                              </>
                            ) : (
                              <>
                                <ArrowLeft className="w-4 h-4" />
                                <span>Move to Backlog</span>
                              </>
                            )}
                          </button>
                          <p className="text-xs text-gray-500 mt-2 text-center">
                            This will remove the story from the current sprint and add it to the product backlog
                          </p>
                        </div> */}

            <div className="text-xs text-gray-500 space-y-1">
              <div>Story ID: {task.story_id}</div>
              <div>Epic ID: {task.epic_id}</div>
              <div>Story Points: {task.storyPointEstimate || 10}</div>
              <div>Priority: {task.priority || "Not set"}</div>
              <div>Status: {task.status || "Not set"}</div>
              <div>Column: {task.column}</div>
              <div>Risk Flag: {task.riskFlag ? "⚠️ Yes" : "✅ No"}</div>
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
      { name: "Done", complete: 100, color: "bg-green-100" },
    ],
  });

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedOver, setDraggedOver] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [notification, setNotification] = useState(null);
  // Listen for backlog events
  useEffect(() => {
    const handleBacklogItemAdded = (event) => {
      const { item, action } = event.detail;
      setNotification({
        type: "success",
        message: `Story "${item.title}" has been ${action} in backlog successfully!`,
        timestamp: Date.now(),
      });

      // Auto-hide notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
    };

    window.addEventListener("backlogItemAdded", handleBacklogItemAdded);
    return () =>
      window.removeEventListener("backlogItemAdded", handleBacklogItemAdded);
  }, []);

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
      const sprintName =
  localStorage.getItem(
    'selectedSprintName'
  );


      if (!sprintInfo) {
        throw new Error(
          "No sprint selected. Please select a sprint from Sprint Manager."
        );
      }

      console.log("Fetching data for sprint:", sprintInfo.id);

      // Fetch specific sprint stories from API
      // const response = await fetch(`http://127.0.0.1:8000/stories/${sprintInfo.id}`, {
      const response = await fetch(
        API_ENDPOINTS.GET_SPRINT_STORIES(sprintInfo.id),
        {
          //  const response = await fetch(`https://sprint-backend-73ho.onrender.com/stories/${sprintInfo.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Fetched sprint stories data:", data);

      // Update sprint data with the API response
      if (data.sprint_info) {
        setSprintData({
          title: `${data.sprint_info.name} (Current)`,
          // duration: `${data.sprint_info.start_date} - ${data.sprint_info.end_date}`,
          duration: `${
  sprintInfo.startDate || '--'
} - ${
  sprintInfo.endDate || '--'
}`,
          columns: [
            { name: "To Do", complete: 0, color: "bg-orange-100" },
            { name: "In Progress", complete: 50, color: "bg-blue-100" },
            { name: "Blocked", complete: 0, color: "bg-red-100" },
            { name: "Done", complete: 100, color: "bg-green-100" },
          ],
        });
      }

      // Convert API data to tasks format
const convertedTasks = [];
let taskIdCounter = 1;

// Process stories from the API response
if (data.stories && Array.isArray(data.stories)) {

  data.stories.forEach((story) => {

    // ============================================
    // SPRINT STATUS → BOARD STATUS
    // ============================================

    let sprintBoardStatus = "To Do";

    if (sprintInfo.status === "Completed") {

      sprintBoardStatus = "Done";

    } else if (
      sprintInfo.status === "In Progress"
    ) {

      sprintBoardStatus = "In Progress";

    } else if (
      sprintInfo.status === "Blocked"
    ) {

      sprintBoardStatus = "Blocked";

    } else if (
      sprintInfo.status === "Paused"
    ) {

      sprintBoardStatus = "Blocked";
    }

    // ============================================
    // PUSH TASK
    // ============================================

    convertedTasks.push({

      id: taskIdCounter++,

      title: story.name,

      summary: story.description,

      acceptance_criteria:
        story.acceptance_criteria || [],

      // ✅ UPDATED STATUS
      status: sprintBoardStatus,

      priority: story.priority,

      work: story.estimated_effort_hours
        ? `${story.estimated_effort_hours}h`
        : null,

      story_id: story.story_id,

      epic_id: story.epic_id,

      storyPointEstimate:
        story.story_points ?? 0,

      // ✅ UPDATED COLUMN
      column: sprintBoardStatus,

      completed:
        sprintBoardStatus === "Done",

      assignees:
        story.assigned_to_resource_id
          ? [story.assigned_to_resource_id]
          : [],

      dependencies:
        story.dependencies || [],

      tags:
        story.tags || [],

      riskFlag:
        story.risk_flag || false,

      attachments: {},

      comments: [],

      sprint_id: story.sprint_id,
    });

  });

}

      console.log("Converted tasks:", convertedTasks);
      setTasks(convertedTasks);

      if (convertedTasks.length === 0) {
        console.log("No stories found in API response");
        setError("No stories found for this sprint");
      }
    } catch (error) {
      console.error("Error fetching sprint data:", error);
      setError(error.message);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Get the selected task from tasks array to ensure we always have the latest data
  const selectedTask = selectedTaskId
    ? tasks.find((task) => task.id === selectedTaskId)
    : null;

  const getTasksByColumn = (columnName) => {
    return tasks.filter((task) => task.column === columnName);
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.outerHTML);
    e.dataTransfer.setDragImage(e.target, 0, 0);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
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
      updateTaskField(draggedTask.id, "column", columnName);
    }
    setDraggedTask(null);
  };

  const updateTaskField = (taskId, field, value) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const updatedTask = { ...task, [field]: value };

        // Update completion status based on column
        if (field === "column") {
          if (value === "Done") {
            updatedTask.completed = true;
            updatedTask.status = "Done";
          } else if (task.completed) {
            updatedTask.completed = false;
            updatedTask.status = value;
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
  const removeTaskFromSprint = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };
//    const users = [
//   { name: "Alex", email: "alex.rodriguez@email.com" },
//   { name: "Emily", email: "emily.davis@email.com" },
//   { name: "John", email: "john.smith@email.com" },
//   { name: "mike", email: " mike.chen@email.com" },
// ];
  const TaskCard = ({ task , setNotification}) => {
    const totalAttachments = task.attachments
      ? Object.values(task.attachments).flat().length
      : 0;
  const users = [
  { name: "Alex", email: "alex.rodriguez@email.com" },
  { name: "Emily", email: "emily.davis@email.com" },
  { name: "John", email: "john.smith@email.com" },
  { name: "mike", email: " mike.chen@email.com" },
];

// const [showSuggestions, setShowSuggestions] = useState(false);
// const [filteredUsers, setFilteredUsers] = useState([]);
// const [mentionStartIndex, setMentionStartIndex] = useState(null);

const [showSuggestions, setShowSuggestions] = useState(false);
const [filteredUsers, setFilteredUsers] = useState([]);
const [mentionStartIndex, setMentionStartIndex] = useState(null);
const [showDropdown, setShowDropdown] = useState(false);
  const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState("");

    const lastComment =
      task.comments && task.comments.length > 0
        ? task.comments[task.comments.length - 1]
        : null;

    const handleCommentSubmit = (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent card click

      if (newComment.trim()) {
        const comment = {
          id: Date.now() + Math.random(),
          text: newComment.trim(),
          author: "Current User", // In real app, get from auth context
          timestamp: new Date().toISOString(),
          avatar: "CU", // User initials
        };

        const updatedComments = [...(task.comments || []), comment];
        updateTaskField(task.id, "comments", updatedComments);
        setNewComment("");
        setShowComments(false);
      }
    };

    const handleCommentClick = (e) => {
      e.stopPropagation(); // Prevent card click
      setShowComments(!showComments);
    };
    const handleMoveToBacklog = (e) => {
      e.stopPropagation(); // Prevent card click
      setShowDropdown(false);

      // Add to backlog
      addToBacklog(task);

      // Remove from current sprint
      removeTaskFromSprint(task.id);

      // Show success notification
      setNotification({
        type: "success",
        message: `Story "${task.title}" moved to backlog successfully!`,
        timestamp: Date.now(),
      });

      setTimeout(() => setNotification(null), 5000);
    };
const handleCommentChange = (e) => {
  const value = e.target.value;
  setNewComment(value);

  const cursorPosition = e.target.selectionStart;

  // Find last "@"
  const lastAtIndex = value.lastIndexOf("@", cursorPosition - 1);

  if (lastAtIndex !== -1) {
    const query = value.substring(lastAtIndex + 1, cursorPosition);

    // Only allow letters (avoid emails typing confusion)
    if (/^[a-zA-Z]*$/.test(query)) {
      const matches = users.filter((user) =>
        user.name.toLowerCase().startsWith(query.toLowerCase())
      );

      setFilteredUsers(matches);
      setShowSuggestions(matches.length > 0);
      setMentionStartIndex(lastAtIndex);
    } else {
      setShowSuggestions(false);
    }
  } else {
    setShowSuggestions(false);
  }
};

const handleSelectUser = (user) => {
  const cursorPosition = newComment.length;

  const textBefore = newComment.substring(0, mentionStartIndex);
  const textAfter = newComment.substring(cursorPosition);

  // ✅ Replace @text with email (NO extra @)
  const updatedText = textBefore + user.email + " " + textAfter;

  setNewComment(updatedText);
  setShowSuggestions(false);
};
    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, task)}
        onClick={() => handleTaskClick(task)}
        className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 hover:shadow-md transition-shadow cursor-pointer ${
          draggedTask && draggedTask.id === task.id ? "opacity-50" : ""
        }`}
      >
        {/* Card Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            {task.storyPointEstimate && (
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                {task.storyPointEstimate} SP
              </span>
            )}
            <span className="text-sm font-medium text-gray-600">
              #{task.story_id}
            </span>
            {task.completed && (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
            {task.riskFlag && (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            )}
            {totalAttachments > 0 && (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded flex items-center">
                <Upload className="w-3 h-3 mr-1" />
                {totalAttachments}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            {task.priority && (
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  task.priority === "High"
                    ? "bg-red-100 text-red-800"
                    : task.priority === "Medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {task.priority}
              </span>
            )}
            {/* Quick Action Menu */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropdown(!showDropdown);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                <MoreVertical className="w-3 h-3" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-6 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                  <div className="py-1">
                    <button
                      onClick={handleMoveToBacklog}
                      className="flex items-center w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                    >
                      <ArrowLeft className="w-3 h-3 mr-2 text-purple-500" />
                      Move to Backlog
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Story Title */}
        {task.title && (
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
              {task.title}
            </h3>
          </div>
        )}

        {/* Story Description */}
        {task.summary && (
          <div className="mb-3">
            <p className="text-xs text-gray-600 line-clamp-3">{task.summary}</p>
          </div>
        )}

        {/* Story Details */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-xs text-gray-500">
            {task.story_id && (
              <span>
                <strong>Story ID:</strong> {task.story_id}
              </span>
            )}
            {task.epic_id && (
              <span>
                <strong>Epic:</strong> {task.epic_id}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            {task.work && (
              <span>
                <strong>Effort:</strong> {task.work}
              </span>
            )}
            {task.status && (
              <span>
                <strong>Status:</strong>
                <span
                  className={`ml-1 font-medium ${
                    task.status === "Done"
                      ? "text-green-600"
                      : task.status === "In Progress"
                      ? "text-blue-600"
                      : task.status === "Blocked"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {task.status}
                </span>
              </span>
            )}
          </div>

          {/* Acceptance Criteria Count */}
          {task.acceptance_criteria && task.acceptance_criteria.length > 0 && (
            <div className="flex items-center text-xs text-gray-500">
              <CheckCircle className="w-3 h-3 mr-1" />
              <span>{task.acceptance_criteria.length} acceptance criteria</span>
            </div>
          )}

          {/* Dependencies */}
          {task.dependencies && task.dependencies.length > 0 && (
            <div className="flex items-center text-xs text-red-500">
              <AlertTriangle className="w-3 h-3 mr-1" />
              <span>{task.dependencies.length} dependencies</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  tag.toLowerCase() === "bug"
                    ? "bg-red-100 text-red-700"
                    : tag.toLowerCase() === "feature"
                    ? "bg-blue-100 text-blue-700"
                    : tag.toLowerCase() === "enhancement"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {tag}
              </span>
            ))}
            {task.tags.length > 2 && (
              <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                +{task.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Assignee */}
        {task.assignees && task.assignees.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center text-xs text-gray-600">
              <User className="w-3 h-3 mr-1" />
              <span className="truncate">{task.assignees.join(", ")}</span>
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <button
              onClick={handleCommentClick}
              className="flex items-center text-xs text-gray-500 hover:text-blue-600 transition-colors"
            >
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.418 8-9.875 8A9.875 9.875 0 0112 12c0-4.418 4.418-8 9.875-8S21 7.582 21 12z"
                />
              </svg>
              Comment ({(task.comments || []).length})
            </button>

            {lastComment && (
              <div className="flex items-center text-xs text-gray-400">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] mr-1">
                  {lastComment.avatar}
                </div>
                <span className="truncate max-w-20">"{lastComment.text}"</span>
              </div>
            )}
          </div>

          {/* Comment Input */}
          {showComments && (
            <form
              onSubmit={handleCommentSubmit}
              className="mt-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                  CU
                </div>
      <div className="flex-1 relative">
  <textarea
    value={newComment}
    onChange={handleCommentChange}
    placeholder="Add a comment... (use @ to mention)"
    className="w-full text-xs border border-gray-300 rounded-md p-2 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    rows="2"
    autoFocus
  />

  {/* ✅ Suggestions Dropdown */}
  {showSuggestions && (
    <div className="absolute z-50 bg-white border border-gray-200 rounded-md shadow-md mt-1 w-full max-h-32 overflow-y-auto">
      {filteredUsers.map((user, index) => (
        <div
          key={index}
          onClick={(e) => {
            e.stopPropagation();
            handleSelectUser(user);
          }}
          className="px-3 py-2 text-xs hover:bg-blue-100 cursor-pointer"
        >
          {user.name} ({user.email})
        </div>
      ))}
    </div>
  )}

  <div className="flex items-center justify-end space-x-2 mt-1">
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setShowComments(false);
        setNewComment("");
        setShowSuggestions(false);
      }}
      className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
    >
      Cancel
    </button>

    <button
      type="submit"
      disabled={!newComment.trim()}
      className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Save
    </button>
  </div>
</div>
              </div>

              {/* Existing Comments */}
              {task.comments && task.comments.length > 0 && (
                <div className="mt-3 space-y-2 max-h-32 overflow-y-auto">
                  {task.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex items-start space-x-2 text-xs"
                    >
                      <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center text-white text-[10px]">
                        {comment.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-700">
                            {comment.author}
                          </span>
                          <span className="text-gray-400">
                            {new Date(comment.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </form>
          )}
        </div>
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
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium">{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-2 text-green-600 hover:text-green-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-red-700 text-sm">
              Error loading sprint: {error}
            </span>
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
      <div className="bg-white rounded-lg shadow-sm border-2 border-orange-400 mb-6 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          {/* <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center"> */}
          <img src={pmrgLogo} alt="PMRG Logo" className="w-50 h-30" />
          {/* </div> */}
          <div>
          <div className="text-sm font-semibold text-gray-500 mb-1">
            {sprintData.title}
          </div>
            
             <h1 className="text-xl font-bold text-orange-600 mb-1">
              Current Sprint
            </h1>
            <p className="text-gray-600 text-sm">{sprintData.duration}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{tasks.length}</span> stories total
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">
                {tasks.reduce(
                  (sum, task) => sum + (task.storyPointEstimate || 0),
                  0
                )}
              </span>{" "}
              story points
            </div>
            {/* <button 
              onClick={fetchSprintData}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Refresh
            </button> */}
          </div>
        </div>
      </div>

      {/* Sprint Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Stories</p>
              <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Story Points</p>
              <p className="text-2xl font-bold text-gray-900">
                {tasks.reduce(
                  (sum, task) => sum + (task.storyPointEstimate || 0),
                  0
                ) || 0}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {tasks.filter((task) => task.completed).length}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Progress</p>
              <p className="text-2xl font-bold text-indigo-600">
                {tasks.length > 0
                  ? Math.round(
                      (tasks.filter((task) => task.completed).length /
                        tasks.length) *
                        100
                    )
                  : 0}
                %
              </p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-4 gap-4 overflow-x-auto">
        {sprintData.columns.map((column, index) => (
          <div
            key={`${column.name}-${index}`}
            className={`${
              column.color
            } rounded-lg shadow-sm min-h-96 transition-all duration-200 ${
              draggedOver === column.name
                ? "ring-2 ring-blue-400 ring-opacity-50 transform scale-105"
                : ""
            }`}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, column.name)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.name)}
          >
            {/* Column Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 mb-1">
                  {column.name}
                </h3>
                <span className="text-sm text-gray-600 bg-white bg-opacity-50 px-2 py-1 rounded">
                  {getTasksByColumn(column.name).length}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                {getTasksByColumn(column.name).reduce(
                  (sum, task) => sum + (task.storyPointEstimate || 0),
                  0
                )}{" "}
                story points
              </p>
            </div>

            {/* Column Content */}
            <div className="p-4">
              {/* {column.name === "To Do" && (
                <button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-md p-3 mb-4 flex items-center justify-center text-sm font-medium transition-colors">
                  <Plus className="w-4 h-4 mr-2" />
                  New Story
                </button>
              )} */}

              {/* Tasks */}
              <div className="space-y-3">
                {getTasksByColumn(column.name).map((task) => (
                 <TaskCard 
  key={task.id} 
  task={task} 
  setNotification={setNotification}
/>
                ))}
              </div>

              {/* Empty State */}
              {getTasksByColumn(column.name).length === 0 && (
                <div className="text-center text-gray-500 text-sm py-8">
                  <div className="text-gray-400 mb-2">No stories</div>
                  {draggedOver === column.name ? (
                    <div className="text-blue-600 font-medium">
                      Drop story here
                    </div>
                  ) : (
                    <div>Drag stories here</div>
                  )}
                </div>
              )}

              {/* Drop Zone Indicator */}
              {draggedOver === column.name &&
                getTasksByColumn(column.name).length > 0 && (
                  <div className="border-2 border-dashed border-blue-400 rounded-lg p-4 text-center text-blue-600 bg-blue-50 mt-3">
                    Drop story here
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>

      {/* Sprint Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Sprint Breakdown
          </h3>
          <div className="space-y-3">
            {sprintData.columns.map((column) => {
              const columnTasks = getTasksByColumn(column.name);
              const columnPoints = columnTasks.reduce(
                (sum, task) => sum + (task.storyPointEstimate || 0),
                0
              );
              return (
                <div
                  key={column.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${column.color
                        .replace("bg-", "bg-")
                        .replace("-100", "-500")}`}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">
                      {column.name}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {columnTasks.length} stories • {columnPoints} points
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Story Analysis
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">High Priority</span>
              <span className="text-sm font-medium text-red-600">
                {tasks.filter((t) => t.priority === "High").length} stories
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Medium Priority</span>
              <span className="text-sm font-medium text-yellow-600">
                {tasks.filter((t) => t.priority === "Medium").length} stories
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Low Priority</span>
              <span className="text-sm font-medium text-green-600">
                {tasks.filter((t) => t.priority === "Low").length} stories
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">With Dependencies</span>
              <span className="text-sm font-medium text-orange-600">
                {
                  tasks.filter(
                    (t) => t.dependencies && t.dependencies.length > 0
                  ).length
                }{" "}
                stories
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                With Acceptance Criteria
              </span>
              <span className="text-sm font-medium text-blue-600">
                {
                  tasks.filter(
                    (t) =>
                      t.acceptance_criteria && t.acceptance_criteria.length > 0
                  ).length
                }{" "}
                stories
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Panel - Shows actual API data for troubleshooting */}
      {/* <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Debug: Sprint Data</h3>
        <div className="text-xs text-gray-600 bg-white p-2 rounded border">
          <div>Stories loaded: {tasks.length}</div>
          <div>To Do: {getTasksByColumn('To Do').length}</div>
          <div>In Progress: {getTasksByColumn('In Progress').length}</div>
          <div>Blocked: {getTasksByColumn('Blocked').length}</div>
          <div>Done: {getTasksByColumn('Done').length}</div>
          <div>Total Story Points: {tasks.reduce((sum, task) => sum + (task.storyPointEstimate || 0), 0)}</div>
          <div>Stories with acceptance criteria: {tasks.filter(t => t.acceptance_criteria && t.acceptance_criteria.length > 0).length}</div>
          {tasks.length > 0 && (
            <div className="mt-2">
              <div>Sample task data: {JSON.stringify(tasks[0], null, 2)}</div>
            </div>
          )}
        </div>
      </div> */}
    </div>
  );
};

export default SprintBoard;