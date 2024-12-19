import axios from 'axios';

const API_URL = 'http://localhost:3001';

const login = async (userid, password) => {
    const response = await axios.post(`${API_URL}/login`, { userid, password });
    if (response.status === 200) {
        return {
            token: response.data.token,
            user: response.data.user
        };
    } else {
        throw new Error('Login failed with status: ' + response.status);
    }
};

const register = async (formData) => {
    const response = await axios.post(`${API_URL}/register`, formData);
    return response.data;
};

const verifyToken = async (token) => {
    const response = await axios.post(`${API_URL}/verify-token`, {}, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error('Token verification failed with status: ' + response.status);
    }
};

export default { login, register, verifyToken };
