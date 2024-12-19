import './App.css';
import MyMap from "./router/KakaoMap";
import Weather from "./router/weather";
import React, { useState, useEffect } from "react";
import {Route, Router, Routes, Link, useNavigate, NavLink, Outlet} from 'react-router-dom'
import {FiAlignJustify} from 'react-icons/fi';
import {IoLogoWechat} from "react-icons/io5";
import Chatbot from "./router/chatbot";
import {TiWeatherWindyCloudy} from "react-icons/ti";
import LoginPage from "./router/login";
import LogoutPage from "./router/logout";
import AutoSwitchingViewer from "./router/edust"
import RecyclingCenters from "./router/bar_Reyc"
import ZeroCenters from "./router/bar_zero"
import NapronCenters from "./router/bar_Napron"
import Search_location from "./router/search_location";
import Search_location_car from "./router/search_location_car";
import ChartComponent from "./router/사용하지않는파일/Chart"
import {GiEcology, GiHamburgerMenu} from "react-icons/gi";
import {FaBusAlt, FaCar} from "react-icons/fa";
import {FaPersonWalking, FaTrainSubway} from "react-icons/fa6";

function App() {


    const [currentView, setCurrentView] = useState(null);
    const toggleView = (view) => {
        setCurrentView(currentView === view ? null : view);
    };

    let navigate = useNavigate();
    // 로그인 상태를 localStorage에서 로드
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

    // 로그인 상태 변경시 localStorage에 저장
    useEffect(() => {
        localStorage.setItem('isLogin', isLogin);
        localStorage.setItem('login', JSON.stringify(login));
    }, [isLogin, login]);

    // 로그아웃 로직 구현
    const logout = () => {
        setIsLogin(false);
        setLogin({ userid: '', nickname: '' });
        localStorage.removeItem('isLogin');
        localStorage.removeItem('login');
        navigate("/logout");
    };

    // 자동차 길찾기
    const [carRoutes, setCarRoutes] = useState([]);

    const renderRouteDetails = () => {
        return carRoutes.map((route, index) => (
            <div key={index}>
                <h3>길찾기 결과 #{index + 1}</h3>
                <p>출발지: {route.summary.origin.name}</p>
                <p>도착지: {route.summary.destination.name}</p>
                <p>예상 시간: {Math.floor(route.summary.duration / 60)}분</p>
                <p>예상 거리: {route.summary.distance}m</p>
                <h4>경로 상세 정보</h4>
                {route.sections.map((section, idx) => (
                    <div key={idx}>
                        <p>{section.distance}m, {Math.floor(section.duration / 60)}분 소요</p>
                        <p>도로명: {section.roads.map(road => road.name).join(', ')}</p>
                    </div>
                ))}
            </div>
        ));
    };

    const [fullRoutesDetails, setFullRoutesDetails] = useState([]);
    const renderFullRouteDetails = () => {
        return fullRoutesDetails.map((detail, index) => {
            // pathList에서 세부 정보 추출 (경로 정보)
            const pathList = detail.pathList || [];
            // time과 distance는 detail 객체에서 직접 접근
            const time = detail.time || "Not available";
            const distance = detail.distance || "Not available";

            return (
                <div key={index}>
                    <h3>Routes Information</h3>
                    {pathList.map((path, idx) => (
                        <div key={idx}>
                            <p>Route Name: {path.routeNm || "Not available"}</p>
                            <p>Departure: {path.fname || "Not available"}</p>
                            <p>Arrival: {path.tname || "Not available"}</p>
                        </div>
                    ))}
                    <p>Total Time: {time} minutes</p>
                    <p>Total Distance: {distance} meters</p>
                </div>
            );
        });
    };


    // 현재 날짜 받아오기
    const toDay = new Date();
    const formatDate = `${toDay.getFullYear()}-${toDay.getMonth() + 1}-${toDay.getDate()}`;

    // 챗봇창 열기
    let [chatbot, setChatbot] = useState(false)

    // 센터들 정보창열기
    let [reshop, setReashop] = useState(false);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const handleMarkerClick = (markerData) => {
        setSelectedMarker(markerData);
    };

    let[openZero, setOpenZero] = useState(false);
    const [selectZeroshop, setSelectZeroshop] = useState(null);

    const handleSelectZeroShop = (selectZeroshop) => {
        setSelectZeroshop(selectZeroshop);
    };

    let[napronOpen, setNapronOpen] = useState(false);
    const [selectNapron, setSelectNapron] = useState(null);

    const handleSelectNapron = (napron) =>{
        setSelectNapron(napron)
    }

    const [selectedSido, setSelectedSido] = useState(null);
    const [sidos, setSidos] = useState([
        '강원도', '경기도', '경상도', '광주', '대구',
        '대전', '부산', '서울', '인천', '울산',
        '전라도', '제주', '충청도'
    ]);

    const handleSidoSelection = (sido) => {
        // 현재 선택된 지역이 다시 클릭되면 선택 해제
        if (selectedSido === sido) {
            setSelectedSido(null);
        } else {
            setSelectedSido(sido);
        }
    };

    // 시도 지역페이지나누기
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 9; // 한 페이지당 9개의 항목을 표시
    const maxPage = Math.ceil(sidos.length / itemsPerPage) - 1;

    // 페이지를 변경하는 함수
    const goToNextPage = () => setCurrentPage((page) => Math.min(page + 1, maxPage));
    const goToPrevPage = () => setCurrentPage((page) => Math.max(page - 1, 0));

    // 현재 페이지에 맞는 항목의 범위 계산
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = sidos.slice(startIndex, endIndex);



    const [selectZeroWaste, setSelectZeroWaste] = useState(null);
    const [zeroWastes, setzeroWastes] = useState(['제로마켓', '서울', '경기', '인천', '강원도', '충청도','경상도', '전라도', '제주도']);

    const handleZeroWasteSelection = (zeroWaste) => {
        // 현재 선택된 카테고리가 다시 클릭되면 선택 해제
        if (selectZeroWaste === zeroWaste) {
            setSelectZeroWaste(null);
        } else {
            setSelectZeroWaste(zeroWaste);
        }
    };


    const [selectMark, setSelectZeroMark] = useState(null);
    const [zeroMarks, setzeroMarks] = useState(['서울', '경기', '인천', '강원도', '충청도','경상도', '전라도', '제주']);

    const handleMarkSecletion = (zeroMark) =>{
        if(selectMark === zeroMark) {
            setSelectZeroMark(null);
        }else {
            setSelectZeroMark(zeroMark);
        }
    }


    return (
        <div className="App">
            <header className="top-nav">
                <h1><NavLink to="/">
                    <h3><span>ECO</span> RECYCLE HUB</h3>
                </NavLink>
                </h1>
                <div className="site-icon">
                    <GiEcology/>
                </div>
                <nav className="nav-links">
                    <NavLink to='/mymap'>Eco-Map</NavLink>
                    <NavLink to="/edust">초미세먼지현황</NavLink>
                    <NavLink to="/search">버스길찾기</NavLink>
                    <NavLink to="/car">자동차 길찾기</NavLink>
                    <NavLink to="/chart">인수님차트</NavLink>
                </nav>

            </header>

            <header className="header-Top">
                <div className="tNumb-address">
                    <h5 className="site-numb">
                        T.02-2038-0800</h5>
                    <h5 className="address">서울 금천구 가산디지털2로 144 현대테라타워 가산DK 20층</h5>
                </div>

                <div className="user-btn">
                    {isLogin ? (
                        <div className="login-btn">
                            <button className="dropdown-btn">{login.nickname} ▼</button>
                            <div className="dropdown-content">
                                <NavLink className="myPage" to="/mypage">마이페이지</NavLink>
                                <button className="nav-link" onClick={logout}>로그아웃</button>
                            </div>
                        </div>
                    ) : (
                        <NavLink to="/login" className="login-btn">로그인</NavLink>
                    )}
                    <GiHamburgerMenu/>
                </div>

            </header>
            <section className="sidebar">
                {reshop &&
                    <RecyclingCenters closeReshop={() => setReashop(false)} setReashop={setReashop} reshop={reshop}
                                      markerData={selectedMarker}/>}
                {openZero &&
                    <ZeroCenters closeZeroshop={() => setOpenZero(false)} setOpenZero={setOpenZero} openZero={openZero}
                                 selectZeroshop={selectZeroshop}/>}
                {napronOpen && <NapronCenters closeNapron={() => setNapronOpen(false)} setNapronOpen={setNapronOpen}
                                              napronOpen={napronOpen} selectNapron={selectNapron}/>}
                <header>
                    <nav>
                        <button className="hamburger-btn">
                            <FiAlignJustify/>
                        </button>
                        <h2><NavLink to="/">ECO Recycle Hub</NavLink></h2>
                    </nav>
                    <div className="head-weather">
                        <div className="myLocation">
                            <Weather/>
                        </div>
                    </div>
                </header>
                <div className="main-contents">
                    <div className="small_nav">
                        <button className="nav_button" onClick={() => toggleView('sidos')}>페트병수거함</button>
                        <button className="nav_button" onClick={() => toggleView('zeroWastes')}>제로웨이스트</button>
                        <button className="nav_button" onClick={() => toggleView('zeroMarks')}>재활용센터</button>
                    </div>
                    <div className="search-location">
                        {/*<BsArrowRightCircle className="start-point" />*/}
                        <input
                            className="start-place"
                            placeholder="출발지를 입력하세요."/>
                        <input
                            className="end-place"
                            placeholder="도착지를 입력하세요."/>
                        {/*<BsArrowLeftCircle  className="end-point"/>*/}
                    </div>

                    <div className="search-cate">
                        <ul>
                            <li><FaCar/></li>
                            <li><FaTrainSubway/></li>
                            <li><FaBusAlt/></li>
                            <li><FaPersonWalking/></li>
                        </ul>
                        <button className="search-btn">길찾기</button>
                    </div>
                    <div>
                        {renderRouteDetails()}
                        {renderFullRouteDetails()}
                    </div>

                    {currentView === 'sidos' && (
                        <div>
                            <div className="senter-marker">
                                {currentItems.map((sido) => (
                                    <button key={sido} onClick={() => handleSidoSelection(sido)}>
                                        {sido}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {currentView === 'zeroWastes' && (
                        <div className="senter-marker">
                            {zeroWastes.map((zeroWaste, index) => (
                                <button key={zeroWaste} onClick={() => handleZeroWasteSelection(zeroWaste)}>
                                    {zeroWaste}
                                </button>
                            ))}
                        </div>
                    )}
                    {currentView === 'zeroMarks' && (
                        <div className="senter-marker">
                            {zeroMarks.map((zeroMark, index) => (
                                <button key={zeroMark} onClick={() => handleMarkSecletion(zeroMark)}>
                                    {zeroMark}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </section>
            <div className="Chatbot">
                <button
                    className="chat-open-btn"
                    // onClick={openChat}
                    onClick={() => {
                        setChatbot(!chatbot)
                    }}><IoLogoWechat/>
                </button>
                {''}
                {chatbot && <Chatbot closeChat={() => setChatbot(false)}/>}
            </div>

            <section className="main-con">
                <Routes>
                    <Route path="/" element={<div className="Info">

                        <h1>Echo Recycling Hub</h1>
                        <h2> 환영합니다! </h2>
                        <p>우리의 목표는 지구와 함께 지속 가능한 생활을 영위하고자 하는 모두에게 유용한 정보와 도구를 제공하는 것입니다.</p>
                        <p>이 웹 페이지는 지도 기능을 활용하여 주변 재활용 센터, 페트병 수거 자판기, 제로 웨이스트 샵과 같은 환경 관련 시설을 쉽게 찾을 수 있도록 도와줍니다.</p>
                        <p> 더불어, 폐기물 배출량과 미세먼지 농도와 같은 환경 지표를 시각적으로 제공하여 사용자들이 지역의 환경 상태를 쉽게 파악할 수 있습니다.</p>

                        <p> 또한, 사용자의 위치를 기준으로 가장 가까운 제로 웨이스트 샵까지의 길찾기 기능을 제공하여 지속 가능한 소비를 장려합니다.</p>
                        <p> 이를 통해 우리는 각자의 일상 속에서 환경을 생각하고 실천할 수 있는 기회를 제공하고자 합니다.</p>

                        <p> 우리는 지구를 위한 작은 변화가 모여 큰 변화를 이끌어낼 수 있다고 믿습니다. 함께하는 모든 분들의 작은 노력이 우리의 환경을 더욱</p>
                        <p> 건강하고 지속 가능하게 만들어갈 것입니다.</p>
                        <p> 지금 바로 이 웹 페이지를 통해 우리의 환경을 위한 첫걸음을 내딛어보세요. 함께라면 가능합니다!</p>
                    </div>}/>
                    <Route path="/MyMap"
                           element={<MyMap selectedSido={selectedSido} selectZeroWaste={selectZeroWaste}
                                           selectMark={selectMark} setReashop={setReashop}
                                           setOpenZero={setOpenZero} setNapronOpen={setNapronOpen}
                                           onMarkerClick={handleMarkerClick} onZeroClick={handleSelectZeroShop}
                                           onNapronClick={handleSelectNapron} setCarRoutes={setCarRoutes}
                                           carRoutes={carRoutes}
                                           setFullRoutesDetails={setFullRoutesDetails}/>}/>
                    <Route path="/login"
                           element={<LoginPage setLoginStatus={setIsLogin} setLoginUser={setLogin}/>}/>
                    <Route path="/logout" element={<LogoutPage/>}/>
                    <Route path="/edust" element={<AutoSwitchingViewer/>}/>
                    <Route path="/search" element={<Search_location/>}/>
                    <Route path="/car" element={<Search_location_car/>}/>
                    <Route path="/chart" element={<ChartComponent/>}/>
                </Routes>
            </section>

        </div>
    );
}


function WeatherStatus() {

    return (
        <div className="model">
            <img
                style={{width: "43%", height: "auto", float: "right"}}
                alt="초미세먼지 모델 한반도"
                src="https://www.airkorea.or.kr/file/proxyImage?fileName=2024/04/16/AQFv1_09h.20240414.KNU_09_01.PM2P5.2days.ani.gif"
            />
        </div>
    );
}


export default App;
