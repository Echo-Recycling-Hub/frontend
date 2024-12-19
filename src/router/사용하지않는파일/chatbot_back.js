import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {GoPaperAirplane} from "react-icons/go";
import {IoClose} from "react-icons/io5";
import {RiRobot2Fill} from "react-icons/ri";
import "../../css/ChatBot.css";

function Chatbot() {
    const [chatHistory, setChatHistory] = useState([]);
    const [responses, setResponses] = useState([]);

    const chatContainerRef = useRef(null);

    useEffect(() => {
        axios.get('http://localhost:5000/newmark')
            .then((result) => {
                console.log(result.data);
                setResponses(result.data); // 수정된 부분
            })
            .catch(() => {
                console.log('실패');
            });
    }, []);

    function welcomeMessage() {
        let message = '안녕하세요.\n서울시 지도페이지입니다.\n' + '위치를 알고 싶은 상호명을 입력해주세요.';
        return message;
    }


    function sendMessage() {
        const userInput = document.getElementById('textInput').value;
        if (userInput.trim() !== '') {
            appendMessage('User', userInput);
            const centerInfo = findRecyclingCenterInfo(userInput, responses);
            if (centerInfo) {
                const responseMessage = `재활용센터명: ${centerInfo.name}\n주소: ${centerInfo.address}\n전화번호: ${centerInfo.phone}\n웹사이트: ${centerInfo.website}`;
                appendMessage('ChatBot', responseMessage);
            } else {
                appendMessage('ChatBot', '찾을 수 없는 재활용센터명입니다.');
            }
            document.getElementById('textInput').value = '';
        }
    }


    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    }

    function findRecyclingCenterInfo(userInput, responses) {
        // responses 배열을 검색하여 사용자 입력과 일치하는 재활용센터명을 찾습니다.
        const center = responses.find(item => item.재활용센터명.toLowerCase() === userInput.toLowerCase());

        // 해당 센터를 찾았다면 홈페이지 주소를 반환합니다.
        if (center) {
            return {
                name: center.재활용센터명,
                address: center.소재지도로명주소,
                phone: center.운영기관전화번호,
                website: center.홈페이지주소 || '홈페이지 정보가 없습니다.' // 홈페이지 정보가 없는 경우 대비
            };
        }

        return null;
    }

    function appendMessage(sender, message) {
        try {
            const newMessage = { sender, message };
            setChatHistory(prevChatHistory => [...prevChatHistory, newMessage]);

            // 채팅 컨테이너의 스크롤을 자동으로 최하단으로 이동시킵니다.
            if (chatContainerRef.current) {
                setTimeout(() => {
                    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                }, 100); // 비동기 방식으로 즉시 업데이트가 아닌 약간의 지연 후 스크롤, UI 업데이트를 보장
            }
        } catch (error) {
            console.error("Error appending message: ", error);
        }
    }


    return (
        <div className="Chatbot">
            <div className="chatbot-header">
                <span className="chat-icon">
                    <RiRobot2Fill/>
                </span>
                <div className="bot-info">
                    <h5>EReHubBot</h5>
                    <p>Visiters Supporter</p>
                </div>
                <button className="chat-close-btn">
                    <IoClose/>
                </button>
            </div>
            <div className="welcome-message">
                {welcomeMessage()}
            </div>
            <div ref={chatContainerRef}>
                {chatHistory.map((message, index) => (
                    <div key={index}>
                        <strong>{message.sender}:</strong> <div>{message.message}</div>
                    </div>
                ))}
            </div>
            <div className="sendMessage">
                <input id="textInput" type="text" placeholder="메세지를 입력하세요." onKeyDown={handleKeyDown}/>
                <button onClick={sendMessage}><GoPaperAirplane/>
                </button>
            </div>
        </div>
    );
}

export default Chatbot;
