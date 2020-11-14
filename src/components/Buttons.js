import React, { useState } from 'react';
import './Buttons.css';

const Buttons = ({ setValue }) => {
    const [active, setActive] = useState('6hf8');
    const btns = [
        {
            id: '6hf8',
            value: 'percent',
            label: '%'
        },
        {
            id: '9k3r',
            value: 'usd',
            label: 'usd'
        },
        {
            id: '7qg2',
            value: 'eth',
            label: 'eth'
        }
    ];

    const handleOnClick = e => {
        setActive(e.target.id);
        setValue(e.target.value);
    }

    return (
        <div className="buttons">
            {
                btns.map(btn => (
                    <button
                        key={btn.id}
                        id={btn.id}
                        className={`${btn.id === active ? 'active' : ''}`}
                        value={btn.value}
                        onClick={handleOnClick}
                    >
                        {btn.label}
                    </button>
                ))
            }
        </div>
    );
}

export default Buttons;
