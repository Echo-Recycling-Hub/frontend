import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import DeletePost from './Delete';
import { Button } from '@mui/material';
import { AuthContext } from "./AuthContext";
import '../css/DetailPost.css';
import { FaTrashAlt, FaPencilAlt } from "react-icons/fa";

function DetailPost() {
    const { user } = useContext(AuthContext);
    const { postId } = useParams(); // useParams 훅을 사용하여 postId를 가져옴
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("postId:", postId); // postId 확인을 위한 콘솔 로그
        const token = localStorage.getItem('token');
        console.log("Token:", token); // 토큰 확인
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/posts/${postId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("Response:", response); // 응답 확인
                setPost(response.data);
            } catch (error) {
                console.error('Failed to fetch post:', error);
                setError(error);
            }
        };

        if (postId) {
            fetchPost();
        } else {
            setError(new Error('Post ID is undefined'));
        }
    }, [postId]);

    if (error) {
        return <div>Failed to fetch post: {error.message}</div>;
    }

    if (!post) {
        return <div>Loading...</div>;
    }

    const imageUrl = post.IMAGE_PATH ? `http://localhost:3001${post.IMAGE_PATH}` : null;

    const handleEdit = () => {
        navigate(`/edit/${post.ID}`);
    };

    return (
        <>
            <div className="header_box"></div>
            <div className="detail-post-container">
                <div className="detail-head">
                    <h5 className="detail-post-title">{post.TITLE}</h5>
                    <div className="detail-posts">
                        {user && user.id === post.AUTHOR_ID && (
                            <div className="detail-post-buttons">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleEdit}
                                    startIcon={<FaPencilAlt />}
                                    style={{ marginRight: '10px' }}
                                >
                                    수정
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<FaTrashAlt />}
                                >
                                    <DeletePost postId={post.ID} onDelete={() => navigate('/posts')} />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="detail-post-content">
                    {post.CONTENT}
                    {imageUrl && <img src={imageUrl} alt="Post" className="detail-post-image" />}
                </div>
            </div>
        </>
    );
}

export default DetailPost;
