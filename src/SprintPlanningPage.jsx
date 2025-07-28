import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SprintPlanningPage = () => {
  const navigate = useNavigate();
  const [productScope, setProductScope] = useState('');
  const [productScopePDF, setProductScopePDF] = useState(null);
  const [resources, setResources] = useState([{ 
    name: '', 
    skills: '', 
    resume: null, 
    resumeText: ''
  }]);
  const [leavePlanExcel, setLeavePlanExcel] = useState(null);
  const [generatedStories, setGeneratedStories] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPDFLoading, setIsPDFLoading] = useState(false);

  const addResource = () => {
    setResources([...resources, { 
      name: '', 
      skills: '', 
      resume: null, 
      resumeText: ''
    }]);
  };

  const removeResource = (index) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  const updateResource = (index, field, value) => {
    const updated = resources.map((resource, i) => 
      i === index ? { ...resource, [field]: value } : resource
    );
    setResources(updated);
  };

  const handleResumeUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF, DOC, DOCX, or TXT file');
        event.target.value = '';
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        event.target.value = '';
        return;
      }

      // Read file content for text files
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          updateResource(index, 'resumeText', e.target.result);
        };
        reader.readAsText(file);
      }

      updateResource(index, 'resume', file);
    }
  };

  const handleProductScopePDFUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file');
        event.target.value = '';
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        event.target.value = '';
        return;
      }

      setIsPDFLoading(true);
      setProductScopePDF(file);

      try {
        // For demo purposes, we'll simulate PDF text extraction
        // In a real application, you would use a PDF parsing library like PDF.js
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
        
        // Simulated extracted text - in reality, you'd extract actual PDF content
        const extractedText = `[PDF Content Extracted from: ${file.name}]

Product Requirements Document

Overview:
This document outlines the key features and requirements for our upcoming product release.

Key Features:
1. User Authentication System
   - Login/logout functionality
   - Password reset capability
   - User profile management

2. Dashboard Interface
   - Real-time data visualization
   - Customizable widgets
   - Export functionality

3. Reporting Module
   - Generate custom reports
   - Schedule automated reports
   - Data filtering and sorting

4. Mobile Responsiveness
   - Responsive design for all screen sizes
   - Touch-friendly interface
   - Offline capability

Technical Requirements:
- Modern web technologies (React, Node.js)
- Database integration (PostgreSQL)
- API development (REST/GraphQL)
- Security implementation (OAuth 2.0)
- Performance optimization
- Unit and integration testing

Timeline:
- Phase 1: Core functionality (4 weeks)
- Phase 2: Advanced features (3 weeks)
- Phase 3: Testing and deployment (2 weeks)

Success Criteria:
- User adoption rate > 80%
- Page load time < 2 seconds
- 99.9% uptime
- Zero critical security vulnerabilities`;

        setProductScope(extractedText);
        alert('PDF content extracted and loaded successfully!');
      } catch (error) {
        console.error('Error extracting PDF content:', error);
        alert('Failed to extract PDF content. Please try again or paste the content manually.');
        setProductScopePDF(null);
      } finally {
        setIsPDFLoading(false);
        event.target.value = ''; // Reset file input
      }
    }
  };

  const removeProductScopePDF = () => {
    setProductScopePDF(null);
    setProductScope('');
  };

  const handleLeavePlanExcelUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type for Excel
      const allowedTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload an Excel file (.xls or .xlsx)');
        event.target.value = '';
        return;
      }

      // Validate file size (10MB limit for Excel)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        event.target.value = '';
        return;
      }

      setLeavePlanExcel(file);
    }
  };

  const removeResume = (index) => {
    updateResource(index, 'resume', null);
    updateResource(index, 'resumeText', '');
  };

  const removeLeavePlanExcel = () => {
    setLeavePlanExcel(null);
  };

  const handleGenerateStories = async () => {
    // Validation
    if (!productScope.trim()) {
      alert('Please provide product scope information first!');
      return;
    }

    // Validate mandatory fields
    const invalidResources = resources.filter(resource => 
      !resource.name.trim() || !resource.resume
    );

    if (invalidResources.length > 0) {
      alert('Please ensure all team members have a Full Name and Resume uploaded. These are mandatory fields.');
      return;
    }

    setIsLoading(true);
    setGeneratedStories('Generating stories... Please wait.');

    try {
      // Prepare form data in the exact format your API expects
      const formData = new FormData();
      
      // Add scope text (this was correct in your original code)
      formData.append('scope_text', productScope);
      
      // Add the PDF file if uploaded
      if (productScopePDF) {
        formData.append('scope_pdf', productScopePDF);
      }
      
      // Your API expects a JSON string for resources field
      const validResources = resources.filter(r => r.name.trim() && r.resume);
      
      // Create resources data as JSON string (this is what your API expects)
      const resourcesData = validResources.map(r => ({
        name: r.name,
        role: r.skills || 'Developer',
        skills: r.skills ? r.skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0) : []
      }));
      
      // Send resources as JSON string
      formData.append('resources', JSON.stringify(resourcesData));

      // Add resume files with proper naming
      validResources.forEach((resource, index) => {
        if (resource.resume) {
          formData.append(`resume_${index}`, resource.resume);
        }
      });

      // Handle leave plan - either parse Excel or send empty array
      let leavePlanData = [];
      if (leavePlanExcel) {
        // For now, sending empty array - you can implement Excel parsing later
        leavePlanData = [];
        // Add the Excel file itself if your backend needs it
        formData.append('leave_plan_file', leavePlanExcel);
      }
      formData.append('leave_plan', JSON.stringify(leavePlanData));

      console.log('Sending form data to API...');
      
      // Debug: Log what we're sending
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      // Call the API
      const response = await fetch('http://127.0.0.1:8000/process-sprint', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      
      // Format the response for display
      let formattedStories;
      if (typeof result === 'string') {
        formattedStories = result;
      } else if (result.stories) {
        formattedStories = result.stories;
      } else if (result.message) {
        formattedStories = result.message;
      } else {
        formattedStories = JSON.stringify(result, null, 2);
      }
      
      setGeneratedStories(formattedStories);
      
      // Optional: Navigate to sprint manager after successful generation
       navigate('/sprintmanager');

    } catch (error) {
      console.error('Error calling API:', error);
      alert(`Failed to generate stories: ${error.message}`);
      setGeneratedStories(`❌ Failed to generate stories\n\nError: ${error.message}\n\nPlease check:\n1. API server is running at http://127.0.0.1:8000\n2. CORS is properly configured\n3. All required fields are filled\n4. API endpoint expects the correct data format\n\nTry again or contact support.`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedStories).then(() => {
      alert('Stories copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy to clipboard');
    });
  };

  const exportToPDF = () => {
    // Placeholder for PDF export functionality
    alert('PDF export functionality coming soon!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-purple-200/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                SPRINT PLANNING PAGE
              </h1>
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Project Planning
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column - Input Forms */}
          <div className="space-y-6">
            
            {/* Product Scope Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-200/50 p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Release Scope</h3>
              </div>
              
              {/* PDF Upload Status */}
              {productScopePDF && (
                <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm font-medium text-orange-700">{productScopePDF.name}</span>
                      <span className="text-xs text-orange-600">({(productScopePDF.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <button
                      onClick={removeProductScopePDF}
                      className="text-red-500 hover:text-red-700 text-xs font-medium"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-xs text-orange-600 mt-1">PDF content has been extracted and loaded below</p>
                </div>
              )}

              <textarea
                value={productScope}
                onChange={(e) => setProductScope(e.target.value)}
                placeholder="Describe your product scope, features, and requirements..."
                className="w-full h-32 p-4 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none bg-white/50 backdrop-blur-sm"
              />
              
              <div className="mt-3 flex items-center space-x-2">
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleProductScopePDFUpload}
                    className="hidden"
                    id="product-scope-pdf"
                    disabled={isPDFLoading}
                  />
                  <label
                    htmlFor="product-scope-pdf"
                    className={`px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 text-sm font-medium cursor-pointer inline-flex items-center space-x-2 ${
                      isPDFLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isPDFLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing PDF...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span>Upload PDF</span>
                      </>
                    )}
                  </label>
                </div>
                <span className="text-xs text-gray-500">or type your requirements above</span>
              </div>
              
              <div className="mt-2 text-xs text-gray-400">
                Supported: PDF files up to 10MB
              </div>
            </section>

            {/* Enhanced Resources Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-200/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Team Resources</h3>
                </div>
                <button
                  onClick={addResource}
                  className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {resources.map((resource, index) => (
                  <div key={index} className="p-4 bg-blue-50/50 rounded-xl border border-blue-200">
                    {/* Name and Skills Row */}
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Full Name *"
                          value={resource.name}
                          onChange={(e) => updateResource(index, 'name', e.target.value)}
                          className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                            !resource.name.trim() ? 'border-red-300 bg-red-50' : 'border-blue-200'
                          }`}
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Skills (e.g., React, Node.js, UI/UX)"
                        value={resource.skills}
                        onChange={(e) => updateResource(index, 'skills', e.target.value)}
                        className="flex-1 p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                      {resources.length > 1 && (
                        <button
                          onClick={() => removeResource(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    {/* Resume Upload Section */}
                    <div className="mt-3 p-3 bg-white/60 rounded-lg border border-blue-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 flex items-center">
                          <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Resume *
                        </span>
                        {resource.resume && (
                          <button
                            onClick={() => removeResume(index)}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                      {!resource.resume ? (
                        <div className="relative">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={(e) => handleResumeUpload(index, e)}
                            className="hidden"
                            id={`resume-${index}`}
                          />
                          <label
                            htmlFor={`resume-${index}`}
                            className={`flex items-center justify-center w-full p-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                              !resource.resume ? 'border-red-300 bg-red-50 hover:border-red-400' : 'border-blue-300 hover:border-blue-400'
                            }`}
                          >
                            <div className="text-center">
                              <svg className="w-6 h-6 mx-auto mb-1 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <span className="text-sm text-red-600 font-medium">Upload Resume (Required)</span>
                              <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, TXT (max 5MB)</p>
                            </div>
                          </label>
                          {!resource.resume && (
                            <p className="text-red-500 text-xs mt-1">Resume is required</p>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg border border-green-200">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm text-green-700 font-medium">{resource.resume.name}</span>
                          <span className="text-xs text-green-600">({(resource.resume.size / 1024).toFixed(1)} KB)</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Leave Plan and Generate Stories */}
          <div className="space-y-6">
            
            {/* Leave Plan Section */}
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-green-200/50 p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Leave Plan (Optional)</h3>
              </div>
              
              <div className="p-4 bg-green-50/50 rounded-xl border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700 flex items-center">
                    <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Team Leave Schedule Excel
                  </span>
                  {leavePlanExcel && (
                    <button
                      onClick={removeLeavePlanExcel}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                {!leavePlanExcel ? (
                  <div className="relative">
                    <input
                      type="file"
                      accept=".xls,.xlsx"
                      onChange={handleLeavePlanExcelUpload}
                      className="hidden"
                      id="leave-plan-excel"
                    />
                    <label
                      htmlFor="leave-plan-excel"
                      className="flex items-center justify-center w-full p-4 border-2 border-dashed border-green-300 rounded-lg cursor-pointer hover:border-green-400 transition-colors bg-white/60"
                    >
                      <div className="text-center">
                        <svg className="w-8 h-8 mx-auto mb-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="text-sm text-green-600 font-medium">Upload Leave Plan Excel</span>
                        <p className="text-xs text-gray-500 mt-1">Excel files (.xls, .xlsx) up to 10MB</p>
                        <p className="text-xs text-gray-400 mt-2">Include team member names, leave dates, and leave types</p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-green-100 rounded-lg border border-green-300">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <span className="text-sm text-green-700 font-medium block">{leavePlanExcel.name}</span>
                      <span className="text-xs text-green-600">({(leavePlanExcel.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <div className="text-xs text-green-600 bg-green-200 px-2 py-1 rounded">
                      Excel Ready
                    </div>
                  </div>
                )}
                
                <div className="mt-3 p-3 bg-white/60 rounded-lg border border-green-100">
                  <p className="text-xs text-gray-600 mb-2">
                    <strong>Expected Excel Format:</strong>
                  </p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>• Column A: Team Member Name</p>
                    <p>• Column B: Leave Start Date</p>
                    <p>• Column C: Leave End Date</p>
                    <p>• Column D: Leave Type (Vacation, Sick, etc.)</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Generate Stories Button */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-200/50 p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Generate Stories?</h3>
                <p className="text-gray-600 mb-6">
                  Click the button below to generate user stories based on your inputs and team profiles
                </p>
                <button
                  onClick={handleGenerateStories}
                  disabled={isLoading}
                  className={`group relative ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white font-bold px-8 py-4 rounded-xl shadow-xl transition-all duration-300 transform hover:scale-105`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">
                      {isLoading ? 'Generating...' : 'Generate Stories'}
                    </span>
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-4 h-4 transform group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Generated Stories Display */}
            {generatedStories && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200/50 p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Generated User Stories</h3>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 max-h-96 overflow-y-auto">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                    {generatedStories}
                  </pre>
                </div>
                <div className="mt-4 flex space-x-3">
                  <button 
                    onClick={exportToPDF}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 text-sm font-medium"
                  >
                    Export to PDF
                  </button>
                  <button 
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 text-sm font-medium"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-indigo-900 text-white mt-12">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <span className="text-xl font-bold">PMRGSOLUTION</span>
            </div>
            <p className="text-gray-300 text-sm">
              © 2025 PMRGSOLUTION. Sprint Planning Made Easy | Crafted with ❤️ for agile teams
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SprintPlanningPage;