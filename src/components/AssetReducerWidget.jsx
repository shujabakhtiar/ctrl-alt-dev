import { useState, useRef, useEffect, useCallback } from 'react';
import heroImgSample from '../assets/hero.png';

function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default function AssetReducerWidget() {
  const [fileData, setFileData] = useState(null); // { file, name, originalSize, originalUrl, imgObj, originalWidth, originalHeight }
  const [quality, setQuality] = useState(80);
  const [scalePercent, setScalePercent] = useState(100);
  const [resizeMode, setResizeMode] = useState('original'); // 'original' | '75' | '50' | '1280' | '800'
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedData, setConvertedData] = useState(null); // { blob, url, size, width, height, timeMs, base64 }
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'side-by-side'
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const splitContainerRef = useRef(null);

  // Helper to load an image from File or URL
  const loadImage = useCallback((src, fileName, fileSize) => {
    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setFileData({
        name: fileName,
        originalSize: fileSize,
        originalUrl: src,
        imgObj: img,
        originalWidth: img.naturalWidth,
        originalHeight: img.naturalHeight,
      });
      setIsProcessing(false);
    };
    img.onerror = () => {
      setIsProcessing(false);
      alert('Unable to load image. Please try another format.');
    };
    img.src = src;
  }, []);

  // Handle file selection
  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, SVG, WebP, GIF).');
      return;
    }
    const url = URL.createObjectURL(file);
    loadImage(url, file.name, file.size);
  };

  // Convert on canvas
  const processConversion = useCallback(() => {
    if (!fileData || !fileData.imgObj) return;

    setIsProcessing(true);
    const startTime = performance.now();

    const img = fileData.imgObj;
    let targetWidth = img.naturalWidth;
    let targetHeight = img.naturalHeight;

    if (resizeMode === '75') {
      targetWidth = Math.round(targetWidth * 0.75);
      targetHeight = Math.round(targetHeight * 0.75);
    } else if (resizeMode === '50') {
      targetWidth = Math.round(targetWidth * 0.5);
      targetHeight = Math.round(targetHeight * 0.5);
    } else if (resizeMode === '1280' && targetWidth > 1280) {
      const ratio = 1280 / targetWidth;
      targetWidth = 1280;
      targetHeight = Math.round(targetHeight * ratio);
    } else if (resizeMode === '800' && targetWidth > 800) {
      const ratio = 800 / targetWidth;
      targetWidth = 800;
      targetHeight = Math.round(targetHeight * ratio);
    } else if (scalePercent !== 100) {
      targetWidth = Math.round(targetWidth * (scalePercent / 100));
      targetHeight = Math.round(targetHeight * (scalePercent / 100));
    }

    targetWidth = Math.max(1, targetWidth);
    targetHeight = Math.max(1, targetHeight);

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d', { alpha: true });

    if (!ctx) {
      setIsProcessing(false);
      return;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    const q = Math.max(0.01, Math.min(1, quality / 100));

    canvas.toBlob(
      (blob) => {
        const endTime = performance.now();
        if (blob) {
          const webpUrl = URL.createObjectURL(blob);
          setConvertedData({
            blob,
            url: webpUrl,
            size: blob.size,
            width: targetWidth,
            height: targetHeight,
            timeMs: Math.round(endTime - startTime),
            canvasRef: canvas,
          });
        }
        setIsProcessing(false);
      },
      'image/webp',
      q
    );
  }, [fileData, quality, scalePercent, resizeMode]);

  // Recalculate when settings change
  useEffect(() => {
    if (fileData) {
      const timer = setTimeout(() => {
        processConversion();
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [fileData, quality, scalePercent, resizeMode, processConversion]);

  // Load demo image on initial mount if none loaded
  const loadDemo = () => {
    loadImage(heroImgSample, 'sample-hero-asset.png', 13057);
  };

  const handleDownload = () => {
    if (!convertedData || !fileData) return;
    const baseName = fileData.name.replace(/\.[^/.]+$/, '');
    const a = document.createElement('a');
    a.href = convertedData.url;
    a.download = `${baseName}-optipress.webp`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyBase64 = () => {
    if (!convertedData?.canvasRef) return;
    try {
      const dataUrl = convertedData.canvasRef.toDataURL('image/webp', quality / 100);
      navigator.clipboard.writeText(dataUrl);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch {
      alert('Unable to copy base64 representation.');
    }
  };

  // Slider interaction for split view
  const handleSplitMouseMove = (e) => {
    if (!isDraggingSlider || !splitContainerRef.current) return;
    const rect = splitContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPosition(percent);
  };

  const handleSplitTouchMove = (e) => {
    if (!isDraggingSlider || !splitContainerRef.current || !e.touches[0]) return;
    const rect = splitContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.touches[0].clientX - rect.left));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPosition(percent);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDraggingSlider(false);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  // Compute savings
  const savingsBytes = fileData && convertedData ? fileData.originalSize - convertedData.size : 0;
  const savingsPercent =
    fileData && convertedData && fileData.originalSize > 0
      ? Math.max(0, ((fileData.originalSize - convertedData.size) / fileData.originalSize) * 100).toFixed(1)
      : 0;

  return (
    <div className="converter-page-wrapper">
      <div className="widget-page-header">
        <h1 className="widget-title">Convert to <span className="gradient-text">WebP</span></h1>
        <p className="widget-subtitle">
          Compress and convert images to WebP directly in your browser. 100% client-side.
        </p>
      </div>

      <div className="reducer-card">
        {/* Upload State / Dropzone when no file */}
        {!fileData ? (
          <div
            className={`dropzone-container ${isDragOver ? 'drag-over' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFile(e.dataTransfer.files[0]);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              accept="image/*"
              style={{ display: 'none' }}
            />
            
            <div className="dropzone-icon-glow">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>

            <h3 className="dropzone-heading">Drag & drop your image here, or browse</h3>
            <p className="dropzone-hint">
              Supports PNG, JPG, JPEG, SVG, WebP, GIF, and BMP (Up to 100MB)
            </p>

            <div className="dropzone-action-row" onClick={(e) => e.stopPropagation()}>
              <button 
                type="button" 
                className="btn-browse"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose Local File
              </button>
              
              <button 
                type="button" 
                className="btn-demo"
                onClick={loadDemo}
              >
                ✨ Try Demo Asset (PNG)
              </button>
            </div>

            <div className="privacy-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span>100% Client-Side. Images never touch an external API.</span>
            </div>
          </div>
        ) : (
          /* Active Converter Workspace */
          <div className="workspace-container">
            {/* Top Toolbar */}
            <div className="workspace-header">
              <div className="file-meta-pill">
                <span className="file-name" title={fileData.name}>{fileData.name}</span>
                <span className="file-dim">{fileData.originalWidth}×{fileData.originalHeight}px</span>
                <span className="file-size-badge">{formatBytes(fileData.originalSize)}</span>
              </div>

              <div className="workspace-header-actions">
                <button
                  type="button"
                  className="btn-ghost-sm"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload a different image"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <span>Replace Image</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                
                <button
                  type="button"
                  className="btn-ghost-sm btn-danger"
                  onClick={() => {
                    setFileData(null);
                    setConvertedData(null);
                  }}
                  title="Clear image"
                >
                  ✕ Clear
                </button>
              </div>
            </div>

            {/* Savings HUD */}
            <div className="stats-hud">
              <div className="hud-card original">
                <div className="hud-label">Original Asset</div>
                <div className="hud-val">{formatBytes(fileData.originalSize)}</div>
                <div className="hud-sub">Input resolution: {fileData.originalWidth}×{fileData.originalHeight}</div>
              </div>

              <div className="hud-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>

              <div className="hud-card compressed">
                <div className="hud-label">Optimized WebP</div>
                <div className="hud-val">
                  {convertedData ? formatBytes(convertedData.size) : 'Compressing...'}
                </div>
                <div className="hud-sub">
                  {convertedData ? `${convertedData.width}×${convertedData.height} px • ${convertedData.timeMs}ms` : 'Encoding canvas'}
                </div>
              </div>

              <div className={`hud-card savings ${savingsBytes > 0 ? 'positive' : 'neutral'}`}>
                <div className="hud-label">Total Bandwidth Saved</div>
                <div className="hud-val">
                  {savingsBytes > 0 ? `-${savingsPercent}%` : '0%'}
                </div>
                <div className="hud-sub">
                  {savingsBytes > 0 ? `${formatBytes(savingsBytes)} saved` : 'Uncompressed'}
                </div>
              </div>
            </div>

            {/* Main Interactive Controls + Preview Grid */}
            <div className="workspace-main-grid">
              {/* Controls Column */}
              <div className="controls-panel">
                <h4 className="panel-title">Encoding Controls</h4>

                {/* Quality Slider */}
                <div className="control-group">
                  <div className="control-header">
                    <label htmlFor="quality-slider">WebP Quality</label>
                    <span className="control-badge">{quality}%</span>
                  </div>
                  <input
                    id="quality-slider"
                    type="range"
                    min="5"
                    max="100"
                    step="1"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="custom-range"
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
                    <label>Scale & Resolution</label>
                    <span className="control-badge">
                      {resizeMode === 'original' && '100% Original'}
                      {resizeMode === '75' && '75% Scale'}
                      {resizeMode === '50' && '50% Scale'}
                      {resizeMode === '1280' && 'Max 1280px'}
                      {resizeMode === '800' && 'Max 800px'}
                    </span>
                  </div>
                  <div className="resize-grid">
                    <button
                      type="button"
                      className={`resize-btn ${resizeMode === 'original' ? 'active' : ''}`}
                      onClick={() => {
                        setResizeMode('original');
                        setScalePercent(100);
                      }}
                    >
                      100% Size
                    </button>
                    <button
                      type="button"
                      className={`resize-btn ${resizeMode === '75' ? 'active' : ''}`}
                      onClick={() => setResizeMode('75')}
                    >
                      75%
                    </button>
                    <button
                      type="button"
                      className={`resize-btn ${resizeMode === '50' ? 'active' : ''}`}
                      onClick={() => setResizeMode('50')}
                    >
                      50% Half
                    </button>
                    <button
                      type="button"
                      className={`resize-btn ${resizeMode === '1280' ? 'active' : ''}`}
                      onClick={() => setResizeMode('1280')}
                    >
                      Max 1280w
                    </button>
                    <button
                      type="button"
                      className={`resize-btn ${resizeMode === '800' ? 'active' : ''}`}
                      onClick={() => setResizeMode('800')}
                    >
                      Max 800w
                    </button>
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
                    className="btn-download-primary"
                    onClick={handleDownload}
                    disabled={!convertedData || isProcessing}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    <span>Download Converted WebP</span>
                  </button>

                  <button
                    type="button"
                    className="btn-copy-secondary"
                    onClick={handleCopyBase64}
                    disabled={!convertedData || isProcessing}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    <span>{copyFeedback ? '✓ Copied Data URL!' : 'Copy Base64 WebP'}</span>
                  </button>
                </div>
              </div>

              {/* Visual Preview Column */}
              <div className="preview-panel">
                <div className="preview-header">
                  <div className="preview-title-row">
                    <span className="live-indicator"></span>
                    <span className="preview-label">Live Visual Inspection</span>
                  </div>
                  {isProcessing && <span className="processing-tag">Encoding...</span>}
                </div>

                {viewMode === 'split' ? (
                  <div
                    className="split-preview-wrap"
                    ref={splitContainerRef}
                    onMouseMove={handleSplitMouseMove}
                    onTouchMove={handleSplitTouchMove}
                    onMouseDown={() => setIsDraggingSlider(true)}
                    onTouchStart={() => setIsDraggingSlider(true)}
                  >
                    {/* Background: Converted WebP */}
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

                    {/* Foreground: Original (clipped by slider) */}
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
