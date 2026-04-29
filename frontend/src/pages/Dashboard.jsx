import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import AdminDashboard from './admin/AdminDashboard';
import TeacherDashboard from './teacher/TeacherDashboard';
import StudentDashboard from './student/StudentDashboard';
import { LayoutDashboard, LogOut } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) {
        return <div className="p-8 text-center text-gray-500">Loading user data...</div>;
    }

    // Role-based rendering
    if (user.role === 'admin') {
        return <AdminDashboard />;
    }

    if (user.role === 'teacher') {
        return <TeacherDashboard />;
    }

    if (user.role === 'student') {
        return <StudentDashboard />;
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center text-center">
            <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 max-w-lg w-full">
                <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <LayoutDashboard size={40} />
                </div>
                <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
                <p className="text-slate-500 mt-4 leading-relaxed">
                    Welcome back, <span className="text-indigo-600 font-bold">{user.name}</span>! 
                    Your <span className="capitalize font-semibold underline decoration-indigo-200">{user.role}</span> dashboard is being prepared.
                </p>
                
                <div className="mt-10 grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status</p>
                        <p className="text-lg font-bold text-indigo-600 mt-1">Active</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verified</p>
                        <p className="text-lg font-bold text-emerald-600 mt-1">{user.isVerified ? 'Yes' : 'No'}</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="mt-10 w-full py-4 px-6 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-rose-100 transition-all flex items-center justify-center gap-3"
                >
                    <LogOut size={20} />
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
