import { ArrowRight } from 'lucide-react';
import ToolTile from './ToolTile';
import Button from '../ui/Button';

export default function ToolCard({
  title,
  description,
  color = 'pink',
  icon,
  to,
  onClick,
  badge,
}) {
  return (
    <div className="group bg-[#111620] border border-[#2A3242] hover:border-[#46536B] hover:bg-[#151B27] rounded-[8px] p-5 flex flex-col justify-between transition-all duration-150 shadow-[0_2px_0_rgba(0,0,0,0.5)]">
      <div>
        {/* Top Icon and arrow */}
        <div className="flex items-center justify-between mb-4">
          <ToolTile color={color} icon={icon} />
          <ArrowRight className="w-4 h-4 text-[#7886A1] group-hover:text-[#F4F2EC] group-hover:translate-x-1 transition-all" />
        </div>

        {/* Title */}
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="font-['Space_Grotesk',sans-serif] font-bold text-base text-[#F4F2EC] tracking-tight">
            {title}
          </h3>
          {badge && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#171D29] text-[#7886A1] border border-[#2A3242]">
              {badge}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-[#AAB7D0] leading-relaxed mb-5 min-h-[36px]">
          {description}
        </p>
      </div>

      {/* Action Button */}
      <div>
        <Button
          to={to}
          onClick={onClick}
          variant={color}
          size="sm"
          className="w-full justify-center text-xs py-2 font-bold"
          iconRight={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Open Tool
        </Button>
      </div>
    </div>
  );
}
