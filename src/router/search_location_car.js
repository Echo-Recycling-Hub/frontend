// import './App.css';
import {useEffect, useState} from "react";
import {Map, MapMarker, MapTypeId, Polyline} from "react-kakao-maps-sdk";
import axios from "axios"


function Serch_location_Car() {
    // 마우스 클릭 좌표
    const [clickedLat, setClickedLat] = useState(null);
    const [clickedLng, setClickedLng] = useState(null);

    // 사용자의 현재 위치 주소를 받아온다.
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [error, setError] = useState(null);

    const [loading, setLoading] = useState(false);
    // 카카오맵 state
    const [result, setResult] = useState("")

    const [trafficInfo, setTrafficInfo] = useState(null);


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

    const [carRoutes, setCarRoutes] = useState([]);

    // handleFetchData 함수 수정
    const handleFetchData = async () => {
        setLoading(true);
        try {
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

                // 교통 정보 업데이트
                console.log('Traffic Info:', data.trafficInfo);  // 교통 정보 로깅 추가
                setTrafficInfo(data.trafficInfo);

                // 경로 정보를 상태에 저장
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
    const renderRouteDetails = () => {
        return carRoutes.map((route, index) => (
            <div key={index}>
                <h3>길찾기 결과 #{index + 1}</h3>
                <p>출발지: {route.summary.origin.name}</p>
                <p>도착지: {route.summary.destination.name}</p>
                <p>예상 시간:{Math.floor(route.summary.duration / 60)}분</p>
                <p>예상 거리: {route.summary.distance}m</p>
                <h4>경로 상세 정보</h4>
                {route.sections.map((section, idx) => (
                    <div key={idx}>
                        <p>{section.distance}m, {Math.floor(route.summary.duration / 60)}분 소요</p>
                        <p>도로명: {section.roads.map(road => road.name).join(', ')}</p>
                    </div>
                ))}
            </div>
        ));
    };
    const getPolylineColor = (trafficInfo) => {
        if (trafficInfo === 'smooth') {
            return '#00FF00';
        } else if (trafficInfo === 'congested') {
            return '#FF0000';
        } else {
            return '#007B83'; // 기본값: 검은색
        }
    };


    return (
        <div className="car">

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
                                    strokeColor={getPolylineColor(route.trafficInfo)} // 수정: 각 경로의 교통 정보에 따라 색상 결정
                                    strokeOpacity={0.7}
                                    strokeStyle={'solid'}
                                />
                            );
                        })}
                        {/*{renderCarRoutes()}*/}
                        <div className="map">
                            <p>
                                <em>지도를 클릭해주세요!</em>
                            </p>
                            <p id="result">{result}</p>
                        </div>
                        <MapTypeId type={"TRAFFIC"} />
                    </Map>
                </>
                <div>
                    <button onClick={handleFetchData}>Get car Route Info</button>
                    <div>
                        {renderRouteDetails()}
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Serch_location_Car;