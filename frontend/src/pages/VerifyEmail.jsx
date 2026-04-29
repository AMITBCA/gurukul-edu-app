import { useEffect, useState, useContext, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const VerifyEmail = () => {
    const { token } = useParams();
    const { verifyEmailToken } = useContext(AuthContext);
    const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
    const [message, setMessage] = useState('');
    const hasVerified = useRef(false);

    useEffect(() => {
        if (hasVerified.current) return;
        hasVerified.current = true;

        const verify = async () => {
            const response = await verifyEmailToken(token);
            if (response.success) {
                setStatus('success');
                setMessage(response.message);
            } else {
                setStatus('error');
                setMessage(response.message);
            }
        };
        verify();
    }, [token, verifyEmailToken]);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center"
            >
                {status === 'loading' && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mb-6" />
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Verifying Email</h2>
                        <p className="text-slate-500 font-medium">Please wait while we verify your account...</p>
                    </div>
                )}
                
                {status === 'success' && (
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Verified Successfully!</h2>
                        <p className="text-slate-500 font-medium mb-8">{message}</p>
                        <Link 
                            to="/login" 
                            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-indigo-200"
                        >
                            Continue to Login
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                            <XCircle className="w-10 h-10 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Verification Failed</h2>
                        <p className="text-slate-500 font-medium mb-8">{message}</p>
                        <Link 
                            to="/register" 
                            className="w-full py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                        >
                            Back to Registration
                        </Link>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default VerifyEmail;
