import {
    Map,
    MapMarker,
    MapTypeControl,
    MapTypeId,
    ZoomControl,
    Polygon,
    MapInfoWindow,
    Polyline
} from "react-kakao-maps-sdk";
import React, { useEffect, useState } from "react";
import proj4 from 'proj4';
import "bootstrap/js/dist/collapse";
import "../../css/KakaoMap.css";
import axios from "axios";


function MyMap({selectedSido, selectZeroWaste, selectMark, setReashop, onMarkerClick, onZeroClick,
                   setOpenZero, onNapronClick,  setNapronOpen, currentPosition, clickedPosition, setClickedPosition,
                   setCarRoutes, carRoutes, latitude, longitude, clickedLat, clickedLng, moveToCurrentLocation, setCenter,center}) {
    /* global kakao */
    const [traffic, setTraffic] = useState(false);
    const [mapTypeId, setMapTypeId] = useState();

    const [cityData, setCityData] = useState([]);

    const [map, setMap] = useState();

    const [level, setLevel] = useState(9);


    const handleMapCreate = (map) => {
        setMap(map);
    };

    const [error, setError] = useState(null);


// 사용자 위치로 이동하는 함수
//     const moveToCurrentLocation = () => {
//         if (!navigator.geolocation) {
//             alert("Geolocation is not supported by this browser.");
//             return;
//         }
//
//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 const { latitude, longitude } = position.coords;
//                 const newCenter = { lat: latitude, lng: longitude };
//                 setCenter(newCenter);
//                 setCurrentPosition(newCenter);  // 현재 위치를 상태에 저장
//                 setLevel(3);  // 줌 레벨 조정
//                 setLatitude(position.coords.latitude);
//                 setLongitude(position.coords.longitude);
//                 setError(null);
//             },
//             (error) => {
//                 console.error("Error fetching current location:", error);
//                 alert("현재 위치를 가져올 수 없습니다.");
//             },
//             { enableHighAccuracy: true }
//         );
//     };

    // handleFetchData 함수 수정
    // const handleFetchData = async () => {
    //     setLoading(true);
    //     try {
    //         const response = await axios.post('http://localhost:5000/kakao', {
    //             currentLatitude: latitude,
    //             currentLongitude: longitude,
    //             clickedLatitude: clickedLat,
    //             clickedLongitude: clickedLng
    //         });
    //         console.log('Server response:', response.data);
    //         if (response.data && response.data.carRouteInfo) {
    //             const data = typeof response.data.carRouteInfo === 'string' ?
    //                 JSON.parse(response.data.carRouteInfo) : response.data.carRouteInfo;
    //             setCarRoutes(data.routes);
    //         } else {
    //             console.error('Invalid or missing carRouteInfo in response:', response.data);
    //             setError('서버로부터 유효한 경로 정보를 받지 못했습니다.');
    //         }
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //         setError(`경로 정보를 가져오는 데 실패했습니다. 에러 메시지: ${error.message}`);
    //     }
    //     setLoading(false);
    // };

    // 클릭한위치 마커생성
    const [markerPosition, setMarkerPosition] = useState(null);
    // const handleMapClick = (mouseEvent) => {
    //     setClickedPosition({
    //         lat: mouseEvent.latLng.getLat(),
    //         lng: mouseEvent.latLng.getLng()
    //     });
    // };


    useEffect(() => {
        if (map) {
            map.setCenter(new kakao.maps.LatLng(center.lat, center.lng));
            map.setLevel(level);
        }
    }, [map, center, level]);


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



    useEffect(() => {
        const fetchCityData = async () => {
            try {
                const response = await fetch('http://localhost:5000/city');
                if (!response.ok) {
                    throw new Error('데이터를 불러올 수 없습니다.');
                }
                const jsonData = await response.text(); // 서버에서 받은 JSON 문자열
                const firstParse = JSON.parse(jsonData); // 첫 번째 파싱으로 외부 문자열 제거
                const dataObj = JSON.parse(firstParse); // 두 번째 파싱으로 실제 JSON 객체 추출

                console.log(dataObj); // 실제 데이터 구조 확인

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
        };

        fetchCityData();
    }, []);


    const [selectedArea, setSelectedArea] = useState(null);
    const [hoverArea, setHoverArea] = useState(null);

    const handleClick = (area) => {
        if(selectedArea && selectedArea.properties.시군구명 === area.properties.시군구명){
            setSelectedArea(null);
        }else{
            setSelectedArea(area);
        }

    };

    const [allMarkers, setAlltMarkers] = useState([]);
    const [RMarkers, setRMarkers] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
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
            if(matchsidoData) {
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

    useEffect (() => {
        const fetchData = async () => {
            try {
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
        충청도: NAME => /(논산|대전|천안|태안|청주)/.test(NAME),
        경상도: NAME => /(경주|구미|김천|김해|대구|부산|안동|양산|울산|진주|창원|통영)/.test(NAME),
        전라도: NAME => /(광주|군산|나주|담양|순천|목포|전주)/.test(NAME),
        제주도: NAME => NAME.startsWith('제주'),
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
                {/*{cityData.map((area, index) => (*/}
                {/*    <Polygon*/}
                {/*        key={index}*/}
                {/*        path={area.geometry.coordinates[0].map(coord => ({ lat: coord[1], lng: coord[0] }))}*/}
                {/*        strokeWeight={3}*/}
                {/*        strokeColor="#004c80"*/}
                {/*        strokeOpacity={0.8}*/}
                {/*        fillColor={*/}
                {/*            selectedArea === area ? "rgba(0, 0, 0, 0)" :*/}
                {/*                hoverArea === area ? "#09f" :*/}
                {/*                    "#fff"*/}
                {/*        } // 조건부 색상 변경*/}
                {/*        fillOpacity={0.7}*/}
                {/*        onMouseover={() => setHoverArea(area)}*/}
                {/*        onMouseout={() => setHoverArea(null)}*/}
                {/*        onClick={() => handleClick(area)}*/}
                {/*    />*/}
                {/*))}*/}
                {carRoutes.map((route, index) => {
                    const path = route.sections.flatMap(section =>
                        section.roads.flatMap(road =>
                            road.vertexes.length >= 2 ? road.vertexes.reduce((acc, val, idx, arr) => {
                                if (idx % 2 === 0 && arr[idx + 1] !== undefined) {
                                    acc.push({ lat: arr[idx + 1], lng: val });
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
                {currentPosition && (
                    <MapMarker
                        position={currentPosition}
                        image={{
                            src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png",
                            size: {
                                width: 24,
                                height: 35
                            }
                        }}
                        draggable={true}
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
                            position={{ lat, lng }}
                            title={item.NAME}
                            onClick={() =>{ onMarkerClick(item); setReashop(true)}}
                        />
                    );
                })}


                {/*네프론 마커*/}
                {displayData.map((item, index) => {
                    const lat = parseFloat(item.LATITUDE);
                    const lng = parseFloat(item.LONGITUDE);
                    return(

                        <MapMarker
                            key={index}
                            image={{
                                src: ".\\img\\pet1.png",
                                size: {
                                    width: 24,
                                    height: 35,
                                }
                            }}
                            position={{ lat, lng }}
                            title={item.NAME}
                            onClick={() =>{ setNapronOpen(true); onNapronClick(item)}}

                        />
                    );
                })}


                {/*제로웨이스트 마커*/}
                {wasteMarker.map((item, index) => {
                    const lat = parseFloat(item.LATITUDE);
                    const lng = parseFloat(item.LONGITUDE);
                    return(

                        <MapMarker
                            key={index}
                            image={{
                                src: ".\\img\\zero3.png",
                                size: {
                                    width: 30,
                                    height: 35,
                                }
                            }}
                            position={{ lat, lng }}
                            title={item.NAME}
                            onClick={() =>{ onZeroClick(item); setOpenZero(true)}}
                        />
                    );
                })}

            </Map>
            <div className="map-btn">
                <ul>
                    <button onClick={toggleTraffic}>교통정보</button>
                    <button onClick={toggleRoadView}>로드뷰</button>
                    <button onClick={toggleUseDistrict}>지적편집도</button>
                </ul>
            </div>
        </div>
    );
}


export default MyMap;
