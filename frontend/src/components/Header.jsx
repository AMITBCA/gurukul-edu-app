import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../assets/logo.png';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        handleScroll(); // Check immediately on mount
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Courses', path: '#courses' },
        { name: 'About Us', path: '#about' },
        { name: 'Contact', path: '#contact' }
    ];

    return (
        <header 
            className={`fixed w-full z-50 transition-all duration-500 ${
                scrolled 
                ? 'bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 shadow-xl shadow-indigo-500/20 py-3' 
                : 'bg-gradient-to-r from-indigo-600/95 via-violet-600/95 to-purple-600/95 backdrop-blur-md shadow-lg border-b border-white/10 py-4 lg:py-5'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group cursor-pointer w-fit">
                        <div className="bg-white p-1 rounded-2xl shadow-lg shadow-black/10 border border-white/50 w-12 h-12 sm:w-14 sm:h-14 flex shrink-0 items-center justify-center transform transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-indigo-500/40">
                            <img src={logo} alt="Gurukul Excellence Logo" className="w-full h-full object-contain mix-blend-multiply scale-110" />
                        </div>
                        <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-indigo-100 transition-all duration-300 drop-shadow-sm">
                            Gurukul Excellence
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <div className="flex space-x-8">
                            {navLinks.map((link) => (
                                <a 
                                    key={link.name}
                                    href={link.path}
                                    className="text-white/90 font-bold tracking-wide hover:text-white transition-colors duration-300 relative group text-sm lg:text-base py-2"
                                >
                                    {link.name}
                                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
                                </a>
                            ))}
                        </div>
                    </nav>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link 
                            to="/login" 
                            className="text-white hover:text-indigo-100 font-bold transition-all duration-300 text-sm lg:text-base px-6 py-2.5 rounded-xl border border-white/30 hover:bg-white/10"
                        >
                            Log In
                        </Link>
                        <Link 
                            to="/register" 
                            className="px-6 py-2.5 bg-white text-indigo-700 font-black tracking-wide rounded-xl shadow-lg hover:shadow-xl hover:bg-indigo-50 transform hover:-translate-y-0.5 active:scale-95 transition-all duration-300 text-sm lg:text-base"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-white hover:text-indigo-100 focus:outline-none p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 transition-all active:scale-95 shadow-sm"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <div 
                className={`md:hidden absolute top-full left-0 w-full bg-indigo-700/95 backdrop-blur-3xl border-t border-indigo-500/50 shadow-2xl transition-all duration-300 origin-top overflow-hidden ${mobileMenuOpen ? 'scale-y-100 opacity-100 max-h-[500px]' : 'scale-y-0 opacity-0 max-h-0'}`}
            >
                <div className="px-6 pt-4 pb-8 space-y-2">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.path}
                            className="block px-4 py-3.5 text-white/90 font-bold tracking-wide hover:text-white hover:bg-indigo-600/50 rounded-2xl transition-colors border border-transparent hover:border-indigo-400/30"
                        >
                            {link.name}
                        </a>
                    ))}
                    <div className="pt-6 mt-4 border-t border-indigo-500/50 flex flex-col gap-3">
                        <Link 
                            to="/login"
                            className="block w-full text-center px-4 py-3.5 text-white font-bold border border-white/30 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors"
                        >
                            Log In
                        </Link>
                        <Link 
                            to="/register"
                            className="block w-full text-center px-4 py-3.5 bg-white text-indigo-700 font-bold rounded-2xl shadow-lg active:scale-95 transition-all"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
