/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bgColor: 'var(--bgColor)',
        textColor: 'var(--textColor)',
        bgColor1: 'var(--bgColor1)',
        textColor1: 'var(--textColor1)',
        bgColor2: 'var(--bgColor2)',
        textColor2: 'var(--textColor2)',
        bgColor3: 'var(--bgColor3)',
        textColor3: 'var(--textColor3)',
        navCatButtonBgActive: 'var(--navCatButtonBgActive)',
        navCatButtonBgInActive: 'var(--navCatButtonBgInActive)',
        navCatButtonBgInHover: 'var(--navCatButtonBgHover)',
        questionAttemptBg: 'var(--questionAttemptBg)',
        questionAttemptText: 'var(--questionAttemptText)',
        userNavText: 'var(--userNavText)',
        takeQuizButtonBg: 'var(--takeQuizButtonBg)',
        takeQuizButtonText: 'var(--takeQuizButtonText)',
      },
    },
  },
  plugins: [],
}

