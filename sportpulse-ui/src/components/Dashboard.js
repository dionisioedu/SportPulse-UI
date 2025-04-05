// src/components/Dashboard.js

import React, { useEffect, useState } from 'react';
import LeagueSidebar from './LeagueSidebar';
import { fetchSports, fetchCountries } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const apiUrl = process.env.REACT_APP_API_URL;

    const [sports, setSports] = useState([]);
    const [countries, setCountries] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSports()
            .then(data => setSports(data))
            .catch(err => setError(err.message));

        fetchCountries()
            .then(data => setCountries(data))
            .catch(err => setError(err.message));
    }, []);

    return (
        <div className="dashboard">
            <LeagueSidebar apiUrl={apiUrl}/>
            <div className="main-content">
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                <section>
                    <h2>Sports</h2>
                    <ul>
                        {sports.map((sport) => (
                            <li key={sport.idSport}>
                                {sport.strSport}
                            </li>
                        ))}
                    </ul>
                </section>
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
