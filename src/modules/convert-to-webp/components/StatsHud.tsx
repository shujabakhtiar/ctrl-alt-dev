import { ArrowRight } from 'lucide-react';
import { useWebpStore } from '../store/useWebpStore';
import { formatBytes, calculateSavingsPercent } from '../../../lib/format';

export function StatsHud() {
  const fileData = useWebpStore((s) => s.fileData);
  const convertedData = useWebpStore((s) => s.convertedData);
  const submitting = useWebpStore((s) => s.submitting);

  if (!fileData) return null;

  const originalSize = fileData.originalSize;
  const convertedSize = convertedData?.size ?? 0;
  const savingsBytes = convertedData ? originalSize - convertedSize : 0;
  const savingsPercent = convertedData ? calculateSavingsPercent(originalSize, convertedSize) : 0;

  return (
    <div className="stats-hud">
      {/* Original Asset HUD */}
      <div className="hud-card original">
        <div className="hud-label">Original Asset</div>
        <div className="hud-val">{formatBytes(originalSize)}</div>
        <div className="hud-sub">
          Input resolution: {fileData.originalWidth}×{fileData.originalHeight}
        </div>
      </div>

      {/* Arrow separator */}
      <div className="hud-arrow">
        <ArrowRight className="w-6 h-6 text-[#7886A1]" />
      </div>

      {/* Compressed WebP HUD */}
      <div className="hud-card compressed">
        <div className="hud-label">Optimized WebP</div>
        <div className="hud-val">
          {convertedData ? formatBytes(convertedData.size) : submitting ? 'Compressing...' : 'Pending'}
        </div>
        <div className="hud-sub">
          {convertedData
            ? `${convertedData.width}×${convertedData.height} px • ${convertedData.timeMs}ms`
            : submitting
            ? 'Encoding canvas...'
            : 'Ready'}
        </div>
      </div>

      {/* Bandwidth Savings HUD */}
      <div className={`hud-card savings ${savingsBytes > 0 ? 'positive' : 'neutral'}`}>
        <div className="hud-label">Total Bandwidth Saved</div>
        <div className="hud-val">
          {savingsBytes > 0 ? `-${savingsPercent}%` : '0%'}
        </div>
        <div className="hud-sub">
          {savingsBytes > 0 ? `${formatBytes(savingsBytes)} saved` : 'Uncompressed / Larger'}
        </div>
      </div>
    </div>
  );
}
