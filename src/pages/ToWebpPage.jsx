import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AssetReducerWidget from '../components/AssetReducerWidget';

export default function ToWebpPage() {
  return (
    <div className="max-w-5xl mx-auto py-2">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 font-mono text-xs text-[#7886A1] mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-[#C8FF43] transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>DevToolkit</span>
        </Link>
        <span>/</span>
        <Link to="/image-convertor" className="hover:text-[#C8FF43] transition-colors">
          Image Converter
        </Link>
        <span>/</span>
        <span className="text-[#F4F2EC] font-bold">Convert to WebP</span>
      </nav>

      <AssetReducerWidget />
    </div>
  );
}
