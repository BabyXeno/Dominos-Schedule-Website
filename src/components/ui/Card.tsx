import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-md p-6 animate-fade-in',
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={cn('mb-4 flex items-center justify-between', className)}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<CardProps & { as?: 'h1' | 'h2' | 'h3' | 'h4' }> = ({ 
  children, 
  className,
  as: Component = 'h3',
}) => {
  return (
    <Component className={cn('text-lg font-medium', className)}>
      {children}
    </Component>
  );
};

export const CardContent: React.FC<CardProps> = ({ children, className }) => {
  return <div className={cn('', className)}>{children}</div>;
};

export const CardFooter: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={cn('mt-4 pt-4 border-t border-gray-200 flex justify-end gap-2', className)}
    >
      {children}
    </div>
  );
};

export default Card;