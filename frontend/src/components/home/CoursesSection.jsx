import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Stethoscope, Compass, ArrowRight } from 'lucide-react';

const courses = [
  {
    title: "JEE (Main + Advanced)",
    description: "Comprehensive coaching for Engineering aspirants. Includes DPPs, mock tests, and live classes.",
    icon: <Compass className="text-white" size={32} />,
    color: "from-indigo-500 to-indigo-600",
    shadowHover: "hover:shadow-indigo-500/30",
    borderHover: "hover:border-indigo-300",
    linkText: "Explore JEE Courses"
  },
  {
    title: "NEET (UG)",
    description: "Expert guidance for Medical students. Focused NCERT coverage with advanced problem solving.",
    icon: <Stethoscope className="text-white" size={32} />,
    color: "from-pink-500 to-rose-500",
    shadowHover: "hover:shadow-pink-500/30",
    borderHover: "hover:border-pink-300",
    linkText: "Explore NEET Courses"
  },
  {
    title: "Foundation & Boards",
    description: "Strong base building for Class 8th to 10th. Olympiad level preparation with school curriculum.",
    icon: <BookOpen className="text-white" size={32} />,
    color: "from-emerald-500 to-teal-500",
    shadowHover: "hover:shadow-emerald-500/30",
    borderHover: "hover:border-emerald-300",
    linkText: "Explore Foundation"
  }
];

const CoursesSection = () => {
  return (
    <section className="py-16 sm:py-24 bg-transparent relative z-10 w-full" id="courses">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-indigo-50/80 backdrop-blur-sm border border-indigo-100 text-indigo-700 font-bold tracking-widest uppercase mb-4 text-xs shadow-sm"
          >
            Target Exams
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-[1.15]"
          >
            What are you <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">preparing for?</span>
          </motion.h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`p-6 sm:p-8 rounded-[2rem] border-[1.5px] border-white/60 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer bg-white/70 backdrop-blur-xl shadow-xl ${course.shadowHover} ${course.borderHover}`}
            >
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-[1.25rem] flex items-center justify-center mb-6 sm:mb-8 bg-gradient-to-br ${course.color} shadow-lg shadow-current/20`}>
                {course.icon}
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 tracking-tight">{course.title}</h4>
              <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8 font-semibold leading-relaxed">
                {course.description}
              </p>
              <div className="flex items-center text-sm sm:text-base text-indigo-700 font-bold group">
                {course.linkText} 
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
