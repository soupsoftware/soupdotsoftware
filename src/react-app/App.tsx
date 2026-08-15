import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useDarkMode } from './hooks/useDarkMode';
import { ThemeToggle } from './components/ThemeToggle';
import { CustomCursor } from './components/CustomCursor';
import { MagneticButton } from './components/MagneticButton';
import { ParticleBackground } from './components/ParticleBackground';
import { BinaryCodeBackground } from './components/BinaryCodeBackground';
import { ArrowRight } from 'lucide-react';
import { AnimatedBot, AnimatedMonitorSmartphone, AnimatedShieldCheck } from './components/AnimatedIcons';
import './App.css';
import React from 'react';

/**
 * App Component
 * 
 * Serves as the primary layout and orchestration component for the Soup Software landing page.
 * Engineered with a Flexbox column architecture to ensure responsive and predictable vertical spacing,
 * specifically ensuring the Call-to-Action button remains perfectly centered in the dynamically 
 * available viewport space.
 */
function App() {
  // State & Refs
  const { isDark, setIsDark } = useDarkMode();
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll Animation Hooks (Framer Motion)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothScrollYProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax mappings for the hero section
  const heroY = useTransform(smoothScrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(smoothScrollYProgress, [0, 0.2], [1, 0]);

  return (
    <>
      {/* Initial Loading Screen / Intro Animation */}
      <motion.div 
        className="fixed inset-0 z-[100] bg-[var(--text-main)] flex items-center justify-center pointer-events-none"
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{ duration: 1, delay: 1, ease: [0.76, 0, 0.24, 1] }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-[var(--bg-color)] text-4xl md:text-6xl font-black tracking-tighter"
        >
          <span className="text-[var(--accent)]">SoUP</span>SOFTWARE
        </motion.div>
      </motion.div>

      {/* 
        Main Application Container
        Uses `flex flex-col` to establish a vertical flow context. Combined with `min-h-[200vh]`, 
        this guarantees the container takes up sufficient space for scroll animations while allowing 
        child elements to dynamically distribute available vertical space without explicit height calculations.
      */}
      <div ref={containerRef} className="app-container bg-[var(--bg-color)] text-[var(--text-main)] min-h-[200vh] relative overflow-hidden transition-colors duration-700 selection:bg-[var(--accent)] selection:text-white flex flex-col">
        <CustomCursor />

        {/* Background Layers */}
        <BinaryCodeBackground />
        <ParticleBackground/>
            
        {/* Accent Ambient Lighting */}
        <div 
          className="fixed top-1/4 -left-32 w-[40rem] h-[40rem] rounded-full bg-[var(--accent)] mix-blend-normal dark:mix-blend-screen filter blur-[100px] z-0 pointer-events-none transition-opacity duration-1000"
          style={{ opacity: isDark ? 0.3 : 0.6 }}
        />
        <div 
          className="fixed bottom-1/4 -right-32 w-[45rem] h-[45rem] rounded-full bg-blue-500 mix-blend-normal dark:mix-blend-screen filter blur-[120px] z-0 pointer-events-none transition-opacity duration-1000"
          style={{ opacity: isDark ? 0.2 : 0.5 }}
        />

        {/* Top Navigation & Marquee Header */}
        <TopNavigation isDark={isDark} setIsDark={setIsDark} />

        {/* 
          Main Content Area
          `flex-grow` ensures this block stretches to fill the `app-container`, 
          pushing the footer component flush to the bottom. 
          Padding top (`pt-40`) offsets the fixed 7rem header to prevent content overlap.
        */}
        <main className="relative z-10 w-full pt-40 flex flex-col flex-grow">
          {/* HERO SECTION */}
          <motion.section 
            className="h-[95vh] flex flex-col justify-center px-4 md:px-12 lg:px-24 relative"
            style={{ y: heroY, opacity: heroOpacity }}
          >
            <div className="overflow-hidden">
              <motion.h1 
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-[14vw] md:text-[11vw] leading-[0.8] font-black tracking-tighter uppercase"
              >
                Your
              </motion.h1>
            </div>
            <div className="overflow-hidden flex items-center gap-6">
              <motion.h1 
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="text-[14vw] md:text-[11vw] leading-[0.8] font-black tracking-tighter uppercase text-transparent [-webkit-text-stroke:2px_var(--text-main)] dark:[-webkit-text-stroke:2px_var(--text-main)]"
              >
                Digital
              </motion.h1>
            </div>
            <div className="overflow-hidden">
               <motion.h1 
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-[14vw] md:text-[11vw] leading-[0.8] font-black tracking-tighter uppercase flex items-center gap-6"
              >
                <span className="text-[var(--accent)]">Innovation</span>
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1 
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-[14vw] md:text-[11vw] leading-[0.8] font-black tracking-tighter uppercase"
              >
                Partner
              </motion.h1>
            </div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="max-w-2xl mt-12 text-lg md:text-2xl font-light text-[var(--text-muted)]"
            >
            </motion.p>
          </motion.section>

          {/* SPACER */}
          <div className="h-52 relative z-10 w-full" />

          {/* SERVICES */}
          <section id="services" className="overlap-section">
            {/* Overlapping Grid Layout */}
            <div className="overlap-grid-container">
              <div className="overlap-grid">
                <OverlapCard 
                  title="" 
                  desc="Analytics, Automation and Predictive Insights."
                  icon={<AnimatedBot />}
                  delay={0.1}
                />
                <OverlapCard 
                  title="" 
                  desc="Web, Desktop and Mobile App Development."
                  icon={<AnimatedMonitorSmartphone />}
                  delay={0.3}
                />
                <OverlapCard 
                  title="" 
                  desc="Quality Assurance and Development Operations."
                  icon={<AnimatedShieldCheck />}
                  delay={0.5}
                />
              </div>
            </div>
          </section>
          
          {/* 
            Magnetic Button Interstitial Container
            By utilizing `flex-grow`, this module delegates spatial distribution to the Flexbox algorithm. 
            It consumes all leftover vertical space between the services section and the footer. 
            `items-center justify-center` ensures the button is locked dead-center in that dynamic space.
          */}
          <div className="flex flex-grow items-center justify-center border-b border-[var(--border-soft)] py-20 min-h-[40vh]">
            <MagneticButton href="mailto:info@soup.software" className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-[var(--text-main)] text-[var(--bg-color)] text-xl md:text-2xl font-bold tracking-tight uppercase hover:bg-[var(--accent)] hover:text-white transition-colors duration-500">
              Let's Go
            </MagneticButton>
          </div>
        </main>

        {/* 
          Footer Section
          `mt-auto` enforces the footer to anchor at the bottom of the overarching flex container, 
          safeguarding against content overlap.
        */}
        <footer id="contact" className="w-full mt-auto pt-8 pb-24 px-4 lg:px-24 relative z-20">
          {/* SPACER */}
          <div className="h-4 relative z-10 w-full" />

          <div className="mt-6 flex flex-col lg:flex-row flex-wrap justify-center lg:justify-between items-center text-center text-sm font-medium text-[var(--text-muted)] uppercase tracking-widest gap-6">
            <div className="flex gap-6 justify-center">
              <a></a>
              <a href="#" className="hover:text-[var(--text-main)] transition-colors cursor-hover">Twitter</a>
              <a href="#" className="hover:text-[var(--text-main)] transition-colors cursor-hover">LinkedIn</a>
              <a href="#" className="hover:text-[var(--text-main)] transition-colors cursor-hover">GitHub</a>
              <a></a>
            </div>
            <div className="flex gap-6 justify-center">
              <a></a>
              <p>&copy; {new Date().getFullYear()} S<span className="lowercase">o</span>UP Software Limited.</p>
              <a></a>
            </div>
          </div>
          
          {/* SPACER */}
          <div className="h-4 relative z-10 w-full" />

        </footer>
      </div>
    </>
  );
}

interface TopNavigationProps {
  isDark: boolean;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * TopNavigation Component
 * 
 * Adheres to the Single Responsibility Principle by isolating the header layout 
 * (Navigation + Marquee) from the main application flow[cite: 1]. Wrapping both in a fixed 
 * flex-col header ensures they maintain the exact same spatial context and z-index at the top of the viewport.
 */
function TopNavigation({ isDark, setIsDark }: TopNavigationProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
      {/* Navigation Bar */}
      <nav className="w-full h-12 px-6 flex justify-between items-center text-[var(--text-main)] bg-[var(--bg-color)]/80 backdrop-blur-md border-b border-[var(--border-soft)]">
        <div className="font-bold text-2xl tracking-tighter uppercase cursor-hover">
          <div className="flex gap-6 items-center">
            <a></a>
            <span><span className="text-[var(--accent)]">S<span className="lowercase">o</span>UP</span>SOFTWARE</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <ul className="hidden md:flex gap-6 text-sm font-medium tracking-widest uppercase">
            <li><a href="#services" className="hover:text-[var(--accent)] transition-colors cursor-hover">Services</a></li>
            <li><a href="#about" className="hover:text-[var(--accent)] transition-colors cursor-hover">About</a></li>
            <li><a href="#contact" className="hover:text-[var(--accent)] transition-colors cursor-hover">Contact</a></li>
          </ul>
          <div className="flex cursor-hover pointer-events-auto">
            <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
          </div>
          <a></a>
        </div>
      </nav>

      {/* 
        Marquee Ticker Section
        Attached directly below the nav via the parent's Flexbox column flow.
        Typography is scaled down to a modern ticker size to fit the streamlined 3rem (h-12) height.
      */}
      <div className="w-full h-6 overflow-hidden bg-[var(--text-main)] text-[var(--bg-color)] relative flex items-center border-b border-[var(--text-main)]/10">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }} 
          transition={{ duration: 60, ease: "linear", repeat: Infinity }}
          className="flex items-center whitespace-nowrap gap-6 w-fit px-4"
        >
          {[...Array(16)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="text-sm md:text-base font-bold uppercase tracking-widest leading-none">
                Analytics and Automation
              </span>
              
              <span className="text-sm md:text-base font-black text-[var(--accent)] leading-none">
                ⭕
              </span>
              
              <span className="text-sm md:text-base font-bold uppercase tracking-widest leading-none">
                Web and App Development
              </span>
              
              <span className="text-sm md:text-base font-black text-[var(--accent)] leading-none">
                ⭕
              </span>
              
              <span className="text-sm md:text-base font-bold uppercase tracking-widest leading-none">
                QA and DevOps
              </span>
              
              <span className="text-sm md:text-base font-black text-[var(--accent)] leading-none">
                ⭕
              </span>
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </header>
  );
}

interface OverlapCardProps {
  title: string;
  desc: string;
  icon: ReactNode;
  delay: number;
}

/**
 * OverlapCard Component
 * 
 * A simple, isolated component to render service highlights. This abstraction adheres 
 * to the single-responsibility principle, deferring unnecessary complexity and keeping 
 * the primary App component clean and readable[cite: 1].
 */
function OverlapCard({ title, desc, icon, delay }: OverlapCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="overlap-card cursor-hover">
        <div className="overlap-icon-box w-200 h-200">
          {icon}
        </div>

        <h3 className="overlap-card-title mt-6">
          {title}
        </h3>
        
        <p className="overlap-card-desc">
          {desc}
        </p>
        
        <a href="#contact" className="overlap-card-link">
          Explore <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </motion.div>
  );
}

export default App;
