import React, { useState } from 'react';
import { toggleMute, getMuteState } from '../utils/soundManager';

const SoundToggle: React.FC = () => {
    const [isMuted, setIsMuted] = useState(getMuteState());

    const handleToggle = () => {
        const newMuteState = toggleMute();
        setIsMuted(newMuteState);
    };

    return (
        <button
            onClick={handleToggle}
            className="fixed bottom-4 left-4 z-[100] w-12 h-12 bg-black/30 backdrop-blur-sm rounded-full text-2xl flex items-center justify-center border border-white/20 hover:bg-white/20 transition"
            aria-label={isMuted ? "Activar sonido" : "Silenciar sonido"}
        >
            {isMuted ? '🔇' : '🔊'}
        </button>
    );
};

export default SoundToggle;
