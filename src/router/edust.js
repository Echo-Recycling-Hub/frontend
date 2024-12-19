import React, { useState, useEffect, useRef } from 'react';
import "../css/AutoSwitchingViewer.css"

const AutoSwitchingViewer = () => {
    const [day, setDay] = useState(1);
    const [startDate, setStartDate] = useState(new Date());
    const iframeRef = useRef(null);

    useEffect(() => {
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

    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day - 1);
    const currentDateString = currentDate.toISOString().split('T')[0];

    return (
        <>
            <div className="header_box"></div>
            <div className="munji">
                <div className="date-overlay">
                    <h2>{currentDateString}</h2>
                </div>
                <div className="iframe_box">
                <iframe
                    ref={iframeRef}
                    title="Air Quality Map"
                    src={`http://localhost:5000/mise12random/api/map/${day}`}
                    style={{
                        height: "700px",
                        width: "70%",
                        visibility: "hidden",
                        margin: '10px 15%',
                        textAlign: 'center',
                        border: '#178844 2px solid',
                        borderRadius: '20px',
                        padding: '30px'
                    }}
                    onLoad={handleIframeLoad}
                />
                </div>
            </div>
        </>
    );
};

export default AutoSwitchingViewer;
