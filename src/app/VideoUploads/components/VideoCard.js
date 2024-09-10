import React from 'react';
import Link from 'next/link';

const VideoCard = ({ video }) => {
  return (
    <div className="bg-white shadow-md rounded-md overflow-hidden">
      <div className="relative">
        <img src={video.thumbnail} alt={video.title} className="w-full h-56 object-cover" />
        <video 
          className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-100" 
          src={video.preview} 
          muted 
          loop 
          playsInline 
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{video.title}</h3>
        <p className="text-gray-600 mb-4">{video.description}</p>
        <div className="flex justify-between items-center">
          <div className="text-gray-500">{video.duration}</div>
          <Link href={`/video/${video.id}`}>
            <p className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Watch
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
