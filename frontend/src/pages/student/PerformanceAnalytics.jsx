import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Target, Award, BarChart3, TrendingUp, Calendar, AlertCircle } from 'lucide-react';

const PerformanceAnalytics = () => {
    const [testResults, setTestResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get('/api/tests/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTestResults(data);
            } catch (error) {
                console.error('Failed to fetch test results', error);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    const calculateAverage = () => {
        if (testResults.length === 0) return 0;
        const totalPercent = testResults.reduce((acc, curr) => {
            return acc + (curr.results[0].marksObtained / curr.totalMarks) * 100;
        }, 0);
        return (totalPercent / testResults.length).toFixed(1);
    };

    if (loading) return <div className="text-center py-10 font-bold text-slate-400">Analyzing your track record...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[48px] text-white shadow-2xl relative overflow-hidden group">
                    <Award className="absolute -bottom-4 -right-4 w-32 h-32 text-white opacity-5 group-hover:scale-110 transition-transform duration-700" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Performance Score</p>
                    <div className="mt-4 flex items-end gap-2">
                        <span className="text-6xl font-black tracking-tighter">{calculateAverage()}</span>
                        <span className="text-2xl font-bold text-slate-500 mb-2">%</span>
                    </div>
                    <p className="text-xs font-bold text-slate-500 mt-2">Aggregate across {testResults.length} tests</p>
                </div>

                <div className="bg-white p-8 rounded-[48px] shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div>
                        <Target className="text-indigo-600 mb-4" size={32} />
                        <h4 className="text-xl font-black text-slate-800 tracking-tight">Highest Marks</h4>
                    </div>
                    <div className="mt-4">
                        <p className="text-4xl font-black text-slate-800 tracking-tighter">
                            {testResults.length > 0 ? Math.max(...testResults.map(t => t.results[0].marksObtained)) : 0}
                        </p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Best Achievement</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[48px] shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div>
                        <BarChart3 className="text-emerald-500 mb-4" size={32} />
                        <h4 className="text-xl font-black text-slate-800 tracking-tight">Test Rank</h4>
                    </div>
                    <div className="mt-4">
                        <p className="text-4xl font-black text-slate-800 tracking-tighter">A+</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Current Standing</p>
                    </div>
                </div>
            </div>

            {/* results list */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-4">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight italic uppercase">Recent Assessments</h3>
                    <TrendingUp className="text-slate-300" />
                </div>

                {testResults.length === 0 ? (
                    <div className="bg-white p-12 rounded-[40px] border border-slate-100 text-center">
                        <p className="text-slate-400 font-bold">No test results reported yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {testResults.map((test) => {
                            const result = test.results[0];
                            const percentage = (result.marksObtained / test.totalMarks) * 100;
                            return (
                                <div key={test._id} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl transition-all group">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-16 h-16 rounded-[24px] flex flex-col items-center justify-center font-black transition-all group-hover:scale-110 ${
                                            percentage >= 75 ? 'bg-emerald-50 text-emerald-600' :
                                            percentage >= 40 ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                                        }`}>
                                            <span className="text-xs leading-none">SCORE</span>
                                            <span className="text-xl">{result.marksObtained}</span>
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black text-slate-800 tracking-tight">{test.testName}</h4>
                                            <p className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-2">
                                                <Calendar size={14} />
                                                {new Date(test.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex-1 max-w-sm hidden md:block px-10">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-[10px] font-black text-slate-400 uppercase">Performance</span>
                                            <span className="text-xs font-bold text-slate-700">{percentage.toFixed(0)}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                            <div className={`h-full ${
                                                percentage >= 75 ? 'bg-emerald-500' :
                                                percentage >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                                            }`} style={{ width: `${percentage}%` }}></div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end">
                                        <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Feedback</p>
                                        <p className="text-sm font-bold text-slate-700 mt-1 italic italic">"{result.feedback || 'Excellent work keep it up!'}"</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PerformanceAnalytics;
