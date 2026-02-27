/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
    './lib/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
}
