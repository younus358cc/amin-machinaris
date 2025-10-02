import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, Phone, LogIn, LogOut, User, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginModal from './LoginModal';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const loginStatus = localStorage.getItem('aminmachinaris_logged_in');
    if (loginStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'bn' : 'en';
    i18n.changeLanguage(newLang);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginResult = (success: boolean) => {
    if (success) {
      setIsLoggedIn(true);
      localStorage.setItem('aminmachinaris_logged_in', 'true');
      setLoginMessage('সফলভাবে লগইন হয়েছে!');
      
      // Navigate to invoicing page after successful login
      setTimeout(() => {
        navigate('/invoicing');
      }, 1500);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setLoginMessage('');
      }, 3000);
    } else {
      setLoginMessage('লগইন ব্যর্থ হয়েছে!');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setLoginMessage('');
      }, 3000);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('aminmachinaris_logged_in');
    setLoginMessage('সফলভাবে লগআউট হয়েছে!');
    
    // Navigate to home page after logout
    navigate('/');
    
    // Clear logout message after 3 seconds
    setTimeout(() => {
      setLoginMessage('');
    }, 3000);
  };

  const navItems = [
    { to: '/', text: t('navigation.home') },
    { to: '/about', text: t('navigation.about') },
    { to: '/products', text: t('navigation.products') },
    { to: '/services', text: t('navigation.services') },
    { to: '/contact', text: t('navigation.contact') },
  ];

  return (
    <>
      <header 
        className={`fixed w-full z-40 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-blue-600"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m16 8-8 8" />
                <path d="m8 8 8 8" />
              </svg>
              <span className={`text-xl font-bold ${scrolled ? 'text-blue-600' : 'text-white'}`}>
                আমিন মেশিনারিজ
              </span>
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => 
                    `text-lg font-medium transition-colors hover:text-blue-500 ${
                      isActive 
                        ? 'text-blue-600' 
                        : scrolled ? 'text-gray-800' : 'text-white'
                    }`
                  }
                >
                  {item.text}
                </NavLink>
              ))}
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-1 text-lg font-medium hover:text-blue-500"
              >
                <Globe size={20} className={scrolled ? 'text-gray-800' : 'text-white'} />
                <span className={scrolled ? 'text-gray-800' : 'text-white'}>
                  {i18n.language === 'en' ? 'বাংলা' : 'EN'}
                </span>
              </button>
              
              {/* Login/Logout Button */}
              {isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/invoicing"
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Calculator size={18} />
                    <span>অ্যাকাউন্টিং</span>
                  </Link>
                  <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg">
                    <User size={16} />
                    <span className="text-sm font-medium">অ্যাডমিন</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <LogOut size={18} />
                    <span>লগআউট</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <LogIn size={18} />
                  <span>লগইন</span>
                </button>
              )}
              
              <Link
                to="/contact"
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Phone size={18} />
                <span>01912658599</span>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              {/* Mobile Login Button */}
              {isLoggedIn ? (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/invoicing"
                    className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1.5 rounded-lg transition-colors text-sm"
                  >
                    <Calculator size={14} />
                    <span>অ্যাকাউন্টিং</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1.5 rounded-lg transition-colors text-sm"
                  >
                    <LogOut size={14} />
                    <span>লগআউট</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1.5 rounded-lg transition-colors text-sm"
                >
                  <LogIn size={14} />
                  <span>লগইন</span>
                </button>
              )}
              
              <Link
                to="/contact"
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors text-sm"
              >
                <Phone size={16} />
                <span>কল করুন</span>
              </Link>
              <button 
                className="text-2xl"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className={scrolled ? 'text-gray-800' : 'text-white'} />
                ) : (
                  <Menu className={scrolled ? 'text-gray-800' : 'text-white'} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white shadow-lg overflow-hidden"
            >
              <div className="container mx-auto px-4 py-4">
                <nav className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) => 
                        `text-lg font-medium transition-colors hover:text-blue-500 ${
                          isActive ? 'text-blue-600' : 'text-gray-800'
                        }`
                      }
                      onClick={closeMenu}
                    >
                      {item.text}
                    </NavLink>
                  ))}
                  <button
                    onClick={() => {
                      toggleLanguage();
                      closeMenu();
                    }}
                    className="flex items-center space-x-1 text-lg font-medium text-gray-800 hover:text-blue-500"
                  >
                    <Globe size={20} />
                    <span>{i18n.language === 'en' ? 'বাংলা' : 'EN'}</span>
                  </button>
                  
                  {/* Mobile Admin Status */}
                  {isLoggedIn && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-2 rounded-lg">
                        <User size={16} />
                        <span className="text-sm font-medium">অ্যাডমিন হিসেবে লগইন</span>
                      </div>
                      <Link
                        to="/invoicing"
                        onClick={closeMenu}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors"
                      >
                        <Calculator size={16} />
                        <span>অ্যাকাউন্টিং সিস্টেম</span>
                      </Link>
                    </div>
                  )}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Login Status Message */}
      <AnimatePresence>
        {loginMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm"
          >
            <div className={`flex items-center space-x-2 ${
              loginMessage.includes('সফলভাবে') ? 'text-green-600' : 'text-red-600'
            }`}>
              {loginMessage.includes('সফলভাবে') ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                >
                  <X size={12} color="white" />
                </motion.div>
              )}
              <span className="font-medium">{loginMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLoginResult}
      />
    </>
  );
};

export default Header;