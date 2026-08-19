import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * CustomCursor Component
 *
 * Replaces the native browser cursor with a smooth, physics-based custom cursor.
 * 
 * Performance Architecture:
 * This component utilizes Framer Motion's `useMotionValue` to track state outside 
 * of the React render cycle. By mutating these values directly in DOM event listeners, 
 * we guarantee 60fps animations without triggering expensive React tree reconciliations.
 */
export function CustomCursor() {
  // --- MOTION VALUES ---
  // initialized off-screen (-100) to prevent a flash at (0,0) on mount.
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const scale = useMotionValue(1);

  // --- SPRING PHYSICS ---
  // Position Spring: Snappy and responsive to accurately track the user's hand.
  const positionSpringConfig = { damping: 28, stiffness: 500, mass: 0.5 };
  const smoothX = useSpring(cursorX, positionSpringConfig);
  const smoothY = useSpring(cursorY, positionSpringConfig);

  // Scale Spring: Gentler and slower to create a fluid, organic zoom effect.
  const scaleSpringConfig = { damping: 20, stiffness: 300, mass: 0.2 };
  const smoothScale = useSpring(scale, scaleSpringConfig);

  useEffect(() => {
    // Cache the hover state to prevent redundant spring recalculations during deep DOM traversal.
    let isCurrentlyHovering = false;

    const updateMousePosition = (e: MouseEvent) => {
      // Offset by 16px (half the 32px width/height) to perfectly center the cursor dot.
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Robust interactive element selector.
      // DOM STRUCTURE WARNING: If the cursor expands when hovering a full card, 
      // ensure the parent card element is NOT an <a> tag and lacks the .cursor-hover class.
      const isHoverable = target.closest(
        'a, button, input, select, textarea, [role="button"], [role="link"], .cursor-hover'
      );

      // Cast to boolean.
      const shouldHover = !!isHoverable;

      // Micro-optimization: Only update the motion value if the state has mutated.
      if (shouldHover !== isCurrentlyHovering) {
        scale.set(shouldHover ? 2.5 : 1);
        isCurrentlyHovering = shouldHover;
      }
    };

    // Use { passive: true } to instruct the browser that we will not call preventDefault().
    // This allows the browser's compositing thread to scroll the page unhindered.
    window.addEventListener('mousemove', updateMousePosition, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, scale]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      style={{
        backgroundColor: 'white',
        x: smoothX,
        y: smoothY,
        scale: smoothScale, // Injected the smoothed spring value here
      }}
    />
  );
}
