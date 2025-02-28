
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 lg:px-8',
        isScrolled ? 'py-3 bg-white/95 backdrop-blur-md shadow-subtle' : 'py-5 bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className={cn(
            'text-2xl font-montserrat font-bold text-indigo tracking-tight',
            'transition-all duration-300'
          )}>
            Nihongo Journey
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/courses"
            className="text-gray-600 hover:text-indigo transition-colors duration-200"
          >
            Courses
          </Link>
          <Link
            to="/resources"
            className="text-gray-600 hover:text-indigo transition-colors duration-200"
          >
            Resources
          </Link>
          <Link
            to="/about"
            className="text-gray-600 hover:text-indigo transition-colors duration-200"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-gray-600 hover:text-indigo transition-colors duration-200"
          >
            Contact
          </Link>
          {user && (
            <Link
              to="/dashboard"
              className="text-indigo font-medium hover:text-vermilion transition-colors duration-200"
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Login/Signup buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <Button 
              variant="outline" 
              className="border-indigo text-indigo hover:bg-indigo hover:text-white"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="border-indigo text-indigo hover:bg-indigo hover:text-white"
                onClick={() => navigate('/auth')}
              >
                Log In
              </Button>
              <Button 
                className="bg-vermilion hover:bg-vermilion/90 text-white"
                onClick={() => navigate('/auth', { state: { tab: 'register' } })}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-indigo"
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

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden fixed left-0 right-0 bg-white shadow-lg transition-all duration-300 ease-in-out overflow-hidden',
          isMobileMenuOpen ? 'max-h-[500px] py-4' : 'max-h-0 py-0',
        )}
      >
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <Link
            to="/courses"
            className="block py-2 text-gray-600 hover:text-indigo"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Courses
          </Link>
          <Link
            to="/resources"
            className="block py-2 text-gray-600 hover:text-indigo"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Resources
          </Link>
          <Link
            to="/about"
            className="block py-2 text-gray-600 hover:text-indigo"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="block py-2 text-gray-600 hover:text-indigo"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </Link>
          {user && (
            <Link
              to="/dashboard"
              className="block py-2 text-indigo font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}
          <div className="pt-4 pb-2 flex flex-col space-y-3">
            {user ? (
              <Button 
                variant="outline" 
                className="w-full border-indigo text-indigo hover:bg-indigo hover:text-white"
                onClick={() => {
                  handleSignOut();
                  setIsMobileMenuOpen(false);
                }}
              >
                Sign Out
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="w-full border-indigo text-indigo hover:bg-indigo hover:text-white"
                  onClick={() => {
                    navigate('/auth');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Log In
                </Button>
                <Button 
                  className="w-full bg-vermilion hover:bg-vermilion/90 text-white"
                  onClick={() => {
                    navigate('/auth', { state: { tab: 'register' } });
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
