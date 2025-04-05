import React, { useState, useEffect } from 'react';
import { fetchSports } from '../services/api';
import './SportMenu.css';

const SportMenu = ({ apiUrl, onSelectSport }) => {
    const [sports, setSports] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSports(apiUrl)
            .then(data => setSports(data))
            .catch(err => {
                console.error('Error fetching sports:', err);
                setError(err.message);
            });
    }, [apiUrl]);

    return (
        <div className="sport-menu">
            {error && <span className="error">{error}</span>}
            {sports.map(sport => (
                <button
                    key={sport.idSport}
                    className="sport-menu-item"
                    onClick={() => onSelectSport && onSelectSport(sport)}
                >
                    {sport.strSport}
                </button>
            ))}
        </div>
    );
};

export default SportMenu;
