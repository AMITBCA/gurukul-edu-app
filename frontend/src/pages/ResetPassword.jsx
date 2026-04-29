import { useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { resetPassword } = useContext(AuthContext);
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setStatus({ type: 'error', message: "Passwords do not match." });
            return;
        }
        
        if (password.length < 6) {
            setStatus({ type: 'error', message: "Password must be at least 6 characters long." });
            return;
        }

        setIsLoading(true);
        setStatus(null);
        
        const response = await resetPassword(token, password);
        setIsLoading(false);
        
        if (response.success) {
            setStatus({ type: 'success', message: response.message });
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } else {
            setStatus({ type: 'error', message: response.message });
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10 selection:bg-teal-200 selection:text-teal-900">
            <SEO title="Reset Password" description="Create a new password for Gurukul Excellence" />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-white/70 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] shadow-2xl border border-white/40 relative overflow-hidden"
            >
                {/* Decor Top */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-400 animate-gradient-x"></div>

                <div className="mb-8 mt-2">
                    <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Create New Password</h2>
                    <p className="text-slate-500 font-medium text-sm sm:text-base">Your new password must be different from previous used passwords.</p>
                </div>

                {status?.type === 'success' ? (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="bg-emerald-50/80 backdrop-blur-sm border border-emerald-100 p-6 rounded-2xl text-center shadow-sm"
                    >
                        <div className="flex justify-center mb-4">
                            <div className="bg-emerald-100 p-4 rounded-full text-emerald-600 shadow-inner">
                                <CheckCircle2 size={36} />
                            </div>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">Password Reset Successfully</h3>
                        <p className="text-slate-600 text-sm font-medium mb-6 leading-relaxed">You will be redirected to the login page momentarily.</p>
                        <Link to="/login" className="font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-4 decoration-2">Click here if not redirected automatically</Link>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {status?.type === 'error' && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                className="bg-rose-50 text-rose-600 border border-rose-200 p-4 rounded-xl text-sm font-bold shadow-sm"
                            >
                                {status.message}
                            </motion.div>
                        )}
                        
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1" htmlFor="password">New Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-600 transition-colors">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        required
                                        className="block w-full pl-12 pr-4 py-4 sm:text-md rounded-2xl border border-slate-200/60 bg-white/50 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all font-medium shadow-sm hover:border-slate-300"
                                        placeholder="Enter new password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1" htmlFor="confirmPassword">Confirm Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-600 transition-colors">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        required
                                        className="block w-full pl-12 pr-4 py-4 sm:text-md rounded-2xl border border-slate-200/60 bg-white/50 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all font-medium shadow-sm hover:border-slate-300"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading || !password || !confirmPassword}
                                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-teal-600/20 text-md font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isLoading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Resetting...
                                    </span>
                                ) : 'Reset Password'}
                            </button>
                        </div>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default ResetPassword;
