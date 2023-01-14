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
      primary: '#9de04b',
      secondary: '#d9d9d9',
      tertiary: '#b4b4b4',
      warning: '#ffcc00',
      danger: '#f54b4c',
      selection: '#37473a',
      bgB: '#2b3738',
      bgA: '#222c2d',
      subtle: '#646464',
      // transparent: 'transparent',
      // current: 'currentColor',
      // primaryH: '#9de04b',
      // primaryK: '#ec7100',
      // primaryW: '#8adafe',
      // secondary: '#2b3738',
      // tertiary: '#222c2d',
      // warning: '#ffcc00',
      // danger: '#f54b4c',
      // selection: '#37473a',
      // white: '#ffffff',
      // lightgray: '#d9d9d9',
      // midgray: '#b4b4b4',
      // darkgray: '#646464',
      // black: '#000000',
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
          '50%': { transform: 'translateY(-10%)' },
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
        hover: 'hover 1500ms ease-in-out infinite',
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
