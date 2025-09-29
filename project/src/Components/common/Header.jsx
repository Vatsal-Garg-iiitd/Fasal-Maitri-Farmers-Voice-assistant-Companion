import React, { useState } from 'react';
import { FiMenu, FiX, FiUser, FiCalendar, FiUsers, FiHome, FiFileText, FiAward, FiMessageCircle } from 'react-icons/fi';
import { useTranslation } from '../../hooks/useTranslation';
import { useNavigate } from 'react-router-dom';

const Header = ({ userData }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Updated navigation handler for direct PDF opening
  const handleNavigation = (href, name) => {
    if (name === t('navigation.cropCalendar') || href === '/crop-calendar') {
      // Directly open PDF in new tab
      const pdfUrl = '/documents/crop-calendar.pdf';
      window.open(pdfUrl, '_blank');
    } else if (href.startsWith('/')) {
      navigate(href);
    } else {
      window.location.href = href;
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: t('navigation.home'), href: '/home', icon: <FiHome /> },
    { name: t('navigation.profile'), href: '/profile', icon: <FiUser /> },
    { name: t('navigation.cropCalendar'), href: '/crop-calendar', icon: <FiCalendar /> },
    { name: t('navigation.news'), href: '/news', icon: <FiFileText /> },
    { name: t('navigation.schemes'), href: '/schemes', icon: <FiAward /> },
    { name: t('navigation.community'), href: '/community', icon: <FiUsers /> },
  ];

  return (
    <header className="bg-gradient-to-r from-green-800 via-green-900 to-emerald-900 text-white shadow-2xl sticky top-0 z-50 border-b border-green-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div 
              className="text-2xl font-bold cursor-pointer hover:text-green-300 transition-all duration-300"
              onClick={() => navigate('/home')}
            >
              {t('home.title')}
            </div>
          </div>


          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMenu}
            className="p-2 hover:bg-green-700 transition-all duration-300 transform hover:scale-110 shadow-lg"
            style={{borderRadius: '8px'}}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="bg-gradient-to-br from-green-800 to-green-900 mt-2 shadow-2xl border border-green-600 overflow-hidden backdrop-blur-sm" style={{borderRadius: '8px'}}>
            <nav className="py-2">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(item.href, item.name)}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-green-700 transition-all duration-300 font-medium border-b border-green-700/50 last:border-b-0 w-full text-left"
                >
                  <div className="text-green-300">
                    {item.icon}
                  </div>
                  <span>{item.name}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
