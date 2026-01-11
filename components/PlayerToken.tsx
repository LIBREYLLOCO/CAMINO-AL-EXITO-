
import React from 'react';
import { Player } from '../types';

interface PlayerTokenProps {
    player: Player;
    index: number;
    isCurrent: boolean;
}

const PlayerToken: React.FC<PlayerTokenProps> = ({ player, index, isCurrent }) => {
    const offX = (index % 4) * 8 - 12; // Arrange in a 2xN grid
    const offY = Math.floor(index / 4) * 8 - 4;

    const style = {
        backgroundColor: player.color,
        borderColor: isCurrent ? 'white' : 'rgba(255,255,255,0.9)',
        transform: `translate(${offX}px, ${offY}px)`,
        boxShadow: isCurrent ? `0 0 15px ${player.color}` : '0 2px 4px rgba(0,0,0,0.8)'
    };
    
    const classes = `p-token ${isCurrent ? 'active' : ''}`;

    return (
        <div className={classes} style={style}>
            <span className="p-token-icon">{player.icon}</span>
        </div>
    );
};

export default PlayerToken;