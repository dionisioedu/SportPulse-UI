// src/components/Dashboard.js

import React, { useEffect, useState } from 'react';
import LeagueSidebar from './LeagueSidebar';
import SportMenu from './SportMenu';
import { fetchCountries } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const apiUrl = process.env.REACT_APP_API_URL;

    const [countries, setCountries] = useState([]);
    const [error, setError] = useState('');

    const handleSelectSport = (sport) => {
        console.log("Sport selected:", sport);
    };

    const handleSelectLeague = (league) => {
        console.log("League selected:", league);
    };

    useEffect(() => {
        fetchCountries()
            .then(data => setCountries(data))
            .catch(err => setError(err.message));
    }, []);

    return (
        <div className="dashboard">
            <LeagueSidebar apiUrl={apiUrl} onSelectLeague={handleSelectLeague}/>
            <div className="main-content">
                <SportMenu apiUrl={apiUrl} onSelectSport={handleSelectSport} />
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                <section>
                    <h2>Countries</h2>
                    <ul>
                        {countries.map((country, index) => (
                            <li key={index}>
                                {country.name}
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
