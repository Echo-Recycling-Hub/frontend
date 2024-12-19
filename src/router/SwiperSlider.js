import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import '../css/style.css';
import '../css/SwiperSlider.css'

import EmissionsChart15 from './Chart_Emissions15';
import EmissionsChart20 from './Chart_Emissions20';
import RecycleChart15 from './Chart_Recycling15';
import RecycleChart20 from './Chart_Recycling20';
import RecycleDetailsChart15 from './Chart_RecyclingDetails15';
import RecycleDetailsChart20 from './Chart_RecyclingDetails20';

const SwiperSlider = ({ serverData15, serverData20 }) => {
    return (
        <Swiper
            slidesPerView={4}
            centeredSlides={true}
            spaceBetween={50}
            grabCursor={true}
            pagination={{
                clickable: true,
            }}
            className="mySwiper"
        >
            <SwiperSlide>
                <div className="slide-img1">
                    <EmissionsChart15 data={serverData15} />
                </div>
                <div className="slide-txt">
                    <h6>2015~2019</h6>
                    <h2>전국 쓰레기</h2><h2>배출량</h2>
                    <p>2015년 ~ 2019년도 전국 쓰레기 배출양입니다.</p>
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className="slide-img2">
                    <EmissionsChart20 data={serverData20} />
                </div>
                <div className="slide-txt">
                    <h6>2020~2022</h6>
                    <h2>전국 쓰레기</h2><h2>배출량</h2>
                    <p>2020년 ~ 2022년도 전국 쓰레기 배출양입니다.</p>
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className="slide-img3">
                    <RecycleChart15 data={serverData15} />
                </div>
                <div className="slide-txt">
                    <h6>2015~2019</h6>
                    <h2>전국 재활용</h2><h2>처리 현황</h2>
                    <p>2015년 ~ 2019년도 전국 재활용 처리현황입니다.</p>
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className="slide-img4">
                    <RecycleChart20 data={serverData20} />
                </div>
                <div className="slide-txt">
                    <h6>2020~2022</h6>
                    <h2>전국 재활용</h2><h2>처리 현황</h2>
                    <p>2020년 ~ 2022년도 전국 재활용 처리현황입니다.</p>
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className="slide-img5">
                    <RecycleDetailsChart15 data={serverData15} />
                </div>
                <div className="slide-txt">
                    <h6>상세 재활용 현황</h6>
                    <h2>재활용 품목을 </h2><h2>쉽게!</h2>
                    <p>재활용 품목별 현황을 쉽게 확인할 수 있습니다.</p>
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className="slide-img6">
                    <RecycleDetailsChart20 data={serverData20} />
                </div>
                <div className="slide-txt">
                    <h6>상세 재활용 현황</h6>
                    <h2>재활용 품목을 </h2><h2>쉽게!</h2>
                    <p>재활용 품목별 현황을 쉽게 확인할 수 있습니다.</p>
                </div>
            </SwiperSlide>
        </Swiper>
    );
};

export default SwiperSlider;
