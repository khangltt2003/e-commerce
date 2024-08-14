/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: {
        main: "1220px",
      },
      backgroundColor: {
        main: "#2e5478",
      },
      colors: {
        main: "#2e5478",
      },
    },
    fontFamily: {
      main: ["Poppins", "sans-serif"],
    },
  },
  plugins: [],
};
