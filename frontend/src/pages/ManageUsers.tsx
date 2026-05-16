import { useState, useEffect } from 'react';
import api from '../services/api';
import type { User } from '../types';
import { Trash2, Mail, Shield, ShieldCheck, Search, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: string) => {
    if (id === currentUser?._id) return;

    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user.');
      }
    }
  };

  const handleRoleChange = async (id: string, newRole: 'admin' | 'sales') => {
    if (id === currentUser?._id) return;

    try {
      await api.patch(`/users/${id}/role`, { role: newRole });
      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update role.');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">User Management</h2>
          <p className="text-muted-foreground mt-1">Manage platform users and their permissions.</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-background rounded-2xl shadow-sm border border-muted overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-muted/30 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <th className="px-6 py-5">User Details</th>
              <th className="px-6 py-5">Role</th>
              <th className="px-6 py-5">Member Since</th>
              <th className="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-muted">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {[...Array(4)].map((_, j) => (
                    <td key={j} className="px-6 py-6">
                      <div className="h-5 bg-muted rounded w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center text-muted-foreground">
                  <div className="flex flex-col items-center">
                    <Users size={48} className="mb-4 opacity-20" />
                    <p className="text-lg">No users found matching your search.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-muted/20 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm mr-4 group-hover:scale-110 transition-transform">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{u.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center mt-0.5">
                          <Mail size={12} className="mr-1.5 opacity-70" />
                          {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={clsx(
                      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold",
                      u.role === 'admin' 
                        ? "bg-primary/10 text-primary" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      {u.role === 'admin' ? <ShieldCheck size={12} className="mr-1" /> : <Shield size={12} className="mr-1" />}
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-muted-foreground">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value as any)}
                        disabled={u._id === currentUser?._id}
                        className="text-xs bg-background border border-muted rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
                      >
                        <option value="sales">Make Sales</option>
                        <option value="admin">Make Admin</option>
                      </select>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        disabled={u._id === currentUser?._id}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all disabled:opacity-30"
                        title="Delete user"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="bg-background rounded-2xl p-6 border border-muted animate-pulse h-40"></div>
          ))
        ) : filteredUsers.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-background rounded-2xl border border-muted">
            No users found matching your search.
          </div>
        ) : (
          filteredUsers.map((u) => (
            <div key={u._id} className="bg-background rounded-2xl p-6 border border-muted shadow-sm hover:border-primary/30 transition-all flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{u.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                      <Mail size={12} className="mr-1.5" />
                      {u.email}
                    </p>
                  </div>
                </div>
                <div className={clsx(
                  "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  u.role === 'admin' 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "bg-muted text-muted-foreground border border-muted"
                )}>
                  {u.role}
                </div>
              </div>
              
              <div className="pt-4 border-t border-muted flex items-center justify-between mt-auto">
                <div className="text-[10px] text-muted-foreground">
                  Since {new Date(u.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value as any)}
                    disabled={u._id === currentUser?._id}
                    className="text-[10px] bg-background border border-muted rounded-lg px-2 py-1 focus:outline-none disabled:opacity-50"
                  >
                    <option value="sales">Sales</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    onClick={() => handleDeleteUser(u._id)}
                    disabled={u._id === currentUser?._id}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-30"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
