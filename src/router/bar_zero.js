import React, { useEffect, useState } from 'react';
import { IoClose } from "react-icons/io5";
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';

import '../css/bar_zero.css'

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

function ZeroCenters(props) {
    /* global kakao */

    const [address, setAddress] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recommend, setRecommend] = useState([]);
    const [recommendLoading, setRecommendLoading] = useState(true);

    useEffect(() => {
        if (props.selectZeroshop) {
            const geocoder = new kakao.maps.services.Geocoder();
            const coord = new kakao.maps.LatLng(props.selectZeroshop.LATITUDE, props.selectZeroshop.LONGITUDE);
            geocoder.coord2Address(coord.getLng(), coord.getLat(), function(result, status) {
                if (status === kakao.maps.services.Status.OK) {
                    setAddress(result[0].address.address_name);
                }
            });
        }
    }, [props.selectZeroshop]);

    useEffect(() => {
        const fetchImages = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/images/${props.selectZeroshop.ID}`);
                console.log(response.data);
                setImages([response.data]);  // 단일 객체를 배열로 변환합니다.
            } catch (error) {
                console.error('Error fetching images', error);
            } finally {
                setLoading(false);
            }
        };

        if (props.selectZeroshop) {
            fetchImages();
        }
    }, [props.selectZeroshop]);

    useEffect(() => {
        const fetchRecommendations = async () => {
            setRecommendLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/recommend/${props.selectZeroshop.ID}`);
                setRecommend(response.data);
            } catch (error) {
                console.error('Error fetching recommendations', error);
            } finally {
                setRecommendLoading(false);
            }
        };

        if (props.selectZeroshop) {
            fetchRecommendations();
        }
    }, [props.selectZeroshop]);

    console.log(props.selectZeroshop)

    const filteredImages = images.filter(image => image.id === props.selectZeroshop.ID);

    return (
        <div className="sidebar2">
            <div className="sidebar2_border">
                <div className="Rec">
                    <button>
                        <IoClose style={{color: 'black'}} onClick={props.closeZeroshop}/>
                    </button>
                </div>
                <div>
                    {props.selectZeroshop ? (
                        <div className="details">
                            <p style={{fontWeight:'bolder'}}>제로웨이스트샵</p>
                            <h1>{props.selectZeroshop.NAME.split('_')[1]}</h1><br/>
                            <p>주소 : {address}</p>
                            <div className="info_box">
                                <p>{props.selectZeroshop.INFO}</p>
                                <p>{props.selectZeroshop.hash_tags}</p>
                            </div>
                        </div>
                    ) : (
                        <p>No marker data available</p>
                    )}
                    <div>
                        {loading ? (
                            <p>Loading images...</p>
                        ) : (
                            filteredImages.length > 0 ? (
                                <Swiper
                                    modules={[Navigation, Pagination, A11y]}
                                    navigation
                                    pagination={{clickable: true}}
                                    spaceBetween={10}
                                    slidesPerView={1}
                                    className="mySwiper"
                                    style={{width:"100%"}}
                                >
                                    {filteredImages.map((image) => (
                                        <>
                                            {Array.from({length: 8}).map((_, index) => {
                                                const imgProp = `img${index + 1}`;
                                                return image[imgProp] && (
                                                    <SwiperSlide key={`${image.id}-${index + 1}`}>
                                                        <img src={`data:image/jpeg;base64,${image[imgProp]}`}
                                                             alt={`Image ${image.id} - ${index + 1}`}
                                                             style={{width: '100%', height: 'auto', maxHeight: "250px"}}/>
                                                    </SwiperSlide>
                                                );
                                            })}
                                        </>
                                    ))}
                                </Swiper>
                            ) : (
                                <p>No images available</p>
                            )
                        )}
                    </div>
                </div>
                <div className="recommend">
                    <h4>이런곳이 비슷해요!</h4>
                    {recommendLoading ? (
                        <p>Loading recommendations...</p>
                    ) : (
                        recommend.length > 0 ? (
                            <ul>
                                {recommend.map((item, index) => (
                                    <li key={index}>
                                        <h5>{item.name}</h5>
                                        {/*<p>{item.info}</p>*/}
                                        {/*<p>{item.hash_tags}</p>*/}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No recommendations available</p>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

export default ZeroCenters;
