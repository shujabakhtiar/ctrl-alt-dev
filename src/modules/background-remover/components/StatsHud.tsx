import { Cpu, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatBytes } from '../../../lib/format';
import type { ProcessResult } from '../types';

type StatsHudProps = {
  originalSize: number;
  width: number;
  height: number;
  result: ProcessResult | null;
  filename: string;
};

export function StatsHud({
  originalSize,
  width,
  height,
  result,
  filename,
}: StatsHudProps) {
  const stats = result?.stats;

  return (
    <div className="flex flex-col gap-3 bg-[#080A0F] border border-[#2A3242] rounded-xl p-4 sm:p-5 text-xs font-mono">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#2A3242]">
        <div className="flex items-center gap-2 text-[#F4F2EC]">
          <Cpu className="w-4 h-4 text-[#C8FF43]" />
          <span className="font-bold">{filename}</span>
          <span className="text-[#7886A1]">
            ({width} × {height} px)
          </span>
        </div>

        {stats && (
          <div className="flex items-center gap-3 text-[#AAB7D0]">
            <span className="flex items-center gap-1 text-[#C8FF43]">
              <Zap className="w-3.5 h-3.5" />
              <span>{stats.processingTimeMs} ms</span>
            </span>
            <span>•</span>
            <span>{formatBytes(originalSize)} original</span>
          </div>
        )}
      </div>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-[#111620] border border-[#2A3242] p-2.5 rounded-lg">
            <span className="text-[10px] text-[#7886A1] block">PIXELS CLEARED</span>
            <span className="text-sm font-bold text-[#C8FF43]">
              {Math.round((stats.removedPixels / stats.totalPixels) * 100)}%
            </span>
          </div>
          <div className="bg-[#111620] border border-[#2A3242] p-2.5 rounded-lg">
            <span className="text-[10px] text-[#7886A1] block">EDGE TRANSITION</span>
            <span className="text-sm font-bold text-[#F4F2EC]">
              {stats.partiallyTransparentPixels.toLocaleString()} px
            </span>
          </div>
          <div className="bg-[#111620] border border-[#2A3242] p-2.5 rounded-lg">
            <span className="text-[10px] text-[#7886A1] block">BORDER SOLIDITY</span>
            <span className="text-sm font-bold text-[#F4F2EC]">
              {Math.round(stats.confidence * 100)}%
            </span>
          </div>
          <div className="bg-[#111620] border border-[#2A3242] p-2.5 rounded-lg">
            <span className="text-[10px] text-[#7886A1] block">EXECUTION</span>
            <span className="text-sm font-bold text-[#795BFF]">LOCAL WASM</span>
          </div>
        </div>
      )}

      {/* Honest Limitations Note */}
      <div className="flex items-start gap-2 pt-2 text-[11px] text-[#7886A1] leading-relaxed">
        <AlertCircle className="w-4 h-4 text-[#795BFF] shrink-0 mt-0.5" />
        <span>
          <strong>Honest limitation:</strong> This tool uses perceptual color distance and iterative edge flood-filling. Extreme gradients, baked-in diffuse shadows, or subjects that share the exact background hue may require manual touch-up.
        </span>
      </div>
    </div>
  );
}
