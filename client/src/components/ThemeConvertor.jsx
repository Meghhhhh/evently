import React from "react";
import { useState, useEffect } from "react";
import { IoSunnySharp, IoMoonSharp } from "react-icons/io5";
const ThemeConverter = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") setDarkMode(true);
  }, []);
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");

      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className=" z-50">
      {darkMode ? (
        <IoSunnySharp
          size={24}
          className="text-white"
          onClick={() => setDarkMode(!darkMode)}
        />
      ) : (
        <IoMoonSharp
          size={24}
          className="text-black"
          onClick={() => setDarkMode(!darkMode)}
        />
      )}
    </div>
  );
};

export default ThemeConverter;
