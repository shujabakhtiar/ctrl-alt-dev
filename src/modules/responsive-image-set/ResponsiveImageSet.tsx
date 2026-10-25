import { useState } from 'react';
import { Layers, ShieldCheck, Sparkles, Cpu, Play, CheckCircle2, AlertTriangle, Smartphone, Tablet, Laptop, Monitor } from 'lucide-react';
import { DropZone } from './components/DropZone';
import { useResponsiveImageStore } from './store/useResponsiveImageStore';
import { formatBytes } from '../../lib/format';
import { getDeviceContextForWidth } from './lib/widths';
import type { OutputImageFormat } from './types';

export function ResponsiveImageSet() {
  const source = useResponsiveImageStore((s) => s.source);
  const variants = useResponsiveImageStore((s) => s.variants);
  const submitting = useResponsiveImageStore((s) => s.submitting);
  const runSingleVariantTest = useResponsiveImageStore((s) => s.runSingleVariantTest);

  const [testWidth, setTestWidth] = useState<number>(480);
  const [testFormat, setTestFormat] = useState<OutputImageFormat>('webp');

  const handleTestRun = () => {
    if (!source) return;
    runSingleVariantTest(testWidth, testFormat);
  };

  return (
    <div className="max-w-6xl mx-auto py-2">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-[8px] bg-[#C8FF43] flex items-center justify-center text-[#080A0F] shadow-[0_3px_0_#7BA512]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-['Space_Grotesk',sans-serif] font-bold text-2xl sm:text-3xl text-[#F4F2EC]">
                Responsive Image Set Generator
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C8FF43]/15 text-[#C8FF43] border border-[#C8FF43]/30 font-bold uppercase tracking-wider">
                WASM POWERED
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#AAB7D0] mt-0.5">
              Drop one image. Get multi-width modern formats (AVIF + WebP) and a ready-to-paste responsive snippet. 100% in-browser.
            </p>
          </div>
        </div>

        {/* Tactical badges */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#7886A1] mt-3 pt-3 border-t border-[#2A3242]">
          <span className="flex items-center gap-1.5 text-[#AAB7D0]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C8FF43]" />
            Zero Server Uploads
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-[#AAB7D0]">
            <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
            Lanczos3 Alpha-Safe Resizing
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-[#AAB7D0]">
            <Cpu className="w-3.5 h-3.5 text-[#C8FF43]" />
            Web Worker Concurrency
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="space-y-6">
        {/* Upload DropZone */}
        <DropZone />

        {/* Stage 2b: Pipeline Verification Card when source is present */}
        {source && (
          <div className="bg-[#111620] border border-[#2A3242] rounded-[10px] p-6 shadow-[0_4px_0_rgba(0,0,0,0.4)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-[#2A3242]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-['Space_Grotesk',sans-serif] font-bold text-lg text-[#F4F2EC]">
                    Stage 2b Pipeline Test: Decode &rarr; Resize &rarr; Encode
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C8FF43]/20 text-[#C8FF43] font-bold">
                    VALIDATION
                  </span>
                </div>
                <p className="text-xs text-[#AAB7D0]">
                  Verifies worker decode, Lanczos3 resizing, single-format WASM encode, and decode verification.
                </p>
              </div>

              <button
                type="button"
                onClick={handleTestRun}
                disabled={submitting}
                className="btn-tactile btn-tactile-lime text-xs py-2.5 px-5 font-bold rounded-[6px]"
              >
                {submitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-[#080A0F] border-t-transparent rounded-full animate-spin" />
                    <span>Processing in Worker...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Single-Width Encode</span>
                  </>
                )}
              </button>
            </div>

            {/* Test parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#080A0F] border border-[#2A3242] rounded-[8px] p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-mono text-[#7886A1] uppercase">
                      Target Width (Lanczos3)
                    </label>
                    <span className="text-[10px] font-mono text-[#C8FF43] font-bold">
                      {getDeviceContextForWidth(testWidth).device}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {[320, 480, 640, 768, 800, 1024, 1280, 1920].map((w) => {
                      const isTooWide = w > source.width;
                      const isSelected = testWidth === w;
                      const ctx = getDeviceContextForWidth(w);

                      return (
                        <button
                          key={w}
                          type="button"
                          disabled={isTooWide}
                          onClick={() => setTestWidth(w)}
                          title={`${w}px — ${ctx.device}: ${ctx.description}`}
                          className={`flex items-center gap-1.5 text-xs font-mono py-1.5 px-2.5 rounded-[5px] border transition-all ${
                            isSelected
                              ? 'bg-[#C8FF43] text-[#080A0F] border-[#C8FF43] font-bold shadow-[0_2px_0_#7BA512]'
                              : isTooWide
                              ? 'opacity-35 cursor-not-allowed border-transparent text-[#7886A1]'
                              : 'bg-[#171D29] text-[#AAB7D0] border-[#2A3242] hover:text-[#F4F2EC] hover:border-[#46536B]'
                          }`}
                        >
                          {w <= 640 ? (
                            <Smartphone className="w-3 h-3" />
                          ) : w <= 900 ? (
                            <Tablet className="w-3 h-3" />
                          ) : w <= 1440 ? (
                            <Laptop className="w-3 h-3" />
                          ) : (
                            <Monitor className="w-3 h-3" />
                          )}
                          <span>{w}px</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Contextual Device Breakdown Callout */}
                <div className="mt-3 pt-2.5 border-t border-[#2A3242]/70 flex items-start gap-2.5 bg-[#111620] p-2.5 rounded-[6px] border border-[#2A3242]">
                  <div className="w-5 h-5 rounded-[4px] bg-[#C8FF43]/20 text-[#C8FF43] flex items-center justify-center shrink-0 mt-0.5">
                    {testWidth <= 640 ? (
                      <Smartphone className="w-3.5 h-3.5" />
                    ) : testWidth <= 900 ? (
                      <Tablet className="w-3.5 h-3.5" />
                    ) : testWidth <= 1440 ? (
                      <Laptop className="w-3.5 h-3.5" />
                    ) : (
                      <Monitor className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#F4F2EC]">
                      <span>{getDeviceContextForWidth(testWidth).device}</span>
                      <span className="font-mono text-[10px] text-[#C8FF43] bg-[#080A0F] px-1.5 py-0.2 rounded border border-[#2A3242]">
                        {testWidth}px
                      </span>
                    </div>
                    <p className="text-[11px] text-[#AAB7D0] leading-snug mt-0.5">
                      {getDeviceContextForWidth(testWidth).description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#080A0F] border border-[#2A3242] rounded-[8px] p-4">
                <label className="block text-xs font-mono text-[#7886A1] uppercase mb-2">
                  Format Codec
                </label>
                <div className="flex items-center gap-2">
                  {(['webp', 'avif', 'jpeg', 'png'] as OutputImageFormat[]).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setTestFormat(fmt)}
                      className={`text-xs font-mono py-1.5 px-3 rounded-[5px] uppercase border transition-all ${
                        testFormat === fmt
                          ? 'bg-[#C8FF43] text-[#080A0F] border-[#C8FF43] font-bold shadow-[0_2px_0_#7BA512]'
                          : 'bg-[#171D29] text-[#AAB7D0] border-[#2A3242] hover:text-[#F4F2EC]'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Test Variant Results */}
            {variants.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-mono text-xs uppercase text-[#7886A1] tracking-wider">
                  Test Variant Output:
                </h4>
                {variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="bg-[#080A0F] border border-[#2A3242] rounded-[8px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      {variant.status === 'done' ? (
                        <CheckCircle2 className="w-5 h-5 text-[#C8FF43] shrink-0" />
                      ) : variant.status === 'failed' ? (
                        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                      ) : (
                        <span className="w-4 h-4 border-2 border-[#C8FF43] border-t-transparent rounded-full animate-spin shrink-0" />
                      )}

                      <div>
                        <div className="flex items-center gap-2 font-mono text-xs text-[#F4F2EC]">
                          <strong className="text-sm font-bold">{variant.filename}</strong>
                          <span className="px-1.5 py-0.5 rounded bg-[#171D29] text-[#7886A1] border border-[#2A3242]">
                            {variant.width} × {variant.height} px
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-[#171D29] text-[#C8FF43] border border-[#2A3242] uppercase">
                            {variant.format}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-[#7886A1] mt-0.5">
                          Status: <span className="text-[#AAB7D0] uppercase font-bold">{variant.status}</span>
                          {variant.size && ` • ${formatBytes(variant.size)}`}
                          {variant.savingsPercent !== undefined && ` • ${variant.savingsPercent}% saved vs source`}
                          {variant.error && ` • Error: ${variant.error}`}
                        </div>
                      </div>
                    </div>

                    {variant.url && (
                      <div className="flex items-center gap-3">
                        <img
                          src={variant.url}
                          alt="preview"
                          className="w-12 h-12 object-cover rounded-[6px] border border-[#2A3242] bg-[#111620]"
                        />
                        <a
                          href={variant.url}
                          download={variant.filename}
                          className="btn-tactile btn-tactile-dark text-xs py-1.5 px-3 rounded-[5px]"
                        >
                          Download Single
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResponsiveImageSet;
