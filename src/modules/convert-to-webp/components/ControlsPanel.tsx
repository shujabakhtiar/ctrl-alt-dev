import { Download, Copy, Check } from 'lucide-react';
import { useWebpStore } from '../store/useWebpStore';
import type { ResizeMode } from '../types';

export function ControlsPanel() {
  const quality = useWebpStore((s) => s.quality);
  const resizeMode = useWebpStore((s) => s.resizeMode);
  const viewMode = useWebpStore((s) => s.viewMode);
  const convertedData = useWebpStore((s) => s.convertedData);
  const submitting = useWebpStore((s) => s.submitting);
  const copyFeedback = useWebpStore((s) => s.copyFeedback);

  const setQuality = useWebpStore((s) => s.setQuality);
  const setResizeMode = useWebpStore((s) => s.setResizeMode);
  const setViewMode = useWebpStore((s) => s.setViewMode);
  const downloadWebp = useWebpStore((s) => s.downloadWebp);
  const copyBase64 = useWebpStore((s) => s.copyBase64);

  const resizeModes: { mode: ResizeMode; label: string }[] = [
    { mode: 'original', label: '100% Size' },
    { mode: '75', label: '75%' },
    { mode: '50', label: '50% Half' },
    { mode: '1280', label: 'Max 1280w' },
    { mode: '800', label: 'Max 800w' },
  ];

  return (
    <div className="controls-panel">
      <h4 className="panel-title">Encoding Controls</h4>

      {/* Quality Slider & Presets */}
      <div className="control-group">
        <div className="control-header">
          <label htmlFor="webp-quality-slider">WebP Quality</label>
          <span className="control-badge font-mono">{quality}%</span>
        </div>
        <input
          id="webp-quality-slider"
          type="range"
          min="5"
          max="100"
          step="1"
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          className="custom-range cursor-pointer"
        />
        <div className="preset-buttons">
          <button
            type="button"
            className={`preset-btn ${quality === 45 ? 'active' : ''}`}
            onClick={() => setQuality(45)}
          >
            Aggressive (45%)
          </button>
          <button
            type="button"
            className={`preset-btn ${quality === 75 ? 'active' : ''}`}
            onClick={() => setQuality(75)}
          >
            Web (75%)
          </button>
          <button
            type="button"
            className={`preset-btn ${quality === 85 ? 'active' : ''}`}
            onClick={() => setQuality(85)}
          >
            High (85%)
          </button>
          <button
            type="button"
            className={`preset-btn ${quality === 98 ? 'active' : ''}`}
            onClick={() => setQuality(98)}
          >
            Lossless (98%)
          </button>
        </div>
      </div>

      {/* Resolution / Resize Options */}
      <div className="control-group">
        <div className="control-header">
          <label>Scale &amp; Resolution</label>
          <span className="control-badge font-mono">
            {resizeMode === 'original' && '100% Original'}
            {resizeMode === '75' && '75% Scale'}
            {resizeMode === '50' && '50% Scale'}
            {resizeMode === '1280' && 'Max 1280px'}
            {resizeMode === '800' && 'Max 800px'}
          </span>
        </div>
        <div className="resize-grid">
          {resizeModes.map((item) => (
            <button
              key={item.mode}
              type="button"
              className={`resize-btn ${resizeMode === item.mode ? 'active' : ''}`}
              onClick={() => setResizeMode(item.mode)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inspection View Mode */}
      <div className="control-group">
        <label className="control-label-sm">Comparison Mode</label>
        <div className="tab-switch">
          <button
            type="button"
            className={`tab-btn ${viewMode === 'split' ? 'active' : ''}`}
            onClick={() => setViewMode('split')}
          >
            ↔ Interactive Split Slider
          </button>
          <button
            type="button"
            className={`tab-btn ${viewMode === 'side-by-side' ? 'active' : ''}`}
            onClick={() => setViewMode('side-by-side')}
          >
            ⊞ Side-by-Side
          </button>
        </div>
      </div>

      {/* Primary Export Actions */}
      <div className="export-box">
        <button
          type="button"
          className="btn-download-primary cursor-pointer flex items-center justify-center gap-2"
          onClick={downloadWebp}
          disabled={!convertedData || submitting}
        >
          <Download className="w-4 h-4 shrink-0" />
          <span>Download Converted WebP</span>
        </button>

        <button
          type="button"
          className="btn-copy-secondary cursor-pointer flex items-center justify-center gap-2"
          onClick={copyBase64}
          disabled={!convertedData || submitting}
        >
          {copyFeedback ? (
            <>
              <Check className="w-4 h-4 text-[#C8FF43] shrink-0" />
              <span>Copied Data URL!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 shrink-0" />
              <span>Copy Base64 WebP</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
