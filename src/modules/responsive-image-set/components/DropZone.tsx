import { useState, useRef, type DragEvent, type ChangeEvent } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, AlertCircle, FileCheck } from 'lucide-react';
import { useResponsiveImageStore } from '../store/useResponsiveImageStore';
import { formatBytes } from '../../../lib/format';
import heroSample from '../../../assets/hero.png';

export function DropZone() {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const source = useResponsiveImageStore((s) => s.source);
  const loading = useResponsiveImageStore((s) => s.loading);
  const error = useResponsiveImageStore((s) => s.error);
  const loadSourceFile = useResponsiveImageStore((s) => s.loadSourceFile);
  const clearSource = useResponsiveImageStore((s) => s.clearSource);

  const handleDrag = (e: DragEvent<HTMLDivElement>, over: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(over);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      loadSourceFile(files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      loadSourceFile(files[0]);
    }
  };

  const handleLoadDemo = async () => {
    try {
      const response = await fetch(heroSample);
      const blob = await response.blob();
      const file = new File([blob], 'demo-asset.png', { type: 'image/png' });
      loadSourceFile(file);
    } catch {
      // Fallback
    }
  };

  if (source) {
    return (
      <div className="bg-[#111620] border border-[#2A3242] rounded-[10px] p-5 shadow-[0_4px_0_rgba(0,0,0,0.4)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-[8px] bg-[#080A0F] border border-[#2A3242] overflow-hidden shrink-0 flex items-center justify-center">
              <img
                src={source.url}
                alt={source.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileCheck className="w-4 h-4 text-[#C8FF43]" />
                <h3 className="font-['Space_Grotesk',sans-serif] font-bold text-base text-[#F4F2EC] truncate max-w-xs sm:max-w-md">
                  {source.name}
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#AAB7D0]">
                <span className="px-2 py-0.5 rounded bg-[#171D29] border border-[#2A3242] text-[#F4F2EC]">
                  {source.width} × {source.height} px
                </span>
                <span>•</span>
                <span className="text-[#C8FF43] font-bold">
                  {formatBytes(source.size)}
                </span>
                <span>•</span>
                <span className="uppercase text-[#7886A1]">
                  {source.mimeType.replace('image/', '')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-tactile btn-tactile-dark text-xs py-2 px-3.5 rounded-[6px]"
            >
              Replace Image
            </button>
            <button
              type="button"
              onClick={clearSource}
              className="btn-tactile bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/60 text-xs py-2 px-3 rounded-[6px]"
            >
              ✕ Remove
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        onDragOver={(e) => handleDrag(e, true)}
        onDragEnter={(e) => handleDrag(e, true)}
        onDragLeave={(e) => handleDrag(e, false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-[10px] p-8 sm:p-12 text-center cursor-pointer transition-all duration-150 ${
          isDragOver
            ? 'border-[#C8FF43] bg-[#C8FF43]/5 shadow-[0_0_24px_rgba(200,255,67,0.15)] scale-[1.005]'
            : 'border-[#2A3242] hover:border-[#46536B] bg-[#111620] hover:bg-[#141A26]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-[12px] bg-[#171D29] border border-[#2A3242] flex items-center justify-center mb-4 text-[#C8FF43] shadow-[0_4px_0_rgba(0,0,0,0.5)]">
            {loading ? (
              <span className="w-6 h-6 border-2 border-[#C8FF43] border-t-transparent rounded-full animate-spin" />
            ) : (
              <UploadCloud className="w-7 h-7" />
            )}
          </div>

          <h3 className="font-['Space_Grotesk',sans-serif] font-bold text-lg text-[#F4F2EC] mb-1.5">
            {loading ? 'Decoding Image with WASM...' : 'Drop your image here, or browse'}
          </h3>
          <p className="text-xs text-[#AAB7D0] max-w-md mb-6 leading-relaxed">
            Accepts <strong className="text-[#F4F2EC]">PNG, JPEG, and WebP</strong> up to 50MB. Strip metadata & prepare multi-resolution responsive assets.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="btn-tactile btn-tactile-lime text-xs py-2 px-4 rounded-[6px] font-bold"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Choose File</span>
            </button>

            <button
              type="button"
              onClick={handleLoadDemo}
              disabled={loading}
              className="btn-tactile btn-tactile-dark text-xs py-2 px-3.5 rounded-[6px]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C8FF43]" />
              <span>Try Demo Image</span>
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-[#2A3242]/70 w-full max-w-sm flex items-center justify-center gap-2 text-[11px] font-mono text-[#7886A1]">
            <span>100% Client-Side</span>
            <span>•</span>
            <span>Zero server hops</span>
            <span>•</span>
            <span>Infinite privacy</span>
          </div>
        </div>
      </div>

      {/* Inline Error display if rejection occurs */}
      {error && (
        <div className="mt-3 p-3.5 rounded-[8px] bg-red-950/40 border border-red-800/60 flex items-start gap-2.5 text-xs text-red-200">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="font-bold text-red-300">File Notice: </strong>
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}
