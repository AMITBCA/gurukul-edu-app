import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

const stories = [
  {
    name: "Aarav Patel",
    exam: "JEE Advanced 2025",
    rank: "AIR 15",
    score: "315/360",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    quote: "Gurukul's material and daily mock tests made the real exam feel like just another practice session."
  },
  {
    name: "Sneha Desai",
    exam: "NEET UG 2025",
    rank: "AIR 24",
    score: "710/720",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    quote: "The NCERT line-by-line coverage and 24/7 doubt solving App by Gurukul was the key to my success."
  },
  {
    name: "Rohan Gupta",
    exam: "JEE Main 2025",
    rank: "99.99 %ile",
    score: "295/300",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    quote: "Exceptional faculty and well-planned study curriculum helped me achieve a perfect score in Mathematics."
  }
];

const SuccessStories = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
        <section className="py-16 sm:py-24 bg-indigo-950 relative z-10 w-full overflow-hidden rounded-[3rem] shadow-2xl border border-indigo-800/50">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-600/30 rounded-full blur-[100px] transform translate-x-1/3 -translate-y-1/3 mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[100px] transform -translate-x-1/3 translate-y-1/3 mix-blend-screen"></div>

        <div className="max-w-7xl mx-auto w-full relative z-10 px-4 sm:px-8">
            <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
            >
            <div className="flex justify-center mb-6">
                <div className="p-4 bg-indigo-900/50 border border-indigo-700/50 rounded-2xl shadow-inner backdrop-blur-sm">
                    <Trophy className="text-yellow-400 w-10 h-10" />
                </div>
            </div>
            <h2 className="text-yellow-400 font-bold tracking-widest uppercase mb-3 text-sm">Wall of Fame</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[1.15]">
                Our Legacy of Champions
            </h3>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {stories.map((story, index) => (
                <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white/5 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 rounded-[2.5rem] flex flex-col items-center text-center relative mt-6 hover:bg-white/10 transition-colors duration-500 group"
                >
                <div className="absolute -top-12 p-2 bg-indigo-950 rounded-full border border-indigo-800/50 shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <img 
                        src={story.image} 
                        alt={story.name} 
                        className="w-20 h-20 sm:w-20 sm:h-20 rounded-full object-cover"
                    />
                </div>
                
                <div className="mt-12 mb-5">
                    <h4 className="text-2xl font-black text-white mb-2 tracking-tight">{story.name}</h4>
                    <div className="bg-yellow-400/20 border border-yellow-400/30 text-yellow-300 text-xs font-bold px-3 py-1.5 rounded-full inline-block backdrop-blur-sm">
                    {story.exam}
                    </div>
                </div>
                <p className="text-indigo-100/90 italic mb-8 font-medium leading-relaxed px-2">"{story.quote}"</p>
                
                <div className="mt-auto border-t border-white/10 pt-5 w-full flex justify-between items-center px-4 bg-white/5 rounded-2xl p-4">
                    <div className="text-left">
                    <div className="text-indigo-300/80 text-[10px] sm:text-xs uppercase font-bold tracking-widest mb-1">Rank</div>
                    <div className="text-xl sm:text-2xl font-black text-yellow-400 drop-shadow-md">{story.rank}</div>
                    </div>
                    <div className="h-10 w-px bg-white/10"></div>
                    <div className="text-right">
                    <div className="text-indigo-300/80 text-[10px] sm:text-xs uppercase font-bold tracking-widest mb-1">Score</div>
                    <div className="text-xl sm:text-2xl font-black text-white drop-shadow-md">{story.score}</div>
                    </div>
                </div>
                </motion.div>
            ))}
            </div>
        </div>
        </section>
    </div>
  );
};

export default SuccessStories;
