import React from 'react';
import PropTypes from 'prop-types';
import './styles/CloseModalBtn.css'

const ModalCloseBtn = ({ onClick }) => (
    <button onClick={onClick} className="close-btn">✖</button>
);

ModalCloseBtn.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default ModalCloseBtn;
