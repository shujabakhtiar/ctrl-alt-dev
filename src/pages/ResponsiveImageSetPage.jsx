import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ResponsiveImageSet } from '../modules/responsive-image-set';

export default function ResponsiveImageSetPage() {
  return (
    <div className="max-w-6xl mx-auto py-2">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 font-mono text-xs text-[#7886A1] mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-[#C8FF43] transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>CtrlAltDev</span>
        </Link>
        <span>/</span>
        <Link to="/tools" className="hover:text-[#C8FF43] transition-colors">
          Tools
        </Link>
        <span>/</span>
        <span className="text-[#F4F2EC] font-bold">Responsive Image Set</span>
      </nav>

      <ResponsiveImageSet />
    </div>
  );
}
