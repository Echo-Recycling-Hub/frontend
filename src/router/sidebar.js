import React, { useEffect, useState } from 'react';
import { IoClose } from "react-icons/io5";
import '../css/sidebar.css'
import {GiPositionMarker} from "react-icons/gi";
import {FaPhoneAlt} from "react-icons/fa";

function RecyclingCenters(props) {

    return (
        <div className="sidebar2">
            <div className="Rec">
                <button>
                    <IoClose style={{color: 'black'}} onClick={props.closeReshop}/>
                </button>
            </div>
            <div>
                {props.markerData ? (
                    <div className="details">
                        <h4>재활용센터</h4>
                        <h1>{props.markerData.NAME}</h1>
                        <h3>주소</h3><br/>
                        <p>지번: {props.markerData.ADDRESSOLD}<br/>
                            도로명: {props.markerData.ADDRESS} </p>
                        <p>취급제품 : {props.markerData.MAINITEMS}</p>
                        <p>오픈시간<br/>
                            평일: {props.markerData.WEEKDAYSTART}~{props.markerData.WEEKDAYEND}<br/>
                            주말: {props.markerData.HOLIDAYSTART}~{props.markerData.HOLIDAYEND}</p>
                        <p>휴무일: {props.markerData.OFFDAYINFO}</p>
                        <p>연락처: {props.markerData.PHONE}</p>
                    </div>
                ) : (
                    <p>No marker data available</p>
                )}
            </div>

        </div>
    );
}

export default RecyclingCenters;
