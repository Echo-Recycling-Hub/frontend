import React from 'react';
import { Modal, Box, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import '../css/post.css';

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
    const options = {year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'};
    return date.toLocaleDateString('ko-KR', options);
}

const PostModal = ({ open, handleClose, post }) => {
    if (!post) return null;

    return (
        <Modal open={open} onClose={handleClose} className="modal-backdrop">
            <Box className={`modal-box ${open ? 'modal-box-open' : ''}`}>
                <Typography variant="h5">
                    <MuiLink component={Link} to={`/posts/${post.ID}`} color="textPrimary">
                        {decodeHtml(post.TITLE)}
                    </MuiLink>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    {formatDate(post.CREATED_AT)}
                </Typography>
                <Typography variant="body1" color="textPrimary">
                    {decodeHtml(post.CONTENT)}
                </Typography>
            </Box>
        </Modal>
    );
};

export default PostModal;