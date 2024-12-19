// CreatePostModal.js
import React from 'react';
import { Modal, Box, Container, TextField } from '@mui/material';
import axios from 'axios';
import '../css/CreatePostModal.css';

const CreatePostModal = ({ open, handleClose, fetchPosts }) => {
    const [title, setTitle] = React.useState('');
    const [content, setContent] = React.useState('');
    const [image, setImage] = React.useState(null);

    const handlePostSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('image', image);
        const token = localStorage.getItem('token');

        try {
            const response = await axios.post('http://localhost:3001/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true,
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
        <Modal open={open} onClose={handleClose}>
            <div className="post-modal-con">
                <Container>
                    <h4>게시글 작성</h4>
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
                        <button type="submit">
                            게시글 작성
                        </button>
                    </form>
                </Container>
            </div>
        </Modal>
    );
};

export default CreatePostModal;
