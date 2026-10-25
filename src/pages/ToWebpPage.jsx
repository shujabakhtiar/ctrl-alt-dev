import { Link } from 'react-router-dom';
import AssetReducerWidget from '../components/AssetReducerWidget';

export default function ToWebpPage() {
  return (
    <div className="subpage-container">
      <nav className="breadcrumb-nav" aria-label="Breadcrumb">
        <Link to="/" className="breadcrumb-link">Devs-Toolkit</Link>
        <span className="breadcrumb-separator">/</span>
        <Link to="/image-convertor" className="breadcrumb-link">Image Converter</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">Convert to WebP</span>
      </nav>

      <AssetReducerWidget />
    </div>
  );
}
