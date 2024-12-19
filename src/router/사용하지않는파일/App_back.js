import './App.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, NavLink } from 'react-router-dom';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IoLogoWechat } from "react-icons/io5";
import { GiEcology, GiHamburgerMenu } from "react-icons/gi";
import { IoLocationOutline, IoChatbubblesSharp } from "react-icons/io5";
import { SiPaperlessngx } from "react-icons/si";
import { PiPaperPlaneTiltBold } from "react-icons/pi";

import MyMap from "./router/KakaoMap";
import Chatbot from "./router/chatbot";
// import LoginPage from "./router/login";
import LogoutPage from "./router/logout";
import Search_location from "./router/search_location";
import Search_location_car from "./router/search_location_car";
import ChartComponent from "./router/사용하지않는파일/Chart";
import Info from "./router/info.js"
import Spinner from './router/Spinner';
import MovingObject from "./router/MovingObject";
import SwiperSlider from "./router/SwiperSlider";
import Footer from "./router/Footer";
import News from "./router/News";
import Category from './router/Category';
import MyPage from "./router/Mypage"; // mypage.js 파일 import
import Products from './router/Products'
import Posts from './router/Posts'
import RealtimeLineChart from "./router/realtimechart";
import CreatePost from "./router/Create";
import EditPost from "./router/Edit";
import DetailPost from "./router/Detail";
import AutoSwitchingViewer from "./router/edust"
import {AuthProvider} from "./router/AuthContext";
import Register from "./router/Register";
import LoginModal from "./router/LoginModal";
import Home from "./router/Home";



function App() {
    let navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({
        nickname: '',
        realname: '',
        mileage: 0
    });
    const loadAuthData = () => {
        const storedIsLogin = localStorage.getItem('isLogin');
        const storedLogin = localStorage.getItem('login');
        if (storedIsLogin && storedLogin) {
            return { isLogin: storedIsLogin === 'true', login: JSON.parse(storedLogin) };
        }
        return { isLogin: false, login: { userid: '', nickname: '' } };
    };

    const [isLogin, setIsLogin] = useState(loadAuthData().isLogin);
    const [login, setLogin] = useState(loadAuthData().login);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        localStorage.setItem('isLogin', isLogin);
        localStorage.setItem('login', JSON.stringify(login));
    }, [isLogin, login]);

    const logout = () => {
        setIsLogin(false);
        setLogin({ userid: '', nickname: '' });
        localStorage.removeItem('isLogin');
        localStorage.removeItem('login');
        navigate("/logout");
    };

    const [backgroundLoaded, setBackgroundLoaded] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);

        setTimeout(() => {
            setBackgroundLoaded(true);
        }, 500);

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleScroll = () => {
        if (window.scrollY > 0) {
            setScrollY(true);
        } else {
            setScrollY(false);
        }
    };

    const toDay = new Date();
    const formatDate = `${toDay.getFullYear()}-${toDay.getMonth() + 1}-${toDay.getDate()}`;

    const [chatbot, setChatbot] = useState(false);


    // 차트데이터 받아오기
    const [serverData15, setServerData15] = useState([]);
    const [serverData20, setServerData20] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/home')
            .then(response => response.json())
            .then(fetchedData => setServerData15(fetchedData))
            .catch(error => console.error('Fetching data failed:', error));
    }, []);

    useEffect(() => {
        fetch('http://localhost:3001/home1')
            .then(response => response.json())
            .then(fetchedData => setServerData20(fetchedData))
            .catch(error => console.error('Fetching data failed:', error));
    }, []);


    return (
        <div className="App">
            {loading ? (
                <div className="loading-container">
                    <Spinner />
                </div>
            ) : (
                <div className={`background-container ${backgroundLoaded ? 'visible' : ''}`}>
                    <Navbar
                        collapseOnSelect expand="lg"
                        className={`bg-body-tertiary ${scrollY ? 'scrolled' : ''}`}>
                        <Container>
                            <Navbar.Brand href="/">EREHub</Navbar.Brand>
                            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                            <Navbar.Collapse id="responsive-navbar-nav">
                                <Nav className="me-auto">
                                    <Nav.Link href="/Info">EREHub 소개</Nav.Link>
                                    <Nav.Link href="/MyMap">위치검색</Nav.Link>
                                    <NavDropdown title="자원순환" id="collapsible-nav-dropdown">
                                        <NavDropdown.Item as={Link} to="/board/plastic">분리배출</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/board/disposable">일회용품</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/board/wasteElec">폐가전</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/board/foodWaste">음식물 폐기물</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/board/waste">기타폐기물</NavDropdown.Item>
                                    </NavDropdown>
                                    <Nav.Link href="/edust">초미세먼지</Nav.Link>
                                </Nav>
                                <Nav>
                                    <Nav.Link href="/shop">Zore Shop</Nav.Link>
                                    <Nav.Link eventKey={2} href="/posts">게시판</Nav.Link>
                                    <div className="user-btn">
                                        {isLogin ? (
                                            <div className="login-btn">
                                                <button className="dropdown-btn">{login.nickname} ▼</button>
                                                <div className="dropdown-content">
                                                    <NavLink className="nav-link" to="/mypage">마이페이지</NavLink>
                                                    <button className="nav-link" onClick={logout}>로그아웃</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <NavLink to="/login" className="login-btn">로그인</NavLink>
                                        )}
                                    </div>
                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>

                    <div className="Chatbot">
                        <button className="chat-open-btn" onClick={() => setChatbot(!chatbot)}><IoLogoWechat /></button>
                        {chatbot && <Chatbot closeChat={() => setChatbot(false)} />}
                    </div>
                    <AuthProvider>
                    <Routes>
                        <Route path="/" element={
                            <div>
                                <article id="main-con" className="center-style">
                                    <section className='box'>
                                        <div className="back-img"></div>
                                        <div className="our-intro">
                                            <h1>지구를 지키는 작은 실천 재활용</h1>
                                            <h2>재활용은 환경 보호의 첫 걸음입니다.</h2>
                                            <h3><b>EREHub</b>는 재활용의 생활화를 지향합니다.</h3>
                                            <p>저희 서비스는 여러분이 더 쉽게, 더 효율적으로 재활용할 수 있도록 도와드립니다.</p>
                                            <p>함께 힘을 모아 지속 가능한 미래를 만들어갑니다.</p>
                                        </div>
                                        <div className="wave-con">
                                            <div className='wave -one'></div>
                                            <div className='wave -two'></div>
                                            <div className='wave -three'></div>
                                        </div>
                                        <MovingObject />
                                    </section>

                                    <section id="introduce-sec">
                                        <div className="erehub-img">
                                            <div className="erehub-intro">
                                                <h5><strong>에리헙</strong>이 하는 일</h5>
                                                <h1>다양한 서비스와 정보를 제공하므로써</h1>
                                                <h1>모두에게 재활용 생활화를 독려합니다.</h1>
                                            </div>
                                            <div>
                                                <p>에리허브는 사용자 모두에게 재활용의 중요성과 정보수집의 편리함을 제공하기 위해 만들어졌습니다.<br />
                                                    이용자가 폐기물 발생을 줄이고 재사용과 재생이용에 이바지할 수 있도록 올바른 분리배출 방법을 안내합니다.<br />
                                                    사람들의 인식을 바꾸고 재활용 생활화를 통해 건강한 재활용 문화를 만들어 갑니다.
                                                </p>
                                            </div>
                                            <div className="erehub-btn">
                                                <span>바로가기</span>
                                            </div>
                                            <div className="erehub-service">
                                                <ul className="our-service">
                                                    <li>
                                                        <div className="service-list">
                                                            <IoLocationOutline />
                                                            <div className="service-list-info">
                                                                <h4>위치기반 서비스</h4>
                                                                <p>사용자의 현재 위치를 기반으로 다양한 서비스를 제공합니다.</p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="service-list">
                                                            <IoChatbubblesSharp />
                                                            <div className="service-list-info">
                                                                <h4>Chatbot 서비스</h4>
                                                                <p>챗봇을 통해 사용자가 원하는 정확한 재활용 정보를 제공합니다.</p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="service-list">
                                                            <PiPaperPlaneTiltBold />
                                                            <div className="service-list-info">
                                                                <h4>캠페인과 제도 소개</h4>
                                                                <p>관련 제도를 통한 서비스를 제공합니다.</p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="service-list">
                                                            <SiPaperlessngx />
                                                            <div className="service-list-info">
                                                                <h4>환경마일리지 제도</h4>
                                                                <p>관련 제도를 통해 소액의 지원금을 지급합니다.</p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </section>

                                    <section id="intro-section">
                                        <h2>에리허브가 제공하는 서비스를 한눈에 확인 해보세요.</h2>
                                        <SwiperSlider serverData15={serverData15} serverData20={serverData20} />
                                    </section>

                                    <section id="erehub-mark">
                                        <div className="mark-info">
                                            <h1>다양한 사람들과 함께 하는 자원순환 프로그램</h1>
                                            <p>폐기물 문제로 인한 각종 사회 문제를 해결하기 위해선 정부뿐 아니라 국민 모두의 참여와 노력이 필요합니다. 우리 모두가 자원순환에 관심을 기울이고 실천 한다면 더 깨끗한 환경을 만들 수 있습니다.</p>
                                        </div>
                                        <div className="recycle-score">
                                            <div className="recycle-pet">
                                                <p>자원순환 된 페트병</p>
                                                <h1>20K+</h1>
                                            </div>
                                            <div className="recycle-glass">
                                                <p>자원순환된 유리병</p>
                                                <h1>8K+</h1>
                                            </div>
                                            <div className="recycle-carbon">
                                                <p>절감된 탄소</p>
                                                <h1>852,547kg</h1>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <News />
                                    </section>

                                    <section id="footer">
                                        <Footer />
                                    </section>
                                </article>
                            </div>
                        } />
                        <Route path="/MyMap" element={<MyMap />} />
                        <Route path="/login" element={<LoginModal setLoginStatus={setIsLogin} setLoginUser={setLogin} />} />
                        <Route path="Info" element={<Info />} />
                        <Route path="/logout" element={<LogoutPage />} />
                        <Route path="/edust" element={<AutoSwitchingViewer />} />
                        <Route path="/search" element={<Search_location />} />
                        <Route path="/car" element={<Search_location_car />} />
                        <Route path="/chart" element={<ChartComponent />} />
                        <Route path="/board/:category" element={<Category />} />
                        <Route path="/mypage" element={<MyPage user={login} setLoginUser={setLogin} setLoginStatus={setIsLogin} userInfo={userInfo} setUserInfo={setUserInfo} />} />
                        <Route path="/shop" element={<Products setUserInfo={setUserInfo} />} />
                        <Route path="/posts" element={<Posts user={login} />} />
                        <Route path="/create" element={<CreatePost />} />
                        <Route path="/edit/:id" element={<EditPost user={login} />} />
                        <Route path="/posts/:id" element={<DetailPost user={login} />} />
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/" element={<Home/>}/>
                    </Routes>
                    </AuthProvider>
                </div>
            )}
        </div>
    );
}

export default App;
