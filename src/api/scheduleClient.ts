import axios from "axios";

const BASE_URL: string = import.meta.env.VITE_SCHEDULER_BE_BASE_URL;

export const scheduleClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
})

scheduleClient.interceptors.request.use((config) => {
    console.log(config.url);
    return config;
})