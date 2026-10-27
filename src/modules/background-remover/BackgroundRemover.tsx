import { useEffect } from 'react';
import { useBackgroundRemoverStore } from './store/useBackgroundRemoverStore';
import { DropZone } from './components/DropZone';
import { PreviewPanel } from './components/PreviewPanel';
import { ControlsPanel } from './components/ControlsPanel';
import { StatsHud } from './components/StatsHud';
import { BatchQueue } from './components/BatchQueue';
import Button from '../../components/ui/Button';
import { ArrowLeft, Trash2, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export function BackgroundRemover() {
  const file = useBackgroundRemoverStore((s) => s.file);
  const filename = useBackgroundRemoverStore((s) => s.filename);
  const originalSize = useBackgroundRemoverStore((s) => s.originalSize);
  const originalUrl = useBackgroundRemoverStore((s) => s.originalUrl);
  const processedPreviewUrl = useBackgroundRemoverStore((s) => s.processedPreviewUrl);
  const processedResult = useBackgroundRemoverStore((s) => s.processedResult);
  const isProcessingPreview = useBackgroundRemoverStore((s) => s.isProcessingPreview);
  const loading = useBackgroundRemoverStore((s) => s.loading);
  const submitting = useBackgroundRemoverStore((s) => s.submitting);
  const error = useBackgroundRemoverStore((s) => s.error);

  const mode = useBackgroundRemoverStore((s) => s.mode);
  const targetColor = useBackgroundRemoverStore((s) => s.targetColor);
  const customHex = useBackgroundRemoverStore((s) => s.customHex);
  const detectedResult = useBackgroundRemoverStore((s) => s.detectedResult);
  const useCustomColor = useBackgroundRemoverStore((s) => s.useCustomColor);
  const tolerance = useBackgroundRemoverStore((s) => s.tolerance);
  const softness = useBackgroundRemoverStore((s) => s.softness);
  const decontaminate = useBackgroundRemoverStore((s) => s.decontaminate);
  const shrink = useBackgroundRemoverStore((s) => s.shrink);
  const smooth = useBackgroundRemoverStore((s) => s.smooth);
  const removeIslands = useBackgroundRemoverStore((s) => s.removeIslands);
  const islandSize = useBackgroundRemoverStore((s) => s.islandSize);

  const backdropMode = useBackgroundRemoverStore((s) => s.backdropMode);
  const customBackdropHex = useBackgroundRemoverStore((s) => s.customBackdropHex);
  const viewMode = useBackgroundRemoverStore((s) => s.viewMode);
  const splitPosition = useBackgroundRemoverStore((s) => s.splitPosition);
  const zoom = useBackgroundRemoverStore((s) => s.zoom);
  const pan = useBackgroundRemoverStore((s) => s.pan);
  const isEyedropperActive = useBackgroundRemoverStore((s) => s.isEyedropperActive);
  const outputFormat = useBackgroundRemoverStore((s) => s.outputFormat);

  const batchItems = useBackgroundRemoverStore((s) => s.batchItems);
  const activeBatchIndex = useBackgroundRemoverStore((s) => s.activeBatchIndex);
  const isProcessingBatch = useBackgroundRemoverStore((s) => s.isProcessingBatch);

  // Actions
  const loadFile = useBackgroundRemoverStore((s) => s.loadFile);
  const loadMultipleFiles = useBackgroundRemoverStore((s) => s.loadMultipleFiles);
  const loadSampleImage = useBackgroundRemoverStore((s) => s.loadSampleImage);
  const setMode = useBackgroundRemoverStore((s) => s.setMode);
  const setTargetColor = useBackgroundRemoverStore((s) => s.setTargetColor);
  const setTargetHex = useBackgroundRemoverStore((s) => s.setTargetHex);
  const setTolerance = useBackgroundRemoverStore((s) => s.setTolerance);
  const setSoftness = useBackgroundRemoverStore((s) => s.setSoftness);
  const setDecontaminate = useBackgroundRemoverStore((s) => s.setDecontaminate);
  const setShrink = useBackgroundRemoverStore((s) => s.setShrink);
  const setSmooth = useBackgroundRemoverStore((s) => s.setSmooth);
  const setRemoveIslands = useBackgroundRemoverStore((s) => s.setRemoveIslands);
  const setIslandSize = useBackgroundRemoverStore((s) => s.setIslandSize);
  const setBackdropMode = useBackgroundRemoverStore((s) => s.setBackdropMode);
  const setCustomBackdropHex = useBackgroundRemoverStore((s) => s.setCustomBackdropHex);
  const setViewMode = useBackgroundRemoverStore((s) => s.setViewMode);
  const setSplitPosition = useBackgroundRemoverStore((s) => s.setSplitPosition);
  const setZoom = useBackgroundRemoverStore((s) => s.setZoom);
  const setPan = useBackgroundRemoverStore((s) => s.setPan);
  const setIsEyedropperActive = useBackgroundRemoverStore((s) => s.setIsEyedropperActive);
  const setOutputFormat = useBackgroundRemoverStore((s) => s.setOutputFormat);
  const exportActiveImage = useBackgroundRemoverStore((s) => s.exportActiveImage);
  const processAllBatch = useBackgroundRemoverStore((s) => s.processAllBatch);
  const downloadBatchZip = useBackgroundRemoverStore((s) => s.downloadBatchZip);
  const selectBatchItem = useBackgroundRemoverStore((s) => s.selectBatchItem);
  const resetAll = useBackgroundRemoverStore((s) => s.resetAll);

  // Clean up Object URLs on unmount
  useEffect(() => {
    return () => {
      // Memory management cleanup
      const s = useBackgroundRemoverStore.getState();
      if (s.originalUrl) URL.revokeObjectURL(s.originalUrl);
      if (s.processedPreviewUrl) URL.revokeObjectURL(s.processedPreviewUrl);
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A3242]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1838] border border-[#795BFF]/50 text-xs font-mono mb-2 text-[#C8FF43]">
            <Sparkles className="w-3.5 h-3.5 text-[#C8FF43]" />
            <span>AI FLAT BACKGROUND TO TRANSPARENT • ZERO HALOS</span>
          </div>
          <h1 className="font-['Silkscreen',monospace] font-bold text-2xl sm:text-3xl text-[#F4F2EC] tracking-wide">
            BACKGROUND REMOVER
          </h1>
          <p className="text-xs sm:text-sm text-[#AAB7D0] max-w-2xl mt-1">
            Remove solid backgrounds, white borders, or green screens client-side in CIE Lab space.
            Contiguous edge flood-fill keeps white eyes and logos inside intact.
          </p>
        </div>

        {file && (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={<Trash2 className="w-4 h-4 text-[#FF43A4]" />}
              onClick={resetAll}
            >
              CLEAR & RESET
            </Button>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-start gap-3 bg-[#38111A] border border-[#FF43A4] rounded-lg p-4 text-xs font-mono text-[#FFB3D1]">
          <AlertCircle className="w-4 h-4 text-[#FF43A4] shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {/* Screen 1: DropZone when no file is loaded */}
      {!file ? (
        <DropZone
          onFileSelect={loadMultipleFiles}
          onLoadSample={loadSampleImage}
          loading={loading}
        />
      ) : (
        /* Screen 2: Interactive Editor */
        <div className="flex flex-col gap-6">
          {/* Batch Queue list if multiple files */}
          {batchItems.length > 1 && (
            <BatchQueue
              items={batchItems}
              activeIndex={activeBatchIndex}
              isProcessing={isProcessingBatch}
              onSelectItem={selectBatchItem}
              onProcessAll={processAllBatch}
              onDownloadZip={downloadBatchZip}
            />
          )}

          {/* Main 2-Column Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 Columns: Preview Canvas & Stats */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <PreviewPanel
                originalUrl={originalUrl}
                processedUrl={processedPreviewUrl}
                isProcessing={isProcessingPreview}
                backdropMode={backdropMode}
                customBackdropHex={customBackdropHex}
                viewMode={viewMode}
                splitPosition={splitPosition}
                zoom={zoom}
                pan={pan}
                isEyedropperActive={isEyedropperActive}
                onBackdropChange={setBackdropMode}
                onCustomBackdropChange={setCustomBackdropHex}
                onViewModeChange={setViewMode}
                onSplitChange={setSplitPosition}
                onZoomChange={setZoom}
                onPanChange={setPan}
                onEyedropperToggle={setIsEyedropperActive}
                onColorSampled={setTargetColor}
              />

              <StatsHud
                originalSize={originalSize}
                width={processedResult?.width || 0}
                height={processedResult?.height || 0}
                result={processedResult}
                filename={filename}
              />
            </div>

            {/* Right 5 Columns: Controls Panel */}
            <div className="lg:col-span-5">
              <ControlsPanel
                mode={mode}
                targetColor={targetColor}
                customHex={customHex}
                detectedResult={detectedResult}
                useCustomColor={useCustomColor}
                tolerance={tolerance}
                softness={softness}
                decontaminate={decontaminate}
                shrink={shrink}
                smooth={smooth}
                removeIslands={removeIslands}
                islandSize={islandSize}
                outputFormat={outputFormat}
                submitting={submitting}
                isEyedropperActive={isEyedropperActive}
                onModeChange={setMode}
                onColorChange={setTargetColor}
                onHexChange={setTargetHex}
                onToleranceChange={setTolerance}
                onSoftnessChange={setSoftness}
                onDecontaminateChange={setDecontaminate}
                onShrinkChange={setShrink}
                onSmoothChange={setSmooth}
                onRemoveIslandsChange={setRemoveIslands}
                onIslandSizeChange={setIslandSize}
                onOutputFormatChange={setOutputFormat}
                onExport={exportActiveImage}
                onEyedropperToggle={setIsEyedropperActive}
                onResetAuto={() => {
                  if (detectedResult) {
                    setTargetColor(detectedResult.color);
                    useBackgroundRemoverStore.setState({ useCustomColor: false });
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
