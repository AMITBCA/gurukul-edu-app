import { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCard, History, CheckCircle2, Clock, AlertCircle, TrendingUp, Download, Sparkles } from 'lucide-react';

const FeeStatus = () => {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Stats
    const [stats, setStats] = useState({
        totalFees: 0,
        paidFees: 0,
        pendingFees: 0
    });

    useEffect(() => {
        fetchMyFees();
    }, []);

    const fetchMyFees = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('/api/fees/myfees', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const fetchedFees = data.data;
            setFees(fetchedFees);

            let total = 0;
            let paid = 0;
            fetchedFees.forEach(f => {
                total += f.totalAmount;
                paid += f.amountPaid;
            });

            setStats({
                totalFees: total,
                paidFees: paid,
                pendingFees: total - paid
            });

            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch fee status', error);
            setLoading(false);
        }
    };

    const downloadReceipt = async (feeId, transactionId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/fees/${feeId}/receipt/${transactionId}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob', // Important for handling binary data
            });

            // Create a blob from the PDF stream
            const file = new Blob([response.data], { type: 'application/pdf' });
            
            // Build a URL from the file
            const fileURL = URL.createObjectURL(file);
            
            // Create a temp anchor tag to trigger download
            const link = document.createElement('a');
            link.href = fileURL;
            // Name the file
            link.setAttribute('download', `Receipt-${transactionId.slice(-6).toUpperCase()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            // Clean up memory
            URL.revokeObjectURL(fileURL);
        } catch (error) {
            console.error('Failed to download receipt', error);
            alert('Failed to generate receipt. Please try again.');
        }
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'Paid': return <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 flex items-center justify-center gap-1 w-max shadow-sm"><CheckCircle2 size={14}/> Paid</span>;
            case 'Overdue': return <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-rose-100 text-rose-700 flex items-center justify-center gap-1 w-max shadow-sm animate-pulse"><AlertCircle size={14}/> Overdue</span>;
            default: return <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 flex items-center justify-center gap-1 w-max shadow-sm"><Clock size={14}/> Pending</span>;
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium animate-pulse">Loading Your Financial Data...</p>
        </div>
    );

    if (fees.length === 0) {
        return (
            <div className="bg-gradient-to-br from-white to-slate-50 p-16 rounded-[48px] border-2 border-slate-100 shadow-xl shadow-slate-200/20 text-center flex flex-col items-center animate-in zoom-in-95 duration-700">
                <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mb-8 relative">
                    <div className="absolute inset-0 border-4 border-indigo-100 rounded-full animate-ping opacity-20"></div>
                    <CreditCard className="text-indigo-400" size={48} />
                </div>
                <h3 className="text-4xl font-black text-slate-800 tracking-tighter mb-4">You're All Clear!</h3>
                <p className="text-slate-500 font-medium text-lg max-w-md">You don't have any pending dues or fee records assigned to your account at the moment.</p>
                <div className="mt-8 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2">
                    <Sparkles size={16} /> Financial Status: Excellent
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-slate-900 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 opacity-20 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-indigo-400 transition-colors duration-700"></div>
                
                <div className="relative z-10 w-full mb-4 md:mb-0">
                    <div className="flex items-center gap-3 text-indigo-300 mb-2">
                        <CreditCard size={20} />
                        <span className="text-xs font-black uppercase tracking-widest">Student Portal</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
                        My Fees & Dues
                    </h2>
                    <p className="text-slate-400 text-sm mt-3 font-medium max-w-md">Track your assigned fees, view payment progress, and check your transaction history.</p>
                </div>

                <div className="relative z-10 flex gap-4 w-full md:w-auto">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-3xl flex-1 md:w-48 text-center">
                        <p className="text-[10px] text-white/60 font-black uppercase tracking-widest mb-1 shadow-sm">Total Pending</p>
                        <p className="text-2xl font-black text-white">₹{stats.pendingFees.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {fees.map((fee) => {
                    const progress = Math.min((fee.amountPaid / fee.totalAmount) * 100, 100);
                    const isFullyPaid = fee.status === 'Paid';
                    
                    return (
                        <div key={fee._id} className="bg-white rounded-[40px] border-2 border-slate-100 overflow-hidden hover:border-indigo-100 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 relative">
                            {isFullyPaid && <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>}
                            
                            <div className="p-8 border-b border-slate-100 flex justify-between items-start bg-slate-50/50 relative z-10">
                                <div>
                                    <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2 flex items-center gap-2">
                                        Fee Category
                                    </p>
                                    <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-none">{fee.batchId?.name || 'General Course Fee'}</h3>
                                </div>
                                {getStatusBadge(fee.status)}
                            </div>
                            
                            <div className="p-8 space-y-8 relative z-10">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 border border-slate-100 p-6 rounded-[24px]">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1"><TrendingUp size={12}/> Total Amount</p>
                                        <p className="text-3xl font-black text-slate-800">₹{fee.totalAmount}</p>
                                    </div>
                                    <div className={`border p-6 rounded-[24px] ${isFullyPaid ? 'bg-emerald-50 border-emerald-100' : 'bg-indigo-50 border-indigo-100'}`}>
                                        <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${isFullyPaid ? 'text-emerald-600/70' : 'text-indigo-400'}`}>Paid Amount</p>
                                        <p className={`text-3xl font-black ${isFullyPaid ? 'text-emerald-700' : 'text-indigo-600'}`}>₹{fee.amountPaid}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 bg-slate-50/50 p-6 rounded-[24px] border border-slate-100">
                                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500">
                                        <span>Payment Progress</span>
                                        <span className={isFullyPaid ? 'text-emerald-600' : 'text-indigo-600'}>{progress.toFixed(0)}%</span>
                                    </div>
                                    <div className="h-3 bg-slate-200/50 rounded-full overflow-hidden shadow-inner">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${isFullyPaid ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    {!isFullyPaid && (
                                        <div className="flex justify-between items-center mt-3 border-t border-slate-200/50 pt-3">
                                            <p className="text-xs font-black text-rose-500 flex items-center gap-1.5 uppercase tracking-widest">
                                                <AlertCircle size={14}/> Due {new Date(fee.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-2 py-1 rounded-md border border-slate-200">
                                                Remain: ₹{fee.totalAmount - fee.amountPaid}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {fee.paymentHistory && fee.paymentHistory.length > 0 && (
                                    <div className="pt-6 border-t border-slate-100">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-800">
                                                <History size={16} className="text-indigo-500" /> Transaction Log
                                            </h4>
                                        </div>
                                        <div className="space-y-3">
                                            {fee.paymentHistory.map((payment, i) => (
                                                <div key={i} className="flex justify-between items-center bg-white border border-slate-100 p-4 rounded-2xl hover:border-indigo-100 transition-colors group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black shadow-sm group-hover:scale-110 transition-transform">
                                                            {i + 1}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-lg text-slate-800 leading-tight">₹{payment.amount}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                                {new Date(payment.date).toLocaleDateString()} • {payment.paymentMethod}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 shrink-0">
                                                        {payment.transactionId && (
                                                            <span className="text-[10px] font-black font-mono bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500">
                                                                TXID: {payment.transactionId}
                                                            </span>
                                                        )}
                                                        <button 
                                                            onClick={() => downloadReceipt(fee._id, payment._id)}
                                                            title="Download Receipt PDF"
                                                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all shadow-sm border border-transparent hover:border-indigo-100"
                                                        >
                                                            <Download size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FeeStatus;
