import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import logo from '../assets/logo.png';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import SEO from '../components/SEO';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, googleLogin, error } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const success = await login(email, password);
        setIsLoading(false);
        if (success) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
            <SEO title="Login" description="Login to your Gurukul Excellence account to access live classes and premium study material." />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-6xl w-full bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-white/40"
            >
                {/* Visual / Branding Side */}
                <div className="lg:w-1/2 bg-indigo-950 relative overflow-hidden hidden lg:block p-12 text-white border-r border-indigo-900/50">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/30 rounded-full blur-[100px] transform translate-x-1/3 -translate-y-1/3 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-600/20 rounded-full blur-[80px] transform -translate-x-1/3 translate-y-1/3"></div>

                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <Link to="/" className="flex items-center space-x-3 text-white group cursor-pointer w-fit">
                                <div className="bg-white p-1 rounded-2xl shadow-xl shadow-black/10 border border-indigo-100/50 w-14 h-14 flex shrink-0 items-center justify-center transition-all duration-300 group-hover:scale-105">
                                    <img src={logo} alt="Gurukul Logo" className="w-full h-full object-contain mix-blend-multiply scale-110" />
                                </div>
                                <span className="text-2xl font-black tracking-tight">Gurukul <span className="text-indigo-400">Excellence</span></span>
                            </Link>
                            
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="mt-20"
                            >
                                <h2 className="text-4xl lg:text-5xl font-black leading-tight mb-6 tracking-tight">
                                    Welcome back to your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-violet-300">success journey.</span>
                                </h2>
                                <p className="text-lg text-indigo-200/80 font-medium leading-relaxed max-w-md">
                                    Sign in to access your personalized dashboard, live classes, DPPs, and performance analytics.
                                </p>
                            </motion.div>
                        </div>

                        {/* Testimonial Card */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 relative mt-12 hover:bg-white/10 transition-colors"
                        >
                            <div className="absolute -top-6 left-6 text-6xl text-indigo-400/50 font-serif">"</div>
                            <p className="text-indigo-100 italic font-medium relative z-10 leading-relaxed">
                                Gurukul's online platform kept my preparation on track even when I couldn't physical classes. The mock test analytics are a game changer.
                            </p>
                            <div className="mt-6 flex items-center space-x-4">
                                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80" alt="Student" className="w-12 h-12 rounded-full border-2 border-indigo-400 object-cover shadow-lg" />
                                <div>
                                    <div className="font-bold text-white tracking-wide">Priya Sharma</div>
                                    <div className="text-xs text-indigo-300 font-semibold tracking-wider uppercase mt-1">NEET 2025 Ranker (690/720)</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Login Form Side */}
                <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative">
                    {/* Mobile Logo Only */}
                    <div className="lg:hidden mb-8 flex justify-center">
                        <Link to="/" className="flex items-center space-x-2 text-indigo-600 group">
                            <div className="bg-white p-1 rounded-2xl shadow-md border border-indigo-50 w-12 h-12 flex shrink-0 items-center justify-center transition-all duration-300 group-hover:scale-105">
                                <img src={logo} alt="Gurukul Logo" className="w-full h-full object-contain mix-blend-multiply scale-110" />
                            </div>
                            <span className="text-2xl font-black tracking-tight text-slate-900">Gurukul Excellence</span>
                        </Link>
                    </div>

                    <div className="max-w-md w-full mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2 tracking-tight">Sign In</h2>
                            <p className="text-slate-500 font-medium mb-10 text-sm sm:text-base">Enter your credentials to securely access your account.</p>

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-rose-50/80 backdrop-blur-sm text-rose-600 border border-rose-200 p-4 rounded-2xl flex items-start space-x-3 text-sm font-semibold shadow-sm"
                                    >
                                        <div className="mt-0.5"><ShieldCheck size={18} /></div>
                                        <div>{error}</div>
                                    </motion.div>
                                )}
                                
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2 ml-1" htmlFor="email">Email Address</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                                <Mail className="h-5 w-5" />
                                            </div>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                className="block w-full pl-12 pr-4 py-4 sm:text-md rounded-2xl border border-slate-200/60 bg-white/50 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all font-medium shadow-sm hover:border-slate-300"
                                                placeholder="youremail@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div className="flex justify-between items-center mb-2 ml-1">
                                            <label className="block text-sm font-bold text-slate-700" htmlFor="password">Password</label>
                                            <Link to="/forgot-password" className="text-sm font-bold text-indigo-600 hover:text-indigo-500 transition-colors">Forgot password?</Link>
                                        </div>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                                <Lock className="h-5 w-5" />
                                            </div>
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                required
                                                className="block w-full pl-12 pr-4 py-4 sm:text-md rounded-2xl border border-slate-200/60 bg-white/50 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all font-medium shadow-sm hover:border-slate-300"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-indigo-600/20 text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Authenticating...
                                            </span>
                                        ) : (
                                            <span className="flex items-center">
                                                Sign In <ArrowRight className="ml-2" size={20} />
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </form>

                            <div className="mt-8 pt-2">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-200/60"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-transparent text-slate-400 font-bold uppercase tracking-wider text-xs">Or continue with</span>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-center w-full bg-white/50 backdrop-blur-sm rounded-xl hover:bg-white/80 transition-colors border border-slate-100 p-1">
                                    <GoogleLogin
                                        onSuccess={async (credentialResponse) => {
                                            setIsLoading(true);
                                            const success = await googleLogin(credentialResponse.credential);
                                            setIsLoading(false);
                                            if (success) navigate('/dashboard');
                                        }}
                                        onError={() => {
                                            console.error('Google Login Failed');
                                        }}
                                        theme="outline"
                                        size="large"
                                        width="100%"
                                        shape="pill"
                                    />
                                </div>
                            </div>

                            {/* Security Badges */}
                            <div className="mt-10 pt-6 border-t border-slate-100/50 flex flex-wrap items-center justify-center gap-4 text-slate-400">
                                <div className="flex items-center text-xs font-bold tracking-wide">
                                    <CheckCircle2 size={16} className="mr-1.5 text-emerald-500" /> Secure Login
                                </div>
                                <div className="flex items-center text-xs font-bold tracking-wide">
                                    <CheckCircle2 size={16} className="mr-1.5 text-emerald-500" /> 256-bit Encryption
                                </div>
                            </div>

                            <p className="mt-8 text-center text-sm font-semibold text-slate-500">
                                Don't have an account yet?{' '}
                                <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors hover:underline underline-offset-4">
                                    Create an account
                                </Link>
                            </p>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
