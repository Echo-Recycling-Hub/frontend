// src/components/CreatePostModal.js
import React, { useState, useContext } from 'react';
import { Modal, Box, Container, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../router/AuthContext";
import '../css/post.css';

const CreatePostModal = ({ open, handleClose, fetchPosts }) => {
    // const { user } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    const handlePostSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('image', image);
        const token = localStorage.getItem('token')

        try {
            const response = await axios.post('http://localhost:3001/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });
            if (response.status === 200) {
                setTitle('');
                setContent('');
                setImage(null);
                alert('게시글이 성공적으로 작성되었습니다.');
                fetchPosts();
                handleClose();
            }
        } catch (error) {
            console.error('Failed to submit post:', error);
            alert('게시글 작성에 실패했습니다.');
        }
    };

    return (
        <Modal open={open} onClose={handleClose} className="modal-backdrop">
            <Box className={`modal-box ${open ? 'modal-box-open' : ''}`} style={modalStyle}>
                <Container>
                    <Typography variant="h4" gutterBottom>
                        게시글 작성
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
                            게시글 작성
                        </Button>
                    </form>
                </Container>
            </Box>
        </Modal>
    );
};

export default CreatePostModal;
