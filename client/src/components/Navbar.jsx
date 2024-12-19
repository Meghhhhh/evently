import React, { useState, useEffect } from "react";
import { FaSearch, FaBars } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { BiLogIn } from "react-icons/bi";
import ThemeConverter from "./ThemeConvertor";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

const Navbar = ({ onSidebarToggle }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userToken = Cookies.get("accessToken");
    setIsLoggedIn(!!userToken);
  }, []);

  return (
    <nav className="h-16 w-full flex items-center justify-between bg-white text-black p-4 shadow-lg bg-opacity-90 backdrop-blur-sm fixed z-50 top-0">
      <div className="text-xl font-bold">logo</div>

      <div className="hidden sm:flex lg:space-x-12">
        <a
          href="#home"
          className="hover:bg-lightgreyplusplus hover:text-white font-bold px-3 py-1 rounded-md transition-all duration-300"
        >
          Home
        </a>
        <a
          href="#about"
          className="hover:bg-lightgreyplusplus hover:text-white font-bold px-3 py-1 rounded-md transition-all duration-300"
        >
          About
        </a>
        <a
          href="#services"
          className="hover:bg-lightgreyplusplus hover:text-white font-bold px-3 py-1 rounded-md transition-all duration-300"
        >
          Services
        </a>
        <a
          href="#contact"
          className="hover:bg-lightgreyplusplus hover:text-white font-bold px-3 py-1 rounded-md transition-all duration-300"
        >
          Contact
        </a>
        <a
          href="#cart"
          className="hover:bg-lightgreyplusplus hover:text-white font-bold px-3 py-1 rounded-md transition-all duration-300"
        >
          Cart
        </a>
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

        <div className="hidden sm:flex sm:items-center sm:justify-center sm:h-full sm:p-2">
          <ThemeConverter />
        </div>

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
