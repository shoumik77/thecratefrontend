// CrateApp.js
import React, { useState } from 'react';
import './CrateApp.css';

function CrateApp() {
  const [prompt, setPrompt] = useState('');
  const [era, setEra] = useState('vintage');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setResults([]);
    try {
      const res = await fetch('http://localhost:5001/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, era }),
      });
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    }
    setLoading(false);
  };

  return (
    <div className="app">
      <h1>🎵 TheCrate: Sample Suggestions</h1>
      <input
        type="text"
        placeholder="e.g. classic soul samples"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <select value={era} onChange={(e) => setEra(e.target.value)}>
        <option value="vintage">Vintage</option>
        <option value="modern">Modern</option>
      </select>
      <button onClick={handleSubmit}>Get Samples</button>

      {loading && <p>Loading...</p>}

      <div className="results">
        {results.map((track, idx) => (
          <div key={idx} className="track-card">
            <img src={track.album_cover} alt={track.title} />
            <h3>{track.title}</h3>
            <p>{track.artist}</p>
            <a href={track.spotify_url} target="_blank" rel="noopener noreferrer">Play on Spotify</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CrateApp;
