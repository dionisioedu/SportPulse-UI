// src/components/TeamCard.jsx
import React from 'react';
import './TeamCard.css';

const TeamCard = ({ team }) => {
    return (
        <div className="team-card">
            {team.strFanart1 && (
                <div className="team-fanart" style={{ backgroundImage: `url(${team.strFanart1})` }}></div>
            )}
            <div className="team-header">
                {team.strBadge && <img src={team.strBadge} alt="Team Badge" className="team-badge" />}
                <div>
                    <h2>{team.strTeam}</h2>
                    <p>{team.strLeague} • {team.strCountry}</p>
                    <p>{team.strDivision}</p>
                </div>
            </div>
            <p className="subtitle"><strong>Formed:</strong> {team.intFormedYear}</p>
            <p className="subtitle"><strong>Stadium:</strong> {team.strStadium} ({team.intStadiumCapacity} places) • {team.strLocation}</p>

            <img className="team-banner" src={team.strBanner} alt="Team Banner"/>

            <p className="description">{team.strDescriptionEN}</p>

            <div className="social-links">
                {team.strWebsite && <a href={team.strWebsite} target="_blank" rel="noreferrer">🌐 Website</a>}
                {team.strTwitter && <a href={`https://${team.strTwitter}`} target="_blank" rel="noreferrer">🐦 Twitter</a>}
                {team.strFacebook && <a href={`https://${team.strFacebook}`} target="_blank" rel="noreferrer">📘 Facebook</a>}
                {team.strInstagram && <a href={`https://${team.strInstagram}`} target="_blank" rel="noreferrer">📸 Instagram</a>}
            </div>
        </div>
    );
};

export default TeamCard;
