import React, { useState, useContext } from 'react';
import { Menu, X } from 'lucide-react'; 
import {AuthContext} from '../../Context/AuthContext/AuthContext.jsx'; 
import Button  from '../../components/ui/button/Button.jsx'; 
import { Link } from 'react-router-dom';


const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-blue-600 text-white shadow-md p-4 sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center flex-wrap">
        <h1 className="text-2xl font-bold">SkillSwap</h1>
        <button
          className="md:hidden text-white focus:outline-none p-2 rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        <nav className={`w-full md:w-auto md:flex ${isMobileMenuOpen ? 'block' : 'hidden'} md:!block`}>
          <ul className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0 mt-4 md:mt-0 text-lg bg-blue-700 md:bg-transparent p-4 md:p-0 rounded-lg md:rounded-none">
            <li><Link to="/home" className="block py-2 md:py-0 hover:text-blue-200 transition duration-150 ease-in-out">Home</Link></li>
            <li><Link to="/browse-skills"  className="block py-2 md:py-0 hover:text-blue-200 transition duration-150 ease-in-out">Browse Skills</Link></li>
            {user ? (
              <>
                <li><Link to={"/my-profile"} className="block py-2 md:py-0 hover:text-blue-200 transition duration-150 ease-in-out">My Profile</Link></li>
                <li><Button onClick={logout} variant="outline" className="w-full md:w-auto text-white border-white hover:bg-blue-800 mt-2 md:mt-0">Logout</Button></li>
              </>
            ) : (
              
              <>
                <li><Link to="/login" className="block py-2 md:py-0 hover:text-blue-200 transition duration-150 ease-in-out">Login</Link></li>
                <li><Link to="/signup" className="block py-2 md:py-0 hover:text-blue-200 transition duration-150 ease-in-out">Signup</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;