import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Player } from '../types';
import { pColors, pIcons } from '../constants';
import { playSound } from '../utils/soundManager';

interface SetupScreenProps {
    playerIndex: number;
    totalPlayers: number;
    onSave: (player: Omit<Player, 'id'>) => void;
    existingNames: string[];
    usedColors: string[];
    usedIcons: string[];
}

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ playerIndex, totalPlayers, onSave, existingNames, usedColors, usedIcons }) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [money, setMoney] = useState(0);
    const [health, setHealth] = useState(0);
    const [happy, setHappy] = useState(0);
    const [color, setColor] = useState(pColors[0]);
    const [icon, setIcon] = useState(pIcons[0]);
    const [timePoints, setTimePoints] = useState(0);
    const [total, setTotal] = useState(0);
    const [isValid, setIsValid] = useState(false);
    const [nameError, setNameError] = useState<string | null>(null);
    
    const prevNameError = usePrevious(nameError);

    const updateTotals = useCallback(() => {
        const ageNum = parseInt(age) || 0;
        const tPts = ageNum > 60 ? 15 : ageNum >= 41 ? 20 : ageNum >= 21 ? 25 : ageNum > 0 ? 30 : 0;
        setTimePoints(tPts);
        const currentTotal = tPts + money + health + happy;
        setTotal(currentTotal);

        const cleanName = name.trim().toUpperCase();
        const currentInitials = cleanName.substring(0, 2);
        
        // Validation: Check for duplicate initials or duplicate full names
        let nameValid = true;
        let errorMsg = null;

        if (cleanName.length < 2) {
            nameValid = false;
        } else {
            const isDuplicate = existingNames.some(existing => {
                const existingInitials = existing.trim().substring(0, 2).toUpperCase();
                return existingInitials === currentInitials;
            });

            if (isDuplicate) {
                nameValid = false;
                errorMsg = "¡Iniciales repetidas! Usa otro nombre o apodo.";
            }
        }
        
        setNameError(errorMsg);

        const valid = currentTotal === 100 && health >= 10 && happy >= 10 && nameValid && money <= 80;
        setIsValid(valid);
    }, [age, money, health, happy, name, existingNames]);

    useEffect(() => {
        updateTotals();
    }, [name, age, money, health, happy, updateTotals]);
    
    // Effect to play sound when name error appears
    useEffect(() => {
        if (nameError && !prevNameError) {
            playSound('error', 0.4);
        }
    }, [nameError, prevNameError]);
    
    useEffect(() => {
        // Reset form for new player
        setName('');
        setAge('');
        setMoney(0);
        setHealth(0);
        setHappy(0);
        setNameError(null);
        
        // Find the next available color and icon
        const availableColor = pColors.find(c => !usedColors.includes(c));
        setColor(availableColor || pColors[playerIndex % pColors.length]);
        const availableIcon = pIcons.find(i => !usedIcons.includes(i));
        setIcon(availableIcon || pIcons[playerIndex % pIcons.length]);
    }, [playerIndex, usedColors, usedIcons]);


    const autoBalanceSetup = () => {
        const ageNum = parseInt(age) || 0;
        if (ageNum <= 0) return;
        const tPts = ageNum > 60 ? 15 : ageNum >= 41 ? 20 : ageNum >= 21 ? 25 : ageNum > 0 ? 30 : 0;
        let remaining = 100 - tPts;
        const minS = 10, minH = 10, maxM = 80;
        remaining -= (minS + minH);
        let m_add = Math.floor(Math.random() * (remaining + 1));
        if (m_add > maxM) m_add = maxM;
        let left = remaining - m_add;
        let s_add = Math.floor(Math.random() * (left + 1));
        let h_add = left - s_add;
        setMoney(m_add);
        setHealth(minS + s_add);
        setHappy(minH + h_add);
    };

    const handleSave = () => {
        if (!isValid) return;
        playSound('uiClick', 0.4);
        onSave({
            name: name.trim().toUpperCase(),
            color: color,
            icon: icon,
            metas: { t: timePoints, d: money, s: health, h: happy },
            actual: { pos: 0, money: 5000, health: 0, happy: 0, passive: 5000 },
            inRoute: false, rId: null, rSteps: 0, visitedRoutes: [],
            laps: 0 // Initialize laps
        });
    };
    
    const getDiffMessage = () => {
        if (total === 100) return <p className="text-xs font-bold text-green-400 uppercase mb-4 h-4">¡PERFECTO!</p>;
        if (total < 100) return <p className="text-xs font-bold text-yellow-400 uppercase mb-4 h-4">{`FALTAN ${100 - total}`}</p>;
        return <p className="text-xs font-bold text-red-400 uppercase mb-4 h-4">{`SOBRAN ${total - 100}`}</p>;
    };

    return (
        <div id="screen-setup" className="fixed inset-0 z-50 bg-slate-900 flex flex-col p-6 overflow-y-auto custom-scroll">
            <span id="setup-tag" className="bg-white text-black font-black py-1 px-4 rounded-full text-[10px] self-start mb-4 uppercase italic">{`JUGADOR ${playerIndex + 1} DE ${totalPlayers}`}</span>
            <h2 className="text-3xl font-black mb-6 italic uppercase leading-none text-white">Tu Fórmula<br /><span className="text-yellow-400">Personal</span></h2>
            <div className="space-y-6 flex-grow">
                <div>
                    <label className="text-[10px] text-white/50 font-black uppercase mb-1 block">Nombre (Se usarán las 2 primeras letras)</label>
                    <input value={name} onChange={e => setName(e.target.value)} type="text" maxLength={12} className={`w-full bg-white/10 p-4 rounded-2xl border ${nameError ? 'border-red-500 animate-pulse' : 'border-white/10'} font-black uppercase text-white outline-none focus:border-yellow-500 transition text-xl`} />
                    {nameError && <p className="text-red-400 text-[10px] font-bold mt-1 uppercase">{nameError}</p>}
                </div>
                <div>
                    <label className="text-[10px] text-white/50 font-black uppercase mb-1 block">Edad (Auto-Fórmula)</label>
                    <input value={age} onChange={e => setAge(e.target.value)} onBlur={autoBalanceSetup} type="number" className="w-full bg-white/10 p-4 rounded-2xl border border-white/10 font-bold outline-none text-white text-xl placeholder-white/20" placeholder="Ej. 25" />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-[10px] text-white/50 font-black uppercase mb-2 block">Elige tu Color</label>
                        <div className="grid grid-cols-4 gap-3">
                            {pColors.slice(0, 8).map(c => {
                                const isUsed = usedColors.includes(c);
                                return <button key={c} type="button" onClick={() => !isUsed && setColor(c)} disabled={isUsed} className={`relative w-full h-10 rounded-full transition-all transform focus:outline-none ${isUsed ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'} ${color === c ? 'ring-4 ring-offset-2 ring-offset-slate-900 ring-white' : 'ring-2 ring-transparent'}`} style={{ backgroundColor: c }} aria-label={`Color ${c}`} />;
                            })}
                        </div>
                    </div>
                     <div>
                        <label className="text-[10px] text-white/50 font-black uppercase mb-2 block">Elige tu Ficha</label>
                        <div className="grid grid-cols-5 gap-2">
                            {pIcons.map(i => {
                                const isUsed = usedIcons.includes(i);
                                return <button key={i} type="button" onClick={() => !isUsed && setIcon(i)} disabled={isUsed} className={`relative glass rounded-lg text-2xl transition-all transform flex items-center justify-center h-10 ${isUsed ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 hover:bg-white/10'} ${icon === i ? 'ring-4 ring-offset-2 ring-offset-slate-900 ring-white' : 'ring-2 ring-transparent'}`} aria-label={`Icono ${i}`}>{i}</button>;
                            })}
                        </div>
                    </div>
                </div>
                <div className="p-4 glass rounded-2xl flex justify-between items-center border-l-4 border-blue-400">
                    <span className="text-blue-300 font-black text-xs italic uppercase">Puntos Tiempo:</span>
                    <span className="text-2xl font-black">{timePoints}</span>
                </div>
                <div className="space-y-5 pt-2">
                    <div><div className="flex justify-between text-xs font-black uppercase mb-2 text-yellow-400">💰 Dinero ($80k Max) <span className="text-lg">{money}</span></div><input type="range" min="0" max="80" value={money} onChange={e => setMoney(parseInt(e.target.value))} /></div>
                    <div><div className="flex justify-between text-xs font-black uppercase mb-2 text-red-400">❤️ Salud (Min 10) <span className="text-lg">{health}</span></div><input type="range" min="0" max="80" value={health} onChange={e => setHealth(parseInt(e.target.value))} /></div>
                    <div><div className="flex justify-between text-xs font-black uppercase mb-2 text-orange-400">😊 Felicidad (Min 10) <span className="text-lg">{happy}</span></div><input type="range" min="0" max="80" value={happy} onChange={e => setHappy(parseInt(e.target.value))} /></div>
                </div>
            </div>
            <div className="mt-4 p-5 glass rounded-t-3xl border-t border-white/20 text-center">
                <div className="mb-2"><span className={`text-5xl font-black ${total === 100 ? 'text-green-400' : total > 100 ? 'text-red-400' : 'text-white'}`}>{total}</span><span className="text-lg opacity-50">/100</span></div>
                {getDiffMessage()}
                <button disabled={!isValid} onClick={handleSave} className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${isValid ? 'bg-yellow-500 text-black shadow-xl animate-pulse cursor-pointer hover:bg-yellow-400' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}>Siguiente</button>
            </div>
        </div>
    );
};

export default SetupScreen;