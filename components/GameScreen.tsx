import React, { Dispatch, useEffect, useRef } from 'react';
import { GameState } from '../types';
import { Action } from '../state/gameReducer';
import StatusSidebar from './StatusSidebar';
import MobileStatsBar from './MobileStatsBar';
import GameBoard from './GameBoard';
import Controls from './Controls';
import CurrentPlayerDisplay from './CurrentPlayerDisplay';
import PassiveIncomeBanner from './PassiveIncomeBanner';
import { mainBoard } from '../constants';
import BoardWrapper from './BoardWrapper';
import { playSound } from '../utils/soundManager';

interface GameScreenProps {
    state: GameState;
    dispatch: Dispatch<Action>;
}

const GameScreen: React.FC<GameScreenProps> = ({ state, dispatch }) => {
    const { players, currentPlayerIndex, pozo, dice, isRolling, passiveIncomeBanner, isMoving, moveDetails, isMovingInRoute, routeMoveDetails } = state;
    const currentPlayer = players[currentPlayerIndex];
    const isAnimating = useRef(false);

    useEffect(() => {
        if (passiveIncomeBanner?.visible) {
            // Aumentado a 5000ms (5 segundos) como se solicitó
            const timer = setTimeout(() => {
                dispatch({ type: 'HIDE_PASSIVE_INCOME_BANNER' });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [passiveIncomeBanner, dispatch]);

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
    
    useEffect(() => {
        if (!isMoving || !moveDetails || isAnimating.current) return;

        const animateMove = async () => {
            isAnimating.current = true;
            const { startPos, steps } = moveDetails;
            
            // Wait for the dice animation to snap to result (0.4s) + a little reading time (0.2s)
            await new Promise(resolve => setTimeout(resolve, 600));

            for (let i = 1; i <= steps; i++) {
                playSound('tokenMove', 0.2);
                const nextPos = (startPos + i) % mainBoard.length;
                dispatch({ type: 'UPDATE_PLAYER_POSITION', payload: nextPos });
                await new Promise(resolve => setTimeout(resolve, 300));
            }
            dispatch({ type: 'FINISH_MOVE' });
            isAnimating.current = false;
        };

        animateMove();
    }, [isMoving, moveDetails, dispatch]);

    useEffect(() => {
        if (!isMovingInRoute || !routeMoveDetails || isAnimating.current) return;

        const animateRouteMove = async () => {
            isAnimating.current = true;
            const { startStep, steps } = routeMoveDetails;

            // Wait for the dice animation to snap to result (0.4s) + a little reading time (0.2s)
            await new Promise(resolve => setTimeout(resolve, 600));

            for (let i = 1; i <= steps; i++) {
                playSound('tokenMove', 0.2);
                const nextStep = startStep + i;
                dispatch({ type: 'UPDATE_PLAYER_ROUTE_STEP', payload: nextStep });
                await new Promise(resolve => setTimeout(resolve, 400)); // Slower animation
            }
            dispatch({ type: 'FINISH_ROUTE_MOVE' });
            isAnimating.current = false;
        };

        animateRouteMove();
    }, [isMovingInRoute, routeMoveDetails, dispatch]);

    return (
        <div id="screen-game" className="bg-slate-900 absolute inset-0">
            {passiveIncomeBanner?.visible && (
                <PassiveIncomeBanner
                    amount={passiveIncomeBanner.amount}
                    healthGain={passiveIncomeBanner.healthGain}
                    playerName={passiveIncomeBanner.playerName}
                    lap={passiveIncomeBanner.lap}
                />
            )}
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
                       
                        <BoardWrapper>
                            <div className="relative w-[95vmin] h-[95vmin] max-w-[680px] max-h-[680px]">
                                <GameBoard players={players} currentPlayerIndex={currentPlayerIndex} />
                                <CurrentPlayerDisplay player={currentPlayer} pozo={pozo} />
                            </div>
                        </BoardWrapper>
                    </div>

                    <Controls 
                        dice={dice} 
                        isRolling={isRolling}
                        disabled={isRolling || isMoving || isMovingInRoute}
                        inRoute={currentPlayer.inRoute}
                        onRoll={() => dispatch({ type: 'ROLL_DICE' })} 
                    />
                </div>
            </div>
        </div>
    );
};

export default GameScreen;