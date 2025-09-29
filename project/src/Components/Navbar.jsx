import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const activeLinkStyle = {
    backgroundColor: '#166534', // A darker green for active link
    color: 'white',
  };

  return (
    <nav className="bg-green-700 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-center md:justify-between items-center">
        <h1 className="text-xl font-bold hidden md:block">Farmer News Portal</h1>
        <ul className="flex space-x-2 md:space-x-4">
          <li><NavLink to="/" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="px-3 py-2 rounded-md hover:bg-green-800 transition-colors">English</NavLink></li>
          <li><NavLink to="/hi" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="px-3 py-2 rounded-md hover:bg-green-800 transition-colors">हिन्दी</NavLink></li>
          <li><NavLink to="/mr" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="px-3 py-2 rounded-md hover:bg-green-800 transition-colors">मराठी</NavLink></li>
          <li><NavLink to="/pa" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="px-3 py-2 rounded-md hover:bg-green-800 transition-colors">ਪੰਜਾਬੀ</NavLink></li>
          <li><NavLink to="/ta" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="px-3 py-2 rounded-md hover:bg-green-800 transition-colors">தமிழ்</NavLink></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
