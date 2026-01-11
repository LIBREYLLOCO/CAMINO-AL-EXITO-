
import React from 'react';
import { Player } from '../types';
import PlayerStatusCard from './PlayerStatusCard';

interface StatusSidebarProps {
    players: Player[];
    currentPlayerIndex: number;
}

const StatusSidebar: React.FC<StatusSidebarProps> = ({ players, currentPlayerIndex }) => {
    return (
        <div id="sidebar-status" className="hidden lg:flex glass-dark p-6 overflow-y-auto custom-scroll shadow-2xl w-[320px] flex-shrink-0 flex-col z-40">
            <h3 className="text-yellow-500 text-sm font-black uppercase tracking-widest mb-6 border-b border-white/10 pb-4">📊 Tabla de Líderes</h3>
            <div className="space-y-6">
                {players.map(p => (
                    <PlayerStatusCard key={p.id} player={p} isCurrent={p.id === currentPlayerIndex} />
                ))}
            </div>
        </div>
    );
};

export default StatusSidebar;
