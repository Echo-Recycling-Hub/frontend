import React from "react";

function AirStatus({ sidos, onSidoSelect }) {
    console.log('Rendering AirStatus, sidos:', sidos);
    if (!sidos || sidos.length === 0) {  // 빈 배열을 확인
        return
    }

    return (
        <div className="senter-marker"
             style={{background : "red"}}>
            {sidos.map((sido, index) => {
                console.log(`Rendering button for ${sido} at index ${index}`);
                return (
                    <button key={sido} onClick={() => onSidoSelect(sido)}>
                        {sido}
                    </button>
                );
            })}
        </div>
    );
}
export default AirStatus;