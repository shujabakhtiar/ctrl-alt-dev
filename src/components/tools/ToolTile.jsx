export default function ToolTile({
  color = 'pink',
  icon,
  className = '',
}) {
  const colorConfigs = {
    pink: {
      bg: 'bg-[#F05CE8]',
      shadow: 'shadow-[0_4px_0_#9E1F97]',
      text: 'text-[#080A0F]',
      border: 'border-[#F88BF2]',
    },
    lime: {
      bg: 'bg-[#C8FF43]',
      shadow: 'shadow-[0_4px_0_#7BA512]',
      text: 'text-[#080A0F]',
      border: 'border-[#D9FF75]',
    },
    blue: {
      bg: 'bg-[#62B9FF]',
      shadow: 'shadow-[0_4px_0_#1D73BA]',
      text: 'text-[#080A0F]',
      border: 'border-[#8FCDFF]',
    },
    purple: {
      bg: 'bg-[#795BFF]',
      shadow: 'shadow-[0_4px_0_#462AB8]',
      text: 'text-[#F4F2EC]',
      border: 'border-[#9E87FF]',
    },
    yellow: {
      bg: 'bg-[#FFD84D]',
      shadow: 'shadow-[0_4px_0_#AD8412]',
      text: 'text-[#080A0F]',
      border: 'border-[#FFE37E]',
    },
    cyan: {
      bg: 'bg-[#50E6E6]',
      shadow: 'shadow-[0_4px_0_#1B8C8C]',
      text: 'text-[#080A0F]',
      border: 'border-[#86EDED]',
    },
    orange: {
      bg: 'bg-[#FF9855]',
      shadow: 'shadow-[0_4px_0_#B35214]',
      text: 'text-[#080A0F]',
      border: 'border-[#FFB584]',
    },
  }[color] || {
    bg: 'bg-[#C8FF43]',
    shadow: 'shadow-[0_4px_0_#7BA512]',
    text: 'text-[#080A0F]',
    border: 'border-[#D9FF75]',
  };

  return (
    <div
      className={`w-12 h-12 rounded-[8px] ${colorConfigs.bg} ${colorConfigs.shadow} ${colorConfigs.border} border flex items-center justify-center shrink-0 transition-transform duration-150 group-hover:scale-105 ${colorConfigs.text} ${className}`}
    >
      {icon}
    </div>
  );
}
