import { Link } from 'react-router-dom';

export default function ImageConverterPage() {
  return (
    <div className="subpage-container">
      <nav className="breadcrumb-nav" aria-label="Breadcrumb">
        <Link to="/" className="breadcrumb-link">← Devs-Toolkit</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">Image Converter</span>
      </nav>

      <div className="subpage-header">
        <h1 className="subpage-title">Image Converter</h1>
        <p className="subpage-desc">Choose a conversion target format below.</p>
      </div>

      <div className="converter-options-grid">
        <Link to="/image-convertor/to-webp" className="option-card">
          <div className="option-card-header">
            <div className="option-icon-badge">🗜️</div>
            <div>
              <h2 className="option-title">Convert to WebP</h2>
              <span className="option-tag">Recommended for Web</span>
            </div>
          </div>

          <div className="option-benefits">
            <h3 className="benefits-title">Why use WebP?</h3>
            <ul className="benefits-list">
              <li>
                <strong>25%–35% smaller file sizes</strong> compared to JPEG and PNG at equivalent visual fidelity.
              </li>
              <li>
                <strong>Lossless transparency:</strong> Full alpha channel support just like PNG, with much lighter weight.
              </li>
              <li>
                <strong>Faster page loads:</strong> Reduces bandwidth and improves Core Web Vitals (Largest Contentful Paint).
              </li>
              <li>
                <strong>Universal browser support:</strong> Supported natively by 97%+ of all modern browsers.
              </li>
            </ul>
          </div>

          <div className="option-card-footer">
            <span>Open WebP Converter</span>
            <span className="footer-arrow">→</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
