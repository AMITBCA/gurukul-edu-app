import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Search, Filter, ClipboardList, CheckCircle2, XCircle, Clock, Users, CalendarDays } from 'lucide-react';

const AttendanceLogs = () => {
    const [logs, setLogs] = useState([]);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [batchFilter, setBatchFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [logsRes, batchRes] = await Promise.all([
                axios.get('http://localhost:5000/api/attendance/all', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:5000/api/batches', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            
            setLogs(logsRes.data || []);
            setBatches(batchRes.data.data || batchRes.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch data', error);
            setLoading(false);
        }
    };

    const filteredLogs = logs.filter(log => {
        const studentObj = log.studentId;
        const batchObj = log.batchId;
        
        // Search condition
        const search = searchTerm.toLowerCase();
        let matchesSearch = true;
        if (search) {
            const nameMatch = studentObj?.name?.toLowerCase().includes(search) || false;
            const enrollMatch = studentObj?.enrollmentNumber?.toLowerCase().includes(search) || false;
            matchesSearch = nameMatch || enrollMatch || ('unknown'.includes(search) && !studentObj);
        }

        // Batch condition
        const matchesBatch = batchFilter ? (batchObj?._id === batchFilter) : true;
        
        // Status condition
        const matchesStatus = statusFilter ? (log.status?.toLowerCase() === statusFilter.toLowerCase()) : true;
        
        // Date condition (YYYY-MM-DD compare)
        let matchesDate = true;
        if (dateFilter) {
            const logDate = new Date(log.date).toISOString().split('T')[0];
            matchesDate = logDate === dateFilter;
        }

        return matchesSearch && matchesBatch && matchesStatus && matchesDate;
    });

    const getStatusBadge = (status) => {
        switch(status?.toLowerCase()) {
            case 'present': return <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-100/80 text-emerald-700 flex items-center justify-center gap-1.5 w-max"><CheckCircle2 size={14}/> Present</span>;
            case 'absent': return <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-rose-100/80 text-rose-700 flex items-center justify-center gap-1.5 w-max"><XCircle size={14}/> Absent</span>;
            case 'late': return <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-amber-100/80 text-amber-700 flex items-center justify-center gap-1.5 w-max"><Clock size={14}/> Late</span>;
            default: return <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-100/80 text-slate-700 flex items-center justify-center gap-1.5 w-max">{status}</span>;
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium animate-pulse">Loading Attendance Records...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-gradient-to-r from-slate-900 to-indigo-900 p-8 rounded-[40px] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                
                <div className="relative z-10 w-full">
                    <div className="flex items-center gap-3 text-indigo-200 mb-2">
                        <ClipboardList size={20} />
                        <span className="text-xs font-black uppercase tracking-widest">Monitoring Hub</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
                        Attendance Logs
                    </h2>
                    <p className="text-indigo-200/80 text-sm mt-2 font-medium max-w-xl">
                        Monitor daily presence, analyze student attendance, and track batch-wise engagement with advanced filtering.
                    </p>
                </div>
            </div>

            {/* Filter Hub */}
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <Filter size={18} className="text-indigo-500" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-700">Refine Results</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search Filter */}
                    <div className="relative z-10">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Student Search</label>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                type="text"
                                placeholder="Name or enrollment..."
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-400 outline-none transition-all font-semibold text-sm text-slate-700 placeholder:text-slate-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Date Filter */}
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Specific Date</label>
                        <div className="relative">
                            <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                type="date"
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-400 outline-none transition-all font-semibold text-sm text-slate-700"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Batch Filter */}
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Target Batch</label>
                        <div className="relative">
                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <select 
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-400 outline-none transition-all font-semibold text-sm text-slate-700 appearance-none"
                                value={batchFilter}
                                onChange={(e) => setBatchFilter(e.target.value)}
                            >
                                <option value="">All Batches</option>
                                {batches.map(b => (
                                    <option key={b._id} value={b._id}>{b.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Attendance Status</label>
                        <div className="relative">
                            <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <select 
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-400 outline-none transition-all font-semibold text-sm text-slate-700 appearance-none"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">All Statuses</option>
                                <option value="Present">Present</option>
                                <option value="Absent">Absent</option>
                                <option value="Late">Late</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Table Area */}
            <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <Calendar size={20} className="text-indigo-500" />
                        Log Records
                        <span className="ml-2 px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-700 text-[10px] font-black">
                            {filteredLogs.length} FOUND
                        </span>
                    </h3>
                    {(searchTerm || dateFilter || batchFilter || statusFilter) && (
                        <button 
                            onClick={() => { setSearchTerm(''); setDateFilter(''); setBatchFilter(''); setStatusFilter(''); }}
                            className="text-xs font-black uppercase tracking-widest text-rose-500 hover:text-rose-700 transition-colors"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                                <th className="p-5 pl-8">Date</th>
                                <th className="p-5">Student Identity</th>
                                <th className="p-5">Associated Batch</th>
                                <th className="p-5 pr-8 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredLogs.map(log => (
                                <tr key={log._id} className="hover:bg-indigo-50/30 transition-colors group">
                                    <td className="p-5 pl-8">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-0.5">
                                                {new Date(log.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                            </span>
                                            <span className="text-xl font-black text-slate-800 leading-none">
                                                {new Date(log.date).getDate()}
                                                <sup className="text-[10px] ml-0.5 text-slate-400">
                                                    {['th','st','nd','rd'][((new Date(log.date).getDate())%10>3?0:(new Date(log.date).getDate())%100-20)%10] || 'th'}
                                                </sup>
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <img 
                                                src={log.studentId?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(log.studentId?.name || 'S')}&background=e0e7ff&color=4f46e5`} 
                                                alt="avatar" 
                                                className="w-10 h-10 rounded-xl"
                                            />
                                            <div>
                                                <p className="font-bold text-slate-800 leading-tight">{log.studentId?.name || 'Unknown Student'}</p>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                                                    {log.studentId?.enrollmentNumber || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider inline-block">
                                            {log.batchId?.name || 'Unassigned Batch'}
                                        </span>
                                    </td>
                                    <td className="p-5 pr-8">
                                        <div className="flex justify-end">
                                            {getStatusBadge(log.status)}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredLogs.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-16 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <ClipboardList size={48} className="mb-4 opacity-20" />
                                            <p className="text-xl font-bold text-slate-800">No attendance records found</p>
                                            <p className="text-sm font-medium mt-1">Try relaxing your filter criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AttendanceLogs;
