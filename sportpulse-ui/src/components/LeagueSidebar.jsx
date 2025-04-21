import React, { useState, useEffect } from 'react';
import './LeagueSidebar.css';

const LeagueSidebar = ({ apiUrl, onSelectLeague }) => {
  const [leagues, setLeagues] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/leagues`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setLeagues(data);
      })
      .catch(error => console.error('Error fetching leagues:', error));
  }, [apiUrl]);

  return (
    <div className="league-sidebar">
      <h2>Leagues</h2>
      <ul>
        {leagues.map(league => (
          <li key={league.idLeague} className="league-item" 
            onClick={() => onSelectLeague && onSelectLeague(league.idLeague)}>
            <div className="league-name">{league.strLeague}</div>
            <div className="league-sport">{league.strSport}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeagueSidebar;
