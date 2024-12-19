const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
};

const saveToken = (token, rememberMe) => {
    if (rememberMe) {
        localStorage.setItem('token', token);
    } else {
        sessionStorage.setItem('token', token);
    }
};

const removeToken = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
};

export default { getToken, saveToken, removeToken };
