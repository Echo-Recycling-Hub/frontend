import {
    Map,
    MapMarker,
    MapTypeControl,
    MapTypeId,
    ZoomControl,
    Polygon,
    MapInfoWindow,
    Polyline,
    useMap
} from "react-kakao-maps-sdk";
import React, {useEffect, useState} from "react";
import proj4 from 'proj4';
import "bootstrap/js/dist/collapse";
import "../css/KakaoMap.css";
import axios from "axios";
import RecyclingCenters from "./bar_Reyc";
import ZeroCenters from "./bar_zero";
import NapronCenters from "./bar_Napron";
import {FiAlignJustify} from "react-icons/fi";
import {NavLink} from "react-router-dom";
import Weather from "./weather";
import {FaBusAlt, FaCar} from "react-icons/fa";
import {FaPersonWalking, FaTrainSubway} from "react-icons/fa6";
import {add} from "proj4/lib/projections";


function MyMap() {
    let [reshop, setReashop] = useState(false);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const handleMarkerClick = (markerData) => {
        setSelectedMarker(markerData);
    };

    let [openZero, setOpenZero] = useState(false);
    const [selectZeroshop, setSelectZeroshop] = useState(null);

    const toggleView = (view) => {
        setCurrentView(currentView === view ? null : view);
    };

    const [currentView, setCurrentView] = useState(null);
    const handleSelectZeroShop = (selectZeroshop) => {
        setSelectZeroshop(selectZeroshop);
    };

    let [napronOpen, setNapronOpen] = useState(false);
    const [selectNapron, setSelectNapron] = useState(null);

    const handleSelectNapron = (napron) => {
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


    const [selectZeroWaste, setSelectZeroWaste] = useState(null);
    const [zeroWastes, setzeroWastes] = useState(['제로마켓', '서울', '경기', '인천', '강원도', '충청도', '경상도', '전라도', '제주도']);

    const handleZeroWasteSelection = (zeroWaste) => {
        // 현재 선택된 카테고리가 다시 클릭되면 선택 해제
        if (selectZeroWaste === zeroWaste) {
            setSelectZeroWaste(null);
        } else {
            setSelectZeroWaste(zeroWaste);
        }
    };


    const [selectMark, setSelectZeroMark] = useState(null);
    const [zeroMarks, setzeroMarks] = useState(['서울', '경기', '인천', '강원도', '충청도', '경상도', '전라도', '제주']);

    const handleMarkSecletion = (zeroMark) => {
        if (selectMark === zeroMark) {
            setSelectZeroMark(null);
        } else {
            setSelectZeroMark(zeroMark);
        }
    }


    /* global kakao */
    const [traffic, setTraffic] = useState(false);
    const [mapTypeId, setMapTypeId] = useState();

    const [cityData, setCityData] = useState([]);

    const [map, setMap] = useState();

    const [center, setCenter] = useState({lat: 37.558185572111356, lng: 127.00091673775184});

    const [level, setLevel] = useState(9);


    const handleMapCreate = (map) => {
        setMap(map);
    };

    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [error, setError] = useState(null);


    // 내위치로 이동
    const moveToCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by this browser.");
            // 내가 원하는 기본 위치로 지도 중심 설정
            const defaultLatitude = 37.47713483253; // 기본 위도값
            const defaultLongitude = 126.88014275474; // 기본 경도값
            setLatitude(defaultLatitude);
            setLongitude(defaultLongitude);
            setCenter({ lat: defaultLatitude, lng: defaultLongitude }); // 기본 위치로 지도 중심 설정
            setLevel(3); // 확대 레벨 설정
            fetchAddress(defaultLatitude, defaultLongitude); // 기본 위치의 주소 조회

            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const newCenter = { lat: latitude, lng: longitude };

                setLatitude(latitude);
                setLongitude(longitude);
                setCenter(newCenter); // 현재 위치로 지도 중심 설정
                setLevel(3); // 확대 레벨 설정
                fetchAddress(latitude, longitude); // 주소 조회

                setError(null);
            },
            (error) => {
                console.error("Error fetching current location:", error);
                setError("현재 위치를 가져올 수 없습니다.");

                // 내가 원하는 기본 위치로 지도 중심 설정
                const defaultLatitude = 37.47713483253; // 기본 위도값
                const defaultLongitude = 126.88014275474; // 기본 경도값
                setLatitude(defaultLatitude);
                setLongitude(defaultLongitude);
                setCenter({ lat: defaultLatitude, lng: defaultLongitude }); // 기본 위치로 지도 중심 설정
                setLevel(3); // 확대 레벨 설정
                fetchAddress(defaultLatitude, defaultLongitude); // 기본 위치의 주소 조회
            },
            { enableHighAccuracy: true }
        );
    };



    const fetchAddress = (lat, lng) => {
        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.coord2Address(lng, lat, function (results, status) {
            if (status === kakao.maps.services.Status.OK) {
                const addressName = results[0].address.address_name;
                setUserAddress(addressName);
            }
        });
    };

    // 내위치 마크이동핸들러
    const handleMarkerDragEnd = (marker) => {
        const position = marker.getPosition();
        const newLatitude = position.getLat();
        const newLongitude = position.getLng();

        setLatitude(newLatitude);
        setLongitude(newLongitude);

        setCenter({ lat: newLatitude, lng: newLongitude });

        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.coord2Address(newLongitude, newLatitude, function (results, status) {
            if (status === kakao.maps.services.Status.OK) {
                const addressName = results[0].address.address_name;
                setUserAddress(addressName);
            }
        });
    };

    useEffect(() => {
        if (map && center) {
            map.setCenter(new kakao.maps.LatLng(center.lat, center.lng));
            map.setLevel(level);
        }
    }, [map, center, level]);


    const [loading, setLoading] = useState(false);
    const [clickedLat, setClickedLat] = useState(null);
    const [clickedLng, setClickedLng] = useState(null);
    const [userAddress, setUserAddress] = useState("");  // 주소 상태
    const [address, setAddress] = useState("");  // 주소 상태

    // handleFetchData 함수 수정
    const handleFetchData = async () => {
        setLoading(true);
        try {
            // const response = await axios.post('http://54.82.4.76:5000/kakao', {
            const response = await axios.post('http://localhost:5000/kakao', {
                currentLatitude: latitude,
                currentLongitude: longitude,
                clickedLatitude: clickedLat,
                clickedLongitude: clickedLng
            });
            console.log('Server response:', response.data);
            if (response.data && response.data.carRouteInfo) {
                const data = typeof response.data.carRouteInfo === 'string' ?
                    JSON.parse(response.data.carRouteInfo) : response.data.carRouteInfo;
                setCarRoutes(data.routes);
            } else {
                console.error('Invalid or missing carRouteInfo in response:', response.data);
                setError('서버로부터 유효한 경로 정보를 받지 못했습니다.');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(`경로 정보를 가져오는 데 실패했습니다. 에러 메시지: ${error.message}`);
        }
        setLoading(false);
    };

    const [busRoutes, setBusRoutes] = useState([]);

    const handlBusData = async () => {
        setLoading(true);
        try {
            // const response = await axios.post('http://54.82.4.76:5000/location', {
            const response = await axios.post('http://localhost:5000/location', {
                currentLatitude: latitude,
                currentLongitude: longitude,
                clickedLatitude: clickedLat,
                clickedLongitude: clickedLng
            });
            console.log("API Response:", response.data);  // API 응답 전체 로깅

            if (response.data) {
                if (response.data.busRoutesData) {
                    const busRoutesData = Object.values(response.data.busRoutesData);  // 객체를 배열로 변환
                    console.log("Converted busRoutesData:", busRoutesData);  // 변환된 배열 로깅
                    setBusRoutes(busRoutesData);
                } else {
                    console.error("No busRoutesData found or it is not in the expected format");
                    setBusRoutes([]);
                }

                if (response.data.fullResponseData && response.data.fullResponseData.msgBody) {
                    const fullRouteDetails = response.data.fullResponseData.msgBody.itemList;
                    console.log("Full Route Details:", fullRouteDetails);  // 전체 노선 세부 정보 로깅
                    setFullRoutesDetails(fullRouteDetails);
                } else {
                    console.error("No fullResponseData found or it is not in the expected format");
                    setFullRoutesDetails([]);
                }
            }
        } catch (error) {
            setError(`Failed to fetch data: ${error.message}`);
            console.error("API Request failed:", error);
        }
        setLoading(false);
    };
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 9; // 한 페이지당 9개의 항목을 표시
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = sidos.slice(startIndex, endIndex);

    const renderBusRoutes = () => {
        return busRoutes.map((route, index) => {
            console.log("Route Data:", route);  // 각 노선 데이터 로깅
            const pathList = route.msgBody && route.msgBody.itemList ? route.msgBody.itemList : [];  // itemList 접근 로직 수정

            if (!Array.isArray(pathList) || pathList.length === 0) {
                console.error('No pathList available for route:', route);
                return null;
            }

            return (
                <Polyline
                    key={index}
                    path={pathList.map(point => ({
                        lat: parseFloat(point.gpsY),
                        lng: parseFloat(point.gpsX)
                    }))}
                    strokeWeight={5}
                    strokeColor="#FF0000"
                    strokeOpacity={0.7}
                    strokeStyle="solid"
                />
            );
        });
    };

    // 클릭한위치 마커생성
    const [markerPosition, setMarkerPosition] = useState(null);
    const handleMapClick = (_, mouseEvent) => {
        // mouseEvent 객체에서 위도, 경도 정보 추출
        const Maplatlng = mouseEvent.latLng;
        if (!Maplatlng) {
            console.error('No latLng object found in mouse event');
            return; // latLng 객체가 없으면 함수를 종료
        }
        const Maplat = Maplatlng.getLat().toFixed(7);
        const Maplng = Maplatlng.getLng().toFixed(7);
        setClickedLat(Maplat); // 클릭한 위도 저장
        setClickedLng(Maplng); // 클릭한 경도 저장
        setMarkerPosition({lat: parseFloat(Maplat), lng: parseFloat(Maplng)});
    };

    // 클릭한 마커위치 주소로바꾸기
    useEffect(() => {
        // Geocoder 객체생성
        const geocoder = new kakao.maps.services.Geocoder();
        const lookupAddress = () => {
            if (clickedLat && clickedLng) {
                // 좌표를 주소로 변환
                geocoder.coord2Address(clickedLng, clickedLat, function (results, status) {
                    if (status === kakao.maps.services.Status.OK) {
                        setAddress(results[0].address.address_name);
                    } else {
                        setAddress("주소를 찾을 수 없습니다.")
                    }
                });
            }
        };

        lookupAddress();
    }, [clickedLat, clickedLng]);



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


    // 버스길찾기 정보창
    const [fullRoutesDetails, setFullRoutesDetails] = useState([]);
    const renderFullRouteDetails = () => {
        return fullRoutesDetails.map((detail, index) => {
            // pathList에서 세부 정보 추출 (경로 정보)
            const pathList = detail.pathList || [];
            // time과 distance는 detail 객체에서 직접 접근
            const time = detail.time || "Not available";
            const distance = detail.distance || "Not available";

            return (
                <div className="search-result" key={index}>
                    <h3 className="result-time">{time}분</h3>
                    <p className="result-distance">{distance}m</p>
                    {/*<h3>검색결과</h3>*/}
                    {pathList.map((path, idx) => (
                        <div className="result" key={idx}>
                            <p className="result-transport">{path.routeNm || "Not available"}</p>
                            <p>{path.fname || "Not available"} 승차</p>
                            <p>{path.tname || "Not available"} 하차</p>
                        </div>
                    ))}
                    <button>경로보기</button>
                </div>
            );
        });
    };


    // 교통정보 토글 함수
    const toggleTraffic = () => {
        setTraffic(!traffic);
        setMapTypeId(traffic ? null : "TRAFFIC");
    };

    // 로드뷰 토글 함수
    const toggleRoadView = () => {
        setMapTypeId(mapTypeId === "ROADVIEW" ? null : "ROADVIEW");
    };

    // 지적편집도 토글 함수
    const toggleUseDistrict = () => {
        setMapTypeId(mapTypeId === "USE_DISTRICT" ? null : "USE_DISTRICT");
    };

    const handleFetchCityData = async () => {
        if (cityData.length === 0) {  // 데이터가 로드되지 않았다면 데이터 로드
            try {
                // const response = await fetch('http://54.82.4.76:5000/city');
                const response = await fetch('http://localhost:5000/city');
                if (!response.ok) {
                    throw new Error('데이터를 불러올 수 없습니다.');
                }
                const jsonData = await response.text();
                const firstParse = JSON.parse(jsonData);
                const dataObj = JSON.parse(firstParse);

                const utmkDef = '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=bessel +units=m +no_defs';
                const wgs84Def = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs';

                const transformedFeatures = dataObj.features.map(feature => ({
                    ...feature,
                    geometry: {
                        ...feature.geometry,
                        coordinates: feature.geometry.type === 'MultiPolygon' ?
                            feature.geometry.coordinates.map(polygon =>
                                polygon.map(ring =>
                                    ring.map(coord => proj4(utmkDef, wgs84Def, [coord[0], coord[1]]))
                                )
                            ) :
                            feature.geometry.coordinates.map(ring =>
                                ring.map(coord => proj4(utmkDef, wgs84Def, [coord[0], coord[1]]))
                            )
                    }
                }));

                setCityData(transformedFeatures);
            } catch (error) {
                console.error('데이터를 불러오는 중 오류 발생:', error);
                setCityData([]);
            }
        }
        setShowMap(!showMap);  // 지도 표시 상태 토글
    };


    const [selectedArea, setSelectedArea] = useState(null);
    const [hoverArea, setHoverArea] = useState(null);

    const handleClick = (area) => {
        if (selectedArea && selectedArea.properties.시군구명 === area.properties.시군구명) {
            setSelectedArea(null);
        } else {
            setSelectedArea(area);
        }

    };


    const [showMap, setShowMap] = useState(false);


    const [allMarkers, setAlltMarkers] = useState([]);
    const [RMarkers, setRMarkers] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                // const response = await fetch('http://54.82.4.76:3000/recyclingcenters');
                const response = await fetch('http://localhost:3001/recyclingcenters');
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                const jsonData = await response.json();
                console.log(jsonData)
                setAlltMarkers(jsonData); // 전체 데이터를 상태에 저장
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const MarkRules = {
        서울: ADDRESSOLD => /서울/i.test(ADDRESSOLD || ''),
        경기: ADDRESSOLD => /경기/i.test(ADDRESSOLD || ''),
        인천: ADDRESSOLD => ADDRESSOLD?.toUpperCase().startsWith('인천') || false,
        강원도: ADDRESSOLD => /강원/i.test(ADDRESSOLD || ''),
        충청도: ADDRESSOLD => /충청/i.test(ADDRESSOLD || ''),
        경상도: ADDRESSOLD => /경상/i.test(ADDRESSOLD || ''),
        전라도: ADDRESSOLD => /전라/i.test(ADDRESSOLD || ''),
        제주도: ADDRESSOLD => ADDRESSOLD?.toUpperCase().startsWith('제주') || false,
    };


    useEffect(() => {
        if (selectMark && allMarkers.length > 0) {
            const matchingRule = MarkRules[selectMark];
            if (matchingRule) {
                const filterWaste = allMarkers.filter(item => {
                    const result = matchingRule(item.ADDRESSOLD);
                    return result;
                });
                setRMarkers(filterWaste);
            }
        } else {
            setRMarkers([]);
        }

    }, [selectMark, allMarkers]);


    const [allData, setAllData] = useState([]); // 전체 데이터
    const [displayData, setDisplayData] = useState([]); // 화면에 표시할 데이터

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const response = await fetch('http://54.82.4.76:3000/napron');
                const response = await fetch('http://localhost:3001/napron');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData = await response.json();
                setAllData(jsonData); // 전체 데이터를 상태에 저장
                console.log(jsonData)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);


    const sidosRules = {
        강원도: SIDO => /(강원)/.test(SIDO),
        경기도: SIDO => /(경기)/.test(SIDO),
        경상도: SIDO => /(경상)/.test(SIDO),
        광주: SIDO => /(광주)/.test(SIDO),
        대구: SIDO => /(대구)/.test(SIDO),
        대전: SIDO => /(대전)/.test(SIDO),
        부산: SIDO => /(부산)/.test(SIDO),
        서울: SIDO => /(서울)/.test(SIDO),
        인천: SIDO => /(인천)/.test(SIDO),
        울산: SIDO => /(울산)/.test(SIDO),
        전라도: SIDO => /(전라)/.test(SIDO),
        제주: SIDO => /(제주)/.test(SIDO),
        충청도: SIDO => /(충청)/.test(SIDO),
        // 나머지 카테고리에 대해서도 비슷한 규칙을 추가합니다.
    };


// 시도 선택 핸들러
    useEffect(() => {
        console.log(selectedSido)
        if (selectedSido && allData.length > 0) {
            const matchsidoData = sidosRules[selectedSido];
            console.log(matchsidoData)
            if (matchsidoData) {
                const filterWaste = allData.filter(item => {
                    const result = matchsidoData(item.SIDO);
                    return result;
                });
                setDisplayData(filterWaste);
            }
        } else {
            setDisplayData([]);  // 선택이 해제되면 마커 데이터를 비웁니다.
        }
    }, [selectedSido, allData]);


    // 제로웨이스트샵
    const [wasteAll, setwasteAll] = useState([]);
    const [wasteMarker, setWasteMarker] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const response = await fetch('http://54.82.4.76:3000/zero')
                const response = await fetch('http://localhost:3001/zero')
                if (!response.ok) {
                    throw new Error('에러남..;;')
                }
                const jsonData = await response.json();
                console.log(wasteAll)
                setwasteAll(jsonData);
            } catch (error) {
                console.log('제로웨이스트에러');
            }
        };
        fetchData();
    }, []);

    const categoryRules = {
        제로마켓: NAME => /(남원점|신구로점)/.test(NAME),
        서울: NAME => NAME.startsWith('서울'),
        경기: NAME => /(고양|광명|김포|남양주|부천|분당|성남|수원|시흥|오산|용인|파주|평택|하남|화성)/.test(NAME),
        인천: NAME => NAME.startsWith('인천'),
        강원도: NAME => /(강릉|원주|춘천)/.test(NAME),
        충청도: NAME => /(논산|대전|천안|태안|청주|당진)/.test(NAME),
        경상도: NAME => /(경주|구미|김천|김해|대구|부산|안동|양산|울산|진주|창원|통영)/.test(NAME),
        전라도: NAME => /(광주|군산|나주|담양|순천|목포|전주)/.test(NAME),
        제주도: NAME => NAME.startsWith('제주')
        // 나머지 카테고리에 대해서도 비슷한 규칙을 추가합니다.
    };

    useEffect(() => {
        // 제로 웨이스트 카테고리 선택에 따른 마커 표시
        if (selectZeroWaste && wasteAll.length > 0) {
            const matchingRule = categoryRules[selectZeroWaste];
            if (matchingRule) {
                const filterWaste = wasteAll.filter(item => matchingRule(item.NAME));
                setWasteMarker(filterWaste);
            }
        } else {
            setWasteMarker([]);  // 선택이 해제되면 마커 데이터를 비웁니다.
        }
    }, [selectZeroWaste, wasteAll]);

    return (
        <div className="My_Map_con">
            <div className="map_nav"></div>
            <section className="sidebar_side">
                <div className="search-location">
                    <div className="location"><h3>길찾기</h3></div>
                    <div className="address-row">
                        <div className="label">출발지</div>
                        <div className="search-location1">{userAddress}</div>
                    </div>
                    <div className="address-row">
                        <div className="label">도착지</div>
                        <div className="search-location1">{address}</div>
                    </div>
                </div>

                <div className="search-cate">
                <button><FaBusAlt onClick={handlBusData}/></button>
                    <button><FaCar onClick={handleFetchData}/></button>
                    <button><FaPersonWalking/></button>
                    <button className="search-btn" onClick={handlBusData}>길찾기</button>
                </div>
                <div className="result-trans">
                    {renderRouteDetails()}
                    {renderFullRouteDetails()}
                </div>
                {/*<header>*/}
                {/*    <h2><NavLink to="/">ECO Recycle Hub</NavLink></h2>*/}
                {/*    <div className="head-weather">*/}
                {/*        <div className="myLocation">*/}
                {/*            <Weather/>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</header>*/}
            </section>
            <section className="sidebar">
                <div className="imgbox"></div>
                {reshop &&
                    <RecyclingCenters closeReshop={() => setReashop(false)} setReashop={setReashop} reshop={reshop}
                                      markerData={selectedMarker}/>}
                {openZero &&
                    <ZeroCenters closeZeroshop={() => setOpenZero(false)} setOpenZero={setOpenZero} openZero={openZero}
                                 selectZeroshop={selectZeroshop}/>}
                {napronOpen && <NapronCenters closeNapron={() => setNapronOpen(false)} setNapronOpen={setNapronOpen}
                                              napronOpen={napronOpen} selectNapron={selectNapron}/>}

                <div className="main-contents">
                    <div className="small_nav">
                        <button className="nav_button" onClick={() => toggleView('sidos')}>페트병수거함</button>
                        <button className="nav_button" onClick={() => toggleView('zeroWastes')}>제로웨이스트</button>
                        <button className="nav_button" onClick={() => toggleView('zeroMarks')}>재활용센터</button>
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
            <div
                className="map-con"
            >
                <Map
                    center={center}
                    level={level}
                    onCreate={handleMapCreate}
                    className="Map" // 지도 객체가 생성되면 setMap을 통해 상태 업데이트
                    onClick={handleMapClick}
                >
                    <MapTypeControl position={"TOPRIGHT"}/>
                    <ZoomControl position={"RIGHT"}/>

                    {/*서울지도표시*/}
                    {showMap && cityData.map((area, index) => (
                        <Polygon
                            key={index}
                            path={area.geometry.coordinates[0].map(coord => ({lat: coord[1], lng: coord[0]}))}
                            strokeWeight={3}
                            strokeColor="#004c80"
                            strokeOpacity={0.8}
                            fillColor={
                                selectedArea === area ? "rgba(0, 0, 0, 0)" :
                                    hoverArea === area ? "#09f" :
                                        "#fff"
                            } // 조건부 색상 변경
                            fillOpacity={0.7}
                            onMouseover={() => setHoverArea(area)}
                            onMouseout={() => setHoverArea(null)}
                            onClick={() => handleClick(area)}
                        />
                    ))}
                    {carRoutes.map((route, index) => {
                        const path = route.sections.flatMap(section =>
                            section.roads.flatMap(road =>
                                road.vertexes.length >= 2 ? road.vertexes.reduce((acc, val, idx, arr) => {
                                    if (idx % 2 === 0 && arr[idx + 1] !== undefined) {
                                        acc.push({lat: arr[idx + 1], lng: val});
                                    }
                                    return acc;
                                }, []) : []
                            )
                        );

                        return (
                            <Polyline
                                key={index}
                                path={path}
                                strokeWeight={5}
                                strokeColor={'red'} // 수정: 각 경로의 교통 정보에 따라 색상 결정
                                strokeOpacity={0.7}
                                strokeStyle={'solid'}
                            />
                        );
                    })}
                    {renderBusRoutes()}
                    {/*클릭한위치 마커생성*/}
                    {markerPosition && (
                        <MapMarker
                            position={markerPosition}
                            clickable={true} // 마커 클릭 가능 설정
                        >
                            <div>여기가 클릭한 위치입니다!</div>
                        </MapMarker>

                    )}
                    {/*내위치마커*/}
                    {latitude && longitude && (
                        <MapMarker
                            position={{lat: latitude, lng: longitude}}
                            image={{
                                src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png",
                                size: {
                                    width: 24,
                                    height: 35
                                }
                            }}
                            draggable={true}
                            onDragEnd={(marker) => handleMarkerDragEnd(marker)}
                        />
                    )}


                    {/*로드뷰, 지형뷰등*/}
                    {mapTypeId && <MapTypeId type={mapTypeId}/>}

                    {/*재활용센터 마커*/}
                    {RMarkers.map((item, index) => {
                        const lat = parseFloat(item.LATITUDE);
                        const lng = parseFloat(item.LONGITUDE);

                        return (
                            <MapMarker
                                key={index}
                                image={{
                                    src: "./img/west1.png",
                                    size: {
                                        width: 30,
                                        height: 35,
                                    }
                                }}
                                position={{lat, lng}}
                                title={item.NAME}
                                onClick={() => {
                                    handleMarkerClick(item);
                                    setReashop(true)
                                }}
                            />
                        );
                    })}


                    {/*네프론 마커*/}
                    {displayData.map((item, index) => {
                        const lat = parseFloat(item.LATITUDE);
                        const lng = parseFloat(item.LONGITUDE);
                        return (

                            <MapMarker
                                key={index}
                                image={{
                                    src: ".\\img\\pet1.png",
                                    size: {
                                        width: 24,
                                        height: 35,
                                    }
                                }}
                                position={{lat, lng}}
                                title={item.NAME}
                                onClick={() => {
                                    setNapronOpen(true);
                                    handleSelectNapron(item)
                                }}

                            />
                        );
                    })}


                    {/*제로웨이스트 마커*/}
                    {wasteMarker.map((item, index) => {
                        const lat = parseFloat(item.LATITUDE);
                        const lng = parseFloat(item.LONGITUDE);
                        return (

                            <MapMarker
                                key={index}
                                image={{
                                    src: ".\\img\\zero3.png",
                                    size: {
                                        width: 30,
                                        height: 35,
                                    }
                                }}
                                position={{lat, lng}}
                                title={item.NAME}
                                onClick={() => {
                                    handleSelectZeroShop(item);
                                    setOpenZero(true)
                                }}
                            />
                        );
                    })}

                </Map>
                <div className="Mymap-btn">
                        <button onClick={toggleTraffic}>교통정보</button>
                        <button onClick={toggleRoadView}>로드뷰</button>
                        <button onClick={toggleUseDistrict}>지적편집도</button>
                        <button onClick={handleFetchCityData}>서울지도</button>
                        {/*<button onClick={handlBusData}>버스길찾기</button>*/}
                        <button onClick={moveToCurrentLocation}>내 위치</button>
                </div>
            </div>
        </div>
    );
}


export default MyMap;
