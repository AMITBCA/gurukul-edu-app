import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { 
    Users, 
    Layers, 
    Settings, 
    LogOut, 
    Menu, 
    X,
    LayoutDashboard,
    GraduationCap,
    ClipboardList,
    CreditCard,
    ArrowRight,
    Activity,
    BookOpen
} from 'lucide-react';
import UserManagement from './UserManagement';
import BatchManagement from './BatchManagement';
import TeacherManagement from './TeacherManagement';
import AttendanceLogs from './AttendanceLogs';
import FeeManagement from './FeeManagement';
import AnalyticsDashboard from './AnalyticsDashboard';
import ProfileSettings from '../../components/ProfileSettings';
import axios from 'axios';
import { socket, initSocket } from '../../utils/socket';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [stats, setStats] = useState({
        studentCount: 0,
        teacherCount: 0,
        batchCount: 0,
        pendingTeachers: 0
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('http://localhost:5000/api/admin/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch admin stats', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();

        // Initialize Socket
        initSocket('admin');

        // Listen for real-time updates
        socket.on('attendance:updated', fetchStats);
        socket.on('batch:updated', fetchStats);
        socket.on('material:new', fetchStats);

        return () => {
            socket.off('attendance:updated');
            socket.off('batch:updated');
            socket.off('material:new');
        };
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const menuItems = [
        { id: 'overview', name: 'Overview', icon: LayoutDashboard },
        { id: 'users', name: 'User Management', icon: Users },
        { id: 'batches', name: 'Batch Management', icon: Layers },
        { id: 'teachers', name: 'Teachers', icon: GraduationCap },
        { id: 'attendance', name: 'Attendance Logs', icon: ClipboardList },
        { id: 'fees', name: 'Fee Management', icon: CreditCard },
        { id: 'analytics', name: 'Analytics', icon: Activity },
        { id: 'settings', name: 'Settings', icon: Settings },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'users':
                return <UserManagement />;
            case 'batches':
                return <BatchManagement />;
            case 'teachers':
                return <TeacherManagement />;
            case 'attendance':
                return <AttendanceLogs />;
            case 'fees':
                return <FeeManagement />;
            case 'analytics':
                return <AnalyticsDashboard />;
            case 'settings':
                return <ProfileSettings />;
            case 'overview':
            default:
                return (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        {/* Header Banner */}
                        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-white/60 relative overflow-hidden flex items-center justify-between">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                            <div className="relative z-10">
                                <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-2">
                                    Institute <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Overview</span>
                                </h2>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">Real-time management portal</p>
                            </div>
                            <div className="relative z-10 flex gap-2 items-end h-8">
                                <motion.span animate={{ height: ["100%", "40%", "100%"] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1.5 bg-indigo-600 rounded-full"></motion.span>
                                <motion.span animate={{ height: ["40%", "100%", "40%"] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} className="w-1.5 bg-violet-500 rounded-full"></motion.span>
                                <motion.span animate={{ height: ["70%", "30%", "70%"] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} className="w-1.5 bg-indigo-300 rounded-full"></motion.span>
                            </div>
                        </div>

                        {/* Stat Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Students', value: stats.studentCount, gradient: 'from-indigo-500 to-indigo-600', icon: Users },
                                { label: 'Active Batches', value: stats.batchCount, gradient: 'from-emerald-500 to-teal-600', icon: Layers },
                                { label: 'Total Teachers', value: stats.teacherCount, gradient: 'from-violet-500 to-purple-600', icon: GraduationCap },
                                { label: 'Pending Approvals', value: stats.pendingTeachers, gradient: 'from-rose-500 to-pink-600', icon: ClipboardList },
                            ].map((stat, i) => (
                                <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between h-48"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                        <stat.icon size={100} className="text-slate-900" />
                                    </div>
                                    <div>
                                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg shadow-current/20 mb-4`}>
                                            <stat.icon size={24} className="text-white" />
                                        </div>
                                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                    </div>
                                    <div className="flex items-end justify-between mt-2">
                                        <p className="text-4xl font-black text-slate-800 tracking-tight">{stat.value}</p>
                                        <ArrowRight className="text-indigo-500 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 bg-indigo-50 p-1.5 rounded-full" size={28} />
                                    </div>
                                    <div className={`absolute bottom-0 left-0 h-1.5 w-0 bg-gradient-to-r ${stat.gradient} group-hover:w-full transition-all duration-500`}></div>
                                </motion.div>
                            ))}
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
                            <h1 className="text-xl font-black text-white tracking-tight">Admin<span className="text-indigo-400 opacity-80 font-medium">Panel</span></h1>
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
                        {isSidebarOpen && <span className="ml-4">Log Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 relative custom-scrollbar">
                {/* Global soft background accents */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-[120px] pointer-events-none"></div>

                {/* Glassmorphic Header */}
                <header className="bg-white/70 backdrop-blur-xl border-b border-indigo-100/50 p-4 px-8 flex justify-between items-center sticky top-0 z-20 shadow-sm">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                        {menuItems.find(i => i.id === activeTab)?.name}
                    </h2>
                    <div className="flex items-center space-x-5">
                        <div className="text-right">
                            <p className="text-sm font-black text-slate-900 leading-tight">{user?.name || 'Administrator'}</p>
                            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">{user?.role || 'Admin'}</p>
                        </div>
                        <div className="relative">
                            <img 
                                src={user?.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'} 
                                alt="Profile" 
                                className="w-11 h-11 rounded-2xl border-2 border-indigo-100 shadow-md object-cover"
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                        </div>
                    </div>
                </header>

                {/* Content Container */}
                <div className="p-6 lg:p-10 relative z-10">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
