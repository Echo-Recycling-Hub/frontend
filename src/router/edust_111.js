import React, { useState, useEffect, useRef } from 'react';
import '../css/edust.css';
import MyCalendar from "./calendar";

const AutoSwitchingViewer = () => {
    const [day, setDay] = useState(1);
    const [startDate, setStartDate] = useState(new Date());
    const iframeRef = useRef(null);

    useEffect(() => {
        // 시작 날짜를 설정 (현재 날짜로)
        setStartDate(new Date());

        const interval = setInterval(() => {
            setDay(prevDay => (prevDay % 7) + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleIframeLoad = () => {
        if (iframeRef.current) {
            iframeRef.current.style.visibility = 'visible';
        }
    };

    // 현재 날짜로부터 일주일 뒤까지의 날짜를 계산
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day - 1);
    const currentDateString = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환

    return (
        <div className="munji">
            <iframe
                ref={iframeRef}
                title="Air Quality Map"
                src={`http://localhost:5000/api/map/${day}`}
                style={{ height: "500px", width: "100%", visibility: "hidden" }}
                onLoad={handleIframeLoad}
            />
            <div className="date-overlay">
                {currentDateString}
            </div>
            <div className="calendar_big">
                <MyCalendar />
            </div>
        </div>
    );
};

export default AutoSwitchingViewer;
