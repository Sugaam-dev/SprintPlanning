import React, { useState, useEffect } from 'react';
import { Download, Plus, Trash2, Save, Users, Calendar, AlertCircle } from 'lucide-react';

const SprintLeaveTracker = () => {
  const [leaveData, setLeaveData] = useState([
    {
      id: 1,
      teamMemberName: '',
      role: '',
      sprintNumber: '',
      leaveStartDate: '',
      leaveEndDate: '',
      totalLeaveDays: 0,
      leaveType: '',
      partialOrFullLeave: 'Full Day',
      workingDaysInSprint: 10,
      availableDaysInSprint: 10,
      sprintCapacityImpact: 0,
      impactOnStoryPoints: '',
      remarks: ''
    }
  ]);

  const leaveTypes = [
    'Vacation',
    'Sick Leave',
    'Public Holiday',
    'Personal Leave',
    'Emergency Leave',
    'Maternity/Paternity Leave',
    'Bereavement Leave'
  ];

  const roles = [
    'Developer',
    'QA',
    'Scrum Master',
    'Product Owner',
    'Tech Lead',
    'Designer',
    'DevOps Engineer'
  ];

  const partialFullOptions = [
    'Full Day',
    'Half Day',
    'Specific Hours'
  ];

  // Calculate working days between two dates (excluding weekends)
  const calculateWorkingDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    let workingDays = 0;
    
    const currentDate = new Date(start);
    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
        workingDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return workingDays;
  };

  // Update calculations when relevant fields change
  useEffect(() => {
    setLeaveData(prevData => 
      prevData.map(item => {
        const totalLeaveDays = calculateWorkingDays(item.leaveStartDate, item.leaveEndDate);
        const availableDaysInSprint = Math.max(0, item.workingDaysInSprint - totalLeaveDays);
        const sprintCapacityImpact = item.workingDaysInSprint > 0 
          ? ((totalLeaveDays / item.workingDaysInSprint) * 100).toFixed(1)
          : 0;

        return {
          ...item,
          totalLeaveDays,
          availableDaysInSprint,
          sprintCapacityImpact: parseFloat(sprintCapacityImpact)
        };
      })
    );
  }, [leaveData.map(item => `${item.leaveStartDate}-${item.leaveEndDate}-${item.workingDaysInSprint}`).join(',')]);

  const handleInputChange = (id, field, value) => {
    setLeaveData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addNewRow = () => {
    const newId = Math.max(...leaveData.map(item => item.id), 0) + 1;
    setLeaveData(prevData => [
      ...prevData,
      {
        id: newId,
        teamMemberName: '',
        role: '',
        sprintNumber: '',
        leaveStartDate: '',
        leaveEndDate: '',
        totalLeaveDays: 0,
        leaveType: '',
        partialOrFullLeave: 'Full Day',
        workingDaysInSprint: 10,
        availableDaysInSprint: 10,
        sprintCapacityImpact: 0,
        impactOnStoryPoints: '',
        remarks: ''
      }
    ]);
  };

  const deleteRow = (id) => {
    setLeaveData(prevData => prevData.filter(item => item.id !== id));
  };

  const exportToExcel = () => {
    // Create CSV content
    const headers = [
      'Team Member Name',
      'Role',
      'Sprint Number / Name',
      'Leave Start Date',
      'Leave End Date',
      'Total Leave Days',
      'Leave Type',
      'Partial or Full Leave',
      'Working Days in Sprint',
      'Available Days in Sprint',
      'Sprint Capacity Impact (%)',
      'Impact on Story Points',
      'Remarks'
    ];

    const csvContent = [
      headers.join(','),
      ...leaveData.map(row => [
        `"${row.teamMemberName}"`,
        `"${row.role}"`,
        `"${row.sprintNumber}"`,
        row.leaveStartDate,
        row.leaveEndDate,
        row.totalLeaveDays,
        `"${row.leaveType}"`,
        `"${row.partialOrFullLeave}"`,
        row.workingDaysInSprint,
        row.availableDaysInSprint,
        row.sprintCapacityImpact,
        `"${row.impactOnStoryPoints}"`,
        `"${row.remarks}"`
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'sprint-leave-tracker.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTotalCapacityImpact = () => {
    const totalImpact = leaveData.reduce((sum, item) => sum + (item.sprintCapacityImpact || 0), 0);
    return (totalImpact / leaveData.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sprint Leave Tracker</h1>
                <p className="text-gray-600">Track team member leave and sprint capacity impact</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={addNewRow}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Member</span>
              </button>
              <button
                onClick={exportToExcel}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export Excel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Team Members</p>
                <p className="text-2xl font-bold text-gray-900">{leaveData.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Members on Leave</p>
                <p className="text-2xl font-bold text-gray-900">
                  {leaveData.filter(item => item.totalLeaveDays > 0).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Capacity Impact</p>
                <p className="text-2xl font-bold text-gray-900">{getTotalCapacityImpact()}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team Member
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sprint
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leave Dates
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leave Details
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacity Impact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaveData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <input
                        type="text"
                        value={item.teamMemberName}
                        onChange={(e) => handleInputChange(item.id, 'teamMemberName', e.target.value)}
                        placeholder="Enter name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={item.role}
                        onChange={(e) => handleInputChange(item.id, 'role', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Role</option>
                        {roles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <input
                        type="text"
                        value={item.sprintNumber}
                        onChange={(e) => handleInputChange(item.id, 'sprintNumber', e.target.value)}
                        placeholder="Sprint 15"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-2">
                        <input
                          type="date"
                          value={item.leaveStartDate}
                          onChange={(e) => handleInputChange(item.id, 'leaveStartDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="date"
                          value={item.leaveEndDate}
                          onChange={(e) => handleInputChange(item.id, 'leaveEndDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-2">
                        <select
                          value={item.leaveType}
                          onChange={(e) => handleInputChange(item.id, 'leaveType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Type</option>
                          {leaveTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        <select
                          value={item.partialOrFullLeave}
                          onChange={(e) => handleInputChange(item.id, 'partialOrFullLeave', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {partialFullOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        <div className="text-sm text-gray-600">
                          Leave Days: {item.totalLeaveDays}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-2">
                        <input
                          type="number"
                          value={item.workingDaysInSprint}
                          onChange={(e) => handleInputChange(item.id, 'workingDaysInSprint', parseInt(e.target.value) || 0)}
                          placeholder="Working days"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="text-sm text-gray-600">
                          Available: {item.availableDaysInSprint} days
                        </div>
                        <div className={`text-sm font-medium ${item.sprintCapacityImpact > 50 ? 'text-red-600' : item.sprintCapacityImpact > 25 ? 'text-orange-600' : 'text-green-600'}`}>
                          Impact: {item.sprintCapacityImpact}%
                        </div>
                        <input
                          type="text"
                          value={item.impactOnStoryPoints}
                          onChange={(e) => handleInputChange(item.id, 'impactOnStoryPoints', e.target.value)}
                          placeholder="Story points impact"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-2">
                        <textarea
                          value={item.remarks}
                          onChange={(e) => handleInputChange(item.id, 'remarks', e.target.value)}
                          placeholder="Notes, overlapping leaves, etc."
                          rows="2"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => deleteRow(item.id)}
                          className="flex items-center space-x-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="text-sm">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Use:</h3>
          <ul className="text-blue-800 space-y-2">
            <li>• Fill in team member details and leave information</li>
            <li>• Leave days are automatically calculated based on start/end dates (excluding weekends)</li>
            <li>• Sprint capacity impact is calculated as (Leave Days / Working Days) × 100</li>
            <li>• Export to Excel/CSV format using the Export button</li>
            <li>• Use remarks field for additional notes about overlapping leaves or critical deliverables</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SprintLeaveTracker;