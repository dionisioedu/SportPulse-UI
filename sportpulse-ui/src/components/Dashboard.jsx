// src/components/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import LeagueSidebar from './LeagueSidebar';
import SportMenu from './SportMenu';
import CountryCards from './CountryCards';
import Search from './Search';
import TeamCard from './TeamCard';
import './Dashboard.css';

const Dashboard = () => {
    const apiUrl = process.env.REACT_APP_API_URL;

    const [error, setError] = useState('');
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearchChange = (text) => {
        setSearchText(text);
    };

    useEffect(() => {
        if (!searchText.trim()) {
            setSearchResults([]);
            return;
        }

        const timeoutId = setTimeout(() => {
            fetch(`${apiUrl}/searchTeamsByShortCode?shortCode=${searchText}`)
                .then((res) => {
                    if (!res.ok) throw new Error('Search error');
                    return res.json();
                })
                .then((data) => {
                    setSearchResults(data);
                })
                .catch((err) => {
                    console.error(err);
                    setError(err.message);
                });
            fetch(`${apiUrl}/searchTeamsByName?teamName=${searchText}`)
                .then((res) => {
                    if (!res.ok) throw new Error('Search error');
                    return res.json();
                })
                .then((data) => {
                    setSearchResults(data);
                })
                .catch((err) => {
                    console.error(err);
                    setError(err.message);
                });
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchText, apiUrl]);

    return (
        <div className="dashboard">
            <div className="visible">
                <LeagueSidebar apiUrl={apiUrl} onSelectLeague={(league) => console.log("League:", league)} />
            </div>

            <div className="main-content">
                <div className="top-bar">
                    <SportMenu apiUrl={apiUrl} onSelectSport={(sport) => console.log("Sport:", sport)} />
                    <Search apiUrl={apiUrl} onSearchChange={handleSearchChange} />
                </div>

                {error && <p className="error">Error: {error}</p>}

                {searchResults.length > 0 && (
                    <div className="searchResults">
                        <h2>Search results:</h2>
                        {searchResults.map((team) => (
                            <TeamCard key={team.idTeam} team={team} />
                        ))}
                    </div>
                )}

                <CountryCards apiUrl={apiUrl} onSelectCountry={(c) => console.log("Country:", c)} />
            </div>
        </div>
    );
};

export default Dashboard;
