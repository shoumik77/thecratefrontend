// src/App.js
import React, { useState, useEffect } from 'react';
import { useRouter } from './hooks/useRouter';
import { useSpotifyPlayer } from './hooks/useSpotifyPlayer';
import Navigation from './components/Navigation';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import SearchPage from './components/SearchPage';
import LibraryPage from './components/LibraryPage';
import PlayerControls from './components/PlayerControls';
import './App.css';

function App() {
  const { currentPage, navigate } = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Initialize Spotify player
  const {
    currentTrack,
    isPlaying,
    playerReady,
    volume,
    playTrack,
    togglePlay,
    nextTrack,
    previousTrack,
    setPlayerVolume
  } = useSpotifyPlayer(token);

  // Check for authentication on app load
  useEffect(() => {
    // Check URL for auth callback
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    
    if (accessToken) {
      setToken(accessToken);
      // Remove token from URL for security
      window.history.replaceState({}, document.title, window.location.pathname);
      fetchUserProfile(accessToken);
    } else {
      // Check localStorage for existing session
      const savedToken = localStorage.getItem('spotify_access_token');
      const savedUser = localStorage.getItem('spotify_user');
      
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    }
  }, []);

  const fetchUserProfile = async (accessToken) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        
        // Save to localStorage
        localStorage.setItem('spotify_access_token', accessToken);
        localStorage.setItem('spotify_user', JSON.stringify(userData));
      } else {
        // Token might be expired
        handleLogout();
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      handleLogout();
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_user');
    navigate('home');
  };

  // If user is not authenticated, show login page
  if (!user || !token) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation 
        currentPage={currentPage} 
        navigate={navigate} 
        user={user}
        onLogout={handleLogout}
      />
      
      <main>
        {currentPage === 'home' && (
          <HomePage navigate={navigate} user={user} />
        )}
        
        {currentPage === 'search' && (
          <SearchPage 
            onPlayTrack={playTrack}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
          />
        )}
        
        {currentPage === 'library' && (
          <LibraryPage 
            onPlayTrack={playTrack}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            user={user}
          />
        )}
      </main>

      <PlayerControls
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
        onNext={nextTrack}
        onPrevious={previousTrack}
        playerReady={playerReady}
        volume={volume}
        onVolumeChange={setPlayerVolume}
      />
    </div>
  );
}

export default App;