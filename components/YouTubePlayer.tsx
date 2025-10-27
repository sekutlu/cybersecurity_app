'use client';

import { useState } from 'react';
import { Play, Pause } from 'lucide-react';

interface YouTubePlayerProps {
  videoId: string;
  title: string;
  onVideoComplete?: () => void;
}

export default function YouTubePlayer({ videoId, title, onVideoComplete }: YouTubePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!videoId) {
    return null;
  }

  return (
    <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
      {!isPlaying ? (
        <div 
          className="absolute inset-0 flex items-center justify-center cursor-pointer group"
          onClick={() => setIsPlaying(true)}
        >
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-green-500 hover:bg-green-600 rounded-full p-4 transition-colors">
              <Play className="h-8 w-8 text-black ml-1" fill="currentColor" />
            </div>
          </div>
        </div>
      ) : (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
          title={title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => {
            // Simulate video completion after 10 seconds for demo
            setTimeout(() => {
              if (onVideoComplete) {
                onVideoComplete();
              }
            }, 10000);
          }}
        />
      )}
    </div>
  );
}