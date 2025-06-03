// src/components/LibraryPage.js
import React, { useState, useEffect } from 'react';

const LibraryPage = ({ onPlayTrack, currentTrack, isPlaying, user }) => {
  const [savedTracks, setSavedTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [activeTab, setActiveTab] = useState('tracks');
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user's saved tracks from localStorage on component mount
  useEffect(() => {
    if (user) {
      loadUserLibrary();
    }
  }, [user]);

  const loadUserLibrary = () => {
    try {
      // Load saved tracks from localStorage
      const userLibraryKey = `thecrate_library_${user.id}`;
      const savedLibrary = localStorage.getItem(userLibraryKey);
      
      if (savedLibrary) {
        const libraryData = JSON.parse(savedLibrary);
        setSavedTracks(libraryData.tracks || []);
        setPlaylists(libraryData.playlists || []);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading user library:', error);
      setLoading(false);
    }
  };

  const saveUserLibrary = (tracks, playlistsData) => {
    try {
      const userLibraryKey = `thecrate_library_${user.id}`;
      const libraryData = {
        tracks: tracks || savedTracks,
        playlists: playlistsData || playlists,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(userLibraryKey, JSON.stringify(libraryData));
    } catch (error) {
      console.error('Error saving user library:', error);
    }
  };

  // Function to add a track to the library (called from other components)
  const addTrackToLibrary = (track) => {
    const trackWithMetadata = {
      ...track,
      savedAt: new Date().toISOString(),
      savedBy: user.id
    };

    const updatedTracks = [...savedTracks, trackWithMetadata];
    setSavedTracks(updatedTracks);
    saveUserLibrary(updatedTracks, playlists);
    
    return true; // Track was added successfully
  };

  // Function to remove a track from the library
  const removeTrackFromLibrary = (trackId) => {
    const updatedTracks = savedTracks.filter(track => track.id !== trackId);
    setSavedTracks(updatedTracks);
    saveUserLibrary(updatedTracks, playlists);
    
    return true; // Track was removed successfully
  };

  // Function to check if a track is in the library
  const isTrackInLibrary = (trackId) => {
    return savedTracks.some(track => track.id === trackId);
  };

  // Expose these functions globally so other components can use them
  useEffect(() => {
    window.TheCrateLibrary = {
      addTrack: addTrackToLibrary,
      removeTrack: removeTrackFromLibrary,
      isTrackSaved: isTrackInLibrary
    };
  }, [savedTracks, user]);

  const handlePlayTrack = (track) => {
    let uri = track.spotify_uri;
    if (!uri && track.spotify_url) {
      const trackId = track.spotify_url.split('/track/')[1]?.split('?')[0];
      if (trackId) {
        uri = `spotify:track:${trackId}`;
      }
    }
    
    if (uri) {
      onPlayTrack(uri);
    }
  };

  const isCurrentTrack = (track) => {
    if (!currentTrack || !track.spotify_url) return false;
    const trackId = track.spotify_url.split('/track/')[1]?.split('?')[0];
    return currentTrack.id === trackId;
  };

  const createPlaylist = () => {
    if (!newPlaylistName.trim()) return;

    const newPlaylist = {
      id: Date.now().toString(),
      name: newPlaylistName,
      description: `Created by ${user.display_name}`,
      tracks: [],
      createdAt: new Date().toISOString(),
      coverImage: `https://via.placeholder.com/300x300/1f2937/ffffff?text=${encodeURIComponent(newPlaylistName)}`
    };

    const updatedPlaylists = [...playlists, newPlaylist];
    setPlaylists(updatedPlaylists);
    saveUserLibrary(savedTracks, updatedPlaylists);
    setNewPlaylistName('');
    setShowCreatePlaylist(false);
  };

  const removeFromSaved = (trackId) => {
    removeTrackFromLibrary(trackId);
  };

  const TracksView = () => (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Your Library</h2>
          <p className="text-gray-400">Samples you've saved for future projects</p>
        </div>
        <div className="text-gray-400 text-sm">
          {savedTracks.length} {savedTracks.length === 1 ? 'track' : 'tracks'} saved
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-600 border-t-white mb-4"></div>
          <p className="text-gray-400">Loading your library...</p>
        </div>
      ) : savedTracks.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">📚</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No saved tracks yet</h3>
          <p className="text-gray-400 mb-6">
            Start discovering samples and save your favorites here
          </p>
          <button
            onClick={() => window.location.hash = 'search'}
            className="bg-white hover:bg-gray-100 text-black font-medium px-6 py-3 rounded-lg transition-all duration-200"
          >
            Discover Samples
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedTracks.map((track) => (
            <div key={track.id} className="group bg-gray-900/50 border border-gray-800 hover:border-gray-700 rounded-xl overflow-hidden transition-all duration-200 hover:bg-gray-800/50">
              <div className="aspect-square relative">
                <img 
                  src={track.album_cover} 
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-200"></div>
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handlePlayTrack(track)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-lg ${
                      isCurrentTrack(track) && isPlaying
                        ? 'bg-white text-black'
                        : 'bg-white/90 text-black hover:bg-white'
                    }`}
                  >
                    {isCurrentTrack(track) && isPlaying ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </button>
                </div>

                {/* Currently Playing Indicator */}
                {isCurrentTrack(track) && (
                  <div className="absolute top-3 left-3 bg-white text-black px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                    <div className="w-3 h-3 flex items-center justify-center">
                      {isPlaying ? (
                        <div className="flex space-x-0.5">
                          <div className="w-0.5 h-3 bg-black animate-pulse"></div>
                          <div className="w-0.5 h-2 bg-black animate-pulse" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-0.5 h-3 bg-black animate-pulse" style={{animationDelay: '0.2s'}}></div>
                          <div className="w-0.5 h-1 bg-black animate-pulse" style={{animationDelay: '0.3s'}}></div>
                        </div>
                      ) : (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                        </svg>
                      )}
                    </div>
                    <span>{isPlaying ? 'Playing' : 'Paused'}</span>
                  </div>
                )}

                {/* Remove button */}
                <button
                  onClick={() => removeFromSaved(track.id)}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                  title="Remove from library"
                >
                  <div className="w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </div>
                </button>
              </div>
              
              <div className="p-4">
                <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2 leading-tight">
                  {track.title}
                </h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-1">
                  {track.artist}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => handlePlayTrack(track)}
                    className={`flex-1 mr-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                      isCurrentTrack(track) && isPlaying
                        ? 'bg-white text-black hover:bg-gray-100'
                        : 'bg-gray-700 hover:bg-gray-600 text-white'
                    }`}
                  >
                    {isCurrentTrack(track) && isPlaying ? (
                      <>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                        </svg>
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                        <span>Play</span>
                      </>
                    )}
                  </button>
                  
                  <a 
                    href={track.spotify_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    title="Open in Spotify"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.305-1.76-8.786-.963-.335.077-.67-.133-.746-.47-.077-.334.132-.67.47-.745 3.808-.871 7.076-.496 9.712 1.115.293.18.386.563.207.856zm1.223-2.723c-.226.367-.706.482-1.072.257-2.687-1.652-6.785-2.131-9.965-1.166-.423.127-.871-.106-.998-.53-.127-.422.106-.87.53-.997 3.632-1.102 8.147-.568 11.248 1.332.366.226.481.707.257 1.104zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.514.156-1.055-.135-1.211-.648-.156-.514.135-1.055.648-1.211 3.53-1.073 9.404-.865 13.115 1.338.445.264.590.837.326 1.282-.264.444-.837.590-1.281.325z"/>
                    </svg>
                  </a>
                </div>

                <div className="text-xs text-gray-500 border-t border-gray-700 pt-3">
                  <div className="flex items-center justify-between">
                    <span>Saved {new Date(track.savedAt).toLocaleDateString()}</span>
                    {track.sample_grade && (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        track.sample_grade === 'A' ? 'bg-white/20 text-white' :
                        track.sample_grade === 'B' ? 'bg-gray-500/20 text-gray-300' :
                        'bg-gray-600/20 text-gray-400'
                      }`}>
                        Grade {track.sample_grade}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const PlaylistsView = () => (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Playlists</h2>
          <p className="text-gray-400">Organize your samples into collections</p>
        </div>
        <button
          onClick={() => setShowCreatePlaylist(true)}
          className="bg-white hover:bg-gray-100 text-black font-medium px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
        >
          <span>➕</span>
          <span>Create Playlist</span>
        </button>
      </div>

      {/* Create Playlist Modal */}
      {showCreatePlaylist && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Create New Playlist</h3>
            <input
              type="text"
              placeholder="Playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-gray-500 focus:outline-none mb-4 placeholder-gray-500"
            />
            <div className="flex space-x-3">
              <button
                onClick={createPlaylist}
                disabled={!newPlaylistName.trim()}
                className="flex-1 bg-white hover:bg-gray-100 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-medium py-2 rounded-lg transition-all duration-200"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowCreatePlaylist(false);
                  setNewPlaylistName('');
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {playlists.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">🎵</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No playlists yet</h3>
          <p className="text-gray-400 mb-6">
            Create your first playlist to organize your favorite samples
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="bg-gray-900/50 border border-gray-800 hover:border-gray-700 rounded-xl overflow-hidden transition-all duration-200 hover:bg-gray-800/50">
              <div className="aspect-square relative">
                <img 
                  src={playlist.coverImage} 
                  alt={playlist.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
              
              <div className="p-4">
                <h3 className="text-white font-bold text-lg mb-2">
                  {playlist.name}
                </h3>
                <p className="text-gray-400 mb-4 text-sm">
                  {playlist.tracks.length} {playlist.tracks.length === 1 ? 'track' : 'tracks'}
                </p>
                
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 rounded-lg transition-all duration-200">
                  Open Playlist
                </button>
                
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <div className="text-xs text-gray-500">
                    Created {new Date(playlist.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
        {/* Header */}
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold mb-4">
            Your Music Library
          </h1>
          <p className="text-gray-400">
            All your saved samples and playlists in one place
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('tracks')}
              className={`px-6 py-2 rounded-lg transition-all duration-200 font-medium ${
                activeTab === 'tracks'
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Saved Tracks ({savedTracks.length})
            </button>
            <button
              onClick={() => setActiveTab('playlists')}
              className={`px-6 py-2 rounded-lg transition-all duration-200 font-medium ${
                activeTab === 'playlists'
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Playlists ({playlists.length})
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'tracks' ? <TracksView /> : <PlaylistsView />}
      </div>
    </div>
  );
};

export default LibraryPage;