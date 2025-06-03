import React from 'react';
import './Home.css';
import config from '../config';
function Home() {
  const handleSpotifyLogin = () => {
    window.location.href = `${config.API_BASE_URL}/auth/login`;
  };

  return (
    <div className="home">
      <h1>TheCrate</h1>
      <p>Discover vintage or obscure tracks to sample for your next production.</p>
      <button onClick={handleSpotifyLogin} className="spotify-btn">
        Login with Spotify
      </button>
      <p className="note">
        After logging in, you'll be able to get personalized sample suggestions based on your preferences.
      </p>
    </div>
  );
}

export default Home;
