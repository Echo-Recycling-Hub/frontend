import React, { useEffect, useState } from 'react';
import { IoClose } from "react-icons/io5";

function ZeroCenters(props) {
    /* global kakao */

    const [address, setAddress] = useState('');

    useEffect(() => {
        if (props.selectZeroshop) {
            const geocoder = new kakao.maps.services.Geocoder();

            const coord = new kakao.maps.LatLng(props.selectZeroshop.LATITUDE, props.selectZeroshop.LONGITUDE);
            geocoder.coord2Address(coord.getLng(), coord.getLat(), function(result, status) {
                if (status === kakao.maps.services.Status.OK) {
                    console.log(result[0].address.address_name);
                    setAddress(result[0].address.address_name);
                }
            });
        }
    }, [props.selectZeroshop]);


    return (
        <div className="sidebar2">
            <div className="Rec">
                <button>
                    <IoClose style={{color: 'black'}} onClick={props.closeZeroshop}/>
                </button>
            </div>
            <div>
                {props.selectZeroshop ? (
                    <div className="details">
                        <h4>제로웨이스트샵</h4>
                        <h1>{props.selectZeroshop.NAME}</h1>
                        <h3>주소</h3><br/>
                        <p>지번: {address}<br/></p>
                    </div>
                    ) : (
                    <p>No marker data available</p>
                    )}
            </div>
        </div>
);
}

export default ZeroCenters;
