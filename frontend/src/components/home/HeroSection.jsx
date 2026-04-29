import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PlayCircle, ArrowRight, CheckCircle, Star, Sparkles } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-transparent">
      {/* Note: The global App.jsx animated background orbs give this area its dynamic feel */}
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-indigo-200 text-indigo-800 text-xs sm:text-sm font-bold mb-6 sm:mb-8 shadow-sm"
            >
              <Sparkles className="w-4 h-4 mr-2 text-indigo-600 animate-pulse" />
              Admissions Open for 2026-27 Batches
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 tracking-tight mb-4 sm:mb-6 leading-[1.1]">
              Crack JEE & NEET with<br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 relative">
                 India's Top Educators
                 <svg className="absolute w-full h-4 -bottom-2 left-0 text-indigo-200/50" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 15 100 5 L 100 10 L 0 10" fill="currentColor"></path>
                 </svg>
              </span>
            </h1>

            <p className="mt-3 sm:mt-4 text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 mb-8 sm:mb-10 leading-relaxed font-semibold">
              Join Gurukul Excellence to experience institution-grade learning, 24/7 doubt solving, premium study materials, and rigorous mock test series. Your success story starts here.
            </p>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
              <Link
                to="/register"
                className="group relative flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold rounded-full text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all shadow-[0_0_30px_-5px_rgba(79,70,229,0.4)] hover:shadow-[0_0_40px_-5px_rgba(79,70,229,0.6)] hover:-translate-y-1"
              >
                <span>Start Learning Now</span>
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <button className="group flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold rounded-full text-indigo-700 bg-white/70 backdrop-blur-sm border-2 border-indigo-100 hover:border-indigo-300 hover:bg-white transition-all hover:-translate-y-1 shadow-sm">
                <PlayCircle className="text-indigo-600 mr-2 group-hover:scale-110 transition-transform" size={24} />
                Watch Demo Action
              </button>
            </div>

            {/* Trust Badge */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4 text-sm font-semibold text-slate-600"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img key={i} className="w-10 h-10 rounded-full border-2 border-slate-50 object-cover shadow-sm" src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="Student" />
                ))}
              </div>
              <div className="flex flex-col bg-white/50 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/40">
                <div className="flex items-center text-amber-400 mb-1">
                   <Star size={16} className="fill-current" /><Star size={16} className="fill-current" /><Star size={16} className="fill-current" /><Star size={16} className="fill-current" /><Star size={16} className="fill-current" />
                </div>
                <span>Trusted by <strong className="text-indigo-700">10,000+</strong> Students</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Visual / Graphic Section */}
          <motion.div 
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mx-auto w-full max-w-lg lg:max-w-none"
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-indigo-600/20 border border-white/50 bg-white/40 backdrop-blur-sm group p-2">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="Students studying"
                className="w-full h-auto object-cover rounded-[1.5rem] transform group-hover:scale-[1.02] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent rounded-[1.5rem] m-2"></div>
              
              {/* Floating Badges */}
              <motion.div 
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 bg-white/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-xl border border-white/60"
              >
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="bg-emerald-100 p-2 sm:p-3 rounded-xl shadow-inner border border-emerald-200">
                    <CheckCircle className="text-emerald-600 sm:w-6 sm:h-6 w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900 tracking-tight">AIR 1 in JEE</div>
                    <div className="text-xs text-slate-500 font-bold tracking-wider uppercase mt-0.5">3 Consecutive Years</div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-6 right-6 sm:top-8 sm:right-8 bg-white/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-xl border border-white/60"
              >
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-2 sm:p-2.5 rounded-xl text-white shadow-lg">
                    <span className="font-black text-base sm:text-lg">710+</span>
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900 tracking-tight">NEET Target</div>
                    <div className="text-xs text-slate-500 font-bold tracking-wider uppercase mt-0.5">Highest Achieved</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
