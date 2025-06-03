import React from 'react';
import './Home.css';

function Home() {
  const handleSpotifyLogin = () => {
    window.location.href = 'http://localhost:5001/login'; // Replace with actual backend auth route
  };

  return (
    <div className="home">
      <h1>🎶 TheCrate</h1>
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
