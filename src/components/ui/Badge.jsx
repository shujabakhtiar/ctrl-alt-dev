export default function Badge({
  children,
  variant = 'lime',
  className = '',
  icon,
}) {
  const variantStyles = {
    lime: 'bg-[#C8FF43]/15 text-[#C8FF43] border-[#C8FF43]/30',
    purple: 'bg-[#795BFF]/15 text-[#795BFF] border-[#795BFF]/35',
    pink: 'bg-[#F05CE8]/15 text-[#F05CE8] border-[#F05CE8]/35',
    blue: 'bg-[#62B9FF]/15 text-[#62B9FF] border-[#62B9FF]/35',
    yellow: 'bg-[#FFD84D]/15 text-[#FFD84D] border-[#FFD84D]/35',
    cyan: 'bg-[#50E6E6]/15 text-[#50E6E6] border-[#50E6E6]/35',
    orange: 'bg-[#FF9855]/15 text-[#FF9855] border-[#FF9855]/35',
    muted: 'bg-[#171D29] text-[#AAB7D0] border-[#2A3242]',
  }[variant] || 'bg-[#171D29] text-[#AAB7D0] border-[#2A3242]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] border font-mono text-xs font-semibold ${variantStyles} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
