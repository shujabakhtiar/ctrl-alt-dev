import { useState } from 'react';
import { Settings2, AlertTriangle, Info, HelpCircle } from 'lucide-react';
import { useFaviconStore } from '../store/useFaviconStore';
import { isValidHexColor, isShortNameLong } from '../lib/validation';

export function OptionsForm() {
  const options = useFaviconStore((s) => s.options);
  const updateOptions = useFaviconStore((s) => s.updateOptions);
  const source = useFaviconStore((s) => s.source);

  const [hexErrors, setHexErrors] = useState<{ theme?: string; bg?: string }>({});

  const handleThemeColorChange = (val: string) => {
    let clean = val.trim();
    if (!clean.startsWith('#') && clean.length > 0) {
      clean = '#' + clean;
    }
    if (isValidHexColor(clean)) {
      setHexErrors((e) => ({ ...e, theme: undefined }));
      updateOptions({ themeColor: clean });
    } else {
      setHexErrors((e) => ({ ...e, theme: 'Invalid hex (e.g. #080A0F)' }));
      updateOptions({ themeColor: val });
    }
  };

  const handleBgColorChange = (val: string) => {
    let clean = val.trim();
    if (!clean.startsWith('#') && clean.length > 0) {
      clean = '#' + clean;
    }
    if (isValidHexColor(clean)) {
      setHexErrors((e) => ({ ...e, bg: undefined }));
      updateOptions({ backgroundColor: clean });
    } else {
      setHexErrors((e) => ({ ...e, bg: 'Invalid hex (e.g. #FFFFFF)' }));
      updateOptions({ backgroundColor: val });
    }
  };

  const isShortNameTooLong = isShortNameLong(options.shortName);

  return (
    <div className="bg-[#111620] border border-[#2A3242] rounded-[10px] p-5 sm:p-6 space-y-6 shadow-[0_3px_0_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-between pb-3 border-b border-[#2A3242]">
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-[#C8FF43]" />
          <h3 className="font-['Space_Grotesk',sans-serif] font-bold text-base text-[#F4F2EC]">
            Package Options & Metadata
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171D29] text-[#7886A1] border border-[#2A3242]">
          ZOD VALIDATED
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* App Name */}
        <div>
          <label className="block text-xs font-mono text-[#AAB7D0] mb-1.5 uppercase">
            App Name (manifest name)
          </label>
          <input
            type="text"
            value={options.appName}
            onChange={(e) => updateOptions({ appName: e.target.value })}
            placeholder="My Cool Application"
            className="w-full bg-[#080A0F] border border-[#2A3242] focus:border-[#C8FF43] focus:outline-none rounded-[6px] px-3 py-2 text-xs font-mono text-[#F4F2EC]"
          />
        </div>

        {/* Short Name */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-mono text-[#AAB7D0] uppercase">
              Short Name (homescreen)
            </label>
            {isShortNameTooLong && (
              <span className="text-[10px] font-mono text-[#FFD84D] flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>&gt;12 chars (may truncate)</span>
              </span>
            )}
          </div>
          <input
            type="text"
            value={options.shortName}
            onChange={(e) => updateOptions({ shortName: e.target.value })}
            placeholder="App"
            className={`w-full bg-[#080A0F] border focus:outline-none rounded-[6px] px-3 py-2 text-xs font-mono text-[#F4F2EC] ${
              isShortNameTooLong
                ? 'border-[#FFD84D] focus:border-[#FFD84D]'
                : 'border-[#2A3242] focus:border-[#C8FF43]'
            }`}
          />
        </div>

        {/* Theme Color */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-mono text-[#AAB7D0] uppercase">
              Theme Color
            </label>
            {hexErrors.theme && (
              <span className="text-[10px] font-mono text-red-400">{hexErrors.theme}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={isValidHexColor(options.themeColor) ? options.themeColor : '#080A0F'}
              onChange={(e) => handleThemeColorChange(e.target.value)}
              className="w-8 h-8 rounded-[4px] cursor-pointer bg-transparent border border-[#2A3242] p-0.5"
            />
            <input
              type="text"
              value={options.themeColor}
              onChange={(e) => handleThemeColorChange(e.target.value)}
              className="flex-1 bg-[#080A0F] border border-[#2A3242] focus:border-[#C8FF43] focus:outline-none rounded-[6px] px-3 py-2 text-xs font-mono text-[#F4F2EC]"
            />
          </div>
        </div>

        {/* Background Color */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-mono text-[#AAB7D0] uppercase">
              Background Color (iOS & Maskable)
            </label>
            {hexErrors.bg && (
              <span className="text-[10px] font-mono text-red-400">{hexErrors.bg}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={isValidHexColor(options.backgroundColor) ? options.backgroundColor : '#FFFFFF'}
              onChange={(e) => handleBgColorChange(e.target.value)}
              className="w-8 h-8 rounded-[4px] cursor-pointer bg-transparent border border-[#2A3242] p-0.5"
            />
            <input
              type="text"
              value={options.backgroundColor}
              onChange={(e) => handleBgColorChange(e.target.value)}
              className="flex-1 bg-[#080A0F] border border-[#2A3242] focus:border-[#C8FF43] focus:outline-none rounded-[6px] px-3 py-2 text-xs font-mono text-[#F4F2EC]"
            />
          </div>
        </div>

        {/* Base Path Prefix */}
        <div>
          <label className="block text-xs font-mono text-[#AAB7D0] mb-1.5 uppercase">
            Base Path Prefix
          </label>
          <input
            type="text"
            value={options.basePath}
            onChange={(e) => updateOptions({ basePath: e.target.value })}
            placeholder="/"
            className="w-full bg-[#080A0F] border border-[#2A3242] focus:border-[#C8FF43] focus:outline-none rounded-[6px] px-3 py-2 text-xs font-mono text-[#F4F2EC]"
          />
          <p className="text-[11px] text-[#7886A1] mt-1 font-mono">
            Default is <code className="text-[#C8FF43]">/</code>. Use e.g. <code className="text-[#C8FF43]">/subfolder/</code> if deployed in a subpath.
          </p>
        </div>

        {/* Non-Square Strategy */}
        <div>
          <label className="block text-xs font-mono text-[#AAB7D0] mb-1.5 uppercase">
            Non-Square Source Strategy
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => updateOptions({ nonSquareStrategy: 'fit' })}
              className={`py-2 px-3 text-xs font-mono rounded-[5px] border transition-all ${
                options.nonSquareStrategy === 'fit'
                  ? 'bg-[#C8FF43] text-[#080A0F] border-[#C8FF43] font-bold shadow-[0_2px_0_#7BA512]'
                  : 'bg-[#080A0F] text-[#AAB7D0] border-[#2A3242] hover:text-[#F4F2EC]'
              }`}
            >
              Fit with padding
            </button>
            <button
              type="button"
              onClick={() => updateOptions({ nonSquareStrategy: 'crop' })}
              className={`py-2 px-3 text-xs font-mono rounded-[5px] border transition-all ${
                options.nonSquareStrategy === 'crop'
                  ? 'bg-[#C8FF43] text-[#080A0F] border-[#C8FF43] font-bold shadow-[0_2px_0_#7BA512]'
                  : 'bg-[#080A0F] text-[#AAB7D0] border-[#2A3242] hover:text-[#F4F2EC]'
              }`}
            >
              Crop to centre
            </button>
          </div>
        </div>
      </div>

      {/* Maskable Safe Zone Slider */}
      <div className="bg-[#080A0F] border border-[#2A3242] rounded-[8px] p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-xs font-mono font-bold text-[#F4F2EC]">
              Android Maskable Safe Zone Padding
            </span>
            <p className="text-[11px] text-[#7886A1]">
              Scales logo inside the guaranteed visible circle (~80% default).
            </p>
          </div>
          <span className="text-xs font-mono text-[#C8FF43] font-bold bg-[#171D29] px-2 py-0.5 rounded border border-[#2A3242]">
            {100 - options.maskablePadding}% scale ({options.maskablePadding}% padding)
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="40"
          step="5"
          value={options.maskablePadding}
          onChange={(e) => updateOptions({ maskablePadding: Number(e.target.value) })}
          className="w-full accent-[#C8FF43] cursor-pointer"
        />
      </div>

      {/* Toggles */}
      <div className="space-y-3 pt-2 border-t border-[#2A3242]">
        {/* Optimize with OxiPNG */}
        <label className="flex items-center justify-between cursor-pointer group">
          <div className="pr-4">
            <span className="text-xs font-mono font-bold text-[#F4F2EC] group-hover:text-[#C8FF43] transition-colors">
              Optimize PNGs with OxiPNG (Lossless)
            </span>
            <p className="text-[11px] text-[#7886A1]">
              Runs Rust/WASM OxiPNG optimization to produce the smallest possible PNG bytes.
            </p>
          </div>
          <input
            type="checkbox"
            checked={options.optimizePng}
            onChange={(e) => updateOptions({ optimizePng: e.target.checked })}
            className="w-4 h-4 accent-[#C8FF43] rounded cursor-pointer shrink-0"
          />
        </label>

        {/* Include Legacy Sizes */}
        <label className="flex items-center justify-between cursor-pointer group">
          <div className="pr-4">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono font-bold text-[#F4F2EC] group-hover:text-[#C8FF43] transition-colors">
                Include Extra Legacy Sizes
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#171D29] text-[#7886A1] rounded border border-[#2A3242]">
                OPTIONAL
              </span>
            </div>
            <p className="text-[11px] text-[#7886A1] mt-0.5">
              Generates extra 16×16/32×32 PNGs and iPad-specific touch icons. Modern browsers already use favicon.ico &amp; SVG.
            </p>
          </div>
          <input
            type="checkbox"
            checked={options.includeLegacy}
            onChange={(e) => updateOptions({ includeLegacy: e.target.checked })}
            className="w-4 h-4 accent-[#C8FF43] rounded cursor-pointer shrink-0"
          />
        </label>
      </div>

      {/* Source Image Warnings if any */}
      {source && source.warnings.length > 0 && (
        <div className="bg-[#171D29] border border-[#2A3242] rounded-[8px] p-3 text-xs font-mono text-[#FFD84D] space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <Info className="w-3.5 h-3.5" />
            <span>Source Image Notice:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-[#AAB7D0]">
            {source.warnings.map((w, idx) => (
              <li key={idx}>{w}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
