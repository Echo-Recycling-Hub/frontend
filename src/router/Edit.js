import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Box, Typography } from '@mui/material';
import {AuthContext} from "./AuthContext";

function EditPost() {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [post, setPost] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token')
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/posts/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const postData = response.data;
                setPost(postData);
                setTitle(postData.TITLE);
                setContent(postData.CONTENT);
                setImage(postData.IMAGE_PATH);
            } catch (error) {
                console.error('Failed to fetch post:', error);
            }
        };

        fetchPost();
    }, [id]);

    const handlePostSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (image) formData.append('image', image);

        try {
            const response = await axios.put(`http://localhost:3001/posts/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (response.status === 200) {
                alert('게시글이 성공적으로 수정되었습니다.');
                navigate(`/posts/${id}`);
            }
        } catch (error) {
            console.error('Failed to update post:', error);
            alert('게시글 수정에 실패했습니다.');
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                게시글 수정
            </Typography>
            <form onSubmit={handlePostSubmit}>
                <Box mb={2}>
                    <TextField
                        label="제목"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                        required
                    />
                </Box>
                <Box mb={2}>
                    <TextField
                        label="내용"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        multiline
                        rows={4}
                        fullWidth
                        required
                    />
                </Box>
                <Box mb={2}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </Box>
                <Button type="submit" variant="contained" color="primary">
                    수정
                </Button>
            </form>
        </Container>
    );
}

export default EditPost;
