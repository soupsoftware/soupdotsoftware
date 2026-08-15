import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  depth?: number;
}

export function FloatingElement({ children, className = '', depth = 1 }: FloatingElementProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // The deeper the element, the slower it moves (parallax effect)
  const y = useTransform(scrollYProgress, [0, 1], [`${20 * depth}%`, `-${20 * depth}%`]);
  
  return (
    <motion.div 
      ref={ref}
      style={{ y }}
      className={`relative pointer-events-auto cursor-grab active:cursor-grabbing ${className}`}
      drag
      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
      dragElastic={0.3}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
      whileDrag={{ scale: 1.05, zIndex: 50 }}
    >
      {children}
    </motion.div>
  );
}