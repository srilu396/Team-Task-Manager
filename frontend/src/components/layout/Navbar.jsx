import React from 'react';
import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
  const location = useLocation();
  const path = location.pathname.split('/')[1] || 'Dashboard';
  
  const title = path.charAt(0).toUpperCase() + path.slice(1);

  return (
    <header className="sticky top-0 z-30 flex items-center h-16 px-4 bg-white border-b border-gray-200 lg:px-8">
      <button 
        className="p-2 mr-4 text-gray-500 rounded-md lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
        onClick={onMenuClick}
      >
        <Menu size={24} />
      </button>
      
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </header>
  );
};

export default Navbar;
