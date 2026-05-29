import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Calendar, Clock, Users, BarChart2,
  BookOpen, Layers, CheckCircle, Circle, Pause, Play,
  AlertCircle, RefreshCw, Target, TrendingUp, Award,
  ChevronDown, ChevronUp, Save, Zap, Flag, GitBranch, Eye
} from 'lucide-react';
import pmrgLogo from '../src/assets/pmrglogo.png';
import API_ENDPOINTS from './Auths';

// ─── helpers ────────────────────────────────────────────────────────────────

const fmt = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
};

const fmtShort = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
};

const daysBetween = (a, b) => {
  if (!a || !b) return null;
  return Math.ceil((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24)) + 1;
};

const addDays = (dateStr, days) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

const isoToInput = (iso) => {
  if (!iso) return '';
  // strip time if present
  return (iso || '').split('T')[0];
};

// Returns today's date as yyyy-mm-dd
const today = () => new Date().toISOString().split('T')[0];

// Returns the later of two dates as yyyy-mm-dd
const maxDate = (a, b) => {
  if (!a) return b;
  if (!b) return a;
  return a > b ? a : b;
};

// ─── status config ───────────────────────────────────────────────────────────
const STATUS = {
  'Completed':   { bar: 'bg-emerald-500', light: 'bg-emerald-50',  text: 'text-emerald-700', border: 'border-emerald-300', icon: CheckCircle, label: 'Completed'   },
  'Done':        { bar: 'bg-emerald-500', light: 'bg-emerald-50',  text: 'text-emerald-700', border: 'border-emerald-300', icon: CheckCircle, label: 'Done'        },
  'done':        { bar: 'bg-emerald-500', light: 'bg-emerald-50',  text: 'text-emerald-700', border: 'border-emerald-300', icon: CheckCircle, label: 'Done'        },
  'In Progress': { bar: 'bg-blue-500',    light: 'bg-blue-50',     text: 'text-blue-700',    border: 'border-blue-300',    icon: Play,        label: 'In Progress' },
  'in progress': { bar: 'bg-blue-500',    light: 'bg-blue-50',     text: 'text-blue-700',    border: 'border-blue-300',    icon: Play,        label: 'In Progress' },
  'Paused':      { bar: 'bg-amber-400',   light: 'bg-amber-50',    text: 'text-amber-700',   border: 'border-amber-300',   icon: Pause,       label: 'Paused'      },
  'paused':      { bar: 'bg-amber-400',   light: 'bg-amber-50',    text: 'text-amber-700',   border: 'border-amber-300',   icon: Pause,       label: 'Paused'      },
  'Blocked':     { bar: 'bg-red-500',     light: 'bg-red-50',      text: 'text-red-700',     border: 'border-red-300',     icon: AlertCircle, label: 'Blocked'     },
  'blocked':     { bar: 'bg-red-500',     light: 'bg-red-50',      text: 'text-red-700',     border: 'border-red-300',     icon: AlertCircle, label: 'Blocked'     },
  'To Do':       { bar: 'bg-slate-300',   light: 'bg-slate-50',    text: 'text-slate-600',   border: 'border-slate-300',   icon: Circle,      label: 'To Do'       },
  'to do':       { bar: 'bg-slate-300',   light: 'bg-slate-50',    text: 'text-slate-600',   border: 'border-slate-300',   icon: Circle,      label: 'To Do'       },
  'todo':        { bar: 'bg-slate-300',   light: 'bg-slate-50',    text: 'text-slate-600',   border: 'border-slate-300',   icon: Circle,      label: 'To Do'       },
  'Not Started': { bar: 'bg-slate-300',   light: 'bg-slate-50',    text: 'text-slate-600',   border: 'border-slate-300',   icon: Circle,      label: 'Not Started' },
  'not started': { bar: 'bg-slate-300',   light: 'bg-slate-50',    text: 'text-slate-600',   border: 'border-slate-300',   icon: Circle,      label: 'Not Started' },
};

const EPIC_COLORS = [
  { gradient: 'from-violet-500 to-purple-600',  ring: 'ring-violet-300', text: 'text-violet-700', light: 'bg-violet-50 border-violet-200' },
  { gradient: 'from-rose-500 to-pink-600',      ring: 'ring-rose-300',   text: 'text-rose-700',   light: 'bg-rose-50 border-rose-200'     },
  { gradient: 'from-sky-500 to-blue-600',       ring: 'ring-sky-300',    text: 'text-sky-700',    light: 'bg-sky-50 border-sky-200'       },
  { gradient: 'from-amber-500 to-orange-600',   ring: 'ring-amber-300',  text: 'text-amber-700',  light: 'bg-amber-50 border-amber-200'   },
  { gradient: 'from-teal-500 to-emerald-600',   ring: 'ring-teal-300',   text: 'text-teal-700',   light: 'bg-teal-50 border-teal-200'     },
  { gradient: 'from-fuchsia-500 to-violet-600', ring: 'ring-fuchsia-300',text: 'text-fuchsia-700',light: 'bg-fuchsia-50 border-fuchsia-200'},
];

const ROLE_GRADIENT = {
  frontend:  'from-blue-400 to-indigo-500',
  backend:   'from-green-400 to-emerald-500',
  fullstack: 'from-violet-400 to-purple-500',
  qa:        'from-amber-400 to-orange-500',
  devops:    'from-sky-400 to-cyan-500',
  designer:  'from-pink-400 to-rose-500',
  manager:   'from-slate-500 to-gray-600',
};

const roleGrad = (role) =>
  ROLE_GRADIENT[(role || '').toLowerCase()] || 'from-indigo-400 to-blue-500';

const initials = (name = '') =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

// ─── Gantt helpers ───────────────────────────────────────────────────────────

const buildGantt = (sprints, projectStartDate) => {
  const valid = sprints.filter((s) => s.start_date && s.end_date);

  let gStart, gEnd, totalDays;

  if (valid.length > 0) {
    gStart    = new Date(Math.min(...valid.map((s) => new Date(s.start_date))));
    gEnd      = new Date(Math.max(...valid.map((s) => new Date(s.end_date))));
    totalDays = Math.ceil((gEnd - gStart) / (1000 * 60 * 60 * 24)) + 1;
  } else {
    // no dates — sequential layout based on duration
    gStart    = projectStartDate ? new Date(projectStartDate) : new Date();
    totalDays = sprints.reduce((s, sp) => s + (sp.duration_days || 14), 0) || 90;
    gEnd      = new Date(gStart.getTime() + totalDays * 24 * 60 * 60 * 1000);
  }

  return { gStart, gEnd, totalDays };
};

const sprintBar = (sprint, gStart, totalDays, index) => {
  if (sprint.start_date && sprint.end_date) {
    const s    = (new Date(sprint.start_date) - gStart) / (1000 * 60 * 60 * 24);
    const dur  = daysBetween(sprint.start_date, sprint.end_date) || sprint.duration_days || 14;
    return { left: (s / totalDays) * 100, width: Math.max((dur / totalDays) * 100, 1.5) };
  }
  // sequential fallback
  return { left: (index * 14 / totalDays) * 100, width: ((sprint.duration_days || 14) / totalDays) * 100 };
};

// generate month markers for the Gantt header
const monthMarkers = (gStart, totalDays) => {
  const marks = [];
  const cur = new Date(gStart);
  cur.setDate(1);
  const endTime = gStart.getTime() + totalDays * 24 * 60 * 60 * 1000;
  while (cur <= new Date(endTime)) {
    const offset = (cur - gStart) / (1000 * 60 * 60 * 24);
    marks.push({
      label: cur.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      pct:   (offset / totalDays) * 100,
      daysFromStart: offset,
    });
    cur.setMonth(cur.getMonth() + 1);
  }

  // Filter markers to avoid overlap.
  // 1. If a marker's pct is negative, it means the month started before gStart.
  //    Its visible duration in the timeline is the next marker's daysFromStart.
  //    If this visible duration is less than 8 days, we omit this first marker.
  // 2. Otherwise, we clamp all remaining markers' pct to >= 0.
  // 3. To prevent any other general overlaps, if two markers are closer than 12% in pct,
  //    we can omit the second one (or the first one if the first is at 0%).
  const processed = [];
  for (let i = 0; i < marks.length; i++) {
    const m = marks[i];
    if (m.pct < 0) {
      const next = marks[i + 1];
      if (next && next.daysFromStart < 8) {
        continue;
      }
      processed.push({ label: m.label, pct: 0 });
    } else {
      processed.push({ label: m.label, pct: m.pct });
    }
  }

  const finalMarks = [];
  for (const m of processed) {
    if (finalMarks.length > 0) {
      const prev = finalMarks[finalMarks.length - 1];
      if (m.pct - prev.pct < 12) {
        if (prev.pct === 0) {
          finalMarks[finalMarks.length - 1] = m;
        } else {
          continue;
        }
      } else {
        finalMarks.push(m);
      }
    } else {
      finalMarks.push(m);
    }
  }

  return finalMarks;
};

// ─── mini sub-components ─────────────────────────────────────────────────────

const StatCard = ({ icon: Icon, value, label, gradient, sub }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
    <div className={`w-11 h-11 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-md flex-shrink-0`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div className="min-w-0">
      <p className="text-xl font-bold text-gray-900 leading-none truncate">{value ?? '—'}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const cfg = STATUS[status] || STATUS['Not Started'];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold ${cfg.light} ${cfg.text} ${cfg.border}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
};

const ProgressBar = ({ pct, color = 'bg-indigo-500', height = 'h-2' }) => (
  <div className={`w-full bg-gray-100 rounded-full ${height} overflow-hidden`}>
    <div
      className={`${height} ${color} rounded-full transition-all duration-700`}
      style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
    />
  </div>
);

// ─── Date input cell ─────────────────────────────────────────────────────────
// Fully controlled: value prop drives the display; onChange fires on every pick;
// onSave fires on blur (after browser min-validation passes).
// minDate: browser enforces via the `min` attribute — no manual re-validation needed.

const DateCell = ({ value, onChange, onSave, saving, minDate, maxDate }) => {
  const [local, setLocal] = useState(isoToInput(value) || '');

  // Keep in sync when parent updates the value (e.g. auto-shift from start-date change)
  useEffect(() => { setLocal(isoToInput(value) || ''); }, [value]);

  const handleChange = (e) => {
    const v = e.target.value;
    setLocal(v);
    onChange(v);          // update parent localDates immediately
  };

  return (
    <div className="flex items-center gap-1 min-w-0">
      <input
        type="date"
        value={local}
        min={minDate || undefined}
        max={maxDate || undefined}
        onChange={handleChange}
        onBlur={() => { if (local) onSave(local); }}
        className="w-[7.5rem] text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white text-gray-700 cursor-pointer hover:border-indigo-300 transition-colors"
      />
      {saving === 'saving' && <RefreshCw className="w-3 h-3 text-indigo-400 animate-spin flex-shrink-0" />}
      {saving === 'saved'  && <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />}
      {saving === 'error'  && <AlertCircle className="w-3 h-3 text-red-500 flex-shrink-0" />}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ProjectDetailPage = () => {
  const navigate = useNavigate();

  const [project,      setProject]      = useState(null);
  const [isLoading,    setIsLoading]    = useState(true);
  const [error,        setError]        = useState(null);
  const [localDates,   setLocalDates]   = useState({});   // { sprintId: { start_date, end_date } }
  const [savingState,  setSavingState]  = useState({});   // { sprintId: 'saving' | 'saved' | 'error' }
  const [showStories,  setShowStories]  = useState(false);
  const [activeEpic,   setActiveEpic]   = useState(null);
  const [autoCalcDone, setAutoCalcDone] = useState(false);

  // ── Fetch project ────────────────────────────────────────────────────
  const fetchProject = useCallback(async () => {
    const projectId = localStorage.getItem('activeProjectId');
    if (!projectId) { navigate('/projects'); return; }

    setIsLoading(true);
    setError(null);
    try {
      const res  = await fetch(API_ENDPOINTS.GET_PROJECT(projectId));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setProject(data);

      // Seed local dates from project plan sprints
      const dates = {};
      (data.project_plan?.sprints || []).forEach((s) => {
        dates[s.sprint_id] = { start_date: s.start_date || '', end_date: s.end_date || '' };
      });
      setLocalDates(dates);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => { fetchProject(); }, [fetchProject]);

  // ── Auto-calculate dates from project CREATION date ─────────────────
  // We use project.created_at (the DB record creation time) as the anchor
  // so dates are never in the past.
  const handleAutoCalcDates = async () => {
    if (!project) return;
    const plan       = project.project_plan || {};
    const sprints    = plan.sprints || [];
    const projectId  = project.project_id;

    // Base = max(today, plan.start_date, project.created_at)
    // This ensures we never generate dates in the past.
    const createdAt  = project.created_at ? isoToInput(project.created_at) : today();
    const planStart  = plan.start_date     ? isoToInput(plan.start_date)    : null;
    const baseDate   = maxDate(today(), maxDate(createdAt, planStart || createdAt));

    const newDates = {};
    let cursor = baseDate;

    for (const sprint of sprints) {
      const dur   = sprint.duration_days || 14;
      const start = cursor;
      const end   = addDays(start, dur - 1);
      newDates[sprint.sprint_id] = { start_date: start, end_date: end };
      cursor = addDays(end, 1);   // next sprint starts day after previous ends

      try {
        await fetch(API_ENDPOINTS.UPDATE_SPRINT_STATUS(projectId, sprint.sprint_id), {
          method:  'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({
            status:     sprint.status || 'Not Started',
            start_date: start,
            end_date:   end,
          }),
        });
      } catch (_) { /* keep going */ }
    }

    setLocalDates(newDates);
    setAutoCalcDone(true);
    setTimeout(() => setAutoCalcDone(false), 3000);
    // Re-fetch to sync from DB
    await fetchProject();
  };

  // ── Save a single sprint date (with validation) ──────────────────────
  const saveDateField = async (sprint, field, value) => {
    const projectId = project?.project_id;
    if (!projectId || !value) return;

    const cur        = localDates[sprint.sprint_id] || {};
    const start_date = field === 'start_date' ? value : (cur.start_date || isoToInput(sprint.start_date) || '');
    const end_date   = field === 'end_date'   ? value : (cur.end_date   || isoToInput(sprint.end_date)   || '');

    // Validation: end must be >= start
    if (start_date && end_date && end_date < start_date) {
      alert(`End date (${end_date}) cannot be before start date (${start_date}). Please correct the dates.`);
      return;
    }

    // Validation: cannot be less than project creation date
    const creationDate = project.created_at ? isoToInput(project.created_at) : today();
    if (start_date && start_date < creationDate) {
      alert(`Start date (${start_date}) cannot be before project creation date (${creationDate}). Please correct the dates.`);
      return;
    }
    if (end_date && end_date < creationDate) {
      alert(`End date (${end_date}) cannot be before project creation date (${creationDate}). Please correct the dates.`);
      return;
    }

    // Update local state immediately so duration column refreshes live
    setLocalDates((p) => ({
      ...p,
      [sprint.sprint_id]: { start_date, end_date },
    }));

    setSavingState((p) => ({ ...p, [sprint.sprint_id]: 'saving' }));
    try {
      await fetch(API_ENDPOINTS.UPDATE_SPRINT_STATUS(projectId, sprint.sprint_id), {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status: sprint.status || 'Not Started', start_date, end_date }),
      });
      setSavingState((p) => ({ ...p, [sprint.sprint_id]: 'saved' }));
      setTimeout(() => setSavingState((p) => ({ ...p, [sprint.sprint_id]: null })), 2500);
    } catch {
      setSavingState((p) => ({ ...p, [sprint.sprint_id]: 'error' }));
    }
  };

  // ── Navigate to Sprint Manager — pass updated sprint data ────────────
  const handleOpenSprintManager = () => {
    if (!project) return;
    const plan     = project.project_plan || {};
    const sprints  = plan.sprints || [];
    const stories  = plan.user_stories || [];
    const resources = plan.resources || [];

    // Merge local date edits back into sprint objects
    const enrichedSprints = sprints.map((sprint) => ({
      ...sprint,
      start_date: localDates[sprint.sprint_id]?.start_date || sprint.start_date,
      end_date:   localDates[sprint.sprint_id]?.end_date   || sprint.end_date,
    }));

    // Build sprintManagerData format
    const sprintManagerList = enrichedSprints.map((sprint, index) => {
      const assigned = stories.filter((s) => s.sprint_id === sprint.sprint_id);
      const dur = daysBetween(sprint.start_date, sprint.end_date) || sprint.duration_days || 14;
      return {
        id:                sprint.sprint_id,
        name:              sprint.name,
        days:              `${dur}d`,
        status:            sprint.status || 'Not Started',
        startDate:         sprint.start_date || null,
        endDate:           sprint.end_date   || null,
        selected:          index === 0,
        color:             index === 0 ? 'bg-orange-200' : 'bg-gray-100',
        storiesCount:      assigned.length,
        backlogCount:      0,
        resourcesCount:    resources.length,
        totalStoryPoints:  assigned.reduce((s, st) => s + (st.story_points || 0), 0),
        totalEffortHours:  assigned.reduce((s, st) => s + (st.estimated_effort_hours || 0), 0),
        projectKey:        project.project_id,
      };
    });

    const enrichedPlan = { ...plan, sprints: enrichedSprints };

    localStorage.setItem('sprintManagerData', JSON.stringify(sprintManagerList));
    localStorage.setItem('projectData',       JSON.stringify(enrichedPlan));
    localStorage.setItem('cachedProjectId',   project.project_id);
    navigate('/sprintmanager');
  };

  // ── Derived data ─────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm font-medium">Loading project timeline…</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-gray-700 font-semibold mb-1">Failed to load project</p>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button onClick={() => navigate('/projects')} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm">
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const plan        = project.project_plan || {};
  const sprints     = plan.sprints     || [];
  const stories     = plan.user_stories || [];
  const epics       = plan.epics       || [];
  const resources   = plan.resources   || [];
  const tasks       = plan.tasks       || [];

  // Sprints with merged local dates
  const enrichedSprints = sprints.map((s) => ({
    ...s,
    start_date: localDates[s.sprint_id]?.start_date || s.start_date,
    end_date:   localDates[s.sprint_id]?.end_date   || s.end_date,
  }));

  // ── Dynamic project dates ──
  const validStarts = enrichedSprints.map(s => s.start_date).filter(Boolean);
  const validEnds = enrichedSprints.map(s => s.end_date).filter(Boolean);
  const projectStartDate = validStarts.length > 0 ? validStarts.reduce((min, d) => d < min ? d : min, validStarts[0]) : plan.start_date;
  const projectEndDate = validEnds.length > 0 ? validEnds.reduce((max, d) => d > max ? d : max, validEnds[0]) : plan.end_date;

  // Progress metrics
  const totalSprints    = sprints.length;
  const doneSprintCount = enrichedSprints.filter((s) => s.status === 'Completed').length;
  const inProgCount     = enrichedSprints.filter((s) => s.status === 'In Progress').length;
  const totalStories    = stories.length;
  const doneStories     = stories.filter((s) => (s.status || '').toLowerCase().includes('done') || (s.status || '').toLowerCase().includes('complete')).length;
  const totalPts        = stories.reduce((s, st) => s + (st.story_points || 0), 0);
  const donePts         = stories.filter((s) => (s.status || '').toLowerCase().includes('done') || (s.status || '').toLowerCase().includes('complete')).reduce((s, st) => s + (st.story_points || 0), 0);
  const totalHours      = stories.reduce((s, st) => s + (st.estimated_effort_hours || 0), 0);
  const sprintPct       = totalSprints > 0 ? Math.round((doneSprintCount / totalSprints) * 100) : 0;
  const storyPct        = totalStories > 0 ? Math.round((doneStories  / totalStories)  * 100) : 0;
  const overallPct      = Math.round((sprintPct * 0.6) + (storyPct * 0.4));

  // Gantt
  const { gStart, totalDays } = buildGantt(enrichedSprints, plan.start_date);
  const marks = monthMarkers(gStart, totalDays);

  // Stories grouped by epic
  const epicStoriesMap = {};
  epics.forEach((e) => {
    epicStoriesMap[e.epic_id] = stories.filter((s) => s.epic_id === e.epic_id);
  });

  // Resource → assigned stories count
  const resourceStoryCount = {};
  resources.forEach((r) => {
    resourceStoryCount[r.resource_id] = stories.filter(
      (s) => s.assigned_to_resource_id === r.resource_id || s.assigned_to_resource_id === r.name
    ).length;
  });

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-purple-50/10">

      {/* ── Sticky Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate('/projects')}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-700 transition-colors font-medium flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" /> Projects
            </button>
            <span className="text-gray-300">/</span>
            <span className="text-sm font-semibold text-gray-800 truncate max-w-xs">{project.name}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto-calc dates button */}
            <button
              onClick={handleAutoCalcDates}
              title="Auto-generate sprint dates sequentially from project start"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                autoCalcDone
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              {autoCalcDone ? 'Dates Applied!' : 'Auto-Calculate Dates'}
            </button>

            <button
              onClick={handleOpenSprintManager}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-violet-700 transition-all"
            >
              Open Sprint Manager
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-6 py-6 space-y-6">

        {/* ── Hero Section ───────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-violet-950 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
          {/* decorative circles */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <img src={pmrgLogo} alt="PMRG" className="h-8 w-auto opacity-80" />
                <StatusBadge status={project.status} />
                {(projectStartDate || projectEndDate) && (
                  <span className="flex items-center gap-1 text-xs text-indigo-300 bg-white/10 px-2.5 py-1 rounded-full">
                    <Calendar className="w-3 h-3" />
                    {fmt(projectStartDate)} → {fmt(projectEndDate)}
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
                {plan.project_name || project.name}
              </h1>

              <p className="text-slate-300 text-sm leading-relaxed max-w-2xl mb-4">
                {plan.description || project.description || 'No description provided.'}
              </p>

              {plan.product_vision && (
                <div className="border-l-4 border-indigo-400 pl-4 mt-4">
                  <p className="text-xs text-indigo-300 uppercase tracking-widest mb-1 font-semibold">Product Vision</p>
                  <p className="text-slate-200 text-sm italic leading-relaxed">"{plan.product_vision}"</p>
                </div>
              )}
            </div>

            {/* Overall progress ring */}
            <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center min-w-[180px]">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke="url(#prog)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${overallPct}, 100`}
                  />
                  <defs>
                    <linearGradient id="prog" x1="0%" y1="0%" x2="100%" y2="0%">
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
              <p className="text-indigo-300 text-xs mt-1">
                {doneSprintCount}/{totalSprints} sprints done
              </p>
            </div>
          </div>
        </div>

        {/* ── Stats Row ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatCard icon={Layers}    value={totalSprints}                             label="Sprints"        gradient="from-indigo-500 to-violet-600" />
          <StatCard icon={BookOpen}  value={totalStories}                             label="User Stories"   gradient="from-sky-500 to-blue-600"       />
          <StatCard icon={BarChart2} value={totalPts}                                 label="Story Points"   gradient="from-amber-500 to-orange-600"   sub={`${donePts} completed`} />
          <StatCard icon={Clock}     value={`${totalHours}h`}                         label="Effort Hours"   gradient="from-rose-500 to-pink-600"      />
          <StatCard icon={Users}     value={resources.length}                         label="Team Members"   gradient="from-teal-500 to-emerald-600"   sub={`${epics.length} epics`} />
        </div>

        {/* ── Progress Summary ────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" /> Project Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Sprints Completed', pct: sprintPct, val: `${doneSprintCount}/${totalSprints}`, color: 'bg-indigo-500' },
              { label: 'Stories Done',       pct: storyPct,  val: `${doneStories}/${totalStories}`,   color: 'bg-emerald-500' },
              { label: 'Story Points Done',  pct: totalPts ? Math.round((donePts / totalPts) * 100) : 0, val: `${donePts}/${totalPts} pts`, color: 'bg-amber-500' },
            ].map(({ label, pct, val, color }) => (
              <div key={label}>
                <div className="flex justify-between text-xs font-medium text-gray-600 mb-2">
                  <span>{label}</span>
                  <span className="text-gray-900 font-bold">{pct}% · {val}</span>
                </div>
                <ProgressBar pct={pct} color={color} height="h-3" />
              </div>
            ))}
          </div>
        </div>

        {/* ── Sprint Timeline (Gantt) ─────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-indigo-600" /> Sprint Timeline
              <span className="text-xs font-normal text-gray-400 ml-1">— click dates to edit, changes auto-save</span>
            </h2>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              {Object.values(STATUS).slice(0, 4).map(({ label, bar }) => (
                <span key={label} className="flex items-center gap-1">
                  <span className={`w-2.5 h-2.5 rounded-sm ${bar}`} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[1100px]">

              {/* Table header — widened start/end columns so inputs don't overflow */}
              <div className="grid bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                style={{ gridTemplateColumns: '2rem 1fr 7rem 9rem 9rem 4rem 4rem 4rem 6rem 1fr' }}>
                <div className="px-3 py-3 text-center">#</div>
                <div className="px-3 py-3 text-left">Sprint Name</div>
                <div className="px-3 py-3 text-left">Status</div>
                <div className="px-3 py-3 text-left">Start Date</div>
                <div className="px-3 py-3 text-left">End Date</div>
                <div className="px-3 py-3 text-center">Days</div>
                <div className="px-3 py-3 text-center">Stories</div>
                <div className="px-3 py-3 text-center">Points</div>
                <div className="px-3 py-3 text-left">% Done</div>
                <div className="px-3 py-3">
                  <div className="relative h-4">
                    {marks.map((m) => (
                      <span
                        key={m.label}
                        className="absolute text-gray-400 text-xs font-medium whitespace-nowrap"
                        style={{ left: `${m.pct}%` }}
                      >
                        {m.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sprint rows */}
              {enrichedSprints.map((sprint, idx) => {
                const sprintStories = stories.filter((s) => s.sprint_id === sprint.sprint_id);
                const sprintDone    = sprintStories.filter((s) =>
                  (s.status || '').toLowerCase().includes('done') ||
                  (s.status || '').toLowerCase().includes('complete')
                ).length;
                const sprintPts     = sprintStories.reduce((s, st) => s + (st.story_points || 0), 0);
                const pct           = sprint.status === 'Completed' ? 100 : (sprintStories.length > 0 ? Math.round((sprintDone / sprintStories.length) * 100) : 0);
                const dur           = daysBetween(sprint.start_date, sprint.end_date) || sprint.duration_days || 14;
                const bar           = sprintBar(sprint, gStart, totalDays, idx);
                const cfg           = STATUS[sprint.status] || STATUS['Not Started'];
                const saving        = savingState[sprint.sprint_id];

                return (
                  <div
                    key={sprint.sprint_id}
                    className={`grid border-b border-gray-50 hover:bg-indigo-50/30 transition-colors group ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                    style={{ gridTemplateColumns: '2rem 1fr 7rem 9rem 9rem 4rem 4rem 4rem 6rem 1fr' }}
                  >
                    {/* # */}
                    <div className="px-3 py-3 flex items-center justify-center">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                    </div>

                    {/* Sprint name */}
                    <div className="px-3 py-3 flex items-center text-left">
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-800 leading-tight text-left">{sprint.name}</p>
                        {sprint.sprint_goal && (
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 text-left">{sprint.sprint_goal}</p>
                        )}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="px-3 py-3 flex items-center text-left">
                      <StatusBadge status={sprint.status} />
                    </div>

                    {/* Start date — min = project creation date */}
                    <div className="px-2 py-3 flex items-center">
                      <DateCell
                        value={sprint.start_date}
                        minDate={isoToInput(project.created_at) || today()}
                        maxDate={localDates[sprint.sprint_id]?.end_date || isoToInput(sprint.end_date) || undefined}
                        onChange={(v) => {
                          setLocalDates((p) => {
                            const cur       = p[sprint.sprint_id] || {};
                            const curEnd    = cur.end_date || isoToInput(sprint.end_date) || '';
                            const updates   = { ...cur, start_date: v };
                            // If new start would be after current end, shift end forward
                            if (!curEnd || v > curEnd) {
                              const origDur = sprint.duration_days || 14;
                              updates.end_date = addDays(v, origDur - 1);
                            }
                            return { ...p, [sprint.sprint_id]: updates };
                          });
                        }}
                        onSave={(v) => {
                          // saveDateField reads localDates for end_date, so auto-shifted end also persists
                          saveDateField(sprint, 'start_date', v);
                        }}
                        saving={saving}
                      />
                    </div>

                    {/* End date — min = start date of this sprint */}
                    <div className="px-2 py-3 flex items-center">
                      <DateCell
                        value={sprint.end_date}
                        minDate={localDates[sprint.sprint_id]?.start_date || isoToInput(sprint.start_date) || isoToInput(project.created_at) || today()}
                        onChange={(v) => {
                          setLocalDates((p) => {
                            const cur       = p[sprint.sprint_id] || {};
                            const curStart  = cur.start_date || isoToInput(sprint.start_date) || isoToInput(project.created_at) || today();
                            const updates   = { ...cur, end_date: v };
                            if (v && v < curStart) {
                              updates.end_date = curStart;
                            }
                            return { ...p, [sprint.sprint_id]: updates };
                          });
                        }}
                        onSave={(v) => saveDateField(sprint, 'end_date', v)}
                        saving={saving}
                      />
                    </div>

                    {/* Duration — live from localDates, always positive */}
                    <div className="px-3 py-3 flex items-center justify-center">
                      <span className="text-sm text-gray-600 font-medium">
                        {(() => {
                          const s = localDates[sprint.sprint_id]?.start_date || isoToInput(sprint.start_date);
                          const e = localDates[sprint.sprint_id]?.end_date   || isoToInput(sprint.end_date);
                          const d = daysBetween(s, e);
                          // clamp to >= 1 if dates set, fallback to plan duration_days
                          if (s && e && e >= s) return `${Math.max(1, d)}d`;
                          return `${sprint.duration_days || 14}d`;
                        })()}
                      </span>
                    </div>

                    {/* Stories */}
                    <div className="px-3 py-3 flex items-center justify-center">
                      <span className="text-sm text-gray-700 font-semibold">{sprintStories.length}</span>
                    </div>

                    {/* Points */}
                    <div className="px-3 py-3 flex items-center justify-center">
                      <span className="text-sm text-gray-700 font-semibold">{sprintPts}</span>
                    </div>

                    {/* % complete */}
                    <div className="px-3 py-3 flex items-center gap-2 text-left">
                      <ProgressBar pct={pct} color={cfg.bar} height="h-2" />
                      <span className="text-xs text-gray-500 w-7 text-right flex-shrink-0">{pct}%</span>
                    </div>

                    {/* Gantt bar */}
                    <div className="px-3 py-3 flex items-center relative">
                      <div className="w-full h-7 bg-gray-100 rounded-lg relative overflow-hidden">
                        <div
                          className={`absolute h-full rounded-lg ${cfg.bar} opacity-80 transition-all duration-500 flex items-center px-2`}
                          style={{ left: `${bar.left}%`, width: `${bar.width}%` }}
                        >
                          {bar.width > 8 && (
                            <span className="text-white text-xs font-semibold truncate select-none">
                              {sprint.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Epics Grid ─────────────────────────────────────────────── */}
        {epics.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Flag className="w-4 h-4 text-indigo-600" /> Epics ({epics.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {epics.map((epic, i) => {
                const ec       = EPIC_COLORS[i % EPIC_COLORS.length];
                const eSt      = epicStoriesMap[epic.epic_id] || [];
                const eDone    = eSt.filter((s) =>
                  (s.status || '').toLowerCase().includes('done') ||
                  (s.status || '').toLowerCase().includes('complete')
                ).length;
                const ePts     = eSt.reduce((s, st) => s + (st.story_points || 0), 0);
                const ePct     = eSt.length > 0 ? Math.round((eDone / eSt.length) * 100) : 0;
                const isActive = activeEpic === epic.epic_id;

                return (
                  <div key={epic.epic_id} className={`rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md ${isActive ? 'ring-2 ring-indigo-400' : ''} ${ec.light}`}>
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

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span>{ePts} pts</span>
                      <span className="font-semibold">{ePct}% done</span>
                    </div>
                    <ProgressBar pct={ePct} color="bg-indigo-500" height="h-1.5" />

                    {/* DoD/DoR counts */}
                    {(epic.definition_of_done?.length > 0 || epic.definition_of_ready?.length > 0) && (
                      <div className="flex gap-2 mt-2">
                        {epic.definition_of_ready?.length > 0 && (
                          <span className="text-xs text-gray-400">{epic.definition_of_ready.length} DoR</span>
                        )}
                        {epic.definition_of_done?.length > 0 && (
                          <span className="text-xs text-gray-400">{epic.definition_of_done.length} DoD</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Team / Resources ───────────────────────────────────────── */}
        {resources.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" /> Team ({resources.length} members)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {resources.map((r, i) => {
                const grad       = roleGrad(r.role);
                const storyCount = resourceStoryCount[r.resource_id] || 0;
                return (
                  <div key={r.resource_id} className="bg-gray-50 rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${grad} rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0`}>
                        {initials(r.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{r.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{r.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" /> {storyCount} stories
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {r.daily_capacity_hours || 6}h/day
                      </span>
                    </div>

                    {r.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {r.skills.slice(0, 4).map((sk) => (
                          <span key={sk} className="text-xs bg-white border border-gray-200 text-gray-600 px-1.5 py-0.5 rounded-md">
                            {sk}
                          </span>
                        ))}
                        {r.skills.length > 4 && (
                          <span className="text-xs text-gray-400">+{r.skills.length - 4}</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── User Stories accordion ──────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => setShowStories((v) => !v)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              User Stories ({totalStories})
              <span className="text-xs font-normal text-gray-400">— grouped by epic</span>
            </h2>
            {showStories ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>

          {showStories && (
            <div className="border-t border-gray-100">
              {epics.map((epic, ei) => {
                const eSt = epicStoriesMap[epic.epic_id] || [];
                if (eSt.length === 0) return null;
                const ec = EPIC_COLORS[ei % EPIC_COLORS.length];

                return (
                  <div key={epic.epic_id}>
                    {/* Epic header row */}
                    <div className={`px-6 py-2 flex items-center gap-3 ${ec.light}`}>
                      <div className={`w-5 h-5 bg-gradient-to-br ${ec.gradient} rounded flex items-center justify-center`}>
                        <Flag className="w-3 h-3 text-white" />
                      </div>
                      <span className={`text-xs font-bold ${ec.text}`}>{epic.name}</span>
                      <span className="text-xs text-gray-400">{eSt.length} stories</span>
                    </div>

                    {/* Story rows */}
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[700px] text-xs">
                        <thead>
                          <tr className="bg-gray-50 text-gray-400 font-semibold uppercase tracking-wide">
                            <th className="px-6 py-2 text-left">Story</th>
                            <th className="px-3 py-2 text-left">Sprint</th>
                            <th className="px-3 py-2 text-left">Priority</th>
                            <th className="px-3 py-2 text-center">Pts</th>
                            <th className="px-3 py-2 text-center">Hours</th>
                            <th className="px-3 py-2 text-left">Assigned To</th>
                            <th className="px-3 py-2 text-left">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {eSt.map((story, si) => {
                            const sprintName = sprints.find((s) => s.sprint_id === story.sprint_id)?.name || '—';
                            const pCfg = {
                              High:   'text-red-600 bg-red-50 border-red-200',
                              Medium: 'text-amber-600 bg-amber-50 border-amber-200',
                              Low:    'text-green-600 bg-green-50 border-green-200',
                            }[story.priority] || 'text-gray-600 bg-gray-50 border-gray-200';

                            const assignedResource = resources.find(
                              (r) => r.resource_id === story.assigned_to_resource_id || r.name === story.assigned_to_resource_id
                            );

                            return (
                              <tr key={story.story_id} className={`border-t border-gray-50 hover:bg-indigo-50/20 transition-colors ${si % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                                <td className="px-6 py-2.5 text-left">
                                  <p className="font-medium text-gray-800 leading-tight text-left">{story.name}</p>
                                  {story.description && (
                                    <p className="text-gray-400 mt-0.5 line-clamp-1 text-left">{story.description}</p>
                                  )}
                                </td>
                                <td className="px-3 py-2.5 text-gray-500 whitespace-nowrap text-left">{sprintName}</td>
                                <td className="px-3 py-2.5 text-left">
                                  <span className={`inline-block px-2 py-0.5 rounded border font-semibold ${pCfg}`}>
                                    {story.priority || 'Medium'}
                                  </span>
                                </td>
                                <td className="px-3 py-2.5 text-center font-bold text-gray-700">{story.story_points || 0}</td>
                                <td className="px-3 py-2.5 text-center text-gray-500">{story.estimated_effort_hours || 0}h</td>
                                <td className="px-3 py-2.5 text-left">
                                  {assignedResource ? (
                                    <div className="flex items-center gap-1.5 justify-start">
                                      <div className={`w-5 h-5 bg-gradient-to-br ${roleGrad(assignedResource.role)} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                                        {initials(assignedResource.name)}
                                      </div>
                                      <span className="text-gray-700 truncate">{assignedResource.name}</span>
                                    </div>
                                  ) : (
                                    <span className="text-gray-400">{story.assigned_to_resource_id || '—'}</span>
                                  )}
                                </td>
                                <td className="px-3 py-2.5 text-left">
                                  <StatusBadge status={story.status || 'Not Started'} />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Bottom CTA ─────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 flex items-center justify-between shadow-lg">
          <div>
            <h3 className="text-white font-bold text-lg">Ready to manage sprints?</h3>
            <p className="text-indigo-200 text-sm mt-0.5">
              Set your sprint dates above, then open the Sprint Manager to track progress.
            </p>
          </div>
          <button
            onClick={handleOpenSprintManager}
            className="flex items-center gap-2 px-8 py-3.5 bg-white text-indigo-700 rounded-xl font-bold shadow-md hover:shadow-xl hover:scale-105 transition-all text-sm flex-shrink-0"
          >
            Open Sprint Manager
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="h-6" />
      </div>
    </div>
  );
};

export default ProjectDetailPage;
