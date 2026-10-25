import { useState } from 'react';

export default function ToolkitGrid() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Mini-tool state for Base64
  const [base64Input, setBase64Input] = useState('Devs-Toolkit 2026');
  const [base64Encoded, setBase64Encoded] = useState(() => btoa('Devs-Toolkit 2026'));

  // Mini-tool state for JSON validator
  const [jsonInput, setJsonInput] = useState('{"name":"Devs-Toolkit","fast":true,"rating":5}');
  const [jsonStatus, setJsonStatus] = useState('Valid JSON');

  const tools = [
    {
      id: 'optipress',
      title: 'OptiPress WebP Studio',
      badge: 'Active Flagship',
      category: 'assets',
      icon: '🗜️',
      description: 'Client-side asset size reducer with live split-view inspection, quality control, and zero server hops.',
      actionLink: '#asset-reducer',
      actionText: 'Open Reducer',
      highlight: true
    },
    {
      id: 'base64-forge',
      title: 'Base64 & Hash Forge',
      badge: 'Interactive',
      category: 'encoding',
      icon: '🔐',
      description: 'Instant client-side string and asset encoder/decoder with SHA-256 and MD5 hashing.',
      isInteractive: 'base64'
    },
    {
      id: 'json-schema',
      title: 'JSON Formatter & Validator',
      badge: 'Interactive',
      category: 'data',
      icon: '🧹',
      description: 'Lint, format, minify, and inspect JSON payloads without leaking secrets to remote servers.',
      isInteractive: 'json'
    },
    {
      id: 'svg-cleaner',
      title: 'SVG to JSX Optimizer',
      badge: 'Popular',
      category: 'assets',
      icon: '⚡',
      description: 'Strips out useless editor metadata, cleans paths, and outputs React JSX ready for production.',
      actionLink: '#',
      actionText: 'Inspect Tool'
    },
    {
      id: 'wcag-contrast',
      title: 'WCAG Contrast & Color Palette',
      badge: 'Accessibility',
      category: 'design',
      icon: '🎨',
      description: 'Check APCA & WCAG 2.2 color contrast ratios, color blindness simulation, and CSS variables.',
      actionLink: '#',
      actionText: 'Inspect Tool'
    },
    {
      id: 'timestamp-epoch',
      title: 'Epoch & ISO Timestamp Hub',
      badge: 'Productivity',
      category: 'data',
      icon: '⏱️',
      description: 'Convert Unix epoch timestamps to human readable dates across multiple timezones instantly.',
      actionLink: '#',
      actionText: 'Inspect Tool'
    }
  ];

  const handleBase64Change = (val) => {
    setBase64Input(val);
    try {
      setBase64Encoded(btoa(val));
    } catch {
      setBase64Encoded('Encoding error (UTF-8 binary)');
    }
  };

  const handleJsonFormat = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
      setJsonStatus('✓ Valid JSON (Formatted)');
    } catch (e) {
      setJsonStatus('✕ ' + e.message);
    }
  };

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || tool.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="catalog-section" id="toolkit-catalog">
      <div className="section-header">
        <div className="widget-chip">
          <span className="chip-icon">⚡</span>
          <span>Ecosystem Catalog</span>
        </div>
        <h2 className="widget-title">
          The Full <span className="gradient-text">Developer Suite</span>
        </h2>
        <p className="widget-subtitle">
          Everything built for high-throughput engineering workflows. Zero latency, instant results.
        </p>

        {/* Filter bar */}
        <div className="catalog-filter-bar">
          <div className="search-input-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search developer tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="catalog-search"
            />
          </div>

          <div className="category-pills">
            {['all', 'assets', 'encoding', 'data', 'design'].map(cat => (
              <button
                key={cat}
                type="button"
                className={`category-pill ${filterCategory === cat ? 'active' : ''}`}
                onClick={() => setFilterCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="tools-grid">
        {filteredTools.map(tool => (
          <div key={tool.id} className={`tool-card ${tool.highlight ? 'highlight-card' : ''}`}>
            <div className="tool-card-header">
              <div className="tool-icon-wrap">{tool.icon}</div>
              <span className={`tool-badge ${tool.highlight ? 'badge-primary' : ''}`}>
                {tool.badge}
              </span>
            </div>

            <h3 className="tool-card-title">{tool.title}</h3>
            <p className="tool-card-desc">{tool.description}</p>

            {/* Interactive mini widget: Base64 */}
            {tool.isInteractive === 'base64' && (
              <div className="mini-tool-box">
                <input
                  type="text"
                  value={base64Input}
                  onChange={(e) => handleBase64Change(e.target.value)}
                  placeholder="Text to encode"
                  className="mini-input"
                />
                <div className="mini-result-row">
                  <code>{base64Encoded}</code>
                  <button
                    type="button"
                    className="mini-copy-btn"
                    onClick={() => navigator.clipboard.writeText(base64Encoded)}
                    title="Copy to clipboard"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}

            {/* Interactive mini widget: JSON */}
            {tool.isInteractive === 'json' && (
              <div className="mini-tool-box">
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="mini-textarea"
                  rows={2}
                />
                <div className="mini-action-row">
                  <span className={`status-text ${jsonStatus.startsWith('✓') ? 'status-ok' : ''}`}>
                    {jsonStatus}
                  </span>
                  <button
                    type="button"
                    className="mini-btn-action"
                    onClick={handleJsonFormat}
                  >
                    Format JSON
                  </button>
                </div>
              </div>
            )}

            {tool.actionLink && (
              <div className="tool-card-footer">
                <a href={tool.actionLink} className="tool-action-link">
                  <span>{tool.actionText}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
