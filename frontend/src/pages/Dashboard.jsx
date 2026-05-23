import React, { useState, useEffect, useContext } from 'react';
import { LayoutDashboard, FolderKanban, CheckSquare, Clock } from 'lucide-react';
import dashboardService from '../services/dashboard.service';
import { ToastContext } from '../context/ToastContext';
import StatsCard from '../components/dashboard/StatsCard';
import StatusChart from '../components/dashboard/StatusChart';
import OverdueTasks from '../components/dashboard/OverdueTasks';
import Skeleton from '../components/ui/Skeleton';
import TaskCard from '../components/tasks/TaskCard';
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-80 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Projects" 
          value={stats?.totalProjects || 0} 
          icon={FolderKanban} 
          colorClass="bg-indigo-600"
        />
        <StatsCard 
          title="Total Tasks" 
          value={stats?.totalTasks || 0} 
          icon={LayoutDashboard} 
          colorClass="bg-blue-600"
        />
        <StatsCard 
          title="Completed Tasks" 
          value={stats?.completedTasks || 0} 
          icon={CheckSquare} 
          colorClass="bg-green-600"
        />
        <StatsCard 
          title="Overdue Tasks" 
          value={stats?.overdueTasks || 0} 
          icon={Clock} 
          colorClass="bg-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <StatusChart data={stats?.tasksByStatus} />
          
          {/* Recent Tasks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Recent Tasks</h3>
              <Link to="/tasks" className="text-sm font-medium text-primary hover:text-primary-hover">View All</Link>
            </div>
            
            {stats?.recentTasks?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.recentTasks.map(task => (
                  <Link to={`/projects/${task.project._id}?task=${task._id}`} key={task._id} className="block">
                    <TaskCard task={task} onClick={() => {}} />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">No recent tasks</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <OverdueTasks tasks={stats?.overdueTasks > 0 ? stats?.myTasks?.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'done') : []} />
          
          {/* My Tasks (Upcoming) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">My Assigned Tasks</h3>
            
            {stats?.myTasks?.length > 0 ? (
              <div className="space-y-3">
                {stats.myTasks.map(task => (
                  <Link to={`/projects/${task.project._id}?task=${task._id}`} key={task._id} className="block">
                    <TaskCard task={task} onClick={() => {}} />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">You have no tasks assigned to you</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
