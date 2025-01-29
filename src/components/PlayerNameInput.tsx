import React, { useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from '@/hooks/use-toast';
import { useLocalUser } from '@/hooks/useLocalUser';

interface PlayerNameInputProps {
  onSubmit: (name: string) => void;
}

const PlayerNameInput = ({ onSubmit }: PlayerNameInputProps) => {
  const [name, setName] = React.useState('');
  const { user, login } = useLocalUser();

  useEffect(() => {
    // If user exists in localStorage, auto-submit
    if (user) {
      onSubmit(user.name);
    }
  }, [user, onSubmit]);

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
    
    // Save user info and trigger the onSubmit
    login(name.trim());
    onSubmit(name.trim());
  };

  // If user exists, don't show the form
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold text-center">Welcome to UNO!</h1>
        <p className="text-sm text-gray-500 text-center">
          Enter your name to join. Your name will be saved for future games on this device.
        </p>
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