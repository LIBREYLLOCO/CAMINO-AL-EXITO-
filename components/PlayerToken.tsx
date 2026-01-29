import React from 'react';
import { Player } from '../types';

interface PlayerTokenProps {
    player: Player;
    index: number;
    isCurrent: boolean;
    top: number;
    left: number;
    tileWidth: number;
    tileHeight: number;
}

const PlayerToken: React.FC<PlayerTokenProps> = ({ player, index, isCurrent, top, left, tileWidth, tileHeight }) => {
    // Center the token and apply offset for multiple players
    const tokenSize = isCurrent ? 28 : 24;
    const baseOffsetX = (tileWidth - tokenSize) / 2;
    const baseOffsetY = (tileHeight - tokenSize) / 2;

    const smallOffset = (index % 2) * (tokenSize / 2 + 4) - (tokenSize / 4);
    const largeOffset = Math.floor(index / 2) * (tokenSize / 2 + 4) - (tokenSize / 4);
    
    const style = {
        backgroundColor: player.color,
        top: `${top + baseOffsetY + largeOffset}px`,
        left: `${left + baseOffsetX + smallOffset}px`,
        borderColor: isCurrent ? 'white' : 'rgba(255,255,255,0.9)',
        boxShadow: isCurrent ? `0 0 15px ${player.color}` : '0 2px 4px rgba(0,0,0,0.8)'
    };
    
    const classes = `p-token ${isCurrent ? 'active' : ''}`;

    return (
        <div className={classes} style={style}>
            <span className="p-token-icon leading-none select-none">
                {player.icon}
            </span>
        </div>
    );
};

export default PlayerToken;