// src/components/Navigation.js
import React from 'react';
import crateLogo from '../crate-logo.png'; // Update this path to match your file structure

const CrateLogo = ({ className = "w-8 h-8" }) => (
  <img 
    src={crateLogo}
    alt="Crate Logo"
    className={className}
  />
);

const Navigation = ({ currentPage, navigate, user, onLogout }) => {
  return (
    <nav className="bg-black/80 backdrop-blur-md border-b border-gray-800/50 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 text-white flex items-center justify-center hover:text-gray-300 transition-colors duration-200">
              <CrateLogo className="w-8 h-8" />
            </div>
            <h1 className="text-lg font-semibold text-white">
              TheCrate
            </h1>
          </div>

          {/* Navigation Links */}
          {user && (
            <div className="flex items-center space-x-0">
              <button
                onClick={() => navigate('home')}
                className={`px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                  currentPage === 'home'
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Home
              </button>
              
              <button
                onClick={() => navigate('search')}
                className={`px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                  currentPage === 'search'
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Discover
              </button>

              <button
                onClick={() => navigate('library')}
                className={`px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                  currentPage === 'library'
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Library
              </button>
            </div>
          )}

          {/* User Profile */}
          {user && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <img 
                  src={user.images?.[0]?.url || '/default-avatar.png'} 
                  alt={user.display_name}
                  className="w-7 h-7 rounded-full border border-gray-700"
                />
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-white">{user.display_name}</p>
                </div>
              </div>
              
              <div className="w-px h-4 bg-gray-600" />
              
              <button
                onClick={onLogout}
                className="text-gray-400 hover:text-white text-sm px-2 py-1 rounded-md transition-colors hover:bg-gray-800/50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;