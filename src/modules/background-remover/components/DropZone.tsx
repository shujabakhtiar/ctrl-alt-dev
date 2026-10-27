import { useState, useRef } from 'react';
import { UploadCloud, Sparkles, ShieldCheck, Image as ImageIcon } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';

type DropZoneProps = {
  onFileSelect: (files: File[]) => void;
  onLoadSample: () => void;
  loading: boolean;
};

export function DropZone({ onFileSelect, onLoadSample, loading }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(Array.from(e.dataTransfer.files));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(Array.from(e.target.files));
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative cursor-pointer rounded-xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-200 ${
        isDragOver
          ? 'border-[#C8FF43] bg-[#162016]/40 shadow-[0_0_24px_rgba(200,255,67,0.2)]'
          : 'border-[#2A3242] hover:border-[#795BFF] bg-[#0E121A]/80 hover:bg-[#121722]'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        multiple
        className="hidden"
        onChange={handleInputChange}
      />

      <div className="flex flex-col items-center justify-center max-w-lg mx-auto">
        <div className="w-16 h-16 mb-4 rounded-2xl bg-[#111620] border border-[#2A3242] flex items-center justify-center text-[#C8FF43] shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          <UploadCloud className="w-8 h-8 animate-pulse" />
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Badge variant="lime">100% IN-BROWSER</Badge>
          <Badge variant="purple">SOLID & AI REMOVER</Badge>
        </div>

        <h3 className="font-['Space_Grotesk',sans-serif] font-bold text-xl sm:text-2xl text-[#F4F2EC] mb-2">
          Drop your AI graphic, logo, or photo
        </h3>
        <p className="text-sm text-[#AAB7D0] mb-6 leading-relaxed">
          Supports PNG, JPEG, WebP. Converts flat white backgrounds, green screens, or any solid color to clean transparency without halos.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            type="button"
            variant="lime"
            size="md"
            icon={<ImageIcon className="w-4 h-4" />}
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
            disabled={loading}
          >
            SELECT IMAGES
          </Button>

          <Button
            type="button"
            variant="outline"
            size="md"
            icon={<Sparkles className="w-4 h-4 text-[#C8FF43]" />}
            onClick={(e) => {
              e.stopPropagation();
              onLoadSample();
            }}
            disabled={loading}
          >
            TRY SAMPLE AI BADGE
          </Button>
        </div>

        <div className="mt-8 pt-6 border-t border-[#2A3242]/60 flex items-center gap-2 text-xs font-mono text-[#7886A1]">
          <ShieldCheck className="w-4 h-4 text-[#C8FF43]" />
          <span>ZERO SERVER HOPS • ZERO UPLOAD LAG • 100% PRIVATE CLIENT-SIDE ALGORITHM</span>
        </div>
      </div>
    </div>
  );
}
