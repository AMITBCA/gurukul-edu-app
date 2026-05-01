import { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, FileText, Video, ImageIcon, Trash2, Plus, Search, Check, AlertCircle, X } from 'lucide-react';

const StudyMaterials = () => {
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState(null);

    const [newMaterial, setNewMaterial] = useState({
        title: '',
        description: '',
        fileType: 'PDF',
        file: null
    });

    useEffect(() => {
        const fetchBatches = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get('/api/teacher/batches', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBatches(data);
            } catch (error) {
                console.error('Failed to fetch batches', error);
            }
        };
        fetchBatches();
    }, []);

    const fetchMaterials = async () => {
        if (!selectedBatch) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`/api/materials/batch/${selectedBatch}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMaterials(data);
        } catch (error) {
            console.error('Failed to fetch materials', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaterials();
    }, [selectedBatch]);

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!selectedBatch) {
            alert('Please select a batch first');
            return;
        }
        
        setUploading(true);
        setMessage(null);
        
        const formData = new FormData();
        formData.append('title', newMaterial.title);
        formData.append('description', newMaterial.description);
        formData.append('batchId', selectedBatch);
        formData.append('fileType', newMaterial.fileType);
        formData.append('file', newMaterial.file);

        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/materials', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}` 
                }
            });
            setMessage({ type: 'success', text: 'Material uploaded successfully!' });
            setIsModalOpen(false);
            setNewMaterial({ title: '', description: '', fileType: 'PDF', file: null });
            fetchMaterials();
        } catch (error) {
            console.error('Upload failed', error);
            setMessage({ type: 'error', text: 'Failed to upload material.' });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this material?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/materials/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMaterials(materials.filter(m => m._id !== id));
        } catch (error) {
            alert('Failed to delete material');
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'Video': return <Video className="text-rose-500" />;
            case 'Image': return <ImageIcon className="text-amber-500" />;
            default: return <FileText className="text-indigo-500" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800">Study Materials</h3>
                    <p className="text-xs sm:text-sm text-slate-500">Manage learning resources for your students</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <select 
                        value={selectedBatch}
                        onChange={(e) => setSelectedBatch(e.target.value)}
                        className="flex-1 md:flex-none px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xs sm:text-sm font-semibold text-slate-700"
                    >
                        <option value="">Select Batch</option>
                        {batches.map(b => (
                            <option key={b._id} value={b._id}>{b.name}</option>
                        ))}
                    </select>

                    <button 
                        onClick={() => setIsModalOpen(true)}
                        disabled={!selectedBatch}
                        className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 text-xs sm:text-base"
                    >
                        <Plus size={18} />
                        <span className="whitespace-nowrap">Upload New</span>
                    </button>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 ${
                    message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                }`}>
                    {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
                    <p className="font-bold text-sm tracking-wide">{message.text}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="col-span-full text-center py-10 text-slate-500">Loading materials...</p>
                ) : !selectedBatch ? (
                    <div className="col-span-full bg-white p-12 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                         <Search size={40} className="text-slate-300 mb-4" />
                         <h4 className="text-lg font-bold text-slate-800">Please select a batch</h4>
                         <p className="text-slate-500 mt-1">Select a batch from the dropdown above to view its materials.</p>
                    </div>
                ) : materials.length === 0 ? (
                    <div className="col-span-full bg-white p-12 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                        <FileText size={40} className="text-slate-300 mb-4" />
                        <h4 className="text-lg font-bold text-slate-800">No Materials Yet</h4>
                        <p className="text-slate-500 mt-1">Start by uploading resources for this batch.</p>
                    </div>
                ) : materials.map((m) => (
                    <div key={m._id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group relative">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform">
                                {getIcon(m.fileType)}
                            </div>
                            <button 
                                onClick={() => handleDelete(m._id)}
                                className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                        <h4 className="text-lg font-bold text-slate-800 line-clamp-1">{m.title}</h4>
                        <p className="text-sm text-slate-500 mt-2 line-clamp-2 min-h-[40px]">{m.description}</p>
                        
                        <div className="mt-6 flex items-center justify-between">
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest leading-none">
                                {m.fileType}
                            </span>
                            <a 
                                href={m.fileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:underline text-sm font-bold flex items-center gap-1"
                            >
                                View File
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Upload Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                    <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Upload Material</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleFileUpload} className="p-8 space-y-5">
                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Resource Title</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all outline-none font-bold text-slate-700"
                                    placeholder="e.g. Physics Chapter 1 Notes"
                                    value={newMaterial.title}
                                    onChange={(e) => setNewMaterial({...newMaterial, title: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Description</label>
                                <textarea 
                                    className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all outline-none font-medium text-slate-700 min-h-[100px]"
                                    placeholder="What's inside this resource?"
                                    value={newMaterial.description}
                                    onChange={(e) => setNewMaterial({...newMaterial, description: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">File Type</label>
                                    <select 
                                        className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all outline-none font-bold text-slate-700 appearance-none"
                                        value={newMaterial.fileType}
                                        onChange={(e) => setNewMaterial({...newMaterial, fileType: e.target.value})}
                                    >
                                        <option value="PDF">PDF Document</option>
                                        <option value="Video">Video Lecture</option>
                                        <option value="Note">General Note</option>
                                        <option value="Image">Concept Image</option>
                                    </select>
                                </div>
                                <div className="relative">
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Select File</label>
                                    <input 
                                        type="file" 
                                        required
                                        onChange={(e) => setNewMaterial({...newMaterial, file: e.target.files[0]})}
                                        className="hidden"
                                        id="material-file"
                                    />
                                    <label 
                                        htmlFor="material-file"
                                        className="w-full px-5 py-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all font-bold text-xs text-slate-500"
                                    >
                                        {newMaterial.file ? newMaterial.file.name.substring(0, 10) + '...' : 'Choose File'}
                                    </label>
                                </div>
                            </div>
                            
                            <button 
                                type="submit"
                                disabled={uploading}
                                className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-dark-indigo hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 mt-4"
                            >
                                {uploading ? (
                                    <>
                                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Uploading...</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload size={20} />
                                        <span>Start Upload</span>
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

export default StudyMaterials;
