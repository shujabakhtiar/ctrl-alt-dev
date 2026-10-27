import { useState } from 'react';
import {
  Sliders,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Download,
  Info,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Pipette,
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import type {
  RemovalMode,
  OutputFormat,
  RgbaColor,
  BackgroundDetectionResult,
} from '../types';

type ControlsPanelProps = {
  mode: RemovalMode;
  targetColor: RgbaColor | null;
  customHex: string;
  detectedResult: BackgroundDetectionResult | null;
  useCustomColor: boolean;
  tolerance: number;
  softness: number;
  decontaminate: boolean;
  shrink: number;
  smooth: number;
  removeIslands: boolean;
  islandSize: number;
  outputFormat: OutputFormat;
  submitting: boolean;
  isEyedropperActive: boolean;
  onModeChange: (mode: RemovalMode) => void;
  onColorChange: (color: RgbaColor) => void;
  onHexChange: (hex: string) => void;
  onToleranceChange: (val: number) => void;
  onSoftnessChange: (val: number) => void;
  onDecontaminateChange: (val: boolean) => void;
  onShrinkChange: (val: number) => void;
  onSmoothChange: (val: number) => void;
  onRemoveIslandsChange: (val: boolean) => void;
  onIslandSizeChange: (val: number) => void;
  onOutputFormatChange: (format: OutputFormat) => void;
  onExport: () => void;
  onEyedropperToggle: (active: boolean) => void;
  onResetAuto: () => void;
};

export function ControlsPanel({
  mode,
  customHex,
  detectedResult,
  useCustomColor,
  tolerance,
  softness,
  decontaminate,
  shrink,
  smooth,
  removeIslands,
  islandSize,
  outputFormat,
  submitting,
  isEyedropperActive,
  onModeChange,
  onHexChange,
  onToleranceChange,
  onSoftnessChange,
  onDecontaminateChange,
  onShrinkChange,
  onSmoothChange,
  onRemoveIslandsChange,
  onIslandSizeChange,
  onOutputFormatChange,
  onExport,
  onEyedropperToggle,
  onResetAuto,
}: ControlsPanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const presets = [
    { label: 'WHITE', hex: '#FFFFFF', color: '#FFFFFF' },
    { label: 'BLUE SCREEN', hex: '#0000FF', color: '#0055FF' },
    { label: 'GREEN SCREEN', hex: '#00FF00', color: '#00FF00' },
    { label: 'DARK SCREEN', hex: '#000000', color: '#000000' },
  ];

  return (
    <div className="flex flex-col gap-5 bg-[#111620] border border-[#2A3242] rounded-xl p-5 sm:p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#2A3242]">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[#C8FF43]" />
          <h3 className="font-['Space_Grotesk',sans-serif] font-bold text-lg text-[#F4F2EC]">
            Removal Controls
          </h3>
        </div>
        <Badge variant="lime">ALGORITHM V2</Badge>
      </div>

      {/* Target Color & Detection HUD */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="font-mono text-xs text-[#AAB7D0] uppercase font-bold">
            Target Background Colour
          </label>
          {useCustomColor && (
            <button
              type="button"
              onClick={onResetAuto}
              className="flex items-center gap-1 font-mono text-[11px] text-[#C8FF43] hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Auto</span>
            </button>
          )}
        </div>

        {/* Detection Card */}
        <div className="bg-[#080A0F] border border-[#2A3242] rounded-lg p-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-md border border-[#46536B] shadow-inner"
                style={{ backgroundColor: customHex }}
              />
              <div>
                <div className="font-mono text-sm font-bold text-[#F4F2EC]">
                  {customHex}
                </div>
                <div className="text-[11px] font-mono text-[#7886A1]">
                  {useCustomColor ? 'MANUAL OVERRIDE' : 'AUTO-DETECTED DOMINANT'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEyedropperToggle(!isEyedropperActive)}
                className={`p-2 rounded border transition-colors ${
                  isEyedropperActive
                    ? 'bg-[#795BFF] border-[#795BFF] text-white'
                    : 'bg-[#111620] border-[#2A3242] text-[#AAB7D0] hover:text-[#C8FF43]'
                }`}
                title="Eyedropper tool: sample from image"
              >
                <Pipette className="w-4 h-4" />
              </button>

              <div className="relative">
                <input
                  type="color"
                  value={customHex}
                  onChange={(e) => onHexChange(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border border-[#2A3242] p-0 bg-transparent"
                  title="Pick color"
                />
              </div>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#2A3242]/60">
            {presets.map((preset) => (
              <button
                key={preset.hex}
                type="button"
                onClick={() => onHexChange(preset.hex)}
                className={`font-mono text-[10px] px-2 py-1 rounded border transition-all ${
                  customHex.toUpperCase() === preset.hex.toUpperCase()
                    ? 'border-[#C8FF43] bg-[#162016] text-[#C8FF43] font-bold'
                    : 'border-[#2A3242] bg-[#111620] text-[#AAB7D0] hover:text-[#F4F2EC]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Low Confidence Warning */}
          {detectedResult && !detectedResult.isSolid && !useCustomColor && (
            <div className="flex items-start gap-2 bg-[#2D1B00] border border-[#FFB800]/50 rounded p-2.5 text-xs text-[#FFD666]">
              <AlertTriangle className="w-4 h-4 text-[#FFB800] shrink-0 mt-0.5" />
              <div className="leading-tight">
                <strong>Background doesn't look like a solid colour.</strong> Border confidence is{' '}
                {Math.round(detectedResult.confidence * 100)}%. Use the eyedropper or adjust tolerance.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mode Toggle: Contiguous vs Global */}
      <div>
        <label className="font-mono text-xs text-[#AAB7D0] uppercase font-bold block mb-2">
          Removal Strategy
        </label>
        <div className="grid grid-cols-2 gap-2 bg-[#080A0F] p-1.5 rounded-lg border border-[#2A3242]">
          <button
            type="button"
            onClick={() => onModeChange('contiguous')}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-md transition-all ${
              mode === 'contiguous'
                ? 'bg-[#C8FF43] text-[#080A0F] font-bold shadow'
                : 'text-[#AAB7D0] hover:text-[#F4F2EC]'
            }`}
          >
            <span className="font-mono text-xs">CONTIGUOUS</span>
            <span className="text-[10px] font-normal opacity-90">From Edges (Default)</span>
          </button>
          <button
            type="button"
            onClick={() => onModeChange('global')}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-md transition-all ${
              mode === 'global'
                ? 'bg-[#C8FF43] text-[#080A0F] font-bold shadow'
                : 'text-[#AAB7D0] hover:text-[#F4F2EC]'
            }`}
          >
            <span className="font-mono text-xs">GLOBAL</span>
            <span className="text-[10px] font-normal opacity-90">All Matching Pixels</span>
          </button>
        </div>
        <p className="text-[11px] text-[#7886A1] mt-1.5 leading-snug">
          {mode === 'contiguous'
            ? 'Floods inward from perimeter. Matching colors INSIDE the subject (eyes, teeth, shirts) stay protected.'
            : 'Removes matching background everywhere, including enclosed regions like donut holes or gaps between limbs.'}
        </p>
      </div>

      {/* Primary Sliders: Tolerance & Softness */}
      <div className="flex flex-col gap-4 bg-[#080A0F] p-4 rounded-lg border border-[#2A3242]">
        {/* Tolerance */}
        <div>
          <div className="flex justify-between items-center mb-1.5 font-mono text-xs">
            <span className="text-[#F4F2EC] font-bold">Colour Tolerance: {tolerance}</span>
            <span className="text-[#7886A1]">Inner Threshold</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={tolerance}
            onChange={(e) => onToleranceChange(Number(e.target.value))}
            className="w-full accent-[#C8FF43] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-[#7886A1] mt-0.5">
            <span>Tight (1)</span>
            <span>Balanced (18)</span>
            <span>Wide (100)</span>
          </div>
        </div>

        {/* Softness */}
        <div>
          <div className="flex justify-between items-center mb-1.5 font-mono text-xs">
            <span className="text-[#F4F2EC] font-bold">Edge Softness: {softness}</span>
            <span className="text-[#7886A1]">Anti-alias Ramp</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            value={softness}
            onChange={(e) => onSoftnessChange(Number(e.target.value))}
            className="w-full accent-[#C8FF43] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-[#7886A1] mt-0.5">
            <span>Sharp (0)</span>
            <span>Natural (8)</span>
            <span>Feathered (50)</span>
          </div>
        </div>
      </div>

      {/* Advanced Edge Cleanup Accordion */}
      <div className="border border-[#2A3242] rounded-lg overflow-hidden bg-[#080A0F]/50">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between p-3.5 text-xs font-mono font-bold text-[#F4F2EC] hover:bg-[#111620] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C8FF43]" />
            <span>ADVANCED EDGE CLEANUP</span>
          </div>
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAdvanced && (
          <div className="p-4 border-t border-[#2A3242] flex flex-col gap-4 text-xs">
            {/* Decontamination Toggle */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={decontaminate}
                onChange={(e) => onDecontaminateChange(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#C8FF43] rounded"
              />
              <div>
                <span className="font-bold text-[#F4F2EC] block">
                  Decontaminate Edge Colours (No Halo)
                </span>
                <span className="text-[11px] text-[#AAB7D0] leading-snug block">
                  Mathematically un-mixes background color from semi-transparent edge pixels to prevent white/blue fringes.
                </span>
              </div>
            </label>

            {/* Edge Shrink (Choke) */}
            <div>
              <div className="flex justify-between font-mono text-xs mb-1">
                <span className="text-[#F4F2EC]">Edge Choke: {shrink} px</span>
                <span className="text-[#7886A1]">Erode fringe</span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                value={shrink}
                onChange={(e) => onShrinkChange(Number(e.target.value))}
                className="w-full accent-[#C8FF43] cursor-pointer"
              />
            </div>

            {/* Edge Smooth */}
            <div>
              <div className="flex justify-between font-mono text-xs mb-1">
                <span className="text-[#F4F2EC]">Alpha Smooth: {smooth} px</span>
                <span className="text-[#7886A1]">Box softening</span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                value={smooth}
                onChange={(e) => onSmoothChange(Number(e.target.value))}
                className="w-full accent-[#C8FF43] cursor-pointer"
              />
            </div>

            {/* Remove Islands */}
            <div className="pt-2 border-t border-[#2A3242]/60">
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={removeIslands}
                  onChange={(e) => onRemoveIslandsChange(e.target.checked)}
                  className="w-4 h-4 accent-[#C8FF43] rounded"
                />
                <span className="font-bold text-[#F4F2EC]">Drop Small Stray Islands</span>
              </label>

              {removeIslands && (
                <div>
                  <div className="flex justify-between font-mono text-[11px] mb-1">
                    <span className="text-[#AAB7D0]">Max Island Size: {islandSize} px</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="50"
                    value={islandSize}
                    onChange={(e) => onIslandSizeChange(Number(e.target.value))}
                    className="w-full accent-[#C8FF43] cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Output Format & Action */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3 font-mono text-xs">
          <span className="text-[#AAB7D0]">EXPORT FORMAT:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOutputFormatChange('png')}
              className={`px-3 py-1 rounded border transition-colors ${
                outputFormat === 'png'
                  ? 'border-[#C8FF43] bg-[#162016] text-[#C8FF43] font-bold'
                  : 'border-[#2A3242] text-[#AAB7D0]'
              }`}
            >
              PNG (Lossless)
            </button>
            <button
              type="button"
              onClick={() => onOutputFormatChange('webp')}
              className={`px-3 py-1 rounded border transition-colors ${
                outputFormat === 'webp'
                  ? 'border-[#C8FF43] bg-[#162016] text-[#C8FF43] font-bold'
                  : 'border-[#2A3242] text-[#AAB7D0]'
              }`}
            >
              WebP (Alpha)
            </button>
          </div>
        </div>

        <Button
          type="button"
          variant="lime"
          size="lg"
          className="w-full font-bold shadow-lg"
          icon={<Download className="w-5 h-5" />}
          disabled={submitting}
          onClick={onExport}
        >
          {submitting
            ? 'ENCODING FULL RES...'
            : `DOWNLOAD TRANSPARENT ${outputFormat.toUpperCase()} →`}
        </Button>
      </div>
    </div>
  );
}
