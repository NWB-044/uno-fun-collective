import { Card, CardColor, CardType } from '../types/game';

export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  const colors: CardColor[] = ['red', 'blue', 'green', 'yellow'];
  
  // Add number cards (0-9)
  colors.forEach(color => {
    // One zero per color
    deck.push({ id: `${color}-0`, color, type: 'number', value: 0 });
    
    // Two of each 1-9
    for (let i = 1; i <= 9; i++) {
      deck.push({ id: `${color}-${i}-1`, color, type: 'number', value: i });
      deck.push({ id: `${color}-${i}-2`, color, type: 'number', value: i });
    }
    
    // Action cards (two of each per color)
    ['skip', 'reverse', 'draw2'].forEach((type: CardType) => {
      deck.push({ id: `${color}-${type}-1`, color, type });
      deck.push({ id: `${color}-${type}-2`, color, type });
    });
  });
  
  // Wild cards (4 of each)
  for (let i = 0; i < 4; i++) {
    deck.push({ id: `wild-${i}`, color: 'black', type: 'wild' });
    deck.push({ id: `wild4-${i}`, color: 'black', type: 'wild4' });
  }
  
  return shuffleDeck(deck);
};

export const shuffleDeck = (deck: Card[]): Card[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

export const isValidPlay = (card: Card, topCard: Card, currentColor: CardColor): boolean => {
  if (card.color === 'black') return true; // Wild cards can always be played
  if (card.color === currentColor) return true; // Same color
  if (topCard.type === 'number' && card.type === 'number' && topCard.value === card.value) return true; // Same number
  if (topCard.type === card.type) return true; // Same action card
  return false;
};

export const dealCards = (deck: Card[], numPlayers: number): { playerHands: Card[][], remainingDeck: Card[] } => {
  const playerHands: Card[][] = Array(numPlayers).fill([]).map(() => []);
  const remainingDeck = [...deck];
  
  // Deal 7 cards to each player
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < numPlayers; j++) {
      const card = remainingDeck.pop();
      if (card) {
        playerHands[j] = [...playerHands[j], card];
      }
    }
  }
  
  return { playerHands, remainingDeck };
};