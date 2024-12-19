import { useEffect, useState } from "react";
import { Map, MapMarker, Polyline } from "react-kakao-maps-sdk";
import axios from "axios";

function SearchLocation() {
    const [clickedLat, setClickedLat] = useState(null);
    const [clickedLng, setClickedLng] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [error, setError] = useState(null);
    const [busRoutes, setBusRoutes] = useState([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                },
                (error) => {
                    setError(`Geolocation error: ${error.message}`);
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        } else {
            setError("Geolocation is not supported by this browser.");
        }
    }, []);

    const [fullRoutesDetails, setFullRoutesDetails] = useState([]);


    const handlBusData = async () => {
        setLoading(true);
        try {
            // const response = await axios.post('http://54.82.4.76:5000/location', {
            const response = await axios.post('http://localhost/location', {
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


    const handleMapClick = (_, mouseEvent) => {
        const latLng = mouseEvent.latLng;
        setClickedLat(latLng.getLat());
        setClickedLng(latLng.getLng());
    };

    return (
        <div>
            {error && <p>{error}</p>}
            <div className="map-container">
                <Map center={{ lat: latitude, lng: longitude }} style={{ width: "100%", height: "350px" }} level={3} onClick={handleMapClick}>
                    {clickedLat && clickedLng && (
                        <MapMarker position={{ lat: clickedLat, lng: clickedLng }} clickable={true}>
                            <div>You clicked here!</div>
                        </MapMarker>
                    )}
                    {renderBusRoutes()}
                </Map>
            </div>
            <button onClick={handlBusData} disabled={loading}>
                {loading ? 'Loading...' : 'Get Bus Route Info'}
            </button>
            <div className="route-details">
                {fullRoutesDetails.length > 0 ? renderFullRouteDetails() : <p>Loading route details...</p>}
            </div>
        </div>
    );
}

export default SearchLocation;
