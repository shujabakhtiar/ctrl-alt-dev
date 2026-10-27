import { CheckCircle2, AlertTriangle, Loader2, Download, Archive, RefreshCw } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { formatBytes } from '../../../lib/format';
import type { BatchFileItem } from '../types';

type BatchQueueProps = {
  items: BatchFileItem[];
  activeIndex: number;
  isProcessing: boolean;
  onSelectItem: (index: number) => void;
  onProcessAll: () => void;
  onDownloadZip: () => void;
};

export function BatchQueue({
  items,
  activeIndex,
  isProcessing,
  onSelectItem,
  onProcessAll,
  onDownloadZip,
}: BatchQueueProps) {
  const completedCount = items.filter((i) => i.status === 'done').length;

  return (
    <div className="flex flex-col gap-4 bg-[#111620] border border-[#2A3242] rounded-xl p-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#2A3242]">
        <div>
          <h3 className="font-['Space_Grotesk',sans-serif] font-bold text-lg text-[#F4F2EC]">
            Batch Queue ({items.length} Images)
          </h3>
          <p className="text-xs text-[#AAB7D0]">
            {completedCount} of {items.length} processed. Click any image to preview and edit its settings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={<RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />}
            disabled={isProcessing}
            onClick={onProcessAll}
          >
            {isProcessing ? 'PROCESSING BATCH...' : 'PROCESS ALL'}
          </Button>

          {completedCount > 0 && (
            <Button
              type="button"
              variant="lime"
              size="sm"
              icon={<Archive className="w-3.5 h-3.5" />}
              onClick={onDownloadZip}
            >
              DOWNLOAD ZIP ({completedCount})
            </Button>
          )}
        </div>
      </div>

      {/* Items List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
        {items.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => onSelectItem(idx)}
            className={`cursor-pointer rounded-lg border p-3 flex items-center justify-between transition-all ${
              activeIndex === idx
                ? 'border-[#C8FF43] bg-[#162016]/40 shadow-[0_0_12px_rgba(200,255,67,0.15)]'
                : 'border-[#2A3242] bg-[#080A0F] hover:border-[#46536B]'
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded bg-[#111620] border border-[#2A3242] flex items-center justify-center shrink-0 overflow-hidden">
                {item.processedUrl ? (
                  <img
                    src={item.processedUrl}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                ) : item.originalUrl ? (
                  <img
                    src={item.originalUrl}
                    alt={item.name}
                    className="w-full h-full object-contain opacity-70"
                  />
                ) : (
                  <span className="font-mono text-[10px] text-[#7886A1]">IMG</span>
                )}
              </div>

              <div className="overflow-hidden text-left">
                <span className="font-mono text-xs text-[#F4F2EC] truncate block max-w-[130px]">
                  {item.name}
                </span>
                <span className="font-mono text-[10px] text-[#7886A1] block">
                  {formatBytes(item.size)}
                </span>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-1.5">
              {item.status === 'processing' && (
                <Loader2 className="w-4 h-4 animate-spin text-[#C8FF43]" />
              )}
              {item.status === 'done' && (
                <CheckCircle2 className="w-4 h-4 text-[#C8FF43]" />
              )}
              {item.warning && (
                <AlertTriangle
                  className="w-4 h-4 text-[#FFB800]"
                  title={item.warning}
                />
              )}
              {item.status === 'idle' && (
                <Badge variant="default">QUEUED</Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
