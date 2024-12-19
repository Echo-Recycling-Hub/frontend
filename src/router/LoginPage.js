import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/login.css';

function LoginPage({ setLoginStatus, setLoginUser, closeModal, setCurrentModal }) {
    const navigate = useNavigate(); // useNavigate 훅을 함수 내부로 이동

    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");

    const onEmailHandler = (event) => {
        setUserId(event.currentTarget.value);
    };

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/login', {
                userid: userId,
                password: password
            }, { withCredentials: true });
            console.log(response.data);
            if (response.status === 200) {
                setLoginStatus(true);
                setLoginUser(response.data.user);
                closeModal();  // 로그인 성공 시 모달 닫기
                navigate('/mypage');
            } else {
                console.log("로그인 실패: 잘못된 자격증명");
            }
        } catch (error) {
            console.error("로그인 요청 실패:", error);
        }
    };

    const onSignupHandler = (event) => {
        event.preventDefault();
        setCurrentModal('signup');  // 회원가입 모달로 변경
    };

    return (
        <div className="login-container">
            <h2>로그인</h2>
            <form className="login-form" onSubmit={onSubmitHandler}>
                <label htmlFor="userId">ID</label>
                <input
                    type="text"
                    id="userId"
                    value={userId}
                    onChange={onEmailHandler}
                    placeholder="사용자 ID를 입력하세요"
                />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={onPasswordHandler}
                    placeholder="비밀번호를 입력하세요"
                />
                <div className="loginform-btn">
                    <button type="submit">로그인</button>
                    <button type="button" className="signup-btn" onClick={onSignupHandler}>회원가입</button>
                </div>
            </form>
        </div>
    );
}

export default LoginPage;
