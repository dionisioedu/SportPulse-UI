import React, { useState, useEffect } from 'react';
import { fetchCountries } from '../services/api'; // Certifique-se de que essa função exista e retorne o array de países
import './CountryCards.css';

const CountryCards = ({ apiUrl, onSelectCountry }) => {
    const [countries, setCountries] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCountries(apiUrl)
            .then(data => {
                console.log("Countries received:", data);
                setCountries(data);
            })
            .catch(err => {
                console.error('Error fetching countries:', err);
                setError(err.message);
            });
    }, [apiUrl]);

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="country-cards-container">
            {countries.map((country, index) => (
                <div key={index} className="country-card" onClick={() => onSelectCountry && onSelectCountry(country)}>
                    <img
                        src={country.flag_url}
                        alt={`Flag of ${country.name}`}
                        className="country-flag"
                    />
                    <div className="country-name">{country.name}</div>
                </div>
            ))}
        </div>
    );
};

export default CountryCards;
