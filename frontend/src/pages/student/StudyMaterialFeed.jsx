import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { Download, FileText, Video, ImageIcon, BookOpen, ExternalLink, Search } from 'lucide-react';

const StudyMaterialFeed = () => {
    const { user } = useContext(AuthContext);
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const token = localStorage.getItem('token');
                if (user?.batchId) {
                    const batchId = typeof user.batchId === 'object' ? user.batchId._id : user.batchId;
                    const { data } = await axios.get(`/api/materials/batch/${batchId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setMaterials(data);
                }
            } catch (error) {
                console.error('Failed to fetch materials', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMaterials();
    }, [user?.batchId]);

    const filteredMaterials = materials.filter(m => 
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getIcon = (type) => {
        switch (type) {
            case 'Video': return <Video className="text-rose-500" />;
            case 'Image': return <ImageIcon className="text-amber-500" />;
            default: return <FileText className="text-indigo-500" />;
        }
    };

    if (loading) return <div className="text-center py-10 font-bold text-slate-400">Opening your study vault...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tighter">Study Resources</h3>
                    <p className="text-sm font-bold text-slate-400 mt-1">Access your notes, lectures and files</p>
                </div>
                
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search for materials..."
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-[24px] focus:border-indigo-500 focus:bg-white transition-all outline-none font-bold text-slate-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {filteredMaterials.length === 0 ? (
                <div className="bg-white p-20 rounded-[48px] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center text-slate-200 mb-6">
                        <BookOpen size={48} />
                    </div>
                    <h4 className="text-2xl font-black text-slate-800 tracking-tight">No materials found</h4>
                    <p className="text-slate-400 mt-2 max-w-sm font-medium">Wait for your teachers to upload resources for your current batch.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredMaterials.map((m) => (
                        <div key={m._id} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-slate-50 rounded-[20px] group-hover:bg-indigo-50 transition-colors">
                                    {getIcon(m.fileType)}
                                </div>
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg">
                                    {m.fileType}
                                </span>
                            </div>
                            
                            <h4 className="text-xl font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{m.title}</h4>
                            <p className="text-sm text-slate-500 mt-3 font-medium line-clamp-2 min-h-[40px]">{m.description}</p>
                            
                            <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Shared by {m.teacherId?.name}
                                </span>
                                <a 
                                    href={m.fileUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                                >
                                    <Download size={20} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudyMaterialFeed;
