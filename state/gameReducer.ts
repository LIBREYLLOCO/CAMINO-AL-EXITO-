import { GameState, GameStatus, Player, Tile, Rewards, Card } from '../types';
import { mainBoard, mazoReto, mazoExpertis, mazoRutas, routeCosts, pColors, ROUTE_LENGTH, HOSPITAL_COST_MULTIPLIER } from '../constants';

export type Action =
    | { type: 'SHOW_START_SCREEN' }
    | { type: 'START_SETUP'; payload: number }
    | { type: 'SAVE_PLAYER'; payload: Omit<Player, 'id'> }
    | { type: 'START_GAME' }
    | { type: 'SHOW_TURN_OVERLAY' }
    | { type: 'START_TURN' }
    | { type: 'ROLL_DICE' }
    | { type: 'FINISH_ROLL'; payload: { d1: number, d2: number } }
    | { type: 'DECIDE_ROUTE'; payload: boolean }
    | { type: 'RESOLVE_CARD'; payload: boolean }
    | { type: 'RESOLVE_DICE_EVENT', payload: Rewards }
    | { type: 'RESOLVE_HOSPITAL', payload: { cost: number, health: number, happy: number } }
    | { type: 'END_GAME_EARLY' }
    | { type: 'RESET_GAME' }
    | { type: 'UPDATE_PLAYER_POSITION'; payload: number }
    | { type: 'FINISH_MOVE' }
    | { type: 'UPDATE_PLAYER_ROUTE_STEP'; payload: number }
    | { type: 'FINISH_ROUTE_MOVE' }
    | { type: 'ADVANCE_TURN_PHASE' }
    | { type: 'HIDE_PASSIVE_INCOME_BANNER' };


export const initialState: GameState = {
    gameStatus: GameStatus.Intro,
    totalPlayers: 0,
    setupPlayerIndex: 0,
    players: [],
    currentPlayerIndex: 0,
    pozo: 0,
    activeModal: null,
    currentTile: null,
    showTurnOverlay: false,
    winner: null,
    dice: [0, 0],
    isRolling: false,
    passiveIncomeBanner: null,
    isMoving: false,
    moveDetails: null,
    isMovingInRoute: false,
    routeMoveDetails: null,
    isShowingStatChanges: false,
    turnPhase: 'IDLE',
};

function calculateSuccess(p: Player): number {
    const m = Math.min(Math.floor(p.actual.money / 1000), p.metas.d);
    const h = Math.min(p.actual.health, p.metas.s);
    const ha = Math.min(p.actual.happy, p.metas.h);
    return p.metas.t + m + h + ha;
}

// Helper to check for any stat changes
const statsChanged = (oldPlayer: Player, newPlayer: Player): boolean => {
    return oldPlayer.actual.money !== newPlayer.actual.money ||
           oldPlayer.actual.health !== newPlayer.actual.health ||
           oldPlayer.actual.happy !== newPlayer.actual.happy ||
           oldPlayer.actual.passive !== newPlayer.actual.passive;
}

export function gameReducer(state: GameState, action: Action): GameState {
    switch (action.type) {
        case 'RESET_GAME':
            return initialState;
        
        case 'SHOW_START_SCREEN':
            return {
                ...state,
                gameStatus: GameStatus.Start
            };

        case 'START_SETUP':
            return {
                ...initialState,
                gameStatus: GameStatus.Setup,
                totalPlayers: action.payload,
            };

        case 'SAVE_PLAYER':
            const newPlayer: Player = {
                ...action.payload,
                id: state.setupPlayerIndex,
            };
            const nextSetupIndex = state.setupPlayerIndex + 1;
            const updatedPlayers = [...state.players, newPlayer];

            if (nextSetupIndex >= state.totalPlayers) {
                return {
                    ...state,
                    players: updatedPlayers,
                    gameStatus: GameStatus.Playing,
                    setupPlayerIndex: 0,
                    showTurnOverlay: true,
                };
            }
            return {
                ...state,
                players: updatedPlayers,
                setupPlayerIndex: nextSetupIndex,
            };

        case 'START_TURN':
            return { ...state, showTurnOverlay: false, turnPhase: 'IDLE' };

        case 'ROLL_DICE':
            return { ...state, isRolling: true, dice: [0,0], turnPhase: 'ROLLING' };

        case 'FINISH_ROLL': {
            const { d1, d2 } = action.payload;
            // FIX: Explicitly cast 'MOVING' to the correct TurnPhase type to prevent type widening to 'string'.
            const newState = { ...state, isRolling: false, dice: [d1, d2] as [number, number], turnPhase: 'MOVING' as GameState['turnPhase'] };
            const p = newState.players[newState.currentPlayerIndex];

            if (p.inRoute) {
                return {
                    ...newState,
                    isMovingInRoute: true,
                    routeMoveDetails: {
                        startStep: p.rSteps,
                        steps: d1,
                    },
                };
            } else {
                const move = d1 + d2;
                if (move === 0) { // No movement, end turn
                     return { ...state, turnPhase: 'TURN_END', showTurnOverlay: true, currentPlayerIndex: (state.currentPlayerIndex + 1) % state.players.length };
                }
                return {
                    ...newState,
                    isMoving: true,
                    moveDetails: {
                        startPos: p.actual.pos,
                        steps: move,
                    }
                };
            }
        }
        
        case 'UPDATE_PLAYER_POSITION': {
            const players = [...state.players];
            players[state.currentPlayerIndex].actual.pos = action.payload;
            return { ...state, players };
        }

        case 'FINISH_MOVE': {
            const players = [...state.players];
            let p = { ...players[state.currentPlayerIndex] };
            const startPos = state.moveDetails!.startPos;
            const endPos = p.actual.pos;
            let newState = { ...state };

            if (endPos < startPos) {
                // Completó una vuelta
                // Lógica: Vuelta 1 = 3 corazones (2+1). Vuelta 2 = 4 corazones (2+2).
                const newLaps = (p.laps || 0) + 1;
                p.laps = newLaps;
                
                const healthBonus = 2 + newLaps;

                const receivedPassive = p.actual.passive;
                
                p.actual.money += receivedPassive;
                p.actual.passive += 1000; // Incremento del pasivo base para la próxima
                p.actual.health += healthBonus;

                newState.passiveIncomeBanner = {
                    visible: true,
                    amount: receivedPassive,
                    healthGain: healthBonus,
                    playerName: p.name,
                    lap: newLaps
                };
            }

            players[state.currentPlayerIndex] = p;
            const currentTile = mainBoard[endPos];
            
            return {
                ...newState,
                players,
                isMoving: false,
                moveDetails: null,
                currentTile: currentTile,
                turnPhase: 'TILE_INFO',
                activeModal: { type: 'INFO_TILE', payload: currentTile },
            };
        }

        case 'UPDATE_PLAYER_ROUTE_STEP': {
            const players = [...state.players];
            players[state.currentPlayerIndex].rSteps = action.payload;
            return { ...state, players };
        }

        case 'FINISH_ROUTE_MOVE': {
            let newState = { ...state, isMovingInRoute: false, routeMoveDetails: null };
            const players = [...state.players];
            let p = { ...players[newState.currentPlayerIndex] };

            if (p.rSteps >= ROUTE_LENGTH) {
                const bonus = routeCosts[p.rId!] || 3000;
                p.inRoute = false;
                if (!p.visitedRoutes.includes(p.rId!)) {
                    p.visitedRoutes.push(p.rId!);
                }
                p.rSteps = 0;
                newState.activeModal = {
                    type: 'CARD',
                    payload: {
                        card: {
                            t: `Has salido de ${p.rId}.\nIngreso Pasivo: +$${bonus}\nVuelves al camino principal.`,
                            i: "🚩", c: "bg-yellow-100", r: { passive: bonus }
                        },
                        category: "RUTA COMPLETADA"
                    }
                };
            } else {
                const deck = mazoRutas[p.rId!];
                const card = deck[Math.floor(Math.random() * deck.length)];
                newState.activeModal = { type: 'CARD', payload: { card, category: `Ruta ${p.rId}` } };
            }

            players[newState.currentPlayerIndex] = p;
            return {...newState, players, turnPhase: 'TILE_ACTION'};
        }

        case 'ADVANCE_TURN_PHASE': {
            switch (state.turnPhase) {
                case 'TILE_INFO': {
                    const tile = state.currentTile;
                    if (!tile) return { ...state, activeModal: null, turnPhase: 'TURN_END' };

                    let players = [...state.players];
                    let p = { ...players[state.currentPlayerIndex] };
                    let newModal: GameState['activeModal'] = null;
                    let pozo = state.pozo;
                    let nextPhase: GameState['turnPhase'] = 'TILE_ACTION';

                    switch (tile.t) {
                        case 'ENTRADA':
                            newModal = { type: 'ROUTE', payload: tile };
                            break;
                        case 'CARTA': {
                            const deck = tile.c === 'RETO' ? mazoReto : mazoExpertis;
                            const card = deck[Math.floor(Math.random() * deck.length)];
                            const category = tile.c === 'RETO' ? 'RETO DIVERTIDO' : 'MOMENTO EXPERTIS';
                            newModal = { type: 'CARD', payload: { card, category } };
                            break;
                        }
                        case 'DADO_EVENTO':
                            newModal = { type: 'DICE_EVENT', payload: tile };
                            break;
                        case 'ESQUINA':
                            if (tile.n === "HOSPITAL" || tile.n === "VACACIONES") {
                                newModal = { type: 'HOSPITAL', payload: tile };
                            } else if (tile.n === "SUERTE") {
                                const card = {t: `¡Ganaste el Pozo! Recibes $${state.pozo.toLocaleString()}`, r: {money: state.pozo, pozoReset: true}, i:"🍀"};
                                newModal = {type: 'CARD', payload: {card, category: 'SUERTE'}};
                            } else {
                                nextPhase = 'TURN_END'; // No action on START tile
                            }
                            break;
                        case 'RELAX':
                             nextPhase = 'TURN_END'; // No action on RELAX tile
                             break;
                        case 'MULTA': {
                            const oldPlayers = JSON.parse(JSON.stringify(state.players));
                            if (tile.global) {
                                let totalDonation = 0;
                                players = state.players.map(pl => {
                                   if (pl.id !== p.id) {
                                       const donation = Math.min(pl.actual.money, tile.a!);
                                       totalDonation += donation;
                                       return {...pl, actual: {...pl.actual, money: pl.actual.money - donation}};
                                   }
                                   return pl;
                                });
                                pozo += totalDonation;
                            } else {
                                const amount = Math.min(p.actual.money, tile.a!);
                                p.actual.money -= amount;
                                players[state.currentPlayerIndex] = p;
                                pozo += amount;
                            }
                            const anyPlayerChanged = oldPlayers.some((op: Player, i: number) => statsChanged(op, players[i]));
                             return { ...state, players, pozo, activeModal: null, turnPhase: 'STAT_UPDATE', isShowingStatChanges: anyPlayerChanged };
                        }
                        case 'BONUS': {
                            let card: Card | null = null;
                            const oldPlayers = JSON.parse(JSON.stringify(state.players));
                            if (tile.n === 'Ganaste') {
                                p.actual.passive += tile.a!;
                                card = { t: `¡Felicidades! Tu ingreso pasivo aumenta permanentemente en $${tile.a!}.`, i: '🏆', r: { passive: tile.a! }};
                                players[state.currentPlayerIndex] = p;
                                newModal = { type: 'CARD', payload: { card, category: tile.n.toUpperCase() } };
                            } else if (tile.n === 'Feliz Cumpleaños') {
                                let totalGift = 0;
                                players = state.players.map(pl => {
                                   if (pl.id !== p.id) {
                                       const gift = Math.min(pl.actual.money, tile.a!);
                                       totalGift += gift;
                                       return {...pl, actual: {...pl.actual, money: pl.actual.money - gift}};
                                   }
                                   return {...pl};
                                });
                                const currentPlayerInCopy = players.find(pl => pl.id === p.id)!;
                                currentPlayerInCopy.actual.money += totalGift;
                                card = { t: `¡Feliz Cumpleaños! Los demás jugadores te regalan un total de $${totalGift.toLocaleString()}.`, i: '🎂', r: { money: totalGift }};
                                const anyPlayerChanged = oldPlayers.some((op: Player, i: number) => statsChanged(op, players[i]));
                                return { ...state, players, activeModal: null, turnPhase: 'STAT_UPDATE', isShowingStatChanges: anyPlayerChanged };
                            } else {
                                // For other bonus tiles without specific actions
                                players[state.currentPlayerIndex] = p;
                                nextPhase = 'TURN_END';
                            }
                            break;
                        }
                    }
                    
                    if (nextPhase === 'TURN_END') {
                        return { ...state, activeModal: null, turnPhase: 'TURN_END', showTurnOverlay: true, currentPlayerIndex: (state.currentPlayerIndex + 1) % state.players.length, passiveIncomeBanner: null };
                    }
                    return { ...state, players, pozo, activeModal: newModal, turnPhase: nextPhase };
                }
                case 'STAT_UPDATE':
                case 'TURN_END':
                    return {
                        ...state,
                        isShowingStatChanges: false,
                        showTurnOverlay: true,
                        currentPlayerIndex: (state.currentPlayerIndex + 1) % state.players.length,
                        passiveIncomeBanner: null,
                        turnPhase: 'IDLE'
                    };
                default:
                    return state;
            }
        }
        
        case 'DECIDE_ROUTE': {
            const players = [...state.players];
            const p = { ...players[state.currentPlayerIndex] };
            const tile = state.currentTile as Tile;
            const oldPlayerState = { ...p };

            if (action.payload && tile.r) {
                const alreadyVisited = p.visitedRoutes.includes(tile.r);
                const cost = alreadyVisited ? 0 : (routeCosts[tile.r] || 3000);
                if (p.actual.money >= cost) {
                    p.actual.money -= cost;
                    state.pozo += cost;
                    p.inRoute = true;
                    p.rId = tile.r;
                    p.rSteps = 1;
                }
            }
            players[state.currentPlayerIndex] = p;
            const hasChanged = statsChanged(oldPlayerState, p);

            // If player chose not to enter, or couldn't afford it, move to stat update/end turn
            if (!p.inRoute) {
                return { ...state, players, activeModal: null, turnPhase: 'STAT_UPDATE', isShowingStatChanges: hasChanged };
            }
            
            // If they entered the route, there will be a dice roll, no modal for now.
             return { ...state, players, activeModal: null, turnPhase: 'IDLE' }; // Back to idle to allow rolling dice in route.
        }
        
        case 'RESOLVE_CARD': {
            const players = [...state.players];
            const p = { ...players[state.currentPlayerIndex] };
            const card = (state.activeModal?.payload as any).card as Card;
            let pozo = state.pozo;
            const oldPlayerState = { ...p };

            if (action.payload && card.r) {
                const r = card.r;
                if (r.money) p.actual.money = Math.max(0, p.actual.money + r.money);
                if (r.health) p.actual.health = Math.max(0, p.actual.health + r.health);
                if (r.happy) p.actual.happy = Math.max(0, p.actual.happy + r.happy);
                if (r.passive) p.actual.passive = Math.max(0, p.actual.passive + r.passive);
                if (r.pozoAdd) pozo += r.pozoAdd;
                if (r.pozoReset) pozo = 0;
            }
            players[state.currentPlayerIndex] = p;

            if (calculateSuccess(p) >= 100) {
                 return { ...state, gameStatus: GameStatus.Win, winner: p, activeModal: null };
            }
            const hasChanged = statsChanged(oldPlayerState, p);
            return { ...state, players, pozo, activeModal: null, turnPhase: 'STAT_UPDATE', isShowingStatChanges: hasChanged };
        }
        
        case 'RESOLVE_DICE_EVENT': {
            const players = [...state.players];
            const p = { ...players[state.currentPlayerIndex] };
            const r = action.payload;
            let pozo = state.pozo;
            const oldPlayerState = { ...p };

            if (r.money) p.actual.money = Math.max(0, p.actual.money + r.money);
            if (r.health) p.actual.health = Math.max(0, p.actual.health + r.health);
            if (r.happy) p.actual.happy = Math.max(0, p.actual.happy + r.happy);
            if (r.money && r.money < 0) pozo += Math.abs(r.money);
            
            players[state.currentPlayerIndex] = p;
            const hasChanged = statsChanged(oldPlayerState, p);
            return { ...state, players, pozo, activeModal: null, turnPhase: 'STAT_UPDATE', isShowingStatChanges: hasChanged };
        }
        
        case 'RESOLVE_HOSPITAL': {
            const players = [...state.players];
            const p = { ...players[state.currentPlayerIndex] };
            const { cost, health, happy } = action.payload;
            let pozo = state.pozo;
            const oldPlayerState = { ...p };
            
            p.actual.money = Math.max(0, p.actual.money - cost);
            p.actual.health += health;
            p.actual.happy += happy;
            pozo += cost;

            players[state.currentPlayerIndex] = p;
            const hasChanged = statsChanged(oldPlayerState, p);
            return { ...state, players, pozo, activeModal: null, turnPhase: 'STAT_UPDATE', isShowingStatChanges: hasChanged };
        }

        case 'END_GAME_EARLY': {
            if (state.players.length === 0) return state;

            const successPercentages = state.players.map(p => ({
                player: p,
                percentage: calculateSuccess(p),
            }));

            const winnerData = successPercentages.reduce((max, current) => 
                current.percentage > max.percentage ? current : max,
                successPercentages[0]
            );

            return {
                ...state,
                gameStatus: GameStatus.Win,
                winner: winnerData.player,
                activeModal: null,
                showTurnOverlay: false,
            };
        }
        
        case 'HIDE_PASSIVE_INCOME_BANNER': {
            return { ...state, passiveIncomeBanner: null };
        }

        default:
            return state;
    }
}