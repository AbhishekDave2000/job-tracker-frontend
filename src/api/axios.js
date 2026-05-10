import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

api.interceptors.request.use(
    (config)=> {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response?.status === 401){
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        } else if (status === 403) {
            alert("You don't have permission to do this!");
        } else if (status === 404) {
            console.error("The requested resource was not found.");
        } else if (status >= 500) {
            alert("Server is down. Please try again later.");
        }
        return Promise.reject(error);
    }
)

export default api;