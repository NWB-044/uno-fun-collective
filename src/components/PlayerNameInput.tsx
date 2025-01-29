import React from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from '@/hooks/use-toast';

interface PlayerNameInputProps {
  onSubmit: (name: string) => void;
}

const PlayerNameInput = ({ onSubmit }: PlayerNameInputProps) => {
  const [name, setName] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }
    onSubmit(name.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold text-center">Welcome to UNO!</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Enter your name to join
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="mt-1"
              maxLength={20}
            />
          </div>
          <Button type="submit" className="w-full">
            Join Game
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PlayerNameInput;