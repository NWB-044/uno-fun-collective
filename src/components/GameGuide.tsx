import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Help } from 'lucide-react';

const GameGuide = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Help className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>How to Play UNO</DialogTitle>
          <DialogDescription>
            Complete guide to playing UNO
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4">
            <section>
              <h3 className="text-lg font-semibold">Basic Rules</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>The game is played with 2-10 players</li>
                <li>Each player starts with 7 cards</li>
                <li>Match cards by either number or color</li>
                <li>First player to get rid of all cards wins</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold">Special Cards</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Skip (⊘):</strong> Next player loses their turn</li>
                <li><strong>Reverse (↺):</strong> Changes direction of play</li>
                <li><strong>Draw Two (+2):</strong> Next player draws 2 cards and loses their turn</li>
                <li><strong>Wild (★):</strong> Change the color of play</li>
                <li><strong>Wild Draw Four (+4):</strong> Change color and next player draws 4 cards</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold">Playing Your Turn</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Match the top card by either number or color</li>
                <li>If you can't play, draw a card</li>
                <li>If the drawn card can be played, you may play it</li>
                <li>Say "UNO" when you have one card left</li>
              </ol>
            </section>

            <section>
              <h3 className="text-lg font-semibold">Scoring</h3>
              <p>When a player wins, they score points based on the cards left in other players' hands:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Number cards: Face value</li>
                <li>Special cards (Skip, Reverse, Draw Two): 20 points</li>
                <li>Wild cards: 50 points</li>
              </ul>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default GameGuide;