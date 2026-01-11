
import React from 'react';
import { Player } from '../types';
import PlayerStatusCard from './PlayerStatusCard';

interface MobileStatsBarProps {
    players: Player[];
    currentPlayerIndex: number;
}

const MobileStatsBar: React.FC<MobileStatsBarProps> = ({ players, currentPlayerIndex }) => {
    return (
        <div id="mobile-stats-bar" className="lg:hidden px-4 py-3 bg-slate-900/95 flex gap-4 overflow-x-auto whitespace-nowrap custom-scroll border-b border-white/10 min-h-[90px] shadow-lg z-30">
             {players.map(p => (
                <div key={p.id} className="min-w-[200px]">
                     <PlayerStatusCard player={p} isCurrent={p.id === currentPlayerIndex} compact />
                </div>
            ))}
        </div>
    );
};

export default MobileStatsBar;
