/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        foreground: '#09090B',
        card: '#F4F4F5',
        'card-foreground': '#09090B',
        muted: '#F4F4F5',
        'muted-foreground': '#71717A',
        primary: '#208AEF',
        'primary-foreground': '#FFFFFF',
        accent: '#DBEAFE',
        'accent-foreground': '#1D4ED8',
        border: '#E4E4E7',
        input: '#E4E4E7',
        ring: '#208AEF',
        'brand-lime': '#A3E635',
        'brand-deep': '#1A2E05',
        star: '#F5A623',
        secondary: '#F4F4F5',
        'secondary-foreground': '#09090B',
        destructive: '#EF4444',
        'destructive-foreground': '#FFFFFF',
      },
    },
  },
  plugins: [],
};
