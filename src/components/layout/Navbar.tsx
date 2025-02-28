import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import NavLinks from './navbar/NavLinks';
import AuthButtons from './navbar/AuthButtons';
import MobileMenu from './navbar/MobileMenu';
import DarkModeToggle from './navbar/DarkModeToggle';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Set a throttled scroll handler to prevent excessive state updates
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 20) {
            if (!isScrolled) setIsScrolled(true);
          } else {
            if (isScrolled) setIsScrolled(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    // Add click handler to close dropdowns when clicking outside
    const handleDocumentClick = () => {
      // This will be picked up by NavLinks component to close dropdown
      document.dispatchEvent(new CustomEvent('closeDropdowns'));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('click', handleDocumentClick);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [isScrolled]);
  
  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 lg:px-8',
        isScrolled 
          ? 'py-3 bg-white/95 dark:bg-indigo/95 backdrop-blur-md shadow-subtle' 
          : 'py-5 bg-transparent'
      )}
      style={{
        willChange: 'transform, opacity, background',
        transform: 'translateZ(0)',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className={cn(
            'text-2xl font-montserrat font-bold text-indigo dark:text-white tracking-tight',
            'transition-all duration-300'
          )}>
            Nihongo Journey
          </span>
        </Link>

        {/* Desktop Navigation */}
        <NavLinks user={user} className="hidden md:flex" />

        <div className="hidden md:flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <DarkModeToggle />
          
          {/* Login/Signup buttons */}
          <AuthButtons 
            user={user} 
            className="flex" 
            navigate={navigate} 
          />
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <DarkModeToggle className="mr-4" />
          <button
            className="text-indigo dark:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18"></path>
                <path d="M6 6L18 18"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" x2="20" y1="12" y2="12"></line>
                <line x1="4" x2="20" y1="6" y2="6"></line>
                <line x1="4" x2="20" y1="18" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        setIsOpen={setIsMobileMenuOpen} 
        user={user} 
        navigate={navigate} 
      />
    </header>
  );
};

export default Navbar;
