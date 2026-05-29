import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Calendar, Clock, Users, BarChart3,
  BookOpen, Zap, Trophy, AlertTriangle, RefreshCw,
  Activity, TrendingUp, CheckCircle, Building,
  Target, Timer, User, Layers, Flag, GitBranch,
  Circle, Play, Pause, ChevronDown, ChevronUp, Award
} from 'lucide-react';
import pmrgLogo from '../assets/pmrglogo.png';
import API_ENDPOINTS from '../Auths';

// ─── helpers ────────────────────────────────────────────────────────────────

const fmt = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
};

const isDone   = (s) => ['done','completed','complete','closed'].includes((s?.status || '').toLowerCase());
const isActive = (s) => ['in progress','in-progress','active'].includes((s?.status || '').toLowerCase());

const ROLE_GRADIENT = {
  frontend:  'from-blue-400 to-indigo-500',
  backend:   'from-green-400 to-emerald-500',
  fullstack: 'from-violet-400 to-purple-500',
  qa:        'from-amber-400 to-orange-500',
  devops:    'from-sky-400 to-cyan-500',
  designer:  'from-pink-400 to-rose-500',
  manager:   'from-slate-500 to-gray-600',
};
const roleGrad = (role) => ROLE_GRADIENT[(role || '').toLowerCase()] || 'from-indigo-400 to-blue-500';
const initials = (name = '') => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

const EPIC_COLORS = [
  { gradient: 'from-violet-500 to-purple-600', light: 'bg-violet-50 border-violet-200', text: 'text-violet-700' },
  { gradient: 'from-rose-500 to-pink-600',     light: 'bg-rose-50 border-rose-200',     text: 'text-rose-700'   },
  { gradient: 'from-sky-500 to-blue-600',      light: 'bg-sky-50 border-sky-200',       text: 'text-sky-700'    },
  { gradient: 'from-amber-500 to-orange-600',  light: 'bg-amber-50 border-amber-200',   text: 'text-amber-700'  },
  { gradient: 'from-teal-500 to-emerald-600',  light: 'bg-teal-50 border-teal-200',     text: 'text-teal-700'   },
];

const SPRINT_STATUS = {
  'Completed':   { bar: 'bg-emerald-500', light: 'bg-emerald-50',  text: 'text-emerald-700', border: 'border-emerald-300', icon: CheckCircle },
  'In Progress': { bar: 'bg-blue-500',    light: 'bg-blue-50',     text: 'text-blue-700',    border: 'border-blue-300',   icon: Play        },
  'Paused':      { bar: 'bg-amber-400',   light: 'bg-amber-50',    text: 'text-amber-700',   border: 'border-amber-300',  icon: Pause       },
  'Not Started': { bar: 'bg-slate-300',   light: 'bg-slate-50',    text: 'text-slate-600',   border: 'border-slate-300',  icon: Circle      },
};

const ProgressBar = ({ pct, color = 'bg-indigo-500', height = 'h-2.5' }) => (
  <div className={`w-full bg-gray-100 rounded-full ${height} overflow-hidden`}>
    <div
      className={`${height} ${color} rounded-full transition-all duration-700`}
      style={{ width: `${Math.min(100, Math.max(0, pct || 0))}%` }}
    />
  </div>
);

const StatusBadge = ({ status }) => {
  const cfg  = SPRINT_STATUS[status] || SPRINT_STATUS['Not Started'];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold ${cfg.light} ${cfg.text} ${cfg.border}`}>
      <Icon className="w-3 h-3" /> {status || 'Not Started'}
    </span>
  );
};

const StatCard = ({ icon: Icon, value, label, sub, gradient }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
    <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-md flex-shrink-0`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900 leading-none">{value ?? '—'}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
      {sub && <p className="text-xs text-indigo-500 font-medium mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const ProjectView = () => {
  const navigate = useNavigate();

  const [projectData,  setProjectData]  = useState(null);
  const [projectMeta,  setProjectMeta]  = useState(null); // DB-level fields: created_at, status, name
  const [isLoading,    setIsLoading]    = useState(true);
  const [error,        setError]        = useState(null);
  const [showAllStories, setShowAllStories] = useState(false);
  const [activeEpicFilter, setActiveEpicFilter] = useState(null);

  // ── Fetch project from API using activeProjectId ─────────────────────
  const fetchProjectData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const projectId = localStorage.getItem('activeProjectId');

    // Try cache first
    const cached    = localStorage.getItem('projectData');
    const cachedId  = localStorage.getItem('cachedProjectId');

    if (cached && cachedId === projectId) {
      try {
        setProjectData(JSON.parse(cached));
        setIsLoading(false);
      } catch (_) {}
    }

    if (!projectId) {
      setError('No active project. Go back to Projects.');
      setIsLoading(false);
      return;
    }

    try {
      const res  = await fetch(API_ENDPOINTS.GET_PROJECT(projectId));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      setProjectMeta(data);               // { project_id, name, status, created_at, ... }
      setProjectData(data.project_plan);  // the nested plan
      localStorage.setItem('projectData',     JSON.stringify(data.project_plan));
      localStorage.setItem('cachedProjectId', projectId);
    } catch (err) {
      // If we have cached data fall back silently
      if (!cached) setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjectData(); }, [fetchProjectData]);

  // ── Derived metrics ──────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-purple-50/10 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading project overview…</p>
        </div>
      </div>
    );
  }

  if (error && !projectData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-gray-700 font-semibold mb-1">Could not load project</p>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button onClick={() => navigate('/projects')} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm mr-2">Projects</button>
          <button onClick={fetchProjectData} className="px-4 py-2 border border-indigo-300 text-indigo-600 rounded-xl text-sm">Retry</button>
        </div>
      </div>
    );
  }

  const plan      = projectData || {};
  const sprints   = plan.sprints     || [];
  const stories   = plan.user_stories || [];
  const epics     = plan.epics       || [];
  const resources = plan.resources   || [];

  // ── Story metrics ──
  const totalStories = stories.length;
  const doneStories  = stories.filter(isDone).length;
  const activeStories = stories.filter(isActive).length;
  const storyPct     = totalStories > 0 ? Math.round((doneStories / totalStories) * 100) : 0;

  // ── Sprint metrics ── (use status field, not just dates)
  const totalSprints   = sprints.length;
  const doneSprintCount = sprints.filter(s => s.status === 'Completed').length;
  const inProgCount     = sprints.filter(s => s.status === 'In Progress').length;
  const notStartedCount = sprints.filter(s => !s.status || s.status === 'Not Started').length;
  const sprintPct       = totalSprints > 0 ? Math.round((doneSprintCount / totalSprints) * 100) : 0;

  // ── Points & Hours ──
  const totalPts   = stories.reduce((s, st) => s + (st.story_points || 0), 0);
  const donePts    = stories.filter(isDone).reduce((s, st) => s + (st.story_points || 0), 0);
  const totalHours = stories.reduce((s, st) => s + (st.estimated_effort_hours || 0), 0);
  const doneHours  = stories.filter(isDone).reduce((s, st) => s + (st.estimated_effort_hours || 0), 0);

  // Plan-level fallbacks
  const displayPts   = totalPts   || plan.total_estimated_story_points  || 0;
  const displayHours = totalHours || plan.total_estimated_effort_hours  || 0;

  // ── Overall ──
  const overallPct = Math.round((sprintPct * 0.55) + (storyPct * 0.45));

  // ── Epic-stories map ──
  const epicMap = {};
  epics.forEach(e => {
    epicMap[e.epic_id] = stories.filter(s => s.epic_id === e.epic_id);
  });

  // ── Filtered stories ──
  const filteredStories = activeEpicFilter
    ? stories.filter(s => s.epic_id === activeEpicFilter)
    : stories;
  const displayedStories = showAllStories ? filteredStories : filteredStories.slice(0, 12);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-purple-50/10">

      {/* ── Sticky Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate('/sprintmanager')}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-700 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" /> Sprint Manager
            </button>
            <span className="text-gray-300">/</span>
            <span className="text-sm font-semibold text-gray-800 truncate">
              {projectMeta?.name || plan.project_name || 'Project Overview'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchProjectData}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
            <img src={pmrgLogo} alt="PMRG" className="h-8 w-auto opacity-80" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-violet-950 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center">
                  <Building className="w-6 h-6 text-white" />
                </div>
                {projectMeta?.status && (
                  <span className="text-xs font-semibold bg-white/20 px-2.5 py-1 rounded-full text-indigo-200">
                    {projectMeta.status}
                  </span>
                )}
                {(plan.start_date || plan.end_date) && (
                  <span className="flex items-center gap-1 text-xs text-indigo-300 bg-white/10 px-2.5 py-1 rounded-full">
                    <Calendar className="w-3 h-3" />
                    {fmt(plan.start_date)} → {fmt(plan.end_date)}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {plan.project_name || projectMeta?.name || 'Project Overview'}
              </h1>
              <p className="text-slate-300 text-sm leading-relaxed max-w-2xl mb-3">{plan.description}</p>
              {plan.product_vision && (
                <div className="border-l-4 border-indigo-400 pl-4">
                  <p className="text-xs text-indigo-300 uppercase tracking-widest mb-1 font-semibold">Product Vision</p>
                  <p className="text-slate-200 text-sm italic">"{plan.product_vision}"</p>
                </div>
              )}
            </div>

            {/* Overall progress ring */}
            <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center min-w-[180px]">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="url(#progv)" strokeWidth="3" strokeLinecap="round"
                    strokeDasharray={`${overallPct}, 100`} />
                  <defs>
                    <linearGradient id="progv" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#a78bfa" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{overallPct}%</span>
                </div>
              </div>
              <p className="text-white font-semibold text-sm">Overall Progress</p>
              <p className="text-indigo-300 text-xs mt-1">{doneSprintCount}/{totalSprints} sprints done</p>
            </div>
          </div>
        </div>

        {/* ── Stats Row ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard icon={Layers}    value={totalSprints}          label="Sprints"       gradient="from-indigo-500 to-violet-600" />
          <StatCard icon={BookOpen}  value={totalStories}          label="User Stories"  gradient="from-sky-500 to-blue-600"       />
          <StatCard icon={BarChart3} value={displayPts}            label="Story Points"  gradient="from-amber-500 to-orange-600"   sub={donePts ? `${donePts} done` : null} />
          <StatCard icon={Clock}     value={`${displayHours}h`}   label="Effort Hours"  gradient="from-rose-500 to-pink-600"      sub={doneHours ? `${doneHours}h done` : null} />
          <StatCard icon={Users}     value={resources.length}      label="Team Members"  gradient="from-teal-500 to-emerald-600"   />
          <StatCard icon={Flag}      value={epics.length}          label="Epics"         gradient="from-fuchsia-500 to-violet-600" />
        </div>

        {/* ── Progress Section ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" /> Progress Breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sprints */}
            <div>
              <div className="flex justify-between text-xs font-medium text-gray-600 mb-2">
                <span>Sprints Completed</span>
                <span className="font-bold text-gray-900">{sprintPct}% · {doneSprintCount}/{totalSprints}</span>
              </div>
              <ProgressBar pct={sprintPct} color="bg-indigo-500" height="h-3" />
              <div className="flex gap-4 mt-3 text-xs">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" />{doneSprintCount} Done</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" />{inProgCount} Active</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300" />{notStartedCount} Pending</span>
              </div>
            </div>
            {/* Stories */}
            <div>
              <div className="flex justify-between text-xs font-medium text-gray-600 mb-2">
                <span>Stories Completed</span>
                <span className="font-bold text-gray-900">{storyPct}% · {doneStories}/{totalStories}</span>
              </div>
              <ProgressBar pct={storyPct} color="bg-emerald-500" height="h-3" />
              <div className="flex gap-4 mt-3 text-xs">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" />{doneStories} Done</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" />{activeStories} Active</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300" />{totalStories - doneStories - activeStories} To Do</span>
              </div>
            </div>
            {/* Points */}
            <div>
              <div className="flex justify-between text-xs font-medium text-gray-600 mb-2">
                <span>Story Points Delivered</span>
                <span className="font-bold text-gray-900">{displayPts ? Math.round((donePts/displayPts)*100) : 0}% · {donePts}/{displayPts}</span>
              </div>
              <ProgressBar pct={displayPts ? (donePts/displayPts)*100 : 0} color="bg-amber-500" height="h-3" />
              <div className="flex gap-4 mt-3 text-xs">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" />{donePts} pts done</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300" />{displayPts - donePts} remaining</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Sprint Status Breakdown ───────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-indigo-600" /> Sprints ({totalSprints})
          </h2>
          <div className="space-y-3">
            {sprints.map((sprint, idx) => {
              const sprintStories = stories.filter(s => s.sprint_id === sprint.sprint_id);
              const sprintDone    = sprintStories.filter(isDone).length;
              const sprintPts     = sprintStories.reduce((s, st) => s + (st.story_points || 0), 0);
              const pct           = sprint.status === 'Completed' ? 100 : (sprintStories.length > 0 ? Math.round((sprintDone / sprintStories.length) * 100) : 0);
              const cfg           = SPRINT_STATUS[sprint.status] || SPRINT_STATUS['Not Started'];
              const Icon          = cfg.icon;

              return (
                <div key={sprint.sprint_id} className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center flex-shrink-0">{idx+1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-sm font-semibold text-gray-800 truncate">{sprint.name}</span>
                      <StatusBadge status={sprint.status} />
                    </div>
                    <ProgressBar pct={pct} color={cfg.bar} height="h-2" />
                  </div>
                  <div className="flex-shrink-0 text-right min-w-[80px]">
                    <p className="text-sm font-bold text-gray-800">{pct}%</p>
                    <p className="text-xs text-gray-400">{sprintDone}/{sprintStories.length} stories</p>
                  </div>
                  <div className="flex-shrink-0 hidden md:block text-right min-w-[60px]">
                    <p className="text-xs font-semibold text-gray-700">{sprintPts} pts</p>
                    {(sprint.start_date || sprint.end_date) && (
                      <p className="text-xs text-gray-400 whitespace-nowrap">
                        {fmt(sprint.start_date)} → {fmt(sprint.end_date)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
            {sprints.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No sprints found</p>}
          </div>
        </div>

        {/* ── Epics Grid ─────────────────────────────────────────────── */}
        {epics.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Flag className="w-4 h-4 text-indigo-600" /> Epics ({epics.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {epics.map((epic, i) => {
                const ec   = EPIC_COLORS[i % EPIC_COLORS.length];
                const eSt  = epicMap[epic.epic_id] || [];
                const eDone = eSt.filter(isDone).length;
                const ePts  = eSt.reduce((s, st) => s + (st.story_points || 0), 0);
                const ePct  = eSt.length > 0 ? Math.round((eDone / eSt.length) * 100) : 0;
                return (
                  <div
                    key={epic.epic_id}
                    onClick={() => setActiveEpicFilter(f => f === epic.epic_id ? null : epic.epic_id)}
                    className={`rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md ${activeEpicFilter === epic.epic_id ? 'ring-2 ring-indigo-400' : ''} ${ec.light}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-8 h-8 bg-gradient-to-br ${ec.gradient} rounded-lg flex items-center justify-center shadow-sm`}>
                        <Target className="w-4 h-4 text-white" />
                      </div>
                      <span className={`text-xs font-semibold ${ec.text} bg-white/70 px-2 py-0.5 rounded-full border`}>
                        {eSt.length} stories
                      </span>
                    </div>
                    <h3 className={`font-bold text-sm ${ec.text} mb-1 leading-tight`}>{epic.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{epic.description}</p>
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                      <span>{ePts} pts</span>
                      <span className="font-semibold">{ePct}% done</span>
                    </div>
                    <ProgressBar pct={ePct} color="bg-indigo-500" height="h-1.5" />
                  </div>
                );
              })}
            </div>
            {activeEpicFilter && (
              <button onClick={() => setActiveEpicFilter(null)} className="mt-3 text-xs text-indigo-600 hover:underline">
                Clear filter
              </button>
            )}
          </div>
        )}

        {/* ── Team Resources ────────────────────────────────────────────── */}
        {resources.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" /> Team ({resources.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-400 font-semibold uppercase tracking-wide">
                    <th className="px-4 py-2.5 text-left">Member</th>
                    <th className="px-4 py-2.5 text-left">Role</th>
                    <th className="px-4 py-2.5 text-center">Capacity</th>
                    <th className="px-4 py-2.5 text-left">Skills</th>
                    <th className="px-4 py-2.5 text-left">Workload</th>
                  </tr>
                </thead>
                <tbody>
                  {resources.map((r, i) => {
                    const assigned    = stories.filter(s => s.assigned_to_resource_id === r.resource_id || s.assigned_to_resource_id === r.name);
                    const workHours   = assigned.reduce((s, st) => s + (st.estimated_effort_hours || 0), 0);
                    const maxHours    = (r.daily_capacity_hours || 6) * (totalSprints * 10 || 30);
                    const workPct     = Math.min((workHours / maxHours) * 100, 100);
                    const doneAsgn    = assigned.filter(isDone).length;

                    return (
                      <tr key={r.resource_id} className={`border-t border-gray-50 hover:bg-indigo-50/20 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                        <td className="px-4 py-3 text-left">
                          <div className="flex items-center gap-2.5 justify-start">
                            <div className={`w-9 h-9 bg-gradient-to-br ${roleGrad(r.role)} rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0`}>
                              {initials(r.name)}
                            </div>
                            <div className="text-left">
                              <p className="font-semibold text-gray-900 text-left">{r.name}</p>
                              <p className="text-xs text-gray-400 text-left">{assigned.length} stories · {doneAsgn} done</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-left">
                          <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full font-semibold capitalize">{r.role}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-xs font-semibold text-gray-700">{r.daily_capacity_hours || 6}h/day</span>
                        </td>
                        <td className="px-4 py-3 text-left">
                          <div className="flex flex-wrap gap-1 justify-start">
                            {(r.skills || []).slice(0, 3).map(sk => (
                              <span key={sk} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">{sk}</span>
                            ))}
                            {(r.skills || []).length > 3 && <span className="text-xs text-gray-400">+{r.skills.length - 3}</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-left">
                          <div className="min-w-[120px] text-left">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>{workHours}h assigned</span>
                              <span className={workPct > 80 ? 'text-red-500 font-bold' : 'text-gray-600'}>{Math.round(workPct)}%</span>
                            </div>
                            <ProgressBar
                              pct={workPct}
                              color={workPct > 80 ? 'bg-red-500' : workPct > 60 ? 'bg-amber-500' : 'bg-emerald-500'}
                              height="h-2"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── User Stories ─────────────────────────────────────────────── */}
        {stories.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                User Stories ({filteredStories.length}{activeEpicFilter ? ' filtered' : ''})
              </h2>
              <div className="flex items-center gap-2">
                {epics.length > 0 && (
                  <select
                    value={activeEpicFilter || ''}
                    onChange={e => setActiveEpicFilter(e.target.value || null)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="">All Epics</option>
                    {epics.map(e => <option key={e.epic_id} value={e.epic_id}>{e.name}</option>)}
                  </select>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 font-semibold uppercase tracking-wide">
                    <th className="px-4 py-2.5 text-left">Story</th>
                    <th className="px-4 py-2.5 text-left">Epic</th>
                    <th className="px-4 py-2.5 text-left">Sprint</th>
                    <th className="px-4 py-2.5 text-left">Priority</th>
                    <th className="px-4 py-2.5 text-center">Pts</th>
                    <th className="px-4 py-2.5 text-center">Hrs</th>
                    <th className="px-4 py-2.5 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedStories.map((story, si) => {
                    const epicObj    = epics.find(e => e.epic_id === story.epic_id);
                    const sprintObj  = sprints.find(s => s.sprint_id === story.sprint_id);
                    const ec         = EPIC_COLORS[epics.findIndex(e => e.epic_id === story.epic_id) % EPIC_COLORS.length];
                    const pCfg = {
                      High:   'text-red-600 bg-red-50 border-red-200',
                      Medium: 'text-amber-600 bg-amber-50 border-amber-200',
                      Low:    'text-green-600 bg-green-50 border-green-200',
                    }[story.priority] || 'text-gray-600 bg-gray-50 border-gray-200';

                    return (
                      <tr key={story.story_id} className={`border-t border-gray-50 hover:bg-indigo-50/20 transition-colors`}>
                        <td className="px-4 py-2.5 text-left">
                          <p className="font-medium text-gray-800 leading-tight text-left">{story.name}</p>
                        </td>
                        <td className="px-4 py-2.5 text-left">
                          {epicObj && (
                            <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${ec?.light || ''} ${ec?.text || ''}`}>
                              {epicObj.name}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-gray-500 text-left">{sprintObj?.name || '—'}</td>
                        <td className="px-4 py-2.5 text-left">
                          <span className={`inline-block px-2 py-0.5 rounded border font-semibold ${pCfg}`}>{story.priority || 'Medium'}</span>
                        </td>
                        <td className="px-4 py-2.5 text-center font-bold text-gray-700">{story.story_points || 0}</td>
                        <td className="px-4 py-2.5 text-center text-gray-500">{story.estimated_effort_hours || 0}h</td>
                        <td className="px-4 py-2.5 text-left">
                          <StatusBadge status={story.status || 'Not Started'} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredStories.length > 12 && (
              <button
                onClick={() => setShowAllStories(v => !v)}
                className="mt-4 flex items-center gap-1.5 text-xs text-indigo-600 font-medium hover:underline"
              >
                {showAllStories ? <><ChevronUp className="w-3.5 h-3.5" /> Show less</> : <><ChevronDown className="w-3.5 h-3.5" /> Show all {filteredStories.length} stories</>}
              </button>
            )}
          </div>
        )}

        {/* ── Bottom Nav ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <button
            onClick={() => navigate('/project-detail')}
            className="flex items-center gap-2 px-4 py-2.5 border border-indigo-200 text-indigo-600 rounded-xl text-sm font-medium hover:bg-indigo-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Project Timeline
          </button>
          <button
            onClick={() => navigate('/sprintmanager')}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all"
          >
            Sprint Manager <ArrowLeft className="w-4 h-4 rotate-180" />
          </button>
        </div>

        <div className="h-6" />
      </div>
    </div>
  );
};

export default ProjectView;