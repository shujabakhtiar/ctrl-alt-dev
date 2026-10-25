import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Image as ImageIcon, Zap, Check, Layers } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ToolTile from '../components/tools/ToolTile';

export default function ImageConverterPage() {
  return (
    <div className="max-w-4xl mx-auto py-2">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 font-mono text-xs text-[#7886A1] mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-[#C8FF43] transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>CtrlAltDev</span>
        </Link>
        <span>/</span>
        <span className="text-[#F4F2EC] font-bold">Image Converter</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <ToolTile color="pink" icon={<ImageIcon className="w-6 h-6 text-[#080A0F]" />} />
          <h1 className="font-['Space_Grotesk',sans-serif] font-bold text-2xl sm:text-3xl text-[#F4F2EC]">
            Image Tools
          </h1>
        </div>
        <p className="text-sm text-[#AAB7D0]">
          Convert and compress between JPG, PNG, WEBP, and AVIF natively in your browser.
        </p>
      </div>

      {/* Converter Options */}
      <div className="grid grid-cols-1 gap-6">
        {/* Responsive Image Set Card */}
        <div className="bg-[#111620] border border-[#2A3242] hover:border-[#46536B] rounded-[10px] p-6 shadow-[0_4px_0_rgba(0,0,0,0.4)] transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3.5">
              <ToolTile color="lime" icon={<Layers className="w-5 h-5 text-[#080A0F]" />} />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-['Space_Grotesk',sans-serif] font-bold text-lg text-[#F4F2EC]">
                    Responsive Image Set Generator
                  </h2>
                  <Badge variant="lime">NEW • WASM</Badge>
                </div>
                <p className="text-xs text-[#AAB7D0]">
                  Generate multi-width AVIF and WebP variants + copy-ready HTML/JSX &lt;picture&gt; snippets.
                </p>
              </div>
            </div>

            <Button
              to="/responsive-images"
              variant="lime"
              size="md"
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Open Generator
            </Button>
          </div>

          <div className="bg-[#080A0F] border border-[#2A3242] rounded-[8px] p-5">
            <h3 className="font-mono text-xs font-bold text-[#F4F2EC] uppercase tracking-wider mb-3">
              Why use responsive image sets?
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#AAB7D0]">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#C8FF43] shrink-0 mt-0.5" />
                <span><strong className="text-[#F4F2EC]">AVIF + WebP</strong> with automated fallbacks and Lanczos3 resizing.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#C8FF43] shrink-0 mt-0.5" />
                <span><strong className="text-[#F4F2EC]">Layout shift protection</strong> with real dimension tags on &lt;img&gt;.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#C8FF43] shrink-0 mt-0.5" />
                <span><strong className="text-[#F4F2EC]">Fluid (w/sizes) or Fixed (1x/2x/3x)</strong> density srcset support.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#C8FF43] shrink-0 mt-0.5" />
                <span><strong className="text-[#F4F2EC]">One-click ZIP bundle</strong> with all assets and snippet included.</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="bg-[#111620] border border-[#2A3242] hover:border-[#46536B] rounded-[10px] p-6 shadow-[0_4px_0_rgba(0,0,0,0.4)] transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3.5">
              <ToolTile color="pink" icon={<Zap className="w-5 h-5 text-[#080A0F]" />} />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-['Space_Grotesk',sans-serif] font-bold text-lg text-[#F4F2EC]">
                    Convert to WebP
                  </h2>
                  <Badge variant="lime">RECOMMENDED</Badge>
                </div>
                <p className="text-xs text-[#AAB7D0]">
                  Modern next-gen format with superior compression and alpha transparency.
                </p>
              </div>
            </div>

            <Button
              to="/image-convertor/to-webp"
              variant="pink"
              size="md"
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Open WebP Studio
            </Button>
          </div>

          {/* Benefits Grid */}
          <div className="bg-[#080A0F] border border-[#2A3242] rounded-[8px] p-5">
            <h3 className="font-mono text-xs font-bold text-[#F4F2EC] uppercase tracking-wider mb-3">
              Why switch to WebP?
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#AAB7D0]">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#C8FF43] shrink-0 mt-0.5" />
                <span><strong className="text-[#F4F2EC]">25%–35% smaller</strong> file sizes compared to JPEG and PNG.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#C8FF43] shrink-0 mt-0.5" />
                <span><strong className="text-[#F4F2EC]">Full alpha transparency</strong> with lossless compression.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#C8FF43] shrink-0 mt-0.5" />
                <span><strong className="text-[#F4F2EC]">Boosts Core Web Vitals</strong> and reduces page load times.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#C8FF43] shrink-0 mt-0.5" />
                <span><strong className="text-[#F4F2EC]">97%+ browser support</strong> natively across modern devices.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
