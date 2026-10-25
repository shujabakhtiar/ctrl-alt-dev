import { Link } from 'react-router-dom';

export default function BrandMark({ showVersion = true, className = '' }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 text-decoration-none group ${className}`}>
      {/* Pixel Art 8-bit Brand Avatar */}
      <div className="w-7 h-7 bg-[#F05CE8] rounded-[5px] flex items-center justify-center shadow-[0_2px_0_#9E1F97] relative overflow-hidden group-hover:scale-105 transition-transform">
        <svg viewBox="0 0 16 16" className="w-5 h-5 fill-[#080A0F]" shapeRendering="crispEdges">
          {/* 8-bit retro invader/mascot face */}
          <rect x="2" y="2" width="2" height="2" />
          <rect x="12" y="2" width="2" height="2" />
          <rect x="4" y="4" width="8" height="2" />
          <rect x="2" y="6" width="12" height="4" />
          <rect x="4" y="6" width="2" height="2" fill="#F05CE8" />
          <rect x="10" y="6" width="2" height="2" fill="#F05CE8" />
          <rect x="4" y="10" width="8" height="2" />
          <rect x="2" y="12" width="2" height="2" />
          <rect x="6" y="12" width="4" height="2" />
          <rect x="12" y="12" width="2" height="2" />
        </svg>
      </div>

      {/* DEVTOOLKIT Wordmark */}
      <span className="font-['Silkscreen',monospace] font-bold text-lg md:text-xl text-[#F4F2EC] tracking-wider">
        DEVTOOLKIT
      </span>

      {/* v1.0 Pill Badge */}
      {showVersion && (
        <span className="font-mono text-[11px] font-bold bg-[#C8FF43] text-[#080A0F] px-1.5 py-0.5 rounded-[4px] border border-[#A7E028] shadow-[0_1px_0_#7BA512]">
          v1.0
        </span>
      )}
    </Link>
  );
}
