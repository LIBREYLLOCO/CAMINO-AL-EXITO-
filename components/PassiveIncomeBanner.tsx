
import React from 'react';

interface PassiveIncomeBannerProps {
    amount: number;
    playerName: string;
}

const PassiveIncomeBanner: React.FC<PassiveIncomeBannerProps> = ({ amount, playerName }) => {
    return (
        <div className="fixed top-[15%] left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-700 to-green-500 text-white p-6 rounded-3xl font-black uppercase tracking-wider shadow-2xl z-[10000] w-[90%] max-w-md text-center border-4 border-green-400"
             style={{ animation: 'bounceIn 0.5s' }}>
            <div className="text-4xl mb-2">💸</div>
            <div className="text-xs opacity-80">{playerName}, ¡VUELTA COMPLETA!</div>
            <div>COBRASTE TU INGRESO PASIVO</div>
            <div className="text-4xl text-yellow-300 mt-2">${amount.toLocaleString()}</div>
        </div>
    );
};

export default PassiveIncomeBanner;