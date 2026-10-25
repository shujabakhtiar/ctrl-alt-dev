import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Image as ImageIcon 
} from 'lucide-react';
import BrandMark from '../brand/BrandMark';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: <Home className="w-4 h-4" /> },
    { name: 'Image Converter', path: '/image-convertor', icon: <ImageIcon className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-60 bg-[#080A0F] border-r border-[#2A3242] flex flex-col justify-between p-4 transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Nav */}
        <div>
          {/* Logo */}
          <div className="pb-6 pt-1 px-1 border-b border-[#2A3242]/60 mb-5">
            <BrandMark />
          </div>

          {/* Navigation links */}
          <nav className="flex flex-col gap-1.5" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = 
                item.path === '/' 
                  ? location.pathname === '/' 
                  : location.pathname.startsWith(item.path.split('#')[0]);

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => {
                    if (onClose) onClose();
                  }}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[6px] text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#C8FF43] text-[#080A0F] font-bold shadow-[0_3px_0_#7BA512] translate-y-[-1px]'
                      : 'text-[#AAB7D0] hover:text-[#F4F2EC] hover:bg-[#111620] hover:translate-x-0.5'
                  }`}
                >
                  <span className={isActive ? 'text-[#080A0F]' : 'text-[#7886A1]'}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Dev Community Card */}
        <div className="bg-[#111620] border border-[#2A3242] rounded-[8px] p-3.5 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            {/* 8-bit Pixel Heart */}
            <svg viewBox="0 0 16 16" className="w-4 h-4 fill-[#C8FF43]" shapeRendering="crispEdges">
              <rect x="2" y="4" width="4" height="2" />
              <rect x="10" y="4" width="4" height="2" />
              <rect x="0" y="6" width="8" height="2" />
              <rect x="8" y="6" width="8" height="2" />
              <rect x="0" y="8" width="16" height="2" />
              <rect x="2" y="10" width="12" height="2" />
              <rect x="4" y="12" width="8" height="2" />
              <rect x="6" y="14" width="4" height="2" />
            </svg>
          </div>
          <p className="text-xs text-[#AAB7D0] leading-snug font-mono">
            Built for<br />
            frontend devs,<br />
            by frontend devs.
          </p>

          {/* Retro Checkerboard strip */}
          <div className="mt-3.5 h-3 w-full bg-checker opacity-40 rounded-[2px]" />
        </div>
      </aside>
    </>
  );
}
