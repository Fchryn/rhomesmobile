module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgdefault: "#FCFCFC",
        bglogin: "#7A8AFF"
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}