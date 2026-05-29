import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderOpen, Plus, Trash2, ArrowRight, Calendar,
  BarChart2, Layers, BookOpen, Clock, Search, RefreshCw,
  CheckCircle, AlertCircle, Archive, Activity,
} from "lucide-react";
import pmrgLogo from "../src/assets/pmrglogo.png";
import API_ENDPOINTS from "./Auths";

// ─── helpers ────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  active:    { label: "Active",    color: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500",  icon: Activity    },
  completed: { label: "Completed", color: "bg-blue-100 text-blue-700 border-blue-200",         dot: "bg-blue-500",    icon: CheckCircle },
  archived:  { label: "Archived",  color: "bg-gray-100 text-gray-600 border-gray-200",          dot: "bg-gray-400",    icon: Archive     },
};

const CARD_ACCENTS = [
  "from-violet-500 to-indigo-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-teal-500 to-cyan-600",
  "from-emerald-500 to-green-600",
  "from-sky-500 to-blue-600",
];

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric", month: "short", year: "numeric",
  });
}

// ─── DeleteModal ─────────────────────────────────────────────────────────────

const DeleteModal = ({ project, onConfirm, onCancel, isDeleting }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in">
      <div className="bg-gradient-to-r from-red-500 to-rose-600 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Delete Project</h2>
        </div>
      </div>
      <div className="p-6">
        <p className="text-gray-600 mb-2">
          Are you sure you want to permanently delete:
        </p>
        <p className="font-semibold text-gray-900 text-lg mb-4">
          "{project?.name}"
        </p>
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          This will delete all sprints, stories, tasks, and subtasks. This action cannot be undone.
        </p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-2.5 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 px-4 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-rose-700 transition-all flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            {isDeleting ? "Deleting…" : "Delete Project"}
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ─── StatPill ─────────────────────────────────────────────────────────────────

const StatPill = ({ icon: Icon, value, label, color }) => (
  <div className="flex items-center gap-1.5">
    <Icon className={`w-3.5 h-3.5 ${color}`} />
    <span className="text-sm font-semibold text-gray-800">{value}</span>
    <span className="text-xs text-gray-500">{label}</span>
  </div>
);

// ─── ProjectCard ─────────────────────────────────────────────────────────────

const ProjectCard = ({ project, index, onOpen, onDelete }) => {
  const accent     = CARD_ACCENTS[index % CARD_ACCENTS.length];
  const statusCfg  = STATUS_CONFIG[project.status] || STATUS_CONFIG.active;
  const StatusIcon = statusCfg.icon;

  return (
    <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Gradient top bar */}
      <div className={`h-1.5 bg-gradient-to-r ${accent}`} />

      {/* Card header */}
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center shadow-md`}>
            <FolderOpen className="w-5 h-5 text-white" />
          </div>

          {/* Status badge */}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${statusCfg.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
            {statusCfg.label}
          </span>
        </div>

        {/* Name */}
        <h3 className="text-gray-900 font-bold text-base leading-tight mb-1 group-hover:text-indigo-700 transition-colors line-clamp-2">
          {project.name}
        </h3>

        {/* Description */}
        {project.description && (
          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">
            {project.description}
          </p>
        )}

        {/* Stats row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-3 border-t border-gray-100">
          <StatPill icon={Layers}   value={project.sprint_count} label="sprints" color="text-violet-500" />
          <StatPill icon={BookOpen} value={project.story_count}  label="stories" color="text-blue-500"   />
          <StatPill icon={BarChart2} value={project.total_story_points} label="pts" color="text-amber-500" />
        </div>

        {/* Created date */}
        <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>Created {formatDate(project.created_at)}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-5 pb-5 flex gap-2">
        <button
          onClick={() => onOpen(project)}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r ${accent} text-white rounded-xl font-medium text-sm shadow-md hover:shadow-lg hover:opacity-95 transition-all`}
        >
          Open
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(project)}
          className="p-2.5 rounded-xl border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors"
          title="Delete project"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ─── EmptyState ───────────────────────────────────────────────────────────────

const EmptyState = ({ onNew }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
    <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
      <FolderOpen className="w-12 h-12 text-indigo-400" />
    </div>
    <h3 className="text-2xl font-bold text-gray-800 mb-2">No projects yet</h3>
    <p className="text-gray-500 max-w-sm mb-8">
      Generate your first AI-powered sprint plan to get started. Add your team,
      scope, and let Gemini do the planning.
    </p>
    <button
      onClick={onNew}
      className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-violet-700 transition-all hover:scale-105"
    >
      <Plus className="w-5 h-5" />
      New Project
    </button>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const ProjectsPage = () => {
  const navigate = useNavigate();

  const [projects,    setProjects]    = useState([]);
  const [filtered,    setFiltered]    = useState([]);
  const [isLoading,   setIsLoading]   = useState(true);
  const [error,       setError]       = useState(null);
  const [search,      setSearch]      = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting,  setIsDeleting]  = useState(false);

  // ── Fetch all projects ─────────────────────────────────────────────
  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(API_ENDPOINTS.GET_PROJECTS);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setProjects(data);
      setFiltered(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  // ── Search filter ──────────────────────────────────────────────────
  useEffect(() => {
    const q = search.trim().toLowerCase();
    setFiltered(
      q ? projects.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
      ) : projects
    );
  }, [search, projects]);

  // ── Open a project ─────────────────────────────────────────────────
  const handleOpen = (project) => {
    localStorage.setItem("activeProjectId",   project.project_id);
    localStorage.setItem("activeProjectName", project.name);
    // Clear any stale sprint data from a previous project
    localStorage.removeItem("sprintManagerData");
    localStorage.removeItem("projectData");
    localStorage.removeItem("selectedSprintData");
    localStorage.removeItem("selectedSprintInfo");
    localStorage.removeItem("cachedProjectId");
    navigate("/project-detail");
  };

  // ── Delete flow ────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(
        API_ENDPOINTS.DELETE_PROJECT(deleteTarget.project_id),
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setProjects(prev => prev.filter(p => p.project_id !== deleteTarget.project_id));
      setDeleteTarget(null);
    } catch (err) {
      alert(`Failed to delete project: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Summary stats ──────────────────────────────────────────────────
  const totalSprints = projects.reduce((s, p) => s + p.sprint_count, 0);
  const totalStories = projects.reduce((s, p) => s + p.story_count, 0);
  const activeCount  = projects.filter(p => p.status === "active").length;

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/20">

      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-indigo-100/50 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={pmrgLogo} alt="PMRG Logo" className="h-10 w-auto" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">My Projects</h1>
              <p className="text-xs text-gray-500">Manage all your sprint planning projects</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/planning")}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-medium text-sm shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-violet-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              New Project
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* ── Stats bar ───────────────────────────────────────────── */}
        {projects.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Projects", value: projects.length, icon: FolderOpen, gradient: "from-indigo-500 to-violet-600" },
              { label: "Active",         value: activeCount,     icon: Activity,   gradient: "from-emerald-500 to-teal-600" },
              { label: "Total Sprints",  value: totalSprints,    icon: Layers,     gradient: "from-amber-500 to-orange-600" },
              { label: "Total Stories",  value: totalStories,    icon: BookOpen,   gradient: "from-sky-500 to-blue-600"    },
            ].map(({ label, value, icon: Icon, gradient }) => (
              <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
                <div className={`w-11 h-11 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-md flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Search + Refresh ─────────────────────────────────────── */}
        {projects.length > 0 && (
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
              />
            </div>
            <button
              onClick={fetchProjects}
              className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-indigo-600 hover:border-indigo-200 transition-colors shadow-sm"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-500">
              {filtered.length} of {projects.length} projects
            </span>
          </div>
        )}

        {/* ── Loading ──────────────────────────────────────────────── */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
            <p className="text-gray-500 text-sm">Loading projects…</p>
          </div>
        )}

        {/* ── Error ────────────────────────────────────────────────── */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Failed to load projects</h3>
            <p className="text-gray-500 text-sm mb-6">{error}</p>
            <button
              onClick={fetchProjects}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        )}

        {/* ── Project Grid ─────────────────────────────────────────── */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.length === 0 && projects.length > 0 ? (
              <div className="col-span-full text-center py-16 text-gray-400">
                No projects match "<span className="font-medium">{search}</span>"
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState onNew={() => navigate("/planning")} />
            ) : (
              filtered.map((project, index) => (
                <ProjectCard
                  key={project.project_id}
                  project={project}
                  index={index}
                  onOpen={handleOpen}
                  onDelete={setDeleteTarget}
                />
              ))
            )}
          </div>
        )}
      </main>

      {/* ── Delete Confirmation Modal ────────────────────────────── */}
      {deleteTarget && (
        <DeleteModal
          project={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default ProjectsPage;
