import { create } from 'zustand';

const safeParseUser = () => {
    try {
        const user = localStorage.getItem("user")
        return user ? JSON.parse(user) : null
    } catch {
        localStorage.removeItem("user")  // clear the bad value
        return null
    }
}

const useAuthStore = create( (set) => ({
    token: localStorage.getItem("token") || null,
    user:  safeParseUser(),

    setAuth: (token, user) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        set({token, user})
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({token: null, user: null});
    },
}));

export default useAuthStore;