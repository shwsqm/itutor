
import React from 'react';
import { Search, User, Menu, BookOpen } from 'lucide-react';

interface NavbarProps {
  onSearchClick: () => void;
  onHomeClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearchClick, onHomeClick }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center cursor-pointer group"
            onClick={onHomeClick}
          >
            <div className="bg-indigo-600 p-2 rounded-lg mr-3 group-hover:bg-indigo-700 transition-colors">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              iTutor+
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={onSearchClick}
              className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
            >
              Find Tutors
            </button>
            <a href="#" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">How it Works</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Resources</a>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={onSearchClick}
              className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
            <button className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
              Login
            </button>
            <button className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-full hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
