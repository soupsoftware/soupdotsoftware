import React from 'react';

interface OutlinedTextProps {
  children: React.ReactNode;
  className?: string;
  strokeColor?: string;
  strokeWidth?: string;
}

/**
 * OutlinedText Component
 *
 * Renders typography with a transparent fill and a solid stroke.
 * 
 * Performance & Rendering Architecture:
 * WebKit browsers generate "miter spikes" on sharp characters (A, M, V, W) when 
 * using `-webkit-text-stroke`. By explicitly forcing `[stroke-linejoin:round]`, 
 * we override the default miter calculation. 
 * We also utilize `paint-order: stroke fill` to ensure the stroke is drawn behind 
 * the transparent fill layer, preventing inner bleeding and keeping the letterform legible.
 */
export const OutlinedText: React.FC<OutlinedTextProps> = ({ 
  children, 
  className = '',
  strokeColor = 'white',
  strokeWidth = '1px'
}) => {
  return (
    <span
      className={`text-transparent ${className}`}
      style={{
        WebkitTextStroke: `${strokeWidth} ${strokeColor}`,
        strokeLinejoin: 'round', 
        paintOrder: 'stroke fill',
      }}
    >
      {children}
    </span>
  );
};
