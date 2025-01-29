export type CardColor = 'red' | 'blue' | 'green' | 'yellow' | 'black';
export type CardType = 'number' | 'skip' | 'reverse' | 'draw2' | 'wild' | 'wild4';

export interface Card {
  id: string;
  color: CardColor;
  type: CardType;
  value?: number;
}

export type PlayerStatus = 'active' | 'out' | 'spectator';

export interface Player {
  id: string;
  name: string;
  cards: Card[];
  isCurrentTurn: boolean;
  isReady?: boolean;
  isSpectator?: boolean;
  status: PlayerStatus;
  turnOrder?: number;
  lastActive?: number;
}

export interface GameState {
  players: Player[];
  currentPlayer: number;
  direction: 1 | -1;
  deck: Card[];
  discardPile: Card[];
  currentColor: CardColor;
  gameStarted: boolean;
  winner: string | null;
  turnStartTime?: number;
  turnTimeLimit: number;
}

export interface GameRoom {
  id: string;
  name: string;
  players: Player[];
  maxPlayers: number;
  gameState: GameState | null;
}