// ============================================
// CARD COMPONENT
// ============================================

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('card', className)} {...props} />;
  }
);

Card.displayName = 'Card';

// ============================================
// CARD HEADER
// ============================================

export const CardHeader = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col space-y-1.5 pb-4', className)}
        {...props}
      />
    );
  }
);

CardHeader.displayName = 'CardHeader';

// ============================================
// CARD TITLE
// ============================================

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn('text-lg font-semibold leading-none tracking-tight', className)}
        {...props}
      />
    );
  }
);

CardTitle.displayName = 'CardTitle';

// ============================================
// CARD DESCRIPTION
// ============================================

export const CardDescription = forwardRef<HTMLParagraphElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <p ref={ref} className={cn('text-sm text-gray-500', className)} {...props} />
    );
  }
);

CardDescription.displayName = 'CardDescription';

// ============================================
// CARD CONTENT
// ============================================

export const CardContent = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('', className)} {...props} />;
  }
);

CardContent.displayName = 'CardContent';

// ============================================
// CARD FOOTER
// ============================================

export const CardFooter = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('flex items-center pt-4', className)} {...props} />
    );
  }
);

CardFooter.displayName = 'CardFooter';
