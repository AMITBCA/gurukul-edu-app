import { Link } from 'react-router-dom';
import { BookOpen, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer id="contact" className="bg-slate-950 pt-20 pb-10 border-t border-slate-800 relative z-10 selection:bg-indigo-500 selection:text-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center space-x-2 text-white mb-6 group w-fit">
                            <BookOpen size={28} className="text-indigo-500 group-hover:scale-110 transition-transform" />
                            <span className="text-2xl font-black tracking-tight group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-violet-400 transition-all">
                                Gurukul<br /><span className="text-indigo-500 group-hover:text-transparent">Excellence</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 leading-relaxed mb-6 font-medium text-sm">
                            Empowering the next generation of achievers with state-of-the-art digital learning management for JEE & NEET.
                        </p>
                        <div className="flex space-x-4 ml-1">
                            <a href="#" className="p-2 bg-slate-900 rounded-full text-slate-400 hover:text-white hover:bg-indigo-600 hover:-translate-y-1 transition-all"><Facebook size={18} /></a>
                            <a href="#" className="p-2 bg-slate-900 rounded-full text-slate-400 hover:text-white hover:bg-sky-500 hover:-translate-y-1 transition-all"><Twitter size={18} /></a>
                            <a href="#" className="p-2 bg-slate-900 rounded-full text-slate-400 hover:text-white hover:bg-pink-600 hover:-translate-y-1 transition-all"><Instagram size={18} /></a>
                            <a href="#" className="p-2 bg-slate-900 rounded-full text-slate-400 hover:text-white hover:bg-indigo-700 hover:-translate-y-1 transition-all"><Linkedin size={18} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-black mb-6 text-lg tracking-wide">Quick Links</h4>
                        <ul className="space-y-4">
                            <li><Link to="/about" className="text-slate-400 hover:text-indigo-400 transition-colors font-medium">About Us</Link></li>
                            <li><Link to="/courses" className="text-slate-400 hover:text-indigo-400 transition-colors font-medium">Our Courses</Link></li>
                            <li><Link to="/features" className="text-slate-400 hover:text-indigo-400 transition-colors font-medium">Platform Features</Link></li>
                            <li><Link to="/pricing" className="text-slate-400 hover:text-indigo-400 transition-colors font-medium">Pricing Plans</Link></li>
                            <li><Link to="/contact" className="text-slate-400 hover:text-indigo-400 transition-colors font-medium">Contact Support</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-white font-black mb-6 text-lg tracking-wide">Resources</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors font-medium">JEE Study Material</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors font-medium">NEET Preparation</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors font-medium">Mock Tests</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors font-medium">Video Library</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors font-medium">Student Blog</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-black mb-6 text-lg tracking-wide">Contact Us</h4>
                        <ul className="space-y-5">
                            <li className="flex items-start space-x-3 text-slate-400 font-medium">
                                <div className="p-2 bg-slate-900 rounded-lg group hover:bg-indigo-900/40 transition-colors border border-slate-800">
                                    <MapPin size={18} className="text-indigo-400 shrink-0" />
                                </div>
                                <span className="text-sm leading-relaxed pt-1">Over Sabarmati Gas office, Pavan City, 3rd floor, Sun arcade, D.P.Road, B/H, Modasa, Gujarat 383315</span>
                            </li>
                            <li className="flex items-center space-x-3 text-slate-400 font-medium">
                                <div className="p-2 bg-slate-900 rounded-lg group hover:bg-indigo-900/40 transition-colors border border-slate-800">
                                    <Phone size={18} className="text-indigo-400 shrink-0" />
                                </div>
                                <span className="text-sm">+91 9909758566</span>
                            </li>
                            <li className="flex items-center space-x-3 text-slate-400 font-medium">
                                <div className="p-2 bg-slate-900 rounded-lg group hover:bg-indigo-900/40 transition-colors border border-slate-800">
                                    <Mail size={18} className="text-indigo-400 shrink-0" />
                                </div>
                                <span className="text-sm">hsoni1443@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center">
                    <div className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} Gurukul Excellence. All rights reserved.
                    </div>
                    <div className="flex space-x-6 text-sm font-bold text-slate-500">
                        <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
