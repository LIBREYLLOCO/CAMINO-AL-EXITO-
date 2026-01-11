
// FIX: Import the `Card` type to resolve a type error on line 200.
import { GameState, GameStatus, Player, Tile, Rewards, Card } from '../types';
import { mainBoard, mazoReto, mazoExpertis, mazoRutas, routeCosts, pColors, ROUTE_LENGTH, HOSPITAL_COST_MULTIPLIER } from '../constants';

export type Action =
    | { type: 'START_SETUP'; payload: number }
    | { type: 'SAVE_PLAYER'; payload: Omit<Player, 'id'> }
    | { type: 'START_GAME' }
    | { type: 'SHOW_TURN_OVERLAY' }
    | { type: 'START_TURN' }
    | { type: 'ROLL_DICE' }
    | { type: 'FINISH_ROLL'; payload: { d1: number, d2: number } }
    | { type: 'SHOW_EVENT_CONTENT' }
    | { type: 'DECIDE_ROUTE'; payload: boolean }
    | { type: 'RESOLVE_CARD'; payload: boolean }
    | { type: 'RESOLVE_DICE_EVENT', payload: Rewards }
    | { type: 'RESOLVE_HOSPITAL', payload: { cost: number, health: number, happy: number } }
    | { type: 'END_GAME_EARLY' }
    | { type: 'RESET_GAME' };

export const initialState: GameState = {
    gameStatus: GameStatus.Start,
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
};

function calculateSuccess(p: Player): number {
    const m = Math.min(Math.floor(p.actual.money / 1000), p.metas.d);
    const h = Math.min(p.actual.health, p.metas.s);
    const ha = Math.min(p.actual.happy, p.metas.h);
    return p.metas.t + m + h + ha;
}

export function gameReducer(state: GameState, action: Action): GameState {
    switch (action.type) {
        case 'RESET_GAME':
            return initialState;

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
            return { ...state, showTurnOverlay: false };

        case 'ROLL_DICE':
            return { ...state, isRolling: true };

        case 'FINISH_ROLL': {
            const { d1, d2 } = action.payload;
            const move = d1 + d2;
            let newState = { ...state, isRolling: false, dice: [d1, d2] as [number, number] };
            let p = { ...newState.players[newState.currentPlayerIndex] };

            if (p.inRoute) {
                p.rSteps += d1;
                if (p.rSteps >= ROUTE_LENGTH) {
                    const bonus = routeCosts[p.rId!] || 3000;
                    p.actual.passive += bonus;
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
            } else {
                const oldPos = p.actual.pos;
                p.actual.pos = (oldPos + move) % mainBoard.length;
                if (p.actual.pos < oldPos && move > 0) {
                    const receivedPassive = p.actual.passive;
                    p.actual.money += receivedPassive;
                    p.actual.passive += 1000;
                    newState.passiveIncomeBanner = {
                        visible: true,
                        amount: receivedPassive,
                        playerName: p.name,
                    };
                }
                const currentTile = mainBoard[p.actual.pos];
                newState.currentTile = currentTile;
                newState.activeModal = { type: 'INFO_TILE', payload: currentTile };
            }
            
            newState.players[newState.currentPlayerIndex] = p;
            return newState;
        }
        
        case 'SHOW_EVENT_CONTENT': {
            const tile = state.currentTile;
            const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
            const endTurnState = { activeModal: null, showTurnOverlay: true, currentPlayerIndex: nextPlayerIndex, passiveIncomeBanner: null };

            if (!tile) return { ...state, ...endTurnState };

            let p = { ...state.players[state.currentPlayerIndex] };
            let newModal: GameState['activeModal'] = null;

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
                        p.actual.money += state.pozo;
                        const card = {t: `¡Ganaste el Pozo! Recibes $${state.pozo.toLocaleString()}`, r: {money: state.pozo, pozoReset: true}, i:"🍀"};
                        state.players[state.currentPlayerIndex] = p;
                        newModal = {type: 'CARD', payload: {card, category: 'SUERTE'}};
                    } else {
                         return { ...state, ...endTurnState };
                    }
                    break;
                case 'RELAX':
                     return { ...state, ...endTurnState };
                 case 'MULTA': {
                    if (tile.global) {
                        let totalDonation = 0;
                        const playersCopy = state.players.map(pl => {
                           if (pl.id !== p.id) {
                               const donation = Math.min(pl.actual.money, tile.a!);
                               totalDonation += donation;
                               return {...pl, actual: {...pl.actual, money: pl.actual.money - donation}};
                           }
                           return pl;
                        });
                        return { ...state, players: playersCopy, pozo: state.pozo + totalDonation, ...endTurnState };
                    }
                    p.actual.money = Math.max(0, p.actual.money - tile.a!);
                    state.players[state.currentPlayerIndex] = p;
                    return { ...state, pozo: state.pozo + tile.a!, ...endTurnState };
                }
                case 'BONUS': {
                    let card: Card | null = null;
                     if (tile.n === 'Ganaste') {
                        p.actual.passive += tile.a!;
                        card = { t: `¡Felicidades! Tu ingreso pasivo aumenta permanentemente en $${tile.a!}.`, i: '🏆', r: { passive: tile.a! }};
                    } else if (tile.n === 'Feliz Cumpleaños') {
                        let totalGift = 0;
                        const playersCopy = state.players.map(pl => {
                           if (pl.id !== p.id) {
                               const gift = Math.min(pl.actual.money, tile.a!);
                               totalGift += gift;
                               return {...pl, actual: {...pl.actual, money: pl.actual.money - gift}};
                           }
                           return pl;
                        });
                        p.actual.money += totalGift;
                        card = { t: `¡Feliz Cumpleaños! Los demás jugadores te regalan un total de $${totalGift.toLocaleString()}.`, i: '🎂', r: { money: totalGift }};
                        state.players = playersCopy; // Update all players
                    }
                    
                    state.players[state.currentPlayerIndex] = p;

                    if (card) {
                        newModal = { type: 'CARD', payload: { card, category: tile.n.toUpperCase() } };
                    } else {
                        return { ...state, ...endTurnState };
                    }
                    break;
                }
            }
            return { ...state, activeModal: newModal };
        }
        
        case 'DECIDE_ROUTE': {
            const p = { ...state.players[state.currentPlayerIndex] };
            const tile = state.currentTile as Tile;
            if (action.payload && tile.r) {
                const alreadyVisited = p.visitedRoutes.includes(tile.r);
                const cost = alreadyVisited ? 0 : (routeCosts[tile.r] || 3000);
                if (p.actual.money >= cost) {
                    p.actual.money -= cost;
                    p.inRoute = true;
                    p.rId = tile.r;
                    p.rSteps = 1;
                    state.pozo += cost;
                }
            }
            state.players[state.currentPlayerIndex] = p;
            const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
            return { ...state, activeModal: null, showTurnOverlay: true, currentPlayerIndex: nextPlayerIndex, passiveIncomeBanner: null };
        }
        
        case 'RESOLVE_CARD': {
            const p = { ...state.players[state.currentPlayerIndex] };
            const card = (state.activeModal?.payload as any).card as Card;
            if (action.payload && card.r) {
                const r = card.r;
                if (r.money) p.actual.money = Math.max(0, p.actual.money + r.money);
                if (r.health) p.actual.health = Math.max(0, p.actual.health + r.health);
                if (r.happy) p.actual.happy = Math.max(0, p.actual.happy + r.happy);
                if (r.passive) p.actual.passive = Math.max(0, p.actual.passive + r.passive);
                if (r.pozoAdd) state.pozo += r.pozoAdd;
                if (r.pozoReset) state.pozo = 0;
            }
            state.players[state.currentPlayerIndex] = p;

            if (calculateSuccess(p) >= 100) {
                 return { ...state, gameStatus: GameStatus.Win, winner: p, activeModal: null };
            }
            const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
            return { ...state, activeModal: null, showTurnOverlay: true, currentPlayerIndex: nextPlayerIndex, passiveIncomeBanner: null };
        }
        
        case 'RESOLVE_DICE_EVENT': {
            const p = { ...state.players[state.currentPlayerIndex] };
            const r = action.payload;
            if (r.money) p.actual.money = Math.max(0, p.actual.money + r.money);
            if (r.health) p.actual.health = Math.max(0, p.actual.health + r.health);
            if (r.happy) p.actual.happy = Math.max(0, p.actual.happy + r.happy);
            if (r.money && r.money < 0) state.pozo += Math.abs(r.money);
            
            state.players[state.currentPlayerIndex] = p;
            const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
            return { ...state, activeModal: null, showTurnOverlay: true, currentPlayerIndex: nextPlayerIndex, passiveIncomeBanner: null };
        }
        
        case 'RESOLVE_HOSPITAL': {
            const p = { ...state.players[state.currentPlayerIndex] };
            const { cost, health, happy } = action.payload;
            p.actual.money = Math.max(0, p.actual.money - cost);
            p.actual.health += health;
            p.actual.happy += happy;
            state.pozo += cost;

            state.players[state.currentPlayerIndex] = p;
            const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
            return { ...state, activeModal: null, showTurnOverlay: true, currentPlayerIndex: nextPlayerIndex, passiveIncomeBanner: null };
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

        default:
            return state;
    }
}