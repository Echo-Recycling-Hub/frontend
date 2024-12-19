import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import LoginModal from './LoginModal';
import '../css/Home.css';

const Home = () => {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // 로그인 상태가 변경될 때마다 모달을 닫음
        if (isAuthenticated) {
            setIsModalOpen(false);
        }
    }, [isAuthenticated]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="home">
            <h1>Welcome to the Home Page</h1>
            {isAuthenticated ? (
                <button onClick={handleLogout}>Logout</button>
            ) : (
                <button onClick={openModal}>Login</button>
            )}
            <LoginModal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
};

export default Home;
