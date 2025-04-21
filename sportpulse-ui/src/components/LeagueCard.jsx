import React from 'react';
import './LeagueCard.css';

const LeagueCard = ({ league }) => {
    const imageUrl =
        league.strBadge ||
        league.strLogo ||
        league.strPoster ||
        league.strFanart1 ||
        null;

    return (
        <div className="league-card">
            <div className="left">

                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt={league.strLeague}
                        className="league-image"
                    />
                )}

                <div className="country-sport">
                    <p><strong>Sport:</strong> {league.strSport}</p>
                    <p><strong>Country:</strong> {league.strCountry}</p>
                    <p><strong>Gender:</strong> {league.strGender}</p>
                    <p><strong>Formed Year:</strong> {league.intFormedYear}</p>
                    <p><strong>Current Season:</strong> {league.strCurrentSeason}</p>
                </div>
            </div>

            <div className="right">
                <h2>{league.strLeague}</h2>
                <p className="description">
                    {(league.strDescriptionEN || "No description available.")
                        .split(/\r?\n/)
                        .map((line, idx) => (
                            <React.Fragment key={idx}>
                                {line}
                                <br />
                            </React.Fragment>
                        ))
                    }
                </p>

                <div className="media-links">
                    {league.strWebsite && (
                        <a href={`https://${league.strWebsite}`} target="_blank" rel="noreferrer">🌐 Website</a>
                    )}
                    {league.strFacebook && (
                        <a href={`https://${league.strFacebook}`} target="_blank" rel="noreferrer">📘 Facebook</a>
                    )}
                    {league.strInstagram && (
                        <a href={`https://${league.strInstagram}`} target="_blank" rel="noreferrer">📸 Instagram</a>
                    )}
                    {league.strTwitter && (
                        <a href={`https://${league.strTwitter}`} target="_blank" rel="noreferrer">🐦 Twitter</a>
                    )}
                    {league.strYoutube && (
                        <a href={`https://${league.strYoutube}`} target="_blank" rel="noreferrer">▶️ YouTube</a>
                    )}
                </div>

                <div className="gallery">
                    {[league.strFanart1, league.strFanart2, league.strFanart3, league.strFanart4]
                        .filter(Boolean)
                        .map((img, index) => (
                            <img key={index} src={img} alt={`Fanart ${index + 1}`} className="fanart" />
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default LeagueCard;
