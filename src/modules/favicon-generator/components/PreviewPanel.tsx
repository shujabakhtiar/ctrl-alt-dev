import { useState } from 'react';
import {
  Monitor,
  Smartphone,
  CheckCircle2,
  Lock,
  X,
  Sparkles,
  Layers,
  Circle,
  Square,
  Shield,
  Apple,
} from 'lucide-react';
import { useFaviconStore } from '../store/useFaviconStore';

export function PreviewPanel() {
  const options = useFaviconStore((s) => s.options);
  const files = useFaviconStore((s) => s.files);
  const source = useFaviconStore((s) => s.source);
  const activePreviewTab = useFaviconStore((s) => s.activePreviewTab);
  const setActivePreviewTab = useFaviconStore((s) => s.setActivePreviewTab);

  const [androidMask, setAndroidMask] = useState<'circle' | 'squircle' | 'none'>('circle');
  const [showSafeZoneGuide, setShowSafeZoneGuide] = useState(true);

  // Find relevant generated files for display
  const faviconFile = files.find((f) => f.name === 'favicon.ico');
  const svgFile = files.find((f) => f.name === 'icon.svg');
  const appleFile = files.find((f) => f.name === 'apple-touch-icon.png');
  const maskableFile = files.find((f) => f.name === 'icon-512-maskable.png');
  const icon192File = files.find((f) => f.name === 'icon-192.png');

  const tabFaviconUrl = faviconFile?.url || svgFile?.url || source?.previewUrl;
  const appleTouchUrl = appleFile?.url || source?.previewUrl;
  const maskableUrl = maskableFile?.url || source?.previewUrl;

  return (
    <div className="bg-[#111620] border border-[#2A3242] rounded-[10px] p-5 sm:p-6 shadow-[0_3px_0_rgba(0,0,0,0.4)]">
      {/* Header with Mockup Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2A3242] mb-6">
        <div>
          <h3 className="font-['Space_Grotesk',sans-serif] font-bold text-base text-[#F4F2EC]">
            Device & Platform Previews
          </h3>
          <p className="text-xs text-[#AAB7D0]">
            Live rendering across desktop browsers, iOS home screen, and Android adaptive masks.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 bg-[#080A0F] p-1 rounded-[6px] border border-[#2A3242]">
          <button
            type="button"
            onClick={() => setActivePreviewTab('browser')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] text-xs font-mono transition-all ${
              activePreviewTab === 'browser'
                ? 'bg-[#C8FF43] text-[#080A0F] font-bold shadow-[0_2px_0_#7BA512]'
                : 'text-[#AAB7D0] hover:text-[#F4F2EC]'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Browser Tab</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePreviewTab('ios')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] text-xs font-mono transition-all ${
              activePreviewTab === 'ios'
                ? 'bg-[#C8FF43] text-[#080A0F] font-bold shadow-[0_2px_0_#7BA512]'
                : 'text-[#AAB7D0] hover:text-[#F4F2EC]'
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            <span>iOS Screen</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePreviewTab('android')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] text-xs font-mono transition-all ${
              activePreviewTab === 'android'
                ? 'bg-[#C8FF43] text-[#080A0F] font-bold shadow-[0_2px_0_#7BA512]'
                : 'text-[#AAB7D0] hover:text-[#F4F2EC]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android Mask</span>
          </button>
        </div>
      </div>

      {/* 1. BROWSER TAB PREVIEWS (Light & Dark Chrome/Safari UI) */}
      {activePreviewTab === 'browser' && (
        <div className="space-y-6">
          {/* Dark Mode Browser Chrome */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-[#7886A1] uppercase">
                Dark Mode Desktop Browser
              </span>
              <span className="text-[10px] font-mono text-[#C8FF43]">16px &amp; 32px</span>
            </div>

            <div className="bg-[#202124] rounded-[8px] overflow-hidden border border-[#3C4043] shadow-lg">
              {/* Tab Bar */}
              <div className="bg-[#1f2023] px-3 pt-2.5 flex items-center gap-2 border-b border-[#3c4043]">
                {/* Traffic lights */}
                <div className="flex items-center gap-1.5 mr-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                </div>

                {/* Active Tab */}
                <div className="bg-[#292a2d] text-[#e8eaed] px-3 py-1.5 rounded-t-[8px] flex items-center gap-2 text-xs max-w-[200px] border-t border-x border-[#3c4043]">
                  {tabFaviconUrl ? (
                    <img
                      src={tabFaviconUrl}
                      alt="favicon"
                      className="w-4 h-4 shrink-0 object-contain"
                    />
                  ) : (
                    <div className="w-4 h-4 rounded bg-[#3c4043]" />
                  )}
                  <span className="truncate font-sans font-medium text-[11px]">
                    {options.appName || 'My App'}
                  </span>
                  <X className="w-3 h-3 text-[#9aa0a6] ml-auto shrink-0 cursor-pointer" />
                </div>

                {/* Inactive Tab */}
                <div className="text-[#9aa0a6] px-3 py-1.5 text-xs flex items-center gap-2 max-w-[140px] opacity-70">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#3c4043]" />
                  <span className="truncate text-[11px]">GitHub</span>
                </div>
              </div>

              {/* URL Bar */}
              <div className="bg-[#292a2d] px-4 py-2 flex items-center gap-3">
                <div className="flex-1 bg-[#202124] rounded-full px-3 py-1 flex items-center gap-2 text-[11px] text-[#9aa0a6] font-mono border border-[#3c4043]">
                  <Lock className="w-3 h-3 text-[#8ab4f8]" />
                  <span className="text-[#e8eaed]">https://{options.shortName.toLowerCase().replace(/\s+/g, '') || 'myapp'}.dev</span>
                  <span className="text-[#5f6368]">{options.basePath}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Light Mode Browser Chrome */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-[#7886A1] uppercase">
                Light Mode Desktop Browser
              </span>
              <span className="text-[10px] font-mono text-[#7886A1]">High Contrast Contrast Check</span>
            </div>

            <div className="bg-[#FFFFFF] rounded-[8px] overflow-hidden border border-[#D1D5DB] shadow-lg">
              {/* Tab Bar */}
              <div className="bg-[#E5E7EB] px-3 pt-2.5 flex items-center gap-2 border-b border-[#D1D5DB]">
                <div className="flex items-center gap-1.5 mr-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                </div>

                {/* Active Tab */}
                <div className="bg-[#FFFFFF] text-[#1F2937] px-3 py-1.5 rounded-t-[8px] flex items-center gap-2 text-xs max-w-[200px] border-t border-x border-[#D1D5DB] shadow-sm">
                  {tabFaviconUrl ? (
                    <img
                      src={tabFaviconUrl}
                      alt="favicon"
                      className="w-4 h-4 shrink-0 object-contain"
                    />
                  ) : (
                    <div className="w-4 h-4 rounded bg-[#E5E7EB]" />
                  )}
                  <span className="truncate font-sans font-medium text-[11px]">
                    {options.appName || 'My App'}
                  </span>
                  <X className="w-3 h-3 text-[#6B7280] ml-auto shrink-0 cursor-pointer" />
                </div>

                {/* Inactive Tab */}
                <div className="text-[#6B7280] px-3 py-1.5 text-xs flex items-center gap-2 max-w-[140px] opacity-60">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#D1D5DB]" />
                  <span className="truncate text-[11px]">Google</span>
                </div>
              </div>

              {/* URL Bar */}
              <div className="bg-[#F3F4F6] px-4 py-2 flex items-center gap-3">
                <div className="flex-1 bg-[#FFFFFF] rounded-full px-3 py-1 flex items-center gap-2 text-[11px] text-[#4B5563] font-mono border border-[#E5E7EB]">
                  <Lock className="w-3 h-3 text-[#2563EB]" />
                  <span className="text-[#111827]">https://{options.shortName.toLowerCase().replace(/\s+/g, '') || 'myapp'}.dev</span>
                  <span className="text-[#9CA3AF]">{options.basePath}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. iOS HOME SCREEN MOCK */}
      {activePreviewTab === 'ios' && (
        <div className="flex flex-col items-center">
          <div className="w-full max-w-[320px] bg-gradient-to-b from-[#1c2438] via-[#0b101e] to-[#05070d] rounded-[36px] border-[5px] border-[#2A3242] p-6 shadow-2xl relative">
            {/* Dynamic Island / Notch */}
            <div className="w-24 h-4 bg-black rounded-full mx-auto mb-4" />

            {/* iOS Status Bar */}
            <div className="flex justify-between items-center text-[10px] text-white/80 font-mono px-2 mb-6">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <span>5G</span>
                <div className="w-3.5 h-2 border border-white/80 rounded-[2px] p-0.5">
                  <div className="w-full h-full bg-white/80" />
                </div>
              </div>
            </div>

            {/* iOS App Grid */}
            <div className="grid grid-cols-4 gap-4 mb-10 text-center">
              {/* 1. User App */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  {appleTouchUrl ? (
                    <img
                      src={appleTouchUrl}
                      alt="Apple Touch Icon"
                      className="w-14 h-14 rounded-[13px] shadow-[0_6px_14px_rgba(0,0,0,0.4)] object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-[13px] bg-[#C8FF43] shadow-[0_6px_14px_rgba(0,0,0,0.4)]" />
                  )}
                  {/* Subtle gloss overlay standard on iOS */}
                  <div className="absolute inset-0 rounded-[13px] ring-1 ring-inset ring-white/15 pointer-events-none" />
                </div>
                <span className="text-[10px] text-white font-sans font-medium mt-1.5 truncate max-w-[62px]">
                  {options.shortName || 'App'}
                </span>
              </div>

              {/* Dummy iOS Apps for context */}
              <div className="flex flex-col items-center opacity-40">
                <div className="w-14 h-14 rounded-[13px] bg-[#007AFF] flex items-center justify-center text-white text-xs font-bold shadow-md">
                  Safari
                </div>
                <span className="text-[10px] text-white font-sans mt-1.5">Safari</span>
              </div>

              <div className="flex flex-col items-center opacity-40">
                <div className="w-14 h-14 rounded-[13px] bg-[#34C759] flex items-center justify-center text-white text-xs font-bold shadow-md">
                  Phone
                </div>
                <span className="text-[10px] text-white font-sans mt-1.5">Messages</span>
              </div>

              <div className="flex flex-col items-center opacity-40">
                <div className="w-14 h-14 rounded-[13px] bg-[#5856D6] flex items-center justify-center text-white text-xs font-bold shadow-md">
                  Music
                </div>
                <span className="text-[10px] text-white font-sans mt-1.5">Music</span>
              </div>
            </div>

            {/* iOS Dock */}
            <div className="bg-white/10 backdrop-blur-md rounded-[24px] p-2 flex justify-around items-center border border-white/10">
              <div className="w-11 h-11 rounded-[11px] bg-[#34C759]/80" />
              <div className="w-11 h-11 rounded-[11px] bg-[#007AFF]/80" />
              <div className="w-11 h-11 rounded-[11px] bg-[#FF9500]/80" />
              <div className="w-11 h-11 rounded-[11px] bg-[#5856D6]/80" />
            </div>

            {/* Home indicator bar */}
            <div className="w-28 h-1 bg-white/40 rounded-full mx-auto mt-4" />
          </div>

          <p className="text-[11px] font-mono text-[#7886A1] mt-4 text-center">
            Apple Touch Icon (180×180px) flattened onto <code className="text-[#C8FF43]">{options.backgroundColor}</code>. iOS automatically masks continuous squircle curvature.
          </p>
        </div>
      )}

      {/* 3. ANDROID MASKABLE PREVIEW */}
      {activePreviewTab === 'android' && (
        <div className="space-y-6">
          {/* Controls toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#080A0F] p-3 rounded-[8px] border border-[#2A3242]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#7886A1] uppercase">Shape Mask:</span>
              <button
                type="button"
                onClick={() => setAndroidMask('circle')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-[4px] border ${
                  androidMask === 'circle'
                    ? 'bg-[#C8FF43] text-[#080A0F] border-[#C8FF43] font-bold'
                    : 'bg-[#171D29] text-[#AAB7D0] border-[#2A3242]'
                }`}
              >
                <Circle className="w-3 h-3" />
                <span>Pixel Circle</span>
              </button>
              <button
                type="button"
                onClick={() => setAndroidMask('squircle')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-[4px] border ${
                  androidMask === 'squircle'
                    ? 'bg-[#C8FF43] text-[#080A0F] border-[#C8FF43] font-bold'
                    : 'bg-[#171D29] text-[#AAB7D0] border-[#2A3242]'
                }`}
              >
                <Square className="w-3 h-3" />
                <span>One UI Squircle</span>
              </button>
              <button
                type="button"
                onClick={() => setAndroidMask('none')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-[4px] border ${
                  androidMask === 'none'
                    ? 'bg-[#C8FF43] text-[#080A0F] border-[#C8FF43] font-bold'
                    : 'bg-[#171D29] text-[#AAB7D0] border-[#2A3242]'
                }`}
              >
                <span>Full Canvas</span>
              </button>
            </div>

            <label className="flex items-center gap-1.5 text-xs font-mono text-[#AAB7D0] cursor-pointer">
              <input
                type="checkbox"
                checked={showSafeZoneGuide}
                onChange={(e) => setShowSafeZoneGuide(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#C8FF43] rounded"
              />
              <span>Show 80% Safe Zone Guide</span>
            </label>
          </div>

          {/* Interactive Android Icon Box */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4">
            <div className="relative">
              {/* Base Canvas */}
              <div
                className={`w-48 h-48 sm:w-56 sm:h-56 overflow-hidden transition-all duration-300 relative shadow-2xl ${
                  androidMask === 'circle'
                    ? 'rounded-full'
                    : androidMask === 'squircle'
                    ? 'rounded-[28%]'
                    : 'rounded-[8px]'
                }`}
                style={{ backgroundColor: options.backgroundColor }}
              >
                {maskableUrl && (
                  <img
                    src={maskableUrl}
                    alt="Maskable Icon"
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Safe Zone Guide Overlay */}
                {showSafeZoneGuide && (
                  <div
                    className="absolute inset-[10%] rounded-full border-2 border-dashed border-[#00E5FF]/80 pointer-events-none flex items-center justify-center shadow-[0_0_12px_rgba(0,229,255,0.3)]"
                    title="80% Safe Zone (guaranteed visible across all OEM masks)"
                  >
                    <span className="text-[10px] font-mono text-[#00E5FF] bg-[#080A0F]/80 px-1.5 py-0.5 rounded border border-[#00E5FF]/40">
                      SAFE ZONE (80%)
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="max-w-xs space-y-3 text-xs font-mono">
              <div className="bg-[#080A0F] p-3.5 rounded-[8px] border border-[#2A3242] space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#C8FF43] font-bold">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Maskable Compliance</span>
                </div>
                <p className="text-[11px] text-[#AAB7D0]">
                  Android 8.0+ crops app icons into device-specific shapes (circle, squircle, pebble). The centered content stays protected within the 80% safe zone.
                </p>
              </div>

              <div className="text-[11px] text-[#7886A1] space-y-1">
                <div>• Canvas Dimension: 512×512px</div>
                <div>• Purpose: <code className="text-[#C8FF43]">"maskable"</code> (Own entry)</div>
                <div>• Background: <code className="text-[#C8FF43]">{options.backgroundColor}</code></div>
                <div>• Padding: <code className="text-[#C8FF43]">{options.maskablePadding}%</code></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
