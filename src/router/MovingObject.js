import React from 'react';
import '../css/MovingObject.css'; // CSS 파일을 임포트
import { IoIosArrowDown } from "react-icons/io";

const MovingObject = () => {
    return (
        <div className="movingObject">
            <IoIosArrowDown />
        </div>
    );
};

export default MovingObject;
