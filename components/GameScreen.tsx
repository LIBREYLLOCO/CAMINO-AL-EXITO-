
import React, { Dispatch, useEffect } from 'react';
import { GameState } from '../types';
import { Action } from '../state/gameReducer';
import StatusSidebar from './StatusSidebar';
import MobileStatsBar from './MobileStatsBar';
import GameBoard from './GameBoard';
import Controls from './Controls';
import CurrentPlayerDisplay from './CurrentPlayerDisplay';
import PassiveIncomeBanner from './PassiveIncomeBanner';

interface GameScreenProps {
    state: GameState;
    dispatch: Dispatch<Action>;
}

const GameScreen: React.FC<GameScreenProps> = ({ state, dispatch }) => {
    const { players, currentPlayerIndex, pozo, dice, isRolling, passiveIncomeBanner } = state;
    const currentPlayer = players[currentPlayerIndex];

    useEffect(() => {
        if (isRolling) {
            const timer = setTimeout(() => {
                const d1 = Math.floor(Math.random() * 6) + 1;
                const d2 = currentPlayer.inRoute ? 0 : Math.floor(Math.random() * 6) + 1;
                dispatch({ type: 'FINISH_ROLL', payload: { d1, d2 } });
            }, 1000); // Simulate rolling for 1 second

            return () => clearTimeout(timer);
        }
    }, [isRolling, dispatch, currentPlayer.inRoute]);

    return (
        <div id="screen-game" className="bg-slate-900 absolute inset-0">
            {passiveIncomeBanner?.visible && (
                <PassiveIncomeBanner
                    amount={passiveIncomeBanner.amount}
                    playerName={passiveIncomeBanner.playerName}
                />
            )}
             <button 
                onClick={() => dispatch({ type: 'END_GAME_EARLY' })}
                className="fixed bottom-6 left-6 z-50 bg-red-600 text-white font-black px-5 py-3 rounded-xl shadow-lg hover:bg-red-700 transition-colors text-base uppercase animate__animated animate__pulse animate__infinite"
                style={{ animationDuration: '2s' }}
            >
                Finalizar Partida
            </button>
            <div id="game-layout" className='flex h-screen w-screen overflow-hidden'>
                <StatusSidebar players={players} currentPlayerIndex={currentPlayerIndex} />

                <div id="main-area" className="flex-grow relative flex flex-col h-full">
                    <MobileStatsBar players={players} currentPlayerIndex={currentPlayerIndex} />

                    <div id="board-wrapper" className="flex-grow flex items-center justify-center overflow-hidden p-2.5 relative">
                        {currentPlayer.inRoute && (
                             <div className="absolute top-4 bg-yellow-500 text-black text-[10px] font-black px-4 py-2 rounded-full uppercase animate-bounce z-20 shadow-xl border-2 border-white">
                                🚧 Explorando: <span>{currentPlayer.rId}</span>
                            </div>
                        )}
                       
                        <GameBoard players={players} currentPlayerIndex={currentPlayerIndex} />
                        
                        <CurrentPlayerDisplay player={currentPlayer} pozo={pozo} />
                    </div>

                    <Controls 
                        dice={dice} 
                        isRolling={isRolling}
                        inRoute={currentPlayer.inRoute}
                        onRoll={() => dispatch({ type: 'ROLL_DICE' })} 
                    />
                </div>
            </div>
        </div>
    );
};

export default GameScreen;