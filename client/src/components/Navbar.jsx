import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-white/80 backdrop-blur-xl shadow-xl fixed w-full z-50 border-b border-white/20">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <img src={logo} alt="Smile Photo Studio" className="h-16 md:h-20 transition-transform group-hover:scale-105 drop-shadow-lg" />
          <span className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight drop-shadow-sm">Picture Smile Studio</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className={`text-gray-800 hover:text-pink-600 font-medium transition-colors duration-200 drop-shadow-sm ${location.pathname === '/' ? 'text-pink-600 font-semibold' : ''}`}>Home</Link>
          <Link to="/about" className={`text-gray-800 hover:text-pink-600 font-medium transition-colors duration-200 drop-shadow-sm ${location.pathname === '/about' ? 'text-pink-600 font-semibold' : ''}`}>About</Link>
          <Link to="/services" className={`text-gray-800 hover:text-pink-600 font-medium transition-colors duration-200 drop-shadow-sm ${location.pathname === '/services' ? 'text-pink-600 font-semibold' : ''}`}>Services</Link>
          <Link to="/gallery" className={`text-gray-800 hover:text-pink-600 font-medium transition-colors duration-200 drop-shadow-sm ${location.pathname === '/gallery' ? 'text-pink-600 font-semibold' : ''}`}>Gallery</Link>

          {/* Book Now Button */}
          <a
            href="https://wa.me/917682991297"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700 font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
          >
            Book Now
          </a>

          <Link to="/contact" className={`text-gray-800 hover:text-pink-600 font-medium transition-colors duration-200 drop-shadow-sm ${location.pathname === '/contact' ? 'text-pink-600 font-semibold' : ''}`}>Contact</Link>
          <Link to="/login" className={`text-gray-600 hover:text-gray-800 text-sm transition-colors duration-200 drop-shadow-sm ${location.pathname === '/login' ? 'text-gray-900 font-semibold' : ''}`}>Admin</Link>
        </nav>

        <div className="md:hidden">
          <button onClick={toggleMenu} className="p-2 rounded-lg hover:bg-white/50 transition-colors backdrop-blur-sm">
            {isOpen ? <X size={24} className="text-gray-800 drop-shadow-sm" /> : <Menu size={24} className="text-gray-800 drop-shadow-sm" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-xl shadow-xl border-t border-white/30">
          <div className="px-4 py-4 space-y-3">
            <Link to="/" className={`block text-gray-800 hover:text-pink-600 font-medium py-2 transition-colors drop-shadow-sm ${location.pathname === '/' ? 'text-pink-600 font-semibold' : ''}`} onClick={toggleMenu}>Home</Link>
            <Link to="/about" className={`block text-gray-800 hover:text-pink-600 font-medium py-2 transition-colors drop-shadow-sm ${location.pathname === '/about' ? 'text-pink-600 font-semibold' : ''}`} onClick={toggleMenu}>About</Link>
            <Link to="/services" className={`block text-gray-800 hover:text-pink-600 font-medium py-2 transition-colors drop-shadow-sm ${location.pathname === '/services' ? 'text-pink-600 font-semibold' : ''}`} onClick={toggleMenu}>Services</Link>
            <Link to="/gallery" className={`block text-gray-800 hover:text-pink-600 font-medium py-2 transition-colors drop-shadow-sm ${location.pathname === '/gallery' ? 'text-pink-600 font-semibold' : ''}`} onClick={toggleMenu}>Gallery</Link>

            {/* Mobile Book Now Button */}
            <a
              href="https://wa.me/917682991297"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-pink-600 text-white px-4 py-3 rounded-lg hover:bg-pink-700 font-semibold transition-colors text-center shadow-lg"
              onClick={toggleMenu}
            >
              Book Now
            </a>

            <Link to="/contact" className={`block text-gray-800 hover:text-pink-600 font-medium py-2 transition-colors drop-shadow-sm ${location.pathname === '/contact' ? 'text-pink-600 font-semibold' : ''}`} onClick={toggleMenu}>Contact</Link>
            <Link to="/login" className={`block text-gray-600 hover:text-gray-800 py-2 text-sm transition-colors drop-shadow-sm ${location.pathname === '/login' ? 'text-gray-900 font-semibold' : ''}`} onClick={toggleMenu}>Admin</Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
