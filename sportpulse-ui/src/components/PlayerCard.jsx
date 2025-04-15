// src/components/PlayerCard.jsx

import React from 'react';
import './PlayerCard.css';

const PlayerCard = ({ player }) => {
    return (
        <div className="player-card">
            {player.strThumb && <img src={player.strThumb} alt={player.strPlayer} />}
            <h3>{player.strPlayer}</h3>
            <p>{player.strPosition}</p>
            <p>{player.strTeam}</p>
        </div>
    );
};

export default PlayerCard;