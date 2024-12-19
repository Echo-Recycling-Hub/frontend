import React from "react";
import '../css/logout.css'; // 새로운 CSS 파일 import
import { NavLink } from 'react-router-dom';

function LogoutPage() {
    return (
        <div className="logout-container text-center">
            <h3>로그아웃 되었습니다.</h3>
            <button><NavLink to="/" className="btn btn-primary mt-3">홈으로</NavLink></button>
        </div>
    );
}

export default LogoutPage;
