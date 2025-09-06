/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#007AFF',
        secondary: '#34C759',
        background: '#F2F2F7',
        surface: '#FFFFFF',
        text: {
          primary: '#000000',
          secondary: '#8E8E93',
        },
        matrix: {
          urgent: '#FF3B30',
          important: '#FF9500', 
          delegate: '#007AFF',
          eliminate: '#8E8E93',
        }
      },
    },
  },
  plugins: [],
}