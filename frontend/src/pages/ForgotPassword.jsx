import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }
    const { forgotPassword } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus(null);
        
        const response = await forgotPassword(email);
        setIsLoading(false);
        
        if (response.success) {
            setStatus({ type: 'success', message: response.message });
            setEmail(''); // clear field
        } else {
            setStatus({ type: 'error', message: response.message });
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10 selection:bg-indigo-300 selection:text-indigo-900">
            <SEO title="Forgot Password" description="Reset your Gurukul Excellence password" />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-white/70 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] shadow-2xl border border-white/40 relative overflow-hidden"
            >
                {/* Decor Top */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient-x"></div>

                <div className="mb-8">
                    <Link to="/login" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors mb-6 group w-fit">
                        <ArrowLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" /> Back to login
                    </Link>
                    <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Forgot Password?</h2>
                    <p className="text-slate-500 font-medium text-sm sm:text-base">No worries, we'll send you reset instructions.</p>
                </div>

                {status?.type === 'success' ? (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="bg-indigo-50/80 backdrop-blur-sm border border-indigo-100 p-6 rounded-2xl text-center shadow-sm"
                    >
                        <div className="flex justify-center mb-4">
                            <div className="bg-indigo-100 p-4 rounded-full text-indigo-600 shadow-inner">
                                <Mail size={32} />
                            </div>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">Check your email</h3>
                        <p className="text-slate-600 text-sm font-medium leading-relaxed">We've sent a password reset link to <span className="font-bold text-slate-800">{email || 'your email address'}</span>.</p>
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
                        
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1" htmlFor="email">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    className="block w-full pl-12 pr-4 py-4 sm:text-md rounded-2xl border border-slate-200/60 bg-white/50 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all font-medium shadow-sm hover:border-slate-300"
                                    placeholder="Enter your registered email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !email}
                            className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-indigo-600/20 text-md font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending Link...
                                </span>
                            ) : 'Send Reset Link'}
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
