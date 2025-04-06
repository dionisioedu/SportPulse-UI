// src/components/Dashboard.js

import React, { useEffect, useState } from 'react';
import LeagueSidebar from './LeagueSidebar';
import SportMenu from './SportMenu';
import CountryCards from './CountryCards';
import './Dashboard.css';

const Dashboard = () => {
    const apiUrl = process.env.REACT_APP_API_URL;

    const [error, setError] = useState('');

    const handleSelectSport = (sport) => {
        console.log("Sport selected:", sport);
    };

    const handleSelectLeague = (league) => {
        console.log("League selected:", league);
    };

    const handleSelectCountry = (country) => {
        console.log("Country selected:", country);
    };

    return (
        <div className="dashboard">
            <div className="sidebar">
                <LeagueSidebar apiUrl={apiUrl} onSelectLeague={handleSelectLeague}/>
            </div>
            <div className="main-content">
                <SportMenu apiUrl={apiUrl} onSelectSport={handleSelectSport} />
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                <CountryCards apiUrl={apiUrl} onSelectCountry={handleSelectCountry} />
            </div>
        </div>
    );
};

export default Dashboard;
