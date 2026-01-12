
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import TutorCard from './components/TutorCard';
import VirtualClassroom from './components/VirtualClassroom';
import { MOCK_TUTORS } from './constants';
import { AppView, Tutor } from './types';
import { Search, MapPin, BookOpen, GraduationCap, Video, Star, Users, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  const handleBookTutor = (tutor: Tutor) => {
    setSelectedTutor(tutor);
    setCurrentView(AppView.CLASSROOM);
  };

  const filteredTutors = MOCK_TUTORS.filter(tutor => 
    tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutor.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {currentView !== AppView.CLASSROOM && (
        <Navbar 
          onSearchClick={() => setCurrentView(AppView.SEARCH)}
          onHomeClick={() => setCurrentView(AppView.LANDING)}
        />
      )}

      {currentView === AppView.LANDING && (
        <main>
          {/* Hero Section */}
          <section className="relative pt-20 pb-32 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-50 to-transparent -z-10"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-8 animate-bounce">
                <Zap className="h-4 w-4" />
                <span>Personalized learning at your fingertips</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                Find the perfect tutor <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">for your learning goals.</span>
              </h1>
              <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
                Connect with world-class experts from top universities. Start your virtual classroom experience today with AI-powered assistance.
              </p>

              {/* Search Bar */}
              <div className="max-w-4xl mx-auto bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center gap-2 border border-gray-100">
                <div className="flex-1 w-full flex items-center px-4 py-3 md:py-0">
                  <BookOpen className="h-5 w-5 text-indigo-500 mr-3" />
                  <input 
                    type="text" 
                    placeholder="Subject, skill, or keyword..."
                    className="w-full bg-transparent focus:outline-none text-slate-700"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-[1px] h-[1px] md:h-8 bg-gray-200"></div>
                <div className="flex-1 w-full flex items-center px-4 py-3 md:py-0">
                  <MapPin className="h-5 w-5 text-indigo-500 mr-3" />
                  <input 
                    type="text" 
                    placeholder="Near me (City or Zip)..."
                    className="w-full bg-transparent focus:outline-none text-slate-700"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => setCurrentView(AppView.SEARCH)}
                  className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center space-x-2"
                >
                  <Search className="h-5 w-5" />
                  <span>Search Tutors</span>
                </button>
              </div>

              {/* Stats */}
              <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                <div>
                  <div className="text-3xl font-bold text-slate-900">15,000+</div>
                  <div className="text-sm text-slate-500">Expert Tutors</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">98%</div>
                  <div className="text-sm text-slate-500">Student Satisfaction</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">200+</div>
                  <div className="text-sm text-slate-500">Academic Subjects</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">24/7</div>
                  <div className="text-sm text-slate-500">Online Support</div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900">Better learning starts here</h2>
                <p className="text-slate-500 mt-4">We combine human expertise with cutting-edge technology.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-12">
                <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all">
                  <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-indigo-500/20 shadow-xl">
                    <GraduationCap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Vetted Educators</h3>
                  <p className="text-slate-600">Every tutor undergoes a rigorous background check and proficiency test before joining.</p>
                </div>
                <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all">
                  <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-purple-500/20 shadow-xl">
                    <Video className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Virtual Zoom-like Lab</h3>
                  <p className="text-slate-600">Built-in interactive classroom with video, whiteboard, and collaborative tools.</p>
                </div>
                <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all">
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-blue-500/20 shadow-xl">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">AI Study Assistant</h3>
                  <p className="text-slate-600">Access our Gemini-powered assistant during sessions for instant research and notes.</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {currentView === AppView.SEARCH && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Tutors Near You</h1>
              <p className="text-slate-500">Displaying {filteredTutors.length} experts matching your criteria</p>
            </div>
            
            <div className="flex items-center space-x-3">
               <div className="relative">
                 <input 
                  type="text" 
                  placeholder="Filter subjects..." 
                  className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                 />
                 <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
               </div>
               <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                 Filters
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTutors.map(tutor => (
              <TutorCard 
                key={tutor.id} 
                tutor={tutor} 
                onBookClick={handleBookTutor} 
              />
            ))}
          </div>

          {filteredTutors.length === 0 && (
            <div className="text-center py-20">
               <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Search className="h-8 w-8 text-slate-400" />
               </div>
               <h3 className="text-xl font-bold text-slate-900">No tutors found</h3>
               <p className="text-slate-500 mt-2">Try adjusting your search filters or searching for another subject.</p>
               <button 
                onClick={() => setSearchQuery('')}
                className="mt-6 text-indigo-600 font-bold hover:underline"
               >
                 Clear all filters
               </button>
            </div>
          )}
        </div>
      )}

      {currentView === AppView.CLASSROOM && selectedTutor && (
        <VirtualClassroom 
          tutorName={selectedTutor.name} 
          onClose={() => setCurrentView(AppView.SEARCH)}
        />
      )}

      {currentView !== AppView.CLASSROOM && (
        <footer className="bg-slate-900 text-white py-20 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-12">
              <div className="col-span-1 md:col-span-1">
                <div className="flex items-center mb-6">
                  <BookOpen className="h-8 w-8 text-indigo-500 mr-2" />
                  <span className="text-2xl font-bold tracking-tight">iTutor+</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  The world's leading personalized tutoring platform. Empowering students to reach their full potential through expert guidance and modern technology.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-6">For Students</h4>
                <ul className="space-y-4 text-sm text-slate-400">
                  <li><a href="#" className="hover:text-white transition-colors">Find a Tutor</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Online Classroom</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Study Resources</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-6">For Tutors</h4>
                <ul className="space-y-4 text-sm text-slate-400">
                  <li><a href="#" className="hover:text-white transition-colors">Apply to Teach</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Teaching Tools</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-6">Newsletter</h4>
                <p className="text-sm text-slate-400 mb-4">Get the latest educational insights and expert advice.</p>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Email address" 
                    className="flex-1 bg-slate-800 border-none rounded-l-lg px-4 py-2 focus:ring-1 focus:ring-indigo-500 text-sm"
                  />
                  <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-r-lg font-bold transition-colors">
                    Join
                  </button>
                </div>
              </div>
            </div>
            <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 gap-4">
              <p>© 2024 iTutor Plus Inc. All rights reserved.</p>
              <div className="flex space-x-8">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
