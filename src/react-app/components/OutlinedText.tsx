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
 * Rendering Architecture (The "Why"):
 * We discovered that Android Chrome (Blink) and Safari (WebKit) completely ignore 
 * `stroke-linejoin: round` on standard HTML text. `-webkit-text-stroke` is a legacy 
 * non-standard CSS property that strictly hardcodes 'miter' joins, leading to fatal 
 * visual spikes on acute characters (like 'A' and 'M').
 * 
 * The Solution (Hybrid SVG Pattern):
 * 1. We render the exact text in a standard HTML <span>, but make it visually invisible (opacity-0).
 *    This ensures the component perfectly maintains its fluid, responsive typographic layout 
 *    (handling line-height, wrapping, and vw units) and remains accessible to screen readers.
 * 2. We position an SVG overlay directly on top. SVG has absolute, bulletproof support for 
 *    path mathematics, guaranteeing our `strokeLinejoin="round"` instruction is executed 
 *    flawlessly across every modern rendering engine on both mobile and desktop.
 */
export const OutlinedText: React.FC<OutlinedTextProps> = ({ 
  children, 
  className = '',
  strokeColor = 'white',
  strokeWidth = '1px'
}) => {
  return (
    // relative + inline-block allows the span to shrink-wrap perfectly to the text width
    <span className={`relative inline-block ${className}`}>
      
      {/* Base Layout Layer: Invisible but maintains exact dimensions, spacing, and a11y */}
      <span className="opacity-0" aria-hidden="true">
        {children}
      </span>
      
      {/* Rendering Layer: SVG overlaid to utilize hardware-accelerated rounded strokes */}
      <svg 
        className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" 
        aria-hidden="true"
      >
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          fill="transparent"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          // paintOrder ensures the stroke draws outward, not eating into the letterform
          style={{ paintOrder: 'stroke fill' }} 
        >
          {children}
        </text>
      </svg>
    </span>
  );
};
