import React, {useState} from "react";

function Modal(props) {
    let [a, setA] = useState('밤이야?');
    let [userInput1, setuserInput1] = useState('');
    let [name, setName] = useState(['한식', '중식', '일식']);
    let [title, setTitle] = useState(0);
    let [date, setDate] = useState(['2월27일','3월2일','3월17일']);
    let [like, setLike] = useState([0, 0, 0]);
    let [prevA, setPrevA] = useState('');
    let [prevName, setPrevName] = useState([]);
    let [prevDate, setPrevDate] = useState([]);
    let [img, setImg] = useState([
        "/img/bibim.jpg",
        "/img/ch.jpg",
        "/img/susi.jpg"
    ]);

    const handleButtonClick = () => {
        if (a === '밤이야?'){
            setPrevA(a);
            setA('밥먹을까?');
            setPrevName(name);
            setName(['소주', '맥주', '막걸리']);
            setPrevDate(date)
            setImg([
                "/img/soju.jpg",
                "/img/beer.jpg",
                "/img/makgeolli.jpg"
            ]);
            setDate(['2월 11일','2월18일','3월 15일']);
            setLike([0, 0, 0]);
        } else {
            setA(prevA);
            setName(prevName);
            setImg([
                "/img/bibim.jpg",
                "/img/ch.jpg",
                "/img/susi.jpg"
            ]);
            setDate(prevDate);
            setLike([0, 0, 0]);
        }
    };

    return (
        <div className="Modal" style={{background: props.color}}>
            <div className="text_box">
                <h4>제목 : {props.city[props.cityTitle]}</h4>
                <p>상세내용 : </p>
                <h2>
                    <button onClick={handleButtonClick}>{a}</button>
                </h2>
            </div>
            <div className="big_content1">
                {name.map(function (a, i) {
                    return (
                        <div className="content" key={i}>
                            <img src={img[i]} style={{width: '300px', height: '300px'}}/>
                            <h4 onClick={() => {
                                setTitle(i)
                            }}>{name[i]}</h4>
                            <p>{date[i]}</p>
                            <p><span onClick={() => {
                                let copy = [...like];
                                copy[i] = copy[i] + 1;
                                setLike(copy)
                            }}>❤</span>{like[i]}</p>
                            <button onClick={()=>{
                                let copy = [...name]
                                copy.splice(i,1);
                                setName(copy)
                            }}>삭제</button>
                        </div>
                    )
                })}
            </div>
            <div className = "input_box1">
                <input type="text" onChange={(e) => {
                    setuserInput1(e.target.value);
                }}/>
                <button onClick={()=>{
                    let copy = [...name];
                    copy.unshift(userInput1)
                    setName(copy)
                }}>맛집추가</button>
            </div>
        </div>
    )
}

export default Modal