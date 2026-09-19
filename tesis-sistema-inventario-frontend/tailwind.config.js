/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'navy-dark': '#0A1931',
        'navy-ocean': '#1A3D63',
        'blue-slate': '#4A7FA7',
        'blue-ice': '#B3CFE5',
        'blue-soft': '#F6FAFD',
        primary: {
          DEFAULT: '#1A3D63',
          dark: '#0A1931',
          light: '#4A7FA7',
        },
        secondary: {
          DEFAULT: '#4A7FA7',
          light: '#B3CFE5',
        },
        surface: {
          DEFAULT: '#F6FAFD',
          card: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Geist', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        innovatecno: {
          "primary": "#1A3D63",
          "primary-focus": "#0A1931",
          "primary-content": "#ffffff",
          "secondary": "#4A7FA7",
          "secondary-content": "#ffffff",
          "accent": "#B3CFE5",
          "accent-content": "#0A1931",
          "neutral": "#0A1931",
          "neutral-content": "#F6FAFD",
          "base-100": "#FFFFFF",
          "base-200": "#F6FAFD",
          "base-300": "#B3CFE5",
          "base-content": "#0A1931",
          "info": "#4A7FA7",
          "success": "#10B981",
          "warning": "#F59E0B",
          "error": "#EF4444",
        },
      },
      "light",
    ],
    defaultTheme: "innovatecno",
  }
}

