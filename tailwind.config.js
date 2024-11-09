/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                abhaya: ['"Abhaya Libre"', 'serif'],
            },
        },
        colors: {
            primary: '#31473A',
            secondary: '#7C8363',
            black: '#000000',
            white: '#FFFFFF',
            gray: '#D3D3D3',
            background: '#EDF4F2',
        },
    },
    plugins: [],
};
