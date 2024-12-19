import React from 'react';
import '../css/Footer.css';

function Footer() {
    return (
        <div className="App">

            <footer>
                <article id="footer-companyinfo">
                    <section className="address">
                        <ul className="number-list">
                            <li>전화 : 02-2038-0800</li>
                            <li>이메일 : erehub@</li>
                            <li>고객센터 운영 : 평일 10:00 ~ 18 : 00 / 공휴일 및 점심시간(13:20~14:30) 상담불가</li>
                        </ul>
                        <ul className="address-list">
                            <li>에리허브㈜</li>
                            <li>대표이사 : 코드랩3조</li>
                            <li>등록번호 : 123-45-67890</li>
                            <li>본사 : 서울특별시 금천구 주소 가산디지털2로 144 현대테라타워 가산DK A동 20층 2013~2018호</li>
                            <li>기업연구소 : 서울특별시 금천구 주소 가산디지털2로 144 현대테라타워 가산DK A동 20층 2013~2018호</li>
                            <li>이용약관</li>
                            <li>개인정보처리방침</li>
                            <li>Copyrightⓒ2024.코드랩아카데미3조.All Rights Reserved.</li>
                        </ul>
                    </section>
                    <section className="service">
                        <ul>
                            <li>에리헙 소개</li>
                            <li>공지사항</li>
                            <li>소식</li>
                            <li>자주하는 질문</li>
                            <li>포인트/환전</li>
                            <li>제휴문의</li>
                        </ul>
                    </section>
                </article>
            </footer>

        </div>
    );
}

export default Footer;
