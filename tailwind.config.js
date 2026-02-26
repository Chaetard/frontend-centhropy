/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'funnel': ['"Funnel Display"', 'sans-serif'],
                'mono': ['"JetBrains Mono"', 'monospace'],
                'unna': ['"Unna"', 'serif'],
            },
            colors: {
                tactical: {
                    black: '#000000',
                    gray: '#888888',
                    light: '#f4f4f4'
                }
            }
        },
    },
    plugins: [],
}
