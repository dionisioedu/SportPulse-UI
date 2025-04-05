// src/components/Dashboard.js

import React, { useEffect, useState } from 'react';
import { fetchLeagues, fetchSports, fetchCountries } from '../services/api';

const Dashboard = () => {
  const [leagues, setLeagues] = useState([]);
  const [sports, setSports] = useState([]);
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeagues()
      .then(data => setLeagues(data))
      .catch(err => setError(err.message));

    fetchSports()
      .then(data => setSports(data))
      .catch(err => setError(err.message));

    fetchCountries()
      .then(data => setCountries(data))
      .catch(err => setError(err.message));
  }, []);

  return (
    <div>
      <h1>SportPulse Dashboard</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <section>
        <h2>Leagues</h2>
        <ul>
          {leagues.map((league) => (
            <li key={league.idLeague}>
              {league.strLeague} - {league.strSport}
            </li>
          ))}
        </ul>
      </section>
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
  );
};

export default Dashboard;
