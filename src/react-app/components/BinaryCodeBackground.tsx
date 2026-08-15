import { useEffect, useRef } from 'react';

/**
 * Configuration interface for the BinaryCodeBackground.
 * By exposing these properties, the component is open for extension 
 * but closed for modification, ensuring high reusability.
 */
export interface BinaryCodeConfig {
  /** Multiplier for the number of lines. 1.0 is default, 2.0 is double density. */
  density?: number;
  /** Multiplier for the falling speed. 1.0 is default, 0.5 is half speed. */
  baseSpeed?: number;
  /** The direction of the falling code. */
  direction?: 'criss-cross' | 'matrix' | 'matrix-up' | 'diagonal-right' | 'diagonal-left';
  /** Base opacity for the canvas (0.0 to 1.0). */
  opacity?: number;
  /** Custom colors. If omitted, falls back to CSS variables. */
  colors?: {
    main?: string;
    accent?: string;
    secondary?: string;
  };
  /** Typography settings. */
  typography?: {
    fontFamily?: string;
    minSize?: number;
    maxSize?: number;
  };
  /** Minimum and maximum string length. */
  tailLength?: [number, number];
  /** Whether the leading character should glow via alpha boosting. */
  glowEffect?: boolean;
  /** Rate at which individual characters flip between 0 and 1. 0 disables flipping. */
  flickerRate?: number;
  /** Whether the background should speed up when the user scrolls. */
  scrollReactivity?: boolean;
  /** Multiplier for the space between characters in a line. 1.0 is default. */
  charSpacing?: number;
}

const DEFAULT_CONFIG: BinaryCodeConfig = {
  density: 1.0,
  baseSpeed: 2.0,
  direction: 'matrix',
  opacity: 1.0,
  typography: {
    fontFamily: "'Space Mono', 'JetBrains Mono', 'Fira Code', 'Roboto Mono', ui-monospace, SFMono-Regular, monospace",
    minSize: 15,
    maxSize: 26,
  },
  tailLength: [18, 52],
  glowEffect: true,
  flickerRate: 1.0,
  scrollReactivity: true,
  charSpacing: 1.25,
};

type ColorKind = 'main' | 'accent' | 'secondary';

interface BinaryLine {
  x: number;
  y: number;
  dx: number;
  dy: number;
  speed: number;
  length: number;
  fontSize: number;
  spacing: number;
  phase: number;
  fadeSpeed: number;
  colorKind: ColorKind;
  chars: string[];
}

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 255, g: 255, b: 255 };
};

interface BinaryCodeBackgroundProps {
  config?: BinaryCodeConfig;
}

export const BinaryCodeBackground: React.FC<BinaryCodeBackgroundProps> = ({ config: userConfig }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Store the merged config in a ref. 
  // WHY: This allows the requestAnimationFrame loop to read the latest config 
  // values instantly without triggering a React re-render or canvas teardown.
  const configRef = useRef<BinaryCodeConfig>({ ...DEFAULT_CONFIG, ...userConfig });

  useEffect(() => {
    configRef.current = {
      ...DEFAULT_CONFIG,
      ...userConfig,
      typography: { ...DEFAULT_CONFIG.typography, ...userConfig?.typography },
    };
  }, [userConfig]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId = 0;
    let lastTime = performance.now();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Scroll Tracking Variables
    let currentScrollY = window.scrollY;
    let lastScrollY = window.scrollY;
    let dynamicSpeedMultiplier = 1.0;

    const setSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();
    window.addEventListener('resize', setSize);

    const getColors = () => {
      const customColors = configRef.current.colors;
      const styles = getComputedStyle(document.documentElement);
      return {
        main: hexToRgb(customColors?.main || styles.getPropertyValue('--text-main').trim() || '#0f172a'),
        accent: hexToRgb(customColors?.accent || styles.getPropertyValue('--accent').trim() || '#DC143C'),
        secondary: hexToRgb(customColors?.secondary || '#3b82f6'),
      };
    };
    let colors = getColors();

    const themeObserver = new MutationObserver(() => {
      colors = getColors();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    const pickColorKind = (): ColorKind => {
      const roll = Math.random();
      if (roll < 0.12) return 'accent';
      if (roll < 0.24) return 'secondary';
      return 'main';
    };

    const createRandomChar = () => {
      if (Math.random() < 0.1) return ' ';
      return Math.random() < 0.5 ? '0' : '1';
    };

    const createLine = (): BinaryLine => {
      const cfg = configRef.current;
      const minSize = cfg.typography?.minSize || 15;
      const maxSize = cfg.typography?.maxSize || 26;
      const minTail = cfg.tailLength?.[0] || 18;
      const maxTail = cfg.tailLength?.[1] || 52;
      const baseSpeed = cfg.baseSpeed || 1.0;
      const charSpacing = cfg.charSpacing || 1.0;

      const fontSize = rand(minSize, maxSize);
      const length = Math.floor(rand(minTail, maxTail));
      
      // OPTIMIZATION: Inject the charSpacing configuration variable here
      const spacing = fontSize * rand(0.72, 0.9) * charSpacing;
      const totalLength = length * spacing;
      
      let dx = 0;
      let dy = 0;
      const DIR = Math.SQRT1_2; // 45 degree multiplier

      // Determine velocity vectors dynamically based on configuration
      switch (cfg.direction) {
        case 'matrix':
          dx = 0; dy = 1; break;
        case 'matrix-up':
          dx = 0; dy = -1; break;
        case 'diagonal-right':
          dx = DIR; dy = DIR; break;
        case 'diagonal-left':
          dx = -DIR; dy = DIR; break;
        case 'criss-cross':
        default:
          dx = (Math.random() < 0.5 ? 1 : -1) * DIR;
          dy = DIR;
          break;
      }
      
      // Spawn positioning logic to ensure lines start off-screen opposite to their vector
      const x = rand(-width * 0.15, width + width * 0.15);
      const y = dy > 0 
        ? -rand(0, height * 0.6) - totalLength * 0.5 
        : height + rand(0, height * 0.6) + totalLength * 0.5;

      return {
        x,
        y,
        dx,
        dy,
        speed: rand(24, 64) * baseSpeed,
        length,
        fontSize,
        spacing,
        phase: rand(0, Math.PI * 2),
        fadeSpeed: rand(0.5, 1.4),
        colorKind: pickColorKind(),
        chars: Array.from({ length }, createRandomChar),
      };
    };

    // Calculate line count based on density configuration
    const calculateLineCount = () => {
      const density = configRef.current.density || 1.0;
      return Math.floor(Math.min(48, Math.max(20, Math.round((width * height) / 55000))) * density);
    };
    
    let lines: BinaryLine[] = Array.from({ length: calculateLineCount() }, createLine);

    const render = (now: number) => {
      const cfg = configRef.current;
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      const t = now / 1000;

      ctx.clearRect(0, 0, width, height);

      // Scroll Reactivity Math
      currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;

      if (cfg.scrollReactivity) {
        // Boost multiplier by scroll delta, hard-capped at 5.0 to prevent visual tearing
        dynamicSpeedMultiplier = Math.min(dynamicSpeedMultiplier + scrollDelta * 0.05, 5.0);
      }
      // Smooth decay interpolation (eases back to 1.0)
      dynamicSpeedMultiplier += (1.0 - dynamicSpeedMultiplier) * 0.05;

      const isDark = document.documentElement.classList.contains('dark');
      const baseAlpha = (isDark ? 0.9 : 0.75) * (cfg.opacity || 1.0);

      // Periodically check if we need to spawn/cull lines due to dynamic density changes
      const targetLineCount = calculateLineCount();
      if (lines.length < targetLineCount) lines.push(createLine());
      else if (lines.length > targetLineCount) lines.pop();

      for (const line of lines) {
        // Apply the dynamicSpeedMultiplier to the base velocity vectors
        line.x += line.dx * line.speed * dt * dynamicSpeedMultiplier;
        line.y += line.dy * line.speed * dt * dynamicSpeedMultiplier;

        const fade = (Math.sin(t * line.fadeSpeed + line.phase) + 1) / 2;
        const lineAlpha = baseAlpha * (0.08 + 0.92 * fade);

        // Matrix effect: randomly flip each character between 0 and 1
        const flickerRate = cfg.flickerRate !== undefined ? cfg.flickerRate : 2.0;
        if (flickerRate > 0) {
          for (let i = 0; i < line.chars.length; i++) {
            if (Math.random() < flickerRate * dt) {
              line.chars[i] = line.chars[i] === '0' ? '1' : line.chars[i] === '1' ? '0' : ' ';
            }
          }
        }

        const color =
          line.colorKind === 'accent' ? colors.accent : line.colorKind === 'secondary' ? colors.secondary : colors.main;
        
        ctx.font = `${Math.round(line.fontSize)}px ${cfg.typography?.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const totalLength = line.length * line.spacing;
        const tailX = line.x - line.dx * totalLength;
        const tailY = line.y - line.dy * totalLength;
        
        let isOffScreen = false;

        // Dynamic Culling Logic: Capable of handling any directional vector
        if (line.dy > 0 && tailY > height + 80) isOffScreen = true;
        else if (line.dy < 0 && tailY < -80) isOffScreen = true;
        else if (line.dx > 0 && tailX > width + 80) isOffScreen = true;
        else if (line.dx < 0 && tailX < -80) isOffScreen = true;

        if (isOffScreen) {
          Object.assign(line, createLine());
          continue;
        }

        for (let i = 0; i < line.length; i++) {
          const ix = line.x - line.dx * line.spacing * i;
          const iy = line.y - line.dy * line.spacing * i;
          if (ix < -60 || ix > width + 60 || iy < -60 || iy > height + 60) continue;

          const tailFade = 1 - (i / line.length) * 0.8;
          const charAlpha = lineAlpha * tailFade;
          if (charAlpha <= 0.005) continue;

          const finalAlpha = (i === 0 && cfg.glowEffect) ? 1 : charAlpha;

          ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${finalAlpha})`;
          ctx.fillText(line.chars[i], ix, iy);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', setSize);
      themeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none"
      style={{ opacity: 0.2 }}
    />
  );
};
