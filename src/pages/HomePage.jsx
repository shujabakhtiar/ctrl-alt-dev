import Hero from '../components/Hero';
import PopularToolsGrid from '../components/tools/PopularToolsGrid';
import BottomBanner from '../components/layout/BottomBanner';

export default function HomePage() {
  const handleExplore = (e) => {
    e?.preventDefault();
    const el = document.getElementById('popular-tools');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWhy = (e) => {
    e?.preventDefault();
    const el = document.getElementById('features-banner');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Hero Section */}
      <Hero onExploreClick={handleExplore} onWhyClick={handleWhy} />

      {/* Popular Tools 4x2 Grid */}
      <PopularToolsGrid />

      {/* Value Props & Sticker Banner */}
      <BottomBanner />
    </div>
  );
}
