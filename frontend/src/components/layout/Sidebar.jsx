import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, Users, LogOut, Menu, X } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useContext(AuthContext);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    ...(user?.role === 'admin' ? [{ name: 'Team', path: '/team', icon: Users }] : [])
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-sidebar text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 bg-black/10">
            <h1 className="text-xl font-bold tracking-wider">TaskFlow</h1>
            <button className="lg:hidden p-1 text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-white/10 text-white font-medium' 
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* User Profile Area */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Avatar name={user?.fullName} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.fullName}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 rounded-lg hover:bg-white/5 hover:text-white transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
