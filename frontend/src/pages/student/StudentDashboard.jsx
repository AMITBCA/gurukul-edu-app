import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { 
    LayoutDashboard, 
    CalendarCheck, 
    BookKey, 
    BarChart, 
    Settings, 
    LogOut, 
    Menu, 
    X,
    Bell,
    CreditCard,
    BookOpen
} from 'lucide-react';
import AttendanceView from './AttendanceView';
import StudyMaterialFeed from './StudyMaterialFeed';
import PerformanceAnalytics from './PerformanceAnalytics';
import FeeStatus from './FeeStatus';
import ProfileSettings from '../../components/ProfileSettings';
import axios from 'axios';
import { socket, initSocket } from '../../utils/socket';
import { motion } from 'framer-motion';

const StudentDashboard = () => {
    const { user, setUser, logout } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [fullUser, setFullUser] = useState(user);
    const [dashboardData, setDashboardData] = useState(null);
    const [loadingData, setLoadingData] = useState(true);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [userRes, dashboardRes] = await Promise.all([
                axios.get('http://localhost:5000/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://localhost:5000/api/student/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);
            setFullUser(userRes.data);
            setUser(userRes.data); // Update global context
            setDashboardData(dashboardRes.data);
        } catch (error) {
            console.error('Failed to fetch student dashboard data', error);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        fetchUserData();

        initSocket('student');
        socket.on('attendance:updated', fetchUserData);
        socket.on('material:new', fetchUserData);
        socket.on('batch:updated', fetchUserData);

        return () => {
            socket.off('attendance:updated');
            socket.off('material:new');
            socket.off('batch:updated');
        };
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const menuItems = [
        { id: 'overview', name: 'Student Hub', icon: LayoutDashboard },
        { id: 'attendance', name: 'Attendance', icon: CalendarCheck },
        { id: 'materials', name: 'Study Vault', icon: BookKey },
        { id: 'performance', name: 'My Results', icon: BarChart },
        { id: 'fees', name: 'My Fees', icon: CreditCard },
        { id: 'settings', name: 'Preferences', icon: Settings },
    ];

    const renderContent = () => {
        if (loadingData) return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="font-bold text-slate-400 uppercase tracking-widest text-sm animate-pulse">Loading Experience...</p>
                </div>
            </div>
        );

        switch (activeTab) {
            case 'attendance':
                return <AttendanceView />;
            case 'materials':
                return <StudyMaterialFeed />;
            case 'performance':
                return <PerformanceAnalytics />;
            case 'fees':
                return <FeeStatus />;
            case 'settings':
                return <ProfileSettings />;
            case 'overview':
            default:
                return (
                    <div className="space-y-8 animate-in fade-in duration-500 pt-2">
                        {/* Hero Profile Banner */}
                        <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-indigo-100/80 to-violet-100/80 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
                            
                            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2rem] bg-slate-50 p-1.5 border border-slate-200 flex-shrink-0 shadow-lg relative z-10">
                                <img 
                                    src={fullUser?.profilePicture || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=200'} 
                                    alt="Student" 
                                    className="w-full h-full rounded-[1.6rem] object-cover"
                                />
                            </div>
                            
                            <div className="text-center md:text-left relative z-10 flex-grow">
                                <h2 className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tight leading-[1.15] mb-2">
                                    Welcome home,<br/>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Future Scholar {fullUser?.name?.split(' ')[0]}</span>
                                </h2>
                                <p className="mt-2 text-slate-500 font-bold uppercase tracking-widest text-xs">
                                    Enrolled in <span className="text-slate-700 underline decoration-indigo-200 decoration-2 underline-offset-4 ml-1">Gurukul Excellence</span>
                                </p>
                                
                                <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
                                    <div className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-md">
                                        Batch: {fullUser?.batchId?.name || 'Awaiting'}
                                    </div>
                                    <div className="px-5 py-2.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm">
                                        Status: {fullUser?.batchId ? 'Super Active' : 'Pending'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Announcements / Updates */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-8 sm:p-10 rounded-[2.5rem] text-white shadow-xl shadow-indigo-600/30 flex flex-col justify-between group cursor-pointer hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4">
                                    <Bell size={120} />
                                </div>
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/30">
                                        <Bell className="animate-bounce" size={24} />
                                    </div>
                                    <h4 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">Latest Updates</h4>
                                    <p className="text-indigo-100 font-medium leading-relaxed">
                                        {dashboardData?.latestMaterial 
                                            ? `New material: "${dashboardData.latestMaterial.title}" shared by ${dashboardData.latestMaterial.teacherId?.name}.`
                                            : "No new study materials shared recently. Keep focusing on your self-study!"}
                                    </p>
                                </div>
                                <div className="mt-10 flex items-center justify-between relative z-10">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">System Notification</span>
                                    <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center font-black">!</div>
                                </div>
                            </motion.div>

                            {/* Exams / Performance */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between hover:border-indigo-100 transition-colors duration-300 group"
                            >
                                <div>
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                                        <LayoutDashboard className="text-slate-400 group-hover:text-indigo-600 transition-colors" size={24} />
                                    </div>
                                    <h4 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-800 mb-3">Exam Portal</h4>
                                    <p className="text-slate-500 font-medium leading-relaxed">
                                        {dashboardData?.latestTest 
                                            ? `A new test "${dashboardData.latestTest.testName}" is scheduled/conducted on ${new Date(dashboardData.latestTest.date).toLocaleDateString()}.`
                                            : "No upcoming tests scheduled for your batch. Use this time for thorough revision."}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => setActiveTab('performance')}
                                    className="mt-10 w-full py-4 px-6 bg-slate-900 border border-transparent text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:bg-indigo-600 hover:shadow-indigo-500/20 active:scale-[0.98] transition-all"
                                >
                                    Explore Analytics
                                </button>
                            </motion.div>
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
                            <h1 className="text-xl font-black text-white tracking-tight">Gurukul<span className="text-indigo-400 opacity-80 font-medium ml-1">Student</span></h1>
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
                    <div className="flex flex-col">
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] leading-none mb-1">Navigation /</p>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">
                            {menuItems.find(i => i.id === activeTab)?.name}
                        </h2>
                    </div>
                    
                    <div className="flex items-center gap-5">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-black text-slate-900 leading-tight">{user?.name}</p>
                            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest mt-0.5">Scholar Access</p>
                        </div>
                        <div className="relative">
                            <img 
                                src={fullUser?.profilePicture || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=150'} 
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

export default StudentDashboard;
