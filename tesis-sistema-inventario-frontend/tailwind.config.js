/** @type {import('tailwindcss').Config} */
// Design system: DESIGN-REFERO.md (Swiss industrial catalog, monochrome)
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        carbon: '#000000',
        paper: '#ffffff',
        concrete: '#cacaca',
        mist: '#f1f1f1',
        iron: '#404040',
        ash: '#616161',
        ink: '#1a1b1e',
        caution: '#ffdd00',
      },
      fontFamily: {
        sans: ['Inter', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['Inter', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'label-xs': ['8px', { lineHeight: '1.15', letterSpacing: '0.05em' }],
        'label': ['10px', { lineHeight: '1.15', letterSpacing: '0.05em' }],
        'label-sm': ['11px', { lineHeight: '1.15', letterSpacing: '0.04em' }],
        'body': ['16px', { lineHeight: '1.5', letterSpacing: '0.02em' }],
        'subheading': ['24px', { lineHeight: '1.28', letterSpacing: '0' }],
        'heading': ['32px', { lineHeight: '0.97', letterSpacing: '-0.005em' }],
        'display': ['48px', { lineHeight: '0.97', letterSpacing: '-0.01em' }],
      },
      borderRadius: {
        nav: '16px',
        image: '12px',
      },
      boxShadow: {
        pill: 'rgba(0, 0, 0, 0.12) 2px 2px 10px 0px',
      },
      maxWidth: {
        page: '1440px',
      },
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
          "primary": "#000000",
          "primary-content": "#ffffff",
          "secondary": "#404040",
          "secondary-content": "#ffffff",
          "accent": "#ffdd00",
          "accent-content": "#000000",
          "neutral": "#1a1b1e",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f1f1f1",
          "base-300": "#cacaca",
          "base-content": "#000000",
          "info": "#404040",
          "success": "#000000",
          "warning": "#ffdd00",
          "error": "#000000",
          "--rounded-box": "0",
          "--rounded-btn": "9999px",
          "--rounded-badge": "9999px",
        },
      },
    ],
    defaultTheme: "innovatecno",
  }
}
