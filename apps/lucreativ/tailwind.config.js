const { createGlobPatternsForDependencies } = require('@nrwl/angular/tailwind');
const { join } = require('path');

module.exports = {
  //darkMode: 'class',
  plugins: [require('tailwind-scrollbar')],
  content: [
    join(__dirname, 'src/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    fontSize: {
      xs: '0.8rem',
      sm: '0.9rem',
      base: '1rem',
      lg: '1.1rem',
      xl: '1.25rem',
      '2xl': '1.3rem',
      '3xl': '1.5rem',
      '4xl': '1.875rem',
      '5xl': '2.25rem',
      '6xl': '3rem',
      '7xl': '3.75rem',
      '8xl': '4.5rem',
      '9xl': '6rem',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      textA: '#ffffff',
      textB: '#000000',
      primary: '#32C8A2',
      secondary: '#E5E6E7',
      tertiary: '#CBCCD0',
      warning: '#A3C832',
      danger: '#f54b4c',
      selection: '#30A1C6',
      bgB: '#3E3042',
      bgA: '#303442',
      subtle: '#646464',
    },
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        theChosenOne: {
          '0%': { transform: 'scale(0.75)' },
          '50%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0.75)' },
        },
        hover: {
          '0%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(-7%)' },
          '100%': { transform: 'translateY(0%)' },
        },
        zoomIn: {
          '0%': { transform: 'scale(0)' },
          '100%': { transform: 'scale(1)' },
        },
        zoomOut: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0%)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateY(0%)', opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 300ms 1',
        fadeOut: 'fadeOut 300ms 1',
        theChosenOne: 'theChosenOne 1s ease infinite',
        hover: 'hover 2200ms ease-in-out infinite',
        zoomIn: 'zoomIn 300ms ease 1',
        zoomOut: 'zoomOut 300ms ease 1',
        slideIn: 'slideIn 300ms ease 1',
        slideOut: 'slideOut 300ms ease 1',
      },
    },
    fontFamily: {
      sans: ['"Red Hat Text"', 'sans-serif'],
    },
  },
};
