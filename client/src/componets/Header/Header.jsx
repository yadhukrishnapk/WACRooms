import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignOut = () => {
    logout(null); 
    navigate('/signin'); 
  };
  
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-4">
        <Link to="/" className="transition-transform hover:scale-105">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap tracking-tight">
            <span className="text-black font-black">WAC</span>
            <span className="text-gray-500">Rooms</span>
          </h1>
        </Link>

        <form
          onSubmit={handleSubmit}
          className="relative bg-gray-50 border border-gray-300 rounded-full flex items-center px-4 py-2 focus-within:border-gray-600 transition-all duration-200 mx-2 flex-1 max-w-md"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-full text-sm text-gray-800 placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="ml-2 p-1 rounded-full hover:bg-gray-200 transition-colors">
            <FaSearch className="text-gray-600" />
          </button>
        </form>

        <nav>
          <ul className="flex gap-6 items-center">
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
            {/* <p className="text-gray-800 font-medium text-sm uppercase tracking-wide">
              {user ? `Welcome, ${user.email}` : 'Welcome, Guest'}
            </p> */}
            {user ? (
              <li
                onClick={handleSignOut}
                className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer"
              >
                Sign out
              </li>
            ) : (
              <Link to="/signin" className="ml-2">
                <li className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-black transition-colors">
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