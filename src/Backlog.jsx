import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye, 
  Star, 
  Flag, 
  User, 
  Clock, 
  BarChart3, 
  Target, 
  CheckCircle, 
  AlertTriangle, 
  Tag, 
  Calendar, 
  ChevronDown, 
  ChevronUp,
  Layers,
  Zap,
  Archive,
  Move,
  Copy,
  Settings,
  Download,
  Upload,
  RefreshCw,
  BookOpen,
  Users,
  TrendingUp,
   X
} from 'lucide-react';
import pmrgLogo from '../src/assets/pmrglogo.png';


// Utility functions for localStorage management
const getBacklogItems = () => {
  const items = localStorage.getItem('backlogItems');
  return items ? JSON.parse(items) : [];
};

const setBacklogItems = (items) => {
  localStorage.setItem('backlogItems', JSON.stringify(items));
};
const Backlog = () => {
  const navigate = useNavigate();
  
  // State management
  const [backlogItems, setBacklogItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterEpic, setFilterEpic] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropZoneVisible, setDropZoneVisible] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const [showAddStoryModal, setShowAddStoryModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'board'
  const [notification, setNotification] = useState(null);
  // Sample backlog data (in real app, this would come from API)
  const [sampleBacklogData] = useState([
    {
      id: 'STORY-001',
      title: 'User Authentication System',
      description: 'Implement secure user login and registration functionality with email verification',
      priority: 'High',
      storyPoints: 8,
      epic: 'Authentication',
      status: 'Ready',
      assignee: 'John Doe',
      estimatedHours: 20,
      tags: ['Backend', 'Security', 'API'],
      acceptanceCriteria: [
        'User can register with email and password',
        'Email verification is required',
        'Password must meet security requirements',
        'Login session management works correctly'
      ],
      createdDate: '2025-01-15',
      lastModified: '2025-01-20',
      businessValue: 'High',
      riskFlag: false,
      dependencies: [],
      attachments: 2
    },
    {
      id: 'STORY-002',
      title: 'Dashboard Analytics Widget',
      description: 'Create interactive dashboard with real-time analytics and data visualization',
      priority: 'Medium',
      storyPoints: 5,
      epic: 'Dashboard',
      status: 'In Progress',
      assignee: 'Jane Smith',
      estimatedHours: 15,
      tags: ['Frontend', 'Charts', 'UI'],
      acceptanceCriteria: [
        'Display key metrics in widget format',
        'Real-time data updates',
        'Interactive charts and graphs',
        'Responsive design for mobile'
      ],
      createdDate: '2025-01-10',
      lastModified: '2025-01-18',
      businessValue: 'Medium',
      riskFlag: false,
      dependencies: ['STORY-001'],
      attachments: 1
    },
    {
      id: 'STORY-003',
      title: 'Payment Gateway Integration',
      description: 'Integrate multiple payment gateways for secure transaction processing',
      priority: 'High',
      storyPoints: 13,
      epic: 'Payments',
      status: 'Blocked',
      assignee: 'Mike Johnson',
      estimatedHours: 35,
      tags: ['Backend', 'Payments', 'Integration'],
      acceptanceCriteria: [
        'Support multiple payment methods',
        'Secure payment processing',
        'Transaction history tracking',
        'Refund functionality'
      ],
      createdDate: '2025-01-05',
      lastModified: '2025-01-16',
      businessValue: 'High',
      riskFlag: true,
      dependencies: ['STORY-001'],
      attachments: 3
    },
    {
      id: 'STORY-004',
      title: 'Mobile App Push Notifications',
      description: 'Implement push notification system for mobile app engagement',
      priority: 'Low',
      storyPoints: 3,
      epic: 'Mobile',
      status: 'Ready',
      assignee: 'Sarah Wilson',
      estimatedHours: 12,
      tags: ['Mobile', 'Notifications', 'Engagement'],
      acceptanceCriteria: [
        'Send targeted push notifications',
        'User preference management',
        'Analytics tracking',
        'A/B testing capability'
      ],
      createdDate: '2025-01-12',
      lastModified: '2025-01-19',
      businessValue: 'Low',
      riskFlag: false,
      dependencies: [],
      attachments: 0
    },
    {
      id: 'STORY-005',
      title: 'Advanced Search Functionality',
      description: 'Implement intelligent search with filters and auto-suggestions',
      priority: 'Medium',
      storyPoints: 8,
      epic: 'Search',
      status: 'Ready',
      assignee: 'David Brown',
      estimatedHours: 25,
      tags: ['Frontend', 'Search', 'UX'],
      acceptanceCriteria: [
        'Fast search with auto-complete',
        'Advanced filtering options',
        'Search result ranking',
        'Search analytics'
      ],
      createdDate: '2025-01-08',
      lastModified: '2025-01-17',
      businessValue: 'Medium',
      riskFlag: false,
      dependencies: [],
      attachments: 1
    }
  ]);

  // Initialize backlog data
  useEffect(() => {
    loadBacklogData();
  }, []);


    // Listen for backlog events from SprintBoard
    useEffect(() => {
      const handleBacklogItemAdded = (event) => {
        const { item, action } = event.detail;
        
        setNotification({
          type: 'success',
          message: `Story "${item.title}" has been ${action} successfully!`,
          timestamp: Date.now()
        });
  
        // Reload backlog data to show the new item
        loadBacklogData();
  
        // Auto-hide notification after 5 seconds
        setTimeout(() => setNotification(null), 5000);
      };
  
      window.addEventListener('backlogItemAdded', handleBacklogItemAdded);
      return () => window.removeEventListener('backlogItemAdded', handleBacklogItemAdded);
    }, []);
  
  const loadBacklogData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get items moved from sprints
      const sprintMovedItems = getBacklogItems();
      
      // Combine with default backlog data, giving priority to sprint-moved items
      const combinedItems = [...sprintMovedItems];
      
      // Add default items that don't already exist (based on ID)
     sampleBacklogData.forEach(defaultItem => {
        const exists = sprintMovedItems.some(item => item.id === defaultItem.id);
        if (!exists) {
          combinedItems.push(defaultItem);
        }
      });
      
      // Sort by priority and then by creation date (newest first for sprint-moved items)
      combinedItems.sort((a, b) => {
        // Sprint-moved items get higher priority
        if (a.movedFromSprint && !b.movedFromSprint) return -1;
        if (!a.movedFromSprint && b.movedFromSprint) return 1;
        
        // Then sort by priority
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        const priorityDiff = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        if (priorityDiff !== 0) return priorityDiff;
        
        // Finally by date (newest first)
        return new Date(b.createdDate) - new Date(a.createdDate);
      });
      
      setBacklogItems(combinedItems);
      
      console.log('Loaded backlog items:', combinedItems);
      
    } catch (error) {
      console.error('Error loading backlog data:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };


  // Get unique values for filters
  const getUniqueEpics = () => {
    const epics = [...new Set(backlogItems.map(item => item.epic))];
    return epics.filter(Boolean);
  };

  const getUniqueStatuses = () => {
    const statuses = [...new Set(backlogItems.map(item => item.status))];
    return statuses.filter(Boolean);
  };

  // Filter and sort items
  const getFilteredAndSortedItems = () => {
    let filtered = backlogItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesPriority = filterPriority === 'all' || item.priority === filterPriority;
      const matchesEpic = filterEpic === 'all' || item.epic === filterEpic;
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
      
      return matchesSearch && matchesPriority && matchesEpic && matchesStatus;
    });

    // Sort items
    filtered.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          valueA = priorityOrder[a.priority] || 0;
          valueB = priorityOrder[b.priority] || 0;
          break;
        case 'storyPoints':
          valueA = a.storyPoints;
          valueB = b.storyPoints;
          break;
        case 'title':
          valueA = a.title.toLowerCase();
          valueB = b.title.toLowerCase();
          break;
        case 'createdDate':
          valueA = new Date(a.createdDate);
          valueB = new Date(b.createdDate);
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    return filtered;
  };

  // Handle item selection
  const handleItemSelection = (itemId) => {
    setSelectedItems(prev => {
      const newSelection = prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId];
      
      setShowBulkActions(newSelection.length > 0);
      return newSelection;
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    const filteredItems = getFilteredAndSortedItems();
    const allSelected = filteredItems.every(item => selectedItems.includes(item.id));
    
    if (allSelected) {
      setSelectedItems([]);
      setShowBulkActions(false);
    } else {
      const allIds = filteredItems.map(item => item.id);
      setSelectedItems(allIds);
      setShowBulkActions(true);
    }
  };

    // Delete item from backlog
  const handleDeleteItem = (itemId) => {
    if (window.confirm('Are you sure you want to delete this story from the backlog?')) {
      const updatedItems = backlogItems.filter(item => item.id !== itemId);
      setBacklogItems(updatedItems);
      setBacklogItems(updatedItems);
      
      // Also update localStorage
      const sprintMovedItems = updatedItems.filter(item => item.movedFromSprint);
      setBacklogItems(sprintMovedItems);
      
      setNotification({
        type: 'success',
        message: 'Story deleted from backlog successfully!',
        timestamp: Date.now()
      });
      
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // Move item back to sprint
  const handleMoveToSprint = (item) => {
    if (window.confirm(`Move "${item.title}" back to sprint planning?`)) {
      // Remove from backlog
      const updatedBacklogItems = backlogItems.filter(i => i.id !== item.id);
      setBacklogItems(updatedBacklogItems);
      
      // Update localStorage
      const sprintMovedItems = updatedBacklogItems.filter(item => item.movedFromSprint);
      setBacklogItems(sprintMovedItems);
      
      setNotification({
        type: 'success',
        message: `Story "${item.title}" moved back to sprint planning!`,
        timestamp: Date.now()
      });
      
      setTimeout(() => setNotification(null), 3000);
      
      // Navigate to sprint planning
      navigate('/planning');
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    setDropZoneVisible(true);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDropZoneVisible(false);
  };

  const handleDrop = (e, targetZone) => {
    e.preventDefault();
    if (draggedItem && targetZone) {
      // Handle drop logic here
      console.log(`Moving ${draggedItem.id} to ${targetZone}`);
      setDraggedItem(null);
      setDropZoneVisible(false);
    }
  };

  // Priority color helper
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Status color helper
  const getStatusColor = (status) => {
    switch (status) {
      case 'Ready': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-orange-100 text-orange-800';
      case 'Blocked': return 'bg-red-100 text-red-800';
      case 'Done': return 'bg-green-100 text-green-800';
      case 'Moved from Sprint': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Toggle item expansion
  const toggleItemExpansion = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Navigation handlers
  const handleBack = () => {
    navigate('/board');
  };

  const handleGoToSprints = () => {
    navigate('/sprintmanager');
  };

  // Backlog Item Component
  const BacklogItem = ({ item, isSelected, onSelect }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const isExpanded = expandedItems[item.id];

    return (
      <div 
        className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 ${
          isSelected ? 'ring-2 ring-indigo-500 border-indigo-300' : ''
        } ${draggedItem?.id === item.id ? 'opacity-50' : ''} ${
          item.movedFromSprint ? 'border-l-4 border-l-indigo-500' : ''
        }`}
        draggable
        onDragStart={(e) => handleDragStart(e, item)}
        onDragEnd={handleDragEnd}
      >
        {/* Item Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(item.id)}
                className="mt-1 h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium text-indigo-600">{item.id}</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                    <Star className="w-3 h-3 mr-1" />
                    {item.priority}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                  {item.riskFlag && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Risk
                    </span>
                  )}
                                   {item.movedFromSprint && (
                                     <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                       <Zap className="w-3 h-3 mr-1" />
                                       From Sprint
                                     </span>
                                   )}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                
                {/* Metrics Row */}
                <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                  <div className="flex items-center">
                    <BarChart3 className="w-4 h-4 mr-1 text-indigo-500" />
                    <span>{item.storyPoints} SP</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-green-500" />
                    <span>{item.estimatedHours}h</span>
                  </div>
                  <div className="flex items-center">
                    <Target className="w-4 h-4 mr-1 text-blue-500" />
                    <span>{item.epic}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1 text-orange-500" />
                    <span>{item.assignee}</span>
                  </div>
                  {item.attachments > 0 && (
                    <div className="flex items-center">
                      <Upload className="w-4 h-4 mr-1 text-gray-400" />
                      <span>{item.attachments}</span>
                    </div>
                  )}
                   {item.originalSprintId && (
                                      <div className="flex items-center">
                                        <Zap className="w-4 h-4 mr-1 text-indigo-500" />
                                        <span>Sprint {item.originalSprintId}</span>
                                      </div>
                                    )}
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => toggleItemExpansion(item.id)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setShowDropdown(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Story
                      </button>
                      <button
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </button>
                      <button
                         onClick={() => {
                            handleMoveToSprint(item);
                            setShowDropdown(false);
                          }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Move className="w-4 h-4 mr-2" />
                        Move to Sprint
                      </button>
                      <button
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Clone Story
                      </button>
                      <div className="border-t border-gray-100"></div>
                      <button
                    onClick={() => {
                          handleDeleteItem(item.id);
                          setShowDropdown(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Story
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Expanded Content */}
        {isExpanded && (
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tags */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Tag className="w-4 h-4 mr-2 text-blue-500" />
                  Tags
                </h4>
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Dependencies */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Flag className="w-4 h-4 mr-2 text-orange-500" />
                  Dependencies
                </h4>
                {item.dependencies.length > 0 ? (
                  <div className="space-y-1">
                    {item.dependencies.map((dep, index) => (
                      <span 
                        key={index} 
                        className="inline-block px-2 py-1 rounded text-xs bg-orange-100 text-orange-800 mr-1"
                      >
                        {dep}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No dependencies</p>
                )}
              </div>
              
              {/* Acceptance Criteria */}
              <div className="lg:col-span-2">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Acceptance Criteria
                </h4>
                <ul className="space-y-2">
                  {item.acceptanceCriteria.map((criteria, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {criteria}
                    </li>
                  ))}
                </ul>
              </div>
               {/* Sprint Information (if moved from sprint) */}
                            {item.movedFromSprint && (
                              <div className="lg:col-span-2 pt-3 border-t border-gray-200">
                                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                  <Zap className="w-4 h-4 mr-2 text-purple-500" />
                                  Sprint Information
                                </h4>
                                <div className="bg-purple-50 rounded-lg p-3">
                                  <div className="grid grid-cols-2 gap-4 text-xs text-purple-700">
                                    {item.originalSprintId && (
                                      <div>
                                        <span className="font-medium">Original Sprint:</span>
                                        <br />
                                        {item.originalSprintId}
                                      </div>
                                    )}
                                    <div>
                                      <span className="font-medium">Moved on:</span>
                                      <br />
                                      {new Date(item.lastModified).toLocaleDateString()}
                                    </div>
                                    {item.comments && item.comments.length > 0 && (
                                      <div>
                                        <span className="font-medium">Comments:</span>
                                        <br />
                                        {item.comments.length} comments from sprint
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
              {/* Metadata */}
              <div className="lg:col-span-2 pt-3 border-t border-gray-200">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-gray-500">
                  <div>
                    <span className="font-medium">Created:</span>
                    <br />
                    {new Date(item.createdDate).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Modified:</span>
                    <br />
                    {new Date(item.lastModified).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Business Value:</span>
                    <br />
                    {item.businessValue}
                  </div>
                  <div>
                    <span className="font-medium">Risk Level:</span>
                    <br />
                    {item.riskFlag ? 'High' : 'Low'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-64 py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading backlog...</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredItems = getFilteredAndSortedItems();
const sprintMovedItems = backlogItems.filter(item => item.movedFromSprint);

  return (
    <div className="min-h-screen bg-gray-50">

       {/* Notification */}
            {notification && (
              <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">{notification.message}</span>
                <button
                  onClick={() => setNotification(null)}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-600 text-white shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="flex items-center text-white hover:text-purple-100 transition-colors mr-4"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Board
              </button>
              <div className="border-l border-purple-300 pl-4">
                <h1 className="text-4xl font-bold flex items-center">
                  {/* <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4"> */}
                    <img src={pmrgLogo} alt="PMRG Logo" className="w-50 h-30" />
                  {/* </div> */}
                  <div className=' ml-10' >
                  <br></br>
                  Product Backlog
                  </div>
                </h1>
                <p className="text-purple-100 mt-2 text-lg">Manage and prioritize your product requirements</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* <button 
                onClick={loadBacklogData}
                className="px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors duration-200 font-medium flex items-center space-x-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Refresh</span>
              </button> */}
              <button 
                onClick={handleGoToSprints}
                className="px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-purple-50 transition-colors duration-200 font-medium flex items-center space-x-2"
              >
                <Zap className="w-5 h-5" />
                <span>Sprint Planning</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700 text-sm">Error loading backlog: {error}</span>
              <button 
                onClick={loadBacklogData}
                className="ml-4 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}
    

         {/* Sprint Integration Notice */}
               {sprintMovedItems.length > 0 && (
                 <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                   <div className="flex items-center">
                     <Zap className="w-5 h-5 text-indigo-500 mr-2" />
                     <span className="text-indigo-700 text-sm font-medium">
                       {sprintMovedItems.length} story{sprintMovedItems.length !== 1 ? 's' : ''} moved from sprint{sprintMovedItems.length !== 1 ? 's' : ''} to backlog
                     </span>
                   </div>
                 </div>
               )}


        {/* Backlog Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Stories</p>
                <p className="text-3xl font-bold text-indigo-600">{backlogItems.length}</p>
                <p className="text-xs text-gray-500 mt-1">In backlog</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Story Points</p>
                <p className="text-3xl font-bold text-indigo-600">
                  {backlogItems.reduce((sum, item) => sum + item.storyPoints, 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Total effort</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-3xl font-bold text-red-600">
                  {backlogItems.filter(item => item.priority === 'High').length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Critical items</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ready Stories</p>
                <p className="text-3xl font-bold text-green-600">
                  {backlogItems.filter(item => item.status === 'Ready').length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Sprint ready</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search stories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              
              {/* Filters */}
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                >
                  <option value="all">All Priorities</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
                
                <select
                  value={filterEpic}
                  onChange={(e) => setFilterEpic(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                >
                  <option value="all">All Epics</option>
                  {getUniqueEpics().map(epic => (
                    <option key={epic} value={epic}>{epic}</option>
                  ))}
                </select>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                >
                  <option value="all">All Statuses</option>
                  {getUniqueStatuses().map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Sort and Actions */}
            <div className="flex items-center space-x-4">
              {/* Sort Controls */}
              <div className="flex items-center space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                >
                  <option value="priority">Sort by Priority</option>
                  <option value="storyPoints">Sort by Story Points</option>
                  <option value="title">Sort by Title</option>
                  <option value="createdDate">Sort by Date</option>
                </select>
                
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                >
                  {sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Action Buttons */}
              <button
                onClick={() => setShowAddStoryModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Story</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-purple-100 text-indigo-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="List View"
                >
                  <Layers className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('board')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'board' ? 'bg-purple-100 text-indigo-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="Board View"
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Bulk Actions Bar */}
          {showBulkActions && (
            <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-indigo-700">
                    {selectedItems.length} items selected
                  </span>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 bg-white text-indigo-600 rounded border border-indigo-200 hover:bg-indigo-50 transition-colors text-sm">
                      Move to Sprint
                    </button>
                    <button className="px-3 py-1 bg-white text-indigo-600 rounded border border-indigo-200 hover:bg-indigo-50 transition-colors text-sm">
                      Change Priority
                    </button>
                    <button className="px-3 py-1 bg-white text-indigo-600 rounded border border-indigo-200 hover:bg-indigo-50 transition-colors text-sm">
                      Archive
                    </button>
                    <button className="px-3 py-1 bg-white text-red-600 rounded border border-red-200 hover:bg-red-50 transition-colors text-sm">
                      Delete
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedItems([]);
                    setShowBulkActions(false);
                  }}
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Backlog Items ({filteredItems.length})
            </h2>
            {filteredItems.length !== backlogItems.length && (
              <span className="text-sm text-gray-500">
                Filtered from {backlogItems.length} total
              </span>
            )}
            <button
              onClick={handleSelectAll}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              {filteredItems.every(item => selectedItems.includes(item.id)) ? 'Deselect All' : 'Select All'}
            </button>
             {sprintMovedItems.length > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            <Zap className="w-3 h-3 mr-1" />
                            {sprintMovedItems.length} from sprints
                          </span>
                        )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Export">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Import">
              <Upload className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Settings">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drop Zones for Drag & Drop */}
        {dropZoneVisible && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className="p-4 border-2 border-dashed border-green-300 rounded-lg bg-green-50 text-center text-green-700"
              onDrop={(e) => handleDrop(e, 'ready')}
              onDragOver={(e) => e.preventDefault()}
            >
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="font-medium">Mark as Ready</p>
              <p className="text-sm">Drop here to mark story as sprint-ready</p>
            </div>
            
            <div
              className="p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 text-center text-blue-700"
              onDrop={(e) => handleDrop(e, 'sprint')}
              onDragOver={(e) => e.preventDefault()}
            >
              <Zap className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="font-medium">Add to Sprint</p>
              <p className="text-sm">Drop here to add to current sprint</p>
            </div>
            
            <div
              className="p-4 border-2 border-dashed border-red-300 rounded-lg bg-red-50 text-center text-red-700"
              onDrop={(e) => handleDrop(e, 'archive')}
              onDragOver={(e) => e.preventDefault()}
            >
              <Archive className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <p className="font-medium">Archive</p>
              <p className="text-sm">Drop here to archive story</p>
            </div>
          </div>
        )}

        {/* Backlog Items List */}
        <div className="space-y-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <BacklogItem
                key={item.id}
                item={item}
                isSelected={selectedItems.includes(item.id)}
                onSelect={handleItemSelection}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {searchTerm || filterPriority !== 'all' || filterEpic !== 'all' || filterStatus !== 'all' 
                  ? 'No stories match your filters' 
                  : 'No stories in backlog'
                }
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterPriority !== 'all' || filterEpic !== 'all' || filterStatus !== 'all'
                  ? 'Try adjusting your search terms or filters.'
                  : 'Start by adding your first user story to the backlog.'
                }
              </p>
             {(!searchTerm && filterPriority === 'all' && filterEpic === 'all' && filterStatus === 'all') && (
                             <div className="flex items-center justify-center space-x-4">
                               <button 
                                 onClick={() => setShowAddStoryModal(true)}
                                 className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                               >
                                 <Plus className="w-5 h-5" />
                                 <span>Add First Story</span>
                               </button>
                               <button 
                                 onClick={() => navigate('/board')}
                                 className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                               >
                                 <Zap className="w-5 h-5" />
                                 <span>Go to Sprint Board</span>
                               </button>
                             </div>
              )}
            </div>
          )}
        </div>

        {/* Pagination (if needed for large datasets) */}
        {filteredItems.length > 10 && (
          <div className="mt-8 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-700">
                Showing {Math.min(filteredItems.length, 10)} of {filteredItems.length} items
              </span>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Story Modal */}
      {showAddStoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold flex items-center">
                  <Plus className="w-6 h-6 mr-2" />
                  Add New User Story
                </h3>
                <button
                  onClick={() => setShowAddStoryModal(false)}
                  className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Story Title *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter story title..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Epic</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                    <option value="">Select Epic</option>
                    {getUniqueEpics().map(epic => (
                      <option key={epic} value={epic}>{epic}</option>
                    ))}
                  </select>
                </div>
                
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    rows="4"
                    placeholder="Describe the user story..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Story Points</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                    <option value="1">1 Point</option>
                    <option value="2">2 Points</option>
                    <option value="3">3 Points</option>
                    <option value="5">5 Points</option>
                    <option value="8">8 Points</option>
                    <option value="13">13 Points</option>
                    <option value="21">21 Points</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                    <option value="">Unassigned</option>
                    <option value="John Doe">John Doe</option>
                    <option value="Jane Smith">Jane Smith</option>
                    <option value="Mike Johnson">Mike Johnson</option>
                    <option value="Sarah Wilson">Sarah Wilson</option>
                    <option value="David Brown">David Brown</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Hours</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter estimated hours..."
                    min="1"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3 bg-gray-50 rounded-b-xl">
              <button
                onClick={() => setShowAddStoryModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle save logic here
                  setShowAddStoryModal(false);
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Story</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <img src={pmrgLogo} alt="PMRG Logo" className="w-20 h-10 mr-2" />
                Backlog Tools
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li><button onClick={() => navigate('/sprintmanager')} className="hover:text-white transition-colors">Sprint Manager</button></li>
                <li><button onClick={() => navigate('/board')} className="hover:text-white transition-colors">Sprint Board</button></li>
                <li><button onClick={() => navigate('/epics')} className="hover:text-white transition-colors">Epic Management</button></li>
                <li><button onClick={() => navigate('/planning')} className="hover:text-white transition-colors">Sprint Planning</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Backlog Statistics</h3>
              <div className="space-y-2 text-gray-300">
                <div>Total Stories: {backlogItems.length}</div>
                <div>Ready for Sprint: {backlogItems.filter(item => item.status === 'Ready').length}</div>
                <div>High Priority: {backlogItems.filter(item => item.priority === 'High').length}</div>
                <div>Total Story Points: {backlogItems.reduce((sum, item) => sum + item.storyPoints, 0)}</div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <ul className="space-y-2 text-gray-300">
                <li><button className="hover:text-white transition-colors">Export Backlog</button></li>
                <li><button className="hover:text-white transition-colors">Import Stories</button></li>
                <li><button className="hover:text-white transition-colors">Bulk Edit</button></li>
                <li><button className="hover:text-white transition-colors">Archive Completed</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center"><Users className="w-4 h-4 mr-2" /> Team Support</div>
                <div className="flex items-center"><BookOpen className="w-4 h-4 mr-2" /> Documentation</div>
                <div className="flex items-center"><TrendingUp className="w-4 h-4 mr-2" /> Best Practices</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 mt-8 text-center text-gray-400">
            <p>&copy; 2025 PMRG Backlog Management System. Streamlining agile development with precision.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Backlog;