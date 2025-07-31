import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SprintManager = () => {
  const navigate = useNavigate();
  const [sprints, setSprints] = useState([]);
  const [projectData, setProjectData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
        button.innerHTML = 'VIEW';
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

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading sprints...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Project Header */}
      {projectData && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <h2 className="text-xl font-bold text-gray-800 mb-2">{projectData.project_name}</h2>
          <p className="text-gray-600 text-sm mb-2">{projectData.description}</p>
          <div className="flex items-center space-x-6 text-sm text-gray-700">
            <span><strong>Project ID:</strong> {projectData.project_id}</span>
            <span><strong>Total Story Points:</strong> {projectData.total_estimated_story_points}</span>
            <span><strong>Total Effort:</strong> {projectData.total_estimated_effort_hours}h</span>
            <span><strong>Duration:</strong> {formatDate(projectData.start_date)} - {formatDate(projectData.end_date)}</span>
          </div>
          <div className="mt-2 text-xs text-blue-600">
            <span><strong>Vision:</strong> {projectData.product_vision}</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Manage Sprints</h1>
        <div className="flex gap-3">
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Refresh
          </button>
          <button 
            onClick={() => navigate('/planning')}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Create New Sprint
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700 text-sm">Error loading sprints: {error}</span>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-12 px-4 py-3 text-left">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Duration</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Start Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">End Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Stories</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Story Points</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Team</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sprints.map((sprint) => (
              <tr key={sprint.id} className={`${sprint.color} hover:bg-opacity-80 transition-colors duration-150`}>
                <td className="px-4 py-3">
                  <input 
                    type="checkbox"
                    checked={sprint.selected}
                    onChange={() => handleCheckboxChange(sprint.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                  {sprint.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {sprint.days}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    sprint.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    sprint.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {sprint.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {formatDate(sprint.startDate)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {formatDate(sprint.endDate)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {sprint.storiesCount} stories
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {sprint.totalStoryPoints} points
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {sprint.resourcesCount} members
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleKanbanClick(sprint)}
                    data-sprint-id={sprint.id}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[70px] h-8 flex items-center justify-center"
                  >
                    VIEW
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {sprints.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <p className="text-gray-500 text-lg">No sprints found</p>
            <p className="text-gray-400 text-sm">Create your first sprint to get started</p>
          </div>
        )}
      </div>
      
      <div className="mt-6 flex gap-3">
        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
          Add Sprint
        </button>
        <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
          Edit Selected
        </button>
        <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
          Delete Selected
        </button>
      </div>
      
      {/* Sprint Summary Cards */}
      {projectData && sprints.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Project Overview</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div>Total Sprints: <span className="font-medium text-gray-800">{sprints.length}</span></div>
              <div>Total Epics: <span className="font-medium text-gray-800">{projectData.epics?.length || 0}</span></div>
              <div>Total User Stories: <span className="font-medium text-gray-800">{projectData.user_stories?.length || 0}</span></div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Progress Status</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div>Not Started: <span className="font-medium text-gray-800">{sprints.filter(s => s.status === 'Not Started').length}</span></div>
              <div>In Progress: <span className="font-medium text-gray-800">{sprints.filter(s => s.status === 'In Progress').length}</span></div>
              <div>Completed: <span className="font-medium text-gray-800">{sprints.filter(s => s.status === 'Completed').length}</span></div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Resource Allocation</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div>Team Members: <span className="font-medium text-gray-800">{projectData.resources?.length || 0}</span></div>
              <div>Avg Stories/Sprint: <span className="font-medium text-gray-800">{(projectData.user_stories?.length / sprints.length).toFixed(1)}</span></div>
              <div>Avg Points/Sprint: <span className="font-medium text-gray-800">{(projectData.total_estimated_story_points / sprints.length).toFixed(1)}</span></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Debug Panel - Remove in production */}
      {projectData && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Debug: Project Data Preview</h3>
          <div className="text-xs text-gray-600 bg-white p-2 rounded border max-h-32 overflow-y-auto">
            <div>Project ID: {projectData.project_id}</div>
            <div>Project Name: {projectData.project_name}</div>
            <div>Sprints: {projectData.sprints?.length || 0}</div>
            <div>User Stories: {projectData.user_stories?.length || 0}</div>
            <div>Resources: {projectData.resources?.length || 0}</div>
            <div>Epics: {projectData.epics?.length || 0}</div>
            <div>Tasks: {projectData.tasks?.length || 0}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SprintManager;