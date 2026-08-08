import React from 'react';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="brand">Soup Software</div>
        <ul className="nav-links">
          <li><a href="#services">Services</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      <header className="hero">
        <h1>Building Scalable Digital Solutions</h1>
        <p>We engineer responsive web applications and robust cloud architectures to help your business thrive.</p>
        <button className="cta-button">Get in Touch</button>
      </header>

      <section id="services" className="services">
        <h2>Our Expertise</h2>
        <div className="service-grid">
          <div className="service-card">
            <h3>Frontend Engineering</h3>
            <p>Creating lightning-fast, responsive web applications using React and modern edge networks.</p>
          </div>
          <div className="service-card">
            <h3>Backend Infrastructure</h3>
            <p>Designing secure, high-performance APIs and data layers to power complex business logic.</p>
          </div>
          <div className="service-card">
            <h3>Cloud Architecture</h3>
            <p>Deploying highly available, cost-effective hybrid hosting solutions for maximum scalability.</p>
          </div>
        </div>
      </section>

      <section id="about" className="about">
        <h2>About Us</h2>
        <p>Based in the Wellington Region, New Zealand, Soup Software is dedicated to delivering clean, maintainable, and highly optimized code. We bridge the gap between complex technical requirements and elegant user experiences.</p>
      </section>

      <footer id="contact" className="footer">
        <div className="footer-content">
          <p>&copy; 2026 Soup Software. All rights reserved.</p>
          <p>hello@soup.software</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
