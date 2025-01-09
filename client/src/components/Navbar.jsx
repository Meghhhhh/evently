import React, { useState, useEffect } from 'react';
import { FaSearch, FaBars } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { IoCartOutline } from 'react-icons/io5';
import { BiLogIn } from 'react-icons/bi';
import ThemeConverter from './ThemeConvertor';
import Cookies from 'js-cookie';
import Logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

const Navbar = ({ onSidebarToggle }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [theme, setTheme] = useState('true');

  useEffect(() => {
    const userToken = Cookies.get('accessToken');
    setIsLoggedIn(!!userToken);

    // Check localStorage for theme
    const storedTheme = localStorage.getItem('theme') || 'true';
    setTheme(storedTheme);
  }, [theme]);

  const handleThemeChange = () => {

    setTheme((currTheme) => !currTheme)
  }
  const navbarClass = 
    theme === 'false'
      ? 'bg-gray text-white shadow-lg shadow-pupll/20' // Dark theme styles
      : 'bg-lgrey text-black shadow-lg shadow-pupll/20'; // Light theme styles

  return (
    <nav
      className={`h-16 w-full flex items-center justify-between p-4  bg-opacity-80 backdrop-blur-sm fixed z-50 top-0 ${navbarClass}`}
    >
      <div className="text-xl font-bold">
        <Link to="/home">
          <img src={Logo} alt="Logo" width="114px" height="114px" />
        </Link>
      </div>

      <div className="flex items-center">
        <div className="relative lg:block">
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <FaSearch />
          </button>
          <input
            type="text"
            placeholder="Search..."
            className="pl-3 pr-10 py-1 rounded-full text-black bg-lightgrey"
          />
        </div>

        <div className="hidden sm:flex sm:items-center sm:justify-center sm:h-full sm:p-2 cursor-pointer hover:bg-lightgreyplusplus rounded-[50%] mx-2"
        onClick={handleThemeChange}>
          <ThemeConverter />
        </div>

        {isLoggedIn && (
          <Link
            to="/cart"
            className="hover:bg-lightgreyplusplus hover:text-white font-bold px-2 py-2 rounded-[50%] transition-all duration-300 mr-2"
          >
            <IoCartOutline size={24} />
          </Link>
        )}

        <div className="hidden sm:flex sm:items-center sm:justify-center sm:h-full sm:p-2">
          {isLoggedIn ? (
            <Link to="/profile">
              <CgProfile size={24} />
            </Link>
          ) : (
            <Link to="/auth/signin">
              <BiLogIn size={24} />
            </Link>
          )}
        </div>
      </div>

      <button className="sm:hidden text-2xl" onClick={onSidebarToggle}>
        <FaBars />
      </button>
    </nav>
  );
};

export default Navbar;
