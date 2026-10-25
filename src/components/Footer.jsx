export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-inner">
        <div className="footer-brand-col">
          <div className="footer-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
            <span>Devs<span className="gradient-text">-Toolkit</span></span>
          </div>
          <p className="footer-desc">
            Ultra-fast, zero-cloud client-side utility suite crafted for developers, designers, and web performance engineers.
          </p>
          <div className="privacy-pill">
            <span className="dot-green"></span>
            <span>Zero Data Storage • 100% Client-Side Engine</span>
          </div>
        </div>

        <div className="footer-links-col">
          <h4 className="footer-col-title">Flagship Tools</h4>
          <ul>
            <li><a href="#asset-reducer">OptiPress WebP Studio</a></li>
            <li><a href="#toolkit-catalog">Base64 & Hash Forge</a></li>
            <li><a href="#toolkit-catalog">JSON Schema Linter</a></li>
            <li><a href="#toolkit-catalog">SVG to JSX Cleaner</a></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h4 className="footer-col-title">Performance Specs</h4>
          <ul>
            <li><a href="#benchmarks">WebP vs JPEG / PNG</a></li>
            <li><a href="#benchmarks">Core Web Vitals Guide</a></li>
            <li><a href="#asset-reducer">Hardware Acceleration</a></li>
            <li><a href="#top">Offline Canvas Processing</a></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h4 className="footer-col-title">Developer Info</h4>
          <ul>
            <li><span className="footer-meta-item">Built with React 19 & Vite 8</span></li>
            <li><span className="footer-meta-item">Vanilla Modern CSS</span></li>
            <li><span className="footer-meta-item">Native Canvas 2D API</span></li>
            <li><span className="footer-meta-item">MIT Open Source</span></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Devs-Toolkit. Crafted for high-performance web engineering.</p>
        <div className="footer-bottom-links">
          <a href="#top">Back to Top ↑</a>
        </div>
      </div>
    </footer>
  );
}
