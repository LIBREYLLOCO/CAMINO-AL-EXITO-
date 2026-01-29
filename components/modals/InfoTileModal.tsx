import React from 'react';
import { Tile } from '../../types';
import { playSound } from '../../utils/soundManager';

interface InfoTileModalProps {
    tile: Tile;
    onClose: () => void;
}

const InfoTileModal: React.FC<InfoTileModalProps> = ({ tile, onClose }) => {
    if (!tile) return null;
    
    return (
        <div className="fixed inset-0 flex items-center justify-center p-6 bg-black/50 backdrop-blur-[2px] z-[100] modal-active">
            <div className="glass w-full max-w-xs p-8 rounded-[2.5rem] text-center border-2 border-white/20 shadow-2xl animate__animated animate__zoomIn">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">HAS CAÍDO EN:</p>
                <h2 className="text-3xl font-black text-white uppercase italic mb-6 leading-none text-yellow-400">{tile.n}</h2>
                <div className="text-sm text-gray-300 font-bold mb-8">{tile.d || "Evento de Casilla"}</div>
                <button onClick={onClose} className="w-full py-4 bg-white text-black rounded-2xl font-black text-sm uppercase hover:bg-gray-200 shadow-xl tracking-widest cursor-pointer">ENTENDIDO ➡️</button>
            </div>
        </div>
    );
};

export default InfoTileModal;