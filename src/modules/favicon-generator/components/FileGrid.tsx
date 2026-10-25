import { Download, FileCode, Check, Archive, ExternalLink } from 'lucide-react';
import { useFaviconStore } from '../store/useFaviconStore';
import { formatBytes } from '../../../lib/format';
import type { GeneratedFile } from '../types';

export function FileGrid() {
  const files = useFaviconStore((s) => s.files);
  const downloadSingleFile = useFaviconStore((s) => s.downloadSingleFile);
  const downloadAllZip = useFaviconStore((s) => s.downloadAllZip);
  const isGenerating = useFaviconStore((s) => s.isGenerating);

  if (files.length === 0) return null;

  return (
    <div className="bg-[#111620] border border-[#2A3242] rounded-[10px] p-5 sm:p-6 space-y-5 shadow-[0_3px_0_rgba(0,0,0,0.4)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2A3242]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-['Space_Grotesk',sans-serif] font-bold text-base text-[#F4F2EC]">
              Generated Package Files ({files.length})
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C8FF43]/15 text-[#C8FF43] border border-[#C8FF43]/30 font-bold">
              MODERN MINIMAL
            </span>
          </div>
          <p className="text-xs text-[#AAB7D0]">
            Every file is generated 100% locally. Download individually or grab the entire flat ZIP.
          </p>
        </div>

        <button
          type="button"
          onClick={downloadAllZip}
          disabled={isGenerating}
          className="btn-tactile btn-tactile-lime text-xs py-2.5 px-4 font-bold flex items-center justify-center gap-2 shrink-0 rounded-[6px]"
        >
          <Archive className="w-4 h-4" />
          <span>Download All (.ZIP)</span>
        </button>
      </div>

      {/* Grid of File Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {files.map((file) => (
          <div
            key={file.id}
            className="bg-[#080A0F] border border-[#2A3242] hover:border-[#46536B] rounded-[8px] p-3.5 flex items-center justify-between gap-3 transition-colors group"
          >
            {/* Visual Thumbnail or Icon */}
            <div className="w-11 h-11 rounded-[6px] bg-[#171D29] border border-[#2A3242] flex items-center justify-center shrink-0 overflow-hidden p-1">
              {file.type.startsWith('image/') || file.name.endsWith('.ico') ? (
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <FileCode className="w-5 h-5 text-[#C8FF43]" />
              )}
            </div>

            {/* Details */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs font-bold text-[#F4F2EC] truncate">
                  {file.name}
                </span>
                {file.purpose && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#171D29] text-[#C8FF43] border border-[#2A3242] uppercase">
                    {file.purpose}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-[10px] font-mono text-[#7886A1] mt-0.5">
                <span>
                  {file.dimensions
                    ? `${file.dimensions.width}×${file.dimensions.height}px`
                    : file.name.endsWith('.ico')
                    ? '16, 32, 48px'
                    : file.type.includes('svg')
                    ? 'Vector SVG'
                    : 'Text'}
                </span>
                <span>•</span>
                <span>{formatBytes(file.size)}</span>
              </div>
            </div>

            {/* Single Download Button */}
            <button
              type="button"
              onClick={() => downloadSingleFile(file)}
              title={`Download ${file.name}`}
              className="p-2 rounded-[5px] bg-[#171D29] hover:bg-[#2A3242] text-[#AAB7D0] hover:text-[#C8FF43] border border-[#2A3242] transition-colors shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
