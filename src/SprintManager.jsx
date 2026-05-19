import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  Archive,
  CheckCircle
} from 'lucide-react';

import pmrgLogo from '../src/assets/pmrglogo.png';
import API_ENDPOINTS from './Auths';

const SprintManager = () => {
  const navigate = useNavigate();

  const [sprints, setSprints] = useState([]);
  const [projectData, setProjectData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('sprints');
  const [dropdownOpen, setDropdownOpen] = useState(null);

  // ============================================
  // LOAD DATA
  // ============================================

  useEffect(() => {

  const storedSprintData =
    localStorage.getItem(
      'sprintManagerData'
    );

  const storedProjectData =
    localStorage.getItem(
      'projectData'
    );

  if (
    storedSprintData &&
    storedProjectData
  ) {

    try {

      const parsedSprintData =
        JSON.parse(storedSprintData);

      const parsedProjectData =
        JSON.parse(storedProjectData);

      setSprints(parsedSprintData);

      setProjectData(parsedProjectData);

      setIsLoading(false);

      return;

    } catch (error) {

      console.error(
        'Error restoring sprint data:',
        error
      );
    }
  }

  fetchSprints();

}, []);

  // ============================================
  // FETCH SPRINTS
  // ============================================

  const fetchSprints = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(API_ENDPOINTS.GET_SPRINTS, {
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

      const projectKeys = Object.keys(data);

      if (projectKeys.length === 0) {
        throw new Error('No projects found in API');
      }

      const firstProjectKey = projectKeys[0];

      const projectData = data[firstProjectKey].project_plan;

      setProjectData(projectData);
      localStorage.setItem(
        'projectData',
        JSON.stringify(projectData)
      );

      if (projectData.sprints && Array.isArray(projectData.sprints)) {
        const sprintList = projectData.sprints.map((sprint, index) => {

          const assignedStories = projectData.user_stories
            ? projectData.user_stories.filter(
                story => story.sprint_id === sprint.sprint_id
              )
            : [];

          // ============================================
          // IMPORTANT FIX
          // MANUAL STATUS
          // ============================================

          // const diffDays = sprint.duration_days || 14;
          let diffDays = '--';

          if (
            sprint.start_date &&
            sprint.end_date
          ) {

            const startDate = new Date(
              sprint.start_date
            );

            const endDate = new Date(
              sprint.end_date
            );

            const diffTime =
              Math.abs(endDate - startDate);

            diffDays =
              Math.ceil(
                diffTime /
                (1000 * 60 * 60 * 24)
              ) + 1;
          }
          // let diffDays = '--';

          //   if (
          //     sprint.start_date &&
          //     sprint.end_date
          //   ) {

          //     const startDate = new Date(
          //       sprint.start_date
          //     );

          //     const endDate = new Date(
          //       sprint.end_date
          //     );

          //     const diffTime =
          //       Math.abs(endDate - startDate);

          //     diffDays = Math.ceil(
          //       diffTime /
          //       (1000 * 60 * 60 * 24)
          //     );
          //   }

          const status = sprint.status || 'Not Started';

          return {
            id: sprint.sprint_id,
            name: sprint.name,

            days:
            diffDays !== '--'
              ? `${diffDays}d`
              : '--',

            status: status,

            startDate: sprint.start_date || null,
            endDate: sprint.end_date || null,

            selected: index === 0,

            color:
              index === 0
                ? 'bg-orange-200'
                : 'bg-gray-100',

            storiesCount: assignedStories.length,

            backlogCount: 0,

            resourcesCount:
              projectData.resources?.length || 0,

            totalStoryPoints: assignedStories.reduce(
              (sum, story) =>
                sum + (story.story_points || 0),
              0
            ),

            totalEffortHours: assignedStories.reduce(
              (sum, story) =>
                sum + (story.estimated_effort_hours || 0),
              0
            ),

            projectKey: firstProjectKey,
          };
        });

        setSprints(sprintList);

        localStorage.setItem(
          'sprintManagerData',
          JSON.stringify(sprintList)
        );
      } else {
        throw new Error('No sprints found');
      }
    } catch (error) {
      console.error('Error fetching sprints:', error);

      setError(error.message);

      setSprints([
        {
          id: 'default-1',
          name: 'Sprint 1',
          days: '14d',
          status: 'Not Started',
          startDate: null,
          endDate: null,
          selected: true,
          color: 'bg-orange-200',
          storiesCount: 0,
          backlogCount: 0,
          resourcesCount: 0,
          totalStoryPoints: 0,
          totalEffortHours: 0,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // FORMAT DATE
  // ============================================

  const formatDate = (dateString) => {
    if (!dateString) {
      return '--';
    }

    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: '2-digit',
    });
  };

  // ============================================
  // CHECKBOX
  // ============================================

  const handleCheckboxChange = (id) => {
    setSprints(
      sprints.map((sprint) =>
        sprint.id === id
          ? {
              ...sprint,
              selected: !sprint.selected,
            }
          : sprint
      )
    );
  };

  

  // ============================================
  // OPEN KANBAN BOARD
  // ============================================

  const handleKanbanClick = async (sprint) => {
    try {

      const button = document.querySelector(
        `button[data-sprint-id="${sprint.id}"]`
      );

      if (button) {
        button.disabled = true;

        button.innerHTML = `
          <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
        `;
      }

     if (
  projectData &&
  Array.isArray(projectData.user_stories)
) {

        const sprintStories = projectData.user_stories.filter(
          (story) => story.sprint_id === sprint.id
        );

        const storiesData = {
          assigned_stories: sprintStories.map((story) => ({
            story_id: story.story_id,

            epic_id: story.epic_id,

            title: story.name || 'Untitled Story',

            description: story.description || '',

            story_points: story.story_points || 0,

            estimated_effort_hours:
              story.estimated_effort_hours || 0,

            status: story.status || 'To Do',

            priority: story.priority || 'Medium',

            assigned_to:
              projectData.resources?.find(
                (r) =>
                  r.resource_id ===
                  story.assigned_to_resource_id
              )?.name || 'Unassigned',

            dependencies: story.dependencies || [],

            start_date: sprint.startDate,

            end_date: sprint.endDate,

            due_date: sprint.endDate,

            work_hours: `${
              story.estimated_effort_hours || 0
            }h`,

            duration: `${Math.ceil(
              (story.estimated_effort_hours || 0) / 8
            )}d`,

            role:
              projectData.resources?.find(
                (r) =>
                  r.resource_id ===
                  story.assigned_to_resource_id
              )?.role || 'Developer',
          })),

          backlog_stories: [],

          resources: projectData.resources || [],
        };

        console.log(
          `Stories data for ${sprint.name}:`,
          storiesData
        );

        localStorage.setItem(
          'selectedSprintData',
          JSON.stringify(storiesData)
        );
        localStorage.setItem(
          'projectData',
          JSON.stringify(projectData)
        );
      // localStorage.setItem(
      //   "sprint_runtime_data",
      //   JSON.stringify(updatedSprints)
      // );

        localStorage.setItem(
          'selectedSprintInfo',
          JSON.stringify({
            ...sprint,
            start: sprint.startDate,
            endDate: sprint.endDate,
          })
        );
        localStorage.setItem(
          'selectedSprintName',
          sprint.name
        );

        navigate('/board');

      } else {
        throw new Error('No project data available');
      }

    } catch (error) {

      console.error(
        'Error preparing sprint data:',
        error
      );

      alert(
        `Failed to load sprint data: ${error.message}`
      );

    } finally {

      const button = document.querySelector(
        `button[data-sprint-id="${sprint.id}"]`
      );

      if (button) {
        button.disabled = false;

        button.innerHTML = `
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12H9m12 0A9 9 0 1112 3a9 9 0 019 9z"
            />
          </svg>
          View
        `;
      }
    }
  };

  // ============================================
  // TAB CHANGE
  // ============================================

  const handleTabChange = (tab) => {
    setActiveTab(tab);

    if (tab === 'project') {
      navigate('/view');
    } else if (tab === 'epics') {
      navigate('/epics');
    }
  };

  // ============================================
  // DROPDOWN
  // ============================================

  const handleDropdownToggle = (sprintId) => {
    setDropdownOpen(
      dropdownOpen === sprintId
        ? null
        : sprintId
    );
  };

  // ============================================
  // STATUS UPDATE
  // ============================================

  // const updateSprintStatus = (sprintId, newStatus) => {

  //   const updatedSprints = sprints.map((sprint) =>
  //     sprint.id === sprintId
  //       ? {
  //           ...sprint,
  //           status: newStatus,
            
  //         }
  //       : sprint
  //   );

  //   setSprints(updatedSprints);

  //   localStorage.setItem(
  //     'sprintManagerData',
  //     JSON.stringify(updatedSprints)
  //   );
  // };
//   const updateSprintStatus = (sprintId, newStatus) => {

//   const updatedSprints = sprints.map((sprint) =>
//     sprint.id === sprintId
//       ? {
//           ...sprint,

//           status: newStatus,

//           startDate:
//             newStatus === 'In Progress'
//               ? (
//                   sprint.startDate ||
//                   new Date()
//                     .toISOString()
//                     .split('T')[0]
//                 )
//               : sprint.startDate,

//           endDate:
//             newStatus === 'Completed'
//               ? new Date()
//                   .toISOString()
//                   .split('T')[0]
//               : sprint.endDate,

//           days:
//             newStatus === 'Completed' &&
//             sprint.startDate
//               ? `${Math.ceil(
//                   (
//                     new Date() -
//                     new Date(sprint.startDate)
//                   ) /
//                   (1000 * 60 * 60 * 24)
//                 )}d`
//               : sprint.days
//         }
//       : sprint
//   );

//   setSprints(updatedSprints);

//   localStorage.setItem(
//     'sprintManagerData',
//     JSON.stringify(updatedSprints)
//   );
// };

const updateSprintStatus = (sprintId, newStatus) => {

  const updatedSprints = sprints.map((sprint) => {

    if (sprint.id !== sprintId) {
      return sprint;
    }

    const updatedSprint = {

      ...sprint,

      status: newStatus,

      startDate:
        newStatus === 'In Progress'
          ? (
              sprint.startDate ||
              new Date()
                .toISOString()
                .split('T')[0]
            )
          : sprint.startDate,

      endDate:
        newStatus === 'Completed'
          ? new Date()
              .toISOString()
              .split('T')[0]
          : sprint.endDate,
    };

    // duration calculate
    if (
      updatedSprint.startDate &&
      updatedSprint.endDate
    ) {

      const start = new Date(
        updatedSprint.startDate
      );

      const end = new Date(
        updatedSprint.endDate
      );

      const diffDays =
        Math.ceil(
          (end - start) /
          (1000 * 60 * 60 * 24)
        ) + 1;

      updatedSprint.days = `${diffDays}d`;
    }

    // IMPORTANT
    // UPDATE SELECTED SPRINT INFO ALSO

    localStorage.setItem(
      'selectedSprintInfo',
      JSON.stringify({
        ...updatedSprint,
        start: updatedSprint.startDate,
        end: updatedSprint.endDate,
      })
    );

    return updatedSprint;
  });

  setSprints(updatedSprints);

  localStorage.setItem(
    'sprintManagerData',
    JSON.stringify(updatedSprints)
  );
};
  // ============================================
  // DROPDOWN ACTIONS
  // ============================================

  const handleDropdownAction = (action, sprint) => {

    setDropdownOpen(null);

    switch (action) {

      case 'edit':
        console.log('Edit sprint:', sprint.id);
        break;

      case 'start':
        updateSprintStatus(
          sprint.id,
          'In Progress'
        );
        break;

      case 'pause':
        updateSprintStatus(
          sprint.id,
          'Paused'
        );
        break;

      case 'complete':
        updateSprintStatus(
          sprint.id,
          'Completed'
        );
        break;

      case 'archive':
        updateSprintStatus(
          sprint.id,
          'Archived'
        );
        break;

      case 'delete':

        if (
          window.confirm(
            `Delete ${sprint.name}?`
          )
        ) {

          const filtered = sprints.filter(
            (s) => s.id !== sprint.id
          );

          setSprints(filtered);

          localStorage.setItem(
            'sprintManagerData',
            JSON.stringify(filtered)
          );
        }

        break;

      default:
        break;
    }
  };

  // ============================================
  // STATUS COLOR
  // ============================================

  const getStatusColor = (status) => {

    switch (status) {

      case 'Completed':
        return 'bg-green-100 text-green-800';

      case 'In Progress':
        return 'bg-blue-100 text-blue-800';

      case 'Paused':
        return 'bg-yellow-100 text-yellow-800';

      case 'Archived':
        return 'bg-gray-200 text-gray-700';

      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // ============================================
  // LOADING SCREEN
  // ============================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">

        <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-blue-200/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-6">

            <div className="flex items-center justify-between">

              <div className="flex items-center space-x-4">

                <img
                  src={pmrgLogo}
                  alt="PMRG Logo"
                  className="w-50 h-30"
                />

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

            <p className="text-gray-600 text-lg">
              Loading sprint data...
            </p>

          </div>

        </div>

      </div>
    );
  }


  // ============================================
  // MAIN RETURN
  // ============================================

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">

      {/* ============================================
          HEADER
      ============================================ */}

      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-blue-200/50 sticky top-0 z-10">

        <div className="max-w-7xl mx-auto px-6 py-6">

          <div className="flex items-center justify-between">

            <div className="flex items-center space-x-4">

              <img
                src={pmrgLogo}
                alt="PMRG Logo"
                className="w-50 h-30"
              />

              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                <br />
                SPRINT MANAGER
              </h1>

            </div>

            <div className="flex items-center space-x-4">

              <button
                onClick={() => navigate('/planning')}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 transition-all duration-200 font-medium flex items-center space-x-2"
              >

                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />

                </svg>

                <span>Create New Sprint</span>

              </button>

            </div>

          </div>

        </div>

      </header>

      {/* ============================================
          MAIN CONTENT
      ============================================ */}

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* ============================================
            NAVIGATION TABS
        ============================================ */}

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-200/50 mb-8">

          <div className="border-b border-blue-200/50">

            <nav className="flex space-x-8 px-6">

              {/* PROJECT TAB */}

              <button
                onClick={() => handleTabChange('project')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'project'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >

                <div className="flex items-center space-x-2">

                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"
                    />

                  </svg>

                  <span>Project View</span>

                </div>

              </button>

              {/* EPICS TAB */}

              <button
                onClick={() => handleTabChange('epics')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'epics'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >

                <div className="flex items-center space-x-2">

                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6"
                    />

                  </svg>

                  <span>Epics View</span>

                </div>

              </button>

              {/* SPRINT TAB */}

              <button
                onClick={() => handleTabChange('sprints')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'sprints'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >

                <div className="flex items-center space-x-2">

                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />

                  </svg>

                  <span>Sprints View</span>

                </div>

              </button>

            </nav>

          </div>

        </div>

        {/* ============================================
            ERROR MESSAGE
        ============================================ */}

        {error && (

          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">

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
                  d="M12 8v4m0 4h.01"
                />

              </svg>

              <span className="text-red-700 text-sm">
                Error loading sprints: {error}
              </span>

            </div>

          </div>

        )}

        {/* ============================================
            SPRINT TABLE
        ============================================ */}

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-200/50 overflow-hidden">

          {/* TABLE HEADER */}

          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">

            <h2 className="text-xl font-bold text-white flex items-center">

              <svg
                className="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />

              </svg>

              Sprint Management

            </h2>

          </div>

          {/* TABLE */}

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

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Duration
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Start Date
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    End Date
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Stories
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Story Points
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Team
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-purple-100">

                {sprints.map((sprint) => (

                  <tr
                    key={sprint.id}
                    className="hover:bg-purple-50/50 transition-colors"
                  >

                    {/* CHECKBOX */}

                    <td className="px-6 py-4">

                      <input
                        type="checkbox"
                        checked={sprint.selected}
                        onChange={() =>
                          handleCheckboxChange(sprint.id)
                        }
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />

                    </td>

                    {/* NAME */}

                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">

                      {sprint.name}

                    </td>

                    

                    {/* DURATION */}

                    <td className="px-6 py-4 text-sm text-gray-700">

                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">

                        {sprint.days}

                      </span>

                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-4 text-sm">

                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          sprint.status
                        )}`}
                      >

                        {sprint.status}

                      </span>

                    </td>

                    {/* START DATE */}

                    <td className="px-6 py-4 text-sm text-gray-700">

                      {formatDate(sprint.startDate)}

                    </td>

                    {/* END DATE */}

                    <td className="px-6 py-4 text-sm text-gray-700">

                      {formatDate(sprint.endDate)}

                    </td>

                    {/* STORIES */}

                    <td className="px-6 py-4 text-sm text-gray-700">

                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">

                        {sprint.storiesCount} stories

                      </span>

                    </td>

                    {/* STORY POINTS */}

                    <td className="px-6 py-4 text-sm text-gray-700">

                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">

                        {sprint.totalStoryPoints} points

                      </span>

                    </td>

                    {/* TEAM */}

                    <td className="px-6 py-4 text-sm text-gray-700">

                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">

                        {sprint.resourcesCount} members

                      </span>

                    </td>

                    {/* ACTIONS */}

                    <td className="px-6 py-4">

                      <div className="flex items-center space-x-2">

                        {/* VIEW BUTTON */}

                        <button
                          onClick={() =>
                            handleKanbanClick(sprint)
                          }
                          data-sprint-id={sprint.id}
                          className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >

                          <Eye className="w-4 h-4 mr-1" />

                          View

                        </button>

                        {/* DROPDOWN */}

                        <div className="relative">

                          <button
                            onClick={() =>
                              handleDropdownToggle(
                                sprint.id
                              )
                            }
                            className="inline-flex items-center p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >

                            <MoreVertical className="w-4 h-4" />

                          </button>

                          {dropdownOpen === sprint.id && (

                            <div className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg border border-gray-200 z-10">

                              <div className="py-1">

                                {/* EDIT */}

                                <button
                                  onClick={() =>
                                    handleDropdownAction(
                                      'edit',
                                      sprint
                                    )
                                  }
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >

                                  <Edit className="w-4 h-4 mr-2" />

                                  Edit Sprint

                                </button>

                                {/* START */}

                                <button
                                  onClick={() =>
                                    handleDropdownAction(
                                      'start',
                                      sprint
                                    )
                                  }
                                  disabled={
                                    sprint.status ===
                                    'In Progress'
                                  }
                                  className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 ${
                                    sprint.status ===
                                    'In Progress'
                                      ? 'text-gray-400 cursor-not-allowed'
                                      : 'text-green-700'
                                  }`}
                                >

                                  <Play className="w-4 h-4 mr-2" />

                                  Start Sprint

                                </button>

                                {/* PAUSE */}

                                <button
                                  onClick={() =>
                                    handleDropdownAction(
                                      'pause',
                                      sprint
                                    )
                                  }
                                  disabled={
                                    sprint.status !==
                                    'In Progress'
                                  }
                                  className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 ${
                                    sprint.status !==
                                    'In Progress'
                                      ? 'text-gray-400 cursor-not-allowed'
                                      : 'text-yellow-700'
                                  }`}
                                >

                                  <Pause className="w-4 h-4 mr-2" />

                                  Pause Sprint

                                </button>

                                {/* COMPLETE */}

                                <button
                                  onClick={() =>
                                    handleDropdownAction(
                                      'complete',
                                      sprint
                                    )
                                  }
                                  disabled={
                                    sprint.status ===
                                    'Completed'
                                  }
                                  className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 ${
                                    sprint.status ===
                                    'Completed'
                                      ? 'text-gray-400 cursor-not-allowed'
                                      : 'text-blue-700'
                                  }`}
                                >

                                  <CheckCircle className="w-4 h-4 mr-2" />

                                  Complete Sprint

                                </button>

                                {/* ARCHIVE */}

                                <button
                                  onClick={() =>
                                    handleDropdownAction(
                                      'archive',
                                      sprint
                                    )
                                  }
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >

                                  <Archive className="w-4 h-4 mr-2" />

                                  Archive Sprint

                                </button>

                                {/* DELETE */}

                                <div className="border-t border-gray-100"></div>

                                <button
                                  onClick={() =>
                                    handleDropdownAction(
                                      'delete',
                                      sprint
                                    )
                                  }
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

            {/* EMPTY STATE */}

            {sprints.length === 0 && !isLoading && (

              <div className="text-center py-12">

                <svg
                  className="w-12 h-12 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7"
                  />

                </svg>

                <p className="text-gray-500 text-lg">
                  No sprints found
                </p>

                <p className="text-gray-400 text-sm">
                  Create your first sprint
                </p>

              </div>

            )}

          </div>

        </div>

        

        {/* ============================================
            SUMMARY CARDS
        ============================================ */}

        {projectData && sprints.length > 0 && (

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* PROJECT OVERVIEW */}

            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-blue-200/50 p-6">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Project Overview
                  </h3>

                  <div className="space-y-2 text-sm text-gray-600">

                    <div>
                      Total Sprints:{' '}
                      <span className="font-medium text-gray-800">
                        {sprints.length}
                      </span>
                    </div>

                    <div>
                      Total Epics:{' '}
                      <span className="font-medium text-gray-800">
                        {projectData.epics?.length || 0}
                      </span>
                    </div>

                    <div>
                      Total User Stories:{' '}
                      <span className="font-medium text-gray-800">
                        {projectData.user_stories?.length || 0}
                      </span>
                    </div>

                  </div>

                </div>

                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">

                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5"
                    />

                  </svg>

                </div>

              </div>

            </div>

            {/* STATUS OVERVIEW */}

            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-green-200/50 p-6">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Progress Status
                  </h3>

                  <div className="space-y-2 text-sm text-gray-600">

                    <div>
                      Not Started:{' '}
                      <span className="font-medium text-gray-800">
                        {
                          sprints.filter(
                            (s) =>
                              s.status === 'Not Started'
                          ).length
                        }
                      </span>
                    </div>

                    <div>
                      In Progress:{' '}
                      <span className="font-medium text-blue-600">
                        {
                          sprints.filter(
                            (s) =>
                              s.status === 'In Progress'
                          ).length
                        }
                      </span>
                    </div>

                    <div>
                      Paused:{' '}
                      <span className="font-medium text-yellow-600">
                        {
                          sprints.filter(
                            (s) =>
                              s.status === 'Paused'
                          ).length
                        }
                      </span>
                    </div>

                    <div>
                      Completed:{' '}
                      <span className="font-medium text-green-600">
                        {
                          sprints.filter(
                            (s) =>
                              s.status === 'Completed'
                          ).length
                        }
                      </span>
                    </div>

                  </div>

                </div>

                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">

                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4"
                    />

                  </svg>

                </div>

              </div>

            </div>

            {/* RESOURCE OVERVIEW */}

            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-purple-200/50 p-6">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Resource Allocation
                  </h3>

                  <div className="space-y-2 text-sm text-gray-600">

                    <div>
                      Team Members:{' '}
                      <span className="font-medium text-gray-800">
                        {projectData.resources?.length || 0}
                      </span>
                    </div>

                    <div>
                      Avg Stories/Sprint:{' '}
                      <span className="font-medium text-purple-600">
                        {sprints.length > 0
                          ? (
                              (projectData.user_stories
                                ?.length || 0) /
                              sprints.length
                            ).toFixed(1)
                          : 0}
                      </span>
                    </div>

                    <div>
                      Avg Points/Sprint:{' '}
                      <span className="font-medium text-purple-600">
                        {sprints.length > 0
                          ? (
                              (projectData.total_estimated_story_points || 0) /
                              sprints.length
                            ).toFixed(1)
                          : 0}
                      </span>
                    </div>

                  </div>

                </div>

                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">

                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292"
                    />

                  </svg>

                </div>

              </div>

            </div>

          </div>

        )}

      </main>

      {/* ============================================
          FOOTER
      ============================================ */}

      <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-white mt-16">

        <div className="max-w-7xl mx-auto px-6 py-8">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

            {/* COLUMN 1 */}

            <div>

              <h3 className="text-lg font-semibold mb-4 flex items-center">

                <img
                  src={pmrgLogo}
                  alt="PMRG Logo"
                  className="w-20 h-10 mr-2"
                />

                Sprint Tools

              </h3>

              <ul className="space-y-2 text-gray-300">

                <li>
                  <button
                    onClick={() => navigate('/planning')}
                    className="hover:text-white transition-colors"
                  >
                    Sprint Planning
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => navigate('/board')}
                    className="hover:text-white transition-colors"
                  >
                    Sprint Board
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => navigate('/leave')}
                    className="hover:text-white transition-colors"
                  >
                    Leave Tracker
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => navigate('/reports')}
                    className="hover:text-white transition-colors"
                  >
                    Sprint Reports
                  </button>
                </li>

              </ul>

            </div>

            {/* COLUMN 2 */}

            <div>

              <h3 className="text-lg font-semibold mb-4">
                Project Management
              </h3>

              <ul className="space-y-2 text-gray-300">

                <li>
                  <button
                    onClick={() => navigate('/view')}
                    className="hover:text-white transition-colors"
                  >
                    Project Overview
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => navigate('/epics')}
                    className="hover:text-white transition-colors"
                  >
                    Epic Management
                  </button>
                </li>

                <li>
                  <button className="hover:text-white transition-colors">
                    Backlog Management
                  </button>
                </li>

                <li>
                  <button className="hover:text-white transition-colors">
                    Release Planning
                  </button>
                </li>

              </ul>

            </div>

            {/* COLUMN 3 */}

            <div>

              <h3 className="text-lg font-semibold mb-4">
                Team & Resources
              </h3>

              <ul className="space-y-2 text-gray-300">

                <li>
                  <button className="hover:text-white transition-colors">
                    Team Management
                  </button>
                </li>

                <li>
                  <button className="hover:text-white transition-colors">
                    Capacity Planning
                  </button>
                </li>

                <li>
                  <button className="hover:text-white transition-colors">
                    Resource Allocation
                  </button>
                </li>

                <li>
                  <button className="hover:text-white transition-colors">
                    Performance Metrics
                  </button>
                </li>

              </ul>

            </div>

            {/* COLUMN 4 */}

            <div>

              <h3 className="text-lg font-semibold mb-4">
                Analytics & Reports
              </h3>

              <ul className="space-y-2 text-gray-300">

                <li>
                  <button className="hover:text-white transition-colors">
                    Sprint Analytics
                  </button>
                </li>

                <li>
                  <button className="hover:text-white transition-colors">
                    Velocity Charts
                  </button>
                </li>

                <li>
                  <button className="hover:text-white transition-colors">
                    Burndown Reports
                  </button>
                </li>

                <li>
                  <button className="hover:text-white transition-colors">
                    Export Data
                  </button>
                </li>

              </ul>

            </div>

          </div>

          {/* COPYRIGHT */}

          <div className="border-t border-gray-700 pt-6 mt-8 text-center text-gray-400">

            <p>
              &copy; 2025 PMRGSOLUTION.
              Sprint Management Excellence
              | Crafted with ❤️ for agile teams
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
};

export default SprintManager;