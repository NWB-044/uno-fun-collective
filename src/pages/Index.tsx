import React, { useState } from 'react';
import Game from '../components/Game';
import { Player } from '../types/game';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [gameStarted, setGameStarted] = useState(false);

  const handleAddPlayer = () => {
    if (!playerName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a player name",
        variant: "destructive",
      });
      return;
    }

    if (players.length >= 10) {
      toast({
        title: "Error",
        description: "Maximum 10 players allowed",
        variant: "destructive",
      });
      return;
    }

    const newPlayer: Player = {
      id: `player-${players.length + 1}`,
      name: playerName,
      cards: [],
      isCurrentTurn: false,
    };

    setPlayers([...players, newPlayer]);
    setPlayerName('');
  };

  const handleStartGame = () => {
    if (players.length < 2) {
      toast({
        title: "Error",
        description: "Need at least 2 players to start",
        variant: "destructive",
      });
      return;
    }
    setGameStarted(true);
  };

  const handleGameEnd = (winnerId: string) => {
    const winner = players.find(p => p.id === winnerId);
    toast({
      title: "Game Over!",
      description: `${winner?.name} wins the game!`,
    });
  };

  if (gameStarted) {
    return (
      <Game
        roomId="local-game"
        players={players}
        onGameEnd={handleGameEnd}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6">UNO Game</h1>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter player name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddPlayer()}
            />
            <Button onClick={handleAddPlayer}>Add Player</Button>
          </div>

          {players.length > 0 && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Players:</h2>
              <ul className="space-y-2">
                {players.map((player) => (
                  <li key={player.id} className="bg-gray-50 p-2 rounded">
                    {player.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button
            className="w-full mt-4"
            onClick={handleStartGame}
            disabled={players.length < 2}
          >
            Start Game
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;