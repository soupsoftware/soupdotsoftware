import React, { useEffect, useRef } from 'react';

/**
 * Configuration object for the Particle Background.
 * Centralizing these values protects data integrity and simplifies complexity
 * by separating configuration state from the rendering logic.
 */
const PARTICLE_CONFIG = {
  // --- ROTATION SETTINGS ---
  // Default rotation speed is 0 to match the exact current configuration. 
  // To enable slow horizontal rotation, set this to a small float (e.g., 0.002).
  rotationSpeed: 0.001, 
  baseAngle: 0, // Starting angle in radians

  // --- DENSITY & SPACING ---
  separation: 40,
  densityMobileX: 35,
  densityMobileY: 30,
  densityDesktopX: 70,
  densityDesktopY: 50,

  // --- CAMERA & VIEWPORT ---
  cameraZ: 1000,
  cameraYMultiplier: 0.05, // Controls vertical tilt intensity relative to mouse Y
  cameraXMultiplier: 0.125, // Controls horizontal shift intensity relative to mouse X
  
  // --- AESTHETICS ---
  baseParticleRadius: 2.5,
  depthFadeThreshold: 1500, // Distance at which particles become completely transparent
  colors: {
    left: '#DC143C',  // --accent red
    right: '#3b82f6', // tailwind blue-500
  }
};

export const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Initialize with alpha: true to support background transparency
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId: number;

    // Encapsulate resize logic to ensure canvas dimensions perfectly match the viewport
    const setSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    setSize();

    const isMobile = width < 768;
    const amountX = isMobile ? PARTICLE_CONFIG.densityMobileX : PARTICLE_CONFIG.densityDesktopX;
    const amountY = isMobile ? PARTICLE_CONFIG.densityMobileY : PARTICLE_CONFIG.densityDesktopY;
    const separation = PARTICLE_CONFIG.separation;

    // Generate initial particle grid centered in 3D space.
    // Keeping internal state purely data-driven ensures predictable rendering.
    const particles: { ix: number; iy: number; x: number; z: number; y: number }[] = [];
    for (let ix = 0; ix < amountX; ix++) {
      for (let iy = 0; iy < amountY; iy++) {
        particles.push({
          ix,
          iy,
          x: ix * separation - (amountX * separation) / 2,
          z: iy * separation - (amountY * separation) / 2,
          y: 0,
        });
      }
    }

    // State variables for animation and interactions
    let count = 0;
    let currentAngle = PARTICLE_CONFIG.baseAngle;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let hasMouseEntered = false;

    // Track mouse offset from screen center to drive the interactive camera and ripple
    const handleMouseMove = (e: MouseEvent) => {
      hasMouseEntered = true;
      targetMouseX = e.clientX - width / 2;
      targetMouseY = e.clientY - height / 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Color interpolation helper
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 255, g: 255, b: 255 };
    };

    const redColor = hexToRgb(PARTICLE_CONFIG.colors.left);
    const blueColor = hexToRgb(PARTICLE_CONFIG.colors.right);

    const render = () => {
      // Linear interpolation (lerp) for smooth mouse tracking
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Contextual base opacity tied to the document's theme
      const isDark = document.documentElement.classList.contains('dark');
      const baseAlpha = isDark ? 0.8 : 0.6;
      
      const cameraZ = PARTICLE_CONFIG.cameraZ;
      const cameraY = 0 - mouseY * PARTICLE_CONFIG.cameraYMultiplier; 
      const cameraX = mouseX * PARTICLE_CONFIG.cameraXMultiplier;

      // Increment counters for wave animation and horizontal rotation
      count += 0.03;
      currentAngle += PARTICLE_CONFIG.rotationSpeed;
      
      // Pre-calculate trigonometric functions for the frame to optimize the loop
      const cosA = Math.cos(currentAngle);
      const sinA = Math.sin(currentAngle);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Apply a 2D rotation matrix on the X/Z plane to simulate a 3D horizontal rotation
        const rotatedX = p.x * cosA - p.z * sinA;
        const rotatedZ = p.x * sinA + p.z * cosA;

        // Complex wave math overlapping multiple sine waves for an organic feel
        p.y = 
          (Math.sin((p.ix + count) * 0.3) * 80) +
          (Math.sin((p.iy + count) * 0.5) * 80) +
          (Math.sin((p.ix + p.iy + count) * 0.2) * 50);

        // Standard 3D to 2D perspective projection based on the rotated Z coordinate
        const scale = 600 / (cameraZ - rotatedZ);
        const px = (rotatedX - cameraX) * scale + width / 2;
        const py = (p.y + cameraY) * scale + height / 2;

        // Frustum culling: Skip drawing if particle is out of screen bounds or behind the camera
        if (px < 0 || px > width || py < 0 || py > height || rotatedZ >= cameraZ) continue;

        // Calculate mouse ripple effect distance
        const dx = px - (mouseX + width / 2);
        const dy = py - (mouseY + height / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        let hoverYOffset = 0;
        let hoverScale = 1;
        
        if (hasMouseEntered && dist < 250) {
          const force = (250 - dist) / 250;
          const easeForce = 1 - Math.pow(1 - force, 3); // Smooth ease-out
          hoverYOffset = easeForce * 50 * scale; // Displace upward
          hoverScale = 1 + easeForce * 2;
        }

        const finalPy = py - hoverYOffset;

        // Color blending based on the projected X position on screen
        const normalizedX = Math.max(0, Math.min(1, px / width));
        
        const r = Math.round(redColor.r * (1 - normalizedX) + blueColor.r * normalizedX);
        const g = Math.round(redColor.g * (1 - normalizedX) + blueColor.g * normalizedX);
        const b = Math.round(redColor.b * (1 - normalizedX) + blueColor.b * normalizedX);

        // Alpha calculation based on depth and interaction state
        const depthAlpha = Math.max(0, 1 - (Math.abs(rotatedZ) / PARTICLE_CONFIG.depthFadeThreshold));
        const finalAlpha = depthAlpha * baseAlpha * (hoverScale > 1.2 ? 1 : 0.4);

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${finalAlpha})`;
        
        const size = (scale * PARTICLE_CONFIG.baseParticleRadius) * hoverScale;
        
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
      style={{ opacity: 1.0 }}
    />
  );
};
