import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Player, Tile } from '../types';
import { mainBoard, ROUTE_LENGTH } from '../constants';
import PlayerToken from './PlayerToken';

interface GameBoardProps {
    players: Player[];
    currentPlayerIndex: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ players, currentPlayerIndex }) => {
    const [tileCoords, setTileCoords] = useState<{ [key: string]: { top: number, left: number, width: number, height: number } }>({});
    const boardRef = useRef<HTMLDivElement>(null);

    // Generar colores aleatorios para las casillas interiores una sola vez por montaje
    const innerTileColors = useMemo(() => {
        const vibrantColors = [
            '#ef4444', // Red
            '#f97316', // Orange
            '#eab308', // Yellow
            '#84cc16', // Lime
            '#10b981', // Emerald
            '#06b6d4', // Cyan
            '#3b82f6', // Blue
            '#6366f1', // Indigo
            '#8b5cf6', // Violet
            '#d946ef', // Fuchsia
            '#f43f5e'  // Rose
        ];
        return Array.from({ length: ROUTE_LENGTH }).map(() => 
            vibrantColors[Math.floor(Math.random() * vibrantColors.length)]
        );
    }, []);

    const getTileStyle = (tile: Tile) => {
        // Colores específicos para casillas exteriores para contraste con emojis
        switch (tile.t) {
            case 'ESQUINA': 
                // Gris oscuro azulado elegante para esquinas
                return { bg: '#1e293b', border: '#94a3b8' }; 
            case 'CARTA': 
                // Azul fuerte para Retos (⚡ Amarillo resalta bien)
                // Morado oscuro para Expertis (🧠 Rosa resalta bien)
                return tile.c === 'RETO' 
                    ? { bg: '#1d4ed8', border: '#60a5fa' } 
                    : { bg: '#581c87', border: '#c084fc' };
            case 'ENTRADA': 
                // Ámbar/Ocre oscuro para las entradas (resalta iconos variados)
                return { bg: '#78350f', border: '#facc15' }; 
            case 'DADO_EVENTO': 
                // Rojo rosado oscuro para eventos de azar
                return { bg: '#be123c', border: '#fb7185' }; 
            case 'MULTA': 
                // Rojo sangre para multas
                return { bg: '#7f1d1d', border: '#ef4444' }; 
            case 'BONUS': 
                // Verde bosque para bonus
                return { bg: '#065f46', border: '#34d399' }; 
            case 'RELAX': 
                // Verde azulado (Teal) relajante
                return { bg: '#115e59', border: '#2dd4bf' }; 
            default: 
                return { bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.1)' };
        }
    };

     useEffect(() => {
        if (!boardRef.current || (Object.keys(tileCoords).length > 0)) return;

        const calculateCoords = () => {
            if (!boardRef.current) return;
            const boardRect = boardRef.current.getBoundingClientRect();
            const coords: { [key: string]: { top: number, left: number, width: number, height: number } } = {};
            const tile_size_perc = 0.065; // 6.5% of board size

            // Main board tiles
            for (let i = 0; i < mainBoard.length; i++) {
                const tileEl = document.getElementById(`tile-${i}`);
                if (tileEl) {
                    const tileRect = tileEl.getBoundingClientRect();
                    coords[i.toString()] = {
                        top: tileRect.top - boardRect.top,
                        left: tileRect.left - boardRect.left,
                        width: tileRect.width,
                        height: tileRect.height
                    };
                }
            }
            
            // Inner route circular tiles
            const centerX = boardRect.width / 2;
            const centerY = boardRect.height / 2;
            const radius = boardRect.width * 0.28;
            const angleStep = (2 * Math.PI) / ROUTE_LENGTH;
            const startAngle = Math.PI * 1.2; // Start angle at bottom-left
            
            for (let i = 0; i < ROUTE_LENGTH; i++) {
                 const angle = startAngle + (i * angleStep);
                 const x = centerX + radius * Math.cos(angle);
                 const y = centerY + radius * Math.sin(angle);
                 coords[`inner-${i}`] = {
                    top: y,
                    left: x,
                    width: boardRect.width * tile_size_perc,
                    height: boardRect.height * tile_size_perc
                 }
            }

            setTileCoords(coords);
        }
        
        const timer = setTimeout(calculateCoords, 100);
        window.addEventListener('resize', () => setTileCoords({})); // Recalculate on resize
        
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', () => setTileCoords({}));
        }
    }, [tileCoords]);

    const renderTile = (i: number) => {
        let tIdx = -1;
        const r = Math.floor(i / 11);
        const c = i % 11;

        if (r === 10) tIdx = c;
        else if (c === 10) tIdx = 10 + (10 - r);
        else if (r === 0) tIdx = 20 + (10 - c);
        else if (c === 0) tIdx = 30 + r;

        // Main board tiles
        if (tIdx !== -1 && tIdx < mainBoard.length) {
            const tile = mainBoard[tIdx];
            const currentPlayer = players[currentPlayerIndex];
            const isHighlighted = !currentPlayer.inRoute && currentPlayer.actual.pos === tIdx;
            const colors = getTileStyle(tile);

            let classes = "tile-v relative";
            if (tile.t === "ESQUINA") classes += " tile-corner";
            if (isHighlighted) classes += " tile-highlight";

            const style: React.CSSProperties = {
                backgroundColor: isHighlighted ? undefined : colors.bg, 
                borderColor: isHighlighted ? 'currentColor' : colors.border,
            };

            // Allow overflow for Entrance arrows to stick out
            if (tile.t === 'ENTRADA') {
                style.overflow = 'visible';
                style.zIndex = 10; // Ensure arrow sits above neighbors
            }

            if (isHighlighted) {
                style.color = currentPlayer.color;
            }

            // Arrow logic for ENTRADA
            let arrowContent = null;
            if (tile.t === 'ENTRADA') {
                // Base class for the arrow
                let arrowClass = "absolute text-green-400 text-2xl font-black leading-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] animate-pulse z-20 pointer-events-none";
                
                // Determine direction and OUTWARD OFFSET (negative values)
                if (r === 0) { 
                    // Top row -> Arrow at bottom, points down, sticks out bottom
                    arrowClass += " -bottom-3 left-1/2 -translate-x-1/2 rotate-90";
                } else if (r === 10) { 
                    // Bottom row -> Arrow at top, points up, sticks out top
                    arrowClass += " -top-3 left-1/2 -translate-x-1/2 -rotate-90";
                } else if (c === 0) { 
                    // Left column -> Arrow at right, points right, sticks out right
                    arrowClass += " -right-3 top-1/2 -translate-y-1/2";
                } else if (c === 10) { 
                    // Right column -> Arrow at left, points left, sticks out left
                    arrowClass += " -left-3 top-1/2 -translate-y-1/2 rotate-180";
                }
                arrowContent = <div className={arrowClass}>➜</div>;
            }
            
            return (
                <div key={`tile-grid-${i}`} id={`tile-${tIdx}`} className={classes} style={style}>
                    {arrowContent}
                    <span className="tile-icon" style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.6))' }}>{tile.i || ''}</span>
                    <span className="tile-name" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>{tile.n.toUpperCase()}</span>
                </div>
            );
        }
        
        // Empty space
        return <div key={`tile-grid-${i}`} />;
    };
    
    // Group players by their current tile to handle offsets
    const playerPositions: { [key: string]: Player[] } = {};
    players.forEach(p => {
        const key = p.inRoute 
            ? `inner-${(p.rSteps - 1)}`
            : p.actual.pos.toString();
        if (!playerPositions[key]) {
            playerPositions[key] = [];
        }
        playerPositions[key].push(p);
    });

    const renderInnerTiles = () => {
        if (Object.keys(tileCoords).length === 0) return null;
        
        const currentPlayer = players[currentPlayerIndex];

        return Array.from({ length: ROUTE_LENGTH }).map((_, i) => {
            const posKey = `inner-${i}`;
            const coords = tileCoords[posKey];
            if (!coords) return null;

            const isInnerHighlighted = currentPlayer.inRoute && (currentPlayer.rSteps - 1) === i;
            let classes = "tile-v tile-inner flex items-center justify-center";
            let content = null;

            if (i === 0) { 
                classes += ' tile-inner-start'; 
                content = <span className='font-black text-sm drop-shadow-md text-white'>IN</span>; 
            } else if (i === ROUTE_LENGTH - 1) { 
                classes += ' tile-inner-end'; 
                content = <span className='font-black text-sm drop-shadow-md text-white'>OUT</span>;
            }

            if (isInnerHighlighted) classes += " tile-highlight";
            
            const randomColor = innerTileColors[i];

            const style: React.CSSProperties = {
                top: `${coords.top}px`,
                left: `${coords.left}px`,
                width: `${coords.width}px`,
                height: `${coords.height}px`,
                backgroundColor: isInnerHighlighted ? undefined : randomColor,
                borderColor: isInnerHighlighted ? 'currentColor' : 'rgba(255,255,255,0.4)',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
            };
            if (isInnerHighlighted) {
                style.color = currentPlayer.color;
            }

            return (
                <div key={`tile-inner-${i}`} id={`tile-inner-${i}`} className={classes} style={style}>
                    {content}
                </div>
            );
        });
    }

    return (
        <div ref={boardRef} id="game-board-container" className="grid grid-cols-11 grid-rows-11 gap-0.5 p-1 rounded-xl bg-black/40 border border-white/5 shadow-2xl w-full h-full relative">
            <div className="board-center-gradient"></div>
            {Array.from({ length: 121 }).map((_, i) => renderTile(i))}

            {renderInnerTiles()}
            
            {Object.keys(tileCoords).length > 0 && Object.entries(playerPositions).map(([posKey, playersOnTile]) => {
                const coords = tileCoords[posKey];
                if (!coords) return null;

                return playersOnTile.map((p, playerIndexOnTile) => (
                    <PlayerToken
                        key={p.id}
                        player={p}
                        index={playerIndexOnTile}
                        isCurrent={p.id === currentPlayerIndex}
                        top={coords.top}
                        left={coords.left}
                        tileWidth={coords.width}
                        tileHeight={coords.height}
                    />
                ));
            })}
        </div>
    );
};

export default GameBoard;