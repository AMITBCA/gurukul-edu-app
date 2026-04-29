import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { 
    LayoutDashboard, 
    ClipboardCheck, 
    BookOpen, 
    FileText, 
    Settings, 
    LogOut, 
    Menu, 
    X,
    AlertCircle
} from 'lucide-react';
import AttendanceMarking from './AttendanceMarking';
import StudyMaterials from './StudyMaterials';
import TestManagement from './TestManagement';
import ProfileSettings from '../../components/ProfileSettings';
import { socket, initSocket } from '../../utils/socket';
import { motion } from 'framer-motion';

const TeacherDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [batches, setBatches] = useState([]);
    const [stats, setStats] = useState({
        batchCount: 0,
        studentCount: 0,
        materialCount: 0,
        testCount: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const API_BASE = 'http://localhost:5000';

            const [statsRes, batchesRes] = await Promise.all([
                axios.get(`${API_BASE}/api/teacher/stats`, { headers }),
                axios.get(`${API_BASE}/api/teacher/batches`, { headers })
            ]);

            setStats(statsRes.data);
            setBatches(batchesRes.data);
        } catch (err) {
            console.error('Failed to fetch teacher data', err);
            setError('Failed to load dashboard data. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        initSocket('teacher');
        socket.on('attendance:updated', fetchData);
        socket.on('batch:updated', fetchData);
        socket.on('material:new', fetchData);

        return () => {
            socket.off('attendance:updated');
            socket.off('batch:updated');
            socket.off('material:new');
        };
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const menuItems = [
        { id: 'overview', name: 'Overview', icon: LayoutDashboard },
        { id: 'attendance', name: 'Attendance', icon: ClipboardCheck },
        { id: 'materials', name: 'Study Materials', icon: BookOpen },
        { id: 'tests', name: 'Test Management', icon: FileText },
        { id: 'settings', name: 'Settings', icon: Settings },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'attendance':
                return <AttendanceMarking />;
            case 'materials':
                return <StudyMaterials />;
            case 'tests':
                return <TestManagement />;
            case 'settings':
                return <ProfileSettings />;
            case 'overview':
            default:
                return (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        {/* Welcome Banner */}
                        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
                            
                            <div className="relative z-10 w-full">
                                <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-3">
                                    Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Professor {user?.name.split(' ')[0]}</span>!
                                </h2>
                                <p className="text-slate-500 font-semibold text-sm">Manage your students, upload resources, and track progress for today.</p>
                            </div>
                        </div>
                        
                        {error && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-center gap-3 text-rose-600 font-bold shadow-sm">
                                <AlertCircle size={20} />
                                <p>{error}</p>
                            </motion.div>
                        )}

                        {/* Stat Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'My Batches', value: stats.batchCount, gradient: 'from-indigo-500 to-indigo-600', icon: LayoutDashboard },
                                { label: 'Active Students', value: stats.studentCount, gradient: 'from-emerald-500 to-teal-500', icon: ClipboardCheck },
                                { label: 'Materials Uploaded', value: stats.materialCount, gradient: 'from-amber-400 to-orange-500', icon: BookOpen },
                                { label: 'Tests Conducted', value: stats.testCount, gradient: 'from-rose-500 to-pink-600', icon: FileText },
                            ].map((stat, i) => (
                                <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between h-44"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                        <stat.icon size={80} className="text-slate-900" />
                                    </div>
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                    <p className="text-4xl font-black text-slate-800 tracking-tight mt-auto">{stat.value}</p>
                                    <div className={`absolute bottom-0 left-0 h-1.5 w-0 bg-gradient-to-r ${stat.gradient} group-hover:w-full transition-all duration-500`}></div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Batches Section */}
                        <div className="pt-6">
                            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                                <span className="w-1.5 h-8 bg-indigo-600 rounded-full inline-block"></span>
                                My Assigned Batches
                            </h3>
                            
                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-56 bg-slate-200/50 rounded-[2rem] animate-pulse"></div>
                                    ))}
                                </div>
                            ) : batches.length === 0 ? (
                                <div className="bg-white p-12 rounded-[2rem] border-2 border-dashed border-slate-200 text-center shadow-sm">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <BookOpen className="text-slate-300" size={32} />
                                    </div>
                                    <p className="text-slate-500 font-bold text-lg">No batches assigned to you yet.</p>
                                    <p className="text-slate-400 text-sm mt-1">Please contact the administration.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {batches.map((batch) => (
                                        <motion.div 
                                            key={batch._id} 
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:shadow-indigo-500/15 hover:-translate-y-1 transition-all duration-300 group flex flex-col"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${batch.status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}>
                                                    {batch.status}
                                                </span>
                                                <div className="p-2 bg-indigo-50 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors text-indigo-400">
                                                    <BookOpen size={20} />
                                                </div>
                                            </div>
                                            
                                            <h4 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight leading-tight mb-2">{batch.name}</h4>
                                            <p className="text-slate-500 text-sm mb-6 flex-grow overflow-hidden line-clamp-2 leading-relaxed">{batch.description}</p>
                                            
                                            <div className="mt-auto border-t border-slate-100 pt-6 flex items-center justify-between">
                                                <div className="flex -space-x-2">
                                                    {batch.students.slice(0, 4).map((s, i) => (
                                                        <div key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600 shadow-sm">
                                                            {s.name.charAt(0)}
                                                        </div>
                                                    ))}
                                                    {batch.students.length > 4 && (
                                                        <div className="w-8 h-8 rounded-full bg-indigo-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-600 shadow-sm">
                                                            +{batch.students.length - 4}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => setActiveTab('attendance')}
                                                        className="p-2.5 bg-slate-50 hover:bg-indigo-600 hover:text-white rounded-xl transition-all text-slate-500 tooltip-trigger"
                                                        title="Mark Attendance"
                                                    >
                                                        <ClipboardCheck size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => setActiveTab('materials')}
                                                        className="p-2.5 bg-slate-50 hover:bg-violet-600 hover:text-white rounded-xl transition-all text-slate-500 tooltip-trigger"
                                                        title="Upload Material"
                                                    >
                                                        <FileText size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="h-screen w-full bg-slate-50 flex overflow-hidden font-sans selection:bg-indigo-200">
            {/* Dark Sidebar */}
            <aside className={`${isSidebarOpen ? 'w-72' : 'w-24'} bg-slate-950 border-r border-slate-800 transition-all duration-300 flex flex-col relative z-30 shadow-2xl shadow-indigo-900/20`}>
                <div className="p-6 flex items-center justify-between border-b border-slate-800/50">
                    {isSidebarOpen ? (
                        <div className="flex items-center space-x-2">
                            <BookOpen size={28} className="text-indigo-500" />
                            <h1 className="text-xl font-black text-white tracking-tight">Gurukul<span className="text-indigo-400 opacity-80 font-medium ml-1">Portal</span></h1>
                        </div>
                    ) : (
                        <div className="w-full flex justify-center">
                            <BookOpen size={28} className="text-indigo-500" />
                        </div>
                    )}
                    <button onClick={toggleSidebar} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors absolute -right-4 top-7 bg-slate-900 border border-slate-700 shadow-md">
                        {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar py-6">
                    <nav className="px-4 space-y-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center p-3.5 rounded-2xl transition-all duration-200 group relative ${
                                    activeTab === item.id 
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold' 
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white font-medium'
                                }`}
                            >
                                <div className={`flex items-center justify-center ${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`}>
                                    <item.icon size={22} className={!isSidebarOpen ? 'mx-auto' : ''} />
                                </div>
                                {isSidebarOpen && <span className="ml-4 tracking-wide">{item.name}</span>}
                                {activeTab === item.id && isSidebarOpen && (
                                    <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white"></div>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-4 mt-auto border-t border-slate-800/50">
                    <button 
                        onClick={logout}
                        className="w-full flex items-center p-3.5 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-2xl transition-all group font-bold"
                    >
                        <div className="flex justify-center w-6">
                            <LogOut size={22} className="group-hover:scale-110 transition-transform" />
                        </div>
                        {isSidebarOpen && <span className="ml-4 tracking-wide">Log Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 relative custom-scrollbar">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-[120px] pointer-events-none"></div>

                {/* Glassmorphic Header */}
                <header className="bg-white/70 backdrop-blur-xl border-b border-indigo-100/50 p-4 px-8 flex justify-between items-center sticky top-0 z-20 shadow-sm">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                        {menuItems.find(i => i.id === activeTab)?.name}
                    </h2>
                    <div className="flex items-center space-x-5">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-black text-slate-900 leading-tight">{user?.name}</p>
                            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">Professor</p>
                        </div>
                        <div className="relative">
                            <img 
                                src={user?.profilePicture || 'https://images.unsplash.com/photo-1544717297-fa95b3ee51f3?auto=format&fit=crop&q=80&w=150'} 
                                alt="Profile" 
                                className="w-11 h-11 rounded-2xl border-2 border-indigo-100 shadow-md object-cover"
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                        </div>
                    </div>
                </header>

                <div className="p-6 lg:p-10 max-w-7xl mx-auto relative z-10">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default TeacherDashboard;
