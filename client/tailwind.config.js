/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryBlack: "#111827",
        primaryPeach: "#FF5364",
        darkGray: "#5A5A5A",
        mediumGray: "#B3B3B3",
        lightGray: "#F2F2F2",
        lightgrey: "#F2F2F2",
        lightgreyplus: "#B3B3B3",
        lightgreyplusplus: "#5A5A5A",
        red: "#FF5364",
        reddark: "#FF5320",
        black: "#000000",
        white: "#FFFFFF",
        offwhite: "#f2f2f2",
        darkgrey: "#5a5a5a",
        grey: "#b3b3b3",
        mauve: "#9333ea",

        purple:"#9333ea",
        darkbg:"#111827",
        gray:"#1f2937", 
        gry:"#374151",
        lightpurple:"#a855f7",

        purpl:"#7e22ce",
        pupll:"#a667dd",
        lgrey:"#f3f4f6",
        
      },
    },
    // screens: {
    //   lg: { max: "1800px" },
    //   lgm: { max: "1140px" },
    //   md: { max: "990px" },
    //   sm: { max: "600px" },
    //   xs: { max: "400px" },
    //   minmd: "1700px",
    //   minlg: "2100px",
    // },
  },
  plugins: [daisyui],
};
