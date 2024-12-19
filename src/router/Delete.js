import React, {useContext} from 'react';
import axios from 'axios';
import {AuthContext} from "./AuthContext";

function DeletePost({ postId, onDelete }) {
    const { user } = useContext(AuthContext);
    const handleDelete = async () => {
        const token = localStorage.getItem('token')
        try {
            const response = await axios.delete(`http://localhost:3001/posts/${postId}`, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                alert('게시글이 성공적으로 삭제되었습니다.');
                onDelete();
            }
        } catch (error) {
            console.error('Failed to delete post:', error);
            alert('게시글 삭제에 실패했습니다.');
        }
    };

    return (
        <button onClick={handleDelete}>
            삭제
        </button>
    );
}

export default DeletePost;
