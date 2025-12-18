import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, Ticket, LogOut } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  // Simulasi status login (Ubah ke false untuk melihat tampilan sebelum login)
  const isLoggedIn = true; 

  const handleLogout = () => {
    // Nanti diisi logic hapus token
    alert("Logout Berhasil");
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold font-outfit text-xl">E</div>
             <span className="text-2xl font-bold font-outfit text-blue-900">Evoria.</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition">Home</Link>
            <Link to="/events" className="text-gray-600 hover:text-blue-600 font-medium transition">Events</Link>
            
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link to="/my-bookings" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium">
                  <Ticket size={18} /> My Booking
                </Link>
                <Link to="/profile" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium">
                  <User size={18} /> Profile
                </Link>
                <button onClick={handleLogout} className="text-red-500 hover:text-red-700 font-medium ml-4">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="px-5 py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded-full transition">
                  Login
                </Link>
                <Link to="/register" className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-blue-600">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link to="/" className="block py-2 text-gray-600 font-medium">Home</Link>
            <Link to="/events" className="block py-2 text-gray-600 font-medium">Events</Link>
            {isLoggedIn ? (
              <>
                <Link to="/my-bookings" className="block py-2 text-gray-600 font-medium">My Booking</Link>
                <Link to="/profile" className="block py-2 text-gray-600 font-medium">Profile</Link>
                <button onClick={handleLogout} className="block w-full text-left py-2 text-red-500 font-medium">Logout</button>
              </>
            ) : (
              <div className="mt-4 flex flex-col gap-3">
                <Link to="/login" className="block text-center py-2 border border-blue-600 text-blue-600 rounded-lg font-medium">Login</Link>
                <Link to="/register" className="block text-center py-2 bg-blue-600 text-white rounded-lg font-medium">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;