// src/components/SearchPage.js
import React, { useState, useEffect } from 'react';
import config from '../config';
const SearchPage = ({ onPlayTrack, currentTrack, isPlaying }) => {
  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedTracks, setSavedTracks] = useState(new Set());
  const [refreshSeed, setRefreshSeed] = useState(null);
  const [searchInfo, setSearchInfo] = useState(null);

  // Check saved tracks when component mounts or results change
  useEffect(() => {
    updateSavedTracksState();
  }, [results]);

  const updateSavedTracksState = () => {
    if (window.TheCrateLibrary) {
      const savedTrackIds = new Set();
      results.forEach(track => {
        if (window.TheCrateLibrary.isTrackSaved(track.id)) {
          savedTrackIds.add(track.id);
        }
      });
      setSavedTracks(savedTrackIds);
    }
  };

  const searchMusic = async (useRefresh = false) => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    if (!useRefresh) {
      setResults([]);
      setSearchInfo(null);
    }
    
    try {
      const requestBody = {
        prompt: prompt.trim()
      };

      // Add refresh seed if this is a refresh
      if (useRefresh) {
        requestBody.refresh_seed = Date.now();
      }

      const res = await fetch(`${config.API_BASE_URL}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      
      const data = await res.json();
      
      if (data.error) {
        console.error('Search error:', data.error);
        return;
      }

      // Handle both new API response format and legacy format
      const tracks = data.tracks || data;
      setResults(tracks);
      
      // Set search info if available (new API format)
      if (data.analysis || data.total_found) {
        setSearchInfo({
          totalFound: data.total_found,
          queriesUsed: data.queries_used,
          analysis: data.analysis,
          isRefresh: data.is_refresh || useRefresh,
          refreshSeed: data.refresh_seed
        });
        setRefreshSeed(data.refresh_seed);
      } else if (useRefresh) {
        // For legacy API, still track that this was a refresh
        setSearchInfo(prev => ({
          ...prev,
          isRefresh: true
        }));
      }
      
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    }
    
    setLoading(false);
  };

  const handleSubmit = () => {
    setRefreshSeed(null);
    searchMusic(false);
  };

  const handleRefresh = () => {
    searchMusic(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

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

  const toggleSaveTrack = (track) => {
    if (!window.TheCrateLibrary) {
      console.error('Library system not available');
      return;
    }

    const trackId = track.id;
    const isCurrentlySaved = savedTracks.has(trackId);

    if (isCurrentlySaved) {
      // Remove from library
      if (window.TheCrateLibrary.removeTrack(trackId)) {
        const newSavedTracks = new Set(savedTracks);
        newSavedTracks.delete(trackId);
        setSavedTracks(newSavedTracks);
        
        // Show feedback
        showFeedback(`Removed "${track.title}" from library`, 'removed');
      }
    } else {
      // Add to library
      if (window.TheCrateLibrary.addTrack(track)) {
        const newSavedTracks = new Set(savedTracks);
        newSavedTracks.add(trackId);
        setSavedTracks(newSavedTracks);
        
        // Show feedback
        showFeedback(`Added "${track.title}" to library`, 'added');
      }
    }
  };

  const showFeedback = (message, type) => {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-50 px-4 py-2 rounded-lg text-white text-sm font-medium transform transition-all duration-300 ${
      type === 'added' ? 'bg-green-600' : 'bg-red-600'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  const isCurrentTrack = (track) => {
    if (!currentTrack || !track.spotify_url) return false;
    const trackId = track.spotify_url.split('/track/')[1]?.split('?')[0];
    return currentTrack.id === trackId;
  };

  const quickSearches = [
    "90s boom bap drums",
    "jazz piano chords", 
    "lo-fi ambient",
    "trap hi-hats",
    "soul vocal chops",
    "vinyl crackle"
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Discover Samples
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Describe any sound you're looking for. Our AI will find the perfect samples from millions of tracks.
          </p>
        </div>
        
        {/* Search Input */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="e.g., dark atmospheric pads with vinyl warmth"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full py-4 px-6 bg-gray-900 text-white rounded-xl border border-gray-700 focus:border-gray-500 focus:outline-none text-lg placeholder-gray-500"
            />
            <button
              onClick={handleSubmit}
              disabled={loading || !prompt.trim()}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-100 disabled:bg-gray-600 disabled:cursor-not-allowed text-black p-2.5 rounded-lg transition-all duration-200"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </button>
          </div>

          {/* Refresh Button - Only show if we have results */}
          {results.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-transparent border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800/50 hover:border-gray-500 hover:text-white disabled:opacity-50 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {loading ? 'Finding new results...' : 'Refresh for different results'}
              </button>

              {/* Search Info */}
              {searchInfo && (
                <div className="text-sm text-gray-400">
                  {searchInfo.isRefresh && (
                    <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded mr-2">
                      Refreshed
                    </span>
                  )}
                  {searchInfo.totalFound && `${results.length} of ${searchInfo.totalFound} results`}
                  {searchInfo.analysis?.approach && (
                    <span className="ml-2 text-gray-500">• {searchInfo.analysis.approach}</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Search Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-4xl mx-auto">
          {quickSearches.map((search, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(search);
                setTimeout(() => handleSubmit(), 100);
              }}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-full text-sm border border-gray-700 hover:border-gray-600 transition-all duration-200"
            >
              {search}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-2xl mb-6">
              <div className="w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {searchInfo?.isRefresh || refreshSeed ? 'Finding completely different results' : 'AI is analyzing your request'}
            </h3>
            <p className="text-gray-400">
              {searchInfo?.isRefresh || refreshSeed ? 'Using a different approach...' : 'Searching through millions of tracks...'}
            </p>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">
                {searchInfo?.isRefresh ? 'Refreshed Results' : `Found ${results.length} samples`}
              </h2>
              <div className="text-sm text-gray-400 flex items-center gap-4">
                <span>Ranked by AI relevance</span>
                {searchInfo?.analysis?.pioneer_artists && (
                  <span className="text-xs bg-gray-800 px-2 py-1 rounded">
                    Key: {searchInfo.analysis.pioneer_artists.slice(0, 2).join(', ')}
                  </span>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map((track, idx) => (
                <div key={track.id || idx} className="group bg-gray-900/50 border border-gray-800 hover:border-gray-700 rounded-xl overflow-hidden transition-all duration-200 hover:bg-gray-800/50">
                  <div className="aspect-square relative">
                    <img 
                      src={track.album_cover || track.image} 
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

                    {/* Save button */}
                    <button
                      onClick={() => toggleSaveTrack(track)}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                      title={savedTracks.has(track.id) ? "Remove from library" : "Add to library"}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                        savedTracks.has(track.id)
                          ? 'bg-white text-black'
                          : 'bg-black/60 text-white hover:bg-black/80'
                      }`}>
                        {savedTracks.has(track.id) ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                          </svg>
                        )}
                      </div>
                    </button>

                    {/* Refresh indicator */}
                    {searchInfo?.isRefresh && idx < 3 && (
                      <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        New find
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2 leading-tight">
                      {track.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-1">
                      {track.artist}
                    </p>
                    
                    <div className="flex items-center justify-between">
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
                        href={track.spotify_url || track.external_urls?.spotify} 
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results State */}
        {!loading && results.length === 0 && prompt && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🎵</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">No samples found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search terms or explore our suggested searches above
            </p>
            <button
              onClick={() => setPrompt('')}
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg border border-gray-700 transition-all duration-200"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Search Tips */}
        {!loading && results.length === 0 && !prompt && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold mb-4">Search Tips</h3>
              <p className="text-gray-400">Get better results with these search strategies</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  
                  <h4 className="text-lg font-semibold">Describe the Vibe</h4>
                </div>
                <p className="text-gray-400 text-sm mb-3">
                  Use emotional and atmospheric descriptors
                </p>
                <div className="text-sm text-gray-500 bg-gray-800/50 rounded-lg p-3">
                  "Dark moody piano samples" or "uplifting gospel vocals"
                </div>
              </div>
              
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  
                  <h4 className="text-lg font-semibold">Mention Instruments</h4>
                </div>
                <p className="text-gray-400 text-sm mb-3">
                  Specify instruments or sound sources
                </p>
                <div className="text-sm text-gray-500 bg-gray-800/50 rounded-lg p-3">
                  "Jazz saxophone loops" or "808 trap drums"
                </div>
              </div>
              
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  
                  <h4 className="text-lg font-semibold">Include Era/Genre</h4>
                </div>
                <p className="text-gray-400 text-sm mb-3">
                  Reference specific time periods or styles
                </p>
                <div className="text-sm text-gray-500 bg-gray-800/50 rounded-lg p-3">
                  "90s hip hop samples" or "vintage soul breaks"
                </div>
              </div>
              
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  
                  <h4 className="text-lg font-semibold">Be Specific</h4>
                </div>
                <p className="text-gray-400 text-sm mb-3">
                  Add technical details when possible
                </p>
                <div className="text-sm text-gray-500 bg-gray-800/50 rounded-lg p-3">
                  "Boom bap drum breaks 90 BPM" or "minor key piano chords"
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;