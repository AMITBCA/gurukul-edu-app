import React from 'react';
import { motion } from 'framer-motion';
import { MonitorPlay, MessageCircleQuestion, FileText, BarChart3 } from 'lucide-react';

const features = [
  {
    title: "Live Interactive Classes",
    description: "Attend daily live classes with real-time doubt clearing. Missed a class? Watch recordings anytime.",
    icon: <MonitorPlay className="w-7 h-7 text-white" />,
    color: "from-sky-500 to-indigo-500"
  },
  {
    title: "24/7 Doubt Resolution",
    description: "Stuck on a problem? Our expert faculties and AI assistant provide instant solutions to your queries.",
    icon: <MessageCircleQuestion className="w-7 h-7 text-white" />,
    color: "from-violet-500 to-purple-500"
  },
  {
    title: "Premium Study Material",
    description: "Get access to top-notch DPPs, handwritten notes, and comprehensive modules designed by experts.",
    icon: <FileText className="w-7 h-7 text-white" />,
    color: "from-rose-500 to-pink-500"
  },
  {
    title: "All India Test Series",
    description: "Compete globally. Detailed graphical analytics to identify weaknesses and improve accuracy.",
    icon: <BarChart3 className="w-7 h-7 text-white" />,
    color: "from-emerald-500 to-teal-500"
  }
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 sm:py-24 bg-transparent relative z-10 w-full overflow-hidden" id="about">
      {/* Subtle Background Accent for this specific section */}
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-200/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <h2 className="inline-block px-4 py-1.5 rounded-full bg-indigo-50/80 backdrop-blur-sm border border-indigo-100 text-indigo-700 font-bold tracking-widest uppercase mb-4 text-xs shadow-sm">
              Why Gurukul Excellence?
            </h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-[1.15] mb-5 sm:mb-6 tracking-tight">
              A Complete <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Ecosystem</span> <br className="hidden sm:block"/> for your Preparation
            </h3>
            <p className="text-base sm:text-lg text-slate-600 mb-8 sm:mb-10 leading-relaxed font-semibold">
              We don't just teach; we mentor. From conceptual clarity to final exam strategy, we provide everything a student needs under one digital roof.
            </p>
            
            <div className="flex items-center space-x-6 sm:space-x-8 bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-xl w-fit">
              <div className="flex flex-col">
                <span className="text-3xl sm:text-4xl font-black text-indigo-700 tracking-tight">5M+</span>
                <span className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider mt-1">Doubts Solved</span>
              </div>
              <div className="h-12 sm:h-14 w-px bg-slate-200/80"></div>
              <div className="flex flex-col">
                <span className="text-3xl sm:text-4xl font-black text-violet-600 tracking-tight">10k+</span>
                <span className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider mt-1">Selections</span>
              </div>
            </div>
          </motion.div>

          <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/70 backdrop-blur-xl p-6 rounded-[2rem] shadow-xl shadow-indigo-900/5 border border-white/60 hover:-translate-y-2 transition-transform duration-300"
              >
                <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center bg-gradient-to-br ${feature.color} mb-5 shadow-lg shadow-current/20`}>
                  {feature.icon}
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{feature.title}</h4>
                <p className="text-sm text-slate-600 font-semibold leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
