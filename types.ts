
export interface Player {
    id: number;
    name: string;
    color: string;
    icon: string;
    metas: {
        t: number;
        d: number;
        s: number;
        h: number;
    };
    actual: {
        pos: number;
        money: number;
        health: number;
        happy: number;
        passive: number;
    };
    inRoute: boolean;
    rId: string | null;
    rSteps: number;
    visitedRoutes: string[];
}

export interface Rewards {
    money?: number;
    health?: number;
    happy?: number;
    passive?: number;
    pozoReset?: boolean;
    pozoAdd?: number;
    globalDonate?: number;
}

export interface Card {
    t: string;
    r?: Rewards;
    i: string;
    c?: string;
}

export interface Tile {
    n: string;
    t: 'ESQUINA' | 'ENTRADA' | 'CARTA' | 'DADO_EVENTO' | 'MULTA' | 'BONUS' | 'RELAX';
    d: string;
    r?: string; // Route ID for ENTRADA
    c?: 'RETO' | 'EXPERTIS'; // Card type for CARTA
    a?: number; // Amount for MULTA/BONUS
    global?: boolean;
    i?: string; // Icon
}

export enum GameStatus {
    Start,
    Setup,
    Playing,
    Win,
}

export type ModalType = 'INFO_TILE' | 'ROUTE' | 'CARD' | 'DICE_EVENT' | 'HOSPITAL';

export interface CardModalPayload {
    card: Card;
    category: string;
}

export type ModalPayload = Tile | CardModalPayload;

export interface ActiveModal {
    type: ModalType;
    payload: any;
}

export interface GameState {
    gameStatus: GameStatus;
    totalPlayers: number;
    setupPlayerIndex: number;
    players: Player[];
    currentPlayerIndex: number;
    pozo: number;
    activeModal: ActiveModal | null;
    currentTile: Tile | null;
    showTurnOverlay: boolean;
    winner: Player | null;
    dice: [number, number];
    isRolling: boolean;
    passiveIncomeBanner: {
        visible: boolean;
        amount: number;
        playerName: string;
    } | null;
}