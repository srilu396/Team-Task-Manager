import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, Users, LogOut, Settings, HelpCircle, Plus, X } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useContext(AuthContext);

  const navItems = [
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'My Tasks', path: '/dashboard', icon: CheckSquare }, 
    { name: 'Team Members', path: '/team', icon: Users },
    { name: 'Settings', path: '/settings', icon: Settings }
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
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#F8FAFC] border-r border-gray-200 text-text-main transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full py-6">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                 <span className="text-white font-bold text-xl leading-none">T</span>
              </div>
              <div>
                 <h1 className="text-xl font-bold tracking-tight text-primary leading-tight">TeamSync</h1>
                 <p className="text-[10px] font-bold text-text-muted tracking-widest uppercase">Enterprise Workspace</p>
              </div>
            </div>
            <button className="lg:hidden p-1 text-gray-500 hover:text-gray-800" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="px-6 mb-8">
             <button className="w-full bg-primary hover:bg-primary-hover text-white rounded-lg py-3 flex items-center justify-center gap-2 font-bold transition-all shadow-sm">
                <Plus size={18} />
                New Project
             </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                      isActive 
                        ? 'bg-[#E0E7FF] text-primary' 
                        : 'text-text-muted hover:bg-gray-100 hover:text-text-main'
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Bottom Area */}
          <div className="px-4 mt-auto pt-6 space-y-1.5 border-t border-gray-200">
             <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-text-muted rounded-xl hover:bg-gray-100 hover:text-text-main transition-colors">
                 <HelpCircle size={18} />
                 <span>Help Center</span>
             </button>
             <button 
               onClick={logout}
               className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-text-muted rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors"
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
