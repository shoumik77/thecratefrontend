// src/components/PlayerControls.js
import React, { useState } from 'react';

const PlayerControls = ({ 
  currentTrack, 
  isPlaying, 
  onTogglePlay, 
  onNext, 
  onPrevious, 
  playerReady,
  volume,
  onVolumeChange
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  if (!playerReady) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-gray-800 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center text-gray-400">
            <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-gray-600 border-t-white mr-3"></div>
            <span className="text-sm">Connecting to Spotify...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Current Track Info */}
          <div className="flex items-center space-x-4 flex-1 min-w-0 max-w-sm">
            {currentTrack ? (
              <>
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                  <img 
                    src={currentTrack.album.images[0]?.url} 
                    alt={currentTrack.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-medium text-sm truncate">{currentTrack.name}</p>
                  <p className="text-gray-400 text-xs truncate">
                    {currentTrack.artists.map(artist => artist.name).join(', ')}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🎵</span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">No track selected</p>
                  <p className="text-gray-500 text-xs">Choose a sample to play</p>
                </div>
              </div>
            )}
          </div>

          {/* Player Controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onPrevious}
              disabled={!currentTrack}
              className="text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors p-2"
              title="Previous track"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </button>
            
            <button
              onClick={onTogglePlay}
              disabled={!currentTrack}
              className="bg-white hover:bg-gray-100 disabled:bg-gray-600 disabled:cursor-not-allowed text-black rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200 transform hover:scale-105"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>
            
            <button
              onClick={onNext}
              disabled={!currentTrack}
              className="text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors p-2"
              title="Next track"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
              </svg>
            </button>
          </div>

          {/* Volume Control & Info */}
          <div className="flex items-center space-x-4 flex-1 justify-end max-w-sm">
            <div className="relative">
              <button
                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                className="text-gray-400 hover:text-white transition-colors p-2"
                title="Volume"
              >
                {volume === 0 ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                  </svg>
                ) : volume < 50 ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                )}
              </button>
              
              {showVolumeSlider && (
                <div className="absolute bottom-full right-0 mb-2 bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => onVolumeChange(parseInt(e.target.value))}
                    className="w-20 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #ffffff 0%, #ffffff ${volume}%, #4b5563 ${volume}%, #4b5563 100%)`
                    }}
                  />
                  <div className="text-center text-xs text-gray-400 mt-2">{volume}%</div>
                </div>
              )}
            </div>
            
            {currentTrack && (
              <div className="text-right">
                <div className="text-xs text-gray-400">Playing on</div>
                <div className="text-xs font-medium text-white">TheCrate Player</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerControls;