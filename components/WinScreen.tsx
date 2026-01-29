import React, { Dispatch, useState } from 'react';
import { Player } from '../types';
import { Action } from '../state/gameReducer';
import PlayerStatusCard from './PlayerStatusCard';
import { playSound } from '../utils/soundManager';
import { GoogleGenAI, Type } from "@google/genai";

interface WinScreenProps {
    winner: Player;
    allPlayers: Player[];
    dispatch: Dispatch<Action>;
}

interface AIAnalysisResult {
    mentor: string;
    archetype: string; // El título del mentor (ej. "El Visionario", "La Filósofa")
    advice: string;
    quote: string;
}

const MENTORS = [
    "Napoleon Hill", "Steve Jobs", "Oprah Winfrey", "Warren Buffett", 
    "Albert Einstein", "Frida Kahlo", "Walt Disney", "Maya Angelou",
    "Leonardo da Vinci", "Marie Curie", "Nelson Mandela", "Coco Chanel",
    "Bruce Lee", "Mahatma Gandhi", "Nikola Tesla", "Serena Williams"
];

const Firework: React.FC<{ left: string; top: string; delay?: string }> = ({ left, top, delay }) => (
    <div className="firework" style={{ left, top, animationDelay: delay }} />
);

const WinScreen: React.FC<WinScreenProps> = ({ winner, allPlayers, dispatch }) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const calculateSuccess = (p: Player): number => {
        const m = Math.min(Math.floor(p.actual.money / 1000), p.metas.d);
        const h = Math.min(p.actual.health, p.metas.s);
        const ha = Math.min(p.actual.happy, p.metas.h);
        return p.metas.t + m + h + ha;
    }

    const otherPlayers = allPlayers
        .filter(p => p.id !== winner.id)
        .sort((a, b) => calculateSuccess(b) - calculateSuccess(a));
    
    const midPoint = Math.ceil(otherPlayers.length / 2);
    const leftPlayers = otherPlayers.slice(0, midPoint);
    const rightPlayers = otherPlayers.slice(midPoint);

    const handleReset = () => {
        playSound('uiClick', 0.4);
        dispatch({ type: 'RESET_GAME' });
    }

    const analyzeGame = async () => {
        if (isAnalyzing) return;
        setIsAnalyzing(true);
        playSound('uiClick', 0.3);
        setError(null);

        // Seleccionar un mentor aleatorio de la lista
        const selectedMentor = MENTORS[Math.floor(Math.random() * MENTORS.length)];

        try {
            const apiKey = process.env.API_KEY;

            if (!apiKey) {
                // Simulación para demos sin API KEY
                setTimeout(() => {
                    setAiResult({
                        mentor: selectedMentor,
                        archetype: "Consejero Invisible",
                        advice: `He observado tu juego, ${winner.name}. Has logrado un equilibrio que pocos alcanzan. Tu riqueza es notable, pero no has sacrificado tu esencia.`,
                        quote: "Lo que la mente del hombre puede concebir y creer, puede lograrse."
                    });
                    setIsAnalyzing(false);
                    playSound('turnStart', 0.5);
                }, 2500);
                return;
            }

            const ai = new GoogleGenAI({ apiKey });
            
            const prompt = `Actúa como el 'Consejero Invisible' (del concepto de Napoleon Hill). 
            Personalidad: ${selectedMentor}.

            Analiza al ganador del juego 'Camino al Éxito': ${winner.name}.
            
            Datos Finales:
            - Dinero: $${(winner.actual.money / 1000).toFixed(1)}k (Meta: ${winner.metas.d}k)
            - Salud: ${winner.actual.health} (Meta: ${winner.metas.s})
            - Felicidad: ${winner.actual.happy} (Meta: ${winner.metas.h})
            - Ingreso Pasivo: $${winner.actual.passive}
            - Rutas: ${winner.visitedRoutes.join(', ') || 'General'}.

            IMPORTANTE: Sé muy breve y directo.
            
            Responde JSON:
            1. 'mentor': "${selectedMentor}".
            2. 'archetype': Título corto (ej. "El Visionario").
            3. 'advice': Consejo breve (max 2 frases) inspirado en tu filosofía.
            4. 'quote': Tu frase célebre o una inventada en tu estilo (corta).`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: {
                    thinkingConfig: { thinkingBudget: 0 }, // Desactivar pensamiento profundo para velocidad máxima
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            mentor: { type: Type.STRING },
                            archetype: { type: Type.STRING },
                            advice: { type: Type.STRING },
                            quote: { type: Type.STRING }
                        }
                    }
                }
            });

            const text = response.text;
            if (text) {
                const result = JSON.parse(text);
                setAiResult(result);
                playSound('turnStart', 0.5);
            } else {
                throw new Error("No response");
            }

        } catch (e) {
            console.error("AI Error", e);
            setAiResult({
                mentor: "El Oráculo",
                archetype: "Voz Interior",
                advice: "El camino al éxito es personal y único. Hoy has demostrado que tienes la fórmula correcta.",
                quote: "Conócete a ti mismo y ganarás mil batallas."
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-center p-6 overflow-y-auto custom-scroll modal-active">
            <div className="absolute inset-0 opacity-50 pointer-events-none">
                <Firework left="20%" top="30%" />
                <Firework left="80%" top="20%" delay="0.5s" />
                <Firework left="50%" top="50%" delay="0.2s" />
                <Firework left="30%" top="70%" delay="0.7s" />
                <Firework left="70%" top="60%" delay="0.4s" />
            </div>
            
            <div className="z-10 animate__animated animate__zoomInDown relative w-full pt-8 pb-10 max-w-6xl mx-auto">
                <div className="text-9xl mb-4">🏆</div>
                <h1 className="text-6xl font-black text-yellow-500 mb-2 drop-shadow-[0_0_20px_rgba(241,196,15,0.8)]">¡VICTORIA!</h1>
                <h2 className="text-4xl text-white font-bold mb-6 uppercase italic" style={{ color: winner.color }}>{winner.name}</h2>
                <p className="text-gray-300 uppercase tracking-widest text-sm mb-12 max-w-md mx-auto leading-relaxed">
                    Has dominado el arte de "Piense y Hágase Rico".
                </p>
                
                <div className="w-full mb-10">
                    <h3 className="text-2xl font-bold uppercase tracking-widest text-gray-400 mb-6">Resultados Finales</h3>
                    <div className="flex flex-wrap items-center justify-center gap-4 px-4">
                        {leftPlayers.map(p => (
                             <PlayerStatusCard key={p.id} player={p} isCurrent={false} />
                        ))}
                        
                        <div className="transform scale-110 my-4 md:my-0 z-10 order-first md:order-none shadow-[0_0_40px_rgba(255,255,255,0.2)] rounded-xl">
                             <PlayerStatusCard player={winner} isCurrent={true} />
                        </div>

                        {rightPlayers.map(p => (
                             <PlayerStatusCard key={p.id} player={p} isCurrent={false} />
                        ))}
                    </div>
                </div>

                {/* AI Advisor Section */}
                <div className="max-w-2xl mx-auto mb-10 min-h-[160px]">
                    {!aiResult && !isAnalyzing && (
                        <button 
                            onClick={analyzeGame}
                            className="group relative px-8 py-5 bg-gradient-to-r from-slate-800 to-black border border-yellow-500/50 rounded-2xl font-black text-yellow-400 uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:scale-105 hover:shadow-[0_0_40px_rgba(234,179,8,0.4)] transition-all overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-3 text-sm md:text-base">
                                <span className="text-2xl">👻</span> Consultar a mi Consejero Invisible
                            </span>
                            <div className="absolute inset-0 bg-yellow-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                        </button>
                    )}

                    {isAnalyzing && (
                        <div className="flex flex-col items-center justify-center gap-4 animate-pulse">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center text-2xl">✨</div>
                            </div>
                            <p className="text-yellow-200/70 font-bold uppercase text-xs tracking-widest">Invocando al espíritu del mentor...</p>
                        </div>
                    )}

                    {aiResult && (
                        <div className="glass-dark p-8 rounded-3xl border border-yellow-500/30 text-left animate__animated animate__fadeInUp relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 text-8xl">❝</div>
                            
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
                                    <div className="bg-yellow-500/20 p-2 rounded-full text-2xl">🎓</div>
                                    <div>
                                        <h3 className="text-xl font-black text-yellow-400 uppercase leading-none">{aiResult.mentor}</h3>
                                        <p className="text-[10px] text-white/50 uppercase tracking-widest">{aiResult.archetype} • Consejero Invisible</p>
                                    </div>
                                </div>

                                <p className="text-lg md:text-xl text-white/90 font-light italic leading-relaxed mb-6">
                                    "{aiResult.advice}"
                                </p>

                                <div className="bg-white/5 p-4 rounded-xl border-l-4 border-yellow-500">
                                    <p className="text-sm font-bold text-yellow-200/80 uppercase mb-1">Cita del Mentor</p>
                                    <p className="text-white italic">"{aiResult.quote}"</p>
                                </div>
                                
                                <p className="mt-4 text-[8px] text-white/20 text-center uppercase tracking-wider">
                                    Nota: Esta opinión es generada por Inteligencia Artificial simulando el estilo del mentor, no es una cita real de la persona.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-center">
                    <button onClick={handleReset} className="bg-white text-black px-12 py-5 rounded-full font-black text-xl uppercase shadow-[0_0_50px_rgba(255,255,255,0.5)] hover:scale-110 hover:shadow-[0_0_80px_rgba(255,255,255,0.8)] transition transform cursor-pointer">
                        Volver a Jugar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WinScreen;