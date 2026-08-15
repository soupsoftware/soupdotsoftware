import { useEffect, useRef } from 'react';

/**
 * BinaryCodeBackground
 *
 * Replaces the old criss-cross dashed grid with scrolling, fading lines of
 * binary code. Lines scroll diagonally down the screen in two crossing
 * families (leaning right and leaning left) so they criss-cross each other,
 * and every line slowly fades in and out on its own sine wave.
 */

type ColorKind = 'main' | 'accent' | 'blue';

interface BinaryLine {
  x: number;
  y: number;
  dx: number;
  dy: number;
  speed: number; // px / second
  length: number; // number of characters
  fontSize: number;
  spacing: number; // px between characters
  phase: number; // fade oscillation phase offset
  fadeSpeed: number; // fade oscillation speed (rad / second)
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

export const BinaryCodeBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const setSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();
    window.addEventListener('resize', setSize);

    // Theme-aware colours (re-read when the theme class changes)
    const getColors = () => {
      const styles = getComputedStyle(document.documentElement);
      return {
        main: hexToRgb(styles.getPropertyValue('--text-main').trim() || '#0f172a'),
        accent: hexToRgb(styles.getPropertyValue('--accent').trim() || '#DC143C'),
        blue: { r: 59, g: 130, b: 246 },
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
      if (roll < 0.24) return 'blue';
      return 'main';
    };

    const createRandomChar = () => {
      // Occasionally insert a space so lines read like "1010 0101 1001"
      if (Math.random() < 0.1) return ' ';
      return Math.random() < 0.5 ? '0' : '1';
    };

    // Diagonal unit direction (45 degrees)
    const DIR = Math.SQRT1_2;

    const createLine = (): BinaryLine => {
      const family = Math.random() < 0.5 ? 1 : -1; // lean right or lean left
      const fontSize = rand(15, 26);
      const length = Math.floor(rand(18, 52));
      const spacing = fontSize * rand(0.72, 0.9);
      const totalLength = length * spacing;
      const x = rand(-width * 0.15, width + width * 0.15);
      const y = -rand(0, height * 0.6) - totalLength * 0.5;

      return {
        x,
        y,
        dx: family * DIR,
        dy: DIR,
        speed: rand(24, 64),
        length,
        fontSize,
        spacing,
        phase: rand(0, Math.PI * 2),
        fadeSpeed: rand(0.5, 1.4),
        colorKind: pickColorKind(),
        chars: Array.from({ length }, createRandomChar),
      };
    };

    const lineCount = Math.min(48, Math.max(20, Math.round((width * height) / 55000)));
    const lines: BinaryLine[] = Array.from({ length: lineCount }, createLine);

    const render = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      const t = now / 1000;

      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains('dark');
      const baseAlpha = isDark ? 0.9 : 0.75;

      for (const line of lines) {
        // Scroll the line
        line.x += line.dx * line.speed * dt;
        line.y += line.dy * line.speed * dt;

        // Fade in-and-out on a slow sine wave
        const fade = (Math.sin(t * line.fadeSpeed + line.phase) + 1) / 2;
        const lineAlpha = baseAlpha * (0.08 + 0.92 * fade);

        // Mutate a digit now and then for a "live code" feel
        if (Math.random() < 1.5 * dt) {
          const idx = Math.floor(Math.random() * line.chars.length);
          line.chars[idx] = createRandomChar();
        }

        const color =
          line.colorKind === 'accent' ? colors.accent : line.colorKind === 'blue' ? colors.blue : colors.main;
        ctx.font = `${Math.round(line.fontSize)}px 'JetBrains Mono', 'Fira Code', Consolas, 'Courier New', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const totalLength = line.length * line.spacing;

        // Respawn once the whole line has left the screen
        const tailX = line.x - line.dx * totalLength;
        const tailY = line.y - line.dy * totalLength;
        const offBottom = tailY > height + 80;
        const offTop = line.y < -80 && tailY < -80;
        const offRight = line.x > width + 80 && tailX > width + 80;
        const offLeft = line.x < -80 && tailX < -80;
        if (offBottom || offTop || offRight || offLeft) {
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

          // We simulate the "glow" of the leading character by boosting its alpha to 1.0
          const finalAlpha = i === 0 ? 1 : charAlpha;

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
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 1 }}
    />
  );
};

