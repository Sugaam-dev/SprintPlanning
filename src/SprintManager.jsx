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

// ─── date helpers ───────────────────────────────────────────────────────────
const isoToInput = (iso) => {
  if (!iso) return '';
  return (iso || '').split('T')[0];
};

const today = () => new Date().toISOString().split('T')[0];

const addDays = (dateStr, days) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

const daysBetween = (a, b) => {
  if (!a || !b) return null;
  return Math.ceil((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24)) + 1;
};

const SprintManager = () => {
  const navigate = useNavigate();

  const [sprints,          setSprints]          = useState([]);
  const [projectData,      setProjectData]      = useState(null);
  const [projectMeta,      setProjectMeta]      = useState(null); // DB-level fields: created_at, status, name
  const [activeProjectId,  setActiveProjectId]  = useState(null);
  const [isLoading,        setIsLoading]        = useState(true);
  const [error,            setError]            = useState(null);
  const [activeTab,        setActiveTab]        = useState('sprints');
  const [dropdownOpen,     setDropdownOpen]     = useState(null);
  const [sprintLocalDates, setSprintLocalDates] = useState({});  // { sprintId: { startDate, endDate } }
  const [savingSprintDate, setSavingSprintDate] = useState({});  // { sprintId: 'saving'|'saved'|null }

  // ============================================
  // LOAD DATA — read activeProjectId from localStorage
  // ============================================

  useEffect(() => {
    const projectId = localStorage.getItem('activeProjectId');

    // If no active project, redirect to projects page
    if (!projectId) {
      navigate('/projects');
      return;
    }

    setActiveProjectId(projectId);

    // Try restoring cached data for THIS specific project
    const storedSprintData   = localStorage.getItem('sprintManagerData');
    const storedProjectData  = localStorage.getItem('projectData');
    const storedProjectIdKey = localStorage.getItem('cachedProjectId');
    const storedProjectMeta  = localStorage.getItem('projectMeta');

    if (
      storedSprintData &&
      storedProjectData &&
      storedProjectIdKey === projectId
    ) {
      try {
        const parsedSprints = JSON.parse(storedSprintData).map((s) => {
          if (s.startDate && s.endDate && s.startDate > s.endDate) {
            const projectMinDate = isoToInput(JSON.parse(storedProjectMeta || '{}').created_at) || today();
            const fourteenDaysAgo = addDays(s.endDate, -13);
            if (fourteenDaysAgo >= projectMinDate) {
              s.startDate = fourteenDaysAgo;
            } else {
              s.startDate = projectMinDate <= s.endDate ? projectMinDate : s.endDate;
            }
          }
          if (s.startDate && s.endDate) {
            const start = new Date(s.startDate);
            const end   = new Date(s.endDate);
            const d     = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);
            s.days = `${d}d`;
          }
          return s;
        });

        setSprints(parsedSprints);
        setProjectData(JSON.parse(storedProjectData));
        if (storedProjectMeta) {
          setProjectMeta(JSON.parse(storedProjectMeta));
        }

        // Seed sprintLocalDates from cached sprints
        const dates = {};
        parsedSprints.forEach((s) => {
          dates[s.id] = { startDate: s.startDate || '', endDate: s.endDate || '' };
        });
        setSprintLocalDates(dates);

        setIsLoading(false);
        return;
      } catch (e) {
        console.error('Error restoring sprint data:', e);
      }
    }

    fetchSprints(projectId);
  }, []);

  // ============================================
  // FETCH SPRINTS
  // ============================================

  const fetchSprints = async (projectId) => {
    try {
      setIsLoading(true);
      setError(null);

      const url = API_ENDPOINTS.GET_PROJECT(projectId);
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Fetched project data:', data);

      // GET /projects/{id} returns { project_id, name, project_plan, ... }
      const projectPlan = data.project_plan;

      setProjectData(projectPlan);
      const meta = {
        created_at: data.created_at,
        name: data.name,
        status: data.status,
      };
      setProjectMeta(meta);
      localStorage.setItem('projectMeta', JSON.stringify(meta));
      localStorage.setItem('projectData', JSON.stringify(projectPlan));
      localStorage.setItem('cachedProjectId', projectId);

      if (projectPlan.sprints && Array.isArray(projectPlan.sprints)) {
        const sprintList = projectPlan.sprints.map((sprint, index) => {

          const assignedStories = projectPlan.user_stories
            ? projectPlan.user_stories.filter(
                story => story.sprint_id === sprint.sprint_id
              )
            : [];

          let startDate = sprint.start_date || null;
          let endDate   = sprint.end_date || null;

          if (startDate && endDate && startDate > endDate) {
            const projectMinDate = isoToInput(data.created_at) || today();
            const fourteenDaysAgo = addDays(endDate, -13);
            if (fourteenDaysAgo >= projectMinDate) {
              startDate = fourteenDaysAgo;
            } else {
              startDate = projectMinDate <= endDate ? projectMinDate : endDate;
            }
          }

          let diffDays = '--';
          if (startDate && endDate) {
            const start = new Date(startDate);
            const end   = new Date(endDate);
            const computedDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);
            diffDays = `${computedDays}d`;
          }

          return {
            id:          sprint.sprint_id,
            name:        sprint.name,
            days:        diffDays !== '--' ? diffDays : `${sprint.duration_days || 14}d`,
            status:      sprint.status || 'Not Started',
            startDate:   startDate,
            endDate:     endDate,
            selected:    index === 0,
            color:       index === 0 ? 'bg-orange-200' : 'bg-gray-100',
            storiesCount:       assignedStories.length,
            backlogCount:       0,
            resourcesCount:     projectPlan.resources?.length || 0,
            totalStoryPoints:   assignedStories.reduce((s, st) => s + (st.story_points || 0), 0),
            totalEffortHours:   assignedStories.reduce((s, st) => s + (st.estimated_effort_hours || 0), 0),
            projectKey:  projectId,
          };
        });

        setSprints(sprintList);
        localStorage.setItem('sprintManagerData', JSON.stringify(sprintList));

        // Seed sprintLocalDates
        const dates = {};
        sprintList.forEach((s) => {
          dates[s.id] = { startDate: s.startDate || '', endDate: s.endDate || '' };
        });
        setSprintLocalDates(dates);
      } else {
        throw new Error('No sprints found in project');
      }

    } catch (err) {
      console.error('Error fetching project:', err);
      setError(err.message);
      setSprints([]);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // SAVE SPRINT DATE FROM MANAGER TABLE
  // ============================================

  const saveSprintDateField = async (sprintId, field, value) => {
    const projectId = localStorage.getItem('activeProjectId');
    if (!projectId) return;

    const sprint    = sprints.find((s) => s.id === sprintId);
    if (!sprint) return;

    const cur       = sprintLocalDates[sprintId] || {};
    const startDate = cur.startDate || (field === 'startDate' ? value : sprint.startDate || '');
    const endDate   = cur.endDate   || (field === 'endDate'   ? value : sprint.endDate   || '');

    // Validation: end must be >= start
    if (startDate && endDate && endDate < startDate) {
      alert(`End date (${endDate}) cannot be before start date (${startDate}). Please correct the dates.`);
      return;
    }

    // Validation: cannot be less than project creation date
    const creationDate = isoToInput(projectMeta?.created_at || projectData?.created_at) || today();
    if (startDate && startDate < creationDate) {
      alert(`Start date (${startDate}) cannot be before project creation date (${creationDate}). Please correct the dates.`);
      return;
    }
    if (endDate && endDate < creationDate) {
      alert(`End date (${endDate}) cannot be before project creation date (${creationDate}). Please correct the dates.`);
      return;
    }

    let diffDays = sprint.days;
    if (startDate && endDate) {
      const d = daysBetween(startDate, endDate);
      if (d !== null) {
        diffDays = `${d}d`;
      }
    }

    // Update sprints state and cache
    let updatedSprints = [];
    setSprints((prev) => {
      updatedSprints = prev.map((s) =>
        s.id === sprintId ? { ...s, startDate, endDate, days: diffDays } : s
      );
      localStorage.setItem('sprintManagerData', JSON.stringify(updatedSprints));
      return updatedSprints;
    });

    setSavingSprintDate((p) => ({ ...p, [sprintId]: 'saving' }));
    try {
      await fetch(API_ENDPOINTS.UPDATE_SPRINT_STATUS(projectId, sprintId), {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          status:     sprint.status || 'Not Started',
          start_date: startDate,
          end_date:   endDate,
        }),
      });
      setSavingSprintDate((p) => ({ ...p, [sprintId]: 'saved' }));
      setTimeout(() => setSavingSprintDate((p) => ({ ...p, [sprintId]: null })), 2500);
    } catch (err) {
      console.error('Failed to save sprint date:', err);
      setSavingSprintDate((p) => ({ ...p, [sprintId]: 'error' }));
    }
  };


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

  assigned_stories: sprintStories.map((story) => {

    // ============================================
    // STORY STATUS / SPRINT STATUS → BOARD STATUS
    // ============================================

    let updatedStatus = 'To Do';
    const validColumns = ['To Do', 'In Progress', 'Blocked', 'Done'];

    if (story.status) {
      const matchedCol = validColumns.find(
        (col) => col.toLowerCase() === story.status.toLowerCase()
      );
      if (matchedCol) {
        updatedStatus = matchedCol;
      } else {
        if (story.status.toLowerCase() === 'completed' || story.status.toLowerCase() === 'complete') {
          updatedStatus = 'Done';
        } else if (story.status.toLowerCase() === 'todo' || story.status.toLowerCase() === 'not started') {
          updatedStatus = 'To Do';
        } else if (story.status.toLowerCase() === 'paused') {
          updatedStatus = 'Blocked';
        }
      }
    } else {
      if (sprint.status === 'Completed') {
        updatedStatus = 'Done';
      } else if (sprint.status === 'In Progress') {
        updatedStatus = 'In Progress';
      } else if (sprint.status === 'Blocked' || sprint.status === 'Paused') {
        updatedStatus = 'Blocked';
      } else {
        updatedStatus = 'To Do';
      }
    }

    return {

      story_id: story.story_id,

      epic_id: story.epic_id,

      title: story.name || 'Untitled Story',

      description:
        story.description || '',

      story_points:
        story.story_points || 0,

      estimated_effort_hours:
        story.estimated_effort_hours || 0,

      // ============================================
      // UPDATED STATUS
      // ============================================

      status: updatedStatus,

      priority:
        story.priority || 'Medium',

      assigned_to:
        projectData.resources?.find(
          (r) =>
            r.resource_id ===
            story.assigned_to_resource_id
        )?.name || 'Unassigned',

      dependencies:
        story.dependencies || [],

      start_date:
        sprint.startDate,

      end_date:
        sprint.endDate,

      due_date:
        sprint.endDate,

      work_hours: `${
        story.estimated_effort_hours || 0
      }h`,

      duration: `${Math.ceil(
        (
          story.estimated_effort_hours || 0
        ) / 8
      )}d`,

      role:
        projectData.resources?.find(
          (r) =>
            r.resource_id ===
            story.assigned_to_resource_id
        )?.role || 'Developer',
    };

  }),

  backlog_stories: [],

  resources:
    projectData.resources || [],
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

       const latestSprintData =
  sprints.find(
    (s) => s.id === sprint.id
  ) || sprint;

localStorage.setItem(
  'selectedSprintInfo',
  JSON.stringify({
    ...latestSprintData,
    start: latestSprintData.startDate,
    endDate: latestSprintData.endDate,
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
          ? (sprint.startDate || new Date().toISOString().split('T')[0])
          : sprint.startDate,
      endDate:
        newStatus === 'Completed'
          ? new Date().toISOString().split('T')[0]
          : sprint.endDate,
    };

    // Auto-adjust start date if start date is after end date (preserves start <= end)
    if (updatedSprint.startDate && updatedSprint.endDate && updatedSprint.startDate > updatedSprint.endDate) {
      const projectMinDate = isoToInput(projectMeta?.created_at || projectData?.created_at) || today();
      const fourteenDaysAgo = addDays(updatedSprint.endDate, -13);
      if (fourteenDaysAgo >= projectMinDate) {
        updatedSprint.startDate = fourteenDaysAgo;
      } else {
        updatedSprint.startDate = projectMinDate <= updatedSprint.endDate ? projectMinDate : updatedSprint.endDate;
      }
    }

    if (updatedSprint.startDate && updatedSprint.endDate) {
      const start   = new Date(updatedSprint.startDate);
      const end     = new Date(updatedSprint.endDate);
      const diffDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);
      updatedSprint.days = `${diffDays}d`;
    }

    // Update sprintLocalDates state so the UI calendar pickers are perfectly synced
    setSprintLocalDates((prev) => ({
      ...prev,
      [sprintId]: {
        startDate: updatedSprint.startDate,
        endDate:   updatedSprint.endDate,
      },
    }));

    // Persist sprint status to the DB
    const projectId = localStorage.getItem('activeProjectId');
    if (projectId) {
      fetch(API_ENDPOINTS.UPDATE_SPRINT_STATUS(projectId, sprintId), {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status:     newStatus,
          start_date: updatedSprint.startDate,
          end_date:   updatedSprint.endDate,
        }),
      }).catch(err => console.error('Failed to persist sprint status:', err));
    }

    localStorage.setItem(
      'selectedSprintInfo',
      JSON.stringify({
        ...updatedSprint,
        start: updatedSprint.startDate,
        end:   updatedSprint.endDate,
      })
    );

    return updatedSprint;
  });

  setSprints(updatedSprints);
  localStorage.setItem('sprintManagerData', JSON.stringify(updatedSprints));
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
                onClick={() => navigate('/projects')}
                className="px-4 py-2 border border-indigo-300 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all duration-200 font-medium flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>All Projects</span>
              </button>

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

          <div className="w-full overflow-hidden">

            <table className="w-full">

              <thead className="bg-purple-50 border-b border-purple-200">

                <tr>

                  <th className="px-3 py-4 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>

                  <th className="px-2.5 py-4 text-center text-sm font-semibold text-gray-700">
                    Duration
                  </th>

                  <th className="px-2.5 py-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>

                  <th className="px-3 py-4 text-left text-sm font-semibold text-gray-700">
                    Start Date
                  </th>

                  <th className="px-3 py-4 text-left text-sm font-semibold text-gray-700">
                    End Date
                  </th>

                  <th className="px-2.5 py-4 text-center text-sm font-semibold text-gray-700">
                    Stories
                  </th>

                  <th className="px-2.5 py-4 text-center text-sm font-semibold text-gray-700">
                    Story Points
                  </th>

                  <th className="px-2.5 py-4 text-center text-sm font-semibold text-gray-700">
                    Team
                  </th>

                  <th className="px-3 py-4 text-left text-sm font-semibold text-gray-700">
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

                    {/* NAME */}

                    <td className="px-3 py-4 text-sm text-gray-900 font-medium text-left">

                      {sprint.name}

                    </td>

                    {/* DURATION */}

                    <td className="px-2.5 py-4 text-sm text-gray-700 text-center">

                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">

                        {sprint.days}

                      </span>

                    </td>

                    {/* STATUS */}

                    <td className="px-2.5 py-4 text-sm text-left">

                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          sprint.status
                        )}`}
                      >

                        {sprint.status}

                      </span>

                    </td>

                    {/* START DATE — editable */}

                    <td className="px-3 py-4 text-sm text-gray-700 text-left">
                      <div className="flex items-center gap-1.5 justify-start">
                        <input
                          type="date"
                          value={sprintLocalDates[sprint.id]?.startDate || sprint.startDate || ''}
                          min={isoToInput(projectMeta?.created_at || projectData?.created_at) || today()}
                          max={sprintLocalDates[sprint.id]?.endDate || sprint.endDate || undefined}
                          onChange={(e) => {
                            const val = e.target.value;
                            const projectMinDate = isoToInput(projectMeta?.created_at || projectData?.created_at) || today();
                            setSprintLocalDates((p) => {
                              const cur = p[sprint.id] || {};
                              const curEnd = cur.endDate || sprint.endDate || '';
                              const updates = { ...cur, startDate: val };

                              if (val && val < projectMinDate) {
                                updates.startDate = projectMinDate;
                              }

                              if (updates.startDate && curEnd && updates.startDate > curEnd) {
                                updates.endDate = addDays(updates.startDate, 13);
                              }
                              return { ...p, [sprint.id]: updates };
                            });
                          }}
                          onBlur={(e) => {
                            const val = sprintLocalDates[sprint.id]?.startDate || e.target.value;
                            if (val) {
                              saveSprintDateField(sprint.id, 'startDate', val);
                            }
                          }}
                          className="w-32 text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white text-gray-700 cursor-pointer hover:border-indigo-300 transition-colors"
                        />
                        {savingSprintDate[sprint.id] === 'saving' && (
                          <svg className="w-3 h-3 text-indigo-400 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        )}
                        {savingSprintDate[sprint.id] === 'saved' && (
                          <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </td>

                    {/* END DATE — editable */}

                    <td className="px-3 py-4 text-sm text-gray-700 text-left">
                      <input
                        type="date"
                        value={sprintLocalDates[sprint.id]?.endDate || sprint.endDate || ''}
                        min={sprintLocalDates[sprint.id]?.startDate || sprint.startDate || isoToInput(projectMeta?.created_at || projectData?.created_at) || today()}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSprintLocalDates((p) => {
                            const cur = p[sprint.id] || {};
                            const updates = { ...cur, endDate: val };
                            const projectMinDate = isoToInput(projectMeta?.created_at || projectData?.created_at) || today();
                            const curStart = cur.startDate || sprint.startDate || projectMinDate;
                            if (val && val < curStart) {
                              updates.endDate = curStart;
                            }
                            return { ...p, [sprint.id]: updates };
                          });
                        }}
                        onBlur={(e) => {
                          const val = sprintLocalDates[sprint.id]?.endDate || e.target.value;
                          if (val) {
                            saveSprintDateField(sprint.id, 'endDate', val);
                          }
                        }}
                        className="w-32 text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white text-gray-700 cursor-pointer hover:border-indigo-300 transition-colors"
                      />
                    </td>

                    {/* STORIES */}

                    <td className="px-2.5 py-4 text-sm text-gray-700 text-center">

                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">

                        {sprint.storiesCount} stories

                      </span>

                    </td>

                    {/* STORY POINTS */}

                    <td className="px-2.5 py-4 text-sm text-gray-700 text-center">

                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">

                        {sprint.totalStoryPoints} points

                      </span>

                    </td>

                    {/* TEAM */}

                    <td className="px-2.5 py-4 text-sm text-gray-700 text-center">

                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">

                        {sprint.resourcesCount} members

                      </span>

                    </td>

                    {/* ACTIONS */}

                    <td className="px-3 py-4 text-left">

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