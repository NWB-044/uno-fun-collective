import React, { useState, useEffect, useCallback } from 'react';
import { Card as CardType, GameState, Player, PlayerStatus } from '../types/game';
import Card from './Card';
import { createDeck, dealCards, isValidPlay } from '../utils/gameUtils';
import { Button } from './ui/button';
import { toast } from '@/hooks/use-toast';
import GameGuide from './GameGuide';
import EmojiPicker from './EmojiPicker';
import { Progress } from './ui/progress';

const TURN_TIME_LIMIT = 60000; // 1 minute in milliseconds

interface GameProps {
  roomId: string;
  players: Player[];
  currentPlayer: Player;
  onGameEnd?: (winner: string) => void;
  onEmojiSend?: (emoji: string, playerId: string) => void;
  onPlayerStatusChange?: (playerId: string, status: PlayerStatus) => void;
}

const Game = ({ roomId, players, currentPlayer, onGameEnd, onEmojiSend, onPlayerStatusChange }: GameProps) => {
  const [gameState, setGameState] = useState<GameState>({
    players,
    currentPlayer: 0,
    direction: 1,
    deck: [],
    discardPile: [],
    currentColor: 'red',
    gameStarted: false,
    winner: null,
    turnTimeLimit: TURN_TIME_LIMIT,
  });
  const [timeRemaining, setTimeRemaining] = useState(TURN_TIME_LIMIT);

  const handleTurnTimeout = useCallback(() => {
    const currentPlayerId = gameState.players[gameState.currentPlayer].id;
    
    // Mark player as out
    if (onPlayerStatusChange) {
      onPlayerStatusChange(currentPlayerId, 'out');
    }
    
    // Move to next player
    let nextPlayerIndex = (gameState.currentPlayer + gameState.direction) % players.length;
    if (nextPlayerIndex < 0) nextPlayerIndex = players.length - 1;

    setGameState(prev => ({
      ...prev,
      currentPlayer: nextPlayerIndex,
      turnStartTime: Date.now(),
      players: prev.players.map((p, i) => ({
        ...p,
        isCurrentTurn: i === nextPlayerIndex,
        status: p.id === currentPlayerId ? 'out' : p.status,
      })),
    }));
  }, [gameState.currentPlayer, gameState.direction, gameState.players, onPlayerStatusChange]);

  useEffect(() => {
    if (!gameState.gameStarted) {
      startGame();
    }
  }, []);

  useEffect(() => {
    if (gameState.gameStarted && !gameState.winner) {
      const interval = setInterval(() => {
        const elapsed = Date.now() - (gameState.turnStartTime || Date.now());
        const remaining = Math.max(0, TURN_TIME_LIMIT - elapsed);
        setTimeRemaining(remaining);
        
        if (remaining === 0) {
          handleTurnTimeout();
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [gameState.gameStarted, gameState.turnStartTime, gameState.winner, handleTurnTimeout]);

  const startGame = () => {
    const deck = createDeck();
    const activePlayers = players.filter(p => !p.isSpectator);
    
    // Randomly assign turn order
    const shuffledPlayers = [...activePlayers].sort(() => Math.random() - 0.5);
    shuffledPlayers.forEach((player, index) => {
      player.turnOrder = index;
    });
    
    const { playerHands, remainingDeck } = dealCards(deck, activePlayers.length);
    
    const initialDiscardPile = [remainingDeck.pop()!];
    const initialColor = initialDiscardPile[0].color === 'black' ? 'red' : initialDiscardPile[0].color;

    setGameState(prev => ({
      ...prev,
      deck: remainingDeck,
      discardPile: initialDiscardPile,
      currentColor: initialColor,
      gameStarted: true,
      turnStartTime: Date.now(),
      players: players.map((player, index) => ({
        ...player,
        cards: player.isSpectator ? [] : playerHands[shuffledPlayers.findIndex(p => p.id === player.id)],
        isCurrentTurn: shuffledPlayers[0].id === player.id && !player.isSpectator,
        status: player.isSpectator ? 'spectator' : 'active',
        turnOrder: shuffledPlayers.find(p => p.id === player.id)?.turnOrder,
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
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <GameGuide />
            <EmojiPicker onEmojiSelect={(emoji) => onEmojiSend?.(emoji, currentPlayer.id)} />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold">
              {gameState.winner 
                ? `${gameState.players.find(p => p.id === gameState.winner)?.name} wins!`
                : `Current player: ${gameState.players[gameState.currentPlayer]?.name}`}
            </h2>
            <p className="text-lg">Current color: {gameState.currentColor}</p>
            {!gameState.winner && (
              <div className="mt-2">
                <Progress value={(timeRemaining / TURN_TIME_LIMIT) * 100} />
                <p className="text-sm mt-1">Time remaining: {Math.ceil(timeRemaining / 1000)}s</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center mb-8">
          {gameState.discardPile.length > 0 && (
            <Card card={gameState.discardPile[gameState.discardPile.length - 1]} />
          )}
        </div>

        <div className="space-y-8">
          {gameState.players.map((player) => (
            <div key={player.id} className="bg-white rounded-lg p-4 shadow">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold">
                  {player.name}
                  {player.status === 'spectator' && ' (Spectator)'}
                  {player.status === 'out' && ' (Out)'}
                </h3>
                {player.turnOrder !== undefined && (
                  <span className="text-sm text-gray-500">Turn order: #{player.turnOrder + 1}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {player.cards.map((card) => (
                  <Card
                    key={card.id}
                    card={card}
                    isPlayable={player.isCurrentTurn && player.id === currentPlayer.id && player.status === 'active'}
                    onClick={() => handleCardPlay(player.id, card)}
                  />
                ))}
              </div>
              {player.isCurrentTurn && player.id === currentPlayer.id && player.status === 'active' && (
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