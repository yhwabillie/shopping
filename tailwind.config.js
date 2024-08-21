/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 10s linear infinite',
      },
      colors: {
        primary: {
          DEFAULT: '#B04A4A', // 벽돌색
        },
        secondary: {
          DEFAULT: '#660000', // 노랑색
        },
        accent: {
          DEFAULT: '#333333', // 짙은회색
        },
        // background: {
        //   light: '#F9FAFB', // 밝은 회색
        //   DEFAULT: '#F3F4F6', // 기본 배경색
        //   dark: '#E5E7EB', // 어두운 회색
        // },
        // info: {
        //   light: '#D1FAE5', // 밝은 민트색
        //   DEFAULT: '#10B981', // 민트색
        //   dark: '#047857', // 어두운 민트색
        // },
        // danger: {
        //   light: '#FECACA', // 밝은 붉은색
        //   DEFAULT: '#DC2626', // 붉은색
        //   dark: '#B91C1C', // 어두운 붉은색
        // },
      },
    },
  },
  plugins: [[require('@tailwindcss/aspect-ratio')]],
}
