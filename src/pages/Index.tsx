import React, { useState } from 'react';
import Game from '../components/Game';
import { Player } from '../types/game';
import PlayerNameInput from '../components/PlayerNameInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  const handlePlayerJoin = (name: string) => {
    const newPlayer: Player = {
      id: `player-${players.length + 1}`,
      name,
      cards: [],
      isCurrentTurn: false,
      isReady: false,
      isSpectator: gameStarted,
    };

    setCurrentPlayer(newPlayer);
    setPlayers(prev => [...prev, newPlayer]);
  };

  const handleGameEnd = (winnerId: string) => {
    const winner = players.find(p => p.id === winnerId);
    toast({
      title: "Game Over!",
      description: `${winner?.name} wins the game!`,
    });
    // Reset ready status for all players
    setPlayers(prev => prev.map(p => ({ ...p, isReady: false })));
    setGameStarted(false);
  };

  const handlePlayerReady = (playerId: string) => {
    setPlayers(prev => prev.map(p => 
      p.id === playerId ? { ...p, isReady: !p.isReady } : p
    ));
  };

  const handleStartGame = () => {
    if (players.filter(p => !p.isSpectator).length < 2) {
      toast({
        title: "Error",
        description: "Need at least 2 players to start",
        variant: "destructive",
      });
      return;
    }
    setGameStarted(true);
  };

  if (!currentPlayer) {
    return <PlayerNameInput onSubmit={handlePlayerJoin} />;
  }

  if (gameStarted) {
    return (
      <Game
        roomId="local-game"
        players={players}
        currentPlayer={currentPlayer}
        onGameEnd={handleGameEnd}
        onEmojiSend={(emoji: string, playerId: string) => {
          toast({
            title: `${players.find(p => p.id === playerId)?.name} says:`,
            description: emoji,
          });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6">UNO Game Lobby</h1>
        
        <div className="space-y-4">
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Players:</h2>
            <ul className="space-y-2">
              {players.map((player) => (
                <li key={player.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span>{player.name} {player.isSpectator ? '(Spectator)' : ''}</span>
                  {!player.isSpectator && (
                    <Button
                      variant={player.isReady ? "default" : "outline"}
                      onClick={() => handlePlayerReady(player.id)}
                      disabled={player.id !== currentPlayer.id}
                    >
                      {player.isReady ? 'Ready!' : 'Ready?'}
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <Button
            className="w-full mt-4"
            onClick={handleStartGame}
            disabled={players.filter(p => !p.isSpectator && p.isReady).length < 2}
          >
            Start Game
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;