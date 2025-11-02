import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function Container({ children, className, noPadding = false }: ContainerProps) {
  return (
    <div className={cn(
      'container mx-auto',
      !noPadding && 'px-4 sm:px-6 lg:px-8',
      className
    )}>
      {children}
    </div>
  );
}

