import { useNavigate } from 'react-router-dom';
import pmrgLogo from '../src/assets/pmrglogo.png';
const HomePage = () => {
  const navigate = useNavigate();
  
  const handleStartSprint = () => {
    // Handle start sprint button click
    navigate('/planning');
    console.log('Start Sprint clicked!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-blue-200/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Logo and Brand Name */}
              <div className="flex items-center space-x-3">
                <img 
                  src={pmrgLogo} 
                  alt="PMRG Solution Logo" 
                  className="h-30 w-auto"
                />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  <br></br>
                  PMRG SOLUTION
                </h1>
              </div>
            </div>
            {/* <div className="text-sm text-gray-600 font-medium">
              HOME PAGE
            </div> */}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Innovation Hub</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover cutting-edge solutions and transform your business with our proof of concept platform
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Intro to POC Section */}
          <section className="group">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-200/50 p-8 h-full hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Intro to POC</h3>
              </div>
              <div className="text-gray-700 space-y-4 leading-relaxed">
                <p>
                  Welcome to our <span className="font-semibold text-emerald-600">Proof of Concept</span> application. This project demonstrates 
                  the core functionality and architecture of our proposed solution with cutting-edge technology.
                </p>
                <p>
                  The POC serves as a foundation for understanding the system's capabilities, 
                  user interface design, and technical implementation approach. It provides 
                  stakeholders with a tangible representation of the final product vision.
                </p>
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border-l-4 border-emerald-500 mt-6">
                  <h4 className="font-semibold text-emerald-800 mb-2">Key Features:</h4>
                  <ul className="text-sm text-emerald-700 space-y-1">
                    <li>• User authentication & authorization</li>
                    <li>• Real-time data management</li>
                    <li>• Responsive design architecture</li>
                    <li>• Cloud-native infrastructure</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Company Info Section */}
          <section className="group">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-200/50 p-8 h-full hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Company Info</h3>
              </div>
              <div className="text-gray-700 space-y-4 leading-relaxed">
                <p>
                  Our company is dedicated to delivering <span className="font-semibold text-purple-600">innovative software solutions</span> that 
                  drive business growth and enhance user experiences. With a focus on cutting-edge 
                  technology and user-centric design, we create applications that solve real-world problems.
                </p>
                <p>
                  Founded with the mission to bridge the gap between complex technical requirements 
                  and intuitive user interfaces, we specialize in full-stack development, 
                  cloud solutions, and digital transformation services.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-4 mt-6">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Our Vision
                  </h4>
                  <p className="text-sm text-purple-700">
                    To be a leading provider of innovative software solutions that 
                    empower businesses to achieve their digital transformation goals.
                  </p>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Our Mission
                  </h4>
                  <p className="text-sm text-blue-700">
                    Delivering high-quality, scalable, and user-friendly applications 
                    that drive business success and customer satisfaction.
                  </p>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleStartSprint}
            className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold px-12 py-4 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl"
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">Release Planning</span>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <svg 
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 7l5 5m0 0l-5 5m5-5H6" 
                  />
                </svg>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-40 transition-opacity -z-10"></div>
          </button>

          <button
            onClick={() => navigate('/projects')}
            className="group relative bg-white border-2 border-indigo-300 hover:border-indigo-500 text-indigo-700 font-bold px-10 py-4 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <span className="text-lg">My Projects</span>
            </div>
          </button>
        </div>


        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="text-center p-6 bg-white/50 rounded-xl backdrop-blur-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Fast Performance</h4>
            <p className="text-gray-600 text-sm">Lightning-fast load times and responsive interactions</p>
          </div>
          
          <div className="text-center p-6 bg-white/50 rounded-xl backdrop-blur-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Secure & Reliable</h4>
            <p className="text-gray-600 text-sm">Enterprise-grade security with 99.9% uptime guarantee</p>
          </div>
          
          <div className="text-center p-6 bg-white/50 rounded-xl backdrop-blur-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">User-Friendly</h4>
            <p className="text-gray-600 text-sm">Intuitive interface designed for the best user experience</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-white mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              {/* Logo in footer */}
              <img 
                src={pmrgLogo} 
                alt="PMRG Solution Logo" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold">PMRGSOLUTION</span>
            </div>
            <p className="text-gray-300 text-sm">
              © 2025 PMRGSOLUTION. All rights reserved. | Crafted with ❤️ for innovation
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;