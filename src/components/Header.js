import React, { useState } from 'react';
import './Header.css';
import unicorn from '../asssets/unicorn.svg';

const Header = ({ total }) => {
    const [show, setShow] = useState(false);

    const handleMoveEnter = () => {
        setShow(true);
    }

    const handleMoveLeave = () => {
        setShow(false);
    }

    return (
        <header className="title">
            <a href="https://info.uniswap.org/" target="_blank" rel="noreferrer">
                <img src={unicorn}></img>
            </a>
            <h1>{`${total} Volume Traded`}</h1>
            <div className="info">
                <div
                    className="i"
                    onMouseEnter={handleMoveEnter}
                    onMouseLeave={handleMoveLeave}
                >i</div>
                <div
                    className={`note ${show ? 'show' : 'hide'}`}
                >
                    <p>Total UNISWAP volume traded between 05/06/2020-10/21/2020 for the below 5 pools.</p>
                    <p>The total volume does NOT include the 0.30% Liquidity Provider Fee.</p>
                    <p>USD values are calculated by using current ETH/USD price from 
                        <a href="https://www.coingecko.com/" target="_blank" rel="noreferrer">https://www.coingecko.com/</a>.    
                    </p>
                </div>
            </div>
        </header>
    );
}

export default Header;
