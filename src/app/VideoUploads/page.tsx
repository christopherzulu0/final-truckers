import React from 'react'
import Header from './components/Header';
import VideoCard from './components/VideoCard';
export default function page() {
  const videos = [
    {
      id: 1,
      title: 'How to Use Next.js',
      description: 'Learn how to build fast and scalable web applications with Next.js.',
      thumbnail: 'https://example.com/thumbnail1.jpg',
      duration: '12:34',
    },
    {
      id: 2,
      title: 'Tailwind CSS Crash Course',
      description: 'Get up to speed with Tailwind CSS, a utility-first CSS framework.',
      thumbnail: 'https://example.com/thumbnail2.jpg',
      duration: '23:45',
    },
    // Add more videos as needed
  ];


  return (
      <div>
      <Header />
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Latest Videos</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </main>
    </div>
  )
}
