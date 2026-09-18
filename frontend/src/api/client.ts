import axios from "axios";

export const api = axios.create({
    baseURL: "http://54.180.144.40:8080",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});