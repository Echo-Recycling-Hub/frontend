import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import ModalCloseBtn from '../components/CloseModalBtn';
import '../css/SignupModal.css';

function SignupModal({ switchToLogin, toggleModal }) {
    const [userid, setUserid] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [realname, setRealname] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/signup', {
                userid,
                password,
                nickname,
                realname,
            });
            setMessage(response.data);
        } catch (error) {
            setMessage(error.response.data || '회원가입 실패');
        }
    };

    return (
        <div className="App">
            <div className="login-modal-con">
                <h2>회원가입</h2>
                <ModalCloseBtn onClick={toggleModal} className="modal-close-btn"/>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        id="username"
                        value={userid}
                        onChange={(e) => setUserid(e.target.value)}
                        placeholder="아이디"
                        required
                    />
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호"
                        required
                    />
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="비밀번호 확인"
                        required
                    />
                    <input
                        type="text"
                        id="nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="닉네임"
                        required
                    />
                    <input
                        type="text"
                        id="name"
                        value={realname}
                        onChange={(e) => setRealname(e.target.value)}
                        placeholder="이름"
                        required
                    />
                    <button type="submit">가입하기</button>
                </form>
                {message && <p>{message}</p>}
                <p>또는 <span onClick={switchToLogin}>로그인으로</span></p>
            </div>
        </div>
    );
}

SignupModal.propTypes = {
    switchToLogin: PropTypes.func.isRequired,
    toggleModal: PropTypes.func.isRequired,
};

export default SignupModal;
