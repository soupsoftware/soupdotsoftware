import React, { useEffect, useRef } from 'react';

export const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId: number;

    const setSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    setSize();

    const SEPARATION = 40;
    const isMobile = width < 768;
    const AMOUNTX = isMobile ? 35 : 70; // Half density on mobile
    const AMOUNTY = isMobile ? 30 : 50;

    const particles: { ix: number; iy: number; x: number; z: number; y: number }[] = [];
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        particles.push({
          ix,
          iy,
          x: ix * SEPARATION - (AMOUNTX * SEPARATION) / 2,
          z: iy * SEPARATION - (AMOUNTY * SEPARATION) / 2,
          y: 0,
        });
      }
    }

    let count = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let hasMouseEntered = false;

    const handleMouseMove = (e: MouseEvent) => {
      hasMouseEntered = true;
      targetMouseX = e.clientX - width / 2;
      targetMouseY = e.clientY - height / 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Color interpolation function
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 255, g: 255, b: 255 };
    };

    const redColor = hexToRgb('#DC143C'); // --accent
    const blueColor = hexToRgb('#3b82f6'); // tailwind blue-500

    const render = () => {
      // smooth mouse
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Check dark mode for base opacity
      const isDark = document.documentElement.classList.contains('dark');
      const baseAlpha = isDark ? 0.8 : 0.6;
      
      const cameraZ = 1000;
      const cameraY = 0 - mouseY * 0.2; // Centered vertically, slight camera tilt with mouse
      const cameraX = mouseX * 0.5;

      count += 0.03;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Complex wave math for organic feel
        p.y = 
          (Math.sin((p.ix + count) * 0.3) * 80) +
          (Math.sin((p.iy + count) * 0.5) * 80) +
          (Math.sin((p.ix + p.iy + count) * 0.2) * 50);

        // 3D to 2D projection
        const scale = 600 / (cameraZ - p.z);
        const px = (p.x - cameraX) * scale + width / 2;
        const py = (p.y + cameraY) * scale + height / 2;

        // Skip drawing if out of bounds
        if (px < 0 || px > width || py < 0 || py > height || p.z >= cameraZ) continue;

        // Mouse ripple effect based on screen distance
        const dx = px - (mouseX + width / 2);
        const dy = py - (mouseY + height / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        let hoverYOffset = 0;
        let hoverScale = 1;
        if (hasMouseEntered && dist < 250) {
          const force = (250 - dist) / 250;
          // smooth easing out
          const easeForce = 1 - Math.pow(1 - force, 3);
          hoverYOffset = easeForce * 50 * scale; // bulge up
          hoverScale = 1 + easeForce * 2;
        }

        const finalPy = py - hoverYOffset;

        // Color blending based on X position on screen
        const normalizedX = Math.max(0, Math.min(1, px / width));
        
        // Red on left (0), Blue on right (1)
        const r = Math.round(redColor.r * (1 - normalizedX) + blueColor.r * normalizedX);
        const g = Math.round(redColor.g * (1 - normalizedX) + blueColor.g * normalizedX);
        const b = Math.round(redColor.b * (1 - normalizedX) + blueColor.b * normalizedX);

        // Depth fade
        const depthAlpha = Math.max(0, 1 - (Math.abs(p.z) / 1500));
        const finalAlpha = depthAlpha * baseAlpha * (hoverScale > 1.2 ? 1 : 0.4); // higher alpha when hovered

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${finalAlpha})`;
        
        const size = (scale * 2.5) * hoverScale;
        
        ctx.beginPath();
        ctx.arc(px, finalPy, size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', setSize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
};
