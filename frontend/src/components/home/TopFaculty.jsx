import React from 'react';
import { motion } from 'framer-motion';

const faculties = [
  {
    name: "Dr. Alok Sharma",
    subject: "Physics Expert",
    experience: "15+ Years",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    graduatedFrom: "IIT Delhi"
  },
  {
    name: "Mrs. Nita Verma",
    subject: "Chemistry HOD",
    experience: "12+ Years",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    graduatedFrom: "IIT Bombay"
  },
  {
    name: "Mr. Rakesh Singh",
    subject: "Mathematics Maestro",
    experience: "18+ Years",
    image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    graduatedFrom: "NIT Trichy"
  },
  {
    name: "Dr. Kavita Joshi",
    subject: "Biology HOD",
    experience: "20+ Years",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    graduatedFrom: "AIIMS Delhi"
  }
];

const TopFaculty = () => {
  return (
    <section className="py-16 sm:py-24 bg-transparent relative z-10 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 max-w-2xl mx-auto"
        >
          <h2 className="inline-block px-4 py-1.5 rounded-full bg-indigo-50/80 backdrop-blur-sm border border-indigo-100 text-indigo-700 font-bold tracking-widest uppercase mb-4 text-xs shadow-sm">
            Our Mentors
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-[1.15] mb-4">
            Learn from the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Best in India</span>
          </h3>
          <p className="mt-4 text-slate-600 font-semibold text-lg leading-relaxed">
            Our faculty consists of top IITians, NITians, and Doctors who have produced double-digit ranks over the years.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {faculties.map((faculty, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="bg-white/70 backdrop-blur-xl rounded-[2rem] overflow-hidden shadow-xl shadow-indigo-900/5 border border-white/60 group hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="h-64 overflow-hidden relative m-2 rounded-[1.5rem]">
                <img 
                  src={faculty.image} 
                  alt={faculty.name} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-left">
                  <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm">
                    {faculty.experience} Exp
                  </span>
                </div>
              </div>
              <div className="p-6 text-center">
                <h4 className="text-xl font-black text-slate-900 mb-1 tracking-tight">{faculty.name}</h4>
                <p className="text-indigo-600 font-bold text-sm mb-4">{faculty.subject}</p>
                <div className="text-sm text-slate-500 font-medium border-t border-slate-200/60 pt-4">
                  Alumnus of <span className="font-bold text-slate-800">{faculty.graduatedFrom}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopFaculty;
