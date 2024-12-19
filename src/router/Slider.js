import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {
    SliderContainer,
    BodyContainer,
    SliderContent,
} from './style'

function CenterMode() {
    const settings = {
        className: "center",
        // centerMode: true,
        infinite: true,
        centerPadding: "60px",
        slidesToShow: 3,
        speed: 500
    };

    return (
        <div className="slider-container">
            <Slider {...settings}>

                <div>
                    <h6>내 위치기반 정보제공 서비스</h6>
                    <h2>집 근처 환경관련 서비스를 한눈에</h2>
                    <p>현재 당신의 위치를 기반으로 각종 편의시설의 위치부터<br/> 최단거리 길찾기 서비스를 제공합니다.</p>
                    <div className="map-btn">
                        <span>바로가기</span>
                    </div>
                </div>
                <div>
                    <h6>내 위치기반 정보제공 서비스</h6>
                    <h2>집 근처 환경관련 서비스를 한눈에</h2>
                    <p>현재 당신의 위치를 기반으로 각종 편의시설의 위치부터<br/> 최단거리 길찾기 서비스를 제공합니다.</p>
                    <div className="map-btn">
                        <span>바로가기</span>
                    </div>
                </div>
                <div>
                    <h6>내 위치기반 정보제공 서비스</h6>
                    <h2>집 근처 환경관련 서비스를 한눈에</h2>
                    <p>현재 당신의 위치를 기반으로 각종 편의시설의 위치부터<br/> 최단거리 길찾기 서비스를 제공합니다.</p>
                    <div className="map-btn">
                        <span>바로가기</span>
                    </div>
                </div>
            </Slider>

        </div>
    );
}

export default CenterMode;