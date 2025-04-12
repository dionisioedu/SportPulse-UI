// src/components/Dashboard.js

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

    const handleSelectSport = (sport) => {
        console.log("Sport selected:", sport);
    };

    const handleSelectLeague = (league) => {
        console.log("League selected:", league);
    };

    const handleSelectCountry = (country) => {
        console.log("Country selected:", country);
    };

    const handleSearchChange = (text) => {
        console.log("Search text changed: ", text);
        setSearchText(text);
    };

    useEffect(() => {
        if (!searchText.trim()) {
            setSearchResults([]);
            return;
        }

        const timeoutId = setTimeout(() => {
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
            <div className="sidebar">
                <Search apiUrl={apiUrl} onSearchChange={handleSearchChange}/>
                <LeagueSidebar apiUrl={apiUrl} onSelectLeague={handleSelectLeague}/>
            </div>
            <div className="main-content">
                <SportMenu apiUrl={apiUrl} onSelectSport={handleSelectSport} />
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}

                {searchResults.length > 0 && (
                    <div className="searchResults">
                        <h2>Search results:</h2>
                        <ul>
                        {searchResults.map((team) => (
                            <TeamCard key={team.idTeam} team={team} />
                        ))}
                        </ul>
                    </div>
                )}

                <CountryCards apiUrl={apiUrl} onSelectCountry={handleSelectCountry} />
            </div>
        </div>
    );
};

export default Dashboard;
