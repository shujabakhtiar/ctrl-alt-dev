import { useRef, useEffect, useCallback } from 'react';
import { useWebpStore } from '../store/useWebpStore';
import { formatBytes } from '../../../lib/format';

export function PreviewPanel() {
  const fileData = useWebpStore((s) => s.fileData);
  const convertedData = useWebpStore((s) => s.convertedData);
  const viewMode = useWebpStore((s) => s.viewMode);
  const sliderPosition = useWebpStore((s) => s.sliderPosition);
  const isDraggingSlider = useWebpStore((s) => s.isDraggingSlider);
  const submitting = useWebpStore((s) => s.submitting);

  const setSliderPosition = useWebpStore((s) => s.setSliderPosition);
  const setIsDraggingSlider = useWebpStore((s) => s.setIsDraggingSlider);

  const splitContainerRef = useRef<HTMLDivElement>(null);

  const updateSliderFromClientX = useCallback(
    (clientX: number) => {
      if (!splitContainerRef.current) return;
      const rect = splitContainerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const percent = Math.round((x / rect.width) * 100);
      setSliderPosition(percent);
    },
    [setSliderPosition]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingSlider) return;
    updateSliderFromClientX(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDraggingSlider || !e.touches[0]) return;
    updateSliderFromClientX(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDraggingSlider(false);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [setIsDraggingSlider]);

  if (!fileData) return null;

  return (
    <div className="preview-panel">
      <div className="preview-header">
        <div className="preview-title-row">
          <span className="live-indicator"></span>
          <span className="preview-label">Live Visual Inspection</span>
        </div>
        {submitting && <span className="processing-tag">Encoding...</span>}
      </div>

      {viewMode === 'split' ? (
        <div
          className="split-preview-wrap select-none"
          ref={splitContainerRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onMouseDown={() => setIsDraggingSlider(true)}
          onTouchStart={() => setIsDraggingSlider(true)}
        >
          {/* Background Layer: Converted WebP */}
          {convertedData && (
            <div className="split-layer converted-layer">
              <img
                src={convertedData.url}
                alt="Optimized WebP"
                className="preview-img"
              />
              <span className="preview-tag tag-right">
                WebP (Optimized: {formatBytes(convertedData.size)})
              </span>
            </div>
          )}

          {/* Foreground Layer: Original (clipped by slider) */}
          <div
            className="split-layer original-layer"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img
              src={fileData.originalUrl}
              alt="Original"
              className="preview-img"
            />
            <span className="preview-tag tag-left">
              Original ({formatBytes(fileData.originalSize)})
            </span>
          </div>

          {/* Draggable Divider Handle */}
          <div
            className="split-divider"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="divider-handle">
              <span>◀ ▶</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="side-by-side-wrap">
          <div className="side-box">
            <div className="side-header">
              <span>Original Asset</span>
              <span className="side-size">{formatBytes(fileData.originalSize)}</span>
            </div>
            <div className="side-img-wrap">
              <img src={fileData.originalUrl} alt="Original" />
            </div>
          </div>

          <div className="side-box">
            <div className="side-header">
              <span>Optimized WebP</span>
              <span className="side-size text-accent">
                {convertedData ? formatBytes(convertedData.size) : '...'}
              </span>
            </div>
            <div className="side-img-wrap">
              {convertedData ? (
                <img src={convertedData.url} alt="Optimized WebP" />
              ) : (
                <div className="loading-placeholder">Encoding...</div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="preview-footer-hints">
        <span>💡 Tip: Drag slider horizontally to compare original image fidelity vs compressed WebP.</span>
        <span>Modern browsers achieve up to 30% more efficiency in WebP than JPEG at identical SSIM quality.</span>
      </div>
    </div>
  );
}
