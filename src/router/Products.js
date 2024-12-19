import React, {useContext, useState} from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Button, Box } from '@mui/material';
import axios from 'axios';
import { Routes, Route, useNavigate } from "react-router-dom";
import '../css/products.css';
import {AuthContext} from "./AuthContext";
import Footer from "./Footer";

export const products = [
    {
        id: 1,
        name: 'Zero Waste Product 1',
        price: 10000,
        image: '/img/liubov-ilchuk-x_ujfGcrAyU-unsplash.jpg'
    },
    {
        id: 2,
        name: 'Zero Waste Product 2',
        price: 20000,
        image: '/img/logan-weaver-lgnwvr-fuCwB8kXv58-unsplash.jpg'
    },
    {
        id: 3,
        name: 'Zero Waste Product 3',
        price: 30000,
        image: '/img/micheile-henderson-a9BY65__Cas-unsplash.jpg'
    },
    {
        id: 4,
        name: 'Zero Waste Product 4',
        price: 30000,
        image: '/img/micheile-henderson-BTMxNIwVBvU-unsplash.jpg'
    },
    {
        id: 5,
        name: 'Zero Waste Product 5',
        price: 30000,
        image: '/img/micheile-henderson-wwTvwS9vKZs-unsplash.jpg'
    },
    {
        id: 6,
        name: 'Zero Waste Product 6',
        price: 30000,
        image: '/img/toa-heftiba-UrgpmTHMd_Y-unsplash.jpg'
    },
];

function Products() {
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({
        nickname: '',
        realname: '',
        mileage: 0
    });

    const handlePurchase = async (product) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/purchase', {
                productId: product.id,
                price: product.price
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });

            if (response.status === 200) {
                alert('구매가 완료되었으며 마일리지가 적립되었습니다.');

                const userInfoResponse = await axios.get('http://localhost:3001/mypage', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                });
                setUserInfo({
                    nickname: userInfoResponse.data.NICKNAME,
                    realname: userInfoResponse.data.REALNAME,
                    mileage: userInfoResponse.data.MILEAGE
                });
                console.log(userInfoResponse.data);
                navigate('/mypage'); // 구매 후 마이페이지로 리디렉션
            }
        } catch (error) {
            console.error('Failed to purchase:', error.response ? error.response.data : error.message);
            alert('구매에 실패했습니다.');
        }
    };

    return (
        <>
            <div className="P_header_box"></div>
            <div className="products-con">
                <div className="product-header">
                    <h1>제로웨이스트 제품</h1>
                </div>
                <ul>
                    <li>#제로웨이스트</li>
                    <li>#친환경제품</li>
                    <li>#좋은제품</li>
                </ul>
                <div className="products">
                    <Grid container spacing={4}>
                        {products.map((product) => (
                            <Grid item key={product.id} xs={12} sm={6} md={4}>
                                <Card>
                                    <Box sx={{ height: '500px', overflow: 'hidden' }}>
                                        <CardMedia
                                            component="img"
                                            image={product.image}
                                            alt={product.name}
                                        />
                                    </Box>
                                    <CardContent>
                                        <Typography variant="h5">
                                            {product.name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Price: {product.price} KRW
                                        </Typography>
                                        <Button variant="contained" color="primary" onClick={() => handlePurchase(product)}>
                                            구매
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </div>
            <Routes>
                <Route path="/" element={< Footer/>}></Route>
            </Routes>
        </>
    );
}

export default Products;
