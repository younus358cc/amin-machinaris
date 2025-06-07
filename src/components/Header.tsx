import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  const navItems = [
    { to: '/', text: t('navigation.home') },
    { to: '/about', text: t('navigation.about') },
    { to: '/products', text: t('navigation.products') },
    { to: '/services', text: t('navigation.services') },
    { to: '/contact', text: t('navigation.contact') },
  ];

  return (
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
              অমিন মেশিনারিজ
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
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;