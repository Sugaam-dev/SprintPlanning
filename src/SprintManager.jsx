// // import React, { useState, useEffect } from 'react';
// // import { useNavigate } from 'react-router-dom';

// // const SprintManager = () => {
// //   const navigate = useNavigate();
// //   const [sprints, setSprints] = useState([]);
// //   const [projectData, setProjectData] = useState(null);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   // Fetch sprints data when component mounts
// //   useEffect(() => {
// //     fetchSprints();
// //   }, []);

// //   const fetchSprints = async () => {
// //     try {
// //       setIsLoading(true);
// //       setError(null);
// //       // const response = await fetch('https://sprint-backend-73ho.onrender.com/sprints', {
// //       const response = await fetch('http://127.0.0.1:8000/sprints', {
// //         method: 'GET',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //       });

// //       if (!response.ok) {
// //         throw new Error(`API Error: ${response.status} ${response.statusText}`);
// //       }

// //       const data = await response.json();
// //       console.log('Fetched projects data:', data);
      
// //       // The API now returns multiple projects with unique IDs as keys
// //       // Get the first (or most recent) project for now
// //       const projectKeys = Object.keys(data);
// //       if (projectKeys.length === 0) {
// //         throw new Error('No projects found in the API response');
// //       }
      
// //       // Use the first project, or you could implement logic to select a specific project
// //       const firstProjectKey = projectKeys[0];
// //       const projectData = data[firstProjectKey].project_plan;
      
// //       console.log('Using project:', projectData.project_name, 'with ID:', firstProjectKey);
      
// //       // Store the complete project data
// //       setProjectData(projectData);
      
// //       // Process the sprints from the project data
// //       if (projectData.sprints && Array.isArray(projectData.sprints)) {
// //         const sprintList = projectData.sprints.map((sprint, index) => {
// //           // Count stories for each sprint
// //           const assignedStories = projectData.user_stories ? 
// //             projectData.user_stories.filter(story => story.sprint_id === sprint.sprint_id) : [];
          
// //           // Calculate sprint duration in days
// //           const startDate = new Date(sprint.start_date);
// //           const endDate = new Date(sprint.end_date);
// //           const diffTime = Math.abs(endDate - startDate);
// //           const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
// //           // Determine status based on dates
// //           const today = new Date();
// //           let status = 'Not Started';
// //           if (today >= startDate && today <= endDate) {
// //             status = 'In Progress';
// //           } else if (today > endDate) {
// //             status = 'Completed';
// //           }

// //           return {
// //             id: sprint.sprint_id,
// //             name: sprint.name,
// //             days: `${diffDays}d`,
// //             status: status,
// //             startDate: sprint.start_date,
// //             endDate: sprint.end_date,
// //             selected: index === 0, // First sprint selected by default
// //             color: index === 0 ? 'bg-orange-200' : 'bg-gray-100',
// //             storiesCount: assignedStories.length,
// //             backlogCount: 0, // Can be calculated if you have backlog stories
// //             resourcesCount: projectData.resources?.length || 0,
// //             totalStoryPoints: assignedStories.reduce((sum, story) => sum + (story.story_points || 0), 0),
// //             totalEffortHours: assignedStories.reduce((sum, story) => sum + (story.estimated_effort_hours || 0), 0),
// //             projectKey: firstProjectKey // Store the project key for later use
// //           };
// //         });
        
// //         setSprints(sprintList);
// //       } else {
// //         throw new Error('No sprints found in the project data');
// //       }
      
// //     } catch (error) {
// //       console.error('Error fetching sprints:', error);
// //       setError(error.message);
      
// //       // Fallback to default data if API fails
// //       setSprints([
// //         {
// //           id: 'default-1',
// //           name: 'Sprint 1',
// //           days: '10d',
// //           status: 'Not Started',
// //           startDate: '2025-08-01',
// //           endDate: '2025-08-14',
// //           selected: true,
// //           color: 'bg-orange-200',
// //           storiesCount: 0,
// //           backlogCount: 0,
// //           resourcesCount: 0,
// //           totalStoryPoints: 0,
// //           totalEffortHours: 0
// //         }
// //       ]);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const handleCheckboxChange = (id) => {
// //     setSprints(sprints.map(sprint => 
// //       sprint.id === id 
// //         ? { ...sprint, selected: !sprint.selected }
// //         : sprint
// //     ));
// //   };

// //   const handleKanbanClick = async (sprint) => {
// //     try {
// //       // Show loading state
// //       const button = document.querySelector(`button[data-sprint-id="${sprint.id}"]`);
// //       if (button) {
// //         button.disabled = true;
// //         button.innerHTML = '<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>';
// //       }

// //       // Instead of fetching from a different endpoint, use the existing project data
// //       if (projectData && projectData.user_stories) {
// //         // Filter stories for this specific sprint
// //         const sprintStories = projectData.user_stories.filter(
// //           story => story.sprint_id === sprint.id
// //         );
        
// //         // Create the stories data structure expected by the board
// //         const storiesData = {
// //           assigned_stories: sprintStories.map(story => ({
// //             story_id: story.story_id,
// //             epic_id: story.epic_id,
// //             title: story.name,
// //             description: story.description,
// //             story_points: story.story_points,
// //             estimated_effort_hours: story.estimated_effort_hours,
// //             status: story.status,
// //             priority: story.priority,
// //             assigned_to: projectData.resources?.find(r => r.resource_id === story.assigned_to_resource_id)?.name || 'Unassigned',
// //             dependencies: story.dependencies || [],
// //             start_date: sprint.startDate,
// //             end_date: sprint.endDate,
// //             due_date: sprint.endDate,
// //             work_hours: `${story.estimated_effort_hours}h`,
// //             duration: `${story.estimated_effort_hours / 8}d`, // Assuming 8 hours per day
// //             role: projectData.resources?.find(r => r.resource_id === story.assigned_to_resource_id)?.role || 'Developer'
// //           })),
// //           backlog_stories: [], // You can populate this if you have backlog logic
// //           resources: projectData.resources || []
// //         };

// //         console.log(`Stories data for ${sprint.name}:`, storiesData);
        
// //         // Store both sprint info and stories data in localStorage for the board page
// //         localStorage.setItem('selectedSprintData', JSON.stringify(storiesData));
// //         localStorage.setItem('selectedSprintInfo', JSON.stringify({
// //           ...sprint,
// //           start: sprint.startDate,
// //           endDate: sprint.endDate
// //         }));
        
// //         // Navigate to board
// //         navigate('/board');
// //       } else {
// //         throw new Error('No project data available');
// //       }
      
// //     } catch (error) {
// //       console.error('Error preparing sprint data:', error);
// //       alert(`Failed to load sprint data: ${error.message}`);
// //     } finally {
// //       // Reset button state
// //       const button = document.querySelector(`button[data-sprint-id="${sprint.id}"]`);
// //       if (button) {
// //         button.disabled = false;
// //         button.innerHTML = 'VIEW';
// //       }
// //     }
// //   };

// //   const handleRefresh = () => {
// //     fetchSprints();
// //   };

// //   const formatDate = (dateString) => {
// //     const date = new Date(dateString);
// //     return date.toLocaleDateString('en-US', {
// //       weekday: 'short',
// //       month: 'short',
// //       day: 'numeric',
// //       year: '2-digit'
// //     });
// //   };

// //   if (isLoading) {
// //     return (
// //       <div className="p-6 bg-gray-50 min-h-screen">
// //         <div className="flex items-center justify-center min-h-64">
// //           <div className="text-center">
// //             <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
// //             <p className="text-gray-600">Loading sprints...</p>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="p-6 bg-gray-50 min-h-screen">
// //       {/* Project Header */}
// //       {projectData && (
// //         <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
// //           <h2 className="text-xl font-bold text-gray-800 mb-2">{projectData.project_name}</h2>
// //           <p className="text-gray-600 text-sm mb-2">{projectData.description}</p>
// //           <div className="flex items-center space-x-6 text-sm text-gray-700">
// //             <span><strong>Project ID:</strong> {projectData.project_id}</span>
// //             <span><strong>Total Story Points:</strong> {projectData.total_estimated_story_points}</span>
// //             <span><strong>Total Effort:</strong> {projectData.total_estimated_effort_hours}h</span>
// //             <span><strong>Duration:</strong> {formatDate(projectData.start_date)} - {formatDate(projectData.end_date)}</span>
// //           </div>
// //           <div className="mt-2 text-xs text-blue-600">
// //             <span><strong>Vision:</strong> {projectData.product_vision}</span>
// //           </div>
// //         </div>
// //       )}

// //       <div className="flex items-center justify-between mb-6">
// //         <h1 className="text-2xl font-semibold text-gray-800">Manage Sprints</h1>
// //         <div className="flex gap-3">
// //           <button 
// //             onClick={handleRefresh}
// //             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
// //           >
// //             Refresh
// //           </button>
// //           <button 
// //             onClick={() => navigate('/planning')}
// //             className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
// //           >
// //             Create New Sprint
// //           </button>
// //         </div>
// //       </div>
      
// //       {error && (
// //         <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
// //           <div className="flex items-center">
// //             <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
// //             </svg>
// //             <span className="text-red-700 text-sm">Error loading sprints: {error}</span>
// //           </div>
// //         </div>
// //       )}
      
// //       <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
// //         <table className="w-full">
// //           <thead className="bg-gray-50 border-b border-gray-200">
// //             <tr>
// //               <th className="w-12 px-4 py-3 text-left">
// //                 <input 
// //                   type="checkbox" 
// //                   className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
// //                 />
// //               </th>
// //               <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
// //               <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Duration</th>
// //               <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
// //               <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Start Date</th>
// //               <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">End Date</th>
// //               <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Stories</th>
// //               <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Story Points</th>
// //               <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Team</th>
// //               <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
// //             </tr>
// //           </thead>
// //           <tbody className="divide-y divide-gray-200">
// //             {sprints.map((sprint) => (
// //               <tr key={sprint.id} className={`${sprint.color} hover:bg-opacity-80 transition-colors duration-150`}>
// //                 <td className="px-4 py-3">
// //                   <input 
// //                     type="checkbox"
// //                     checked={sprint.selected}
// //                     onChange={() => handleCheckboxChange(sprint.id)}
// //                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
// //                   />
// //                 </td>
// //                 <td className="px-4 py-3 text-sm text-gray-900 font-medium">
// //                   {sprint.name}
// //                 </td>
// //                 <td className="px-4 py-3 text-sm text-gray-700">
// //                   {sprint.days}
// //                 </td>
// //                 <td className="px-4 py-3 text-sm">
// //                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
// //                     sprint.status === 'Completed' ? 'bg-green-100 text-green-800' :
// //                     sprint.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
// //                     'bg-gray-100 text-gray-800'
// //                   }`}>
// //                     {sprint.status}
// //                   </span>
// //                 </td>
// //                 <td className="px-4 py-3 text-sm text-gray-700">
// //                   {formatDate(sprint.startDate)}
// //                 </td>
// //                 <td className="px-4 py-3 text-sm text-gray-700">
// //                   {formatDate(sprint.endDate)}
// //                 </td>
// //                 <td className="px-4 py-3 text-sm text-gray-700">
// //                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
// //                     {sprint.storiesCount} stories
// //                   </span>
// //                 </td>
// //                 <td className="px-4 py-3 text-sm text-gray-700">
// //                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
// //                     {sprint.totalStoryPoints} points
// //                   </span>
// //                 </td>
// //                 <td className="px-4 py-3 text-sm text-gray-700">
// //                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
// //                     {sprint.resourcesCount} members
// //                   </span>
// //                 </td>
// //                 <td className="px-4 py-3">
// //                   <button
// //                     onClick={() => handleKanbanClick(sprint)}
// //                     data-sprint-id={sprint.id}
// //                     className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[70px] h-8 flex items-center justify-center"
// //                   >
// //                     VIEW
// //                   </button>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
        
// //         {sprints.length === 0 && !isLoading && (
// //           <div className="text-center py-8">
// //             <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
// //             </svg>
// //             <p className="text-gray-500 text-lg">No sprints found</p>
// //             <p className="text-gray-400 text-sm">Create your first sprint to get started</p>
// //           </div>
// //         )}
// //       </div>
      
// //       <div className="mt-6 flex gap-3">
// //         <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
// //           Add Sprint
// //         </button>
// //         <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
// //           Edit Selected
// //         </button>
// //         <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
// //           Delete Selected
// //         </button>
// //       </div>
      
// //       {/* Sprint Summary Cards */}
// //       {projectData && sprints.length > 0 && (
// //         <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
// //           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
// //             <h3 className="text-lg font-semibold text-gray-800 mb-2">Project Overview</h3>
// //             <div className="space-y-2 text-sm text-gray-600">
// //               <div>Total Sprints: <span className="font-medium text-gray-800">{sprints.length}</span></div>
// //               <div>Total Epics: <span className="font-medium text-gray-800">{projectData.epics?.length || 0}</span></div>
// //               <div>Total User Stories: <span className="font-medium text-gray-800">{projectData.user_stories?.length || 0}</span></div>
// //             </div>
// //           </div>
          
// //           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
// //             <h3 className="text-lg font-semibold text-gray-800 mb-2">Progress Status</h3>
// //             <div className="space-y-2 text-sm text-gray-600">
// //               <div>Not Started: <span className="font-medium text-gray-800">{sprints.filter(s => s.status === 'Not Started').length}</span></div>
// //               <div>In Progress: <span className="font-medium text-gray-800">{sprints.filter(s => s.status === 'In Progress').length}</span></div>
// //               <div>Completed: <span className="font-medium text-gray-800">{sprints.filter(s => s.status === 'Completed').length}</span></div>
// //             </div>
// //           </div>
          
// //           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
// //             <h3 className="text-lg font-semibold text-gray-800 mb-2">Resource Allocation</h3>
// //             <div className="space-y-2 text-sm text-gray-600">
// //               <div>Team Members: <span className="font-medium text-gray-800">{projectData.resources?.length || 0}</span></div>
// //               <div>Avg Stories/Sprint: <span className="font-medium text-gray-800">{(projectData.user_stories?.length / sprints.length).toFixed(1)}</span></div>
// //               <div>Avg Points/Sprint: <span className="font-medium text-gray-800">{(projectData.total_estimated_story_points / sprints.length).toFixed(1)}</span></div>
// //             </div>
// //           </div>
// //         </div>
// //       )}
      
// //       {/* Debug Panel - Remove in production */}
// //       {projectData && (
// //         <div className="mt-6 p-4 bg-gray-100 rounded-lg">
// //           <h3 className="text-sm font-medium text-gray-700 mb-2">Debug: Project Data Preview</h3>
// //           <div className="text-xs text-gray-600 bg-white p-2 rounded border max-h-32 overflow-y-auto">
// //             <div>Project ID: {projectData.project_id}</div>
// //             <div>Project Name: {projectData.project_name}</div>
// //             <div>Sprints: {projectData.sprints?.length || 0}</div>
// //             <div>User Stories: {projectData.user_stories?.length || 0}</div>
// //             <div>Resources: {projectData.resources?.length || 0}</div>
// //             <div>Epics: {projectData.epics?.length || 0}</div>
// //             <div>Tasks: {projectData.tasks?.length || 0}</div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default SprintManager;



// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Calendar, 
//   Clock, 
//   Users, 
//   Target, 
//   BarChart3, 
//   CheckCircle, 
//   AlertTriangle, 
//   Star, 
//   FolderOpen, 
//   GitBranch,
//   Activity,
//   Layers,
//   Database,
//   User,
//   MapPin,
//   Timer,
//   Flag,
//   BookOpen,
//   Zap,
//   Trophy,
//   Settings,
//   Eye,
//   Edit,
//   Trash2,
//   Plus,
//   RefreshCw
// } from 'lucide-react';

// const SprintManager = () => {
//   const navigate = useNavigate();
//   const [sprints, setSprints] = useState([]);
//   const [projectData, setProjectData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState('sprints'); // 'sprints', 'projects', 'epics'

//   // Fetch sprints data when component mounts
//   useEffect(() => {
//     fetchSprints();
//   }, []);

//   const fetchSprints = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const response = await fetch('http://127.0.0.1:8000/sprints', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`API Error: ${response.status} ${response.statusText}`);
//       }

//       const data = await response.json();
//       console.log('Fetched projects data:', data);
      
//       const projectKeys = Object.keys(data);
//       if (projectKeys.length === 0) {
//         throw new Error('No projects found in the API response');
//       }
      
//       const firstProjectKey = projectKeys[0];
//       const projectData = data[firstProjectKey].project_plan;
      
//       console.log('Using project:', projectData.project_name, 'with ID:', firstProjectKey);
      
//       setProjectData(projectData);
      
//       if (projectData.sprints && Array.isArray(projectData.sprints)) {
//         const sprintList = projectData.sprints.map((sprint, index) => {
//           const assignedStories = projectData.user_stories ? 
//             projectData.user_stories.filter(story => story.sprint_id === sprint.sprint_id) : [];
          
//           const startDate = new Date(sprint.start_date);
//           const endDate = new Date(sprint.end_date);
//           const diffTime = Math.abs(endDate - startDate);
//           const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
//           const today = new Date();
//           let status = 'Not Started';
//           if (today >= startDate && today <= endDate) {
//             status = 'In Progress';
//           } else if (today > endDate) {
//             status = 'Completed';
//           }

//           return {
//             id: sprint.sprint_id,
//             name: sprint.name,
//             days: `${diffDays}d`,
//             status: status,
//             startDate: sprint.start_date,
//             endDate: sprint.end_date,
//             selected: index === 0,
//             color: index === 0 ? 'bg-orange-200' : 'bg-gray-100',
//             storiesCount: assignedStories.length,
//             backlogCount: 0,
//             resourcesCount: projectData.resources?.length || 0,
//             totalStoryPoints: assignedStories.reduce((sum, story) => sum + (story.story_points || 0), 0),
//             totalEffortHours: assignedStories.reduce((sum, story) => sum + (story.estimated_effort_hours || 0), 0),
//             projectKey: firstProjectKey
//           };
//         });
        
//         setSprints(sprintList);
//       } else {
//         throw new Error('No sprints found in the project data');
//       }
      
//     } catch (error) {
//       console.error('Error fetching sprints:', error);
//       setError(error.message);
      
//       setSprints([
//         {
//           id: 'default-1',
//           name: 'Sprint 1',
//           days: '10d',
//           status: 'Not Started',
//           startDate: '2025-08-01',
//           endDate: '2025-08-14',
//           selected: true,
//           color: 'bg-orange-200',
//           storiesCount: 0,
//           backlogCount: 0,
//           resourcesCount: 0,
//           totalStoryPoints: 0,
//           totalEffortHours: 0
//         }
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCheckboxChange = (id) => {
//     setSprints(sprints.map(sprint => 
//       sprint.id === id 
//         ? { ...sprint, selected: !sprint.selected }
//         : sprint
//     ));
//   };

//   const handleKanbanClick = async (sprint) => {
//     try {
//       const button = document.querySelector(`button[data-sprint-id="${sprint.id}"]`);
//       if (button) {
//         button.disabled = true;
//         button.innerHTML = '<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>';
//       }

//       if (projectData && projectData.user_stories) {
//         const sprintStories = projectData.user_stories.filter(
//           story => story.sprint_id === sprint.id
//         );
        
//         const storiesData = {
//           assigned_stories: sprintStories.map(story => ({
//             story_id: story.story_id,
//             epic_id: story.epic_id,
//             title: story.name,
//             description: story.description,
//             story_points: story.story_points,
//             estimated_effort_hours: story.estimated_effort_hours,
//             status: story.status,
//             priority: story.priority,
//             assigned_to: projectData.resources?.find(r => r.resource_id === story.assigned_to_resource_id)?.name || 'Unassigned',
//             dependencies: story.dependencies || [],
//             start_date: sprint.startDate,
//             end_date: sprint.endDate,
//             due_date: sprint.endDate,
//             work_hours: `${story.estimated_effort_hours}h`,
//             duration: `${story.estimated_effort_hours / 8}d`,
//             role: projectData.resources?.find(r => r.resource_id === story.assigned_to_resource_id)?.role || 'Developer'
//           })),
//           backlog_stories: [],
//           resources: projectData.resources || []
//         };

//         console.log(`Stories data for ${sprint.name}:`, storiesData);
        
//         localStorage.setItem('selectedSprintData', JSON.stringify(storiesData));
//         localStorage.setItem('selectedSprintInfo', JSON.stringify({
//           ...sprint,
//           start: sprint.startDate,
//           endDate: sprint.endDate
//         }));
        
//         navigate('/board');
//       } else {
//         throw new Error('No project data available');
//       }
      
//     } catch (error) {
//       console.error('Error preparing sprint data:', error);
//       alert(`Failed to load sprint data: ${error.message}`);
//     } finally {
//       const button = document.querySelector(`button[data-sprint-id="${sprint.id}"]`);
//       if (button) {
//         button.disabled = false;
//         button.innerHTML = 'VIEW';
//       }
//     }
//   };

//   const handleRefresh = () => {
//     fetchSprints();
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       weekday: 'short',
//       month: 'short',
//       day: 'numeric',
//       year: '2-digit'
//     });
//   };

//   const getStatusBadge = (status) => {
//     const statusStyles = {
//       'Completed': 'bg-green-100 text-green-800',
//       'In Progress': 'bg-blue-100 text-blue-800',
//       'Not Started': 'bg-gray-100 text-gray-800',
//       'To Do': 'bg-yellow-100 text-yellow-800',
//       'High': 'bg-red-100 text-red-800',
//       'Medium': 'bg-yellow-100 text-yellow-800',
//       'Low': 'bg-green-100 text-green-800'
//     };
    
//     return statusStyles[status] || 'bg-gray-100 text-gray-800';
//   };

//   const getPriorityIcon = (priority) => {
//     switch (priority) {
//       case 'High': return <AlertTriangle className="w-4 h-4 text-red-500" />;
//       case 'Medium': return <Flag className="w-4 h-4 text-yellow-500" />;
//       case 'Low': return <CheckCircle className="w-4 h-4 text-green-500" />;
//       default: return <Flag className="w-4 h-4 text-gray-500" />;
//     }
//   };

//   // Tab Navigation Component
//   const TabNavigation = () => (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
//       <div className="flex border-b border-gray-200">
//         <button
//           onClick={() => setActiveTab('sprints')}
//           className={`px-6 py-4 text-sm font-medium transition-colors flex items-center space-x-2 ${
//             activeTab === 'sprints'
//               ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
//               : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
//           }`}
//         >
//           <GitBranch className="w-4 h-4" />
//           <span>Sprint View</span>
//         </button>
//         <button
//           onClick={() => setActiveTab('projects')}
//           className={`px-6 py-4 text-sm font-medium transition-colors flex items-center space-x-2 ${
//             activeTab === 'projects'
//               ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
//               : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
//           }`}
//         >
//           <FolderOpen className="w-4 h-4" />
//           <span>Project View</span>
//         </button>
//         <button
//           onClick={() => setActiveTab('epics')}
//           className={`px-6 py-4 text-sm font-medium transition-colors flex items-center space-x-2 ${
//             activeTab === 'epics'
//               ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
//               : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
//           }`}
//         >
//           <Layers className="w-4 h-4" />
//           <span>Epics View</span>
//         </button>
//       </div>
//     </div>
//   );

//   // Project View Component
//   const ProjectView = () => {
//     if (!projectData) return <div>No project data available</div>;

//     return (
//       <div className="space-y-6">
//         {/* Project Overview Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Story Points</p>
//                 <p className="text-3xl font-bold text-blue-600">{projectData.total_estimated_story_points}</p>
//               </div>
//               <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                 <BarChart3 className="w-6 h-6 text-blue-600" />
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Effort Hours</p>
//                 <p className="text-3xl font-bold text-green-600">{projectData.total_estimated_effort_hours}h</p>
//               </div>
//               <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
//                 <Clock className="w-6 h-6 text-green-600" />
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Team Members</p>
//                 <p className="text-3xl font-bold text-purple-600">{projectData.resources?.length || 0}</p>
//               </div>
//               <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
//                 <Users className="w-6 h-6 text-purple-600" />
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">User Stories</p>
//                 <p className="text-3xl font-bold text-orange-600">{projectData.user_stories?.length || 0}</p>
//               </div>
//               <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
//                 <BookOpen className="w-6 h-6 text-orange-600" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Project Details Table */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//             <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//               <Database className="w-5 h-5 mr-2 text-blue-600" />
//               Project Details
//             </h3>
//           </div>
          
//           <div className="p-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div className="space-y-4">
//                 <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
//                   <Target className="w-5 h-5 text-blue-600 mt-0.5" />
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Project ID</label>
//                     <p className="text-gray-900 font-mono text-sm">{projectData.project_id}</p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
//                   <FolderOpen className="w-5 h-5 text-green-600 mt-0.5" />
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
//                     <p className="text-gray-900 font-semibold">{projectData.project_name}</p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
//                   <Calendar className="w-5 h-5 text-purple-600 mt-0.5" />
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
//                     <p className="text-gray-900">{formatDate(projectData.start_date)} - {formatDate(projectData.end_date)}</p>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="space-y-4">
//                 <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
//                   <Zap className="w-5 h-5 text-yellow-600 mt-0.5" />
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                     <p className="text-gray-900 text-sm">{projectData.description}</p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
//                   <Trophy className="w-5 h-5 text-orange-600 mt-0.5" />
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Product Vision</label>
//                     <p className="text-gray-900 text-sm">{projectData.product_vision}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Resources Table */}
//         {projectData.resources && projectData.resources.length > 0 && (
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//             <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//               <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//                 <Users className="w-5 h-5 mr-2 text-green-600" />
//                 Team Resources
//               </h3>
//             </div>
            
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50 border-b border-gray-200">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Resource ID</th>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Role</th>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Daily Capacity</th>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Skills</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {projectData.resources.map((resource) => (
//                     <tr key={resource.resource_id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 text-sm font-mono text-gray-900">{resource.resource_id}</td>
//                       <td className="px-6 py-4 text-sm font-medium text-gray-900 flex items-center">
//                         <User className="w-4 h-4 mr-2 text-blue-500" />
//                         {resource.name}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-900">
//                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                           {resource.role}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-900 flex items-center">
//                         <Timer className="w-4 h-4 mr-1 text-green-500" />
//                         {resource.daily_capacity_hours}h/day
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-900">
//                         <div className="flex flex-wrap gap-1">
//                           {resource.skills?.slice(0, 3).map((skill, index) => (
//                             <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
//                               {skill}
//                             </span>
//                           ))}
//                           {resource.skills?.length > 3 && (
//                             <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-600">
//                               +{resource.skills.length - 3} more
//                             </span>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Epics View Component
//   const EpicsView = () => {
//     if (!projectData?.epics) return <div>No epics data available</div>;

//     return (
//       <div className="space-y-6">
//         {/* Epics Overview */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Epics</p>
//                 <p className="text-3xl font-bold text-indigo-600">{projectData.epics.length}</p>
//               </div>
//               <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
//                 <Layers className="w-6 h-6 text-indigo-600" />
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Stories per Epic</p>
//                 <p className="text-3xl font-bold text-teal-600">
//                   {projectData.user_stories ? (projectData.user_stories.length / projectData.epics.length).toFixed(1) : 0}
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
//                 <BarChart3 className="w-6 h-6 text-teal-600" />
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Epic Progress</p>
//                 <p className="text-3xl font-bold text-emerald-600">
//                   {Math.round((projectData.user_stories?.filter(s => s.status === 'Done').length / (projectData.user_stories?.length || 1)) * 100)}%
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
//                 <Activity className="w-6 h-6 text-emerald-600" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Epics Table */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//             <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//               <Layers className="w-5 h-5 mr-2 text-indigo-600" />
//               Epic Details
//             </h3>
//           </div>
          
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50 border-b border-gray-200">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Epic ID</th>
//                   <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
//                   <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Description</th>
//                   <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">User Stories</th>
//                   <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Story Points</th>
//                   <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Progress</th>
//                   <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {projectData.epics.map((epic) => {
//                   const epicStories = projectData.user_stories?.filter(story => story.epic_id === epic.epic_id) || [];
//                   const completedStories = epicStories.filter(story => story.status === 'Done');
//                   const totalStoryPoints = epicStories.reduce((sum, story) => sum + (story.story_points || 0), 0);
//                   const progressPercentage = epicStories.length > 0 ? Math.round((completedStories.length / epicStories.length) * 100) : 0;
                  
//                   return (
//                     <tr key={epic.epic_id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 text-sm font-mono text-gray-900">{epic.epic_id}</td>
//                       <td className="px-6 py-4 text-sm font-medium text-gray-900">
//                         <div className="flex items-center">
//                           <Target className="w-4 h-4 mr-2 text-indigo-500" />
//                           {epic.name}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-700 max-w-md">
//                         <p className="truncate" title={epic.description}>
//                           {epic.description}
//                         </p>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-900">
//                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                           <BookOpen className="w-3 h-3 mr-1" />
//                           {epicStories.length} stories
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-900">
//                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
//                           <Star className="w-3 h-3 mr-1" />
//                           {totalStoryPoints} pts
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-900">
//                         <div className="flex items-center space-x-2">
//                           <div className="flex-1 bg-gray-200 rounded-full h-2">
//                             <div 
//                               className="bg-green-500 h-2 rounded-full transition-all duration-300" 
//                               style={{ width: `${progressPercentage}%` }}
//                             ></div>
//                           </div>
//                           <span className="text-xs font-medium text-gray-600">{progressPercentage}%</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-900">
//                         <div className="flex items-center space-x-2">
//                           <button className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors">
//                             <Eye className="w-4 h-4" />
//                           </button>
//                           <button className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors">
//                             <Edit className="w-4 h-4" />
//                           </button>
//                           <button className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors">
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Epic Definition Details */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {projectData.epics.map((epic) => (
//             <div key={epic.epic_id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//               <div className="flex items-center mb-4">
//                 <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
//                   <Layers className="w-5 h-5 text-indigo-600" />
//                 </div>
//                 <div>
//                   <h4 className="text-lg font-semibold text-gray-800">{epic.name}</h4>
//                   <p className="text-sm text-gray-600">{epic.epic_id}</p>
//                 </div>
//               </div>
              
//               <div className="space-y-4">
//                 <div>
//                   <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
//                     <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
//                     Definition of Ready
//                   </h5>
//                   <ul className="space-y-1">
//                     {epic.definition_of_ready?.map((item, index) => (
//                       <li key={index} className="text-sm text-gray-600 flex items-start">
//                         <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
//                         {item}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
                
//                 <div>
//                   <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
//                     <Flag className="w-4 h-4 mr-1 text-blue-500" />
//                     Definition of Done
//                   </h5>
//                   <ul className="space-y-1">
//                     {epic.definition_of_done?.map((item, index) => (
//                       <li key={index} className="text-sm text-gray-600 flex items-start">
//                         <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
//                         {item}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   // Sprint View Component (Enhanced version of the original)
//   const SprintView = () => (
//     <div className="space-y-6">
//       {/* Sprint Statistics */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Sprints</p>
//               <p className="text-3xl font-bold text-blue-600">{sprints.length}</p>
//             </div>
//             <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//               <GitBranch className="w-6 h-6 text-blue-600" />
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Active Sprints</p>
//               <p className="text-3xl font-bold text-green-600">
//                 {sprints.filter(s => s.status === 'In Progress').length}
//               </p>
//             </div>
//             <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
//               <Activity className="w-6 h-6 text-green-600" />
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Completed</p>
//               <p className="text-3xl font-bold text-purple-600">
//                 {sprints.filter(s => s.status === 'Completed').length}
//               </p>
//             </div>
//             <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
//               <CheckCircle className="w-6 h-6 text-purple-600" />
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Story Points</p>
//               <p className="text-3xl font-bold text-orange-600">
//                 {sprints.reduce((sum, sprint) => sum + sprint.totalStoryPoints, 0)}
//               </p>
//             </div>
//             <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
//               <Star className="w-6 h-6 text-orange-600" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Sprint Table */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//         <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//               <GitBranch className="w-5 h-5 mr-2 text-blue-600" />
//               Sprint Management
//             </h3>
//             <div className="flex items-center space-x-3">
//               <button 
//                 onClick={handleRefresh}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium flex items-center space-x-2"
//               >
//                 <RefreshCw className="w-4 h-4" />
//                 <span>Refresh</span>
//               </button>
//               <button 
//                 onClick={() => navigate('/planning')}
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm font-medium flex items-center space-x-2"
//               >
//                 <Plus className="w-4 h-4" />
//                 <span>New Sprint</span>
//               </button>
//             </div>
//           </div>
//         </div>
        
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 border-b border-gray-200">
//               <tr>
//                 <th className="w-12 px-4 py-3 text-left">
//                   <input 
//                     type="checkbox" 
//                     className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                   />
//                 </th>
//                 <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Sprint</th>
//                 <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Duration</th>
//                 <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
//                 <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Timeline</th>
//                 <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Stories</th>
//                 <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Story Points</th>
//                 <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Effort Hours</th>
//                 <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Team</th>
//                 <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {sprints.map((sprint) => (
//                 <tr key={sprint.id} className={`${sprint.color} hover:bg-opacity-80 transition-colors duration-150`}>
//                   <td className="px-4 py-3">
//                     <input 
//                       type="checkbox"
//                       checked={sprint.selected}
//                       onChange={() => handleCheckboxChange(sprint.id)}
//                       className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                     />
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-900">
//                     <div className="flex items-center">
//                       <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
//                         <GitBranch className="w-4 h-4 text-blue-600" />
//                       </div>
//                       <div>
//                         <div className="font-medium">{sprint.name}</div>
//                         <div className="text-xs text-gray-500">{sprint.id}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-700">
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                       <Clock className="w-3 h-3 mr-1" />
//                       {sprint.days}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 text-sm">
//                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(sprint.status)}`}>
//                       {sprint.status === 'Completed' && <CheckCircle className="w-3 h-3 mr-1" />}
//                       {sprint.status === 'In Progress' && <Activity className="w-3 h-3 mr-1" />}
//                       {sprint.status === 'Not Started' && <Clock className="w-3 h-3 mr-1" />}
//                       {sprint.status}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-700">
//                     <div className="space-y-1">
//                       <div className="flex items-center text-xs">
//                         <Calendar className="w-3 h-3 mr-1 text-green-500" />
//                         <span>{formatDate(sprint.startDate)}</span>
//                       </div>
//                       <div className="flex items-center text-xs">
//                         <MapPin className="w-3 h-3 mr-1 text-red-500" />
//                         <span>{formatDate(sprint.endDate)}</span>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-700">
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                       <BookOpen className="w-3 h-3 mr-1" />
//                       {sprint.storiesCount} stories
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-700">
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
//                       <Star className="w-3 h-3 mr-1" />
//                       {sprint.totalStoryPoints} pts
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-700">
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                       <Timer className="w-3 h-3 mr-1" />
//                       {sprint.totalEffortHours}h
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-700">
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
//                       <Users className="w-3 h-3 mr-1" />
//                       {sprint.resourcesCount} members
//                     </span>
//                   </td>
//                   <td className="px-4 py-3">
//                     <div className="flex items-center space-x-2">
//                       <button
//                         onClick={() => handleKanbanClick(sprint)}
//                         data-sprint-id={sprint.id}
//                         className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[60px] h-8 flex items-center justify-center"
//                       >
//                         <Eye className="w-3 h-3 mr-1" />
//                         VIEW
//                       </button>
//                       <button className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors">
//                         <Edit className="w-4 h-4" />
//                       </button>
//                       <button className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors">
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Sprint Action Buttons */}
//       <div className="flex items-center space-x-3">
//         <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center space-x-2">
//           <Plus className="w-4 h-4" />
//           <span>Add Sprint</span>
//         </button>
//         <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center space-x-2">
//           <Edit className="w-4 h-4" />
//           <span>Edit Selected</span>
//         </button>
//         <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center space-x-2">
//           <Trash2 className="w-4 h-4" />
//           <span>Delete Selected</span>
//         </button>
//       </div>
//     </div>
//   );

//   if (isLoading) {
//     return (
//       <div className="p-6 bg-gray-50 min-h-screen">
//         <div className="flex items-center justify-center min-h-64">
//           <div className="text-center">
//             <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//             <p className="text-gray-600">Loading sprint data...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="mb-6">
//         <div className="flex items-center justify-between mb-4">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800 flex items-center">
//               <Settings className="w-8 h-8 mr-3 text-blue-600" />
//               Manage Sprints
//             </h1>
//             <p className="text-gray-600 mt-1">Comprehensive sprint, project, and epic management</p>
//           </div>
//         </div>
        
//         {/* Project Header */}
//         {projectData && (
//           <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h2 className="text-xl font-bold text-gray-800 flex items-center">
//                   <FolderOpen className="w-5 h-5 mr-2 text-blue-600" />
//                   {projectData.project_name}
//                 </h2>
//                 <p className="text-gray-600 text-sm mt-1">{projectData.description}</p>
//               </div>
//               <div className="text-right">
//                 <div className="text-sm text-gray-700">
//                   <span className="font-medium">{formatDate(projectData.start_date)}</span> - <span className="font-medium">{formatDate(projectData.end_date)}</span>
//                 </div>
//                 <div className="text-xs text-blue-600 mt-1">
//                   {projectData.total_estimated_story_points} story points • {projectData.total_estimated_effort_hours}h effort
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Error Display */}
//       {error && (
//         <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//           <div className="flex items-center">
//             <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
//             <span className="text-red-700 text-sm">Error loading data: {error}</span>
//             <button 
//               onClick={handleRefresh}
//               className="ml-4 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
//             >
//               Retry
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Tab Navigation */}
//       <TabNavigation />

//       {/* Tab Content */}
//       <div className="min-h-96">
//         {activeTab === 'sprints' && <SprintView />}
//         {activeTab === 'projects' && <ProjectView />}
//         {activeTab === 'epics' && <EpicsView />}
//       </div>

//       {/* Debug Panel */}
//       {projectData && (
//         <div className="mt-8 p-4 bg-gray-100 rounded-lg">
//           <h3 className="text-sm font-medium text-gray-700 mb-2">Debug: API Data Summary</h3>
//           <div className="text-xs text-gray-600 bg-white p-3 rounded border grid grid-cols-2 md:grid-cols-4 gap-4">
//             <div>
//               <div className="font-medium">Project</div>
//               <div>ID: {projectData.project_id}</div>
//               <div>Name: {projectData.project_name}</div>
//             </div>
//             <div>
//               <div className="font-medium">Sprints</div>
//               <div>Total: {projectData.sprints?.length || 0}</div>
//               <div>Loaded: {sprints.length}</div>
//             </div>
//             <div>
//               <div className="font-medium">Stories</div>
//               <div>Total: {projectData.user_stories?.length || 0}</div>
//               <div>Epics: {projectData.epics?.length || 0}</div>
//             </div>
//             <div>
//               <div className="font-medium">Resources</div>
//               <div>Team: {projectData.resources?.length || 0}</div>
//               <div>Tasks: {projectData.tasks?.length || 0}</div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SprintManager;






import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Eye, Edit, Trash2, Play, Pause, Archive } from 'lucide-react';

const SprintManager = () => {
  const navigate = useNavigate();
  const [sprints, setSprints] = useState([]);
  const [projectData, setProjectData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('sprints');
  const [dropdownOpen, setDropdownOpen] = useState(null);

  // Fetch sprints data when component mounts
  useEffect(() => {
    fetchSprints();
  }, []);

  const fetchSprints = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('https://sprint-backend-73ho.onrender.com/sprints', {
      // const response = await fetch('http://127.0.0.1:8000/sprints', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Fetched projects data:', data);
      
      // The API now returns multiple projects with unique IDs as keys
      // Get the first (or most recent) project for now
      const projectKeys = Object.keys(data);
      if (projectKeys.length === 0) {
        throw new Error('No projects found in the API response');
      }
      
      // Use the first project, or you could implement logic to select a specific project
      const firstProjectKey = projectKeys[0];
      const projectData = data[firstProjectKey].project_plan;
      
      console.log('Using project:', projectData.project_name, 'with ID:', firstProjectKey);
      
      // Store the complete project data
      setProjectData(projectData);
      
      // Process the sprints from the project data
      if (projectData.sprints && Array.isArray(projectData.sprints)) {
        const sprintList = projectData.sprints.map((sprint, index) => {
          // Count stories for each sprint
          const assignedStories = projectData.user_stories ? 
            projectData.user_stories.filter(story => story.sprint_id === sprint.sprint_id) : [];
          
          // Calculate sprint duration in days
          const startDate = new Date(sprint.start_date);
          const endDate = new Date(sprint.end_date);
          const diffTime = Math.abs(endDate - startDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          // Determine status based on dates
          const today = new Date();
          let status = 'Not Started';
          if (today >= startDate && today <= endDate) {
            status = 'In Progress';
          } else if (today > endDate) {
            status = 'Completed';
          }

          return {
            id: sprint.sprint_id,
            name: sprint.name,
            days: `${diffDays}d`,
            status: status,
            startDate: sprint.start_date,
            endDate: sprint.end_date,
            selected: index === 0, // First sprint selected by default
            color: index === 0 ? 'bg-orange-200' : 'bg-gray-100',
            storiesCount: assignedStories.length,
            backlogCount: 0, // Can be calculated if you have backlog stories
            resourcesCount: projectData.resources?.length || 0,
            totalStoryPoints: assignedStories.reduce((sum, story) => sum + (story.story_points || 0), 0),
            totalEffortHours: assignedStories.reduce((sum, story) => sum + (story.estimated_effort_hours || 0), 0),
            projectKey: firstProjectKey // Store the project key for later use
          };
        });
        
        setSprints(sprintList);
      } else {
        throw new Error('No sprints found in the project data');
      }
      
    } catch (error) {
      console.error('Error fetching sprints:', error);
      setError(error.message);
      
      // Fallback to default data if API fails
      setSprints([
        {
          id: 'default-1',
          name: 'Sprint 1',
          days: '10d',
          status: 'Not Started',
          startDate: '2025-08-01',
          endDate: '2025-08-14',
          selected: true,
          color: 'bg-orange-200',
          storiesCount: 0,
          backlogCount: 0,
          resourcesCount: 0,
          totalStoryPoints: 0,
          totalEffortHours: 0
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (id) => {
    setSprints(sprints.map(sprint => 
      sprint.id === id 
        ? { ...sprint, selected: !sprint.selected }
        : sprint
    ));
  };

  const handleKanbanClick = async (sprint) => {
    try {
      // Show loading state
      const button = document.querySelector(`button[data-sprint-id="${sprint.id}"]`);
      if (button) {
        button.disabled = true;
        button.innerHTML = '<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>';
      }

      // Instead of fetching from a different endpoint, use the existing project data
      if (projectData && projectData.user_stories) {
        // Filter stories for this specific sprint
        const sprintStories = projectData.user_stories.filter(
          story => story.sprint_id === sprint.id
        );
        
        // Create the stories data structure expected by the board
        const storiesData = {
          assigned_stories: sprintStories.map(story => ({
            story_id: story.story_id,
            epic_id: story.epic_id,
            title: story.name,
            description: story.description,
            story_points: story.story_points,
            estimated_effort_hours: story.estimated_effort_hours,
            status: story.status,
            priority: story.priority,
            assigned_to: projectData.resources?.find(r => r.resource_id === story.assigned_to_resource_id)?.name || 'Unassigned',
            dependencies: story.dependencies || [],
            start_date: sprint.startDate,
            end_date: sprint.endDate,
            due_date: sprint.endDate,
            work_hours: `${story.estimated_effort_hours}h`,
            duration: `${story.estimated_effort_hours / 8}d`, // Assuming 8 hours per day
            role: projectData.resources?.find(r => r.resource_id === story.assigned_to_resource_id)?.role || 'Developer'
          })),
          backlog_stories: [], // You can populate this if you have backlog logic
          resources: projectData.resources || []
        };

        console.log(`Stories data for ${sprint.name}:`, storiesData);
        
        // Store both sprint info and stories data in localStorage for the board page
        localStorage.setItem('selectedSprintData', JSON.stringify(storiesData));
        localStorage.setItem('selectedSprintInfo', JSON.stringify({
          ...sprint,
          start: sprint.startDate,
          endDate: sprint.endDate
        }));
        
        // Navigate to board
        navigate('/board');
      } else {
        throw new Error('No project data available');
      }
      
    } catch (error) {
      console.error('Error preparing sprint data:', error);
      alert(`Failed to load sprint data: ${error.message}`);
    } finally {
      // Reset button state
      const button = document.querySelector(`button[data-sprint-id="${sprint.id}"]`);
      if (button) {
        button.disabled = false;
        button.innerHTML = '<Eye className="w-4 h-4" />';
      }
    }
  };

  const handleRefresh = () => {
    fetchSprints();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: '2-digit'
    });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'project') {
      navigate('/view');
    } else if (tab === 'epics') {
      navigate('/epics');
    }
  };

  const handleDropdownToggle = (sprintId) => {
    setDropdownOpen(dropdownOpen === sprintId ? null : sprintId);
  };

  const handleDropdownAction = (action, sprint) => {
    setDropdownOpen(null);
    switch (action) {
      case 'edit':
        console.log('Edit sprint:', sprint.id);
        // Implement edit functionality
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${sprint.name}?`)) {
          console.log('Delete sprint:', sprint.id);
          // Implement delete functionality
        }
        break;
      case 'start':
        console.log('Start sprint:', sprint.id);
        // Implement start sprint functionality
        break;
      case 'pause':
        console.log('Pause sprint:', sprint.id);
        // Implement pause sprint functionality
        break;
      case 'archive':
        console.log('Archive sprint:', sprint.id);
        // Implement archive functionality
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-blue-200/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  SPRINT MANAGER
                </h1>
              </div>
            </div>
          </div>
        </header>
        
        <div className="flex items-center justify-center min-h-64 py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading sprint data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-blue-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SPRINT MANAGER
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleRefresh}
                className="px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg hover:bg-opacity-30 transition-all duration-200 flex items-center space-x-2 text-blue-700 border border-blue-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </button>
              <button 
                onClick={() => navigate('/planning')}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Create New Sprint</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Project Header */}
        {/* {projectData && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-200/50 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{projectData.project_name}</h2>
                <p className="text-gray-600 mb-3">{projectData.description}</p>
                <div className="flex items-center space-x-6 text-sm text-gray-700">
                  <span><strong>Project ID:</strong> {projectData.project_id}</span>
                  <span><strong>Total Story Points:</strong> {projectData.total_estimated_story_points}</span>
                  <span><strong>Total Effort:</strong> {projectData.total_estimated_effort_hours}h</span>
                </div>
                <div className="mt-2 text-sm text-blue-600">
                  <span><strong>Duration:</strong> {formatDate(projectData.start_date)} - {formatDate(projectData.end_date)}</span>
                </div>
              </div>
              <div className="ml-6">
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">
                    {Math.round((projectData.user_stories?.filter(s => s.status === 'Done').length / (projectData.user_stories?.length || 1)) * 100)}%
                  </div>
                  <div className="text-sm text-gray-500">Project Progress</div>
                </div>
              </div>
            </div>
          </div>
        )} */}

        {/* Navigation Tabs */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-200/50 mb-8">
          <div className="border-b border-blue-200/50">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => handleTabChange('project')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'project'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>Project View</span>
                </div>
              </button>
              <button
                onClick={() => handleTabChange('epics')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'epics'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Epics View</span>
                </div>
              </button>
              <button
                onClick={() => handleTabChange('sprints')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'sprints'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Sprints View</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-700 text-sm">Error loading sprints: {error}</span>
            </div>
          </div>
        )}
        
        {/* Sprints Table */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-200/50 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Sprint Management
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-50 border-b border-purple-200">
                <tr>
                  <th className="w-12 px-6 py-4 text-left">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Duration</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Start Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">End Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Stories</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Story Points</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Team</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100">
                {sprints.map((sprint) => (
                  <tr key={sprint.id} className="hover:bg-purple-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox"
                        checked={sprint.selected}
                        onChange={() => handleCheckboxChange(sprint.id)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {sprint.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {sprint.days}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        sprint.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        sprint.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {sprint.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatDate(sprint.startDate)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatDate(sprint.endDate)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {sprint.storiesCount} stories
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {sprint.totalStoryPoints} points
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {sprint.resourcesCount} members
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleKanbanClick(sprint)}
                          data-sprint-id={sprint.id}
                          className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                        
                        <div className="relative">
                          <button
                            onClick={() => handleDropdownToggle(sprint.id)}
                            className="inline-flex items-center p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          {dropdownOpen === sprint.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                              <div className="py-1">
                                <button
                                  onClick={() => handleDropdownAction('edit', sprint)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Sprint
                                </button>
                                <button
                                  onClick={() => handleDropdownAction('start', sprint)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  disabled={sprint.status === 'In Progress'}
                                >
                                  <Play className="w-4 h-4 mr-2" />
                                  Start Sprint
                                </button>
                                <button
                                  onClick={() => handleDropdownAction('pause', sprint)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  disabled={sprint.status !== 'In Progress'}
                                >
                                  <Pause className="w-4 h-4 mr-2" />
                                  Pause Sprint
                                </button>
                                <button
                                  onClick={() => handleDropdownAction('archive', sprint)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Archive className="w-4 h-4 mr-2" />
                                  Archive Sprint
                                </button>
                                <div className="border-t border-gray-100"></div>
                                <button
                                  onClick={() => handleDropdownAction('delete', sprint)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Sprint
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {sprints.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <p className="text-gray-500 text-lg">No sprints found</p>
                <p className="text-gray-400 text-sm">Create your first sprint to get started</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4">
          <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Sprint</span>
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit Selected</span>
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Delete Selected</span>
          </button>
        </div>
        
        {/* Sprint Summary Cards */}
        {projectData && sprints.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-blue-200/50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Project Overview</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>Total Sprints: <span className="font-medium text-gray-800">{sprints.length}</span></div>
                    <div>Total Epics: <span className="font-medium text-gray-800">{projectData.epics?.length || 0}</span></div>
                    <div>Total User Stories: <span className="font-medium text-gray-800">{projectData.user_stories?.length || 0}</span></div>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-green-200/50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Progress Status</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>Not Started: <span className="font-medium text-gray-800">{sprints.filter(s => s.status === 'Not Started').length}</span></div>
                    <div>In Progress: <span className="font-medium text-blue-600">{sprints.filter(s => s.status === 'In Progress').length}</span></div>
                    <div>Completed: <span className="font-medium text-green-600">{sprints.filter(s => s.status === 'Completed').length}</span></div>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-purple-200/50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Resource Allocation</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>Team Members: <span className="font-medium text-gray-800">{projectData.resources?.length || 0}</span></div>
                    <div>Avg Stories/Sprint: <span className="font-medium text-purple-600">{sprints.length > 0 ? (projectData.user_stories?.length / sprints.length).toFixed(1) : 0}</span></div>
                    <div>Avg Points/Sprint: <span className="font-medium text-purple-600">{sprints.length > 0 ? (projectData.total_estimated_story_points / sprints.length).toFixed(1) : 0}</span></div>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Sprint Tools
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li><button onClick={() => navigate('/planning')} className="hover:text-white transition-colors">Sprint Planning</button></li>
                <li><button onClick={() => navigate('/board')} className="hover:text-white transition-colors">Sprint Board</button></li>
                <li><button onClick={() => navigate('/leave')} className="hover:text-white transition-colors">Leave Tracker</button></li>
                <li><button onClick={() => navigate('/reports')} className="hover:text-white transition-colors">Sprint Reports</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Project Management</h3>
              <ul className="space-y-2 text-gray-300">
                <li><button onClick={() => navigate('/view')} className="hover:text-white transition-colors">Project Overview</button></li>
                <li><button onClick={() => navigate('/epics')} className="hover:text-white transition-colors">Epic Management</button></li>
                <li><button className="hover:text-white transition-colors">Backlog Management</button></li>
                <li><button className="hover:text-white transition-colors">Release Planning</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Team & Resources</h3>
              <ul className="space-y-2 text-gray-300">
                <li><button className="hover:text-white transition-colors">Team Management</button></li>
                <li><button className="hover:text-white transition-colors">Capacity Planning</button></li>
                <li><button className="hover:text-white transition-colors">Resource Allocation</button></li>
                <li><button className="hover:text-white transition-colors">Performance Metrics</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Analytics & Reports</h3>
              <ul className="space-y-2 text-gray-300">
                <li><button className="hover:text-white transition-colors">Sprint Analytics</button></li>
                <li><button className="hover:text-white transition-colors">Velocity Charts</button></li>
                <li><button className="hover:text-white transition-colors">Burndown Reports</button></li>
                <li><button className="hover:text-white transition-colors">Export Data</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 mt-8 text-center text-gray-400">
            <p>&copy; 2025 PMRGSOLUTION. Sprint Management Excellence | Crafted with ❤️ for agile teams</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SprintManager;