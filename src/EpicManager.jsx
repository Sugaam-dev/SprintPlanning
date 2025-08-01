import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Calendar, 
  Users, 
  Target, 
  BarChart3,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Bookmark,
  Edit3,
  Trash2,
  Eye,
  ArrowRight,
  ChevronDown,
  Star,
  Flag,
  Link,
  X
} from 'lucide-react';

// Helper functions moved outside component
const getStatusColor = (status) => {
  switch (status) {
    case 'To Do': return 'bg-gray-100 text-gray-800';
    case 'In Progress': return 'bg-blue-100 text-blue-800';
    case 'Done': return 'bg-green-100 text-green-800';
    case 'Blocked': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High': return 'text-red-600';
    case 'Medium': return 'text-yellow-600';
    case 'Low': return 'text-green-600';
    default: return 'text-gray-600';
  }
};

const getPriorityIcon = (priority) => {
  switch (priority) {
    case 'High': return <ArrowRight className="w-4 h-4 rotate-90" />;
    case 'Medium': return <ArrowRight className="w-4 h-4" />;
    case 'Low': return <ArrowRight className="w-4 h-4 rotate-45" />;
    default: return <ArrowRight className="w-4 h-4" />;
  }
};

const EpicManager = () => {
  const navigate = useNavigate();
  const [epics, setEpics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEpics, setSelectedEpics] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Create Epic Form State
  const [newEpic, setNewEpic] = useState({
    name: '',
    summary: '',
    description: '',
    priority: 'Medium',
    status: 'To Do',
    assignee: '',
    reporter: 'Current User',
    startDate: '',
    endDate: '',
    labels: [],
    components: [],
    fixVersion: '',
    epicColor: '#0052CC'
  });

  useEffect(() => {
    fetchEpics();
  }, []);

  const fetchEpics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real app, this would fetch from your API
      // For now, we'll use mock data that matches your sprint structure
      const mockEpics = [
        {
          id: 'EPIC-1',
          key: 'PMRG-100',
          name: 'User Authentication System',
          summary: 'Complete user authentication and authorization system',
          description: 'Implement a comprehensive authentication system including login, logout, password reset, and user profile management with OAuth 2.0 support.',
          status: 'In Progress',
          priority: 'High',
          assignee: 'John Doe',
          reporter: 'Jane Smith',
          created: '2025-07-15',
          updated: '2025-07-30',
          startDate: '2025-07-15',
          endDate: '2025-08-15',
          progress: 65,
          storyPoints: 89,
          storiesCount: 12,
          completedStories: 8,
          labels: ['authentication', 'security', 'core'],
          components: ['Backend', 'Frontend'],
          fixVersion: 'v1.0.0',
          epicColor: '#0052CC',
          linkedStories: [
            { id: 'STORY-1', name: 'Login Page UI', status: 'Done' },
            { id: 'STORY-2', name: 'Password Reset Flow', status: 'In Progress' },
            { id: 'STORY-3', name: 'OAuth Integration', status: 'To Do' }
          ]
        },
        {
          id: 'EPIC-2',
          key: 'PMRG-101',
          name: 'Dashboard Interface',
          summary: 'Real-time dashboard with customizable widgets',
          description: 'Create a comprehensive dashboard interface with real-time data visualization, customizable widgets, and export functionality.',
          status: 'To Do',
          priority: 'Medium',
          assignee: 'Mike Johnson',
          reporter: 'Jane Smith',
          created: '2025-07-20',
          updated: '2025-07-25',
          startDate: '2025-08-01',
          endDate: '2025-08-30',
          progress: 0,
          storyPoints: 144,
          storiesCount: 15,
          completedStories: 0,
          labels: ['dashboard', 'ui', 'analytics'],
          components: ['Frontend', 'Analytics'],
          fixVersion: 'v1.1.0',
          epicColor: '#00875A',
          linkedStories: [
            { id: 'STORY-4', name: 'Widget Framework', status: 'To Do' },
            { id: 'STORY-5', name: 'Real-time Data Sync', status: 'To Do' }
          ]
        },
        {
          id: 'EPIC-3',
          key: 'PMRG-102',
          name: 'Mobile Responsiveness',
          summary: 'Make application fully responsive across all devices',
          description: 'Ensure the application works seamlessly across desktop, tablet, and mobile devices with touch-friendly interface and offline capability.',
          status: 'Done',
          priority: 'High',
          assignee: 'Sarah Wilson',
          reporter: 'John Doe',
          created: '2025-06-01',
          updated: '2025-07-15',
          startDate: '2025-06-01',
          endDate: '2025-07-15',
          progress: 100,
          storyPoints: 55,
          storiesCount: 8,
          completedStories: 8,
          labels: ['mobile', 'responsive', 'ui'],
          components: ['Frontend'],
          fixVersion: 'v1.0.0',
          epicColor: '#36B37E',
          linkedStories: [
            { id: 'STORY-6', name: 'Mobile Navigation', status: 'Done' },
            { id: 'STORY-7', name: 'Touch Gestures', status: 'Done' }
          ]
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEpics(mockEpics);
      
    } catch (error) {
      console.error('Error fetching epics:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEpic = async (e) => {
    e.preventDefault();
    try {
      // In a real app, this would call your API
      const epicData = {
        ...newEpic,
        id: `EPIC-${epics.length + 1}`,
        key: `PMRG-${103 + epics.length}`,
        created: new Date().toISOString().split('T')[0],
        updated: new Date().toISOString().split('T')[0],
        progress: 0,
        storyPoints: 0,
        storiesCount: 0,
        completedStories: 0,
        linkedStories: []
      };

      setEpics([...epics, epicData]);
      setShowCreateModal(false);
      setNewEpic({
        name: '',
        summary: '',
        description: '',
        priority: 'Medium',
        status: 'To Do',
        assignee: '',
        reporter: 'Current User',
        startDate: '',
        endDate: '',
        labels: [],
        components: [],
        fixVersion: '',
        epicColor: '#0052CC'
      });
    } catch (error) {
      console.error('Error creating epic:', error);
    }
  };

  const handleSelectEpic = (epicId) => {
    setSelectedEpics(prev => 
      prev.includes(epicId) 
        ? prev.filter(id => id !== epicId)
        : [...prev, epicId]
    );
  };

  const handleSelectAll = () => {
    setSelectedEpics(
      selectedEpics.length === filteredEpics.length 
        ? [] 
        : filteredEpics.map(epic => epic.id)
    );
  };

  // Filter epics based on search and filters
  const filteredEpics = epics.filter(epic => {
    const matchesSearch = epic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         epic.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         epic.key.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || epic.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || epic.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading epics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-blue-200/50 sticky top-0 z-10 -m-6 mb-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Epic Manager
              </h1>
              <p className="text-gray-600 text-sm">Manage and track your project epics</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Epic</span>
            </button>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search epics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {showFilters && (
              <div className="flex items-center space-x-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                  <option value="Blocked">Blocked</option>
                </select>
                
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {viewMode === 'grid' ? 'List View' : 'Grid View'}
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{filteredEpics.length} epics found</span>
          <div className="flex items-center space-x-4">
            <span>Story Points: {filteredEpics.reduce((sum, epic) => sum + epic.storyPoints, 0)}</span>
            <span>Stories: {filteredEpics.reduce((sum, epic) => sum + epic.storiesCount, 0)}</span>
          </div>
        </div>
      </div>

      {/* Epic Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Epics</p>
              <p className="text-2xl font-bold text-gray-900">{epics.length}</p>
            </div>
            <Target className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">
                {epics.filter(e => e.status === 'In Progress').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {epics.filter(e => e.status === 'Done').length}
              </p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Story Points</p>
              <p className="text-2xl font-bold text-purple-600">
                {epics.reduce((sum, epic) => sum + epic.storyPoints, 0)}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Epic List/Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEpics.map((epic) => (
            <EpicCard key={epic.id} epic={epic} onSelect={handleSelectEpic} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-12 px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedEpics.length === filteredEpics.length && filteredEpics.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Epic</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Priority</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Assignee</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Progress</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Stories</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEpics.map((epic) => (
                  <EpicRow key={epic.id} epic={epic} onSelect={handleSelectEpic} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredEpics.length === 0 && !isLoading && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">No epics found</p>
          <p className="text-gray-400 text-sm mb-4">
            {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Create your first epic to get started'}
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Epic
          </button>
        </div>
      )}

      {/* Create Epic Modal */}
      {showCreateModal && (
        <CreateEpicModal
          epic={newEpic}
          setEpic={setNewEpic}
          onSubmit={handleCreateEpic}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};

// Epic Card Component for Grid View
const EpicCard = ({ epic, onSelect }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Epic Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: epic.epicColor }}
            ></div>
            <span className="text-sm font-medium text-gray-600">{epic.key}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className={`flex items-center space-x-1 ${getPriorityColor(epic.priority)}`}>
              {getPriorityIcon(epic.priority)}
            </div>
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{epic.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{epic.summary}</p>
      </div>

      {/* Epic Body */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(epic.status)}`}>
            {epic.status}
          </span>
          <span className="text-xs text-gray-500">{epic.progress}% complete</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${epic.progress}%` }}
          ></div>
        </div>

        {/* Epic Stats */}
        <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
          <div className="flex items-center space-x-1">
            <BarChart3 className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{epic.storyPoints} SP</span>
          </div>
          <div className="flex items-center space-x-1">
            <Bookmark className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{epic.completedStories}/{epic.storiesCount}</span>
          </div>
        </div>

        {/* Labels */}
        {epic.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {epic.labels.slice(0, 3).map((label, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                {label}
              </span>
            ))}
            {epic.labels.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                +{epic.labels.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Assignee and Dates */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>{epic.assignee}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{epic.endDate}</span>
          </div>
        </div>
      </div>

      {/* Epic Actions */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-between">
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
          <Eye className="w-4 h-4" />
          <span>View</span>
        </button>
        <button className="text-gray-600 hover:text-gray-700 text-sm font-medium flex items-center space-x-1">
          <Link className="w-4 h-4" />
          <span>{epic.linkedStories.length} stories</span>
        </button>
      </div>
    </div>
  );
};

// Epic Row Component for List View
const EpicRow = ({ epic, onSelect }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3">
        <input
          type="checkbox"
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center space-x-3">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: epic.epicColor }}
          ></div>
          <div>
            <div className="text-sm font-medium text-gray-900">{epic.name}</div>
            <div className="text-sm text-gray-500">{epic.key}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(epic.status)}`}>
          {epic.status}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className={`flex items-center space-x-1 ${getPriorityColor(epic.priority)}`}>
          {getPriorityIcon(epic.priority)}
          <span className="text-sm">{epic.priority}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-900">{epic.assignee}</td>
      <td className="px-4 py-3">
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${epic.progress}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-600">{epic.progress}%</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-900">
        {epic.completedStories}/{epic.storiesCount}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center space-x-2">
          <button className="p-1 text-gray-400 hover:text-blue-600">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <Edit3 className="w-4 h-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-red-600">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

// Create Epic Modal Component
const CreateEpicModal = ({ epic, setEpic, onSubmit, onClose }) => {
  const handleInputChange = (field, value) => {
    setEpic(prev => ({ ...prev, [field]: value }));
  };

  const handleLabelsChange = (value) => {
    const labels = value.split(',').map(label => label.trim()).filter(label => label);
    setEpic(prev => ({ ...prev, labels }));
  };

  const handleComponentsChange = (value) => {
    const components = value.split(',').map(comp => comp.trim()).filter(comp => comp);
    setEpic(prev => ({ ...prev, components }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Create Epic</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={onSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Column */}
            <div className="space-y-6">
              {/* Epic Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Epic Name *
                </label>
                <input
                  type="text"
                  required
                  value={epic.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., User Authentication System"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">A short, descriptive name for your epic</p>
              </div>

              {/* Epic Summary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Summary *
                </label>
                <input
                  type="text"
                  required
                  value={epic.summary}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                  placeholder="Brief description of what this epic accomplishes"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={epic.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed description of the epic's objectives, scope, and acceptance criteria..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Priority and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={epic.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={epic.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>
              </div>

              {/* Assignee and Reporter */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignee
                  </label>
                  <input
                    type="text"
                    value={epic.assignee}
                    onChange={(e) => handleInputChange('assignee', e.target.value)}
                    placeholder="Enter assignee name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reporter
                  </label>
                  <input
                    type="text"
                    value={epic.reporter}
                    onChange={(e) => handleInputChange('reporter', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={epic.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={epic.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Labels */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Labels
                </label>
                <input
                  type="text"
                  value={epic.labels.join(', ')}
                  onChange={(e) => handleLabelsChange(e.target.value)}
                  placeholder="authentication, security, core"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Separate labels with commas</p>
              </div>

              {/* Components */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Components
                </label>
                <input
                  type="text"
                  value={epic.components.join(', ')}
                  onChange={(e) => handleComponentsChange(e.target.value)}
                  placeholder="Backend, Frontend, API"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Separate components with commas</p>
              </div>

              {/* Fix Version */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fix Version
                </label>
                <input
                  type="text"
                  value={epic.fixVersion}
                  onChange={(e) => handleInputChange('fixVersion', e.target.value)}
                  placeholder="v1.0.0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Epic Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Epic Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={epic.epicColor}
                    onChange={(e) => handleInputChange('epicColor', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={epic.epicColor}
                    onChange={(e) => handleInputChange('epicColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Color used to identify this epic</p>
              </div>

              {/* Epic Template Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
                  <Bookmark className="w-4 h-4 mr-1" />
                  Epic Template
                </h4>
                <p className="text-xs text-blue-700 mb-2">
                  This epic will be created following Jira best practices:
                </p>
                <ul className="text-xs text-blue-600 space-y-1">
                  <li>• Large body of work spanning multiple sprints</li>
                  <li>• Container for related user stories and tasks</li>
                  <li>• Trackable progress and story points</li>
                  <li>• Clear acceptance criteria and scope</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!epic.name || !epic.summary}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Target className="w-4 h-4" />
              <span>Create Epic</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EpicManager;