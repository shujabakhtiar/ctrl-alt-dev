import { useState, useRef, useEffect, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Pipette,
  Layers,
  Columns,
  SplitSquareVertical,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import type { BackdropMode, RgbaColor } from '../types';

type PreviewPanelProps = {
  originalUrl: string | null;
  processedUrl: string | null;
  isProcessing: boolean;
  backdropMode: BackdropMode;
  customBackdropHex: string;
  viewMode: 'side-by-side' | 'split' | 'processed-only';
  splitPosition: number;
  zoom: number;
  pan: { x: number; y: number };
  isEyedropperActive: boolean;
  onBackdropChange: (mode: BackdropMode) => void;
  onCustomBackdropChange: (hex: string) => void;
  onViewModeChange: (mode: 'side-by-side' | 'split' | 'processed-only') => void;
  onSplitChange: (pos: number) => void;
  onZoomChange: (zoom: number) => void;
  onPanChange: (pan: { x: number; y: number }) => void;
  onEyedropperToggle: (active: boolean) => void;
  onColorSampled: (color: RgbaColor) => void;
};

export function PreviewPanel({
  originalUrl,
  processedUrl,
  isProcessing,
  backdropMode,
  customBackdropHex,
  viewMode,
  splitPosition,
  zoom,
  pan,
  isEyedropperActive,
  onBackdropChange,
  onCustomBackdropChange,
  onViewModeChange,
  onSplitChange,
  onZoomChange,
  onPanChange,
  onEyedropperToggle,
  onColorSampled,
}: PreviewPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Eyedropper sampling canvas
  const sampleCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!originalUrl) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        sampleCanvasRef.current = canvas;
      }
    };
    img.src = originalUrl;
  }, [originalUrl]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isEyedropperActive) {
      handleEyedropperClick(e);
      return;
    }
    if (e.button === 0 && (e.shiftKey || e.altKey)) {
      setIsPanning(true);
      dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDraggingSplit && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const pos = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      onSplitChange(pos);
    } else if (isPanning) {
      onPanChange({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    }
  };

  const handlePointerUp = () => {
    setIsDraggingSplit(false);
    setIsPanning(false);
  };

  const handleEyedropperClick = (e: React.MouseEvent) => {
    const canvas = sampleCanvasRef.current;
    if (!canvas || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Relative to container center with pan and zoom
    const cx = rect.width / 2 + pan.x;
    const cy = rect.height / 2 + pan.y;

    const imgDisplayWidth = rect.width * zoom;
    const imgDisplayHeight = rect.height * zoom;

    const imgLeft = cx - imgDisplayWidth / 2;
    const imgTop = cy - imgDisplayHeight / 2;

    const normX = (clickX - imgLeft) / imgDisplayWidth;
    const normY = (clickY - imgTop) / imgDisplayHeight;

    if (normX >= 0 && normX <= 1 && normY >= 0 && normY <= 1) {
      const sampleX = Math.floor(normX * canvas.width);
      const sampleY = Math.floor(normY * canvas.height);
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const pixel = ctx.getImageData(sampleX, sampleY, 1, 1).data;
        onColorSampled({ r: pixel[0], g: pixel[1], b: pixel[2], a: pixel[3] });
        onEyedropperToggle(false);
      }
    }
  };

  // Generate backdrop background style
  const getBackdropStyle = (): React.CSSProperties => {
    if (backdropMode === 'checker') {
      return {
        backgroundImage: `
          linear-gradient(45deg, #181E29 25%, transparent 25%),
          linear-gradient(-45deg, #181E29 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #181E29 75%),
          linear-gradient(-45deg, transparent 75%, #181E29 75%)
        `,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
        backgroundColor: '#0D1117',
      };
    }
    if (backdropMode === 'dark') {
      return { backgroundColor: '#080A0F' };
    }
    if (backdropMode === 'light') {
      return { backgroundColor: '#FFFFFF' };
    }
    return { backgroundColor: customBackdropHex };
  };

  const resetView = useCallback(() => {
    onZoomChange(1);
    onPanChange({ x: 0, y: 0 });
    onSplitChange(50);
  }, [onZoomChange, onPanChange, onSplitChange]);

  return (
    <div className="flex flex-col bg-[#111620] border border-[#2A3242] rounded-xl overflow-hidden shadow-2xl">
      {/* Top HUD Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#080A0F] border-b border-[#2A3242] text-xs font-mono">
        {/* Left: View Mode Toggles */}
        <div className="flex items-center gap-1 bg-[#111620] p-1 rounded-lg border border-[#2A3242]">
          <button
            type="button"
            title="Split comparison slider"
            onClick={() => onViewModeChange('split')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
              viewMode === 'split'
                ? 'bg-[#C8FF43] text-[#080A0F] font-bold'
                : 'text-[#AAB7D0] hover:text-[#F4F2EC]'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>SPLIT</span>
          </button>
          <button
            type="button"
            title="Side by side comparison"
            onClick={() => onViewModeChange('side-by-side')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
              viewMode === 'side-by-side'
                ? 'bg-[#C8FF43] text-[#080A0F] font-bold'
                : 'text-[#AAB7D0] hover:text-[#F4F2EC]'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>DUAL</span>
          </button>
          <button
            type="button"
            title="Transparent result only"
            onClick={() => onViewModeChange('processed-only')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
              viewMode === 'processed-only'
                ? 'bg-[#C8FF43] text-[#080A0F] font-bold'
                : 'text-[#AAB7D0] hover:text-[#F4F2EC]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>CLEAN</span>
          </button>
        </div>

        {/* Center: Backdrop Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-[#111620] px-2 py-1 rounded-lg border border-[#2A3242]">
          <span className="text-[#7886A1] text-[11px] mr-1">BACKDROP:</span>
          <button
            type="button"
            title="Checkerboard"
            onClick={() => onBackdropChange('checker')}
            className={`w-5 h-5 rounded border transition-all ${
              backdropMode === 'checker' ? 'border-[#C8FF43] scale-110' : 'border-[#46536B]'
            }`}
            style={{
              backgroundImage: 'linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%)',
              backgroundSize: '6px 6px',
              backgroundColor: '#111',
            }}
          />
          <button
            type="button"
            title="Dark backdrop (#080A0F)"
            onClick={() => onBackdropChange('dark')}
            className={`w-5 h-5 rounded bg-[#080A0F] border transition-all ${
              backdropMode === 'dark' ? 'border-[#C8FF43] scale-110' : 'border-[#46536B]'
            }`}
          />
          <button
            type="button"
            title="White backdrop (#FFFFFF)"
            onClick={() => onBackdropChange('light')}
            className={`w-5 h-5 rounded bg-[#FFFFFF] border transition-all ${
              backdropMode === 'light' ? 'border-[#C8FF43] scale-110' : 'border-[#46536B]'
            }`}
          />
          <div className="relative flex items-center">
            <input
              type="color"
              value={customBackdropHex}
              title="Custom backdrop color"
              onChange={(e) => {
                onCustomBackdropChange(e.target.value);
                onBackdropChange('custom');
              }}
              className="w-5 h-5 rounded cursor-pointer border border-[#46536B] p-0 bg-transparent"
            />
          </div>
        </div>

        {/* Right: Eyedropper & Zoom */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEyedropperToggle(!isEyedropperActive)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded border text-xs transition-all ${
              isEyedropperActive
                ? 'bg-[#795BFF] border-[#795BFF] text-white font-bold ring-2 ring-[#795BFF]/40'
                : 'bg-[#111620] border-[#2A3242] text-[#AAB7D0] hover:text-[#F4F2EC]'
            }`}
          >
            <Pipette className="w-3.5 h-3.5" />
            <span>{isEyedropperActive ? 'CLICK IMAGE' : 'PICK COLOR'}</span>
          </button>

          <div className="flex items-center bg-[#111620] border border-[#2A3242] rounded-lg">
            <button
              type="button"
              onClick={() => onZoomChange(Math.max(0.25, zoom - 0.25))}
              className="p-1 hover:text-[#C8FF43] text-[#AAB7D0] transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 text-[11px] text-[#F4F2EC] min-w-10 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => onZoomChange(Math.min(4, zoom + 0.25))}
              className="p-1 hover:text-[#C8FF43] text-[#AAB7D0] transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={resetView}
              className="p-1 border-l border-[#2A3242] hover:text-[#C8FF43] text-[#AAB7D0] transition-colors"
              title="Reset view (100%)"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={getBackdropStyle()}
        className={`relative w-full h-[480px] sm:h-[560px] select-none overflow-hidden flex items-center justify-center transition-colors ${
          isEyedropperActive ? 'cursor-crosshair' : isPanning ? 'cursor-grabbing' : 'cursor-default'
        }`}
      >
        {/* Processing Indicator Badge */}
        {isProcessing && (
          <div className="absolute top-4 right-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#080A0F]/90 border border-[#795BFF] text-[#C8FF43] font-mono text-xs shadow-lg backdrop-blur">
            <Loader2 className="w-4 h-4 animate-spin text-[#C8FF43]" />
            <span>UPDATING LIVE PREVIEW...</span>
          </div>
        )}

        {/* Visual Views */}
        {originalUrl && processedUrl && viewMode === 'split' && (
          <div
            className="relative max-w-full max-h-full flex items-center justify-center pointer-events-none"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
            }}
          >
            {/* Base Layer: Clean Processed Transparent Result */}
            <img
              src={processedUrl}
              alt="Processed transparent"
              className="max-w-full max-h-[440px] sm:max-h-[520px] object-contain block drop-shadow-md"
            />

            {/* Top Layer: Original with CSS clip-path */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                clipPath: `inset(0 ${100 - splitPosition}% 0 0)`,
              }}
            >
              <img
                src={originalUrl}
                alt="Original"
                className="w-full h-full object-contain block"
              />
            </div>

            {/* Split Divider Handle */}
            <div
              className="absolute top-0 bottom-0 pointer-events-auto cursor-ew-resize z-20"
              style={{ left: `${splitPosition}%` }}
              onPointerDown={(e) => {
                e.stopPropagation();
                setIsDraggingSplit(true);
              }}
            >
              <div className="w-0.5 h-full bg-[#C8FF43] shadow-[0_0_8px_rgba(200,255,67,0.8)] relative">
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#080A0F] border-2 border-[#C8FF43] flex items-center justify-center text-[#C8FF43] shadow-lg">
                  <SplitSquareVertical className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        )}

        {originalUrl && processedUrl && viewMode === 'side-by-side' && (
          <div
            className="grid grid-cols-2 gap-4 w-full h-full p-4 pointer-events-none"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
            }}
          >
            <div className="flex flex-col items-center justify-center border border-[#2A3242]/80 rounded-lg p-2 bg-[#080A0F]/60">
              <span className="font-mono text-[10px] text-[#AAB7D0] mb-1">ORIGINAL</span>
              <img
                src={originalUrl}
                alt="Original"
                className="max-w-full max-h-[380px] object-contain"
              />
            </div>
            <div className="flex flex-col items-center justify-center border border-[#2A3242]/80 rounded-lg p-2 bg-[#080A0F]/60">
              <span className="font-mono text-[10px] text-[#C8FF43] mb-1 font-bold">TRANSPARENT</span>
              <img
                src={processedUrl}
                alt="Transparent"
                className="max-w-full max-h-[380px] object-contain"
              />
            </div>
          </div>
        )}

        {processedUrl && viewMode === 'processed-only' && (
          <div
            className="max-w-full max-h-full flex items-center justify-center pointer-events-none"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
            }}
          >
            <img
              src={processedUrl}
              alt="Transparent Result"
              className="max-w-full max-h-[440px] sm:max-h-[520px] object-contain block drop-shadow-md"
            />
          </div>
        )}

        {/* Pan Helper Hint */}
        <div className="absolute bottom-2 left-3 text-[10px] font-mono text-[#7886A1] bg-[#080A0F]/80 px-2 py-0.5 rounded border border-[#2A3242] pointer-events-none">
          Hold Shift + Drag to Pan • Scroll or use buttons to Zoom
        </div>
      </div>
    </div>
  );
}
