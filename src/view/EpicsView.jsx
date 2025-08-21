import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Layers, 
  Target, 
  BarChart3, 
  Activity,
  BookOpen,
  Star,
  CheckCircle,
  Flag,
  Eye,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  AlertTriangle,
  RefreshCw,
  Settings,
  Filter,
  Search,
  Calendar,
  Users,
  Clock,
  TrendingUp,
  Award,
  Zap,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  User,
  Mail,
  Phone,
  Globe
} from 'lucide-react';
import pmrgLogo from '../assets/pmrglogo.png';
// import API_ENDPOINTS from '../components/apis/Auths';
const EpicsView = () => {
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingEpic, setEditingEpic] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEpic, setSelectedEpic] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});
  const [newEpic, setNewEpic] = useState({
    name: '',
    description: '',
    definition_of_ready: [''],
    definition_of_done: ['']
  });

  useEffect(() => {
    fetchEpicsData();
  }, []);

  const fetchEpicsData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // const response = await fetch('http://127.0.0.1:8000/sprints', {
      const response = await fetch('https://sprint-backend-73ho.onrender.com/sprints', {
      // const response = await fetch(API_ENDPOINTS.GET_SPRINTS, {
        
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const projectKeys = Object.keys(data);
      if (projectKeys.length === 0) {
        throw new Error('No projects found in the API response');
      }
      
      const firstProjectKey = projectKeys[0];
      const projectData = data[firstProjectKey].project_plan;
      
      setProjectData(projectData);
      
    } catch (error) {
      console.error('Error fetching epics data:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/sprintmanager');
  };

  const handleEditEpic = (epic) => {
    setEditingEpic({
      ...epic,
      definition_of_ready: epic.definition_of_ready || [''],
      definition_of_done: epic.definition_of_done || ['']
    });
  };

  const handleSaveEpic = () => {
    console.log('Saving epic:', editingEpic);
    
    const updatedEpics = projectData.epics.map(epic => 
      epic.epic_id === editingEpic.epic_id ? editingEpic : epic
    );
    
    setProjectData({
      ...projectData,
      epics: updatedEpics
    });
    
    setEditingEpic(null);
  };

  const handleCancelEdit = () => {
    setEditingEpic(null);
  };

  const handleDeleteEpic = (epicId) => {
    if (window.confirm('Are you sure you want to delete this epic? This action cannot be undone.')) {
      console.log('Deleting epic:', epicId);
      
      const updatedEpics = projectData.epics.filter(epic => epic.epic_id !== epicId);
      setProjectData({
        ...projectData,
        epics: updatedEpics
      });
    }
  };

  const handleAddNewEpic = () => {
    const newEpicData = {
      epic_id: `EPIC-${Date.now()}`,
      ...newEpic,
      definition_of_ready: newEpic.definition_of_ready.filter(item => item.trim() !== ''),
      definition_of_done: newEpic.definition_of_done.filter(item => item.trim() !== '')
    };
    
    console.log('Adding new epic:', newEpicData);
    
    setProjectData({
      ...projectData,
      epics: [...(projectData.epics || []), newEpicData]
    });
    
    setNewEpic({
      name: '',
      description: '',
      definition_of_ready: [''],
      definition_of_done: ['']
    });
    setShowAddForm(false);
  };

  const handleArrayFieldChange = (field, index, value, isEditing = false) => {
    const target = isEditing ? editingEpic : newEpic;
    const setter = isEditing ? setEditingEpic : setNewEpic;
    
    const updatedArray = [...target[field]];
    updatedArray[index] = value;
    
    setter({
      ...target,
      [field]: updatedArray
    });
  };

  const addArrayField = (field, isEditing = false) => {
    const target = isEditing ? editingEpic : newEpic;
    const setter = isEditing ? setEditingEpic : setNewEpic;
    
    setter({
      ...target,
      [field]: [...target[field], '']
    });
  };

  const removeArrayField = (field, index, isEditing = false) => {
    const target = isEditing ? editingEpic : newEpic;
    const setter = isEditing ? setEditingEpic : setNewEpic;
    
    const updatedArray = target[field].filter((_, i) => i !== index);
    setter({
      ...target,
      [field]: updatedArray.length > 0 ? updatedArray : ['']
    });
  };

  const getEpicProgress = (epic) => {
    if (!projectData?.user_stories) return 0;
    const epicStories = projectData.user_stories.filter(story => story.epic_id === epic.epic_id);
    if (epicStories.length === 0) return 0;
    const completedStories = epicStories.filter(story => story.status === 'Done');
    return Math.round((completedStories.length / epicStories.length) * 100);
  };

  const getEpicStatus = (epic) => {
    const progress = getEpicProgress(epic);
    if (progress === 100) return 'completed';
    if (progress > 0) return 'in-progress';
    return 'not-started';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'not-started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleCardExpansion = (epicId) => {
    setExpandedCards(prev => ({
      ...prev,
      [epicId]: !prev[epicId]
    }));
  };

  const filteredEpics = projectData?.epics?.filter(epic => {
    const matchesSearch = epic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         epic.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (filterStatus === 'all') return true;
    return getEpicStatus(epic) === filterStatus;
  }) || [];

  // Header Component
  const EpicsHeader = () => (
    <div className="bg-gradient-to-r from-indigo-600 to-indigo-600 text-white shadow-lg sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="flex items-center text-white hover:text-indigo-100 transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Sprint Manager
            </button>
            <div className="border-l border-indigo-300 pl-4">
             <h1 className="text-4xl font-bold flex items-center">
              {/* <div className=" bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4"> */}
                <img src={pmrgLogo} alt="PMRG Logo" className="w-50 h-30" />
              {/* </div> */}
              <div className=' ml-10' >
                    <br></br>
              Epic Management
              </div>
            </h1>
              <p className="text-indigo-100 mt-2 text-lg">Plan, track, and manage your project epics</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* <button 
              onClick={fetchEpicsData}
              className="px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200 font-medium flex items-center space-x-2"
              // className="px-6 py-3 bg-black bg-opacity-20 backdrop-blur-sm rounded-lg hover:bg-opacity-30 transition-all duration-200 flex items-center space-x-2 text-white border border-white border-opacity-20"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Refresh</span>
            </button> */}
            <button 
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200 font-medium flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>New Epic</span>
            </button>
          </div>
        </div>

        {/* Project Info Bar */}
        {projectData && (
          <div className="mt-6 p-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg border border-white border-opacity-20">
            <div className="flex items-center justify-between text-white">
              <div>
                {/* <h2 className="text-xl font-semibold">{projectData.project_name}</h2> */}
                <p className="text-black text-sm">{projectData.epics?.length || 0} epics • {projectData.user_stories?.length || 0} user stories</p>
              </div>
              <div className="text-right">
                <div className="text-black text-sm">{Math.round((projectData.user_stories?.filter(s => s.status === 'Done').length / (projectData.user_stories?.length || 1)) * 100)}%</div>
                <div className="text-black text-sm">Overall Progress</div>
              </div>
            </div>
          </div>
              )}
            </div>
          </div>
        );

           // Footer Component
              const EpicsFooter = () => (
                <footer className="bg-gray-800 text-white mt-12">
                  <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
              <img src={pmrgLogo} alt="PMRG Logo" className="w-20 h-10 mr-2" />
              Epic Tools
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li><button onClick={() => navigate('/sprintmanager')} className="hover:text-white transition-colors">Sprint Manager</button></li>
              <li><button onClick={() => navigate('/projectview')} className="hover:text-white transition-colors">Project Overview</button></li>
              <li><button onClick={() => navigate('/board')} className="hover:text-white transition-colors">Sprint Board</button></li>
              <li><button onClick={() => navigate('/planning')} className="hover:text-white transition-colors">Sprint Planning</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Epic Statistics</h3>
            <div className="space-y-2 text-gray-300">
              <div>Total Epics: {projectData?.epics?.length || 0}</div>
              <div>Completed: {filteredEpics.filter(e => getEpicStatus(e) === 'completed').length}</div>
              <div>In Progress: {filteredEpics.filter(e => getEpicStatus(e) === 'in-progress').length}</div>
              <div>Not Started: {filteredEpics.filter(e => getEpicStatus(e) === 'not-started').length}</div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <ul className="space-y-2 text-gray-300">
              <li><button className="hover:text-white transition-colors">Export Epics</button></li>
              <li><button className="hover:text-white transition-colors">Import from CSV</button></li>
              <li><button className="hover:text-white transition-colors">Bulk Edit</button></li>
              <li><button className="hover:text-white transition-colors">Archive Completed</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center"><Mail className="w-4 h-4 mr-2" /> pmrgsolution@pmrg.com</div>
              <div className="flex items-center"><Phone className="w-4 h-4 mr-2" /> +1 (555) 123-4567</div>
              <div className="flex items-center"><Globe className="w-4 h-4 mr-2" /> help.pmrg.com</div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 mt-8 text-center text-gray-400">
          <p>&copy; 2025 PMRG Epic Management System. Streamlining product development with excellence.</p>
        </div>
      </div>
    </footer>
  );

  // Add Epic Form Component
  const AddEpicForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold flex items-center">
              <Plus className="w-6 h-6 mr-2" />
              Create New Epic
            </h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Epic Name *</label>
              <input
                type="text"
                value={newEpic.name}
                onChange={(e) => setNewEpic({ ...newEpic, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter epic name..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newEpic.description}
                onChange={(e) => setNewEpic({ ...newEpic, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows="3"
                placeholder="Describe the epic..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Definition of Ready */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                Definition of Ready
              </label>
              <div className="space-y-2">
                {newEpic.definition_of_ready.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayFieldChange('definition_of_ready', index, e.target.value, false)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Add ready criteria..."
                    />
                    <button
                      onClick={() => removeArrayField('definition_of_ready', index, false)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      disabled={newEpic.definition_of_ready.length === 1}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayField('definition_of_ready', false)}
                  className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Criteria
                </button>
              </div>
            </div>

            {/* Definition of Done */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Flag className="w-4 h-4 mr-1 text-blue-500" />
                Definition of Done
              </label>
              <div className="space-y-2">
                {newEpic.definition_of_done.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayFieldChange('definition_of_done', index, e.target.value, false)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Add done criteria..."
                    />
                    <button
                      onClick={() => removeArrayField('definition_of_done', index, false)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      disabled={newEpic.definition_of_done.length === 1}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addArrayField('definition_of_done', false)}
                  className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Criteria
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3 bg-gray-50 rounded-b-xl">
          <button
            onClick={() => setShowAddForm(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddNewEpic}
            disabled={!newEpic.name.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Create Epic</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Epic Detail Modal
  const EpicDetailModal = ({ epic, onClose }) => {
    const epicStories = projectData.user_stories?.filter(story => story.epic_id === epic.epic_id) || [];
    const completedStories = epicStories.filter(story => story.status === 'Done');
    const totalStoryPoints = epicStories.reduce((sum, story) => sum + (story.story_points || 0), 0);
    const totalEffortHours = epicStories.reduce((sum, story) => sum + (story.estimated_effort_hours || 0), 0);
    const progressPercentage = getEpicProgress(epic);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold flex items-center">
                <Target className="w-6 h-6 mr-2" />
                {epic.name}
              </h3>
              <button
                onClick={onClose}
                className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-blue-100 text-sm mt-1">{epic.epic_id}</p>
          </div>

          <div className="p-6">
            {/* Epic Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{epicStories.length}</div>
                <div className="text-sm text-gray-600">User Stories</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{totalStoryPoints}</div>
                <div className="text-sm text-gray-600">Story Points</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{totalEffortHours}h</div>
                <div className="text-sm text-gray-600">Effort Hours</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{progressPercentage}%</div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
              <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{epic.description || 'No description provided'}</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">Progress</h4>
                <span className="text-sm text-gray-600">{completedStories.length}/{epicStories.length} stories completed</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-500 flex items-center justify-center" 
                  style={{ width: `${progressPercentage}%` }}
                >
                  {progressPercentage > 10 && (
                    <span className="text-xs font-medium text-white">{progressPercentage}%</span>
                  )}
                </div>
              </div>
            </div>

            {/* Definition of Ready & Done */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Definition of Ready
                </h4>
                <div className="bg-green-50 rounded-lg p-4">
                  {epic.definition_of_ready && epic.definition_of_ready.length > 0 ? (
                    <ul className="space-y-2">
                      {epic.definition_of_ready.map((item, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No definition of ready specified</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Flag className="w-5 h-5 mr-2 text-blue-500" />
                  Definition of Done
                </h4>
                <div className="bg-blue-50 rounded-lg p-4">
                  {epic.definition_of_done && epic.definition_of_done.length > 0 ? (
                    <ul className="space-y-2">
                      {epic.definition_of_done.map((item, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-700">
                          <Flag className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No definition of done specified</p>
                  )}
                </div>
              </div>
            </div>

            {/* Related User Stories */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-indigo-500" />
                Related User Stories ({epicStories.length})
              </h4>
              {epicStories.length > 0 ? (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {epicStories.map((story) => (
                    <div key={story.story_id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{story.story_id}: {story.name}</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(story.status)}`}>
                          {story.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{story.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span><strong>Points:</strong> {story.story_points}</span>
                        <span><strong>Effort:</strong> {story.estimated_effort_hours}h</span>
                        <span><strong>Priority:</strong> {story.priority}</span>
                        {story.assigned_to_resource_id && (
                          <span><strong>Assigned:</strong> {projectData.resources?.find(r => r.resource_id === story.assigned_to_resource_id)?.name || story.assigned_to_resource_id}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No user stories assigned to this epic yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <EpicsHeader />
        <div className="flex items-center justify-center min-h-64 py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading epics data...</p>
          </div>
        </div>
        <EpicsFooter />
      </div>
    );
  }

  if (!projectData?.epics) {
    return (
      <div className="min-h-screen bg-gray-50">
        <EpicsHeader />
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <Layers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Epics Found</h2>
            <p className="text-gray-600 mb-6">Start by creating your first epic to organize your project.</p>
            <button 
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Create First Epic</span>
            </button>
          </div>
        </div>
        <EpicsFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <EpicsHeader />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700 text-sm">Error loading data: {error}</span>
              <button 
                onClick={fetchEpicsData}
                className="ml-4 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Epics Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Epics</p>
                <p className="text-3xl font-bold text-indigo-600">{projectData.epics.length}</p>
                <p className="text-xs text-gray-500 mt-1">Across project</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Layers className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Stories/Epic</p>
                <p className="text-3xl font-bold text-teal-600">
                  {projectData.user_stories ? (projectData.user_stories.length / projectData.epics.length).toFixed(1) : 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Story distribution</p>
              </div>
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">
                  {filteredEpics.filter(e => getEpicStatus(e) === 'completed').length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Fully done</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                <p className="text-3xl font-bold text-purple-600">
                  {Math.round((projectData.user_stories?.filter(s => s.status === 'Done').length / (projectData.user_stories?.length || 1)) * 100)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">All stories</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search epics by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="not-started">Not Started</option>
                </select>
              </div>
              
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Epic</span>
              </button>
            </div>
          </div>
        </div>

        {/* Epics Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {filteredEpics.map((epic) => {
            const epicStories = projectData.user_stories?.filter(story => story.epic_id === epic.epic_id) || [];
            const completedStories = epicStories.filter(story => story.status === 'Done');
            const totalStoryPoints = epicStories.reduce((sum, story) => sum + (story.story_points || 0), 0);
            const progressPercentage = getEpicProgress(epic);
            const isEditing = editingEpic?.epic_id === epic.epic_id;
            const isExpanded = expandedCards[epic.epic_id];
            
            return (
              <div key={epic.epic_id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200">
                {/* Epic Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingEpic.name}
                          onChange={(e) => setEditingEpic({ ...editingEpic, name: e.target.value })}
                          className="text-xl font-semibold text-gray-800 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      ) : (
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                          <Target className="w-5 h-5 mr-2 text-indigo-500" />
                          {epic.name}
                        </h3>
                      )}
                      <p className="text-sm text-gray-500 mt-1">{epic.epic_id}</p>
                      
                      {isEditing ? (
                        <textarea
                          value={editingEpic.description}
                          onChange={(e) => setEditingEpic({ ...editingEpic, description: e.target.value })}
                          className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          rows="3"
                        />
                      ) : (
                        <p className="text-gray-600 mt-2 leading-relaxed line-clamp-2">{epic.description}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleSaveEpic}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Save Changes"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setSelectedEpic(epic)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditEpic(epic)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit Epic"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEpic(epic.epic_id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Epic"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleCardExpansion(epic.epic_id)}
                            className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
                            title={isExpanded ? "Collapse" : "Expand"}
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Epic Metrics */}
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-indigo-50 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-600">{epicStories.length}</div>
                      <div className="text-xs text-gray-500">Stories</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{totalStoryPoints}</div>
                      <div className="text-xs text-gray-500">Story Points</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{progressPercentage}%</div>
                      <div className="text-xs text-gray-500">Complete</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm text-gray-600">{completedStories.length}/{epicStories.length} stories</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500" 
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="space-y-4 border-t border-gray-100 pt-4">
                      {/* Definition of Ready & Done */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Definition of Ready */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                            Definition of Ready
                          </h5>
                          {isEditing ? (
                            <div className="space-y-2">
                              {editingEpic.definition_of_ready.map((item, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <input
                                    type="text"
                                    value={item}
                                    onChange={(e) => handleArrayFieldChange('definition_of_ready', index, e.target.value, true)}
                                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Ready criteria..."
                                  />
                                  <button
                                    onClick={() => removeArrayField('definition_of_ready', index, true)}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={() => addArrayField('definition_of_ready', true)}
                                className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center"
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Add Item
                              </button>
                            </div>
                          ) : (
                            <ul className="space-y-1">
                              {epic.definition_of_ready && epic.definition_of_ready.length > 0 ? (
                                epic.definition_of_ready.map((item, index) => (
                                  <li key={index} className="text-sm text-gray-600 flex items-start">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                    {item}
                                  </li>
                                ))
                              ) : (
                                <li className="text-sm text-gray-400 italic">No criteria defined</li>
                              )}
                            </ul>
                          )}
                        </div>
                        
                        {/* Definition of Done */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                            <Flag className="w-4 h-4 mr-2 text-blue-500" />
                            Definition of Done
                          </h5>
                          {isEditing ? (
                            <div className="space-y-2">
                              {editingEpic.definition_of_done.map((item, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <input
                                    type="text"
                                    value={item}
                                    onChange={(e) => handleArrayFieldChange('definition_of_done', index, e.target.value, true)}
                                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Done criteria..."
                                  />
                                  <button
                                    onClick={() => removeArrayField('definition_of_done', index, true)}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={() => addArrayField('definition_of_done', true)}
                                className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center"
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Add Item
                              </button>
                            </div>
                          ) : (
                            <ul className="space-y-1">
                              {epic.definition_of_done && epic.definition_of_done.length > 0 ? (
                                epic.definition_of_done.map((item, index) => (
                                  <li key={index} className="text-sm text-gray-600 flex items-start">
                                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                    {item}
                                  </li>
                                ))
                              ) : (
                                <li className="text-sm text-gray-400 italic">No criteria defined</li>
                              )}
                            </ul>
                          )}
                        </div>
                      </div>

                      {/* Associated User Stories */}
                      {epicStories.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                            <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                            User Stories ({epicStories.length})
                          </h5>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {epicStories.slice(0, 3).map((story) => (
                              <div key={story.story_id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                                <span className="font-medium text-gray-700">{story.story_id}</span>
                                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(story.status)}`}>
                                  {story.status}
                                </span>
                              </div>
                            ))}
                            {epicStories.length > 3 && (
                              <div className="text-center py-2">
                                <button
                                  onClick={() => setSelectedEpic(epic)}
                                  className="text-xs text-blue-600 hover:text-blue-700"
                                >
                                  View all {epicStories.length} stories
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredEpics.length === 0 && (
          <div className="text-center py-12">
            <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              {searchTerm || filterStatus !== 'all' ? 'No epics match your filters' : 'No epics found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search terms or filters.' 
                : 'Create your first epic to get started with project planning.'
              }
            </p>
            {(!searchTerm && filterStatus === 'all') && (
              <button 
                onClick={() => setShowAddForm(true)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Create First Epic</span>
              </button>
            )}
          </div>
        )}

        {/* Bulk Actions */}
        {filteredEpics.length > 0 && (
          <div className="flex items-center justify-center space-x-4 mt-8">
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Bulk Edit</span>
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <EpicsFooter />

      {/* Modals */}
      {showAddForm && <AddEpicForm />}
      {selectedEpic && (
        <EpicDetailModal 
          epic={selectedEpic} 
          onClose={() => setSelectedEpic(null)} 
        />
      )}
    </div>
  );
};

export default EpicsView;

