import React, { useState, useEffect, useContext } from 'react';
import dashboardService from '../services/dashboard.service';
import { ToastContext } from '../context/ToastContext';
import Skeleton from '../components/ui/Skeleton';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (error) {
      showToast('Failed to load dashboard stats', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      <div>
        <h1 className="text-2xl font-bold text-text-main mb-1">Project Overview</h1>
        <p className="text-text-muted text-sm">Track progress and manage your team's workflow across all active initiatives.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Total Tasks</span>
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-text-main mb-2">{stats?.totalTasks || 0}</div>
          <div className="text-sm font-medium text-emerald-600 flex items-center gap-1">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
             +12% from last week
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">In Progress</span>
            <div className="w-8 h-8 bg-cyan-50 text-cyan-600 rounded flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-text-main mb-2">{stats?.tasksByStatus?.in_progress || 0}</div>
          <div className="text-sm font-medium text-text-muted">Currently active</div>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Completed</span>
            <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-text-main mb-2">{stats?.completedTasks || 0}</div>
          <div className="text-sm font-medium text-emerald-600 flex items-center gap-1">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
             94% on-time delivery
          </div>
        </div>

        {/* Overdue */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Overdue</span>
            <div className="w-8 h-8 bg-red-50 text-red-600 rounded flex items-center justify-center font-bold text-lg">
              !
            </div>
          </div>
          <div className="text-3xl font-bold text-red-600 mb-2">{stats?.overdueTasks || 0}</div>
          <div className="text-sm font-medium text-red-600">Needs attention</div>
        </div>
      </div>

      {/* Active Projects (Placeholder for dynamic data) */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-text-main">Active Projects</h2>
          <Link to="/projects" className="text-sm font-bold text-primary hover:text-primary-hover flex items-center gap-1">
            View All <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border-l-4 border-l-primary border-y border-r border-gray-200 p-5 shadow-sm flex flex-col justify-between">
             <div>
                 <div className="flex justify-between items-start mb-2">
                     <h3 className="font-bold text-text-main">Nebula Dashboard</h3>
                     <span className="px-3 py-1 bg-cyan-100 text-cyan-800 text-xs font-bold rounded-full">IN PROGRESS</span>
                 </div>
                 <p className="text-sm text-text-muted mb-6 line-clamp-2">UI/UX redesign and front-end implementation for the new...</p>
             </div>
             <div>
                 <div className="flex justify-between text-sm font-medium mb-1">
                     <span className="text-text-muted">Progress</span>
                     <span className="text-text-main">65%</span>
                 </div>
                 <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                     <div className="bg-primary h-1.5 rounded-full" style={{ width: '65%' }}></div>
                 </div>
                 <div className="flex justify-between items-center">
                     <div className="flex -space-x-2">
                         <div className="w-6 h-6 rounded-full bg-slate-300 border border-white"></div>
                         <div className="w-6 h-6 rounded-full bg-slate-400 border border-white"></div>
                         <div className="w-6 h-6 rounded-full bg-slate-500 border border-white"></div>
                     </div>
                     <div className="text-xs font-medium text-text-muted flex items-center gap-1">
                         <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                         Due Jun 12
                     </div>
                 </div>
             </div>
          </div>

          <div className="bg-white rounded-xl border-l-4 border-l-cyan-500 border-y border-r border-gray-200 p-5 shadow-sm flex flex-col justify-between">
             <div>
                 <div className="flex justify-between items-start mb-2">
                     <h3 className="font-bold text-text-main">API Integration</h3>
                     <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">ON HOLD</span>
                 </div>
                 <p className="text-sm text-text-muted mb-6 line-clamp-2">Connecting third-party payment gateways and authentication...</p>
             </div>
             <div>
                 <div className="flex justify-between text-sm font-medium mb-1">
                     <span className="text-text-muted">Progress</span>
                     <span className="text-text-main">30%</span>
                 </div>
                 <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                     <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: '30%' }}></div>
                 </div>
                 <div className="flex justify-between items-center">
                     <div className="flex -space-x-2">
                         <div className="w-6 h-6 rounded-full bg-slate-400 border border-white"></div>
                         <div className="w-6 h-6 rounded-full bg-slate-500 border border-white"></div>
                     </div>
                     <div className="text-xs font-medium text-text-muted flex items-center gap-1">
                         <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                         Due Jul 05
                     </div>
                 </div>
             </div>
          </div>

          <div className="bg-white rounded-xl border-l-4 border-l-red-500 border-y border-r border-gray-200 p-5 shadow-sm flex flex-col justify-between">
             <div>
                 <div className="flex justify-between items-start mb-2">
                     <h3 className="font-bold text-text-main">Marketing Site</h3>
                     <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">DELAYED</span>
                 </div>
                 <p className="text-sm text-text-muted mb-6 line-clamp-2">Complete overhaul of the public-facing website with new brand...</p>
             </div>
             <div>
                 <div className="flex justify-between text-sm font-medium mb-1">
                     <span className="text-text-muted">Progress</span>
                     <span className="text-text-main">88%</span>
                 </div>
                 <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                     <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '88%' }}></div>
                 </div>
                 <div className="flex justify-between items-center">
                     <div className="flex -space-x-2">
                         <div className="w-6 h-6 rounded-full bg-slate-300 border border-white"></div>
                         <div className="w-6 h-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center border border-white">+2</div>
                     </div>
                     <div className="text-xs font-bold text-red-600 flex items-center gap-1">
                         ! Overdue 2d
                     </div>
                 </div>
             </div>
          </div>
        </div>
      </div>

      {/* Recent Tasks Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-text-main">Recent Tasks</h2>
          <div className="flex items-center gap-4 text-sm font-medium text-text-muted">
            <button className="flex items-center gap-1 hover:text-text-main">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
              Filter
            </button>
            <button className="flex items-center gap-1 hover:text-text-main">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path></svg>
              Sort
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="py-3 px-5 text-xs font-bold text-text-muted uppercase tracking-wider">Task Name</th>
                <th className="py-3 px-5 text-xs font-bold text-text-muted uppercase tracking-wider text-center">Priority</th>
                <th className="py-3 px-5 text-xs font-bold text-text-muted uppercase tracking-wider">Assignee</th>
                <th className="py-3 px-5 text-xs font-bold text-text-muted uppercase tracking-wider">Due Date</th>
                <th className="py-3 px-5 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats?.recentTasks?.length > 0 ? (
                stats.recentTasks.map(task => (
                  <tr key={task._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 border-gray-300 rounded text-primary focus:ring-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                        <Link to={task.project?._id ? `/projects/${task.project._id}?task=${task._id}` : '#'} className="font-medium text-text-main hover:text-primary">
                          {task.title}
                        </Link>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                        task.priority === 'high' ? 'bg-red-100 text-red-600' :
                        task.priority === 'medium' ? 'bg-cyan-100 text-cyan-600' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {task.priority?.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-300 text-[10px] font-bold text-white flex items-center justify-center">
                           {task.assignedTo?.fullName?.charAt(0) || 'U'}
                        </div>
                        <span className="text-sm font-medium text-text-main">{task.assignedTo?.fullName || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-sm text-text-muted">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'No Due Date'}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                        task.status === 'done' ? 'text-emerald-600' :
                        task.status === 'in_progress' ? 'text-text-muted' :
                        'text-text-muted'
                      }`}>
                        {task.status === 'done' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
                        {task.status === 'in_progress' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"></path></svg>}
                        {task.status === 'todo' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                        {task.status === 'done' ? 'Done' : task.status === 'in_progress' ? 'In Progress' : 'Planned'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-text-muted">No recent tasks</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-200 text-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer">
           <span className="text-sm font-medium text-primary hover:text-primary-hover">Load More Tasks</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
