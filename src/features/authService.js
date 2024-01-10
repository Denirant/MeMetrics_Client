import axios from "axios";

const API_URI = "/api/users/";

const register = async (userData) => {
    const res = await axios.post(API_URI, userData);

    if (res.data) {
        localStorage.setItem("user", JSON.stringify(res.data));
    }

    return res.data;
};


const login = async (userData) => {
    const res = await axios.post(API_URI + "login", userData);

    if (res.data) {
        localStorage.setItem("user", JSON.stringify(res.data));
    }

    return res.data;
};


const logout = () => {
    localStorage.removeItem("user");
};


const authService = {
    register,
    logout,
    login
};

export default authService;
