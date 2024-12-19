import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [form, setForm] = useState({
        userid: '',
        password: '',
        nickname: '',
        realname: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/register', form)
            .then(response => {
                alert('Registration successful!');
                return axios.post('http://localhost:3001/login', { userid: form.userid, password: form.password });
            })
            .then(response => {
                const token = response.data.token;
                localStorage.setItem('token', token);
                navigate('/login');
            })
            .catch(error => {
                if (error.response && error.response.status === 409) {
                    alert('UserID already exists');
                } else {
                    console.error('There was an error registering!', error);
                }
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="userid" placeholder="User ID" value={form.userid} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            <input type="text" name="nickname" placeholder="Nickname" value={form.nickname} onChange={handleChange} required />
            <input type="text" name="realname" placeholder="Real Name" value={form.realname} onChange={handleChange} required />
            <button type="submit">Register</button>
        </form>
    );
}

export default Register;