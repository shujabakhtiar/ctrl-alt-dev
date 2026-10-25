import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Zap, Layers, Sparkles, Check, ShieldCheck, Cpu } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ToolTile from '../components/tools/ToolTile';

export default function ToolsPage() {
  const tools = [
    {
      id: 'convert-to-webp',
      title: 'Convert to WebP Studio',
      badge: 'FLAGSHIP • FAST',
      badgeVariant: 'pink',
      color: 'pink',
      icon: <Zap className="w-5 h-5 text-[#080A0F]" />,
      to: '/convert-to-webp',
      buttonText: 'Open WebP Studio',
      buttonVariant: 'pink',
      description:
        'Client-side image conversion and compression engine. Convert PNG, JPEG, and more to WebP with live split inspection, quality tuning, and zero server uploads.',
      features: [
        { title: '25%–35% smaller', desc: 'Drastically reduce page weight compared to standard JPEG and PNG.' },
        { title: 'Full alpha transparency', desc: 'Preserves sharp edges and transparent backgrounds losslessly.' },
        { title: 'Lossy & lossless modes', desc: 'Fine-tune quality slider with live file size comparison.' },
        { title: '100% in-browser', desc: 'Images never leave your machine; instant processing with zero upload lag.' },
      ],
      tags: ['PNG', 'JPEG', 'WEBP', 'COMPRESSION', 'WASM'],
    },
    {
      id: 'responsive-image-set',
      title: 'Responsive Image Set Generator',
      badge: 'NEW • WASM',
      badgeVariant: 'lime',
      color: 'lime',
      icon: <Layers className="w-5 h-5 text-[#080A0F]" />,
      to: '/responsive-images',
      buttonText: 'Open Responsive Generator',
      buttonVariant: 'lime',
      description:
        'Generate multi-width AVIF and WebP variant sets with high-fidelity downscaling and copy-ready HTML/JSX <picture> snippets for zero layout shift.',
      features: [
        { title: 'AVIF + WebP stacks', desc: 'Generate next-gen AVIF and WebP fallbacks with one click.' },
        { title: 'Layout shift protection', desc: 'Auto-computes explicit aspect-ratio and dimensions on <img>.' },
        { title: 'Fluid or Fixed density', desc: 'Support for fluid (w/sizes) or retina fixed (1x/2x/3x) display sets.' },
        { title: 'One-click ZIP bundle', desc: 'Downloads all formatted images and snippet ready to drop into your code.' },
      ],
      tags: ['AVIF', 'WEBP', 'PICTURE TAG', 'LANCZOS3', 'RESPONSIVE'],
    },
    {
      id: 'favicon-generator',
      title: 'Favicon & App Icon Suite',
      badge: 'NEW • PWA READY',
      badgeVariant: 'cyan',
      color: 'cyan',
      icon: <Sparkles className="w-5 h-5 text-[#080A0F]" />,
      to: '/favicon-generator',
      buttonText: 'Open Favicon Suite',
      buttonVariant: 'cyan',
      description:
        'Drop one logo or image and generate a complete production icon suite: true multi-size .ico binary, Apple Touch icons, Android PWA manifest, and copy-ready head tags.',
      features: [
        { title: 'Multi-resolution .ico', desc: 'True binary ICO file containing 16x16, 32x32, and 48x48 PNG layers.' },
        { title: 'PWA Webmanifest', desc: 'Complete site.webmanifest with safe-zone compliant maskable icons.' },
        { title: 'Copy-ready Head tags', desc: 'HTML and JSX tags with customizable base path and theme colors.' },
        { title: 'Live tab & home preview', desc: 'Simulate how your icon looks on dark, light, and mobile tab bars.' },
      ],
      tags: ['FAVICON.ICO', 'PWA', 'APPLE TOUCH', 'MANIFEST.JSON', 'SVG'],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-2">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 font-mono text-xs text-[#7886A1] mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-[#C8FF43] transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>CtrlAltDev</span>
        </Link>
        <span>/</span>
        <span className="text-[#F4F2EC] font-bold">Tools</span>
      </nav>

      {/* Page Header */}
      <div className="mb-8 pb-6 border-b border-[#2A3242]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1838] border border-[#795BFF]/50 text-xs font-mono mb-4 text-[#C8FF43]">
          <Cpu className="w-3.5 h-3.5 text-[#C8FF43]" />
          <span>ZERO SERVER HOPS • 100% LOCAL EXECUTION</span>
        </div>
        <h1 className="font-['Silkscreen',monospace] font-bold text-2xl sm:text-3xl text-[#F4F2EC] mb-3 tracking-wide">
          DEVELOPER TOOLKIT
        </h1>
        <p className="text-sm sm:text-base text-[#AAB7D0] max-w-2xl leading-relaxed">
          Streamlined, single-purpose utilities built specifically for frontend workflows. All computations run right in your browser via WebAssembly and Canvas.
        </p>
      </div>

      {/* Tools List */}
      <div className="flex flex-col gap-8">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="bg-[#111620] border border-[#2A3242] hover:border-[#46536B] rounded-[10px] p-6 sm:p-7 shadow-[0_4px_0_rgba(0,0,0,0.4)] transition-all"
          >
            {/* Widget Top: Title, Badge, Action Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-5 border-b border-[#2A3242]/70">
              <div className="flex items-start sm:items-center gap-3.5">
                <ToolTile color={tool.color} icon={tool.icon} />
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="font-['Space_Grotesk',sans-serif] font-bold text-lg sm:text-xl text-[#F4F2EC]">
                      {tool.title}
                    </h2>
                    <Badge variant={tool.badgeVariant}>{tool.badge}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {tool.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#080A0F] border border-[#2A3242] text-[#7886A1]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                to={tool.to}
                variant={tool.buttonVariant}
                size="md"
                className="shrink-0 self-start sm:self-center font-bold"
                iconRight={<ArrowRight className="w-4 h-4" />}
              >
                {tool.buttonText}
              </Button>
            </div>

            {/* Description */}
            <p className="text-sm text-[#AAB7D0] leading-relaxed mb-5">
              {tool.description}
            </p>

            {/* Feature Checklist Box */}
            <div className="bg-[#080A0F] border border-[#2A3242] rounded-[8px] p-4 sm:p-5">
              <h3 className="font-mono text-xs font-bold text-[#F4F2EC] uppercase tracking-wider mb-3">
                Key Capabilities
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#AAB7D0]">
                {tool.features.map((feature) => (
                  <li key={feature.title} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#C8FF43] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-[#F4F2EC]">{feature.title}:</strong> {feature.desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Guarantee Banner */}
      <div className="mt-10 bg-[#0D1018] border border-[#2A3242] rounded-[10px] p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="p-3 bg-[#111620] border border-[#2A3242] rounded-[8px] text-[#C8FF43] shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-['Space_Grotesk',sans-serif] font-bold text-sm text-[#F4F2EC] mb-1">
            Built with Privacy-First Principles
          </h4>
          <p className="text-xs text-[#7886A1] leading-relaxed">
            Your production graphics, secret tokens, and client assets are processed exclusively within your browser runtime using WebAssembly. No cookies, no remote server uploads, and no tracking.
          </p>
        </div>
      </div>
    </div>
  );
}
