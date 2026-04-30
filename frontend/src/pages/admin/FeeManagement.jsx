import { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCard, Plus, Search, CheckCircle2, AlertCircle, Clock, TrendingUp, IndianRupee, Users, History, Download } from 'lucide-react';

const FeeManagement = () => {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [selectedFee, setSelectedFee] = useState(null);
    
    // Stats
    const [stats, setStats] = useState({
        totalExpected: 0,
        totalCollected: 0,
        totalPending: 0,
        overdueCount: 0
    });

    // Form States
    const [batches, setBatches] = useState([]);
    const [students, setStudents] = useState([]);
    const [newFee, setNewFee] = useState({ studentId: '', batchId: '', totalAmount: '', dueDate: '' });
    const [paymentData, setPaymentData] = useState({ feeId: '', amount: '', paymentMethod: 'Cash', transactionId: '', remarks: '' });

    useEffect(() => {
        fetchFees();
        fetchBatchesAndStudents();
    }, []);

    const fetchFees = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('/api/fees', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const fetchedFees = data.data;
            setFees(fetchedFees);
            
            // Calculate Stats
            let expected = 0;
            let collected = 0;
            let overdue = 0;
            
            fetchedFees.forEach(f => {
                expected += f.totalAmount;
                collected += f.amountPaid;
                if(f.status === 'Overdue') overdue++;
            });
            
            setStats({
                totalExpected: expected,
                totalCollected: collected,
                totalPending: expected - collected,
                overdueCount: overdue
            });
            
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch fees', error);
            setLoading(false);
        }
    };

    const fetchBatchesAndStudents = async () => {
        try {
            const token = localStorage.getItem('token');
            const [batchRes, studentRes] = await Promise.all([
                axios.get('/api/batches', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/admin/users?role=student', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setBatches(batchRes.data.data || batchRes.data || []);
            setStudents(studentRes.data.data || studentRes.data || []);
        } catch (error) {
            console.error('Failed to fetch batches/students', error);
        }
    };

    const handleAssignFee = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/fees', newFee, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsAssignModalOpen(false);
            setNewFee({ studentId: '', batchId: '', totalAmount: '', dueDate: '' });
            fetchFees();
            // Could add toast here
        } catch (error) {
            alert(error.response?.data?.message || 'Error assigning fee');
        }
    };

    const handleRecordPayment = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/fees/${paymentData.feeId}/pay`, paymentData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsPaymentModalOpen(false);
            setPaymentData({ feeId: '', amount: '', paymentMethod: 'Cash', transactionId: '', remarks: '' });
            fetchFees();
        } catch (error) {
            alert(error.response?.data?.message || 'Error recording payment');
        }
    };

    const openPaymentModal = (fee) => {
        const remaining = fee.totalAmount - fee.amountPaid;
        setPaymentData({ feeId: fee._id, amount: remaining, paymentMethod: 'Cash', transactionId: '', remarks: '' });
        setIsPaymentModalOpen(true);
    };

    const downloadReceipt = async (feeId, transactionId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/fees/${feeId}/receipt/${transactionId}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob', // Important for handling binary data
            });

            const file = new Blob([response.data], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            
            const link = document.createElement('a');
            link.href = fileURL;
            link.setAttribute('download', `Receipt-${transactionId.slice(-6).toUpperCase()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            URL.revokeObjectURL(fileURL);
        } catch (error) {
            console.error('Failed to download receipt', error);
            alert('Failed to genenerate receipt. Please try again.');
        }
    };

    const filteredFees = fees.filter(fee => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        const nameMatch = fee.studentId?.name?.toLowerCase().includes(search) || false;
        const enrollMatch = fee.studentId?.enrollmentNumber?.toLowerCase().includes(search) || false;
        return nameMatch || enrollMatch || (!fee.studentId && 'unknown'.includes(search));
    });

    const getStatusBadge = (status) => {
        switch(status) {
            case 'Paid': return <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-100/80 text-emerald-700 flex items-center justify-center gap-1.5"><CheckCircle2 size={14}/> Paid</span>;
            case 'Overdue': return <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-rose-100/80 text-rose-700 flex items-center justify-center gap-1.5 animate-pulse"><AlertCircle size={14}/> Overdue</span>;
            default: return <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-amber-100/80 text-amber-700 flex items-center justify-center gap-1.5"><Clock size={14}/> Pending</span>;
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium animate-pulse">Loading Financial Records...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-gradient-to-r from-slate-900 to-indigo-900 p-8 rounded-[40px] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 text-indigo-200 mb-2">
                        <CreditCard size={20} />
                        <span className="text-xs font-black uppercase tracking-widest">Financial Hub</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
                        Fee Management
                    </h2>
                    <p className="text-indigo-200/80 text-sm mt-2 font-medium max-w-md">Oversee institutional revenue, track student dues, and process payments effortlessly.</p>
                </div>
                <button 
                    onClick={() => setIsAssignModalOpen(true)}
                    className="relative z-10 bg-white hover:bg-indigo-50 text-indigo-600 px-6 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-indigo-500/30 flex items-center gap-2 hover:scale-105 active:scale-95"
                >
                    <Plus size={18} strokeWidth={3} /> Assign New Fee
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                            <TrendingUp size={24} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Expected</span>
                    </div>
                    <p className="text-3xl font-black text-slate-800">₹{stats.totalExpected.toLocaleString()}</p>
                </div>
                
                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                            <IndianRupee size={24} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Collected</span>
                    </div>
                    <p className="text-3xl font-black text-emerald-600">₹{stats.totalCollected.toLocaleString()}</p>
                    <div className="w-full h-1 bg-slate-100 mt-4 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${stats.totalExpected ? (stats.totalCollected/stats.totalExpected)*100 : 0}%` }}></div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                            <Clock size={24} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pending</span>
                    </div>
                    <p className="text-3xl font-black text-amber-600">₹{stats.totalPending.toLocaleString()}</p>
                </div>

                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                    {stats.overdueCount > 0 && <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-10 -mt-10 animate-pulse"></div>}
                    <div className="flex justify-between items-start relative z-10">
                        <div className={`w-12 h-12 rounded-2xl ${stats.overdueCount > 0 ? 'bg-rose-100 text-rose-600' : 'bg-slate-50 text-slate-400'} flex items-center justify-center mb-4`}>
                            <AlertCircle size={24} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Defaulters</span>
                    </div>
                    <p className={`text-3xl font-black relative z-10 ${stats.overdueCount > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                        {stats.overdueCount} <span className="text-sm font-medium text-slate-500 uppercase tracking-widest">Students</span>
                    </p>
                </div>
            </div>

            {/* Main Table Area */}
            <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/30">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <Users size={20} className="text-indigo-500" />
                        Student Fee Records
                    </h3>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Find by name or enrollment no..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-slate-100 rounded-2xl focus:border-indigo-400 outline-none transition-all font-medium text-sm shadow-sm"
                        />
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                                <th className="p-5 pl-8">Student Detail</th>
                                <th className="p-5">Course/Batch</th>
                                <th className="p-5">Dues Map</th>
                                <th className="p-5">Timeline</th>
                                <th className="p-5">Status</th>
                                <th className="p-5 pr-8 text-right">Action space</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredFees.map(fee => {
                                const prog = Math.min((fee.amountPaid / fee.totalAmount) * 100, 100);
                                return (
                                <tr key={fee._id} className="hover:bg-indigo-50/30 transition-colors group">
                                    <td className="p-5 pl-8">
                                        <div className="flex items-center gap-3">
                                            <img 
                                                src={fee.studentId?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(fee.studentId?.name || 'S')}&background=e0e7ff&color=4f46e5`} 
                                                alt="avatar" 
                                                className="w-10 h-10 rounded-xl"
                                            />
                                            <div>
                                                <p className="font-bold text-slate-800 leading-tight">{fee.studentId?.name || 'Unknown'}</p>
                                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{fee.studentId?.enrollmentNumber || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                                            {fee.batchId?.name || 'General'}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex justify-between text-xs font-bold mb-1.5">
                                            <span className="text-emerald-600">₹{fee.amountPaid}</span>
                                            <span className="text-slate-400">Total: ₹{fee.totalAmount}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500 rounded-full" style={{width: `${prog}%`}}></div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <p className="text-sm font-bold text-slate-700">{new Date(fee.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest shrink-0">Due Date</p>
                                    </td>
                                    <td className="p-5">{getStatusBadge(fee.status)}</td>
                                    <td className="p-5 pr-8 text-right whitespace-nowrap">
                                        {fee.paymentHistory?.length > 0 && (
                                            <button 
                                                onClick={() => { setSelectedFee(fee); setIsHistoryModalOpen(true); }}
                                                className="inline-block text-xs font-black uppercase tracking-widest text-slate-500 bg-slate-100 hover:bg-slate-900 hover:text-white p-2.5 rounded-xl transition-all shadow-sm opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 mr-2"
                                                title="View Transactions"
                                            >
                                                <History size={16} />
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => openPaymentModal(fee)}
                                            disabled={fee.status === 'Paid'}
                                            className="inline-block text-xs font-black uppercase tracking-widest text-white disabled:opacity-0 bg-indigo-600 hover:bg-slate-900 px-4 py-2.5 rounded-xl transition-all shadow-md opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
                                        >
                                            Receive
                                        </button>
                                        {fee.status === 'Paid' && fee.paymentHistory?.length === 0 && (
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Settled</span>
                                        )}
                                    </td>
                                </tr>
                            )})}
                            {filteredFees.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-16 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <CreditCard size={48} className="mb-4 opacity-20" />
                                            <p className="text-xl font-bold text-slate-800">No matching fees found</p>
                                            <p className="text-sm font-medium mt-1">Try adjusting your search criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals keep the same functionality but with modernized styling */}
            {isAssignModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
                        <div className="p-8 border-b-2 border-slate-50 bg-slate-50/50">
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Generate Fee Invoice</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Assign dues to a student</p>
                        </div>
                        <form onSubmit={handleAssignFee} className="p-8 space-y-5">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="col-span-2">
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Select Student</label>
                                    <select 
                                        required value={newFee.studentId} onChange={(e) => setNewFee({...newFee, studentId: e.target.value})}
                                        className="w-full p-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all font-semibold outline-none"
                                    >
                                        <option value="">-- Choose target student --</option>
                                        {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.enrollmentNumber})</option>)}
                                    </select>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Target Batch</label>
                                    <select 
                                        required value={newFee.batchId} onChange={(e) => setNewFee({...newFee, batchId: e.target.value})}
                                        className="w-full p-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all font-semibold outline-none"
                                    >
                                        <option value="">-- Batch --</option>
                                        {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Total Amount (₹)</label>
                                    <input 
                                        type="number" required min="1" placeholder="e.g. 50000"
                                        value={newFee.totalAmount} onChange={(e) => setNewFee({...newFee, totalAmount: e.target.value})}
                                        className="w-full p-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all font-bold outline-none text-indigo-900"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Payment Deadline</label>
                                    <input 
                                        type="date" required
                                        value={newFee.dueDate} onChange={(e) => setNewFee({...newFee, dueDate: e.target.value})}
                                        className="w-full p-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white transition-all font-semibold outline-none"
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-8 flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsAssignModalOpen(false)} className="flex-1 px-4 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-colors">Abort</button>
                                <button type="submit" className="flex-1 px-4 py-4 bg-indigo-600 hover:bg-slate-900 text-white shadow-lg shadow-indigo-200 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:-translate-y-1">Generate Invoice</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isPaymentModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[40px] w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
                        <div className="p-8 border-b-2 border-slate-50 bg-emerald-50/50">
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2"><IndianRupee size={24} className="text-emerald-500"/> Received Payment</h3>
                            <p className="text-xs font-bold text-emerald-600/70 uppercase tracking-widest mt-1">Record a new transaction</p>
                        </div>
                        <form onSubmit={handleRecordPayment} className="p-8 space-y-5">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Tendered Amount (₹)</label>
                                <input 
                                    type="number" required min="1"
                                    value={paymentData.amount} onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white transition-all font-black text-2xl text-emerald-700 outline-none"
                                />
                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Adjust amount if partial payment is made</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Mode of Payment</label>
                                    <select 
                                        value={paymentData.paymentMethod} onChange={(e) => setPaymentData({...paymentData, paymentMethod: e.target.value})}
                                        className="w-full p-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white transition-all font-semibold outline-none"
                                    >
                                        <option value="Cash">Cash / Hand</option>
                                        <option value="UPI">UPI / QR Code</option>
                                        <option value="Bank Transfer">NEFT / RTGS</option>
                                        <option value="Card">Debit / Credit Card</option>
                                        <option value="Other">Other Method</option>
                                    </select>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Ref / TX ID</label>
                                    <input 
                                        type="text" placeholder="Optional"
                                        value={paymentData.transactionId} onChange={(e) => setPaymentData({...paymentData, transactionId: e.target.value})}
                                        className="w-full p-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white transition-all font-mono text-sm outline-none"
                                    />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Remarks</label>
                                    <input 
                                        type="text" placeholder="Notes..."
                                        value={paymentData.remarks} onChange={(e) => setPaymentData({...paymentData, remarks: e.target.value})}
                                        className="w-full p-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white transition-all font-semibold outline-none"
                                    />
                                </div>
                            </div>
                            <div className="mt-8 flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="flex-1 px-4 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-4 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-200 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:-translate-y-1">Confirm Payment</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isHistoryModalOpen && selectedFee && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-300 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-8 border-b-2 border-slate-50 flex justify-between items-center bg-indigo-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2"><History size={24} className="text-indigo-500"/> Transaction Log</h3>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{selectedFee.studentId?.name} • {selectedFee.batchId?.name}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black text-emerald-600 leading-none">₹{selectedFee.amountPaid}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Paid</p>
                            </div>
                        </div>
                        
                        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-4 bg-slate-50/50">
                            {selectedFee.paymentHistory?.map((payment, i) => (
                                <div key={payment._id} className="flex justify-between items-center bg-white border border-slate-100 p-5 rounded-3xl hover:border-indigo-100 transition-colors group shadow-sm hover:shadow-md">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-[1rem] bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg shadow-sm border border-indigo-100/50">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <p className="font-black text-xl text-slate-800 leading-tight">₹{payment.amount.toLocaleString()}</p>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex gap-2">
                                                <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{new Date(payment.date).toLocaleDateString()}</span>
                                                <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{payment.paymentMethod}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {payment.transactionId && (
                                            <div className="text-right hidden sm:block">
                                                <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">TXT ID</p>
                                                <p className="text-xs font-mono font-bold text-slate-600">{payment.transactionId}</p>
                                            </div>
                                        )}
                                        <button 
                                            onClick={() => downloadReceipt(selectedFee._id, payment._id)}
                                            title="Download PDF Receipt"
                                            className="ml-2 w-12 h-12 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 rounded-[1rem] flex items-center justify-center transition-all shadow-sm"
                                        >
                                            <Download size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {(!selectedFee.paymentHistory || selectedFee.paymentHistory.length === 0) && (
                                <div className="text-center py-10 text-slate-400">
                                    <History size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="font-bold">No transactions found</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="p-6 border-t-2 border-slate-50 bg-white">
                            <button 
                                onClick={() => setIsHistoryModalOpen(false)} 
                                className="w-full px-4 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-colors"
                            >
                                Close View
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeeManagement;
