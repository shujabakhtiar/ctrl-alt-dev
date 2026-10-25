import { create } from 'zustand';
import type { FaviconOptions, GeneratedFile, SourceImage } from '../types';
import { parseSourceFile } from '../lib/rasterize';
import { generateFaviconPackage } from '../lib/generator';
import { generateManifest } from '../lib/manifest';
import { generateHeadTags } from '../lib/headTags';
import { createFaviconZip } from '../lib/zip';
import { downloadBlob } from '../../../lib/download';
import { handleError } from '../../../lib/errorHandler';

export interface FaviconState {
  source: SourceImage | null;
  options: FaviconOptions;
  files: GeneratedFile[];
  isGenerating: boolean;
  generationProgress: { current: number; total: number; message: string } | null;
  error: string | null;
  errors: Record<string, string> | null;
  manifestJson: string;
  headSnippetHtml: string;
  activePreviewTab: 'browser' | 'ios' | 'android' | 'files';

  // Actions
  loadFile: (file: File) => Promise<void>;
  updateOptions: (patch: Partial<FaviconOptions>) => void;
  regenerate: () => Promise<void>;
  clearSource: () => void;
  downloadAllZip: () => Promise<void>;
  downloadSingleFile: (file: GeneratedFile) => void;
  setActivePreviewTab: (tab: 'browser' | 'ios' | 'android' | 'files') => void;
}

const DEFAULT_OPTIONS: FaviconOptions = {
  appName: 'My App',
  shortName: 'App',
  themeColor: '#080A0F',
  backgroundColor: '#FFFFFF',
  maskablePadding: 20, // 20% padding -> ~80% logo safe zone
  basePath: '/',
  nonSquareStrategy: 'fit',
  optimizePng: true,
  includeLegacy: false,
};

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

export const useFaviconStore = create<FaviconState>((set, get) => {
  const revokeGeneratedUrls = (files: GeneratedFile[]) => {
    for (const f of files) {
      if (f.url) {
        try {
          URL.revokeObjectURL(f.url);
        } catch {
          // ignore
        }
      }
    }
  };

  const revokeSourceUrl = (source: SourceImage | null) => {
    if (source?.previewUrl) {
      try {
        URL.revokeObjectURL(source.previewUrl);
      } catch {
        // ignore
      }
    }
  };

  return {
    source: null,
    options: DEFAULT_OPTIONS,
    files: [],
    isGenerating: false,
    generationProgress: null,
    error: null,
    errors: null,
    manifestJson: '',
    headSnippetHtml: '',
    activePreviewTab: 'browser',

    loadFile: async (file: File) => {
      const prevSource = get().source;
      const prevFiles = get().files;
      revokeSourceUrl(prevSource);
      revokeGeneratedUrls(prevFiles);

      set({
        source: null,
        files: [],
        error: null,
        errors: null,
        isGenerating: true,
        generationProgress: { current: 1, total: 8, message: 'Inspecting image format...' },
      });

      try {
        const source = await parseSourceFile(file);

        // Derive appName and shortName from file name if default
        const baseName = file.name.replace(/\.[^/.]+$/, '').trim();
        const derivedOptions = { ...get().options };
        if (baseName && derivedOptions.appName === 'My App') {
          derivedOptions.appName = baseName;
          derivedOptions.shortName = baseName.slice(0, 12);
        }

        set({
          source,
          options: derivedOptions,
          error: null,
        });

        // Generate files
        await get().regenerate();
      } catch (err: unknown) {
        const { message } = handleError(err, { context: 'parseSourceFile' });
        set({
          error: message,
          isGenerating: false,
          generationProgress: null,
        });
      }
    },

    updateOptions: (patch: Partial<FaviconOptions>) => {
      const newOptions = { ...get().options, ...patch };
      const source = get().source;

      // Update static previews immediately (manifest & head tags)
      const { json } = generateManifest(newOptions, source?.type === 'svg');
      const snippetHtml = generateHeadTags(newOptions, source?.type === 'svg');

      set({
        options: newOptions,
        manifestJson: json,
        headSnippetHtml: snippetHtml,
      });

      if (!source) return;

      // Debounce re-encoding of images (120ms) for 60fps responsiveness
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        get().regenerate();
      }, 120);
    },

    regenerate: async () => {
      const { source, options, files: oldFiles } = get();
      if (!source) return;

      set({
        isGenerating: true,
        generationProgress: { current: 1, total: options.includeLegacy ? 12 : 8, message: 'Processing icons...' },
      });

      try {
        const newFiles = await generateFaviconPackage(
          source,
          options,
          (current, total, message) => {
            set({ generationProgress: { current, total, message } });
          }
        );

        // Revoke previous URLs before assigning new ones
        revokeGeneratedUrls(oldFiles);

        const { json } = generateManifest(options, source.type === 'svg');
        const snippetHtml = generateHeadTags(options, source.type === 'svg');

        set({
          files: newFiles,
          manifestJson: json,
          headSnippetHtml: snippetHtml,
          isGenerating: false,
          generationProgress: null,
          error: null,
        });
      } catch (err: unknown) {
        const { message } = handleError(err, { context: 'generateFaviconPackage' });
        set({
          error: message,
          isGenerating: false,
          generationProgress: null,
        });
      }
    },

    clearSource: () => {
      const { source, files } = get();
      revokeSourceUrl(source);
      revokeGeneratedUrls(files);

      set({
        source: null,
        files: [],
        error: null,
        errors: null,
        isGenerating: false,
        generationProgress: null,
        manifestJson: '',
        headSnippetHtml: '',
      });
    },

    downloadAllZip: async () => {
      const files = get().files;
      if (files.length === 0) return;

      try {
        const zipBlob = await createFaviconZip(files);
        const zipName = `${(get().options.shortName || 'favicon-package').toLowerCase().replace(/\s+/g, '-')}.zip`;
        downloadBlob(zipBlob, zipName);
      } catch (err: unknown) {
        handleError(err, { context: 'downloadAllZip' });
      }
    },

    downloadSingleFile: (file: GeneratedFile) => {
      downloadBlob(file.blob, file.name);
    },

    setActivePreviewTab: (tab: 'browser' | 'ios' | 'android' | 'files') => {
      set({ activePreviewTab: tab });
    },
  };
});
