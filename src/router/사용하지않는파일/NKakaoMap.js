import {Map, MapMarker, MapTypeId} from "react-kakao-maps-sdk";
import {useEffect, useState} from "react";
// import "bootstrap/js/dist/collapse";
import "./KakaoMap.css";

function MyMap() {
    const [traffic, setTraffic] = useState(false);
    const [markers, setMarkers] = useState([]);
    const [showMarkers, setShowMarkers] = useState(false); // 새로운 상태 추가

    const toggleTraffic = () => {
        setTraffic(!traffic);
    };

    // 재활용 버튼 클릭 핸들러
    const toggleMarkers = () => {
        if (markers.length === 0) {
            // markers 상태에 마커가 없는 경우, 새로운 데이터를 가져와서 마커를 생성합니다.
            fetchData();
        } else {
            // markers 상태에 마커가 있는 경우, 마커를 토글합니다.
            setMarkers([]);
        }
        setShowMarkers(!showMarkers);
    };

    // fetchData 함수를 useEffect 밖으로 이동
    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5000/newmark');
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            const jsonData = await response.json();

            const newMarkers = jsonData.map((item, index) => {
                const {위도, 경도, 재활용센터명} = item;
                if (!위도 || !경도) {
                    console.error('Invalid latitude or longitude:', item);
                    return null;
                }
                return (
                    <MapMarker
                        key={index}
                        position={{lat: parseFloat(위도), lng: parseFloat(경도)}}
                        title={재활용센터명}
                    />
                );
            }).filter(marker => marker !== null);

            console.log('Markers:', newMarkers);
            setMarkers(newMarkers);
        } catch (error) {
            console.error('Error processing data:', error);
        }
    };

    // 첫 로드시 마커 데이터 가져오기
    useEffect(() => {
        fetchData();
    }, []);

    return (

        <div
            className="map-con"
            // style={{position: "relative"}}
        >
            <Map
                center={{lat: 37.5665, lng: 126.9780}}
                style={{
                    width: "100vw",
                    height: "calc(50vh - 35px)",
                    float: "left"
                }}
                level={5}
            >
                {showMarkers && markers}
                {traffic && <MapTypeId type="TRAFFIC"/>}
            </Map>
            <div className="map-btn">
                <ul>
                    <li><a href="#" onClick={toggleTraffic}>교통정보</a></li>
                    <li><a href="#" onClick={toggleMarkers}>재활용</a></li>
                </ul>
            </div>

        </div>
    );
}

function AirStatus(){

    return (
        <Map
            center={{ lat: 33.5563, lng: 126.79581 }}
            style={{
                width: "50%",
                height:"100%",
                float: "left"
        }}>
            <MapMarker position={{ lat: 33.55635, lng: 126.795841 }}>
                <div style={{color:"#000"}}>Hello World!</div>
            </MapMarker>
        </Map>
    );
}

function WeatherStatus(){

    return (
        <Map
            center={{ lat: 33.5563, lng: 126.79581 }}
            style={{ width: "50%", height:"100%" }}
        >
            <MapMarker position={{ lat: 33.55635, lng: 126.795841 }}>
                <div style={{color:"#000"}}>Hello World!</div>
            </MapMarker>
        </Map>
    );
}

export {AirStatus, WeatherStatus };
export default MyMap;
