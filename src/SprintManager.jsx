import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  Archive,
  CheckCircle,
} from "lucide-react";
import { createPortal } from "react-dom";

import pmrgLogo from "../src/assets/pmrglogo.png";
import API_ENDPOINTS from "./Auths";

// ─── date helpers ───────────────────────────────────────────────────────────
const isoToInput = (iso) => {
  if (!iso) return "";
  return (iso || "").split("T")[0];
};

const today = () => new Date().toISOString().split("T")[0];

const addDays = (dateStr, days) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

const daysBetween = (a, b) => {
  if (!a || !b) return null;
  return Math.ceil((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24)) + 1;
};

const SprintManager = () => {
  const navigate = useNavigate();

  const [sprints, setSprints] = useState([]);
  const [projectData, setProjectData] = useState(null);
  const [projectMeta, setProjectMeta] = useState(null); // DB-level fields: created_at, status, name
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("sprints");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [sprintLocalDates, setSprintLocalDates] = useState({}); // { sprintId: { startDate, endDate } }
  const [savingSprintDate, setSavingSprintDate] = useState({}); // { sprintId: 'saving'|'saved'|null }
  const [dropdownCoords, setDropdownCoords] = useState({ top: 0, right: 0 });
  // ============================================
  // LOAD DATA — read activeProjectId from localStorage
  // ============================================

  useEffect(() => {
    const projectId = localStorage.getItem("activeProjectId");

    // If no active project, redirect to projects page
    if (!projectId) {
      navigate("/projects");
      return;
    }

    setActiveProjectId(projectId);

    // Try restoring cached data for THIS specific project
    const storedSprintData = localStorage.getItem("sprintManagerData");
    const storedProjectData = localStorage.getItem("projectData");
    const storedProjectIdKey = localStorage.getItem("cachedProjectId");
    const storedProjectMeta = localStorage.getItem("projectMeta");

    if (
      storedSprintData &&
      storedProjectData &&
      storedProjectIdKey === projectId
    ) {
      try {
        const parsedSprints = JSON.parse(storedSprintData).map((s) => {
          if (s.startDate && s.endDate && s.startDate > s.endDate) {
            const projectMinDate =
              isoToInput(JSON.parse(storedProjectMeta || "{}").created_at) ||
              today();
            const fourteenDaysAgo = addDays(s.endDate, -13);
            if (fourteenDaysAgo >= projectMinDate) {
              s.startDate = fourteenDaysAgo;
            } else {
              s.startDate =
                projectMinDate <= s.endDate ? projectMinDate : s.endDate;
            }
          }
          if (s.startDate && s.endDate) {
            const start = new Date(s.startDate);
            const end = new Date(s.endDate);
            const d = Math.max(
              1,
              Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1,
            );
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
          dates[s.id] = {
            startDate: s.startDate || "",
            endDate: s.endDate || "",
          };
        });
        setSprintLocalDates(dates);

        setIsLoading(false);
        return;
      } catch (e) {
        console.error("Error restoring sprint data:", e);
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
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Fetched project data:", data);

      // GET /projects/{id} returns { project_id, name, project_plan, ... }
      const projectPlan = data.project_plan;

      setProjectData(projectPlan);
      const meta = {
        created_at: data.created_at,
        name: data.name,
        status: data.status,
      };
      setProjectMeta(meta);
      localStorage.setItem("projectMeta", JSON.stringify(meta));
      localStorage.setItem("projectData", JSON.stringify(projectPlan));
      localStorage.setItem("cachedProjectId", projectId);

      if (projectPlan.sprints && Array.isArray(projectPlan.sprints)) {
        const sprintList = projectPlan.sprints.map((sprint, index) => {
          const assignedStories = projectPlan.user_stories
            ? projectPlan.user_stories.filter(
                (story) => story.sprint_id === sprint.sprint_id,
              )
            : [];

          let startDate = sprint.start_date || null;
          let endDate = sprint.end_date || null;

          if (startDate && endDate && startDate > endDate) {
            const projectMinDate = isoToInput(data.created_at) || today();
            const fourteenDaysAgo = addDays(endDate, -13);
            if (fourteenDaysAgo >= projectMinDate) {
              startDate = fourteenDaysAgo;
            } else {
              startDate = projectMinDate <= endDate ? projectMinDate : endDate;
            }
          }

          let diffDays = "--";
          if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const computedDays = Math.max(
              1,
              Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1,
            );
            diffDays = `${computedDays}d`;
          }

          return {
            id: sprint.sprint_id,
            name: sprint.name,
            days:
              diffDays !== "--" ? diffDays : `${sprint.duration_days || 14}d`,
            status: sprint.status || "Not Started",
            startDate: startDate,
            endDate: endDate,
            selected: index === 0,
            color: index === 0 ? "bg-orange-200" : "bg-gray-100",
            storiesCount: assignedStories.length,
            backlogCount: 0,
            resourcesCount: projectPlan.resources?.length || 0,
            totalStoryPoints: assignedStories.reduce(
              (s, st) => s + (st.story_points || 0),
              0,
            ),
            totalEffortHours: assignedStories.reduce(
              (s, st) => s + (st.estimated_effort_hours || 0),
              0,
            ),
            projectKey: projectId,
          };
        });

        setSprints(sprintList);
        localStorage.setItem("sprintManagerData", JSON.stringify(sprintList));

        // Seed sprintLocalDates
        const dates = {};
        sprintList.forEach((s) => {
          dates[s.id] = {
            startDate: s.startDate || "",
            endDate: s.endDate || "",
          };
        });
        setSprintLocalDates(dates);
      } else {
        throw new Error("No sprints found in project");
      }
    } catch (err) {
      console.error("Error fetching project:", err);
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
    const projectId = localStorage.getItem("activeProjectId");
    if (!projectId) return;

    const sprint = sprints.find((s) => s.id === sprintId);
    if (!sprint) return;

    const cur = sprintLocalDates[sprintId] || {};
    const startDate =
      cur.startDate || (field === "startDate" ? value : sprint.startDate || "");
    const endDate =
      cur.endDate || (field === "endDate" ? value : sprint.endDate || "");

    // Validation: end must be >= start
    if (startDate && endDate && endDate < startDate) {
      alert(
        `End date (${endDate}) cannot be before start date (${startDate}). Please correct the dates.`,
      );
      return;
    }

    // Validation: cannot be less than project creation date
    const creationDate =
      isoToInput(projectMeta?.created_at || projectData?.created_at) || today();
    if (startDate && startDate < creationDate) {
      alert(
        `Start date (${startDate}) cannot be before project creation date (${creationDate}). Please correct the dates.`,
      );
      return;
    }
    if (endDate && endDate < creationDate) {
      alert(
        `End date (${endDate}) cannot be before project creation date (${creationDate}). Please correct the dates.`,
      );
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
        s.id === sprintId ? { ...s, startDate, endDate, days: diffDays } : s,
      );
      localStorage.setItem("sprintManagerData", JSON.stringify(updatedSprints));
      return updatedSprints;
    });

    setSavingSprintDate((p) => ({ ...p, [sprintId]: "saving" }));
    try {
      await fetch(API_ENDPOINTS.UPDATE_SPRINT_STATUS(projectId, sprintId), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: sprint.status || "Not Started",
          start_date: startDate,
          end_date: endDate,
        }),
      });
      setSavingSprintDate((p) => ({ ...p, [sprintId]: "saved" }));
      setTimeout(
        () => setSavingSprintDate((p) => ({ ...p, [sprintId]: null })),
        2500,
      );
    } catch (err) {
      console.error("Failed to save sprint date:", err);
      setSavingSprintDate((p) => ({ ...p, [sprintId]: "error" }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "--";
    }

    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "2-digit",
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
          : sprint,
      ),
    );
  };

  // ============================================
  // OPEN KANBAN BOARD
  // ============================================

  const handleKanbanClick = async (sprint) => {
    try {
      const button = document.querySelector(
        `button[data-sprint-id="${sprint.id}"]`,
      );

      if (button) {
        button.disabled = true;

        button.innerHTML = `
          <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
        `;
      }

      if (projectData && Array.isArray(projectData.user_stories)) {
        const sprintStories = projectData.user_stories.filter(
          (story) => story.sprint_id === sprint.id,
        );

        const storiesData = {

  assigned_stories: sprintStories.map((story) => {

    // ============================================
    // SPRINT STATUS → BOARD STATUS
    // ============================================

    let updatedStatus = 'To Do';

    if (sprint.status === 'Completed') {

      updatedStatus = 'Done';

    } else if (
      sprint.status === 'In Progress'
    ) {

      updatedStatus = 'In Progress';

    } else if (
      sprint.status === 'Blocked'
    ) {

      updatedStatus = 'Blocked';

    } else if (
      sprint.status === 'Paused'
    ) {

      updatedStatus = 'Blocked';

    } else {

      updatedStatus = 'To Do';
    }

            return {
              story_id: story.story_id,

              epic_id: story.epic_id,

              title: story.name || "Untitled Story",

              description: story.description || "",

              story_points: story.story_points || 0,

              estimated_effort_hours: story.estimated_effort_hours || 0,

              // ============================================
              // UPDATED STATUS
              // ============================================

              status: updatedStatus,

              priority: story.priority || "Medium",

              assigned_to:
                projectData.resources?.find(
                  (r) => r.resource_id === story.assigned_to_resource_id,
                )?.name || "Unassigned",

              dependencies: story.dependencies || [],

              start_date: sprint.startDate,

              end_date: sprint.endDate,

              due_date: sprint.endDate,

              work_hours: `${story.estimated_effort_hours || 0}h`,

              duration: `${Math.ceil(
                (story.estimated_effort_hours || 0) / 8,
              )}d`,

              role:
                projectData.resources?.find(
                  (r) => r.resource_id === story.assigned_to_resource_id,
                )?.role || "Developer",
            };
          }),

          backlog_stories: [],

          resources: projectData.resources || [],
        };
        console.log(`Stories data for ${sprint.name}:`, storiesData);

        localStorage.setItem("selectedSprintData", JSON.stringify(storiesData));
        localStorage.setItem("projectData", JSON.stringify(projectData));
        // localStorage.setItem(
        //   "sprint_runtime_data",
        //   JSON.stringify(updatedSprints)
        // );

        const latestSprintData =
          sprints.find((s) => s.id === sprint.id) || sprint;

        localStorage.setItem(
          "selectedSprintInfo",
          JSON.stringify({
            ...latestSprintData,
            start: latestSprintData.startDate,
            endDate: latestSprintData.endDate,
          }),
        );
        localStorage.setItem("selectedSprintName", sprint.name);

        navigate("/board");
      } else {
        throw new Error("No project data available");
      }
    } catch (error) {
      console.error("Error preparing sprint data:", error);

      alert(`Failed to load sprint data: ${error.message}`);
    } finally {
      const button = document.querySelector(
        `button[data-sprint-id="${sprint.id}"]`,
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

    if (tab === "project") {
      navigate("/view");
    } else if (tab === "epics") {
      navigate("/epics");
    }
  };

  // ============================================
  // DROPDOWN
  // ============================================

  // Ensure 'e' is specified first here
  const handleDropdownToggle = (e, sprintId) => {
    // Prevent the event from bubbling up and immediately closing itself
    e.stopPropagation();

    if (dropdownOpen === sprintId) {
      setDropdownOpen(null);
    } else {
      if (!e || !e.currentTarget) return;

      const rect = e.currentTarget.getBoundingClientRect();

      setDropdownCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX - 170,
      });
      setDropdownOpen(sprintId);
    }
  };

  useEffect(() => {
    const handleOutsideClick = () => {
      if (dropdownOpen !== null) {
        setDropdownOpen(null);
      }
    };

    // Listen for clicks anywhere on the webpage window
    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [dropdownOpen]);
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
          newStatus === "In Progress"
            ? sprint.startDate || new Date().toISOString().split("T")[0]
            : sprint.startDate,
        endDate:
          newStatus === "Completed"
            ? new Date().toISOString().split("T")[0]
            : sprint.endDate,
      };

      // Auto-adjust start date if start date is after end date (preserves start <= end)
      if (
        updatedSprint.startDate &&
        updatedSprint.endDate &&
        updatedSprint.startDate > updatedSprint.endDate
      ) {
        const projectMinDate =
          isoToInput(projectMeta?.created_at || projectData?.created_at) ||
          today();
        const fourteenDaysAgo = addDays(updatedSprint.endDate, -13);
        if (fourteenDaysAgo >= projectMinDate) {
          updatedSprint.startDate = fourteenDaysAgo;
        } else {
          updatedSprint.startDate =
            projectMinDate <= updatedSprint.endDate
              ? projectMinDate
              : updatedSprint.endDate;
        }
      }

      if (updatedSprint.startDate && updatedSprint.endDate) {
        const start = new Date(updatedSprint.startDate);
        const end = new Date(updatedSprint.endDate);
        const diffDays = Math.max(
          1,
          Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1,
        );
        updatedSprint.days = `${diffDays}d`;
      }

      // Update sprintLocalDates state so the UI calendar pickers are perfectly synced
      setSprintLocalDates((prev) => ({
        ...prev,
        [sprintId]: {
          startDate: updatedSprint.startDate,
          endDate: updatedSprint.endDate,
        },
      }));

      // Persist sprint status to the DB
      const projectId = localStorage.getItem("activeProjectId");
      if (projectId) {
        fetch(API_ENDPOINTS.UPDATE_SPRINT_STATUS(projectId, sprintId), {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: newStatus,
            start_date: updatedSprint.startDate,
            end_date: updatedSprint.endDate,
          }),
        }).catch((err) =>
          console.error("Failed to persist sprint status:", err),
        );
      }

      localStorage.setItem(
        "selectedSprintInfo",
        JSON.stringify({
          ...updatedSprint,
          start: updatedSprint.startDate,
          end: updatedSprint.endDate,
        }),
      );

      return updatedSprint;
    });

    setSprints(updatedSprints);
    localStorage.setItem("sprintManagerData", JSON.stringify(updatedSprints));
  };

  // ============================================
  // DROPDOWN ACTIONS
  // ============================================

  const handleDropdownAction = (action, sprint) => {
    setDropdownOpen(null);

    switch (action) {
      case "edit":
        console.log("Edit sprint:", sprint.id);
        break;

      case "start":
        updateSprintStatus(sprint.id, "In Progress");
        break;

      case "pause":
        updateSprintStatus(sprint.id, "Paused");
        break;

      case "complete":
        updateSprintStatus(sprint.id, "Completed");
        break;

      case "archive":
        updateSprintStatus(sprint.id, "Archived");
        break;

      case "delete":
        if (window.confirm(`Delete ${sprint.name}?`)) {
          const filtered = sprints.filter((s) => s.id !== sprint.id);

          setSprints(filtered);

          localStorage.setItem("sprintManagerData", JSON.stringify(filtered));
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
      case "Completed":
        return "bg-green-100 text-green-800";

      case "In Progress":
        return "bg-blue-100 text-blue-800";

      case "Paused":
        return "bg-yellow-100 text-yellow-800";

      case "Archived":
        return "bg-gray-200 text-gray-700";

      default:
        return "bg-gray-100 text-gray-800";
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
                <img src={pmrgLogo} alt="PMRG Logo" className="w-50 h-30" />

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
              <img src={pmrgLogo} alt="PMRG Logo" className="w-50 h-30" />

              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                <br />
                SPRINT MANAGER
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/projects")}
                className="px-4 py-2 border border-indigo-300 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all duration-200 font-medium flex items-center space-x-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span>All Projects</span>
              </button>

              <button
                onClick={() => navigate("/planning")}
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
                onClick={() => handleTabChange("project")}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "project"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
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
                onClick={() => handleTabChange("epics")}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "epics"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
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
                onClick={() => handleTabChange("sprints")}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "sprints"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
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
          <div className="w-full overflow-hidden rounded-2xl">
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
                    className={`hover:bg-purple-50/50 transition-colors ${
                      dropdownOpen === sprint.id
                        ? "relative z-50 shadow-sm"
                        : ""
                    }`}
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
                          sprint.status,
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
                          value={
                            sprintLocalDates[sprint.id]?.startDate ||
                            sprint.startDate ||
                            ""
                          }
                          min={
                            isoToInput(
                              projectMeta?.created_at ||
                                projectData?.created_at,
                            ) || today()
                          }
                          max={
                            sprintLocalDates[sprint.id]?.endDate ||
                            sprint.endDate ||
                            undefined
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            const projectMinDate =
                              isoToInput(
                                projectMeta?.created_at ||
                                  projectData?.created_at,
                              ) || today();
                            setSprintLocalDates((p) => {
                              const cur = p[sprint.id] || {};
                              const curEnd =
                                cur.endDate || sprint.endDate || "";
                              const updates = { ...cur, startDate: val };

                              if (val && val < projectMinDate) {
                                updates.startDate = projectMinDate;
                              }

                              if (
                                updates.startDate &&
                                curEnd &&
                                updates.startDate > curEnd
                              ) {
                                updates.endDate = addDays(
                                  updates.startDate,
                                  13,
                                );
                              }
                              return { ...p, [sprint.id]: updates };
                            });
                          }}
                          onBlur={(e) => {
                            const val =
                              sprintLocalDates[sprint.id]?.startDate ||
                              e.target.value;
                            if (val) {
                              saveSprintDateField(sprint.id, "startDate", val);
                            }
                          }}
                          className="w-32 text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white text-gray-700 cursor-pointer hover:border-indigo-300 transition-colors"
                        />
                        {savingSprintDate[sprint.id] === "saving" && (
                          <svg
                            className="w-3 h-3 text-indigo-400 animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                        )}
                        {savingSprintDate[sprint.id] === "saved" && (
                          <svg
                            className="w-3 h-3 text-emerald-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                    </td>

                    {/* END DATE — editable */}

                    <td className="px-3 py-4 text-sm text-gray-700 text-left">
                      <input
                        type="date"
                        value={
                          sprintLocalDates[sprint.id]?.endDate ||
                          sprint.endDate ||
                          ""
                        }
                        min={
                          sprintLocalDates[sprint.id]?.startDate ||
                          sprint.startDate ||
                          isoToInput(
                            projectMeta?.created_at || projectData?.created_at,
                          ) ||
                          today()
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          setSprintLocalDates((p) => {
                            const cur = p[sprint.id] || {};
                            const updates = { ...cur, endDate: val };
                            const projectMinDate =
                              isoToInput(
                                projectMeta?.created_at ||
                                  projectData?.created_at,
                              ) || today();
                            const curStart =
                              cur.startDate ||
                              sprint.startDate ||
                              projectMinDate;
                            if (val && val < curStart) {
                              updates.endDate = curStart;
                            }
                            return { ...p, [sprint.id]: updates };
                          });
                        }}
                        onBlur={(e) => {
                          const val =
                            sprintLocalDates[sprint.id]?.endDate ||
                            e.target.value;
                          if (val) {
                            saveSprintDateField(sprint.id, "endDate", val);
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
                          onClick={() => handleKanbanClick(sprint)}
                          data-sprint-id={sprint.id}
                          className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>

                        {/* DROPDOWN */}

                        {/* DROPDOWN */}
                        <div className="relative inline-block">
                          <button
                            onClick={(e) => handleDropdownToggle(e, sprint.id)}
                            className="inline-flex items-center p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {dropdownOpen === sprint.id &&
                            createPortal(
                              /* REMOVED THE FIXED OVERLAY DIV FROM HERE */
                              <div
                                style={{
                                  position: "absolute",
                                  top: `${dropdownCoords.top}px`,
                                  left: `${dropdownCoords.left}px`,
                                }}
                                // e.stopPropagation stops the portal menu buttons from triggering the global closer hook
                                onClick={(e) => e.stopPropagation()}
                                className="w-52 bg-white rounded-xl shadow-2xl border border-gray-200/80 p-1 z-[9999]"
                              >
                                <div className="py-1">
                                  {/* EDIT */}
                                  <button
                                    onClick={() =>
                                      handleDropdownAction("edit", sprint)
                                    }
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded-lg transition-colors text-left"
                                  >
                                    <Edit className="w-4 h-4 mr-2 text-gray-500" />
                                    Edit Sprint
                                  </button>

                                  {/* START */}
                                  <button
                                    onClick={() =>
                                      handleDropdownAction("start", sprint)
                                    }
                                    disabled={sprint.status === "In Progress"}
                                    className={`flex items-center w-full px-4 py-2 text-sm hover:bg-purple-50 rounded-lg transition-colors text-left ${
                                      sprint.status === "In Progress"
                                        ? "text-gray-400 cursor-not-allowed"
                                        : "text-green-700"
                                    }`}
                                  >
                                    <Play className="w-4 h-4 mr-2" />
                                    Start Sprint
                                  </button>

                                  {/* PAUSE */}
                                  <button
                                    onClick={() =>
                                      handleDropdownAction("pause", sprint)
                                    }
                                    disabled={sprint.status !== "In Progress"}
                                    className={`flex items-center w-full px-4 py-2 text-sm hover:bg-purple-50 rounded-lg transition-colors text-left ${
                                      sprint.status !== "In Progress"
                                        ? "text-gray-400 cursor-not-allowed"
                                        : "text-yellow-700"
                                    }`}
                                  >
                                    <Pause className="w-4 h-4 mr-2" />
                                    Pause Sprint
                                  </button>

                                  {/* COMPLETE */}
                                  <button
                                    onClick={() =>
                                      handleDropdownAction("complete", sprint)
                                    }
                                    disabled={sprint.status === "Completed"}
                                    className={`flex items-center w-full px-4 py-2 text-sm hover:bg-purple-50 rounded-lg transition-colors text-left ${
                                      sprint.status === "Completed"
                                        ? "text-gray-400 cursor-not-allowed"
                                        : "text-blue-700"
                                    }`}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Complete Sprint
                                  </button>

                                  {/* ARCHIVE */}
                                  <button
                                    onClick={() =>
                                      handleDropdownAction("archive", sprint)
                                    }
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded-lg transition-colors text-left"
                                  >
                                    <Archive className="w-4 h-4 mr-2 text-gray-500" />
                                    Archive Sprint
                                  </button>

                                  {/* DELETE */}
                                  <div className="border-t border-gray-100 my-1"></div>
                                  <button
                                    onClick={() =>
                                      handleDropdownAction("delete", sprint)
                                    }
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Sprint
                                  </button>
                                </div>
                              </div>,
                              document.body,
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

                <p className="text-gray-500 text-lg">No sprints found</p>

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

{/* ============================================
    SUMMARY CARDS SECTION (3-COLUMN MATRIX)
============================================ */}
{projectData && sprints.length > 0 && (() => {
  // ─── DATA AGGREGATION MATRIX ──────────────────────────────────────────────
  const totalSprints = sprints.length;
  const completedSprints = sprints.filter((s) => s.status === "Completed").length;
  const inProgressSprints = sprints.filter((s) => s.status === "In Progress").length;
  const pausedSprints = sprints.filter((s) => s.status === "Paused").length;
  const notStartedSprints = sprints.filter((s) => s.status === "Not Started").length;

  const totalStories = projectData.user_stories?.length || 0;
  const totalPoints = projectData.total_estimated_story_points || 
    sprints.reduce((acc, s) => acc + (s.totalStoryPoints || 0), 0);
  
  const totalEpics = projectData.epics?.length || 0;
  const teamMembers = projectData.resources?.length || 0;
  const avgStories = totalSprints > 0 ? (totalStories / totalSprints) : 0;
  const avgPoints = totalSprints > 0 ? (totalPoints / totalSprints) : 0;

  // ─── MULTI-SEGMENT DONUT CHART MATHS ENGINE ────────────────────────────────
  const radius = 36;
  const circumference = 2 * Math.PI * radius; // Approx 226.195

  const pctCompleted = totalSprints > 0 ? completedSprints / totalSprints : 0;
  const pctInProgress = totalSprints > 0 ? inProgressSprints / totalSprints : 0;
  const pctPaused = totalSprints > 0 ? pausedSprints / totalSprints : 0;
  const pctNotStarted = totalSprints > 0 ? notStartedSprints / totalSprints : 0;

  const dashCompleted = pctCompleted * circumference;
  const dashInProgress = pctInProgress * circumference;
  const dashPaused = pctPaused * circumference;
  const dashNotStarted = pctNotStarted * circumference;

  const offsetCompleted = 0;
  const offsetInProgress = dashCompleted;
  const offsetPaused = dashCompleted + dashInProgress;
  const offsetNotStarted = dashCompleted + dashInProgress + dashPaused;

  // ─── CHANNELS SCALING CONFIG (PREVENTS OVERFLOW BUGS) ──────────────────────
  const maxExpectedStoriesPerSprint = 15;
  const maxExpectedVelocity = 50;
  const resourceList = projectData.resources || [];

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      {/* ─── CARD 1: PROJECT OVERVIEW ──────────────────────────────────────── */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-slate-200/60 p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-lg">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-800">Project Overview</h3>
            <div className="w-9 h-9 bg-blue-50/60 rounded-xl flex items-center justify-center border border-blue-100/40">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1">Total operational units breakdown</p>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          <div className="bg-blue-50/60 rounded-xl p-2.5 border border-blue-100/40">
            <p className="text-xl font-black text-blue-600">{totalSprints}</p>
            <p className="text-[10px] font-bold text-slate-500 mt-0.5 uppercase tracking-tight">Sprints</p>
          </div>
          <div className="bg-indigo-50/60 rounded-xl p-2.5 border border-indigo-100/40">
            <p className="text-xl font-black text-indigo-600">{totalEpics}</p>
            <p className="text-[10px] font-bold text-slate-500 mt-0.5 uppercase tracking-tight">Epics</p>
          </div>
          <div className="bg-purple-50/60 rounded-xl p-2.5 border border-purple-100/40">
            <p className="text-xl font-black text-purple-600">{totalStories}</p>
            <p className="text-[10px] font-bold text-slate-500 mt-0.5 uppercase tracking-tight">Stories</p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs font-semibold text-slate-500">
          <span>Gross Accumulation:</span>
          <span className="text-slate-800 font-bold">{totalSprints + totalEpics + totalStories} Items</span>
        </div>
      </div>

      {/* ─── CARD 2: PROGRESS STATUS ───────────────────────────────────────── */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-slate-200/60 p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-lg">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-800">Progress Status</h3>
            <div className="w-9 h-9 bg-emerald-50/60 rounded-xl flex items-center justify-center border border-emerald-100/40">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1">Operational sprint cycle health</p>
        </div>

        <div className="flex items-center justify-between my-3">
          <div className="space-y-1.5 text-xs text-slate-600 font-medium">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-md bg-emerald-500 inline-block" />
              <span className="text-slate-500">Completed: <b className="text-slate-800">{completedSprints}</b></span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-md bg-blue-500 inline-block" />
              <span className="text-slate-500">In Progress: <b className="text-slate-800">{inProgressSprints}</b></span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-md bg-amber-400 inline-block" />
              <span className="text-slate-500">Paused: <b className="text-slate-800">{pausedSprints}</b></span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-md bg-slate-300 inline-block" />
              <span className="text-slate-500">Not Started: <b className="text-slate-800">{notStartedSprints}</b></span>
            </div>
          </div>

          <div className="relative flex items-center justify-center h-24 w-24 transform rotate-[-90deg]">
            <svg className="w-full h-full" viewBox="0 0 96 96">
              {totalSprints === 0 ? (
                <circle cx="48" cy="48" r={radius} className="text-slate-100" strokeWidth="8" stroke="currentColor" fill="none" />
              ) : (
                <>
                  <circle cx="48" cy="48" r={radius} className="text-slate-100" strokeWidth="7.5" stroke="currentColor" fill="none" />
                  
                  {completedSprints === totalSprints ? (
                    <circle cx="48" cy="48" r={radius} className="text-emerald-500" strokeWidth="8" stroke="currentColor" fill="none" />
                  ) : (
                    dashCompleted > 0 && (
                      <circle cx="48" cy="48" r={radius} className="text-emerald-500" strokeWidth="8" stroke="currentColor" fill="none"
                        strokeDasharray={`${dashCompleted} ${circumference}`}
                        strokeDashoffset={-offsetCompleted}
                      />
                    )
                  )}

                  {inProgressSprints === totalSprints ? (
                    <circle cx="48" cy="48" r={radius} className="text-blue-500" strokeWidth="8" stroke="currentColor" fill="none" />
                  ) : (
                    dashInProgress > 0 && (
                      <circle cx="48" cy="48" r={radius} className="text-blue-500" strokeWidth="8" stroke="currentColor" fill="none"
                        strokeDasharray={`${dashInProgress} ${circumference}`}
                        strokeDashoffset={-offsetInProgress}
                      />
                    )
                  )}

                  {pausedSprints === totalSprints ? (
                    <circle cx="48" cy="48" r={radius} className="text-amber-400" strokeWidth="8" stroke="currentColor" fill="none" />
                  ) : (
                    dashPaused > 0 && (
                      <circle cx="48" cy="48" r={radius} className="text-amber-400" strokeWidth="8" stroke="currentColor" fill="none"
                        strokeDasharray={`${dashPaused} ${circumference}`}
                        strokeDashoffset={-offsetPaused}
                      />
                    )
                  )}

                  {notStartedSprints === totalSprints ? (
                    <circle cx="48" cy="48" r={radius} className="text-slate-300" strokeWidth="8" stroke="currentColor" fill="none" />
                  ) : (
                    dashNotStarted > 0 && (
                      <circle cx="48" cy="48" r={radius} className="text-slate-300" strokeWidth="8" stroke="currentColor" fill="none"
                        strokeDasharray={`${dashNotStarted} ${circumference}`}
                        strokeDashoffset={-offsetNotStarted}
                      />
                    )
                  )}
                </>
              )}
            </svg>
            
            <div className="absolute transform rotate-[90deg] flex flex-col items-center justify-center text-center">
              <span className="text-base font-black text-slate-800">{totalSprints}</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Total Run</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[11px] font-bold text-slate-400 bg-slate-50/50 p-1.5 rounded-lg border border-slate-100">
          <div className="flex items-center space-x-1 font-medium">
            <span className="text-emerald-600 font-bold">{completedSprints}</span>
            <span>+</span>
            <span className="text-blue-600 font-bold">{inProgressSprints}</span>
            <span>+</span>
            <span className="text-amber-500 font-bold">{pausedSprints}</span>
            <span>+</span>
            <span className="text-slate-500 font-bold">{notStartedSprints}</span>
          </div>
          <span className="text-slate-600 font-extrabold">{totalSprints} Sprints Total</span>
        </div>
      </div>

      {/* ─── CARD 3: RESOURCE ALLOCATION ───────────────────────────────────── */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-slate-200/60 p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-lg">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-800">Resource Allocation</h3>
            <div className="w-9 h-9 bg-purple-50/60 rounded-xl flex items-center justify-center border border-purple-100/40">
              <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94-3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1">Team utilization & speed densities</p>
        </div>
        
        <div className="flex items-center justify-between my-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Team Allocations</span>
            <div className="flex -space-x-2 mt-1.5 overflow-hidden">
              {resourceList.slice(0, 4).map((resource, idx) => {
                const colors = ['bg-blue-500', 'bg-purple-500', 'bg-indigo-500', 'bg-teal-500'];
                const initials = resource.name ? resource.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'OP';
                return (
                  <div key={resource.resource_id || idx} className={`w-8 h-8 rounded-full ${colors[idx % colors.length]} flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm`}>
                    {initials}
                  </div>
                );
              })}
              {teamMembers > 4 && (
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold border-2 border-white shadow-sm">
                  +{teamMembers - 4}
                </div>
              )}
              {teamMembers === 0 && (
                <span className="text-xs font-medium text-slate-400 italic">No members assigned</span>
              )}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Team Size</span>
            <span className="text-2xl font-black text-purple-600 mt-0.5 block">{teamMembers}</span>
          </div>
        </div>

        <div className="space-y-3 pt-1 border-t border-slate-100/70">
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
              <span>Avg Stories / Sprint</span>
              <span className="font-bold text-slate-800">{avgStories.toFixed(1)}</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-300" 
                style={{ width: `${Math.min((avgStories / maxExpectedStoriesPerSprint) * 100, 100)}%` }} 
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
              <span>Avg Points / Sprint</span>
              <span className="font-bold text-purple-600">{avgPoints.toFixed(1)} pts</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full transition-all duration-300" 
                style={{ width: `${Math.min((avgPoints / maxExpectedVelocity) * 100, 100)}%` }} 
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
})()}
    
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
                    onClick={() => navigate("/planning")}
                    className="hover:text-white transition-colors"
                  >
                    Sprint Planning
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => navigate("/board")}
                    className="hover:text-white transition-colors"
                  >
                    Sprint Board
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => navigate("/leave")}
                    className="hover:text-white transition-colors"
                  >
                    Leave Tracker
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => navigate("/reports")}
                    className="hover:text-white transition-colors"
                  >
                    Sprint Reports
                  </button>
                </li>
              </ul>
            </div>

            {/* COLUMN 2 */}

            <div>
              <h3 className="text-lg font-semibold mb-4">Project Management</h3>

              <ul className="space-y-2 text-gray-300">
                <li>
                  <button
                    onClick={() => navigate("/view")}
                    className="hover:text-white transition-colors"
                  >
                    Project Overview
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => navigate("/epics")}
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
              <h3 className="text-lg font-semibold mb-4">Team & Resources</h3>

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
              &copy; 2025 PMRGSOLUTION. Sprint Management Excellence | Crafted
              with ❤️ for agile teams
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SprintManager;
