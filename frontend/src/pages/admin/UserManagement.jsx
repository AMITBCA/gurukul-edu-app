import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, MoreVertical, Trash2, UserPlus, Shield, Loader2 } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [updatingBatchId, setUpdatingBatchId] = useState(null);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            
            const [usersRes, batchesRes] = await Promise.all([
                axios.get('/api/admin/users', { headers }),
                axios.get('/api/batches', { headers })
            ]);

            setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
            setBatches(Array.isArray(batchesRes.data) ? batchesRes.data : []);
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRoleChange = async (id, newRole) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/admin/users/${id}/role`, { role: newRole }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
        } catch (error) {
            alert('Failed to update role');
        }
    };

    const handleBatchChange = async (studentId, batchId) => {
        if (!batchId) return;
        setUpdatingBatchId(studentId);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`/api/batches/${batchId}/enroll`, { studentId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Refresh users to get updated batch info
            const { data } = await axios.get('/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(data);
        } catch (error) {
            console.error('Failed to update batch', error);
            alert('Failed to assign batch');
        } finally {
            setUpdatingBatchId(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.filter(u => u._id !== id));
        } catch (error) {
            alert('Failed to delete user');
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.put(`/api/admin/users/${id}/toggle-status`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.map(u => u._id === id ? data.user : u));
        } catch (error) {
            alert('Failed to update user status');
        }
    };

    const filteredUsers = (users || []).filter(u => {
        const matchesSearch = (u?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                             (u?.email || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || u.role === filterRole;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by name or email..." 
                        className="w-full pl-12 pr-6 py-3.5 bg-slate-50/50 border border-slate-200 rounded-[1.25rem] focus:ring-2 focus:ring-indigo-500 transition-all outline-none font-medium text-slate-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                        <Filter size={16} className="text-slate-400" />
                        <select 
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="bg-transparent focus:outline-none text-sm font-bold text-slate-600 appearance-none pr-4"
                        >
                            <option value="all">All Roles</option>
                            <option value="student">Students Only</option>
                            <option value="teacher">Teachers Only</option>
                            <option value="admin">Admins Only</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-[0.2em] font-black">
                        <tr>
                            <th className="px-8 py-5">User Identity</th>
                            <th className="px-8 py-5">System Role</th>
                            <th className="px-8 py-5">Assigned Batch</th>
                            <th className="px-8 py-5 text-center">Status</th>
                            <th className="px-8 py-5 text-right">Management</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-20">
                                <div className="flex flex-col items-center gap-3">
                                    <Loader2 className="animate-spin text-indigo-500" size={32} />
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Fetching Users...</p>
                                </div>
                            </td></tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-20 text-slate-400 font-medium">No users found matching your criteria.</td></tr>
                        ) : filteredUsers.map((u) => (
                            <tr key={u._id} className="hover:bg-indigo-50/20 transition-all group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-[1rem] bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-600 flex items-center justify-center font-black text-lg shadow-sm">
                                            {u?.name?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-800 text-base leading-tight mb-1">{u?.name || 'Unknown User'}</p>
                                            <p className="text-xs text-slate-500 font-medium tracking-tight">{u?.email || 'No email attached'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <select 
                                        value={u.role} 
                                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                        className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-black uppercase tracking-wider text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer shadow-sm hover:border-indigo-200 transition-colors"
                                    >
                                        <option value="student">Student</option>
                                        <option value="teacher">Teacher</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="px-8 py-6">
                                    {u.role === 'student' ? (
                                        <div className="relative">
                                            {updatingBatchId === u._id ? (
                                                <div className="flex items-center gap-2 text-indigo-600">
                                                    <Loader2 size={14} className="animate-spin" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Updating...</span>
                                                </div>
                                            ) : (
                                                <select 
                                                    value={u.batchId?._id || u.batchId || ''} 
                                                    onChange={(e) => handleBatchChange(u._id, e.target.value)}
                                                    className="w-full max-w-[180px] bg-indigo-50/50 border border-indigo-100 rounded-xl px-3 py-1.5 text-[11px] font-black uppercase tracking-widest text-indigo-700 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer shadow-sm hover:bg-indigo-100 transition-all"
                                                >
                                                    <option value="">No Batch Assigned</option>
                                                    {batches.map(b => (
                                                        <option key={b._id} value={b._id}>{b.name}</option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Not Applicable</span>
                                    )}
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] shadow-sm ${u.isVerified ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                        {u.isVerified ? 'Verified' : 'Pending'}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                        <button 
                                            onClick={() => handleToggleStatus(u._id)}
                                            className={`p-2.5 rounded-xl transition-all shadow-sm ${
                                                !u.isVerified 
                                                ? 'bg-amber-50 text-amber-500 hover:bg-amber-100 border border-amber-100' 
                                                : u.isActive 
                                                ? 'bg-emerald-50 text-emerald-500 hover:bg-emerald-100 border border-emerald-100' 
                                                : 'bg-rose-50 text-rose-500 hover:bg-rose-100 border border-rose-100'
                                            }`}
                                            title={!u.isVerified ? 'Verify User' : u.isActive ? 'Suspend User' : 'Activate User'}
                                        >
                                            <Shield size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(u._id)}
                                            className="p-2.5 bg-slate-50 text-slate-400 hover:bg-rose-600 hover:text-white border border-slate-100 rounded-xl transition-all shadow-sm"
                                            title="Delete User"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
