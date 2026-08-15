import { motion } from 'framer-motion';

export const AnimatedBot = () => {
  return (
    <motion.svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="w-full h-full overflow-visible"
      animate={{ rotate: [0, -8, 8, -8, 8, 0, 0] }}
      transition={{ duration: 5, repeat: Infinity, times: [0, 0.05, 0.15, 0.25, 0.35, 0.4, 1], ease: "easeInOut" }}
      style={{ originX: "50%", originY: "50%" }}
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <motion.path 
        d="M15 13v2" 
        animate={{ scaleY: [1, 1, 0.1, 1, 1] }} 
        transition={{ duration: 5, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }} 
        style={{ transformOrigin: "15px 14px" }} 
      />
      <motion.path 
        d="M9 13v2" 
        animate={{ scaleY: [1, 1, 0.1, 1, 1] }} 
        transition={{ duration: 5, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }} 
        style={{ transformOrigin: "9px 14px" }} 
      />
    </motion.svg>
  );
};

export const AnimatedMonitorSmartphone = () => {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full overflow-visible">
      <motion.g
        animate={{ x: [0, -3, 0, 0], y: [0, -3, 0, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", times: [0, 0.3, 0.6, 1] }}
      >
        <rect x="2" y="4" width="16" height="11" rx="2" />
        <path d="M10 19v-4" />
        <path d="M7 19h6" />
      </motion.g>
      <motion.g
        animate={{ x: [0, 3, 0, 0], y: [0, 3, 0, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", times: [0, 0.3, 0.6, 1] }}
      >
        <rect width="6" height="10" x="16" y="12" rx="2" fill="var(--icon-box-bg, #000)" />
      </motion.g>
    </svg>
  );
};

export const AnimatedShieldCheck = () => {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full overflow-visible">
      <motion.g
        animate={{ y: [0, -4, 0, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", times: [0, 0.3, 0.6, 1] }}
      >
        {/* Shield outline */}
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        
        {/* Checkmark (drawn on) */}
        <motion.path 
          d="m9 12 2 2 4-4" 
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: [0, 1, 1, 0, 0],
            opacity: [0, 1, 1, 0, 0]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity, 
            ease: "easeInOut",
            times: [0, 0.15, 0.7, 0.85, 1]
          }}
        />
      </motion.g>
    </svg>
  );
};
