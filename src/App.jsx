import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
// import POCHomePage from './components/POCHomePage';
import './App.css';
import HomePage from './HomePage';
import SprintPlanningPage from './SprintPlanningPage';
import SprintManager from './SprintManager';
import SprintBoard from './SprintBoard';
import EpicManager from './EpicManager';
import EpicsView from './view/EpicsView';
import ProjectView from './view/ProjectView';
// import TaskDetailPage from './TaskDetailPage';

function App() {
  return (
     <BrowserRouter>
   <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/planning" element={<SprintPlanningPage />} />
        <Route path="/sprintmanager" element={<SprintManager />} />
         <Route path="/board" element={<SprintBoard />} />
         <Route path="/view" element={<ProjectView />} />
          <Route path="/epics" element={<EpicsView />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </BrowserRouter>
  );
}

export default App;