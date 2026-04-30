import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, GraduationCap, Mail, Lock, User, Trash2, CheckCircle, AlertCircle, X, Search } from 'lucide-react';

const TeacherManagement = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [formLoading, setFormLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const API_BASE = '';

    const fetchTeachers = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${API_BASE}/api/admin/teachers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTeachers(data);
        } catch (error) {
            console.error('Failed to fetch teachers', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setMessage(null);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE}/api/admin/teachers`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ type: 'success', text: 'Teacher account created successfully!' });
            setFormData({ name: '', email: '', password: '' });
            setIsModalOpen(false);
            fetchTeachers();
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Failed to create teacher account.' 
            });
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this teacher?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE}/api/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTeachers();
        } catch (error) {
            alert('Failed to delete teacher');
        }
    };

    const toggleStatus = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE}/api/admin/teachers/${id}/status`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTeachers();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const filteredTeachers = teachers.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div>
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <GraduationCap className="text-indigo-600" />
                        Teacher Management
                    </h3>
                    <p className="text-sm text-slate-500">Add and manage institute faculty</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search teachers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                        />
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-100"
                    >
                        <Plus size={20} />
                        <span>Add Teacher</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                    <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Loading teacher records...</p>
                </div>
            ) : filteredTeachers.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <GraduationCap size={48} className="text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold text-lg">No teachers found</p>
                    <p className="text-slate-400 mt-1">Add your first teacher to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTeachers.map((teacher) => (
                        <div key={teacher._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl">
                                    {teacher.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg leading-tight">{teacher.name}</h4>
                                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                        <Mail size={14} /> {teacher.email}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-2">
                                    <span className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${teacher.isVerified ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                        {teacher.isVerified ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
                                        {teacher.isVerified ? 'Verified' : 'Pending'}
                                    </span>
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${teacher.isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'}`}>
                                        {teacher.isActive ? 'Active' : 'Suspended'}
                                    </span>
                                </div>
                                <div className="flex gap-2 relative z-10">
                                    <button 
                                        onClick={() => toggleStatus(teacher._id)}
                                        className={`p-2 rounded-lg transition-all ${
                                            teacher.isActive 
                                            ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50' 
                                            : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white'
                                        }`}
                                        title={teacher.isActive ? 'Suspend Teacher' : 'Approve/Activate Teacher'}
                                    >
                                        <CheckCircle size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(teacher._id)}
                                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                        title="Remove Teacher"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            
                            {/* Decorative Background Icon */}
                            <GraduationCap className="absolute -bottom-6 -right-6 text-slate-50 w-32 h-32 transform -rotate-12 group-hover:text-indigo-50 transition-colors pointer-events-none" />
                        </div>
                    ))}
                </div>
            )}

            {/* Add Teacher Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic">Add Teacher</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Create faculty credentials</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {message && (
                                <div className={`p-4 rounded-2xl flex items-center gap-3 ${
                                    message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                                }`}>
                                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                    <p className="font-bold text-sm">{message.text}</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                    <input 
                                        type="text" 
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all outline-none font-bold text-slate-700"
                                        placeholder="Dr. Rajesh Kumar"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                    <input 
                                        type="email" 
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all outline-none font-bold text-slate-700"
                                        placeholder="rajesh.kumar@gurukul.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Temporary Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                    <input 
                                        type="password" 
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all outline-none font-bold text-slate-700"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={formLoading}
                                className="w-full py-4.5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all text-sm uppercase tracking-widest mt-4 flex items-center justify-center gap-2"
                            >
                                {formLoading ? (
                                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                                ) : (
                                    <>
                                        <Plus size={20} />
                                        <span>Create Teacher Account</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherManagement;
