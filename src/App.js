import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink, useNavigate } from 'react-router-dom';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IoChatbubblesSharp, IoLocationOutline, IoLogoWechat } from "react-icons/io5";
import { AuthContext } from "./router/AuthContext";
import LoginModal from "./router/LoginModal";
import SwiperSlider from "./router/SwiperSlider";
import MyMap from "./router/KakaoMap";
import Info from "./router/info";
import AutoSwitchingViewer from "./router/edust";
import Products from "./router/Products";
import Posts from "./router/Posts";
import CreatePost from "./router/Create";
import EditPost from "./router/Edit";
import DetailPost from "./router/Detail";
import Register from "./router/Register";
import Category from "./router/Category";
import Footer from "./router/Footer";
import News from "./router/News";
import MovingObject from "./router/MovingObject";
import Spinner from "./router/Spinner";
import Chatbot from "./router/chatbot";
import Mypage from "./router/Mypage";
import './App.css';
import Search_location_car from "./router/search_location_car";
import Search_location from "./router/search_location";
import { PiPaperPlaneTiltBold } from "react-icons/pi";
import { SiPaperlessngx } from "react-icons/si";

function App() {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [serverData15, setServerData15] = useState([]);
    const [serverData20, setServerData20] = useState([]);
    const [userInfo, setUserInfo] = useState({
        nickname: '',
        realname: '',
        mileage: 0
    });

    useEffect(() => {
        if (isAuthenticated) {
            setIsLoginModalOpen(false);
        }
    }, [isAuthenticated]);

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

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const [chatbot, setChatbot] = useState(false);

    return (
        <div className="App">
            <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="/">EREHub</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
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
                            <Nav.Link href="/shop">ZERO Shop</Nav.Link>
                            <Nav.Link eventKey={2} href="/posts">게시판</Nav.Link>
                            <div className="user-btn">
                                {isAuthenticated ? (
                                    <div className="login-btn">
                                        <button className="dropdown-btn" onClick={toggleDropdown}>
                                            {user?.nickname || 'No Nickname'} ▼
                                        </button>
                                        {isDropdownOpen && (
                                            <div className="dropdown-content">
                                                <NavLink className="nav-link" to="/mypage">마이페이지</NavLink>
                                                <button className="nav-link" onClick={handleLogout}>로그아웃</button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <button onClick={openLoginModal}>로그인</button>
                                )}
                            </div>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div className="Chatbot">
                <button className="chat-open-btn" onClick={() => setChatbot(!chatbot)}><IoLogoWechat/></button>
                {chatbot && <Chatbot closeChat={() => setChatbot(false)}/>}
            </div>

            <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal}/>

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
                                <MovingObject/>
                            </section>

                            <section id="introduce-sec">
                                <div className="erehub-img">
                                    <div className="erehub-intro">
                                        <h5><strong>에리헙</strong>이 하는 일</h5>
                                        <h1>다양한 서비스와 정보를 제공하므로써</h1>
                                        <h1>모두에게 재활용 생활화를 독려합니다.</h1>
                                    </div>
                                    <div>
                                        <p>에리허브는 사용자 모두에게 재활용의 중요성과 정보수집의 편리함을 제공하기 위해 만들어졌습니다.<br/>
                                            이용자가 폐기물 발생을 줄이고 재사용과 재생이용에 이바지할 수 있도록 올바른 분리배출 방법을 안내합니다.<br/>
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
                                                    <IoLocationOutline/>
                                                    <div className="service-list-info">
                                                        <h4>위치기반 서비스</h4>
                                                        <p>사용자의 현재 위치를 기반으로 다양한 서비스를 제공합니다.</p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="service-list">
                                                    <IoChatbubblesSharp/>
                                                    <div className="service-list-info">
                                                        <h4>Chatbot 서비스</h4>
                                                        <p>챗봇을 통해 사용자가 원하는 정확한 재활용 정보를 제공합니다.</p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="service-list">
                                                    <PiPaperPlaneTiltBold/>
                                                    <div className="service-list-info">
                                                        <h4>캠페인과 제도 소개</h4>
                                                        <p>관련 제도를 통한 서비스를 제공합니다.</p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="service-list">
                                                    <SiPaperlessngx/>
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

                            <div id="intro-section">
                                <h2>지금 우리나라 쓰래기와 재활용의 지표! 그래프로 확인하세요</h2>
                                <SwiperSlider serverData15={serverData15} serverData20={serverData20}/>
                            </div>

                            <section id="erehub-mark">
                                <div className="mark-info">
                                    <h1>다양한 사람들과 함께 하는 자원순환 프로그램</h1>
                                    <p>폐기물 문제로 인한 각종 사회 문제를 해결하기 위해선 정부뿐 아니라 국민 모두의 참여와 노력이 필요합니다. 우리 모두가 자원순환에 관심을 기울이고
                                        실천 한다면 더 깨끗한 환경을 만들 수 있습니다.</p>
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
                                <News/>
                            </section>

                            <section id="footer">
                                <Footer/>
                            </section>
                        </article>
                    </div>
                }/>
                <Route path="/MyMap" element={<MyMap/>}/>
                <Route path="/login" element={<LoginModal setLoginStatus={setIsLoginModalOpen}/>}/>
                <Route path="Info" element={<Info/>}/>
                <Route path="/edust" element={<AutoSwitchingViewer/>}/>
                <Route path="/search" element={<Search_location/>}/>
                <Route path="/car" element={<Search_location_car/>}/>
                <Route path="/board/:category" element={<Category/>}/>
                <Route path="/mypage" element={<Mypage user={user} setUserInfo={setUserInfo}/>}/>
                <Route path="/shop" element={<Products setUserInfo={setUserInfo}/>}/>
                <Route path="/posts" element={<Posts user={user}/>}/>
                <Route path="/create" element={<CreatePost/>}/>
                <Route path="/edit/:id" element={<EditPost user={user}/>}/>
                <Route path="/posts/:postId" element={<DetailPost user={user}/>}/>
                <Route path="/register" element={<Register/>}/>
            </Routes>
        </div>
    );
}

export default App;
