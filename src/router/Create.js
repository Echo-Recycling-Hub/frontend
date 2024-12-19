import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "./AuthContext";
import "../css/b_create.css"

function CreatePost({ fetchPosts }) {  // fetchPosts를 props로 받음
    const { user } = useContext(AuthContext);
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
        const token = localStorage.getItem('token');

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
                if (fetchPosts) {
                    fetchPosts(); // 게시글 목록 갱신
                }
                navigate('/posts'); // 글 작성 후 '/posts' 경로로 이동
            }
        } catch (error) {
            console.error('Failed to submit post:', error);
            alert('게시글 작성에 실패했습니다.');
        }
    };

    return (
        <>
            <div className="header_box"></div>
            <div className="form-container">
                <div className="b_head">
                    <h4>게시글 작성</h4>
                </div>
                <form onSubmit={handlePostSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="제목"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <textarea
                            placeholder="내용"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={4}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </div>
                    <button type="submit" className="submit-button">
                        게시글 작성
                    </button>
                </form>
            </div>
        </>
    );
}

export default CreatePost;
