import React from 'react';
import { Card as CardType } from '../types/game';
import { cn } from '@/lib/utils';

interface CardProps {
  card: CardType;
  isPlayable?: boolean;
  onClick?: () => void;
  className?: string;
}

const Card = ({ card, isPlayable = false, onClick, className }: CardProps) => {
  const getCardContent = () => {
    switch (card.type) {
      case 'number':
        return card.value?.toString();
      case 'skip':
        return '⊘';
      case 'reverse':
        return '↺';
      case 'draw2':
        return '+2';
      case 'wild':
        return '★';
      case 'wild4':
        return '+4';
      default:
        return '';
    }
  };

  const getBackgroundColor = () => {
    switch (card.color) {
      case 'red':
        return 'bg-uno-red';
      case 'blue':
        return 'bg-uno-blue';
      case 'green':
        return 'bg-uno-green';
      case 'yellow':
        return 'bg-uno-yellow';
      case 'black':
        return 'bg-black';
      default:
        return 'bg-gray-200';
    }
  };

  const getTextColor = () => {
    switch (card.color) {
      case 'black':
        return 'text-white';
      default:
        return 'text-white';
    }
  };

  return (
    <div
      className={cn(
        'relative w-24 h-36 rounded-xl shadow-lg cursor-pointer transform transition-all duration-300',
        getBackgroundColor(),
        isPlayable && 'hover:scale-110 hover:-translate-y-2',
        'border-2 border-white',
        className
      )}
      onClick={isPlayable ? onClick : undefined}
    >
      {/* Card Border Design */}
      <div className="absolute inset-1 rounded-lg border-2 border-white/30" />
      
      {/* Card Inner Content */}
      <div className="absolute inset-3 rounded-lg bg-white/10 flex flex-col items-center justify-center">
        {/* Top Number/Symbol */}
        <span className={cn(
          'text-4xl font-bold mb-2',
          getTextColor()
        )}>
          {getCardContent()}
        </span>
        
        {/* Center Logo for special cards */}
        {card.type !== 'number' && (
          <div className={cn(
            'text-6xl transform -rotate-45',
            getTextColor()
          )}>
            {getCardContent()}
          </div>
        )}
        
        {/* Bottom Number/Symbol (inverted) */}
        <span className={cn(
          'text-4xl font-bold mt-2 transform rotate-180',
          getTextColor()
        )}>
          {getCardContent()}
        </span>
      </div>
    </div>
  );
};

export default Card;