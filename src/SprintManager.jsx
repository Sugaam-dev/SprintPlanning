import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SprintManager = () => {
  const navigate = useNavigate();
  const [sprints, setSprints] = useState([]);
  const [sprintData, setSprintData] = useState(null);
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
      
      const response = await fetch('http://127.0.0.1:8000/sprints', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      // console.log('Fetched sprints data:', data);
      
      // Store the complete data
      setSprintData(data);
      
      // Process the data to create sprint list for the table
      const sprintList = Object.keys(data).map((key, index) => ({
        id: key,
        name: `Sprint ${index + 1}`,
        days: '10d', // Default duration, can be calculated if needed
        status: 'Not Started/Plan', // Default start date, can be dynamic
        // endDate: 'Sun 9/25/25', // Default end date, can be calculated
        selected: index === 0, // First sprint selected by default
        color: index === 0 ? 'bg-orange-200' : 'bg-gray-100',
        storiesCount: data[key].assigned_stories?.length || 0,
        backlogCount: data[key].backlog_stories?.length || 0,
        resourcesCount: data[key].resources?.length || 0
      }));
      
      setSprints(sprintList);
      
    } catch (error) {
      console.error('Error fetching sprints:', error);
      setError(error.message);
      
      // Fallback to default data if API fails
      setSprints([
        {
          id: 'default-1',
          name: 'Sprint 1',
          days: '10d',
          status: 'Not Started/Plan',
          endDate: 'Sun 9/25/25',
          selected: true,
          color: 'bg-orange-200',
          storiesCount: 0,
          backlogCount: 0,
          resourcesCount: 0
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

      // Fetch specific sprint stories
      const response = await fetch(`http://127.0.0.1:8000/stories/${sprint.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const storiesData = await response.json();
      console.log(`Fetched stories for sprint ${sprint.name}:`, storiesData);
      
      // Store both sprint info and stories data in localStorage for the board page
      localStorage.setItem('selectedSprintData', JSON.stringify(storiesData));
      localStorage.setItem('selectedSprintInfo', JSON.stringify(sprint));
      
      // Navigate to board
      navigate('/board');
      
    } catch (error) {
      console.error('Error fetching sprint stories:', error);
      alert(`Failed to load sprint stories: ${error.message}`);
      
      // Fallback: use cached data if available
      if (sprintData && sprintData[sprint.id]) {
        localStorage.setItem('selectedSprintData', JSON.stringify(sprintData[sprint.id]));
        localStorage.setItem('selectedSprintInfo', JSON.stringify(sprint));
        navigate('/board');
      }
    } finally {
      // Reset button state
      const button = document.querySelector(`button[data-sprint-id="${sprint.id}"]`);
      if (button) {
        button.disabled = false;
        button.innerHTML = 'KANBAN';
      }
    }
  };

  const handleRefresh = () => {
    fetchSprints();
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
            onClick={() => navigate('/sprintplanning')}
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
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Days</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              {/* <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">End Date</th> */}
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Stories</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Backlog</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Team</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">KANBAN BROAD</th>
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
                <td className="px-4 py-3 text-sm text-gray-700">
                  {sprint.status}
                </td>
                {/* <td className="px-4 py-3 text-sm text-gray-700">
                  {sprint.endDate}
                </td> */}
                <td className="px-4 py-3 text-sm text-gray-700">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {sprint.storiesCount} stories
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {sprint.backlogCount} items
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
                    VEIW
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
      
      {/* Debug Panel - Remove in production */}
      {sprintData && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Debug: API Response Preview</h3>
          <div className="text-xs text-gray-600 bg-white p-2 rounded border max-h-32 overflow-y-auto">
            <pre>{JSON.stringify(Object.keys(sprintData), null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default SprintManager;