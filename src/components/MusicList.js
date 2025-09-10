import React from 'react';

const MusicList = ({ tracks }) => {
    return (
        <div className="music-list">
            {tracks.map((track, index) => (
                <div key={index} className="music-item">
                    <h3>{track.name}</h3>
                    <p>Artist: {track.artist}</p>
                    {track.image && track.image[2] && <img src={track.image[2]['#text']} alt={track.name} />}
                    {/* Добавь ссылку на Last.fm или плеер, если нужно */}
                    <a href={track.url} target="_blank" rel="noopener noreferrer">Listen on Last.fm</a>
                </div>
            ))}
        </div>
    );
};

export default MusicList;
