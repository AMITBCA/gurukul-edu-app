import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, CheckCircle2, XCircle, Clock, Percent, TrendingUp, Filter, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const AttendanceView = () => {
    const [stats, setStats] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [statsRes, historyRes] = await Promise.all([
                    axios.get('/api/attendance/stats', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('/api/attendance/me', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setStats(statsRes.data);
                setHistory(historyRes.data);
            } catch (error) {
                console.error('Failed to fetch attendance', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAttendanceData();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium animate-pulse">Loading Attendance Profile...</p>
        </div>
    );

    const getAttendanceStatusBadge = (status) => {
        if (status === 'Present') {
            return (
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 shadow-sm">
                    <CheckCircle2 size={14} className="text-emerald-500" /> Present
                </span>
            );
        } else if (status === 'Absent') {
            return (
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-600 bg-rose-50 border border-rose-100 shadow-sm animate-pulse">
                    <XCircle size={14} className="text-rose-500" /> Absent
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-100 shadow-sm">
                    <Clock size={14} className="text-amber-500" /> Late
                </span>
            );
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
        >
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500 opacity-20 rounded-full blur-3xl -ml-20 -mt-20 group-hover:bg-indigo-400 transition-colors duration-700"></div>
                
                <div className="relative z-10 w-full mb-4 md:mb-0">
                    <div className="flex items-center gap-3 text-indigo-300 mb-2">
                        <Calendar size={20} />
                        <span className="text-xs font-black uppercase tracking-widest">Attendance Core</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
                        My Attendance
                    </h2>
                    <p className="text-slate-400 text-sm mt-3 font-medium max-w-md">Maintain a streak and never miss an important lecture. Keep your attendance above 85%.</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className={`bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 relative overflow-hidden flex flex-col justify-between min-h-[160px] ${stats?.percentage < 75 ? 'border-rose-100 bg-rose-50/20' : ''}`}
                >
                    <div className="absolute -right-4 -top-4 p-8 opacity-5">
                        <Percent className="w-24 h-24 text-indigo-900" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none flex items-center gap-1.5">
                            <Sparkles size={12} className={stats?.percentage >= 90 ? 'text-amber-400' : 'text-slate-300'} /> Overall Score
                        </p>
                        <p className={`text-5xl font-black tracking-tighter mt-4 ${stats?.percentage < 75 ? 'text-rose-600' : 'text-indigo-600'}`}>
                            {stats?.percentage}%
                        </p>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-4 shadow-inner">
                        <div 
                            className={`h-full transition-all duration-1000 ease-out ${stats?.percentage < 75 ? 'bg-rose-500' : 'bg-indigo-600'}`} 
                            style={{ width: `${stats?.percentage}%` }}
                        />
                    </div>
                </motion.div>

                <motion.div 
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex flex-col justify-between min-h-[160px]"
                >
                    <div>
                        <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                            <CheckCircle2 size={24} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Days Present</p>
                    </div>
                    <p className="text-4xl font-black text-slate-800 tracking-tight">{stats?.presentDays}</p>
                </motion.div>

                <motion.div 
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex flex-col justify-between min-h-[160px]"
                >
                    <div>
                        <div className="w-12 h-12 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                            <XCircle size={24} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Days Absent</p>
                    </div>
                    <p className="text-4xl font-black text-slate-800 tracking-tight">{stats?.absentDays}</p>
                </motion.div>

                <motion.div 
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex flex-col justify-between min-h-[160px]"
                >
                    <div>
                        <div className="w-12 h-12 bg-amber-50 border border-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                            <Clock size={24} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Days Late</p>
                    </div>
                    <p className="text-4xl font-black text-slate-800 tracking-tight">{stats?.lateDays}</p>
                </motion.div>
            </div>

            {/* History Table */}
            <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <TrendingUp className="text-indigo-500" size={24} />
                        Timeline History
                    </h3>
                    <div className="hidden sm:flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest shadow-sm">
                        <Filter size={14} /> Filter logs
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <th className="px-8 py-5">Session Date / Info</th>
                                <th className="px-8 py-5 text-center">Batch Group</th>
                                <th className="px-8 py-5 text-right">Verification Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 border-t border-slate-50">
                            {history.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-8 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <Calendar size={48} className="mb-4 opacity-20" />
                                            <p className="text-xl font-bold text-slate-800">No records found</p>
                                            <p className="text-sm font-medium mt-1">Your attendance timeline is currently empty.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : history.map((record, index) => (
                                <motion.tr 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    key={record._id} 
                                    className="hover:bg-indigo-50/30 transition-colors group relative"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-slate-500 group-hover:bg-white group-hover:border-indigo-100 group-hover:text-indigo-600 transition-colors shadow-sm">
                                                <span className="text-xs font-black uppercase leading-none">{new Date(record.date).toLocaleDateString('en-GB', { month: 'short' })}</span>
                                                <span className="text-lg font-black leading-none mt-0.5">{new Date(record.date).getDate()}</span>
                                            </div>
                                            <div>
                                                <span className="font-bold text-slate-800 block text-lg">{new Date(record.date).toLocaleDateString('en-GB', { weekday: 'long' })}</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Regular Session</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center align-middle">
                                        <span className="inline-block text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl uppercase tracking-widest shadow-sm">
                                            {record.batchId?.name}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right align-middle">
                                        {getAttendanceStatusBadge(record.status)}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default AttendanceView;
