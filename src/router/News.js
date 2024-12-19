import React from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import '../css/News.css';
import { products } from './Products'; // products 배열 가져오기

function News() {
    return (
        <div className="App">
            <div id="news-container">
                <div className="news-header">
                    <h1>제로웨이스트 제품</h1>
                    <p>우리의 제로웨이스트 제품 컬렉션을 탐험하고 지속 가능한 라이프스타일을 즐겨보세요.</p>
                </div>
                <div className="news-latest">
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
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </div>
        </div>
    );
}

export default News;
