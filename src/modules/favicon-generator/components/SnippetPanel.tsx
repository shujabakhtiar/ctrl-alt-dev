import { useState } from 'react';
import { Copy, Check, Code2, FileJson, FolderCheck, ExternalLink } from 'lucide-react';
import { useFaviconStore } from '../store/useFaviconStore';

export function SnippetPanel() {
  const headSnippetHtml = useFaviconStore((s) => s.headSnippetHtml);
  const manifestJson = useFaviconStore((s) => s.manifestJson);

  const [activeTab, setActiveTab] = useState<'head' | 'manifest'>('head');
  const [copiedSnippet, setCopiedSnippet] = useState<'head' | 'manifest' | null>(null);

  const copyToClipboard = async (text: string, type: 'head' | 'manifest') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSnippet(type);
      setTimeout(() => setCopiedSnippet(null), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedSnippet(type);
      setTimeout(() => setCopiedSnippet(null), 2000);
    }
  };

  return (
    <div className="bg-[#111620] border border-[#2A3242] rounded-[10px] p-5 sm:p-6 space-y-6 shadow-[0_3px_0_rgba(0,0,0,0.4)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2A3242]">
        <div>
          <h3 className="font-['Space_Grotesk',sans-serif] font-bold text-base text-[#F4F2EC]">
            Code Snippets &amp; Manifest
          </h3>
          <p className="text-xs text-[#AAB7D0]">
            Ready-to-paste HTML tags and web manifest JSON for your application.
          </p>
        </div>

        {/* Tab switcher & copy action */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#080A0F] p-1 rounded-[6px] border border-[#2A3242]">
            <button
              type="button"
              onClick={() => setActiveTab('head')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] text-xs font-mono transition-all ${
                activeTab === 'head'
                  ? 'bg-[#C8FF43] text-[#080A0F] font-bold shadow-[0_2px_0_#7BA512]'
                  : 'text-[#AAB7D0] hover:text-[#F4F2EC]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>&lt;head&gt; Tags</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('manifest')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] text-xs font-mono transition-all ${
                activeTab === 'manifest'
                  ? 'bg-[#C8FF43] text-[#080A0F] font-bold shadow-[0_2px_0_#7BA512]'
                  : 'text-[#AAB7D0] hover:text-[#F4F2EC]'
              }`}
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>manifest.webmanifest</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() =>
              copyToClipboard(
                activeTab === 'head' ? headSnippetHtml : manifestJson,
                activeTab
              )
            }
            className="btn-tactile btn-tactile-dark text-xs py-1.5 px-3 rounded-[5px] flex items-center gap-1.5 shrink-0"
          >
            {copiedSnippet === activeTab ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#C8FF43]" />
                <span className="text-[#C8FF43]">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy {activeTab === 'head' ? 'HTML' : 'JSON'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Display */}
      <div className="relative">
        <pre className="bg-[#080A0F] border border-[#2A3242] rounded-[8px] p-4 text-xs font-mono text-[#F4F2EC] overflow-x-auto leading-relaxed max-h-[320px]">
          <code>{activeTab === 'head' ? headSnippetHtml : manifestJson}</code>
        </pre>
      </div>

      {/* Static Framework Placement Notes */}
      <div className="bg-[#171D29] border border-[#2A3242] rounded-[8px] p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#F4F2EC]">
          <FolderCheck className="w-4 h-4 text-[#C8FF43]" />
          <span>Where to place these files in your project</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-[#AAB7D0]">
          {/* Vite / Static Web */}
          <div className="bg-[#080A0F] p-3 rounded-[6px] border border-[#2A3242]/70">
            <span className="text-[#C8FF43] font-bold block mb-1">
              Vite / Astro / Static HTML:
            </span>
            <p className="text-[11px] leading-relaxed mb-2">
              Extract all ZIP contents directly into your project's <code className="text-[#F4F2EC] bg-[#171D29] px-1 py-0.5 rounded">public/</code> root directory.
            </p>
            <p className="text-[11px] text-[#7886A1]">
              Paste the <code className="text-[#F4F2EC]">&lt;head&gt;</code> tags into your <code className="text-[#F4F2EC]">index.html</code>.
            </p>
          </div>

          {/* Next.js (App Router) */}
          <div className="bg-[#080A0F] p-3 rounded-[6px] border border-[#2A3242]/70">
            <span className="text-[#00E5FF] font-bold block mb-1">
              Next.js (App Router):
            </span>
            <p className="text-[11px] leading-relaxed mb-2">
              Place <code className="text-[#F4F2EC] bg-[#171D29] px-1 py-0.5 rounded">favicon.ico</code> and <code className="text-[#F4F2EC] bg-[#171D29] px-1 py-0.5 rounded">icon.png</code> directly in <code className="text-[#F4F2EC]">app/</code>, or put everything in <code className="text-[#F4F2EC]">public/</code>.
            </p>
            <p className="text-[11px] text-[#7886A1]">
              Add the tags to <code className="text-[#F4F2EC]">app/layout.tsx</code> or use the Next.js Metadata API.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
