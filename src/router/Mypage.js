import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import {TextField, Button, Box, Typography} from '@mui/material';
import {AuthContext} from './AuthContext'; // AuthContext import 추가
import "../css/mypage.css"

function Mypage() {
    const {user} = useContext(AuthContext); // AuthContext에서 user 가져오기
    const [userInfo, setUserInfo] = useState([]);
    const [mileageAmount, setMileageAmount] = useState(0);
    const [mileageHistory, setMileageHistory] = useState([]); // New state for mileage usage history

    const handleMileageChange = (event) => {
        setMileageAmount(event.target.value);
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token provided');
                return;
            }

            try {
                const response = await axios.get('http://localhost:3001/mypage', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const userData = response.data;
                setUserInfo([
                    {label: '별명', value: userData.NICKNAME},
                    {label: '실명', value: userData.REALNAME},
                    {label: '마일리지', value: userData.MILEAGE}
                ]);
            } catch (error) {
                console.error('Failed to fetch user info:', error.response ? error.response.data : error.message);
            }
        };

        fetchUserInfo();
    }, [user]);

    const handleUseMileage = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token provided');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/mileage/use', {amount: mileageAmount}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                alert('Mileage used successfully!');

                // Add the new usage record to the history
                const now = new Date();
                setMileageHistory(prevHistory => [
                    ...prevHistory,
                    {
                        amount: mileageAmount,
                        date: now.toLocaleDateString(),
                        time: now.toLocaleTimeString()
                    }
                ]);

                // Fetch and update user info
                const userInfoResponse = await axios.get('http://localhost:3001/mypage', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const userData = userInfoResponse.data;
                setUserInfo([
                    {label: '별명', value: userData.NICKNAME},
                    {label: '실명', value: userData.REALNAME},
                    {label: '마일리지', value: userData.MILEAGE}
                ]);
            }
        } catch (error) {
            console.error('Failed to use mileage:', error.response ? error.response.data : error.message);
            alert('Failed to use mileage.');
        }
    };

    return (
        <div className="Mypage">
            <div className="Mypage_header_box"></div>
            <div className="mypage-con">
                <div className="mypage-section">
                    <div className="mypage-header">
                        <div className="mypage-head">
                            <h1>마이페이지</h1>
                        </div>
                        <div className="mileage-form">
                            <TextField
                                label="총 마일리지"
                                type="number"
                                value={mileageAmount}
                                onChange={handleMileageChange}
                                fullWidth
                                sx={{mb: 2}}
                            />
                            <Button variant="contained" color="secondary" onClick={handleUseMileage}>
                                사용하기
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="mypage-userinfo">
                    <div className="user-profile">
                        <h5>프로필</h5>
                        <div className="user">
                            <div className="user-icons"></div>
                            <div className="user-info">
                                {userInfo.map((info, index) => (
                                    <Typography key={index} variant="subtitle1">
                                        {info.label}: {info.value}
                                    </Typography>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="user-mileage">
                        <h5>마일리지 사용내역</h5>
                        <div className="use-mileage-con">
                            <div className="use-mileage-txt">
                                {mileageHistory.map((entry, index) => (
                                    <Typography key={index} variant="body2">
                                        {entry.date} | {entry.amount} 마일리지 사용
                                    </Typography>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Mypage;
