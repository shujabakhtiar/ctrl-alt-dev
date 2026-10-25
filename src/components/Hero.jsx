export default function Hero() {
  return (
    <section className="hero-section" id="top">
      <div className="hero-glow-blob blob-1"></div>
      <div className="hero-glow-blob blob-2"></div>
      
      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-pulse"></span>
          <span className="badge-text">⚡ 100% Local Browser Engine • Zero Server Uploads • Infinite Privacy</span>
        </div>

        <h1 className="hero-title">
          The Modern Developer’s <br />
          <span className="gradient-text hero-highlight">High-Velocity Toolkit</span>
        </h1>

        <p className="hero-description">
          Stop uploading sensitive client images and dev assets to random servers. 
          <strong> Devs-Toolkit</strong> delivers high-performance developer utilities engineered to run 
          directly inside your browser at native silicon speed.
        </p>

        <div className="hero-actions">
          <a href="#asset-reducer" className="hero-btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>Launch Asset Reducer</span>
            <span className="btn-tag">Instant</span>
          </a>

          <a href="#toolkit-catalog" className="hero-btn-secondary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span>Browse 8+ Utilities</span>
          </a>
        </div>

        <div className="hero-metrics-grid">
          <div className="metric-card">
            <div className="metric-val">~75% - 90%</div>
            <div className="metric-label">Typical Asset Size Reduction</div>
          </div>
          <div className="metric-card">
            <div className="metric-val">0 ms</div>
            <div className="metric-label">Network Upload Delay (All Local)</div>
          </div>
          <div className="metric-card">
            <div className="metric-val">WebP & AVIF</div>
            <div className="metric-label">Next-Gen Modern Formats</div>
          </div>
          <div className="metric-card">
            <div className="metric-val">100% Free</div>
            <div className="metric-label">Open Source & Unrestricted</div>
          </div>
        </div>
      </div>
    </section>
  );
}
