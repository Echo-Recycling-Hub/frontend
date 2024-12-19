import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, Button, Link as MuiLink } from '@mui/material';
import '../css/post.css';
import { AuthContext } from "./AuthContext";
import Footer from "./Footer";

function decodeHtml(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('ko-KR', options);
}

function Posts() {
    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPosts();
    }, [user]);

    const handleCreatePost = () => {
        navigate('/create');
    };

    const fetchPosts = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:3001/posts', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log('Fetched Posts:', response.data);
            setPosts(response.data);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        }
    };

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const handleOpenDetail = (post) => {
        navigate(`/posts/${post.ID}`);
    };

    return (
        <>
            <div className="Post_header_box"></div>
            <div className="post-container">
                <div className="posts-header">
                    <h1>게시판</h1>
                </div>
                <div className="posts">
                    {currentPosts.map((post) => (
                        <Grid item key={post.ID} xs={12}>
                            <Card onClick={() => handleOpenDetail(post)}>
                                <CardContent>
                                    <Typography variant="h5">
                                        <MuiLink component="button" color="textPrimary">
                                            {decodeHtml(post.TITLE)}
                                        </MuiLink>
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {formatDate(post.CREATED_AT)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </div>
                <div className="posts-foot">
                    <div
                        className="page-btn"
                        style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}
                    >
                        {user && (
                            <Button variant="contained" color="primary" onClick={handleCreatePost}>
                                글 작성
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Posts;
