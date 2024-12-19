// LoginModal.js
import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import authService from './authService';
import '../css/LoginModal.css';

const LoginModal = ({ isOpen, onClose }) => {
    const { login } = useContext(AuthContext);
    const [isLoginView, setIsLoginView] = useState(true);
    const [formData, setFormData] = useState({ userid: '', password: '', nickname: '', realname: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoginView) {
            await login(formData.userid, formData.password);
        } else {
            await authService.register(formData);
            await login(formData.userid, formData.password);
        }
        onClose(); // 로그인 성공 후 모달 닫기
    };

    return isOpen ? (
        <div className="login_modal">
            <div className="login_modal-content">
                <div className="login-header">
                    <h2>{isLoginView ? '로그인' : '회원가입'}</h2>
                    <button onClick={onClose} className="close-button">X</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="userid" placeholder="User ID" value={formData.userid} onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                    {!isLoginView && (
                        <>
                            <input type="text" name="nickname" placeholder="Nickname" value={formData.nickname} onChange={handleChange} required />
                            <input type="text" name="realname" placeholder="Real Name" value={formData.realname} onChange={handleChange} required />
                        </>
                    )}
                    <button type="submit">{isLoginView ? '로그인' : '회원가입'}</button>
                </form>
                <p>또는
                    <span
                        className="swap-btn"
                        onClick={() => setIsLoginView(!isLoginView)}
                    >
                        {isLoginView ? '  회원가입' : '  로그인'}</span>
                </p>
            </div>
        </div>
    ) : null;
};

export default LoginModal;
