
import React, { useState, useEffect, useReducer } from 'react';
import { GameState, GameStatus, Player, ModalPayload } from './types';
import StartScreen from './components/StartScreen';
import SetupScreen from './components/SetupScreen';
import GameScreen from './components/GameScreen';
import WinScreen from './components/WinScreen';
import TurnOverlay from './components/TurnOverlay';
import InfoTileModal from './components/modals/InfoTileModal';
import RouteModal from './components/modals/RouteModal';
import CardModal from './components/modals/CardModal';
import DiceEventModal from './components/modals/DiceEventModal';
import HospitalModal from './components/modals/HospitalModal';
import { gameReducer, initialState } from './state/gameReducer';
import { mainBoard } from './constants';

const App: React.FC = () => {
    const [state, dispatch] = useReducer(gameReducer, initialState);
    const { gameStatus, players, setupPlayerIndex, totalPlayers, currentPlayerIndex, activeModal, showTurnOverlay, winner } = state;

    const handleStartSetup = (playerCount: number) => {
        dispatch({ type: 'START_SETUP', payload: playerCount });
    };

    const handleSavePlayer = (player: Omit<Player, 'id'>) => {
        dispatch({ type: 'SAVE_PLAYER', payload: player });
    };

    const renderModal = () => {
        if (!activeModal) return null;

        const p = players[currentPlayerIndex];
        if (!p) return null;

        switch (activeModal.type) {
            case 'INFO_TILE':
                return <InfoTileModal tile={activeModal.payload} onClose={() => dispatch({ type: 'SHOW_EVENT_CONTENT' })} />;
            case 'ROUTE':
                return <RouteModal tile={activeModal.payload} player={p} onDecision={(decision) => dispatch({ type: 'DECIDE_ROUTE', payload: decision })} />;
            case 'CARD':
                return <CardModal card={activeModal.payload.card} category={activeModal.payload.category} onResolve={(success) => dispatch({ type: 'RESOLVE_CARD', payload: success })} />;
            case 'DICE_EVENT':
                return <DiceEventModal tile={activeModal.payload} onResolve={(rewards) => dispatch({ type: 'RESOLVE_DICE_EVENT', payload: rewards })} />;
            case 'HOSPITAL':
                 return <HospitalModal tile={activeModal.payload} onResolve={(result) => dispatch({ type: 'RESOLVE_HOSPITAL', payload: result })} />;
            default:
                return null;
        }
    };
    
    return (
        <>
            {gameStatus === GameStatus.Start && <StartScreen onStart={handleStartSetup} />}
            {gameStatus === GameStatus.Setup && (
                <SetupScreen
                    playerIndex={setupPlayerIndex}
                    totalPlayers={totalPlayers}
                    onSave={handleSavePlayer}
                    existingNames={players.map(p => p.name)}
                    usedColors={players.map(p => p.color)}
                    usedIcons={players.map(p => p.icon)}
                />
            )}
            {gameStatus === GameStatus.Playing && <GameScreen state={state} dispatch={dispatch} />}
            {gameStatus === GameStatus.Win && winner && <WinScreen winner={winner} allPlayers={players} dispatch={dispatch} />}
            
            {showTurnOverlay && players[currentPlayerIndex] && (
                <TurnOverlay 
                    player={players[currentPlayerIndex]} 
                    onStartTurn={() => dispatch({ type: 'START_TURN' })} 
                    dispatch={dispatch}
                />
            )}
            {renderModal()}
        </>
    );
};

export default App;