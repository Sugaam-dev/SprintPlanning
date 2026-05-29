import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import HomePage from './HomePage';
import SprintPlanningPage from './SprintPlanningPage';
import SprintManager from './SprintManager';
import SprintBoard from './SprintBoard';
import EpicManager from './EpicManager';
import EpicsView from './view/EpicsView';
import ProjectView from './view/ProjectView';
import Backlog from './Backlog';
import ProjectsPage from './ProjectsPage';
import ProjectDetailPage from './ProjectDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"              element={<HomePage />} />
        <Route path="/projects"      element={<ProjectsPage />} />
        <Route path="/project-detail" element={<ProjectDetailPage />} />
        <Route path="/planning"      element={<SprintPlanningPage />} />
        <Route path="/sprintmanager" element={<SprintManager />} />
        <Route path="/board"         element={<SprintBoard />} />
        <Route path="/view"          element={<ProjectView />} />
        <Route path="/epics"         element={<EpicsView />} />
        <Route path="/backlog"       element={<Backlog />} />
        <Route path="*"              element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;