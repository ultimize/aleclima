/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        notte:      '#0A2540', // brand scuro, header/footer, fiducia
        blu:        '#1668C7', // brand primario impianti
        bluChiaro:  '#3E8EE0',
        verde:      '#16A34A', // energia + risparmio + CTA + detrazione
        verdeScuro: '#0E7A37',
        sole:       '#F4A933', // accento sole, uso parsimonioso
        nebbia:     '#F2F6FB', // sfondo sezioni alt
        inchiostro: '#16202E', // testo
        grigio:     '#5A6B7B',
        linea:      '#E2E9F2',
        bianco:     '#FFFFFF',
      },
      fontFamily: {
        barlow: ['"Barlow Condensed"', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
