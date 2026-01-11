
import React, { useState } from 'react';
import { Tile } from '../../types';
import AnimatedDie from '../AnimatedDie';

interface HospitalModalProps {
    tile: Tile;
    onResolve: (result: { cost: number, health: number, happy: number }) => void;
}

const HospitalModal: React.FC<HospitalModalProps> = ({ tile, onResolve }) => {
    const isHospital = tile.n === 'HOSPITAL';
    const [dieValue, setDieValue] = useState<number | string>("🎲");
    const [isRolled, setIsRolled] = useState(false);
    const [isRolling, setIsRolling] = useState(false);
    const [cost, setCost] = useState(0);
    const [gain, setGain] = useState(0);

    const rollDie = () => {
        if (isRolling) return;
        setIsRolling(true);

        setTimeout(() => {
            const d = Math.floor(Math.random() * 6) + 1;
            setDieValue(d);
            setCost(1000 * d);
            setGain(d);
            setIsRolled(true);
            setIsRolling(false);
        }, 1000);
    };

    const handleConfirm = () => {
        onResolve({
            cost,
            health: isHospital ? gain : 0,
            happy: !isHospital ? gain : 0,
        });
    };

    const title = isHospital ? "🏥 HOSPITAL" : "🏖️ VACACIONES";
    const description = tile.d;
    const costText = `COSTO: $1,000 x PUNTO`;
    const gainText = isHospital ? "GANAS: 1 Salud x PUNTO" : "GANAS: 1 Felicidad x PUNTO";
    const buttonText = isRolled ? `PAGAR $${cost.toLocaleString()}` : "TIRAR DADO";
    const borderColor = isHospital ? 'border-red-500' : 'border-blue-400';
    const buttonBg = isHospital ? 'bg-red-600' : 'bg-blue-600';

    return (
        <div className={`fixed inset-0 flex items-center justify-center p-6 backdrop-blur-md modal-active ${isHospital ? 'bg-red-900/95' : 'bg-blue-900/95'}`}>
            <div className={`glass w-full max-w-xs p-8 rounded-[2.5rem] text-center border-2 shadow-2xl ${borderColor}`}>
                <h2 className="text-3xl font-black text-white uppercase italic mb-2">{title}</h2>
                <p className="text-white/70 text-xs mb-6 font-bold">{description}</p>
                <div className="bg-black/30 p-6 rounded-2xl mb-6">
                    <AnimatedDie value={dieValue} isRolling={isRolling} />
                    <p className="text-[10px] uppercase font-bold text-white/50 mt-2">{costText}</p>
                    <p className="text-[10px] uppercase font-bold text-green-400 mt-1">{gainText}</p>
                </div>
                {!isRolled ? (
                    <button onClick={rollDie} disabled={isRolling} className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase shadow-lg disabled:opacity-50">
                         {isRolling ? '...' : 'TIRAR DADO'}
                    </button>
                ) : (
                    <button onClick={handleConfirm} className={`w-full py-4 ${buttonBg} text-white rounded-2xl font-black text-sm uppercase shadow-lg`}>
                        {buttonText}
                    </button>
                )}
            </div>
        </div>
    );
};

export default HospitalModal;