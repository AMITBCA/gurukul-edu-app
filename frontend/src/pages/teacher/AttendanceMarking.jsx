import { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, Save, Calendar, Users, ChevronRight, AlertCircle } from 'lucide-react';

const AttendanceMarking = () => {
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({}); // { studentId: status }
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

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

    const fetchStudentsAndAttendance = async () => {
        if (!selectedBatch || !date) return;
        setLoading(true);
        setMessage(null);
        try {
            const token = localStorage.getItem('token');
            // First get existing attendance for this date
            const { data: existingAttendance } = await axios.get(`/api/attendance/batch/${selectedBatch}?date=${date}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Then get students in this batch (from batch data or separate API)
            // For now, let's assume getBatches gives us students if populated, 
            // but usually we want a clean way. Let's find the batch from our list.
            const batch = batches.find(b => b._id === selectedBatch);
            
            // If batch doesn't have students populated, we might need to fetch them.
            // Let's assume User model has students with batchId.
            // For now, I'll use the ones from the batch object if available.
            // To be safe, let's fetch students with role student and batchId.
            const { data: batchStudents } = await axios.get(`/api/batches/${selectedBatch}/students`, {
               headers: { Authorization: `Bearer ${token}` }
            });

            setStudents(batchStudents);

            // Map existing attendance
            const attendanceMap = {};
            batchStudents.forEach(s => attendanceMap[s._id] = 'Present'); // Default to present
            existingAttendance.forEach(a => {
                attendanceMap[a.studentId._id] = a.status;
            });
            setAttendance(attendanceMap);
        } catch (error) {
            console.error('Failed to fetch students', error);
            setMessage({ type: 'error', text: 'Failed to load students.' });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (studentId, status) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const token = localStorage.getItem('token');
            const promises = Object.entries(attendance).map(([studentId, status]) => 
                axios.post('/api/attendance', {
                    studentId,
                    batchId: selectedBatch,
                    date,
                    status
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            );

            await Promise.all(promises);
            setMessage({ type: 'success', text: 'Attendance saved successfully!' });
        } catch (error) {
            console.error('Failed to save attendance', error);
            setMessage({ type: 'error', text: 'Failed to save attendance.' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Mark Attendance</h3>
                    <p className="text-sm text-slate-500">Track student presence for your batches</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                    <select 
                        value={selectedBatch}
                        onChange={(e) => setSelectedBatch(e.target.value)}
                        className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold text-slate-700"
                    >
                        <option value="">Select Batch</option>
                        {batches.map(b => (
                            <option key={b._id} value={b._id}>{b.name}</option>
                        ))}
                    </select>

                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="date" 
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold text-slate-700"
                        />
                    </div>

                    <button 
                        onClick={fetchStudentsAndAttendance}
                        disabled={!selectedBatch || loading}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
                    >
                        {loading ? 'Loading...' : 'Check Attendance'}
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

            {students.length > 0 && (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-100/50">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Student</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Enrollment No.</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Attendance Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student._id} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-slate-700">{student.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 font-mono text-sm">{student.enrollmentNumber || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                                                {['Present', 'Absent', 'Late'].map((status) => (
                                                    <button
                                                        key={status}
                                                        onClick={() => handleStatusChange(student._id, status)}
                                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                                            attendance[student._id] === status
                                                            ? status === 'Present' ? 'bg-emerald-500 text-white' : status === 'Absent' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'
                                                            : 'text-slate-500 hover:text-slate-800'
                                                        }`}
                                                    >
                                                        {status}
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                        <button 
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-100 flex items-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    <span>Save Attendance</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendanceMarking;
