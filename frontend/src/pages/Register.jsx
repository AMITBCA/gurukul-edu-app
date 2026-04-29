import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import logo from '../assets/logo.png';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import SEO from '../components/SEO';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const { register, googleLogin, error } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const result = await register(formData);
        setIsLoading(false);
        if (result?.success) {
            setSuccessMsg(result.message || 'Registration successful!');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
            <SEO title="Register" description="Join Gurukul Excellence to radically improve your JEE and NEET scores with our structured curriculum." />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-6xl w-full bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row-reverse border border-white/40"
            >
                {/* Visual / Trust Building Side */}
                <div className="lg:w-1/2 bg-indigo-950 relative overflow-hidden hidden lg:block p-12 text-white border-l border-indigo-900/50">
                    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-violet-600/30 rounded-full blur-[100px] transform -translate-x-1/3 -translate-y-1/3 animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-sky-500/20 rounded-full blur-[80px] transform translate-x-1/3 translate-y-1/3"></div>

                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="flex justify-end">
                            <Link to="/" className="flex items-center space-x-3 text-white group cursor-pointer w-fit">
                                <span className="text-2xl font-black tracking-tight">Gurukul <span className="text-indigo-400">Excellence</span></span>
                                <div className="bg-white p-1 rounded-2xl shadow-xl shadow-black/10 border border-indigo-100/50 w-14 h-14 flex shrink-0 items-center justify-center transition-all duration-300 group-hover:scale-105 mr-3">
                                    <img src={logo} alt="Gurukul Logo" className="w-full h-full object-contain mix-blend-multiply scale-110" />
                                </div>
                            </Link>
                        </div>
                        
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="mt-12 text-right"
                        >
                            <h2 className="text-4xl lg:text-5xl font-black leading-tight mb-6 tracking-tight">
                                Join the league of <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-sky-300">future leaders.</span>
                            </h2>
                            <p className="text-lg text-indigo-200/80 font-medium leading-relaxed max-w-md ml-auto">
                                Over 10,000 students have radically improved their JEE and NEET scores with our structured curriculum.
                            </p>
                        </motion.div>

                        {/* Testimonial Card */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 relative mt-12 text-left hover:bg-white/10 transition-colors"
                        >
                            <div className="absolute -top-6 right-6 text-6xl text-violet-400/50 font-serif">"</div>
                            <p className="text-indigo-100 italic font-medium relative z-10 leading-relaxed">
                                The quality of live classes and the instant doubt resolution feature gave me the confidence to ace my exams. Best decision ever.
                            </p>
                            <div className="mt-6 flex items-center space-x-4">
                                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80" alt="Student" className="w-12 h-12 rounded-full border-2 border-violet-400 object-cover shadow-lg" />
                                <div>
                                    <div className="font-bold text-white tracking-wide">Rahul Verma</div>
                                    <div className="text-xs text-indigo-300 font-semibold tracking-wider uppercase mt-1">JEE Advanced Ranker</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Register Form Side */}
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
                            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2 tracking-tight">Create Account</h2>
                            <p className="text-slate-500 font-medium mb-8 text-sm sm:text-base">Start your unlimited learning journey today.</p>

                            {successMsg && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-emerald-50/80 backdrop-blur-sm border border-emerald-200 text-emerald-700 p-6 rounded-2xl text-center mb-6 shadow-sm"
                                >
                                    <CheckCircle2 className="mx-auto mb-3 text-emerald-500" size={36} />
                                    <p className="font-bold text-xl mb-1">Registration Successful!</p>
                                    <p className="text-sm font-medium">{successMsg}</p>
                                    <button onClick={() => navigate('/login')} className="mt-5 px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-md shadow-emerald-600/20">
                                        Go to Login
                                    </button>
                                </motion.div>
                            )}

                            {!successMsg && (
                                <form className="space-y-5" onSubmit={handleSubmit}>
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
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1" htmlFor="name">Full Name</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                                                    <User className="h-5 w-5" />
                                                </div>
                                                <input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    required
                                                    className="block w-full pl-12 pr-4 py-3.5 sm:text-md rounded-2xl border border-slate-200/60 bg-white/50 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all font-medium shadow-sm hover:border-slate-300"
                                                    placeholder="Rahul Sharma"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1" htmlFor="email">Email Address</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                                                    <Mail className="h-5 w-5" />
                                                </div>
                                                <input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    required
                                                    className="block w-full pl-12 pr-4 py-3.5 sm:text-md rounded-2xl border border-slate-200/60 bg-white/50 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all font-medium shadow-sm hover:border-slate-300"
                                                    placeholder="youremail@example.com"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="sm:col-span-2">
                                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1" htmlFor="password">Password</label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                                                        <Lock className="h-5 w-5" />
                                                    </div>
                                                    <input
                                                        id="password"
                                                        name="password"
                                                        type="password"
                                                        required
                                                        className="block w-full pl-12 pr-4 py-3.5 sm:text-md rounded-2xl border border-slate-200/60 bg-white/50 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all font-medium shadow-sm hover:border-slate-300"
                                                        placeholder="••••••••"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <p className="mt-1.5 ml-1 text-xs text-slate-500 font-medium">Must be at least 6 characters long.</p>
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Join As</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <label className={`cursor-pointer w-full text-center py-3 rounded-2xl border-2 transition-all font-bold ${formData.role === 'student' ? 'border-violet-600 bg-violet-50 text-violet-700 shadow-sm' : 'border-slate-200/60 bg-white/40 text-slate-500 hover:border-violet-300 hover:bg-white/80 hover:text-slate-700'}`}>
                                                    <input type="radio" name="role" value="student" className="hidden" checked={formData.role === 'student'} onChange={handleChange} />
                                                    Student
                                                </label>
                                                <label className={`cursor-pointer w-full text-center py-3 rounded-2xl border-2 transition-all font-bold ${formData.role === 'teacher' ? 'border-violet-600 bg-violet-50 text-violet-700 shadow-sm' : 'border-slate-200/60 bg-white/40 text-slate-500 hover:border-violet-300 hover:bg-white/80 hover:text-slate-700'}`}>
                                                    <input type="radio" name="role" value="teacher" className="hidden" checked={formData.role === 'teacher'} onChange={handleChange} />
                                                    Teacher
                                                </label>
                                            </div>
                                            {formData.role === 'teacher' && (
                                                <motion.p 
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="mt-3 text-xs text-amber-600 font-bold bg-amber-50/80 backdrop-blur-sm p-3 rounded-xl border border-amber-200/60 leading-relaxed shadow-sm"
                                                >
                                                    Note: Teacher accounts require manual approval by an administrator after signup.
                                                </motion.p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-violet-600/20 text-lg font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                        >
                                            {isLoading ? (
                                                <span className="flex items-center">
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Creating Account...
                                                </span>
                                            ) : (
                                                <span className="flex items-center">
                                                    Create Account <ArrowRight className="ml-2" size={20} />
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {!successMsg && (
                                <>
                                    <div className="mt-8 pt-2">
                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-slate-200/60"></div>
                                            </div>
                                            <div className="relative flex justify-center text-sm">
                                                <span className="px-4 bg-transparent text-slate-400 font-bold uppercase tracking-wider text-xs">Or signup with</span>
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
                                                    console.error('Google Signup Failed');
                                                }}
                                                theme="outline"
                                                size="large"
                                                text="signup_with"
                                                width="100%"
                                                shape="pill"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-10 pt-6 border-t border-slate-100/50 flex flex-wrap items-center justify-center gap-4 text-slate-400">
                                        <div className="flex items-center text-xs font-bold tracking-wide">
                                            <CheckCircle2 size={16} className="mr-1.5 text-emerald-500" /> Free Trial
                                        </div>
                                        <div className="flex items-center text-xs font-bold tracking-wide">
                                            <CheckCircle2 size={16} className="mr-1.5 text-emerald-500" /> Fast Setup
                                        </div>
                                    </div>

                                    <p className="mt-8 text-center text-sm font-semibold text-slate-500">
                                        Already part of Gurukul?{' '}
                                        <Link to="/login" className="font-bold text-violet-600 hover:text-violet-700 transition-colors hover:underline underline-offset-4">
                                            Sign in instead
                                        </Link>
                                    </p>
                                </>
                            )}
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
