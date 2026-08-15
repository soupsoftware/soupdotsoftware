import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useSpring} from 'framer-motion';
import { useDarkMode } from './hooks/useDarkMode';
import { ThemeToggle } from './components/ThemeToggle';
import { CustomCursor } from './components/CustomCursor';
import { MagneticButton } from './components/MagneticButton';
import { ParticleBackground } from './components/ParticleBackground';
import { BinaryCodeBackground } from './components/BinaryCodeBackground';
import { ArrowRight } from 'lucide-react';
import { AnimatedBot, AnimatedMonitorSmartphone, AnimatedShieldCheck } from './components/AnimatedIcons';
import './App.css';

function App() {
  const { isDark, setIsDark } = useDarkMode();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothScrollYProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax for hero
  const heroY = useTransform(smoothScrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(smoothScrollYProgress, [0, 0.2], [1, 0]);

  return (
    <>
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

      <div ref={containerRef} className="app-container bg-[var(--bg-color)] text-[var(--text-main)] min-h-[200vh] relative overflow-hidden transition-colors duration-700 selection:bg-[var(--accent)] selection:text-white">
      <CustomCursor />

      {/* Animated Criss-Cross Scrolling Binary Code Background */}
      <BinaryCodeBackground />

      {/* Particle Wave Background */}
      <ParticleBackground/>
          
      <div 
        className="fixed top-1/4 -left-32 w-[40rem] h-[40rem] rounded-full bg-[var(--accent)] mix-blend-normal dark:mix-blend-screen filter blur-[100px] z-0 pointer-events-none transition-opacity duration-1000"
        style={{ opacity: isDark ? 0.3 : 0.6 }}
      />
      <div 
        className="fixed bottom-1/4 -right-32 w-[45rem] h-[45rem] rounded-full bg-blue-500 mix-blend-normal dark:mix-blend-screen filter blur-[120px] z-0 pointer-events-none transition-opacity duration-1000"
        style={{ opacity: isDark ? 0.2 : 0.5 }}
      />

      <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 text-[var(--text-main)] bg-[var(--bg-color)]/50 backdrop-blur-md border-b border-[var(--border-soft)]">
        <div className="font-bold text-2xl tracking-tighter uppercase cursor-hover">
          <span className="text-[var(--accent)]">S<span className="lowercase">o</span>UP</span>SOFTWARE
        </div>
        
        <div className="flex items-center gap-6">
          <ul className="hidden md:flex gap-8 text-sm font-medium tracking-widest uppercase">
            <li><a href="#services" className="hover:text-[var(--accent)] transition-colors cursor-hover">Services</a></li>
            <li><a href="#about" className="hover:text-[var(--accent)] transition-colors cursor-hover">About</a></li>
            <li><a href="#contact" className="hover:text-[var(--accent)] transition-colors cursor-hover">Contact</a></li>
          </ul>
          <div className="cursor-hover pointer-events-auto">
            <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
          </div>
        </div>
      </nav>

      <main className="relative z-10 w-full pt-32">
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
          <div className="overflow-hidden flex items-center gap-4">
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
              className="text-[14vw] md:text-[11vw] leading-[0.8] font-black tracking-tighter uppercase flex items-center gap-4"
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

        {/* MARQUEE SECTION */}
        <section className="py-24 md:py-32 overflow-hidden bg-[var(--text-main)] text-[var(--bg-color)] -skew-y-3 relative z-20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] my-12">
          <div className="skew-y-3">
            <motion.div 
              animate={{ x: ["0%", "-50%"] }} 
              transition={{ duration: 50, ease: "linear", repeat: Infinity }}
              className="flex whitespace-nowrap gap-12 mb-4 w-fit"
            >
              {[...Array(8)].map((_, i) => (
                <h2 key={i} className="text-6xl md:text-6xl lg:text-[6rem] font-black uppercase tracking-tighter leading-none">
                  Analytics and Automation <span className="text-[var(--accent)]">•</span>
                </h2>
              ))}
            </motion.div>
            <motion.div 
              animate={{ x: ["-50%", "0%"] }} 
              transition={{ duration: 50, ease: "linear", repeat: Infinity }}
              className="flex whitespace-nowrap gap-12 text-transparent [-webkit-text-stroke:2px_var(--bg-color)] w-fit"
            >
              {[...Array(8)].map((_, i) => (
                <h2 key={i} className="text-6xl md:text-6xl lg:text-[6rem] font-black uppercase tracking-tighter leading-none">
                  Web and App Development <span className="text-[var(--accent)]">•</span>
                </h2>
              ))}
            </motion.div>
            <motion.div 
              animate={{ x: ["0%", "-50%"] }} 
              transition={{ duration: 50, ease: "linear", repeat: Infinity }}
              className="flex whitespace-nowrap gap-12 mb-4 w-fit"
            >
              {[...Array(8)].map((_, i) => (
                <h2 key={i} className="text-6xl md:text-6xl lg:text-[6rem] font-black uppercase tracking-tighter leading-none">
                  QA and DevOps <span className="text-[var(--accent)]">•</span>
                </h2>
              ))}
            </motion.div>
          </div>
        </section>
        <div className="h-24"><br/></div>

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
        <div className="flex justify-center items-center border-b border-[var(--border-soft)] pb-32">
          <MagneticButton href="mailto:info@soup.software" className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-[var(--text-main)] text-[var(--bg-color)] text-xl md:text-2xl font-bold tracking-tight uppercase hover:bg-[var(--accent)] hover:text-white transition-colors duration-500">
            Let's Go
          </MagneticButton>
        </div>
      </main>

      <footer id="contact" className="pt-8 pb-24 px-4 lg:px-24 relative z-20">
        {/* SPACER */}
        <div className="h-4 relative z-10 w-full" />

        <div className="mt-8 flex flex-col lg:flex-row flex-wrap justify-center lg:justify-between items-center text-center text-sm font-medium text-[var(--text-muted)] uppercase tracking-widest gap-4">
          <div className="flex gap-8 justify-center">
            <a href="#" className="hover:text-[var(--text-main)] transition-colors cursor-hover">Twitter</a>
            <a href="#" className="hover:text-[var(--text-main)] transition-colors cursor-hover">LinkedIn</a>
            <a href="#" className="hover:text-[var(--text-main)] transition-colors cursor-hover">GitHub</a>
          </div>
          <p>&copy; {new Date().getFullYear()} S<span className="lowercase">o</span>UP Software Limited.</p>
        </div>
        
        {/* SPACER */}
        <div className="h-4 relative z-10 w-full" />

      </footer>
    </div>
    </>
  );
}

interface OverlapCardProps {
  title: string;
  desc: string;
  icon: ReactNode;
  delay: number;
}

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
