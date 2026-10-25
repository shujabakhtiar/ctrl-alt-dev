import { useRef } from 'react';
import { Upload, Sparkles, ShieldCheck } from 'lucide-react';
import { useWebpStore } from '../store/useWebpStore';

export function DropZone() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loadFile = useWebpStore((s) => s.loadFile);
  const loadDemo = useWebpStore((s) => s.loadDemo);
  const isDragOver = useWebpStore((s) => s.isDragOver);
  const setIsDragOver = useWebpStore((s) => s.setIsDragOver);
  const loading = useWebpStore((s) => s.loading);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      loadFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <div
      className={`dropzone-container ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          fileInputRef.current?.click();
        }
      }}
      aria-label="Upload an image to convert to WebP"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <div className="dropzone-icon-glow">
        <Upload className="w-8 h-8" />
      </div>

      <h3 className="dropzone-heading">Drag &amp; drop your image here, or browse</h3>
      <p className="dropzone-hint">
        Supports PNG, JPG, JPEG, SVG, WebP, GIF, and BMP (Up to 100MB)
      </p>

      <div className="dropzone-action-row" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="btn-browse cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
        >
          {loading ? 'Reading File...' : 'Choose Local File'}
        </button>

        <button
          type="button"
          className="btn-demo cursor-pointer flex items-center gap-1.5"
          onClick={loadDemo}
          disabled={loading}
        >
          <Sparkles className="w-4 h-4 text-[#C8FF43]" />
          <span>Try Demo Asset (PNG)</span>
        </button>
      </div>

      <div className="privacy-badge">
        <ShieldCheck className="w-4 h-4 text-[#C8FF43]" />
        <span>100% Client-Side. Images never touch an external API.</span>
      </div>
    </div>
  );
}
