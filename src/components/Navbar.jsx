import { useState, useEffect } from 'react';

export default function Navbar({ activeTab, setActiveTab }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('dt-theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dt-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        <a href="#top" className="navbar-brand">
          <div className="brand-logo-glow">
            <svg className="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          <div className="brand-text-wrap">
            <span className="brand-title">Devs<span className="gradient-text">-Toolkit</span></span>
            <span className="brand-badge">v1.0 • Client-Side</span>
          </div>
        </a>

        <nav className="navbar-links" aria-label="Main Navigation">
          <a 
            href="#asset-reducer" 
            className={`nav-link ${activeTab === 'reducer' ? 'active' : ''}`}
            onClick={() => setActiveTab('reducer')}
          >
            <span className="nav-icon">🗜️</span>
            <span>OptiPress WebP</span>
            <span className="nav-pill-live">Interactive</span>
          </a>
          <a 
            href="#toolkit-catalog" 
            className={`nav-link ${activeTab === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveTab('catalog')}
          >
            <span className="nav-icon">⚡</span>
            <span>All Tools</span>
          </a>
          <a 
            href="#benchmarks" 
            className={`nav-link ${activeTab === 'benchmarks' ? 'active' : ''}`}
            onClick={() => setActiveTab('benchmarks')}
          >
            <span className="nav-icon">📊</span>
            <span>Benchmarks</span>
          </a>
        </nav>

        <div className="navbar-actions">
          <button 
            type="button" 
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle visual theme"
          >
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>

          <a 
            href="#asset-reducer" 
            className="btn-primary-glow"
          >
            Launch Reducer
          </a>
        </div>
      </div>
    </header>
  );
}
