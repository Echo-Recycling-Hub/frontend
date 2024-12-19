import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {GoPaperAirplane} from "react-icons/go";
import {IoClose} from "react-icons/io5";
import {RiRobot2Line, RiRobot2Fill} from "react-icons/ri";
import "../../css/ChatBot.css";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { FaPaperclip } from "react-icons/fa6";

function Chatbot(props) {
    const [chatHistory, setChatHistory] = useState([]);
    const [responses, setResponses] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [resultImageUrl, setResultImageUrl] = useState(null);
    const chatContainerRef = useRef(null);

    // 데이터 불러오기 예시
    useEffect(() => {
        const fetchData = async (url) => {
            try {
                const result = await axios.get(url);
                return result.data;
            } catch (error) {
                console.error(`Error fetching from ${url}: `, error);
                return [];
            }
        };

        const loadAllData = async () => {
            const newMarkData = await fetchData('http://localhost:3001/recyclingcenters');
            const zeroData = await fetchData('http://localhost:3001/zero');
            const napronData = await fetchData('http://localhost:3001/napron');
            setResponses({ newMarkData, zeroData, napronData });
        };

        loadAllData();
    }, []);

    function welcomeMessage() {
        let message = '안녕하세요.\n서울시 지도페이지입니다.\n' + '위치를 알고 싶은 상호명을 입력해주세요.';
        return message;
    }

    async function getReverseGeocodingData(latitude, longitude) {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
                params: {
                    lat: latitude,
                    lon: longitude,
                    format: 'json'
                }
            });
            return response.data.display_name;
        } catch (error) {
            console.error('Failed to fetch address:', error);
            return '주소를 불러오는 데 실패했습니다.';
        }
    }

    async function sendMessage(inputText) {
        const userInput = String(inputText).toLowerCase().replace(/\s/g, "").trim();
        if (userInput !== '') {
            appendMessage('User', inputText);
            let responseMessage = '해당 정보를 찾을 수 없습니다.';

            const markerInfo = responses.newMarkData && responses.newMarkData.find(item =>
                item.NAME.toLowerCase().replace(/\s/g, "").includes(userInput) ||
                userInput.includes(item.NAME.toLowerCase().replace(/\s/g, ""))
            );
            if (markerInfo) {
                const { NAME, ADDRESS, PHONE, WEBSITE } = markerInfo;
                responseMessage = `재활용센터정보입니다: \n센터명: ${NAME}\n주소: ${ADDRESS}\n전화번호: ${PHONE}\n웹사이트: ${WEBSITE || '홈페이지 정보가 없습니다.'}`;
                appendMessage('ChatBot', responseMessage);
                if (isVoiceEnabled) {
                    speak(responseMessage);
                }
            } else {
                const zeroInfo = responses.zeroData && responses.zeroData.find(z =>
                    z.NAME.toLowerCase().replace(/\s/g, '').includes(userInput) ||
                    userInput.includes(z.NAME.toLowerCase().replace(/\s/g, "")));
                if (zeroInfo) {
                    const address = await getReverseGeocodingData(zeroInfo.LATITUDE, zeroInfo.LONGITUDE);
                    responseMessage = `제로웨이트샵 입니다.\n장소명: ${zeroInfo.NAME}\n주소: ${address}`;
                    appendMessage('ChatBot', responseMessage);
                    if (isVoiceEnabled) {
                        speak(responseMessage);
                    }
                } else {
                    const napronInfo = responses.napronData && responses.napronData.find(p =>
                        p.NAME.toLowerCase().replace(/\s/g, '').includes(userInput) ||
                        userInput.includes(p.NAME.toLowerCase().replace(/\s/g, "")));
                    if (napronInfo) {
                        const {NAME, ADDRESS, INPUT_WASTES} = napronInfo
                        responseMessage = `네프론관련정보입니다. \n위치: ${NAME}\n상세주소: ${ADDRESS}\n취급종류: ${INPUT_WASTES}`;
                        appendMessage('ChatBot', responseMessage);
                        if (isVoiceEnabled) {
                            speak(responseMessage);
                        }
                    } else {
                        appendMessage('ChatBot', responseMessage);
                        if (isVoiceEnabled) {
                            speak(responseMessage);
                        }
                    }
                }
            }
            document.getElementById('textInput').value = '';
            setUserInput('');
            setTranscript('');
        }
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            sendMessage(userInput);
            setUserInput('');
        }
    }

    // 이미지(파일)업로드 로직추가
    const fileInputRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/img/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const responseMessage = response.data.text;
            const base64Image = response.data.image;
            const resultImageUrl = `data:image/jpeg;base64,${base64Image}`;

            setResultImageUrl(resultImageUrl);

            // 이미지를 appendMessage 함수에서 추가
            appendMessage('ChatBot', (
                <div>
                    <img src={resultImageUrl}
                         alt="Result"
                         style={{ maxWidth: '200px', cursor: 'pointer' }}
                         onClick={() => setIsModalOpen(true)} />
                    <p>{responseMessage} 입니다.</p>
                </div>
            ));

            if (isVoiceEnabled) {
                speak(responseMessage);
            }

        } catch (error) {
            console.error('Failed to upload file:', error);
            appendMessage('ChatBot', '파일 업로드에 실패했습니다.');
        }
    };


    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const speechRecognition = useRef(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            speechRecognition.current = new SpeechRecognition();
            speechRecognition.current.continuous = true;
            speechRecognition.current.interimResults = true;

            speechRecognition.current.onresult = event => {
                const newTranscript = Array.from(event.results)
                    .map(result => result[0])
                    .map(result => result.transcript)
                    .join('');
                setTranscript(newTranscript);
            };

            speechRecognition.current.onerror = event => {
                console.error("Speech recognition error", event.error);
            };
        }
    }, []);

    useEffect(() => {
        const inputField = document.getElementById('textInput');
        if (inputField && transcript) {
            inputField.value = transcript;
        }
    }, [transcript]);

    useEffect(() => {
        if (transcript.trim().length > 0) {
            const timeoutId = setTimeout(() => {
                sendMessage(transcript);
                setTranscript("");
                stopAndRestartListening();
            }, 2000);

            return () => clearTimeout(timeoutId);
        }
    }, [transcript]);

    const stopAndRestartListening = () => {
        if (isListening) {
            speechRecognition.current.stop();
            setIsListening(false);

            setTimeout(() => {
                setIsListening(true);
                speechRecognition.current.start();
            }, 100);
        }
    };

    const startListening = () => {
        setIsListening(true);
        speechRecognition.current.start();
    };

    const stopListening = () => {
        setIsListening(false);
        speechRecognition.current.stop();
    };

    const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);

    function speak(text) {
        const speech = new SpeechSynthesisUtterance();
        speech.text = text;
        speech.lang = 'ko-KR';
        speech.volume = 1;
        speech.rate = 1;
        speech.pitch = 1;
        window.speechSynthesis.speak(speech);
    }

    function appendMessage(sender, content) {
        try {
            const newMessage = { sender, content };
            setChatHistory(prevChatHistory => [...prevChatHistory, newMessage]);

            if (chatContainerRef.current) {
                setTimeout(() => {
                    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                }, 100);
            }
        } catch (error) {
            console.error("Error appending message: ", error);
        }
    }



    const modalStyles = {
        // overlay: {
        //     position: 'fixed',
        //     top: '30%',
        //     left: '20%',
        //     width: '50%',
        //     height: '50%',
        //     backgroundColor: 'rgba(0, 0, 0, 0.75)',
        //     display: 'flex',
        //     justifyContent: 'center',
        //     alignItems: 'center',
        //     zIndex: 1000 // 충분히 높은 z-index 설정
        // },
        modal: {
            position: 'relative',
            top: 0,
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '4px',
            textAlign: 'center',
            width: '80%',
            maxWidth: '500px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            zIndex: 1001 // 모달 내부 요소도 높은 z-index 설정
        },
        closeButton: {
            position: 'absolute',
            top: '10px',
            right: '10px',
            fontSize: '24px',
            cursor: 'pointer',
            zIndex: 1002 // X 버튼도 충분히 높은 z-index 설정
        }
    };



    return (
        <div className="ChatbotIn">
            <div className="chatbot-header">
            <span className="chat-icon">
                <RiRobot2Fill />
            </span>
                <div className="bot-info">
                    <h5>EReHubBot</h5>
                    <p>Visiters Supporter</p>
                </div>
                <button className="chat-close-btn">
                    <IoClose onClick={props.closeChat} />
                </button>
            </div>
            <div className="message-display-container" ref={chatContainerRef}>
                <div className="welcome-message">
                    {welcomeMessage()}
                </div>
                {chatHistory.map((message, index) => (
                    <div key={index} className={`chat-message-${message.sender === 'User' ? 'user' : 'bot'}`}>
                        <strong>{message.sender}:</strong>
                        <div>{typeof message.content === 'string' ? message.content : message.content}</div>
                    </div>
                ))}
                {isModalOpen && (
                    // <div style={modalStyles.overlay} onClick={() => setIsModalOpen(false)}>
                        <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
                        <span
                            style={modalStyles.closeButton}
                            onClick={() => setIsModalOpen(false)}
                        >
                            &times;
                        </span>
                            <img src={resultImageUrl} alt="Result" style={{ maxWidth: '100%' }} />
                        </div>
                    // </div>
                )}
            </div>
            <div className="sendMessage">
                <input
                    id="textInput"
                    type="text"
                    placeholder="메세지를 입력하세요."
                    value={userInput}
                    onChange={e => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                />
                <button className="upload-button" onClick={triggerFileInput}>
                    <FaPaperclip />
                </button>
                <button className="spend_button" onClick={() => sendMessage(userInput)}><GoPaperAirplane /></button>
                <button className="vioce_button" onClick={() => isListening ? stopListening() : startListening()}>
                    {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
                </button>
                <button className="speak_button" onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}>
                    {isVoiceEnabled ? <RiRobot2Line /> : <RiRobot2Fill />}</button>
            </div>
        </div>
    );
;


}

export default Chatbot;
