import { useRef, useState, type DragEvent, type ChangeEvent } from 'react';
import { Upload, ShieldCheck, Sparkles, AlertCircle, FileCode2 } from 'lucide-react';
import { useFaviconStore } from '../store/useFaviconStore';

const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#C8FF43" />
      <stop offset="100%" stop-color="#00E5FF" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="110" fill="#080A0F"/>
  <rect x="24" y="24" width="464" height="464" rx="90" fill="none" stroke="#2A3242" stroke-width="8"/>
  <path d="M140 180 L256 296 L372 180" fill="none" stroke="url(#grad)" stroke-width="48" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="256" cy="356" r="32" fill="#C8FF43"/>
</svg>`;

export function DropZone() {
  const loadFile = useFaviconStore((s) => s.loadFile);
  const isGenerating = useFaviconStore((s) => s.isGenerating);
  const error = useFaviconStore((s) => s.error);

  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      loadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      loadFile(e.target.files[0]);
    }
  };

  const handleLoadDemo = () => {
    const blob = new Blob([SAMPLE_SVG], { type: 'image/svg+xml' });
    const file = new File([blob], 'demo-icon.svg', { type: 'image/svg+xml' });
    loadFile(file);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isGenerating && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-[10px] p-8 sm:p-12 text-center cursor-pointer transition-all duration-150 ${
          isDragOver
            ? 'border-[#C8FF43] bg-[#C8FF43]/5 scale-[0.995]'
            : 'border-[#2A3242] hover:border-[#46536B] bg-[#111620]'
        } ${isGenerating ? 'pointer-events-none opacity-60' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".svg,.png,.jpg,.jpeg,.webp,image/svg+xml,image/png,image/jpeg,image/webp"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="w-14 h-14 rounded-[10px] bg-[#171D29] border border-[#2A3242] flex items-center justify-center text-[#C8FF43] mb-4 shadow-[0_3px_0_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform">
            <Upload className="w-7 h-7" />
          </div>

          <h3 className="font-['Space_Grotesk',sans-serif] font-bold text-lg sm:text-xl text-[#F4F2EC] mb-1">
            Drop your source image here, or{' '}
            <span className="text-[#C8FF43] underline underline-offset-4 decoration-[#C8FF43]/40">
              browse
            </span>
          </h3>

          <p className="text-xs sm:text-sm text-[#AAB7D0] mb-5">
            SVG (preferred), PNG, JPEG, or WebP. Recommend square at least 512×512px.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleLoadDemo();
              }}
              className="btn-tactile btn-tactile-dark text-xs py-1.5 px-3 rounded-[5px] flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C8FF43]" />
              <span>Try Demo SVG Icon</span>
            </button>
          </div>
        </div>

        {/* Local Security Indicator */}
        <div className="mt-6 pt-4 border-t border-[#2A3242]/60 flex items-center justify-center gap-2 text-[11px] font-mono text-[#7886A1]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C8FF43]" />
          <span>100% CLIENT-SIDE • ZERO SERVER HOPS • PRIVATE ON-DEVICE</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-[8px] p-4 text-xs font-mono text-red-400 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Error:</strong> {error}
          </div>
        </div>
      )}
    </div>
  );
}
