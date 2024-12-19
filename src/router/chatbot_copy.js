import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {GoPaperAirplane} from "react-icons/go";
import {IoClose} from "react-icons/io5";
import {RiRobot2Line, RiRobot2Fill} from "react-icons/ri";
import "../css/ChatBot.css";
import { FaMicrophone, FaMicrophoneSlash  } from "react-icons/fa";
import { FaPaperclip } from "react-icons/fa6";
function Chatbot(props) {
    const [chatHistory, setChatHistory] = useState([]);
    const [responses, setResponses] = useState([]);
    const [userInput, setUserInput] = useState("");  // 사용자 입력을 위한 state 추가
    const [selectedFile, setSelectedFile] = useState(null);  // 0619 사진을 받기위한 상태추가

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
            // const newMarkData = await fetchData('http://http://54.82.4.76:3000/recyclingcenters');
            // const zeroData = await fetchData('http://54.82.4.76:3000/zero');
            // const napronData = await fetchData('http://54.82.4.76:3000/napron');

            // 상태에 저장 혹은 추가적인 로직 구현
            setResponses({ newMarkData, zeroData, napronData });
        };

        loadAllData();
        console.log(loadAllData)
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
            return response.data.display_name;  // 이 필드에 주소 정보가 포함되어 있습니다.
        } catch (error) {
            console.error('Failed to fetch address:', error);
            return '주소를 불러오는 데 실패했습니다.';
        }
    }

    async function sendMessage(inputText) {
        // inputText를 문자열로 강제 변환 후 모든 공백 제거 및 소문자 변환
        const userInput = String(inputText).toLowerCase().replace(/\s/g, "").trim();
        if (userInput !== '') {
            appendMessage('User', inputText);  // 원래 입력을 화면에 표시
            let responseMessage = '해당 정보를 찾을 수 없습니다.';

            // 마커 정보 검색 전 데이터의 이름에서도 공백을 제거
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
                // 제로웨이스트샵 및 네프론 정보 검색도 동일하게 공백 제거 후 비교
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
            setUserInput('');  // React 상태 초기화
            setTranscript(''); // transcript 상태 초기화
        }
    }



    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            sendMessage(userInput);  // 현재 사용자 입력을 sendMessage에 전달
            setUserInput('');  // 입력 필드 초기화
        }
    }


    // 0619 이미지(파일)업로드 로직추가
    const fileInputRef = useRef(null);
    const [resultImageUrl, setResultImageUrl] = useState(null);


    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);  // 여기서 상태 업데이트

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/imgupload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const responseMessage = response.data.message;
            appendMessage('ChatBot', responseMessage); // 결과 메시지를 챗봇에 추가

            // 사용자가 업로드한 이미지를 추가
            setUploadedImage(URL.createObjectURL(file));
            appendMessage('User', <img src={URL.createObjectURL(file)} alt="Uploaded" style={{ maxWidth: '200px' }} />);

            if (isVoiceEnabled) {
                speak(responseMessage);
            }

            const { result_image_url } = response.data;
            const fullResultImageUrl = `http://localhost:5000${result_image_url}`;
            setResultImageUrl(fullResultImageUrl); // 결과 이미지 URL 설정
            appendMessage('ChatBot', <img src={fullResultImageUrl} alt="Result" style={{ maxWidth: '200px' }} />);

        } catch (error) {
            console.error('Failed to upload file:', error);
            appendMessage('ChatBot', '파일 업로드에 실패했습니다.');
        }
    };


    const triggerFileInput = () => {
        fileInputRef.current.click();
    };




    //음성인식 챗봇
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const speechRecognition = useRef(null);

    // SpeechRecognition 설정
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            speechRecognition.current = new SpeechRecognition();
            speechRecognition.current.continuous = true;  // 연속적인 입력을 받도록 설정
            speechRecognition.current.interimResults = true;  // 중간 결과도 반환받음

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

// transcript 상태가 변경될 때 실행될 로직
    useEffect(() => {
        if (transcript.trim().length > 0) {
            const timeoutId = setTimeout(() => {
                sendMessage(transcript);
                setTranscript(""); // 메시지 전송 후 transcript 초기화
                stopAndRestartListening();
            }, 2000); // 사용자가 말을 멈춘 후 2초 대기

            return () => clearTimeout(timeoutId); // 컴포넌트 언마운트 시 타이머 정리
        }
    }, [transcript]); // transcript 상태가 변경될 때마다 이 useEffect 실행

    const stopAndRestartListening = () => {
        if (isListening) {
            speechRecognition.current.stop(); // 음성 인식 중지
            setIsListening(false); // 상태 업데이트

            // 음성 인식이 완전히 중지된 후 다시 시작
            setTimeout(() => {
                setIsListening(true);
                speechRecognition.current.start(); // 음성 인식 재시작
            }, 100); // 100ms 후에 재시작
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

    useEffect(() => {
        const inputField = document.getElementById('textInput');
        if(inputField) {
            inputField.value = transcript;
        }
    }, [transcript]);


    // 음성인식 답변듣기
    const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);

    function speak(text) {
        const speech = new SpeechSynthesisUtterance();
        speech.text = text;
        speech.lang = 'ko-KR'; // 한국어 설정
        speech.volume = 1; // 볼륨 (0에서 1 사이)
        speech.rate = 1; // 속도 (0.1에서 10 사이)
        speech.pitch = 1; // 피치 (0에서 2 사이)
        window.speechSynthesis.speak(speech);
    }


    function appendMessage(sender, message) {
        try {
            const newMessage = {sender, message};
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
        <div className="ChatbotIn">
            <div className="chatbot-header">
                <span className="chat-icon">
                    <RiRobot2Fill/>
                </span>
                <div className="bot-info">
                    <h5>EReHubBot</h5>
                    <p>Visiters Supporter</p>
                </div>
                <button className="chat-close-btn">
                    <IoClose onClick={props.closeChat}/>
                </button>
            </div>
            <div className="message-display-container" ref={chatContainerRef}>
                    <div className="welcome-message">
                        {welcomeMessage()}
                    </div>
                {chatHistory.map((message, index) => (
                    <div key={index} className={`chat-message-${message.sender === 'User' ? 'user' : 'bot'}`}>
                        <strong>{message.sender}:</strong> <div>{message.message}</div>
                    </div>
                ))}
            </div>
            <div className="sendMessage">
                <input
                    id="textInput"
                    type="text"
                    placeholder="메세지를 입력하세요."
                    value={userInput}  // input 값을 state로 관리
                    onChange={e => setUserInput(e.target.value)}  // 입력 시 state 업데이트
                    onKeyDown={handleKeyDown}
                />
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{display: "none"}}
                    onChange={handleFileUpload}
                />
                <button className="upload-button" onClick={triggerFileInput}>
                    <FaPaperclip/>
                </button>
                <button className="spend_button" onClick={() => sendMessage(userInput)}><GoPaperAirplane/></button>
                <button className="vioce_button" onClick={() => isListening ? stopListening() : startListening()}>
                    {isListening ? <FaMicrophoneSlash/> : <FaMicrophone/>}
                </button>
                <button className="speak_button" onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}>
                    {isVoiceEnabled ? <RiRobot2Line/> : <RiRobot2Fill/>}</button>
            </div>
        </div>
    );
}

export default Chatbot;
