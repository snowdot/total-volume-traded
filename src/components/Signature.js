import React from 'react';
import './Signature.css';
import logo from '../asssets/logo.png';

const Signature = () => {

    return (
        <div className="link">
            <a href="https://www.covalenthq.com/" target="_blank" rel="noreferrer">
                made for
                <img className="logo" src={logo} alt="logo"></img>
                by snowdot
            </a>
        </div>
    );
}

export default Signature;
