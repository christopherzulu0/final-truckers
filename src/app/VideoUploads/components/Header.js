import React from 'react';

const Header = () => {
  return (
    <header className="bg-gray-900 text-white py-4">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold">Video Hub</h1>
        <nav className="mt-4 sm:mt-0">
          <ul className="flex space-x-4">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">Browse</a></li>
            <li><a href="#" className="hover:underline">Upload</a></li>
            <li><a href="#" className="hover:underline">Profile</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
