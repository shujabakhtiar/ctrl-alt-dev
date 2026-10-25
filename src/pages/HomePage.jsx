import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="home-minimal-container">
      <div className="home-hero-minimal">
        <h1 className="minimal-title">
          Welcome to <span className="gradient-text">Devs-Toolkit</span>
        </h1>
        <p className="minimal-subtitle">Select a tool to get started.</p>
      </div>

      <div className="tool-select-grid">
        <Link to="/image-convertor" className="minimal-tool-card">
          <div className="tool-card-icon">🖼️</div>
          <div className="tool-card-info">
            <h2 className="tool-card-title">Image Converter</h2>
            <p className="tool-card-desc">Client-side image conversion and optimization utilities.</p>
          </div>
          <div className="tool-card-arrow">→</div>
        </Link>
      </div>
    </div>
  );
}
