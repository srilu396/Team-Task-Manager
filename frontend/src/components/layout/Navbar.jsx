import React, { useContext } from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';

const Navbar = ({ onMenuClick }) => {
  const { user } = useContext(AuthContext);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-8 bg-white border-b border-gray-100">
      <div className="flex items-center flex-1">
        <button 
          className="p-2 mr-4 text-gray-500 rounded-md lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={onMenuClick}
        >
          <Menu size={24} />
        </button>
        
        <div className="hidden lg:flex items-center relative w-full max-w-md">
          <Search className="absolute left-3 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search projects, tasks, or files..." 
            className="w-full pl-10 pr-4 py-2 bg-[#F0F4FF] border-none text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder-gray-400"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-text-main transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <button className="text-gray-400 hover:text-text-main transition-colors lg:hidden">
          <Search className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 ml-2 pl-4 border-l border-gray-200">
          <Avatar name={user?.fullName || 'Alex Rivera'} />
          <span className="hidden sm:block text-sm font-medium text-text-main">{user?.fullName || 'Alex Rivera'}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
