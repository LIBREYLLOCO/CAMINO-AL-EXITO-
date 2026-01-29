import React, { useState } from 'react';
import { Tile, Rewards } from '../../types';
import AnimatedDie from '../AnimatedDie';
import { playSound } from '../../utils/soundManager';

interface DiceEventModalProps {
    tile: Tile;
    onResolve: (rewards: Rewards) => void;
}

const DiceEventModal: React.FC<DiceEventModalProps> = ({ tile, onResolve }) => {
    const [dieValue, setDieValue] = useState<number | string>("🎲");
    const [resultText, setResultText] = useState("");
    const [rewards, setRewards] = useState<Rewards>({});
    const [isRolled, setIsRolled] = useState(false);
    const [isRolling, setIsRolling] = useState(false);

    const rollEventDie = () => {
        if (isRolling) return;
        playSound('diceRoll', 0.7);
        setIsRolling(true);
        setResultText("");

        setTimeout(() => {
            const d = Math.floor(Math.random() * 6) + 1;
            setDieValue(d);

            let r: Rewards = {};
            let text = "";
            const tileName = tile.n;

            if (tileName === "Restaurante" || tileName === "Demanda" || tileName === "Impuestos") {
                r = { money: -1000 * d };
                text = `Pagas $${(1000 * d).toLocaleString()}`;
            } else if (tileName === "Causa Social") {
                r = { money: 1000 * d };
                text = `Ganas $${(1000 * d).toLocaleString()} por tu buena causa.`;
            } else if (tileName === "Contaminación" || tileName === "Alerta de Pandemia") {
                r = { health: -d };
                text = `Pierdes ${d} de Salud`;
            } else if (tileName === "Casino") {
                r = { money: -1000 * d, happy: -d };
                text = `Pagas $${(1000 * d).toLocaleString()} y pierdes ${d} de Felicidad`;
            } else if (tileName === "Familia") {
                r = { money: 1000 * d, health: d };
                text = `Ganas $${(1000 * d).toLocaleString()} y ${d} de Salud`;
            }
            
            setRewards(r);
            setResultText(text);
            setIsRolled(true);
            setIsRolling(false);
        }, 1000);
    };

    const handleResolve = () => {
        playSound('uiClick', 0.3);
        onResolve(rewards);
    };

    return (
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-[2px] modal-active">
            <div className="glass w-full max-w-xs p-8 rounded-[2.5rem] text-center border-2 shadow-2xl">
                <h2 className="text-2xl font-black text-white uppercase italic mb-2">{tile.n}</h2>
                <p className="text-white/70 text-xs mb-6 font-bold">{tile.d}</p>
                <div className="bg-black/30 p-6 rounded-2xl mb-6 h-[116px] flex flex-col justify-center">
                    <AnimatedDie value={dieValue} isRolling={isRolling} />
                    <p className="text-[10px] uppercase font-bold text-white/50 mt-2 h-4">{resultText}</p>
                </div>
                {!isRolled ? (
                    <button onClick={rollEventDie} disabled={isRolling} className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase shadow-lg disabled:opacity-50">
                        {isRolling ? '...' : 'TIRAR DADO'}
                    </button>
                ) : (
                    <button onClick={handleResolve} className="w-full py-4 bg-yellow-500 text-slate-900 rounded-2xl font-black text-sm uppercase shadow-lg">ACEPTAR</button>
                )}
            </div>
        </div>
    );
};

export default DiceEventModal;