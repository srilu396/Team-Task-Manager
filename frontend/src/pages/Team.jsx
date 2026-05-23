import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import userService from '../services/user.service';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import { Shield, ShieldAlert, AlertCircle } from 'lucide-react';

const Team = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      showToast('Failed to load team members', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = async (userId, currentRole) => {
    if (userId === currentUser.id) {
      showToast('You cannot change your own role', 'error');
      return;
    }

    const newRole = currentRole === 'admin' ? 'member' : 'admin';
    const confirmMessage = currentRole === 'admin' 
      ? 'Are you sure you want to demote this admin to a member?'
      : 'Are you sure you want to promote this member to an admin?';

    if (!window.confirm(confirmMessage)) return;

    try {
      await userService.updateRole(userId, newRole);
      showToast('Role updated successfully', 'success');
      fetchUsers();
    } catch (error) {
      showToast('Failed to update role', 'error');
    }
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle size={48} className="text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-500">Only administrators can view the Team page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-500 mt-1">Manage system access and roles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center">
              <Skeleton className="w-20 h-20 rounded-full mb-4" />
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48 mb-4" />
              <Skeleton className="h-8 w-24 rounded-full mt-auto" />
            </div>
          ))
        ) : (
          users.map(u => (
            <div key={u._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <Avatar name={u.fullName} size="xl" className="mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{u.fullName}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-1">{u.email}</p>
              
              <div className="mt-auto flex flex-col items-center gap-3 w-full">
                <Badge color={u.role === 'admin' ? 'indigo' : 'gray'} className="px-3 py-1 text-xs">
                  {u.role.toUpperCase()}
                </Badge>
                
                {u._id !== currentUser.id && (
                  <button
                    onClick={() => handleRoleToggle(u._id, u.role)}
                    className={`flex items-center justify-center w-full gap-2 px-4 py-2 mt-2 text-sm font-medium rounded-lg transition-colors ${
                      u.role === 'admin' 
                        ? 'text-red-600 bg-red-50 hover:bg-red-100'
                        : 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
                    }`}
                  >
                    {u.role === 'admin' ? (
                      <><ShieldAlert size={16} /> Demote to Member</>
                    ) : (
                      <><Shield size={16} /> Promote to Admin</>
                    )}
                  </button>
                )}
                
                {u._id === currentUser.id && (
                  <div className="w-full px-4 py-2 mt-2 text-sm text-gray-400 bg-gray-50 rounded-lg">
                    Current User
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Team;
