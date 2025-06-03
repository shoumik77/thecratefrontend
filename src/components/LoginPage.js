// src/components/LoginPage.js
import React from 'react';
import config from '../config';
const LoginPage = () => {
  const handleLogin = () => {
    window.location.href = `${config.API_BASE_URL}/auth/login`;
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-md w-full mx-4">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-2xl">
          {/* Logo/Icon */}
          <div className="text-center mb-8">
            
            
            <h1 className="text-3xl font-bold mb-3">
              Welcome to <span className="bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">TheCrate</span>
            </h1>
            
            <p className="text-gray-400 text-sm leading-relaxed">
              AI-powered sample discovery for producers. Connect your Spotify Premium account to start finding the perfect samples.
            </p>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-white hover:bg-gray-100 text-black font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.305-1.76-8.786-.963-.335.077-.67-.133-.746-.47-.077-.334.132-.67.47-.745 3.808-.871 7.076-.496 9.712 1.115.293.18.386.563.207.856zm1.223-2.723c-.226.367-.706.482-1.072.257-2.687-1.652-6.785-2.131-9.965-1.166-.423.127-.871-.106-.998-.53-.127-.422.106-.87.53-.997 3.632-1.102 8.147-.568 11.248 1.332.366.226.481.707.257 1.104zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.514.156-1.055-.135-1.211-.648-.156-.514.135-1.055.648-1.211 3.53-1.073 9.404-.865 13.115 1.338.445.264.590.837.326 1.282-.264.444-.837.590-1.281.325z"/>
            </svg>
            <span>Continue with Spotify</span>
          </button>

          {/* Features */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center space-x-3 text-sm text-gray-400">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              <span>Requires Spotify Premium</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-400">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              <span>Full track playback in browser</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-400">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              <span>AI-powered sample discovery</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <p className="text-xs text-gray-500 text-center">
              By continuing, you agree to Spotify's Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-600">
            Powered by OpenAI GPT-4 and Spotify Web API
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;