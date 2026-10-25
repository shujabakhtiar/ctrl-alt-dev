import { Image as ImageIcon, Compass, ArrowRight } from 'lucide-react';
import ToolCard from './ToolCard';

export default function PopularToolsGrid({ onSelectTool }) {
  const tools = [
    {
      id: 'image-converter',
      title: 'Image Converter',
      description: 'Convert between JPG, PNG, WEBP, AVIF and more. High-speed, 100% client-side privacy.',
      color: 'pink',
      icon: <ImageIcon className="w-5 h-5" />,
      to: '/image-convertor',
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
      </div>

      {/* Grid with Image Converter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
