import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/App_border.css';
import { Navbar, Container, Nav, Modal, Button, Carousel } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import plasticData from "./1_plasticData";
import disposableData from "./2_disposableData";
import wasteElecData from "./3_wasteElecData";
import foodWasteData from "./4_foodWasteData";
import wasteData from "./5_wasteData";
import home from "./totalData";

function App_insu() {
    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleOpenModal = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedItem(null);
        setShowModal(false);
    };

    const loadData = (category) => {
        switch (category) {
            case 'plastic':
                setData(plasticData);
                break;
            case 'disposable':
                setData(disposableData);
                break;
            case 'wasteElec':
                setData(wasteElecData);
                break;
            case 'foodWaste':
                setData(foodWasteData);
                break;
            case 'waste':
                setData(wasteData);
                break;
            default:
                setData(home);
                break;
        }
    };

    useEffect(() => {
        loadData('home');
    }, []);

    return (
        <Router>
            <div className="App">
                <Navbar bg="light" data-bs-theme="light">
                    <Container>
                        <Navbar.Brand href="/">자원순환 방법</Navbar.Brand>
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/board/plastic" onClick={() => loadData('plastic')}>분리배출</Nav.Link>
                            <Nav.Link as={Link} to="/board/disposable" onClick={() => loadData('disposable')}>일회용품</Nav.Link>
                            <Nav.Link as={Link} to="/board/wasteElec" onClick={() => loadData('wasteElec')}>폐가전</Nav.Link>
                            <Nav.Link as={Link} to="/board/foodWaste" onClick={() => loadData('foodWaste')}>음식물 폐기물</Nav.Link>
                            <Nav.Link as={Link} to="/board/waste" onClick={() => loadData('waste')}>기타폐기물</Nav.Link>
                        </Nav>
                    </Container>
                </Navbar>

                <Routes>
                    <Route path="/" element={
                        <div className="container">
                            <div className="row">
                                {data.map((item, index) => (
                                    <Card key={index} item={item} onOpenModal={handleOpenModal} />
                                ))}
                            </div>
                        </div>
                    } />
                </Routes>

                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedItem && selectedItem.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Carousel>
                            {selectedItem && selectedItem.images.map((image, index) => (
                                <Carousel.Item key={index}>
                                    <img
                                        className="d-block w-100"
                                        src={process.env.PUBLIC_URL + '/' + image}
                                        alt={`${selectedItem.title} ${index + 1}`}
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </Router>
    );
}

function Card({ item, onOpenModal }) {
    return (
        <div className="col-md-4 data_border">
            <Button onClick={() => onOpenModal(item)} variant="link">
                <img src={process.env.PUBLIC_URL + '/' + item.image} alt={item.title} />
            </Button>
            <h5>{item.title}</h5>
            <p>{item.description}</p>
        </div>
    );
}

export default App_insu;



// // 한페이지에 전체 데이터를 불러오는 시도!
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../css/App_border.css';
// import { Navbar, Container, Nav, Modal, Button, Carousel } from 'react-bootstrap';
// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import data_border from './totalData';
//
// function App_insu() {
//     const [data] = useState(data_border);
//     const [showModal, setShowModal] = useState(false);
//     const [selectedShoe, setSelectedShoe] = useState(null);
//
//     const handleOpenModal = (shoe) => {
//         setSelectedShoe(shoe);
//         setShowModal(true);
//     };
//
//     const handleCloseModal = () => {
//         setSelectedShoe(null);
//         setShowModal(false);
//     };
//
//     return (
//         <Router>
//             <div className="App">
//                 <Navbar bg="light" data-bs-theme="light">
//                     <Container>
//                         <Navbar.Brand href="#home">자원순환 방법</Navbar.Brand>
//                         <Nav className="me-auto">
//                             <Nav.Link as={Link} to="/">분리배출</Nav.Link>
//                             <Nav.Link as={Link} to="/">일회용품</Nav.Link>
//                             <Nav.Link as={Link} to="/">폐가전</Nav.Link>
//                             <Nav.Link as={Link} to="/">음식물 폐기물</Nav.Link>
//                             <Nav.Link as={Link} to="/">기타폐기물</Nav.Link>
//                         </Nav>
//                     </Container>
//                 </Navbar>
//
//                 <Routes>
//                     <Route path="/" element={
//                         <div className="container">
//                             <div className="row">
//                                 {data.map((shoe, index) => (
//                                     <Card key={index} shoe={shoe} onOpenModal={handleOpenModal} />
//                                 ))}
//                             </div>
//                         </div>
//                     } />
//                 </Routes>
//
//                 <Modal show={showModal} onHide={handleCloseModal}>
//                     <Modal.Header closeButton>
//                         <Modal.Title>{selectedShoe && selectedShoe.title}</Modal.Title>
//                     </Modal.Header>
//                     <Modal.Body>
//                         <Carousel>
//                             {selectedShoe && selectedShoe.images.map((image, index) => (
//                                 <Carousel.Item key={index}>
//                                     <img
//                                         className="d-block w-100"
//                                         src={process.env.PUBLIC_URL + image}
//                                         alt={`${selectedShoe.title} ${index + 1}`}
//                                     />
//                                 </Carousel.Item>
//                             ))}
//                         </Carousel>
//                     </Modal.Body>
//                     <Modal.Footer>
//                         <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
//                     </Modal.Footer>
//                 </Modal>
//             </div>
//         </Router>
//     );
// }
//
// function Card({ shoe, onOpenModal }) {
//     return (
//         <div className="col-md-4 data_border">
//             <Button onClick={() => onOpenModal(shoe)} variant="link">
//                 <img src={process.env.PUBLIC_URL + shoe.image} alt={shoe.title} />
//             </Button>
//             <h5>{shoe.title}</h5>
//             <p>{shoe.description}</p>
//         </div>
//     );
// }
//
// export default App_insu;
