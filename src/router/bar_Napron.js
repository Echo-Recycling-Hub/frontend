import React, { useEffect, useState } from 'react';
import { IoClose } from "react-icons/io5";
import '../css/sidebar_Napron.css'

function NapronCenters(props) {
        console.log(props.selectNapron)
     return (
        <div className="sidebar2">
            <div className = "sidebar2_border_Napron">
            <div className="Rec">
                <button>
                    <IoClose style={{color: 'black'}} onClick={props.closeNapron}/>
                </button>
            </div>
            <div>
            {props.selectNapron ? (
                <div className="details">
                    <h4>Napron</h4>
                    <h3>페트병수거자판기</h3>
                    <h1>{props.selectNapron.NAME}</h1>
                    <h3>주소</h3><br/>
                    <p>{props.selectNapron.ADDRESS}</p>
                    <p>가능제품 : {props.selectNapron.INPUT_WASTES}</p>
                </div>
            ) : (
                    <p>No marker data available</p>
                )}
            </div>
            </div>
        </div>
    );
}

export default NapronCenters;
