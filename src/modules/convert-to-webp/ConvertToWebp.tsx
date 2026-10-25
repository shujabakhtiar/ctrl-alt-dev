import { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { useWebpStore } from './store/useWebpStore';
import { DropZone } from './components/DropZone';
import { StatsHud } from './components/StatsHud';
import { ControlsPanel } from './components/ControlsPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { formatBytes } from '../../lib/format';

export function ConvertToWebp() {
  const fileData = useWebpStore((s) => s.fileData);
  const clearFile = useWebpStore((s) => s.clearFile);
  const loadFile = useWebpStore((s) => s.loadFile);

  const replaceInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="converter-page-wrapper">
      {/* Page Header */}
      <div className="widget-page-header">
        <h1 className="widget-title">
          Convert to <span className="gradient-text">WebP</span>
        </h1>
        <p className="widget-subtitle">
          Compress and convert images to WebP directly in your browser. 100% client-side.
        </p>
      </div>

      <div className="reducer-card">
        {!fileData ? (
          /* Empty / Upload State */
          <DropZone />
        ) : (
          /* Active Converter Workspace */
          <div className="workspace-container">
            {/* Top Toolbar */}
            <div className="workspace-header">
              <div className="file-meta-pill">
                <span className="file-name font-mono" title={fileData.name}>
                  {fileData.name}
                </span>
                <span className="file-dim font-mono">
                  {fileData.originalWidth}×{fileData.originalHeight}px
                </span>
                <span className="file-size-badge font-mono">
                  {formatBytes(fileData.originalSize)}
                </span>
              </div>

              <div className="workspace-header-actions">
                <button
                  type="button"
                  className="btn-ghost-sm cursor-pointer flex items-center gap-1.5"
                  onClick={() => replaceInputRef.current?.click()}
                  title="Upload a different image"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Replace Image</span>
                </button>
                <input
                  type="file"
                  ref={replaceInputRef}
                  onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])}
                  accept="image/*"
                  style={{ display: 'none' }}
                />

                <button
                  type="button"
                  className="btn-ghost-sm btn-danger cursor-pointer flex items-center gap-1"
                  onClick={clearFile}
                  title="Clear image"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            {/* Savings HUD */}
            <StatsHud />

            {/* Main Interactive Controls & Preview Grid */}
            <div className="workspace-main-grid">
              <ControlsPanel />
              <PreviewPanel />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
