export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: { enabled: true },

    app: {
        head: {
            title: 'admin-panel',
            htmlAttrs: {
                lang: 'en',
            },
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { hid: 'description', name: 'description', content: '' }
            ],
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
                { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap' }
            ]
        }
    },

    // Global CSS
    css: ['~/assets/css/main.css'],

    // Plugins to run before rendering page
    plugins: ['~/plugins/axios.js'],

    // Auto import components
    components: true,

    // Runtime Config
    runtimeConfig: {
        public: {
            apiUrl: process.env.API_URL || 'http://127.0.0.1:4000',
        }
    },

    // Build Configuration
    build: {}
})
