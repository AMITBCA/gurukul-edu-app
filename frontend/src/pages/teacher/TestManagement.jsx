import { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Plus, Target, Users, Calendar, Trophy, AlertCircle, Check, X, Save } from 'lucide-react';

const TestManagement = () => {
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);
    const [activeTest, setActiveTest] = useState(null);
    const [students, setStudents] = useState([]);
    const [results, setResults] = useState([]); // Array of { studentId, marksObtained, feedback }
    const [saving, setSaving] = useState(false);

    const [newTest, setNewTest] = useState({
        testName: '',
        totalMarks: 100,
        date: new Date().toISOString().split('T')[0]
    });

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

    const fetchTests = async () => {
        if (!selectedBatch) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`/api/tests/batch/${selectedBatch}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTests(data);
        } catch (error) {
            console.error('Failed to fetch tests', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTests();
    }, [selectedBatch]);

    const handleCreateTest = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/tests', {
                ...newTest,
                batchId: selectedBatch
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsCreateModalOpen(false);
            setNewTest({ testName: '', totalMarks: 100, date: new Date().toISOString().split('T')[0] });
            fetchTests();
        } catch (error) {
            alert('Failed to create test');
        }
    };

    const openResultModal = async (test) => {
        setActiveTest(test);
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            // Fetch students for the batch
            const { data: batchStudents } = await axios.get(`/api/batches/${selectedBatch}/students`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(batchStudents);

            // Initialize results
            const initialResults = batchStudents.map(student => {
                const existingResult = test.results.find(r => r.studentId === student._id || r.studentId?._id === student._id);
                return {
                    studentId: student._id,
                    name: student.name,
                    marksObtained: existingResult ? existingResult.marksObtained : 0,
                    feedback: existingResult ? existingResult.feedback : ''
                };
            });
            setResults(initialResults);
            setIsResultModalOpen(true);
        } catch (error) {
            console.error('Failed to load students for results', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResultChange = (index, field, value) => {
        const updatedResults = [...results];
        updatedResults[index][field] = value;
        setResults(updatedResults);
    };

    const handleSaveResults = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/tests/${activeTest._id}/results`, {
                results: results.map(({ studentId, marksObtained, feedback }) => ({
                    studentId,
                    marksObtained: Number(marksObtained),
                    feedback
                }))
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsResultModalOpen(false);
            fetchTests();
        } catch (error) {
            alert('Failed to save results');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Test Management</h3>
                    <p className="text-sm text-slate-500">Create assessments and track performance</p>
                </div>
                
                <div className="flex items-center gap-3">
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

                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        disabled={!selectedBatch}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
                    >
                        <Plus size={20} />
                        <span>Schedule Test</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <p className="text-center py-10 text-slate-500 font-bold">Loading tests...</p>
                ) : !selectedBatch ? (
                    <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                         <Target size={40} className="text-slate-300 mb-4" />
                         <h4 className="text-lg font-bold text-slate-800 tracking-tight">Focus on Results</h4>
                         <p className="text-slate-500 mt-1">Select a batch to manage its tests and scores.</p>
                    </div>
                ) : tests.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                        <FileText size={40} className="text-slate-300 mb-4" />
                        <h4 className="text-lg font-bold text-slate-800">No Tests Scheduled</h4>
                        <p className="text-slate-500 mt-1">Ready to challenge your students? Create your first test above.</p>
                    </div>
                ) : (
                    tests.map((test) => (
                        <div key={test._id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-lg transition-all group">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                    <Trophy size={28} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-slate-800 tracking-tight">{test.testName}</h4>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                            <Calendar size={14} />
                                            {new Date(test.date).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md">
                                            Max {test.totalMarks} Marks
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-left md:text-right px-4 border-l md:border-l-0 md:border-r border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Status</p>
                                    <p className={`text-sm font-bold mt-1 ${test.results.length > 0 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                        {test.results.length > 0 ? 'Results Published' : 'Pending Results'}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => openResultModal(test)}
                                    className="px-6 py-3 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-2"
                                >
                                    {test.results.length > 0 ? 'View/Edit Scores' : 'Upload Scores'}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Test Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                    <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic">Schedule New Test</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateTest} className="p-8 space-y-6">
                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Exam Name</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all outline-none font-bold text-slate-700"
                                    placeholder="e.g. JEE Main Mock - Part 1"
                                    value={newTest.testName}
                                    onChange={(e) => setNewTest({...newTest, testName: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Total Marks</label>
                                    <input 
                                        type="number" 
                                        required
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all outline-none font-bold text-slate-700"
                                        value={newTest.totalMarks}
                                        onChange={(e) => setNewTest({...newTest, totalMarks: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Test Date</label>
                                    <input 
                                        type="date" 
                                        required
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all outline-none font-bold text-slate-700"
                                        value={newTest.date}
                                        onChange={(e) => setNewTest({...newTest, date: e.target.value})}
                                    />
                                </div>
                            </div>
                            
                            <button 
                                type="submit"
                                className="w-full py-4.5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all text-sm uppercase tracking-widest mt-4"
                            >
                                Schedule Now
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Results Modal */}
            {isResultModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-500 h-[80vh] flex flex-col">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic">{activeTest?.testName}</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Upload marks for each student</p>
                            </div>
                            <button onClick={() => setIsResultModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400">
                                <X size={28} />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
                            <table className="w-full text-left border-separate border-spacing-y-3">
                                <thead>
                                    <tr>
                                        <th className="px-6 pb-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">Student</th>
                                        <th className="px-6 pb-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">Marks Obtained</th>
                                        <th className="px-6 pb-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">Feedback/Comments</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((res, idx) => (
                                        <tr key={res.studentId} className="bg-slate-50 group hover:bg-white transition-all duration-300">
                                            <td className="px-6 py-4 rounded-l-2xl border-y border-l border-transparent group-hover:border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 bg-white text-indigo-600 rounded-xl flex items-center justify-center font-black text-xs shadow-sm">
                                                        {res.name.charAt(0)}
                                                    </div>
                                                    <span className="font-bold text-slate-700 text-sm tracking-tight">{res.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 border-y border-transparent group-hover:border-slate-100">
                                                <div className="flex items-center gap-2">
                                                    <input 
                                                        type="number"
                                                        className="w-20 px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700"
                                                        value={res.marksObtained}
                                                        onChange={(e) => handleResultChange(idx, 'marksObtained', e.target.value)}
                                                    />
                                                    <span className="text-xs font-bold text-slate-400">/ {activeTest?.totalMarks}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 rounded-r-2xl border-y border-r border-transparent group-hover:border-slate-100">
                                                <input 
                                                    type="text"
                                                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-600 text-sm"
                                                    placeholder="Good job! Keep it up."
                                                    value={res.feedback}
                                                    onChange={(e) => handleResultChange(idx, 'feedback', e.target.value)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
                            <button 
                                onClick={() => setIsResultModalOpen(false)}
                                className="px-6 py-3.5 text-slate-500 font-bold hover:bg-slate-200 rounded-2xl transition-all"
                            >
                                Discard Changes
                            </button>
                            <button 
                                onClick={handleSaveResults}
                                disabled={saving}
                                className="bg-slate-900 hover:bg-black disabled:bg-slate-300 text-white px-10 py-3.5 rounded-2xl font-black transition-all shadow-xl shadow-slate-200 flex items-center gap-3"
                            >
                                {saving ? (
                                    <>
                                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Saving Data...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        <span>Publish Results</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestManagement;
