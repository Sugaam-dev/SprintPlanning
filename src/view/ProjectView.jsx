import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Users, 
  Target, 
  BarChart3, 
  FolderOpen, 
  Database,
  User,
  Timer,
  BookOpen,
  Zap,
  Trophy,
  AlertTriangle,
  RefreshCw,
  Plus,
  Settings,
  Activity,
  TrendingUp,
  CheckCircle,
  Star,
  Building,
  Mail,
  Phone,
  Globe,
  ArrowLeft
} from 'lucide-react';
import pmrgLogo from '../assets/pmrglogo.png';
import API_ENDPOINTS from '../Auths';
// import API_ENDPOINTS from '../components/apis/Auths';
const ProjectView = () => {
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjectData();
  }, []);

  const fetchProjectData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // const response = await fetch('http://127.0.0.1:8000/sprints', {
      // const response = await fetch('https://sprint-backend-73ho.onrender.com/sprints', {
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
        throw new Error('No projects found in the API response');
      }
      
      const firstProjectKey = projectKeys[0];
      const projectData = data[firstProjectKey].project_plan;
      
      setProjectData(projectData);
      
    } catch (error) {
      console.error('Error fetching project data:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getProjectProgress = () => {
    if (!projectData?.user_stories) return 0;
    const completedStories = projectData.user_stories.filter(story => story.status === 'Done').length;
    return Math.round((completedStories / projectData.user_stories.length) * 100);
  };

  const getSprintProgress = () => {
    if (!projectData?.sprints) return 0;
    const today = new Date();
    const completedSprints = projectData.sprints.filter(sprint => {
      const endDate = new Date(sprint.end_date);
      return today > endDate;
    }).length;
    return Math.round((completedSprints / projectData.sprints.length) * 100);
  };

  const handleBack = () => {
    navigate('/sprintmanager');
  };

  // Header Component
  const ProjectHeader = () => (
    <div className="bg-gradient-to-r from-indigo-600 to-indigo-600 text-white shadow-lg sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="flex items-center text-white hover:text-green-100 transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Sprint Manager
            </button>
            <div className="border-l border-green-300 pl-4">
              <h1 className="text-4xl font-bold flex items-center">
                {/* <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4"> */}
                  <img src={pmrgLogo} alt="PMRG Logo" className="w-50 h-30" />
                {/* </div> */}
              
                <div className=' ml-10' >
                    <br></br>
                Project Overview
                </div>
              </h1>
              <p className="text-green-100 mt-2 text-lg">Comprehensive project insights and management</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* <button 
              onClick={() => fetchProjectData()}
              className="px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors duration-200 font-medium flex items-center space-x-2"
              // className="px-6 py-3 bg-black bg-opacity-20 backdrop-blur-sm rounded-lg hover:bg-opacity-30 transition-all duration-200 flex items-center space-x-2 text-white border border-white border-opacity-20"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Refresh</span>
            </button> */}
            {/* <button 
              onClick={() => navigate('/project/settings')}
              className="px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors duration-200 font-medium flex items-center space-x-2"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button> */}
          </div>
        </div>
        
        {/* Project Progress Bar */}
        {projectData && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">Project Progress</span>
              <span className="text-sm text-green-100">{getProjectProgress()}% Complete</span>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-500" 
                style={{ width: `${getProjectProgress()}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Footer Component
  const ProjectFooter = () => (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
           <h3 className="text-lg font-semibold mb-4 flex items-center">
              <img src={pmrgLogo} alt="PMRG Logo" className="w-20 h-10 mr-2" />
              Project Tools
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li><button onClick={() => navigate('/sprintmanager')} className="hover:text-white transition-colors">Sprint Manager</button></li>
              <li><button onClick={() => navigate('/epicsview')} className="hover:text-white transition-colors">Epic Management</button></li>
              <li><button onClick={() => navigate('/reports')} className="hover:text-white transition-colors">Analytics</button></li>
              <li><button onClick={() => navigate('/timeline')} className="hover:text-white transition-colors">Project Timeline</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Team Resources</h3>
            <ul className="space-y-2 text-gray-300">
              <li><button className="hover:text-white transition-colors">Team Directory</button></li>
              <li><button className="hover:text-white transition-colors">Skill Matrix</button></li>
              <li><button className="hover:text-white transition-colors">Capacity Planning</button></li>
              <li><button className="hover:text-white transition-colors">Performance</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Documentation</h3>
            <ul className="space-y-2 text-gray-300">
              <li><button className="hover:text-white transition-colors">Project Charter</button></li>
              <li><button className="hover:text-white transition-colors">Requirements</button></li>
              <li><button className="hover:text-white transition-colors">Architecture</button></li>
              <li><button className="hover:text-white transition-colors">User Guides</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center"><Mail className="w-4 h-4 mr-2" /> pmrgsolution@company.com</div>
              <div className="flex items-center"><Phone className="w-4 h-4 mr-2" /> +1 (555) 123-4567</div>
              <div className="flex items-center"><Globe className="w-4 h-4 mr-2" /> help.company.com</div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 mt-8 text-center text-gray-400">
          <p>&copy; 2025 Project Management System. Empowering teams to deliver excellence.</p>
        </div>
      </div>
    </footer>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProjectHeader />
        <div className="flex items-center justify-center min-h-64 py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading project data...</p>
          </div>
        </div>
        <ProjectFooter />
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProjectHeader />
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Project Data Available</h2>
            <p className="text-gray-600 mb-6">Unable to load project information. Please try again.</p>
            <button 
              onClick={fetchProjectData}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Retry Loading
            </button>
          </div>
        </div>
        <ProjectFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ProjectHeader />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700 text-sm">Error loading data: {error}</span>
              <button 
                onClick={fetchProjectData}
                className="ml-4 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Project Hero Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center mr-4">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">{projectData.project_name}</h2>
                  <p className="text-gray-600 text-lg">{projectData.project_id}</p>
                </div>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">{projectData.description}</p>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                  <span>Started: {formatDate(projectData.start_date)}</span>
                </div>
                <div className="flex items-center">
                  <Target className="w-4 h-4 mr-2 text-red-500" />
                  <span>Due: {formatDate(projectData.end_date)}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{getProjectProgress()}%</div>
                <div className="text-sm text-gray-500">Complete</div>
              </div>
              <div className="w-20 h-20">
                <svg className="transform -rotate-90 w-20 h-20">
                  <circle
                    cx="40"
                    cy="40"
                    r="30"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="30"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 30}`}
                    strokeDashoffset={`${2 * Math.PI * 30 * (1 - getProjectProgress() / 100)}`}
                    className="text-green-500 transition-all duration-500"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Project Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Story Points</p>
                <p className="text-3xl font-bold text-blue-600">{projectData.total_estimated_story_points}</p>
                <p className="text-xs text-gray-500 mt-1">Across all epics</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Effort Hours</p>
                <p className="text-3xl font-bold text-green-600">{projectData.total_estimated_effort_hours}h</p>
                <p className="text-xs text-gray-500 mt-1">Estimated work time</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Team Members</p>
                <p className="text-3xl font-bold text-purple-600">{projectData.resources?.length || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Active contributors</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">User Stories</p>
                <p className="text-3xl font-bold text-orange-600">{projectData.user_stories?.length || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Total requirements</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Project Progress Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Sprint Progress
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Completed Sprints</span>
                <span className="text-sm font-bold text-gray-800">{getSprintProgress()}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${getSprintProgress()}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div className="font-bold text-blue-600">{projectData.sprints?.length || 0}</div>
                  <div className="text-gray-500">Total</div>
                </div>
                <div>
                  <div className="font-bold text-green-600">
                    {projectData.sprints?.filter(s => {
                      const today = new Date();
                      const endDate = new Date(s.end_date);
                      return today > endDate;
                    }).length || 0}
                  </div>
                  <div className="text-gray-500">Done</div>
                </div>
                <div>
                  <div className="font-bold text-orange-600">
                    {projectData.sprints?.filter(s => {
                      const today = new Date();
                      const startDate = new Date(s.start_date);
                      const endDate = new Date(s.end_date);
                      return today >= startDate && today <= endDate;
                    }).length || 0}
                  </div>
                  <div className="text-gray-500">Active</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Story Completion
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Stories Completed</span>
                <span className="text-sm font-bold text-gray-800">{getProjectProgress()}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${getProjectProgress()}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div className="font-bold text-blue-600">{projectData.user_stories?.length || 0}</div>
                  <div className="text-gray-500">Total</div>
                </div>
                <div>
                  <div className="font-bold text-green-600">
                    {projectData.user_stories?.filter(s => s.status === 'Done').length || 0}
                  </div>
                  <div className="text-gray-500">Done</div>
                </div>
                <div>
                  <div className="font-bold text-orange-600">
                    {projectData.user_stories?.filter(s => s.status === 'In Progress').length || 0}
                  </div>
                  <div className="text-gray-500">In Progress</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Database className="w-5 h-5 mr-2 text-blue-600" />
              Project Details
            </h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Target className="w-6 h-6 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Vision</label>
                    <p className="text-gray-900 leading-relaxed">{projectData.product_vision}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <Calendar className="w-6 h-6 text-green-600 mt-1" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Timeline</label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Start Date:</span>
                        <span className="text-sm font-medium text-gray-900">{formatDate(projectData.start_date)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">End Date:</span>
                        <span className="text-sm font-medium text-gray-900">{formatDate(projectData.end_date)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Duration:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {Math.ceil((new Date(projectData.end_date) - new Date(projectData.start_date)) / (1000 * 60 * 60 * 24))} days
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <Trophy className="w-6 h-6 text-purple-600 mt-1" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Key Metrics</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-white rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{projectData.epics?.length || 0}</div>
                        <div className="text-xs text-gray-500">Epics</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{projectData.sprints?.length || 0}</div>
                        <div className="text-xs text-gray-500">Sprints</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <Zap className="w-6 h-6 text-yellow-600 mt-1" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Status</label>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${getProjectProgress()}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{getProjectProgress()}%</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {getProjectProgress() < 25 && "Project in early stages"}
                      {getProjectProgress() >= 25 && getProjectProgress() < 50 && "Good progress made"}
                      {getProjectProgress() >= 50 && getProjectProgress() < 75 && "Significant progress"}
                      {getProjectProgress() >= 75 && "Nearing completion"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Resources */}
        {projectData.resources && projectData.resources.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-indigo-600" />
                  Team Resources
                </h3>
                {/* <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Member</span>
                </button> */}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Team Member</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Daily Capacity</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Skills</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Workload</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {projectData.resources.map((resource) => {
                    const assignedStories = projectData.user_stories?.filter(
                      story => story.assigned_to_resource_id === resource.resource_id
                    ) || [];
                    const workloadHours = assignedStories.reduce((sum, story) => sum + (story.estimated_effort_hours || 0), 0);
                    const workloadPercentage = Math.min((workloadHours / (resource.daily_capacity_hours * 30)) * 100, 100);
                    
                    return (
                      <tr key={resource.resource_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="font-medium">{resource.name}</div>
                              <div className="text-xs text-gray-500">{resource.resource_id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {resource.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 flex items-center">
                          <Timer className="w-4 h-4 mr-2 text-green-500" />
                          {resource.daily_capacity_hours}h/day
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="flex flex-wrap gap-1">
                            {resource.skills?.slice(0, 3).map((skill, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {skill}
                              </span>
                            ))}
                            {resource.skills?.length > 3 && (
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-200 text-gray-600">
                                +{resource.skills.length - 3} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="flex items-center space-x-3">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-600">{assignedStories.length} stories</span>
                                <span className="text-xs font-medium">{workloadHours}h</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    workloadPercentage > 80 ? 'bg-red-500' : 
                                    workloadPercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                  }`}
                                  style={{ width: `${workloadPercentage}%` }}
                                ></div>
                              </div>
                            </div>
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
      </div>

      {/* Footer */}
      <ProjectFooter />
    </div>
  );
};

export default ProjectView;



// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Calendar, 
//   Clock, 
//   Users, 
//   Target, 
//   BarChart3, 
//   FolderOpen, 
//   Database,
//   User,
//   Timer,
//   BookOpen,
//   Zap,
//   Trophy,
//   AlertTriangle,
//   RefreshCw,
//   Plus,
//   Settings,
//   Activity,
//   TrendingUp,
//   CheckCircle,
//   Star,
//   Building,
//   Mail,
//   Phone,
//   Globe,
//   ArrowLeft,
//   Upload,
//   FileText,
//   X,
//   Download,
//   Eye,
//   AlertCircle,
//   CheckCircle2,
//   Coffee,
//   Briefcase
// } from 'lucide-react';
// import pmrgLogo from '../assets/pmrglogo.png';
// import API_ENDPOINTS from '../components/apis/Auths';

// const ProjectView = () => {
//   const navigate = useNavigate();
//   const [projectData, setProjectData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Leave Plan Excel Validation States
//   const [leavePlanFile, setLeavePlanFile] = useState(null);
//   const [isValidatingExcel, setIsValidatingExcel] = useState(false);
//   const [excelValidationResult, setExcelValidationResult] = useState(null);
//   const [excelValidationError, setExcelValidationError] = useState(null);
//   const [showLeavePlanDetails, setShowLeavePlanDetails] = useState(false);

//   useEffect(() => {
//     fetchProjectData();
//   }, []);

//   const fetchProjectData = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const response = await fetch(API_ENDPOINTS.GET_SPRINTS, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`API Error: ${response.status} ${response.statusText}`);
//       }

//       const data = await response.json();
//       console.log('Fetched projects data:', data);
      
//       const projectKeys = Object.keys(data);
//       if (projectKeys.length === 0) {
//         throw new Error('No projects found in the API response');
//       }
      
//       const firstProjectKey = projectKeys[0];
//       const projectData = data[firstProjectKey].project_plan;
      
//       setProjectData(projectData);
      
//     } catch (error) {
//       console.error('Error fetching project data:', error);
//       setError(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Leave Plan Excel Validation Functions
//   const handleLeavePlanUpload = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     // Validate file type
//     const allowedTypes = [
//       'application/vnd.ms-excel',
//       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//     ];
    
//     if (!allowedTypes.includes(file.type)) {
//       setExcelValidationError('Please upload an Excel file (.xls or .xlsx)');
//       event.target.value = '';
//       return;
//     }

//     // Validate file size (10MB limit)
//     if (file.size > 10 * 1024 * 1024) {
//       setExcelValidationError('File size must be less than 10MB');
//       event.target.value = '';
//       return;
//     }

//     setLeavePlanFile(file);
//     setExcelValidationError(null);
//     setExcelValidationResult(null);
    
//     // Automatically validate the uploaded file
//     await validateExcelFile(file);
//   };

//   const validateExcelFile = async (file) => {
//     setIsValidatingExcel(true);
//     setExcelValidationError(null);

//     try {
//       const formData = new FormData();
//       formData.append('file', file);

//       const response = await fetch('http://127.0.0.1:8000/validate-excel', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Validation failed: ${response.status} - ${errorText}`);
//       }

//       const result = await response.json();
//       console.log('Excel validation result:', result);
      
//       setExcelValidationResult(result);
      
//       if (result.valid) {
//         setShowLeavePlanDetails(true);
//       }
      
//     } catch (error) {
//       console.error('Error validating Excel file:', error);
//       setExcelValidationError(error.message);
//     } finally {
//       setIsValidatingExcel(false);
//     }
//   };

//   const removeLeavePlanFile = () => {
//     setLeavePlanFile(null);
//     setExcelValidationResult(null);
//     setExcelValidationError(null);
//     setShowLeavePlanDetails(false);
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       weekday: 'short',
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   const getProjectProgress = () => {
//     if (!projectData?.user_stories) return 0;
//     const completedStories = projectData.user_stories.filter(story => story.status === 'Done').length;
//     return Math.round((completedStories / projectData.user_stories.length) * 100);
//   };

//   const getSprintProgress = () => {
//     if (!projectData?.sprints) return 0;
//     const today = new Date();
//     const completedSprints = projectData.sprints.filter(sprint => {
//       const endDate = new Date(sprint.end_date);
//       return today > endDate;
//     }).length;
//     return Math.round((completedSprints / projectData.sprints.length) * 100);
//   };

//   const handleBack = () => {
//     navigate('/sprintmanager');
//   };

//   const getLeaveTypeColor = (leaveType) => {
//     switch (leaveType?.toLowerCase()) {
//       case 'vacation': return 'bg-blue-100 text-blue-800';
//       case 'sick': return 'bg-red-100 text-red-800';
//       case 'personal': return 'bg-yellow-100 text-yellow-800';
//       case 'emergency': return 'bg-orange-100 text-orange-800';
//       case 'maternity': case 'paternity': return 'bg-purple-100 text-purple-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getLeaveIcon = (leaveType) => {
//     switch (leaveType?.toLowerCase()) {
//       case 'vacation': return <Coffee className="w-4 h-4" />;
//       case 'sick': return <AlertCircle className="w-4 h-4" />;
//       case 'personal': return <User className="w-4 h-4" />;
//       case 'emergency': return <AlertTriangle className="w-4 h-4" />;
//       case 'maternity': case 'paternity': return <Briefcase className="w-4 h-4" />;
//       default: return <Calendar className="w-4 h-4" />;
//     }
//   };

//   // Header Component
//   const ProjectHeader = () => (
//     <div className="bg-gradient-to-r from-indigo-600 to-indigo-600 text-white shadow-lg">
//       <div className="max-w-7xl mx-auto px-6 py-8">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={handleBack}
//               className="flex items-center text-white hover:text-green-100 transition-colors mr-4"
//             >
//               <ArrowLeft className="w-5 h-5 mr-2" />
//               Back to Sprint Manager
//             </button>
//             <div className="border-l border-green-300 pl-4">
//               <h1 className="text-4xl font-bold flex items-center">
//                 <img src={pmrgLogo} alt="PMRG Logo" className="w-30 h-10" />
//                 Project Overview
//               </h1>
//               <p className="text-green-100 mt-2 text-lg">Comprehensive project insights and management</p>
//             </div>
//           </div>
//         </div>
        
//         {/* Project Progress Bar */}
//         {projectData && (
//           <div className="mt-6">
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-sm font-medium text-white">Project Progress</span>
//               <span className="text-sm text-green-100">{getProjectProgress()}% Complete</span>
//             </div>
//             <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
//               <div 
//                 className="bg-white h-3 rounded-full transition-all duration-500" 
//                 style={{ width: `${getProjectProgress()}%` }}
//               ></div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   // Footer Component
//   const ProjectFooter = () => (
//     <footer className="bg-gray-800 text-white mt-12">
//       <div className="max-w-7xl mx-auto px-6 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           <div>
//            <h3 className="text-lg font-semibold mb-4 flex items-center">
//               <img src={pmrgLogo} alt="PMRG Logo" className="w-20 h-10 mr-2" />
//               Project Tools
//             </h3>
//             <ul className="space-y-2 text-gray-300">
//               <li><button onClick={() => navigate('/sprintmanager')} className="hover:text-white transition-colors">Sprint Manager</button></li>
//               <li><button onClick={() => navigate('/epicsview')} className="hover:text-white transition-colors">Epic Management</button></li>
//               <li><button onClick={() => navigate('/reports')} className="hover:text-white transition-colors">Analytics</button></li>
//               <li><button onClick={() => navigate('/timeline')} className="hover:text-white transition-colors">Project Timeline</button></li>
//             </ul>
//           </div>
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Team Resources</h3>
//             <ul className="space-y-2 text-gray-300">
//               <li><button className="hover:text-white transition-colors">Team Directory</button></li>
//               <li><button className="hover:text-white transition-colors">Skill Matrix</button></li>
//               <li><button className="hover:text-white transition-colors">Capacity Planning</button></li>
//               <li><button className="hover:text-white transition-colors">Performance</button></li>
//             </ul>
//           </div>
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Documentation</h3>
//             <ul className="space-y-2 text-gray-300">
//               <li><button className="hover:text-white transition-colors">Project Charter</button></li>
//               <li><button className="hover:text-white transition-colors">Requirements</button></li>
//               <li><button className="hover:text-white transition-colors">Architecture</button></li>
//               <li><button className="hover:text-white transition-colors">User Guides</button></li>
//             </ul>
//           </div>
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Support</h3>
//             <div className="space-y-2 text-gray-300">
//               <div className="flex items-center"><Mail className="w-4 h-4 mr-2" /> pmrgsolution@company.com</div>
//               <div className="flex items-center"><Phone className="w-4 h-4 mr-2" /> +1 (555) 123-4567</div>
//               <div className="flex items-center"><Globe className="w-4 h-4 mr-2" /> help.company.com</div>
//             </div>
//           </div>
//         </div>
//         <div className="border-t border-gray-700 pt-6 mt-8 text-center text-gray-400">
//           <p>&copy; 2025 Project Management System. Empowering teams to deliver excellence.</p>
//         </div>
//       </div>
//     </footer>
//   );

//   // Leave Plan Section Component
//   const LeavePlanSection = () => (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
//       <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//         <div className="flex items-center justify-between">
//           <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//             <Calendar className="w-5 h-5 mr-2 text-green-600" />
//             Team Leave Planning
//           </h3>
//           <div className="flex items-center space-x-2">
//             {excelValidationResult?.valid && (
//               <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                 <CheckCircle2 className="w-4 h-4 mr-1" />
//                 Valid Excel File
//               </span>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="p-6">
//         {/* Upload Section */}
//         <div className="mb-6">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h4 className="text-md font-medium text-gray-700">Upload Leave Plan Excel</h4>
//               <p className="text-sm text-gray-500">Upload team leave schedules for better project planning</p>
//             </div>
//             {leavePlanFile && (
//               <button
//                 onClick={removeLeavePlanFile}
//                 className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
//               >
//                 <X className="w-4 h-4" />
//                 <span>Remove File</span>
//               </button>
//             )}
//           </div>

//           {!leavePlanFile ? (
//             <div className="relative">
//               <input
//                 type="file"
//                 accept=".xls,.xlsx"
//                 onChange={handleLeavePlanUpload}
//                 className="hidden"
//                 id="leave-plan-excel"
//               />
//               <label
//                 htmlFor="leave-plan-excel"
//                 className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors bg-gray-50 hover:bg-gray-100"
//               >
//                 <div className="text-center">
//                   <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
//                   <span className="text-sm text-gray-600 font-medium">Upload Leave Plan Excel</span>
//                   <p className="text-xs text-gray-500 mt-1">Excel files (.xls, .xlsx) up to 10MB</p>
//                   <div className="mt-3 text-xs text-gray-400">
//                     Expected columns: Team Member Name, Role, Leave Start Date, Leave End Date, etc.
//                   </div>
//                 </div>
//               </label>
//             </div>
//           ) : (
//             <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
//               <div className="flex items-center space-x-3">
//                 <div className="flex-shrink-0">
//                   {isValidatingExcel ? (
//                     <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//                   ) : excelValidationResult?.valid ? (
//                     <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//                       <CheckCircle2 className="w-6 h-6 text-green-600" />
//                     </div>
//                   ) : excelValidationError ? (
//                     <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
//                       <AlertCircle className="w-6 h-6 text-red-600" />
//                     </div>
//                   ) : (
//                     <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                       <FileText className="w-6 h-6 text-blue-600" />
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="flex-1">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-gray-900">{leavePlanFile.name}</p>
//                       <p className="text-xs text-gray-500">
//                         {(leavePlanFile.size / 1024).toFixed(1)} KB
//                         {isValidatingExcel && " • Validating..."}
//                         {excelValidationResult?.valid && ` • ${excelValidationResult.info?.row_count} rows`}
//                         {excelValidationError && " • Validation failed"}
//                       </p>
//                     </div>
                    
//                     {excelValidationResult?.valid && (
//                       <button
//                         onClick={() => setShowLeavePlanDetails(!showLeavePlanDetails)}
//                         className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors flex items-center space-x-1"
//                       >
//                         <Eye className="w-3 h-3" />
//                         <span>{showLeavePlanDetails ? 'Hide' : 'View'} Details</span>
//                       </button>
//                     )}
//                   </div>
                  
//                   {excelValidationError && (
//                     <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
//                       {excelValidationError}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Validation Results */}
//         {excelValidationResult?.valid && showLeavePlanDetails && (
//           <div className="space-y-4">
//             {/* File Info */}
//             <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//               <h5 className="text-sm font-medium text-green-800 mb-3 flex items-center">
//                 <CheckCircle2 className="w-4 h-4 mr-2" />
//                 Excel File Validation Summary
//               </h5>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
//                 <div>
//                   <span className="font-medium text-green-700">Total Rows:</span>
//                   <div className="text-green-800">{excelValidationResult.info?.row_count}</div>
//                 </div>
//                 <div>
//                   <span className="font-medium text-green-700">Columns Found:</span>
//                   <div className="text-green-800">{excelValidationResult.info?.columns?.length}</div>
//                 </div>
//                 <div>
//                   <span className="font-medium text-green-700">Status:</span>
//                   <div className="text-green-800">✓ Valid Format</div>
//                 </div>
//               </div>
              
//               {/* Columns */}
//               <div className="mt-3">
//                 <span className="font-medium text-green-700 text-xs">Detected Columns:</span>
//                 <div className="flex flex-wrap gap-1 mt-1">
//                   {excelValidationResult.info?.columns?.map((column, index) => (
//                     <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
//                       {column}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Preview Data */}
//             {excelValidationResult.info?.preview && excelValidationResult.info.preview.length > 0 && (
//               <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
//                 <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
//                   <h5 className="text-sm font-medium text-gray-800 flex items-center">
//                     <Eye className="w-4 h-4 mr-2 text-blue-500" />
//                     Leave Plan Preview (First {Math.min(excelValidationResult.info.preview.length, 3)} records)
//                   </h5>
//                 </div>
                
//                 <div className="overflow-x-auto">
//                   <table className="w-full text-xs">
//                     <thead className="bg-gray-50 border-b border-gray-200">
//                       <tr>
//                         <th className="px-3 py-2 text-left font-medium text-gray-700">Team Member</th>
//                         <th className="px-3 py-2 text-left font-medium text-gray-700">Role</th>
//                         <th className="px-3 py-2 text-left font-medium text-gray-700">Leave Dates</th>
//                         <th className="px-3 py-2 text-left font-medium text-gray-700">Duration</th>
//                         <th className="px-3 py-2 text-left font-medium text-gray-700">Type</th>
//                         <th className="px-3 py-2 text-left font-medium text-gray-700">Coverage</th>
//                         <th className="px-3 py-2 text-left font-medium text-gray-700">Remarks</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {excelValidationResult.info.preview.slice(0, 3).map((record, index) => (
//                         <tr key={index} className="hover:bg-gray-50">
//                           <td className="px-3 py-2">
//                             <div className="flex items-center space-x-2">
//                               <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
//                                 <User className="w-3 h-3 text-white" />
//                               </div>
//                               <span className="font-medium text-gray-900">{record['Team Member Name']}</span>
//                             </div>
//                           </td>
//                           <td className="px-3 py-2">
//                             <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
//                               {record['Role']}
//                             </span>
//                           </td>
//                           <td className="px-3 py-2 text-gray-700">
//                             <div className="space-y-1">
//                               <div className="flex items-center text-xs">
//                                 <Calendar className="w-3 h-3 mr-1 text-green-500" />
//                                 {formatDate(record['Leave Start Date'])}
//                               </div>
//                               <div className="flex items-center text-xs">
//                                 <Calendar className="w-3 h-3 mr-1 text-red-500" />
//                                 {formatDate(record['Leave End Date'])}
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-3 py-2">
//                             <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
//                               {record['Total Leave Days']} {record['Total Leave Days'] === 1 ? 'day' : 'days'}
//                             </span>
//                           </td>
//                           <td className="px-3 py-2">
//                             <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getLeaveTypeColor(record['Leave Type'])}`}>
//                               {getLeaveIcon(record['Leave Type'])}
//                               <span className="ml-1">{record['Leave Type']}</span>
//                             </span>
//                           </td>
//                           <td className="px-3 py-2">
//                             <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
//                               record['Partial or Full Leave'] === 'Full Leave' 
//                                 ? 'bg-orange-100 text-orange-800' 
//                                 : 'bg-yellow-100 text-yellow-800'
//                             }`}>
//                               {record['Partial or Full Leave']}
//                             </span>
//                           </td>
//                           <td className="px-3 py-2 text-gray-600 max-w-32 truncate" title={record['Remarks']}>
//                             {record['Remarks'] || 'No remarks'}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
                
//                 {excelValidationResult.info.preview.length > 3 && (
//                   <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-center">
//                     <span className="text-xs text-gray-600">
//                       Showing 3 of {excelValidationResult.info.row_count} total records
//                     </span>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Actions */}
//             <div className="flex items-center justify-between pt-4 border-t border-gray-200">
//               <div className="text-xs text-gray-600">
//                 Leave plan data is ready for sprint planning integration
//               </div>
//               <div className="flex items-center space-x-2">
//                 <button
//                   onClick={() => console.log('Export leave plan data')}
//                   className="px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 transition-colors flex items-center space-x-1"
//                 >
//                   <Download className="w-3 h-3" />
//                   <span>Export</span>
//                 </button>
//                 <button
//                   onClick={() => navigate('/planning')}
//                   className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors flex items-center space-x-1"
//                 >
//                   <Zap className="w-3 h-3" />
//                   <span>Use in Sprint Planning</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Expected Format Guide */}
//         {!leavePlanFile && (
//           <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//             <h5 className="text-sm font-medium text-blue-800 mb-3">Expected Excel Format:</h5>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-blue-700">
//               <div>
//                 <p className="font-medium mb-2">Required Columns:</p>
//                 <ul className="space-y-1">
//                   <li>• Team Member Name</li>
//                   <li>• Role</li>
//                   <li>• Leave Start Date</li>
//                   <li>• Leave End Date</li>
//                 </ul>
//               </div>
//               <div>
//                 <p className="font-medium mb-2">Optional Columns:</p>
//                 <ul className="space-y-1">
//                   <li>• Total Leave Days</li>
//                   <li>• Leave Type (Vacation, Sick, etc.)</li>
//                   <li>• Partial or Full Leave</li>
//                   <li>• Remarks</li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <ProjectHeader />
//         <div className="flex items-center justify-center min-h-64 py-20">
//           <div className="text-center">
//             <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//             <p className="text-gray-600 text-lg">Loading project data...</p>
//           </div>
//         </div>
//         <ProjectFooter />
//       </div>
//     );
//   }

//   if (!projectData) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <ProjectHeader />
//         <div className="max-w-7xl mx-auto px-6 py-20">
//           <div className="text-center">
//             <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">No Project Data Available</h2>
//             <p className="text-gray-600 mb-6">Unable to load project information. Please try again.</p>
//             <button 
//               onClick={fetchProjectData}
//               className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//             >
//               Retry Loading
//             </button>
//           </div>
//         </div>
//         <ProjectFooter />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <ProjectHeader />

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* Error Display */}
//         {error && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//             <div className="flex items-center">
//               <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
//               <span className="text-red-700 text-sm">Error loading data: {error}</span>
//               <button 
//                 onClick={fetchProjectData}
//                 className="ml-4 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
//               >
//                 Retry
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Project Hero Section */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
//           <div className="flex items-start justify-between">
//             <div className="flex-1">
//               <div className="flex items-center mb-4">
//                 <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center mr-4">
//                   <Building className="w-8 h-8 text-white" />
//                 </div>
//                 <div>
//                   <h2 className="text-3xl font-bold text-gray-800">{projectData.project_name}</h2>
//                   <p className="text-gray-600 text-lg">{projectData.project_id}</p>
//                 </div>
//               </div>
//               <p className="text-gray-700 text-lg leading-relaxed mb-4">{projectData.description}</p>
//               <div className="flex items-center space-x-6 text-sm text-gray-600">
//                 <div className="flex items-center">
//                   <Calendar className="w-4 h-4 mr-2 text-blue-500" />
//                   <span>Started: {formatDate(projectData.start_date)}</span>
//                 </div>
//                 <div className="flex items-center">
//                   <Target className="w-4 h-4 mr-2 text-red-500" />
//                   <span>Due: {formatDate(projectData.end_date)}</span>
//                 </div>
//               </div>
//             </div>
//             <div className="flex flex-col items-end space-y-2">
//               <div className="text-right">
//                 <div className="text-2xl font-bold text-blue-600">{getProjectProgress()}%</div>
//                 <div className="text-sm text-gray-500">Complete</div>
//               </div>
//               <div className="w-20 h-20">
//                 <svg className="transform -rotate-90 w-20 h-20">
//                   <circle
//                     cx="40"
//                     cy="40"
//                     r="30"
//                     stroke="currentColor"
//                     strokeWidth="8"
//                     fill="transparent"
//                     className="text-gray-200"
//                   />
//                   <circle
//                     cx="40"
//                     cy="40"
//                     r="30"
//                     stroke="currentColor"
//                     strokeWidth="8"
//                     fill="transparent"
//                     strokeDasharray={`${2 * Math.PI * 30}`}
//                     strokeDashoffset={`${2 * Math.PI * 30 * (1 - getProjectProgress() / 100)}`}
//                     className="text-green-500 transition-all duration-500"
//                   />
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Project Overview Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Story Points</p>
//                 <p className="text-3xl font-bold text-blue-600">{projectData.total_estimated_story_points}</p>
//                 <p className="text-xs text-gray-500 mt-1">Across all epics</p>
//               </div>
//               <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                 <BarChart3 className="w-6 h-6 text-blue-600" />
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Total Effort Hours</p>
//                 <p className="text-3xl font-bold text-green-600">{projectData.total_estimated_effort_hours}h</p>
//                 <p className="text-xs text-gray-500 mt-1">Estimated work time</p>
//               </div>
//               <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
//                 <Clock className="w-6 h-6 text-green-600" />
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Team Members</p>
//                 <p className="text-3xl font-bold text-purple-600">{projectData.resources?.length || 0}</p>
//                 <p className="text-xs text-gray-500 mt-1">Active contributors</p>
//               </div>
//               <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
//                 <Users className="w-6 h-6 text-purple-600" />
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">User Stories</p>
//                 <p className="text-3xl font-bold text-orange-600">{projectData.user_stories?.length || 0}</p>
//                 <p className="text-xs text-gray-500 mt-1">Total requirements</p>
//               </div>
//               <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
//                 <BookOpen className="w-6 h-6 text-orange-600" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Project Progress Metrics */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//               <Activity className="w-5 h-5 mr-2 text-blue-600" />
//               Sprint Progress
//             </h3>
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium text-gray-600">Completed Sprints</span>
//                 <span className="text-sm font-bold text-gray-800">{getSprintProgress()}%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-3">
//                 <div 
//                   className="bg-blue-500 h-3 rounded-full transition-all duration-500" 
//                   style={{ width: `${getSprintProgress()}%` }}
//                 ></div>
//               </div>
//               <div className="grid grid-cols-3 gap-4 text-center text-sm">
//                 <div>
//                   <div className="font-bold text-blue-600">{projectData.sprints?.length || 0}</div>
//                   <div className="text-gray-500">Total</div>
//                 </div>
//                 <div>
//                   <div className="font-bold text-green-600">
//                     {projectData.sprints?.filter(s => {
//                       const today = new Date();
//                       const endDate = new Date(s.end_date);
//                       return today > endDate;
//                     }).length || 0}
//                   </div>
//                   <div className="text-gray-500">Done</div>
//                 </div>
//                 <div>
//                   <div className="font-bold text-orange-600">
//                     {projectData.sprints?.filter(s => {
//                       const today = new Date();
//                       const startDate = new Date(s.start_date);
//                       const endDate = new Date(s.end_date);
//                       return today >= startDate && today <= endDate;
//                     }).length || 0}
//                   </div>
//                   <div className="text-gray-500">Active</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//               <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
//               Story Completion
//             </h3>
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium text-gray-600">Stories Completed</span>
//                 <span className="text-sm font-bold text-gray-800">{getProjectProgress()}%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-3">
//                 <div 
//                   className="bg-green-500 h-3 rounded-full transition-all duration-500" 
//                   style={{ width: `${getProjectProgress()}%` }}
//                 ></div>
//               </div>
//               <div className="grid grid-cols-3 gap-4 text-center text-sm">
//                 <div>
//                   <div className="font-bold text-blue-600">{projectData.user_stories?.length || 0}</div>
//                   <div className="text-gray-500">Total</div>
//                 </div>
//                 <div>
//                   <div className="font-bold text-green-600">
//                     {projectData.user_stories?.filter(s => s.status === 'Done').length || 0}
//                   </div>
//                   <div className="text-gray-500">Done</div>
//                 </div>
//                 <div>
//                   <div className="font-bold text-orange-600">
//                     {projectData.user_stories?.filter(s => s.status === 'In Progress').length || 0}
//                   </div>
//                   <div className="text-gray-500">In Progress</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Project Details */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
//           <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//             <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//               <Database className="w-5 h-5 mr-2 text-blue-600" />
//               Project Details
//             </h3>
//           </div>
          
//           <div className="p-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//               <div className="space-y-6">
//                 <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
//                   <Target className="w-6 h-6 text-blue-600 mt-1" />
//                   <div className="flex-1">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Project Vision</label>
//                     <p className="text-gray-900 leading-relaxed">{projectData.product_vision}</p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
//                   <Calendar className="w-6 h-6 text-green-600 mt-1" />
//                   <div className="flex-1">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Project Timeline</label>
//                     <div className="space-y-2">
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm text-gray-600">Start Date:</span>
//                         <span className="text-sm font-medium text-gray-900">{formatDate(projectData.start_date)}</span>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm text-gray-600">End Date:</span>
//                         <span className="text-sm font-medium text-gray-900">{formatDate(projectData.end_date)}</span>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm text-gray-600">Duration:</span>
//                         <span className="text-sm font-medium text-gray-900">
//                           {Math.ceil((new Date(projectData.end_date) - new Date(projectData.start_date)) / (1000 * 60 * 60 * 24))} days
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="space-y-6">
//                 <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
//                   <Trophy className="w-6 h-6 text-purple-600 mt-1" />
//                   <div className="flex-1">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Key Metrics</label>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="text-center p-3 bg-white rounded-lg">
//                         <div className="text-2xl font-bold text-blue-600">{projectData.epics?.length || 0}</div>
//                         <div className="text-xs text-gray-500">Epics</div>
//                       </div>
//                       <div className="text-center p-3 bg-white rounded-lg">
//                         <div className="text-2xl font-bold text-green-600">{projectData.sprints?.length || 0}</div>
//                         <div className="text-xs text-gray-500">Sprints</div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
//                   <Zap className="w-6 h-6 text-yellow-600 mt-1" />
//                   <div className="flex-1">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Project Status</label>
//                     <div className="flex items-center space-x-2">
//                       <div className="flex-1 bg-gray-200 rounded-full h-2">
//                         <div 
//                           className="bg-yellow-500 h-2 rounded-full transition-all duration-300" 
//                           style={{ width: `${getProjectProgress()}%` }}
//                         ></div>
//                       </div>
//                       <span className="text-sm font-medium text-gray-700">{getProjectProgress()}%</span>
//                     </div>
//                     <p className="text-sm text-gray-600 mt-2">
//                       {getProjectProgress() < 25 && "Project in early stages"}
//                       {getProjectProgress() >= 25 && getProjectProgress() < 50 && "Good progress made"}
//                       {getProjectProgress() >= 50 && getProjectProgress() < 75 && "Significant progress"}
//                       {getProjectProgress() >= 75 && "Nearing completion"}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Team Resources */}
//         {projectData.resources && projectData.resources.length > 0 && (
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
//             <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//                   <Users className="w-5 h-5 mr-2 text-indigo-600" />
//                   Team Resources
//                 </h3>
//               </div>
//             </div>
            
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50 border-b border-gray-200">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Team Member</th>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Role</th>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Daily Capacity</th>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Skills</th>
//                     <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Workload</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {projectData.resources.map((resource) => {
//                     const assignedStories = projectData.user_stories?.filter(
//                       story => story.assigned_to_resource_id === resource.resource_id
//                     ) || [];
//                     const workloadHours = assignedStories.reduce((sum, story) => sum + (story.estimated_effort_hours || 0), 0);
//                     const workloadPercentage = Math.min((workloadHours / (resource.daily_capacity_hours * 30)) * 100, 100);
                    
//                     return (
//                       <tr key={resource.resource_id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 text-sm text-gray-900">
//                           <div className="flex items-center">
//                             <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
//                               <User className="w-5 h-5 text-white" />
//                             </div>
//                             <div>
//                               <div className="font-medium">{resource.name}</div>
//                               <div className="text-xs text-gray-500">{resource.resource_id}</div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-900">
//                           <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                             {resource.role}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-900 flex items-center">
//                           <Timer className="w-4 h-4 mr-2 text-green-500" />
//                           {resource.daily_capacity_hours}h/day
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-900">
//                           <div className="flex flex-wrap gap-1">
//                             {resource.skills?.slice(0, 3).map((skill, index) => (
//                               <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
//                                 {skill}
//                               </span>
//                             ))}
//                             {resource.skills?.length > 3 && (
//                               <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-200 text-gray-600">
//                                 +{resource.skills.length - 3} more
//                               </span>
//                             )}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-900">
//                           <div className="flex items-center space-x-3">
//                             <div className="flex-1">
//                               <div className="flex items-center justify-between mb-1">
//                                 <span className="text-xs text-gray-600">{assignedStories.length} stories</span>
//                                 <span className="text-xs font-medium">{workloadHours}h</span>
//                               </div>
//                               <div className="w-full bg-gray-200 rounded-full h-2">
//                                 <div 
//                                   className={`h-2 rounded-full transition-all duration-300 ${
//                                     workloadPercentage > 80 ? 'bg-red-500' : 
//                                     workloadPercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
//                                   }`}
//                                   style={{ width: `${workloadPercentage}%` }}
//                                 ></div>
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* Leave Plan Section */}
//         <LeavePlanSection />
//       </div>

//       {/* Footer */}
//       <ProjectFooter />
//     </div>
//   );
// };

// export default ProjectView;