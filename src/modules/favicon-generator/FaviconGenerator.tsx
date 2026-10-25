import { useRef } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  Upload,
  X,
  RefreshCw,
  Archive,
  CheckCircle2,
} from 'lucide-react';
import { useFaviconStore } from './store/useFaviconStore';
import { DropZone } from './components/DropZone';
import { OptionsForm } from './components/OptionsForm';
import { PreviewPanel } from './components/PreviewPanel';
import { FileGrid } from './components/FileGrid';
import { SnippetPanel } from './components/SnippetPanel';
import { formatBytes } from '../../lib/format';

export function FaviconGenerator() {
  const source = useFaviconStore((s) => s.source);
  const files = useFaviconStore((s) => s.files);
  const isGenerating = useFaviconStore((s) => s.isGenerating);
  const generationProgress = useFaviconStore((s) => s.generationProgress);
  const loadFile = useFaviconStore((s) => s.loadFile);
  const clearSource = useFaviconStore((s) => s.clearSource);
  const regenerate = useFaviconStore((s) => s.regenerate);
  const downloadAllZip = useFaviconStore((s) => s.downloadAllZip);

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="max-w-6xl mx-auto py-2 space-y-6">
      {/* Tool Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-[8px] bg-[#C8FF43] flex items-center justify-center text-[#080A0F] shadow-[0_3px_0_#7BA512]">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-['Space_Grotesk',sans-serif] font-bold text-2xl sm:text-3xl text-[#F4F2EC]">
                Modern Favicon &amp; App Icon Suite
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C8FF43]/15 text-[#C8FF43] border border-[#C8FF43]/30 font-bold uppercase tracking-wider">
                100% IN-BROWSER
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#AAB7D0] mt-0.5">
              Drop ONE image. Get every needed modern asset, ICO container, PWA manifest, and copy-ready &lt;head&gt; tags. Zero server hops.
            </p>
          </div>
        </div>

        {/* Tactical Badges */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#7886A1] mt-3 pt-3 border-t border-[#2A3242]">
          <span className="flex items-center gap-1.5 text-[#AAB7D0]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C8FF43]" />
            Local Device Processing
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-[#AAB7D0]">
            <Layers className="w-3.5 h-3.5 text-[#00E5FF]" />
            Multi-Res ICO (16, 32, 48px)
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-[#AAB7D0]">
            <Cpu className="w-3.5 h-3.5 text-[#C8FF43]" />
            Vector &amp; OxiPNG Lanczos3 Pipeline
          </span>
        </div>
      </div>

      {/* Main Workspace */}
      {!source ? (
        <DropZone />
      ) : (
        <div className="space-y-6">
          {/* Active Workspace Header Bar */}
          <div className="bg-[#111620] border border-[#2A3242] rounded-[10px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_2px_0_rgba(0,0,0,0.4)]">
            {/* File Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[6px] bg-[#171D29] border border-[#2A3242] flex items-center justify-center p-1 shrink-0">
                <img
                  src={source.previewUrl}
                  alt={source.name}
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#F4F2EC] truncate max-w-[200px] sm:max-w-[320px]">
                    {source.name}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#C8FF43]/15 text-[#C8FF43] border border-[#C8FF43]/30 uppercase font-bold">
                    {source.type}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-[#7886A1] mt-0.5">
                  {source.width}×{source.height}px • {formatBytes(source.size)}
                  {source.isSquare ? ' • Square' : ' • Non-square'}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-tactile btn-tactile-dark text-xs py-1.5 px-3 rounded-[5px] flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Replace</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".svg,.png,.jpg,.jpeg,.webp,image/*"
                onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])}
                className="hidden"
              />

              <button
                type="button"
                onClick={clearSource}
                className="btn-tactile btn-tactile-dark text-xs py-1.5 px-3 rounded-[5px] text-red-400 hover:text-red-300 flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>

              <button
                type="button"
                onClick={downloadAllZip}
                disabled={isGenerating || files.length === 0}
                className="btn-tactile btn-tactile-lime text-xs py-1.5 px-3 rounded-[5px] font-bold flex items-center gap-1.5"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Download All (.ZIP)</span>
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          {isGenerating && generationProgress && (
            <div className="bg-[#111620] border border-[#C8FF43]/30 rounded-[8px] p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#C8FF43] font-bold flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-[#C8FF43] border-t-transparent rounded-full animate-spin" />
                  <span>{generationProgress.message}</span>
                </span>
                <span className="text-[#7886A1]">
                  Step {generationProgress.current} of {generationProgress.total}
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#080A0F] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C8FF43] transition-all duration-200"
                  style={{
                    width: `${Math.min(100, Math.round((generationProgress.current / generationProgress.total) * 100))}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Two-Column Grid: Options + Previews */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OptionsForm />
            <PreviewPanel />
          </div>

          {/* All Generated Files Grid */}
          <FileGrid />

          {/* Code Snippets & Placement */}
          <SnippetPanel />
        </div>
      )}
    </div>
  );
}

export default FaviconGenerator;
