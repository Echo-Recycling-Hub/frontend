// import './App.css';
import {useEffect, useState} from "react";
import {Map, MapMarker, Polyline} from "react-kakao-maps-sdk";
import axios from "axios"


function Serch_location() {
    // 마우스 클릭 좌표
    const [clickedLat, setClickedLat] = useState(null);
    const [clickedLng, setClickedLng] = useState(null);

    // 사용자의 현재 위치 주소를 받아온다.
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [error, setError] = useState(null);

    // 카카오맵 state
    const [result, setResult] = useState("")

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                handleSuccess,
                handleError,
                {enableHighAccuracy: true, maximumAge: 0, timeout: 5000}
            );
        } else {
            setError('Geolocation이 지원되지 않습니다.');
        }
    }, []);

    // 사용자의 현재 위치를 가져오는 함수
    const handleSuccess = (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setError(null);
    }

    const handleError = (error) => {
        setError(`위치 정보를 받아오는 데 실패했습니다: ${error.message}`);
    }

    const [busRoutes, setBusRoutes] = useState([]);

    const handleFetchData = async () => {
        try {
            const response = await axios.post('http://localhost:5000/location', {
                currentLatitude: latitude,  // 사용자의 현재 위도
                currentLongitude: longitude,  // 사용자의 현재 경도
                clickedLatitude: clickedLat,  // 사용자가 클릭한 위치의 위도
                clickedLongitude: clickedLng  // 사용자가 클릭한 위치의 경도
            });
            const data = JSON.parse(response.data.busRouteInfo);
            setBusRoutes(data.msgBody.itemList);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
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
        setResult(`클릭한 위치의 위도는 ${Maplat} 이고, 경도는 ${Maplng} 입니다`);
        setClickedLat(Maplat); // 클릭한 위도 저장
        setClickedLng(Maplng); // 클릭한 경도 저장
        setMarkerPosition({ lat: parseFloat(Maplat), lng: parseFloat(Maplng) });
    };

// 버스경로지도표시
    const renderBusRoutes = () => {
        return busRoutes.map((route, index) => {
            // 필요한 정류장만 필터링
            const relevantBusStops = filterRelevantBusStops(route, busAll);
            const path = [
                { lat: parseFloat(route.pathList[0].fy), lng: parseFloat(route.pathList[0].fx) },
                ...relevantBusStops.map(busStop => ({
                    lat: busStop.위도,
                    lng: busStop.경도
                })),
                { lat: parseFloat(route.pathList[0].ty), lng: parseFloat(route.pathList[0].tx) }
            ];

            return (
                <Polyline
                    key={index}
                    path={path}
                    strokeWeight={5} // 선의 두께
                    strokeColor={'#FF0000'} // 선의 색깔
                    strokeOpacity={0.7} // 선의 불투명도
                    strokeStyle={'solid'} // 선의 스타일
                />
            );
        });
    };

// 필요한 정류장을 필터링하는 함수
    const filterRelevantBusStops = (route, allBusStops) => {
        // route 객체와 전체 버스 정류장 목록을 기반으로 필요한 정류장만 반환합니다.
        // 여기서는 단순 예시로 필터링 로직을 구현해야 합니다.
        // 예: route.pathList에 포함된 정류장 번호와 allBusStops의 정류장 번호를 비교하여 필터링
        return allBusStops.filter(busStop => {
            // 필터링 조건 로직 구현
            return true; // 현재는 모든 정류장을 반환합니다. 실제 조건에 맞게 수정 필요
        });
    };


    // 전국 버스정류소 위경도불러오기.
    const [busAll, setBusAll] = useState([]);

    useEffect (() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3001/bus')
                if (!response.ok) {
                    throw new Error('에러남..;;')
                }
                const jsonData = await response.json();
                console.log(busAll)
                setBusAll(jsonData);
            } catch (error) {
                console.log('제로웨이스트에러');
            }
        };
        fetchData();
    }, []);


    return (
        <div className="App">

            {error ? (
                <p>{error}</p>
            ) : (
                <div>
                    <p>latitude: {latitude}</p>
                    <p>longitude: {longitude}</p>
                </div>
            )}
            <div>
                <p>{}</p>
            </div>
            <div className="kakao-map">
                <>
                    <Map
                        id="map"
                        center={{ lat: latitude, lng: longitude }}
                        style={{ width: "1000px", height: "350px" }}
                        level={3}
                        onClick={handleMapClick}
                    >
                        {markerPosition && (
                            <MapMarker
                                position={markerPosition}
                                clickable={true} // 마커 클릭 가능 설정
                            >
                                <div>여기가 클릭한 위치입니다!</div>
                            </MapMarker>
                        )}
                        {renderBusRoutes()}
                        <div className="map">
                            <p>
                                <em>지도를 클릭해주세요!</em>
                            </p>
                            <p id="result">{result}</p>
                        </div>
                    </Map>
                </>
                <div>
                    <button onClick={handleFetchData}>Get Bus Route Info</button>
                    <div>
                        {busRoutes.map((route, index) => (
                            <div key={index}>
                                <h3> Name: {route.pathList[0].routeNm}</h3>
                                <p>Time: {route.time} minutes</p>
                                <p>출발지: {route.pathList[0].fname}</p>
                                <p>도착지: {route.pathList[0].tname}</p>
                                <p>도착지: {route.pathList[0].railLinkId}</p>
                                <p>도착지: {route.pathList[0].routeNm}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Serch_location;
