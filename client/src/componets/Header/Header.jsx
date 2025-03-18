import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  console.log("user:- ",user);
  
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    logout(null); 
    navigate('/signin'); 
  };
  
  return (
    <header className="bg-white border-b border-gray-100 py-4">
      <div className="flex justify-between items-center max-w-6xl mx-auto px-6">
        <Link to="/" className="transition-transform hover:scale-105">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap tracking-tight">
            <span className="text-black font-black">WAC</span>
            <span className="text-gray-500">Rooms</span>
          </h1>
        </Link>

        <nav>
          <ul className="flex gap-8 items-center">
            <Link to="/">
              <li className="hidden sm:inline text-gray-800 hover:text-black font-medium transition-colors text-sm uppercase tracking-wide">
                Home
              </li>
            </Link>
            <Link to="/about">
              <li className="hidden sm:inline text-gray-800 hover:text-black font-medium transition-colors text-sm uppercase tracking-wide">
                About
              </li>
            </Link>
            
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="text-gray-800 hover:text-black font-medium text-sm tracking-wide border-b border-gray-300 hover:border-black transition-colors pb-1 flex items-center"
                >
                  {user.email}
                  <svg 
                    className={`ml-1 h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 shadow-lg rounded-sm z-10">
                    <Link to="/profile">
                      <div className="px-4 py-3 text-sm text-gray-800 hover:bg-gray-50 cursor-pointer">
                        User Profile
                      </div>
                    </Link>
                    <div 
                      onClick={handleSignOut}
                      className="px-4 py-3 text-sm text-gray-800 hover:bg-gray-50 border-t border-gray-100 cursor-pointer"
                    >
                      Sign out
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/signin">
                <li className="bg-black text-white px-5 py-2 text-sm font-medium hover:bg-gray-800 transition-colors">
                  Sign in
                </li>
              </Link>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}