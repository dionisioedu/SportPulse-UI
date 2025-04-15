// src/components/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import LeagueSidebar from './LeagueSidebar';
import SportMenu from './SportMenu';
import CountryCards from './CountryCards';
import Search from './Search';
import TeamCard from './TeamCard';
import PlayerCard from './PlayerCard';
import './Dashboard.css';

const Dashboard = () => {
    const apiUrl = process.env.REACT_APP_API_URL;

    const [error, setError] = useState('');
    const [searchText, setSearchText] = useState('');
    const [teamResults, setTeamResults] = useState([]);
    const [playerResults, setPlayerResults] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleSearchChange = (text) => {
        setSearchText(text);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        if (!searchText.trim()) {
            setTeamResults([]);
            setPlayerResults([]);
            return;
        }

        const timeoutId = setTimeout(() => {
            Promise.allSettled([
                fetch(`${apiUrl}/searchTeamsByShortCode?shortCode=${searchText}`)
                    .then(res => res.ok ? res.json() : Promise.reject('ShortCode search error')),
                fetch(`${apiUrl}/searchTeamsByName?teamName=${searchText}`)
                    .then(res => res.ok ? res.json() : Promise.reject('Name search error')),
                fetch(`${apiUrl}/searchPlayers?playerName=${searchText}`)
                    .then(res => res.ok ? res.json() : Promise.reject('Players search error')),
                fetch(`${apiUrl}/searchPlayersFromTeam?teamName=${searchText}`)
                    .then(res => res.ok ? res.json() : Promise.reject('Players from team search error')),
            ])
            .then(results => {
                console.log("🧪 Resultados brutos:", results);

                const teamResults = [];
                const playerResults = [];

                results.forEach((r, index) => {
                    if (r.status === 'fulfilled' && r.value) {
                        console.log(`✅ Resposta do endpoint ${index}:`, r.value);
                        const data = r.value;

                        if (Array.isArray(data)) {
                            if (index < 2) {
                                teamResults.push(...data);
                            } else {
                                playerResults.push(...data);
                            }
                        } else if (Array.isArray(data.teams)) {
                            teamResults.push(...data.teams);
                        } else if (Array.isArray(data.players)) {
                            playerResults.push(...data.players);
                        }
                    } else {
                        console.warn(`❌ Falha no endpoint ${index}:`, r.reason);
                    }
                });

                // Deduplicar por ID
                const uniqueTeams = Array.from(new Map(teamResults.map(t => [t.idTeam, t])).values());
                const uniquePlayers = Array.from(new Map(playerResults.map(p => [p.idPlayer, p])).values());

                setTeamResults(uniqueTeams);
                setPlayerResults(uniquePlayers);

                const errors = results
                    .filter(r => r.status === 'rejected')
                    .map(r => r.reason);

                if (errors.length > 0) {
                    setError(errors.join('; '));
                } else {
                    setError('');
                }
            })
            .catch(err => {
                console.error("🚨 Erro inesperado:", err);
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

                {teamResults.length > 0 && (
                    <div className="searchResults">
                        <h2>Search results for Teams:</h2>
                        {teamResults.map((team) => (
                            <TeamCard key={team.idTeam} team={team} />
                        ))}
                    </div>
                )}

                {playerResults.length > 0 && (
                    <div className="searchResults">
                        <h2>Search results for Players:</h2>
                        {playerResults.map((player) => (
                            <PlayerCard key={player.idPlayer} player={player} />
                        ))}
                    </div>
                )}

                <CountryCards apiUrl={apiUrl} onSelectCountry={(c) => console.log("Country:", c)} />
            </div>
        </div>
    );
};

export default Dashboard;
