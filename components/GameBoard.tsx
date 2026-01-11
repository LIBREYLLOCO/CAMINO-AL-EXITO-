
import React from 'react';
import { Player } from '../types';
import { mainBoard, innerRouteTiles } from '../constants';
import PlayerToken from './PlayerToken';

interface GameBoardProps {
    players: Player[];
    currentPlayerIndex: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ players, currentPlayerIndex }) => {
    
    const renderTile = (i: number) => {
        let tIdx = -1;
        const r = Math.floor(i / 11);
        const c = i % 11;

        if (r === 10) tIdx = c;
        else if (c === 10) tIdx = 10 + (10 - r);
        else if (r === 0) tIdx = 20 + (10 - c);
        else if (c === 0) tIdx = 30 + r;

        const currentPlayer = players[currentPlayerIndex];
        
        // Main board tiles
        if (tIdx !== -1 && tIdx < mainBoard.length) {
            const tile = mainBoard[tIdx];
            const isHighlighted = !currentPlayer.inRoute && currentPlayer.actual.pos === tIdx;
            let classes = "tile-v relative";
            if (tile.t === "ESQUINA") classes += " tile-corner";
            if (isHighlighted) classes += " tile-highlight";

            const style: React.CSSProperties = {};
            if (isHighlighted) {
                style.color = currentPlayer.color; // For the 'currentColor' in highlight styles
            } else {
                if (tile.t === "ENTRADA") style.borderColor = "#facc15";
                if (tile.t === "MULTA") style.borderColor = "#ef4444";
            }
            
            return (
                <div key={i} id={`tile-${tIdx}`} className={classes} style={style}>
                    <span className="tile-icon">{tile.i || ''}</span>
                    <span className="tile-name">{tile.n.toUpperCase()}</span>
                    {players.map((p, idx) => !p.inRoute && p.actual.pos === tIdx && <PlayerToken key={p.id} player={p} index={idx} isCurrent={idx === currentPlayerIndex} />)}
                </div>
            );
        }
        
        // Inner route tiles
        if (innerRouteTiles.includes(i)) {
            const stepIdx = innerRouteTiles.indexOf(i);
            const isInnerHighlighted = currentPlayer.inRoute && (currentPlayer.rSteps - 1) % innerRouteTiles.length === stepIdx;
            
            let classes = "tile-v tile-inner relative";
            let content = null;
            if (stepIdx === 0) { 
                classes += ' tile-inner-start'; 
                content = <span className='font-black'>IN</span>; 
            } else if (stepIdx === innerRouteTiles.length - 1) { 
                classes += ' tile-inner-end'; 
                content = <span className='font-black'>OUT</span>;
            }

            if (isInnerHighlighted) classes += " tile-highlight";
            const style: React.CSSProperties = {};
             if (isInnerHighlighted) {
                style.color = currentPlayer.color;
            }

            return (
                <div key={i} id={`tile-inner-${stepIdx + 1}`} className={classes} style={style}>
                    {content}
                     {players.map((p, idx) => p.inRoute && (p.rSteps - 1) % innerRouteTiles.length === stepIdx && <PlayerToken key={p.id} player={p} index={idx} isCurrent={idx === currentPlayerIndex} />)}
                </div>
            );
        }

        // Empty space
        return <div key={i} />;
    };

    return (
        <div id="game-board-container" className="grid grid-cols-11 grid-rows-11 gap-0.5 p-1 rounded-xl bg-black/40 border border-white/5 shadow-2xl w-[95vmin] h-[95vmin] max-w-[680px] max-h-[680px] relative">
            {Array.from({ length: 121 }).map((_, i) => renderTile(i))}
        </div>
    );
};

export default GameBoard;
