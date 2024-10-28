import React from 'react';
import { Menu, X, Github } from 'lucide-react';

interface NavbarProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isOpen, toggleMenu }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Github className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">DevStack</span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-indigo-600 transition-colors">Features</a>
              <a href="#about" className="text-gray-700 hover:text-indigo-600 transition-colors">About</a>
              <a href="#contact" className="text-gray-700 hover:text-indigo-600 transition-colors">Contact</a>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                Get Started
              </button>
            </div>
          </div>
          
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-700">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-b border-gray-100">
            <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors">Features</a>
            <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors">About</a>
            <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors">Contact</a>
            <button className="w-full mt-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};