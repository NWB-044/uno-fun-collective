import React, { useState, useEffect } from 'react';
import { Card as CardType, GameState, Player } from '../types/game';
import Card from './Card';
import { createDeck, dealCards, isValidPlay } from '../utils/gameUtils';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';

interface GameProps {
  roomId: string;
  players: Player[];
  onGameEnd?: (winner: string) => void;
}

const Game = ({ roomId, players, onGameEnd }: GameProps) => {
  const [gameState, setGameState] = useState<GameState>({
    players,
    currentPlayer: 0,
    direction: 1,
    deck: [],
    discardPile: [],
    currentColor: 'red',
    gameStarted: false,
    winner: null,
  });

  useEffect(() => {
    if (!gameState.gameStarted) {
      startGame();
    }
  }, []);

  const startGame = () => {
    const deck = createDeck();
    const { playerHands, remainingDeck } = dealCards(deck, players.length);
    
    const initialDiscardPile = [remainingDeck.pop()!];
    const initialColor = initialDiscardPile[0].color === 'black' ? 'red' : initialDiscardPile[0].color;

    setGameState(prev => ({
      ...prev,
      deck: remainingDeck,
      discardPile: initialDiscardPile,
      currentColor: initialColor,
      gameStarted: true,
      players: players.map((player, index) => ({
        ...player,
        cards: playerHands[index],
        isCurrentTurn: index === 0,
      })),
    }));
  };

  const handleCardPlay = (playerId: string, card: CardType) => {
    if (gameState.winner) return;
    
    const playerIndex = gameState.players.findIndex(p => p.id === playerId);
    if (playerIndex !== gameState.currentPlayer) {
      toast({
        title: "Not your turn!",
        description: "Please wait for your turn to play.",
        variant: "destructive",
      });
      return;
    }

    const topCard = gameState.discardPile[gameState.discardPile.length - 1];
    if (!isValidPlay(card, topCard, gameState.currentColor)) {
      toast({
        title: "Invalid move!",
        description: "This card cannot be played now.",
        variant: "destructive",
      });
      return;
    }

    // Remove card from player's hand
    const updatedPlayers = [...gameState.players];
    const currentPlayer = updatedPlayers[playerIndex];
    currentPlayer.cards = currentPlayer.cards.filter(c => c.id !== card.id);

    // Check for winner
    if (currentPlayer.cards.length === 0) {
      setGameState(prev => ({
        ...prev,
        winner: currentPlayer.id,
        players: updatedPlayers,
      }));
      onGameEnd?.(currentPlayer.id);
      return;
    }

    // Handle special cards
    let nextPlayerIndex = (gameState.currentPlayer + gameState.direction) % players.length;
    if (nextPlayerIndex < 0) nextPlayerIndex = players.length - 1;

    let newDirection = gameState.direction;
    let newColor = card.color === 'black' ? gameState.currentColor : card.color;

    switch (card.type) {
      case 'reverse':
        newDirection = gameState.direction * -1 as 1 | -1;
        break;
      case 'skip':
        nextPlayerIndex = (nextPlayerIndex + gameState.direction) % players.length;
        if (nextPlayerIndex < 0) nextPlayerIndex = players.length - 1;
        break;
      case 'draw2':
        const nextPlayer = updatedPlayers[nextPlayerIndex];
        const drawnCards = gameState.deck.slice(-2);
        nextPlayer.cards = [...nextPlayer.cards, ...drawnCards];
        setGameState(prev => ({
          ...prev,
          deck: prev.deck.slice(0, -2),
        }));
        nextPlayerIndex = (nextPlayerIndex + gameState.direction) % players.length;
        break;
    }

    // Update game state
    setGameState(prev => ({
      ...prev,
      players: updatedPlayers.map((p, i) => ({
        ...p,
        isCurrentTurn: i === nextPlayerIndex,
      })),
      currentPlayer: nextPlayerIndex,
      direction: newDirection,
      currentColor: newColor,
      discardPile: [...prev.discardPile, card],
    }));
  };

  const handleDrawCard = (playerId: string) => {
    if (gameState.winner) return;
    
    const playerIndex = gameState.players.findIndex(p => p.id === playerId);
    if (playerIndex !== gameState.currentPlayer) {
      toast({
        title: "Not your turn!",
        description: "Please wait for your turn to draw.",
        variant: "destructive",
      });
      return;
    }

    const drawnCard = gameState.deck[gameState.deck.length - 1];
    const updatedPlayers = [...gameState.players];
    updatedPlayers[playerIndex].cards = [...updatedPlayers[playerIndex].cards, drawnCard];

    let nextPlayerIndex = (gameState.currentPlayer + gameState.direction) % players.length;
    if (nextPlayerIndex < 0) nextPlayerIndex = players.length - 1;

    setGameState(prev => ({
      ...prev,
      deck: prev.deck.slice(0, -1),
      players: updatedPlayers.map((p, i) => ({
        ...p,
        isCurrentTurn: i === nextPlayerIndex,
      })),
      currentPlayer: nextPlayerIndex,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Game status */}
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold">
            {gameState.winner 
              ? `Player ${gameState.winner} wins!`
              : `Current player: ${gameState.players[gameState.currentPlayer]?.name}`}
          </h2>
          <p className="text-lg">Current color: {gameState.currentColor}</p>
        </div>

        {/* Discard pile */}
        <div className="flex justify-center mb-8">
          {gameState.discardPile.length > 0 && (
            <Card card={gameState.discardPile[gameState.discardPile.length - 1]} />
          )}
        </div>

        {/* Player hands */}
        <div className="space-y-8">
          {gameState.players.map((player) => (
            <div key={player.id} className="bg-white rounded-lg p-4 shadow">
              <h3 className="text-xl font-bold mb-2">{player.name}</h3>
              <div className="flex flex-wrap gap-2">
                {player.cards.map((card) => (
                  <Card
                    key={card.id}
                    card={card}
                    isPlayable={player.isCurrentTurn}
                    onClick={() => handleCardPlay(player.id, card)}
                  />
                ))}
              </div>
              {player.isCurrentTurn && (
                <Button
                  className="mt-4"
                  onClick={() => handleDrawCard(player.id)}
                >
                  Draw Card
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Game;