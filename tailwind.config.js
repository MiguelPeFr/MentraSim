/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mentra: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0066FF',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      }
    },
  },
  plugins: [],
};
