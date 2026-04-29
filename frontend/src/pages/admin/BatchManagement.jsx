import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit3, Trash2, Users, Calendar, Layers, X } from 'lucide-react';

const BatchManagement = () => {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBatch, setEditingBatch] = useState(null); // null = create mode, object = edit mode
    const [formData, setFormData] = useState({ name: '', description: '', teachers: [], status: 'Active' });
    const [teachers, setTeachers] = useState([]);
    const [formLoading, setFormLoading] = useState(false);

    const fetchBatches = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('/api/batches', {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            setBatches(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch batches', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get('/api/admin/teachers', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTeachers(data);
            } catch (error) {
                console.error('Failed to fetch teachers', error);
            }
        };

        fetchBatches();
        fetchTeachers();
    }, []);

    const openCreateModal = () => {
        setEditingBatch(null);
        setFormData({ name: '', description: '', teachers: [], status: 'Active' });
        setIsModalOpen(true);
    };

    const openEditModal = (batch) => {
        setEditingBatch(batch);
        setFormData({
            name: batch.name || '',
            description: batch.description || '',
            teachers: batch.teachers?.map(t => t._id || t) || [],
            status: batch.status || 'Active'
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingBatch(null);
        setFormData({ name: '', description: '', teachers: [], status: 'Active' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (editingBatch) {
                // Edit mode
                const { data } = await axios.put(`/api/batches/${editingBatch._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBatches(batches.map(b => b._id === editingBatch._id ? data : b));
            } else {
                // Create mode
                const { data } = await axios.post('/api/batches', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBatches([...batches, data]);
            }
            closeModal();
        } catch (error) {
            alert(editingBatch ? 'Failed to update batch' : 'Failed to create batch');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this batch?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/batches/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBatches(batches.filter(b => b._id !== id));
        } catch (error) {
            alert('Failed to delete batch');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Batches</h3>
                    <p className="text-sm text-slate-500">Manage classroom groups and study tracks</p>
                </div>
                <button 
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm hover:shadow-indigo-200"
                >
                    <Plus size={20} />
                    <span>New Batch</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="col-span-full text-center py-10 text-slate-500">Loading batches...</p>
                ) : batches.length === 0 ? (
                    <div className="col-span-full bg-white p-12 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
                            <Layers size={32} />
                        </div>
                        <h4 className="text-lg font-bold text-slate-800">No Batches Yet</h4>
                        <p className="text-slate-500 max-w-xs mt-1">Start by creating your first study batch for students.</p>
                    </div>
                ) : batches.map((batch) => (
                    <div key={batch._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                <Users size={24} />
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => openEditModal(batch)}
                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                                    title="Edit Batch"
                                >
                                    <Edit3 size={16} />
                                </button>
                                <button 
                                    onClick={() => handleDelete(batch._id)}
                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                                    title="Delete Batch"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <h4 className="text-lg font-bold text-slate-800">{batch.name}</h4>
                        <p className="text-sm text-slate-500 mt-2 line-clamp-2">{batch.description || 'No description provided.'}</p>
                        
                        <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                <Calendar size={14} />
                                <span>{batch?.createdAt ? new Date(batch.createdAt).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                {batch?.status || 'Active'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create / Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-800">
                                {editingBatch ? 'Edit Batch' : 'Create New Batch'}
                            </h3>
                            <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Batch Name</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="e.g. JEE 2026 Morning"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                                <textarea 
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none min-h-[80px]"
                                    placeholder="Brief details about the batch..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                                <select
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.status}
                                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Assign Teachers</label>
                                <select 
                                    multiple
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
                                    value={formData.teachers}
                                    onChange={(e) => {
                                        const options = [...e.target.selectedOptions].map(o => o.value);
                                        setFormData({...formData, teachers: options});
                                    }}
                                >
                                    {teachers.map(teacher => (
                                        <option key={teacher._id} value={teacher._id}>
                                            {teacher.name} ({teacher.email})
                                        </option>
                                    ))}
                                </select>
                                <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">Hold Ctrl (Cmd) to select multiple</p>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button 
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={formLoading}
                                    className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                                >
                                    {formLoading ? (
                                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                    ) : (
                                        editingBatch ? 'Save Changes' : 'Create Batch'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BatchManagement;
