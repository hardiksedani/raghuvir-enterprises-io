'use client';

import { Button } from './Button';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuantityProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function Quantity({ value, onChange, min = 1, max, className }: QuantityProps) {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (!max || value < max) onChange(value + 1);
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        intent="outline"
        size="sm"
        onClick={handleDecrement}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="min-w-12 text-center font-medium">{value}</span>
      <Button
        intent="outline"
        size="sm"
        onClick={handleIncrement}
        disabled={max !== undefined && value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
