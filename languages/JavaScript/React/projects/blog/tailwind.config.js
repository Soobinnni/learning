/** @type {import('tailwindcss').Config} */


module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    container: {
      center: true,
    },
    extend: {
      width: {
        'app': '1024px',
      },
      colors: {
        'primary': {
            '50': '#fef1f7',
            '100': '#fee5f0',
            '200': '#fecce3',
            '300': '#ffa2cb',
            '400': '#fe68a7',
            '500': '#f83c86',
            '600': '#e91f64',
            '700': '#ca0c47',
            '800': '#a70d3b',
            '900': '#8b1034',
            '950': '#55021a',
            DEFAULT: "#fe68a7",
        },
      }, 
    }
  },
  plugins: []
};
