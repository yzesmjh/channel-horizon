/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // Enable dark mode based on a class on the HTML element
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bankred: "#100257",
        bankredhover: "#BA0D76",
      },
      bankgradient: {
        "bankred-gradient": "linear-gradient(to right, #100257, #BA0D76)",
      },
      fontSize: {
        bankSmall: [
          "10px",
          // {
          //   lineHeight: '28px'
          // }
        ],
      },
      fontFamily: {
        anton: ["Anton-Regular"],
      },
      textColor: {
        light: "text-gray-900",
        dark: "text-gray-200",
      },
    },
  },
  plugins: [],
};
