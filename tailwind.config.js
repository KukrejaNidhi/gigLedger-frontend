/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        palSky: '#38BDF8',
        palYellow: '#F7EF39',
        palCoral: '#F73958',
        palSteel: '#5B8DA2',
        palOlive: '#787657',
        
        solarCanvas: '#F8FAFC',
        solarCard: '#FFFFFF',
        solarElevated: '#F1F5F9',
        solarBorder: '#E2E8F0',
        solarMuted: '#64748B',

        obsidianCanvas: '#0D1117',
        obsidianCard: '#161B22',
        obsidianElevated: '#21262D',
        obsidianBorder: '#30363D',
        obsidianMuted: '#8B949E',
        obsidianGold: '#D4AF37',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}
