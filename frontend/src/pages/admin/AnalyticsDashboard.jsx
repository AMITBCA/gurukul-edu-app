import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, Users, Activity, Loader2 } from 'lucide-react';

const AnalyticsDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/analytics', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(res.data.data);
            } catch (error) {
                console.error('Failed to fetch analytics', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
                <Loader2 className="animate-spin w-12 h-12 text-indigo-500 mb-4" />
                <p className="font-medium animate-pulse">Aggregating Institute Data...</p>
            </div>
        );
    }

    if (!data) return <div className="p-8 text-center text-rose-500 font-bold">Failed to load analytics data.</div>;

    const { revenueTrends, feeSummary, batchPerformance, attendanceStats } = data;

    // Formatting currency for tooltips
    const formatCurrency = (value) => `₹${value.toLocaleString()}`;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 slide-in-from-bottom-4">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-[32px] p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 text-indigo-300 mb-2">
                        <Activity size={20} />
                        <span className="text-xs font-black uppercase tracking-widest">Advanced Telemetry</span>
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Analytics & Intelligence</h2>
                    <p className="text-indigo-200/80 mt-2 max-w-lg text-sm font-medium">Visualize institutional growth, assess batch metrics, and track dynamic engagement across all cohorts.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Revenue Line Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none">
                        <TrendingUp size={120} className="text-indigo-900" />
                    </div>
                    <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2 relative z-10">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        Revenue Trajectory
                    </h3>
                    <div className="h-72 w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueTrends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} tickFormatter={(val) => `₹${val/1000}k`} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <RechartsTooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                                    formatter={(value) => [formatCurrency(value), 'Revenue']}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Overall Fee Summary Donut */}
                <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex flex-col items-center justify-center">
                    <h3 className="text-lg font-black text-slate-800 mb-2 self-start flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Fee Distribution
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Collected', value: feeSummary.collected },
                                        { name: 'Pending', value: feeSummary.pending }
                                    ]}
                                    cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value"
                                >
                                    <Cell fill="#10b981" />
                                    <Cell fill="#f59e0b" />
                                </Pie>
                                <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                                <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Batch Performance Bar Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
                    <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                        Batch Academic Performance
                    </h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={batchPerformance} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} barSize={32}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="batch" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
                                <RechartsTooltip 
                                    cursor={{fill: '#f8fafc'}}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                                    formatter={(value) => [`${value}%`, 'Average Score']}
                                />
                                <Bar dataKey="averageScore" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Attendance Stats Pie */}
                <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
                    <h3 className="text-lg font-black text-slate-800 mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                        Attendance Demographics
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={attendanceStats} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    {attendanceStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
