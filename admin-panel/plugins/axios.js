import { defineNuxtPlugin, useRuntimeConfig } from '#app';
import axios from 'axios';

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();
    const axiosInstance = axios.create({
        baseURL: config.public.apiUrl,
    });

    nuxtApp.provide('axios', axiosInstance);
});
