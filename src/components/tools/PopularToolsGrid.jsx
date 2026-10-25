import { 
  Image as ImageIcon, 
  Crop, 
  Grid, 
  FileText, 
  Code2, 
  Palette, 
  Archive, 
  Binary, 
  Compass, 
  ArrowRight 
} from 'lucide-react';
import ToolCard from './ToolCard';

export default function PopularToolsGrid({ onSelectTool }) {
  const tools = [
    {
      id: 'image-converter',
      title: 'Image Converter',
      description: 'Convert between JPG, PNG, WEBP, AVIF and more.',
      color: 'pink',
      icon: <ImageIcon className="w-5 h-5" />,
      to: '/image-convertor',
    },
    {
      id: 'image-compressor',
      title: 'Image Compressor',
      description: 'Shrink your images without losing quality.',
      color: 'lime',
      icon: <Crop className="w-5 h-5" />,
      to: '/image-convertor/to-webp',
    },
    {
      id: 'background-remover',
      title: 'Background Remover',
      description: 'Remove backgrounds in seconds. No fuss.',
      color: 'blue',
      icon: <Grid className="w-5 h-5" />,
      to: '/tools/background-remover',
    },
    {
      id: 'text-formatter',
      title: 'Text Formatter',
      description: 'Clean, minify or format your code and text.',
      color: 'purple',
      icon: <FileText className="w-5 h-5" />,
      to: '/tools/text-formatter',
    },
    {
      id: 'json-formatter',
      title: 'JSON Formatter',
      description: 'Beautify or minify your JSON data.',
      color: 'yellow',
      icon: <Code2 className="w-5 h-5" />,
      to: '/tools/json-formatter',
    },
    {
      id: 'color-picker',
      title: 'Color Picker',
      description: 'Pick colors from anywhere on your screen.',
      color: 'cyan',
      icon: <Palette className="w-5 h-5" />,
      to: '/tools/color-picker',
    },
    {
      id: 'file-compressor',
      title: 'File Compressor',
      description: 'Zip and unzip files, fast.',
      color: 'orange',
      icon: <Archive className="w-5 h-5" />,
      to: '/tools/file-compressor',
    },
    {
      id: 'image-to-base64',
      title: 'Image to Base64',
      description: 'Convert images to base64 instantly.',
      color: 'pink',
      icon: <Binary className="w-5 h-5" />,
      to: '/tools/image-to-base64',
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
              POPULAR TOOLS
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#AAB7D0]">
            The essentials, right at your fingertips.
          </p>
        </div>

        <a
          href="#popular-tools"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#62B9FF] hover:text-[#C8FF43] transition-colors"
        >
          <span>View all tools</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* 4x2 Responsive Grid matching reference */}
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
