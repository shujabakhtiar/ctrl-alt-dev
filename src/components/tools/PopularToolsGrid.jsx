import { Zap, Compass, Layers, Sparkles, Scissors, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ToolCard from './ToolCard';

export default function PopularToolsGrid({ onSelectTool }) {
  const tools = [
    {
      id: 'convert-to-webp',
      title: 'Convert to WebP',
      description: 'Transform images into modern WebP with custom compression and live side-by-side preview.',
      color: 'pink',
      icon: <Zap className="w-5 h-5" />,
      to: '/convert-to-webp',
      badge: 'FLAGSHIP • FAST',
    },
    {
      id: 'responsive-image-set',
      title: 'Responsive Image Set',
      description: 'Generate multi-width AVIF & WebP variants with copy-ready <picture> tags. Zero upload lag.',
      color: 'lime',
      icon: <Layers className="w-5 h-5" />,
      to: '/responsive-images',
      badge: 'NEW • WASM',
    },
    {
      id: 'favicon-generator',
      title: 'Favicon & App Icon Suite',
      description: 'Drop one image. Get complete favicon.ico, maskable PWA icons, manifest & ready-to-paste tags.',
      color: 'cyan',
      icon: <Sparkles className="w-5 h-5" />,
      to: '/favicon-generator',
      badge: 'NEW • PWA',
    },
    {
      id: 'background-remover',
      title: 'Background Remover',
      description: 'Convert solid & AI backgrounds into clean transparency. Contiguous flood-fill without halos.',
      color: 'purple',
      icon: <Scissors className="w-5 h-5" />,
      to: '/background-remover',
      badge: 'NEW • CIE LAB',
    },
  ];

  return (
    <section id="popular-tools" className="pt-6 pb-14">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-4 border-b border-[#2A3242]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Compass className="w-5 h-5 text-[#C8FF43]" />
            <h2 className="font-['Silkscreen',monospace] font-bold text-xl sm:text-2xl text-[#F4F2EC] tracking-wide">
              FEATURED TOOLS
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#AAB7D0]">
            The essentials, right at your fingertips.
          </p>
        </div>

        <Link
          to="/tools"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-[#AAB7D0] hover:text-[#C8FF43] transition-colors"
        >
          <span>VIEW ALL TOOLS</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid with Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <ToolCard
            key={tool.id}
            title={tool.title}
            description={tool.description}
            color={tool.color}
            icon={tool.icon}
            to={tool.to}
            onClick={() => onSelectTool && onSelectTool(tool)}
          />
        ))}
      </div>
    </section>
  );
}
