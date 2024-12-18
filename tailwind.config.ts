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
            lightgray: '#DCDCDC',
            yellow: '#fcd34d',
            background: '#EDF4F2',
            add: '#7C8363',
            edit: '#065B77',
            delete: '#D3494E',
        },
    },
    plugins: [],
};
