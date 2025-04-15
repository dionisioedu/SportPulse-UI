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
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleSearchChange = (text) => {
        setSearchText(text);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        if (!searchText.trim()) {
            setSearchResults([]);
            return;
        }

        const timeoutId = setTimeout(() => {
            Promise.allSettled([
                fetch(`${apiUrl}/searchTeamsByShortCode?shortCode=${searchText}`)
                    .then(res => res.ok ? res.json() : Promise.reject('ShortCode search error')),
                fetch(`${apiUrl}/searchTeamsByName?teamName=${searchText}`)
                    .then(res => res.ok ? res.json() : Promise.reject('Name search error')),
            ])
            .then(results => {
                const successfulResults = results
                    .filter(result => result.status === 'fulfilled')
                    .flatMap(result => result.value);

                // Remove duplicados com base no idTeam
                const uniqueResultsMap = new Map();
                successfulResults.forEach(team => {
                    if (!uniqueResultsMap.has(team.idTeam)) {
                        uniqueResultsMap.set(team.idTeam, team);
                    }
                });

                setSearchResults(Array.from(uniqueResultsMap.values()));

                const errors = results
                    .filter(result => result.status === 'rejected')
                    .map(result => result.reason);

                if (errors.length > 0) {
                    console.warn("Some requests failed:", errors);
                    setError(errors.join('; '));
                } else {
                    setError('');
                }
            })
            .catch(err => {
                console.error(err);
                setError(err.toString());
            });
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchText, apiUrl]);

    return (
        <div className="dashboard">
            <button className="toggle-button" onClick={toggleSidebar}>
                ☰
            </button>

            <div className={`sidebar ${sidebarOpen ? '' : 'hidden'}`}>
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
                        {searchResults.map(team => (
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
