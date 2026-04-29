import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/home/HeroSection';
import CoursesSection from '../components/home/CoursesSection';
import WhyChooseUs from '../components/home/WhyChooseUs';
import TopFaculty from '../components/home/TopFaculty';
import SuccessStories from '../components/home/SuccessStories';
import SEO from '../components/SEO';

const Home = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-200 selection:text-indigo-900 overflow-x-hidden">
            <SEO title="Home" description="Gurukul Excellence - The best coaching institute for JEE & NEET." />
            <Header />
            
            <main className="flex-grow">
                {/* Hero Section */}
                <HeroSection />
                
                {/* Target Courses & Exams */}
                <CoursesSection />
                
                {/* Why Choose Gurukul */}
                <WhyChooseUs />
                
                {/* Top Faculties */}
                <TopFaculty />
                
                {/* Success Stories / Wall of Fame */}
                <SuccessStories />

            </main>

            <Footer />
        </div>
    );
};

export default Home;
