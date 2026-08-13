import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useDarkMode } from './hooks/useDarkMode';
import { ThemeToggle } from './components/ThemeToggle';
import './App.css';

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

function RevealOnScroll({ children, className = '', delay = 0 }: RevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${isVisible ? 'is-visible' : ''} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDark, setIsDark } = useDarkMode();

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="app-container">
      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      <nav className="navbar">
        <div className="brand">
          <img
            src="/SS Logo.svg"
            alt="SoUP Software"
            className="h-22 w-auto object-contain"
          />
        </div>

        <button
          className="menu-toggle"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className="nav-right">
          <ul className={`nav-links text-xl ${menuOpen ? 'open' : ''}`}>
            <li><a href="#services" onClick={closeMenu}>Services</a></li>
            <li><a href="#about" onClick={closeMenu}>About</a></li>
            <li><a href="#contact" onClick={closeMenu}>Contact</a></li>
          </ul>
          <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
        </div>
      </nav>

      <header className="hero">
        <RevealOnScroll className="hero-content" delay={80}>
          <h1 className="text-4xl">Your partner in <br/><span className="text-transparent [-webkit-text-stroke:2.5px_#00ce93]">digital innovation</span>.</h1>
          <div className="hero-actions">
            <a href="#contact" className="cta-button">Get in Touch</a>
            <a href="#services" className="secondary-link">Explore Services</a>
          </div>
        </RevealOnScroll>

        <RevealOnScroll className="hero-visual" delay={140}>
          <div className="mockup-shell">
            <div className="mockup-toolbar">
              <span className="dot dot-one" />
              <span className="dot dot-two" />
              <span className="dot dot-three" />
            </div>
            <div className="mockup-body">
              <div className="mockup-sidebar" />
              <div className="mockup-main">
                <div className="mockup-panel hero-panel" />
                <div className="mockup-panel stack-panel" />
                <div className="mockup-panel chart-panel" />
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </header>

      <section id="services" className="services">
        <RevealOnScroll className="section-heading" delay={40}>
          <span className="section-tag">What we do</span>
          <h2>Our Expertise</h2>
        </RevealOnScroll>
        <div className="service-grid">
          <RevealOnScroll className="service-card" delay={70}>
            <span className="service-index">01</span>
            <h3>Frontend Engineering</h3>
            <p>Creating lightning-fast, responsive web applications using React and modern edge networks.</p>
          </RevealOnScroll>
          <RevealOnScroll className="service-card" delay={110}>
            <span className="service-index">02</span>
            <h3>Backend Infrastructure</h3>
            <p>Designing secure, high-performance APIs and data layers to power complex business logic.</p>
          </RevealOnScroll>
          <RevealOnScroll className="service-card" delay={150}>
            <span className="service-index">03</span>
            <h3>Cloud Architecture</h3>
            <p>Deploying highly available, cost-effective hybrid hosting solutions for maximum scalability.</p>
          </RevealOnScroll>
        </div>
      </section>

      <section id="about" className="about">
        <RevealOnScroll delay={80}>
          <h2>About Us</h2>
          <p>We are dedicated to enabling our clients to be catalysts for positive change and continuous innovation by creating meaningful experiences through thoughtful attention to detail.</p>
        </RevealOnScroll>
      </section>

      <footer id="contact" className="footer">
        <RevealOnScroll className="footer-content" delay={60}>
          <p>&copy; 2026 Soup Software. All rights reserved.</p>
          <a href="mailto:info@soup.software">info@soup.software</a>
        </RevealOnScroll>
      </footer>
    </div>
  );
}

export default App;
