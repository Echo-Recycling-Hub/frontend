import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

import "../css/App_border.css";

function Category() {
    const { category } = useParams();
    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [editModal, setEditModal] = useState(false);
    const [newTitle, setNewTitle] = useState("");

    const handleOpenModal = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedItem(null);
        setShowModal(false);
    };

    const handleEditModal = (item) => {
        setSelectedItem(item);
        setNewTitle(item.title);
        setEditModal(true);
    };

    const handleEditClose = () => {
        setSelectedItem(null);
        setEditModal(false);
    };

    const handleSave = async () => {
        try {
            await axios.post(`http://localhost:3001/b_${category}/update`, {
                ID: selectedItem.id,
                TITLE: newTitle,
            });
            setData((prevData) =>
                prevData.map((item) =>
                    item.id === selectedItem.id ? { ...item, title: newTitle } : item
                )
            );
            handleEditClose();
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/b_${category}`);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [category]);

    return (
        <>
            <div className="header_box"></div>
            <div className="container_border">

                <div className="row">
                    {data.map((item, index) => (
                        <Card key={index} item={item} onOpenModal={handleOpenModal} onEditModal={handleEditModal} />
                    ))}
                </div>

                {showModal && (
                    <div className="modal_overlay" onClick={handleCloseModal}>
                        <div className="modal_content" onClick={(e) => e.stopPropagation()}>
                            <span className="modal_close" onClick={handleCloseModal}>&times;</span>
                            <h2>{selectedItem && selectedItem.title}</h2>
                            <Swiper
                                spaceBetween={50}
                                slidesPerView={1}
                                navigation
                                pagination={{ clickable: true }}
                                modules={[Navigation, Pagination]}
                            >
                                {selectedItem && Object.keys(selectedItem).filter(key => key.startsWith('IMG')).map((key, index) => (
                                    selectedItem[key] && (
                                        <SwiperSlide key={index}>
                                            <img
                                                className="carousel_image"
                                                src={`data:image/png;base64,${selectedItem[key]}`}
                                                alt={`${selectedItem.title} ${index + 1}`}
                                                style={{ width: '500px', height: '500px' }}  // 이미지 크기 조정
                                            />
                                        </SwiperSlide>
                                    )
                                ))}
                            </Swiper>
                        </div>
                    </div>
                )}

                {editModal && (
                    <div className="modal_overlay" onClick={handleEditClose}>
                        <div className="modal_content" onClick={(e) => e.stopPropagation()}>
                            <span className="modal_close" onClick={handleEditClose}>&times;</span>
                            <h2>제목 수정</h2>
                            <form>
                                <div className="form_group">
                                    <label htmlFor="formTitle">새로운 제목</label>
                                    <input
                                        type="text"
                                        id="formTitle"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                    />
                                </div>
                            </form>
                            <button onClick={handleEditClose}>닫기</button>
                            <button onClick={handleSave}>변경 사항 저장</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

function Card({ item, onOpenModal, onEditModal }) {
    return (
        <div className="col-md-4 data_border">
            <button onClick={() => onOpenModal(item)} className="link_button">
                <img src={`data:image/png;base64,${item.IMG1}`} alt={item.title} style={{ width: '500px', height: '500px', margin:'0 auto' }} />
            </button>
            <h5>{item.title}</h5>
            <button onClick={() => onEditModal(item)} className="edit_button">수정</button>
        </div>
    );
}

export default Category;
