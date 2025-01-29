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

  return (
    <div
      className={cn(
        'relative w-24 h-36 rounded-xl shadow-lg cursor-pointer transform transition-transform duration-200',
        getBackgroundColor(),
        isPlayable && 'hover:animate-card-hover',
        className
      )}
      onClick={isPlayable ? onClick : undefined}
    >
      <div className="absolute inset-2 bg-white rounded-lg flex items-center justify-center">
        <span className={cn(
          'text-4xl font-bold',
          `text-${card.color === 'black' ? 'black' : card.color}`
        )}>
          {getCardContent()}
        </span>
      </div>
    </div>
  );
};

export default Card;