// src/components/HomePage.js
import React from 'react';
import crateLogo from '../crate-logo.png';

const LargeCrateLogo = ({ className = "w-80 h-80" }) => (
  <img 
    src={crateLogo}
    alt="Crate Logo"
    className={`${className} mix-blend-screen`}
    style={{
      filter: 'brightness(1.2) contrast(1.1)',
    }}
  />
);

const HomePage = ({ navigate, user }) => {
  const sampleQueries = [
    "90s boom bap drums",
    "jazz piano chords", 
    "lo-fi ambient textures",
    "classic soul breaks",
    "trap hi-hats",
    "vinyl crackle loops"
  ];

  const stats = [
    { value: "10K+", label: "Samples Discovered" },
    { value: "50+", label: "Genres Covered" },
    { value: "AI", label: "Powered Search" }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 to-black"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-left">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
                Find the perfect
                <br />
                <span className="bg-gradient-to-r from-gray-200 to-gray-500 bg-clip-text text-transparent">
                  sample, instantly
                </span>
              </h1>

              <p className="text-xl text-gray-400 mb-12 leading-relaxed">
                Describe any sound in your head. Our AI will dig through millions of tracks to find exactly what you need.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('search')}
                  className="bg-white hover:bg-gray-100 text-black font-medium py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  Start Discovering
                </button>
                <button
                  onClick={() => navigate('library')}
                  className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-8 rounded-lg border border-gray-700 transition-all duration-200"
                >
                  View Library
                </button>
              </div>
            </div>

            {/* Right Logo - Desktop only */}
            <div className="hidden xl:flex justify-center items-center min-h-[36rem]">
              <div className="relative">
                <LargeCrateLogo className="w-[32rem] h-[32rem] text-white opacity-90 hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700/20 to-gray-600/20 rounded-full blur-3xl -z-10 scale-150"></div>
                
                <div className="absolute -top-4 -right-4 w-3 h-3 bg-gray-500 rounded-full opacity-60 animate-pulse"></div>
                <div className="absolute -bottom-6 -left-6 w-2 h-2 bg-gray-400 rounded-full opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 -right-8 w-1.5 h-1.5 bg-gray-600 rounded-full opacity-50 animate-pulse" style={{animationDelay: '2s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-y border-gray-800 bg-gray-900/30">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-3 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx}>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Search */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Try these popular searches</h2>
          <p className="text-gray-400">Get started with some of our most requested sample types</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {sampleQueries.map((query, idx) => (
            <button
              key={idx}
              onClick={() => navigate('search')}
              className="group p-4 bg-gray-900/50 hover:bg-gray-800/50 border border-gray-800 hover:border-gray-700 rounded-xl transition-all duration-200 text-left"
            >
              <div className="text-sm font-medium text-white group-hover:text-gray-200 transition-colors">
                "{query}"
              </div>
              <div className="text-xs text-gray-500 mt-1 group-hover:text-gray-400 transition-colors">
                Search sample →
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* User welcome (if logged in) */}
      {user && (
        <div className="border-t border-gray-800">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700 rounded-2xl p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Welcome back, {user.display_name}</h3>
                  <p className="text-gray-400">Ready to discover your next favorite sample?</p>
                </div>
                <button
                  onClick={() => navigate('search')}
                  className="bg-white hover:bg-gray-100 text-black font-medium py-2 px-6 rounded-lg transition-all duration-200"
                >
                  Start Searching
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
