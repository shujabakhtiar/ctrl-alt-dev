import { ArrowRight, Play, Sparkles, Terminal } from 'lucide-react';
import Button from './ui/Button';
import mascotHeroImg from '../assets/mascot_hero.jpg';

export default function Hero({ onExploreClick, onWhyClick }) {
  return (
    <section className="relative pt-2 pb-12 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#795BFF]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-64 h-64 bg-[#C8FF43]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Copy & Actions */}
        <div className="lg:col-span-7 flex flex-col items-start z-10">
          {/* Tag Pill Badge */}
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#1A1838] border border-[#795BFF]/50 text-xs font-mono mb-6 shadow-[0_0_15px_rgba(121,91,255,0.2)]">
            <span className="text-[#C8FF43] font-bold">⚡ FAST</span>
            <span className="text-[#7886A1]">•</span>
            <span className="text-[#62B9FF] font-bold">⚡ FREE</span>
            <span className="text-[#7886A1]">•</span>
            <span className="text-[#F05CE8] font-bold">⚡ NO SIGN UP</span>
          </div>

          {/* Main Display Heading */}
          <h1 className="font-['Silkscreen',monospace] text-3xl sm:text-4xl md:text-[44px] lg:text-[46px] leading-[1.18] tracking-normal mb-5 text-[#F4F2EC]">
            ALL THE DEV TOOLS <br />
            YOU <span className="text-[#C8FF43]">ACTUALLY</span> NEED
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#AAB7D0] leading-relaxed max-w-xl mb-8">
            Convert, compress, edit and optimize your assets — all in one place. No sign up. No limits. Just useful tools for modern developers.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <Button
              to="/tools"
              onClick={onExploreClick}
              variant="lime"
              size="lg"
              className="text-sm font-bold tracking-wider"
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              EXPLORE TOOLS
            </Button>

            <Button
              to="/about"
              variant="dark"
              size="lg"
              className="text-sm font-bold text-[#F4F2EC]"
              icon={<Play className="w-3.5 h-3.5 fill-current" />}
            >
              WHY CTRLALTDEV?
            </Button>
          </div>
        </div>

        {/* Right Column: Pixel Art Mascot & Retro Terminal Artwork */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="relative w-full max-w-md rounded-[12px] border-2 border-[#2A3242] bg-[#0D1018] p-2 shadow-[0_12px_32px_rgba(0,0,0,0.8)] overflow-hidden group">
            {/* Mascot Image */}
            <img
              src={mascotHeroImg}
              alt="CtrlAltDev Pixel Art Mascot typing at laptop with black cat"
              className="w-full h-auto rounded-[8px] object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />

            {/* Floating Terminal Code Window */}
            <div className="absolute top-4 left-4 bg-[#080A0F]/90 border border-[#2A3242] rounded-[6px] p-2.5 font-mono text-[11px] shadow-lg backdrop-blur-xs hidden sm:block">
              <div className="flex items-center gap-1.5 pb-1.5 mb-1.5 border-b border-[#2A3242]">
                <div className="w-2 h-2 rounded-full bg-[#FF9855]" />
                <div className="w-2 h-2 rounded-full bg-[#FFD84D]" />
                <div className="w-2 h-2 rounded-full bg-[#C8FF43]" />
                <span className="text-[9px] text-[#7886A1] ml-1">toolkit.sh</span>
              </div>
              <div className="text-[#C8FF43] space-y-0.5">
                <div>&gt; optimize</div>
                <div>&gt; convert</div>
                <div>&gt; create</div>
                <div className="flex items-center">
                  <span>&gt; repeat_</span>
                  <span className="w-1.5 h-3 bg-[#C8FF43] ml-0.5 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Floating Retro Badges: PNG -> WEBP */}
            <div className="absolute bottom-4 right-4 bg-[#111620]/95 border border-[#46536B] rounded-[6px] px-2.5 py-1.5 font-mono text-[11px] shadow-xl flex items-center gap-2 backdrop-blur-xs">
              <span className="text-[#F05CE8] font-bold">PNG</span>
              <span className="text-[#C8FF43]">&rarr;</span>
              <span className="text-[#C8FF43] font-bold">WEBP</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
