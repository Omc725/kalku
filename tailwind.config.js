/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        keypad: 'var(--color-keypad)',
        'number-key': 'var(--color-number-key)',
        'text-color': 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        'text-on-primary': 'var(--color-text-on-primary)',
        'text-on-secondary': 'var(--color-text-on-secondary)',
      },
      fontFamily: {
        "display": ["Space Grotesk", "sans-serif"]
      },
      borderRadius: {
        "lg": "1rem",
        "xl": "1.5rem",
        "2xl": "2rem",
        "3xl": "2.5rem",
        "full": "9999px"
      },
      animation: {
        'pop-in': 'pop-in 0.4s cubic-bezier(0.4, 1.25, 0.2, 1) forwards',
        'pop-in-fast': 'pop-in-fast 0.3s cubic-bezier(0.4, 1.25, 0.2, 1) forwards',
        'fade-in-up': 'fade-in-up 0.5s cubic-bezier(0.4, 1.25, 0.2, 1) forwards',
        'clear-out': 'clear-out 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'fade-in': 'fade-in 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'fade-out': 'fade-out 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'fade-scale-in-up': 'fade-scale-in-up 0.5s cubic-bezier(0.4, 1.25, 0.2, 1) forwards',
        'fade-scale-out': 'fade-scale-out 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'expand-in-from-left': 'expand-in-from-left 0.5s cubic-bezier(0.4, 1.25, 0.2, 1) forwards',
        'shrink-out-to-right': 'shrink-out-to-right 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'expand-in-from-right': 'expand-in-from-right 0.5s cubic-bezier(0.4, 1.25, 0.2, 1) forwards',
        'shrink-out-to-left': 'shrink-out-to-left 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'reveal-in': 'reveal-in 0.6s cubic-bezier(0.4, 1.25, 0.2, 1) forwards',
        'reveal-out': 'reveal-out 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      },
      keyframes: {
        'pop-in': { 'from': { transform: 'scale(0.8)', opacity: '0' }, 'to': { transform: 'scale(1)', opacity: '1' }, },
        'pop-in-fast': { 'from': { transform: 'scale(0.9)', opacity: '0.5' }, 'to': { transform: 'scale(1)', opacity: '1' }, },
        'fade-in-up': { 'from': { transform: 'translateY(20px)', opacity: '0' }, 'to': { transform: 'translateY(0)', opacity: '1' }, },
        'fade-scale-in-up': { 'from': { transform: 'translateY(20px) scale(0.9)', opacity: '0' }, 'to': { transform: 'translateY(0) scale(1)', opacity: '1' }, },
        'fade-scale-out': { 'from': { transform: 'scale(1)', opacity: '1' }, 'to': { transform: 'scale(0.95)', opacity: '0' }, },
        'clear-out': { 'from': { transform: 'scale(1)', opacity: '1' }, 'to': { transform: 'scale(0.8) translateY(5px)', opacity: '0' }, },
        'fade-in': { 'from': { opacity: '0' }, 'to': { opacity: '1' }, },
        'fade-out': { 'from': { opacity: '1' }, 'to': { opacity: '0' }, },
        'reveal-in': {
            '0%': { 'clip-path': 'inset(var(--clip-top) var(--clip-right) var(--clip-bottom) var(--clip-left) round 2rem)' },
            '100%': { 'clip-path': 'inset(0 0 0 0 round 0)' }
        },
        'reveal-out': {
            '0%': { 'clip-path': 'inset(0 0 0 0 round 0)' },
            '100%': { 'clip-path': 'inset(var(--clip-top) var(--clip-right) var(--clip-bottom) var(--clip-left) round 2rem)' }
        }
      },
      transitionTimingFunction: {
        'out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'spring': 'cubic-bezier(0.4, 1.25, 0.2, 1)',
        'spring-bouncy': 'cubic-bezier(0.5, 1.75, 0.2, 1)',
        'fluid': 'cubic-bezier(0.3, 0, 0.1, 1)',
      },
    },
  },
  plugins: [],
}
