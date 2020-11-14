import React, { useState, useEffect } from 'react';
import './App.css';
import Buttons from './components/Buttons';
import Header from './components/Header';
import Chart from './components/Chart';
import Signature from './components/Signature';

import axios from 'axios';

function App() {
    const [total, setTotal] = useState('Total');
    const [value, setValue] = useState('percent');
    const [price, setPrice] = useState(400);

    useEffect(() => {
        axios.get('https://api.coingecko.com/api/v3/coins/ethereum')
            .then(res => {
                if(res.data.market_data.current_price) {
                    setPrice(res.data.market_data.current_price.usd);
                }
            });
    }, []);

    return (
        <main className="container">
            <Header
                total={total}
            />
            <Buttons
                setValue={setValue}
            />
            <Chart
                value={value}
                price={price}
                setTotal={setTotal}
            />
            <Signature />
        </main>
    );
}

export default App;
