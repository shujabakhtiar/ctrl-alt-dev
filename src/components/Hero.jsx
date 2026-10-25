import { ArrowRight, Play } from 'lucide-react';
import Button from './ui/Button';
import mascotHeroImg from '../assets/mascot_hero.jpg';
import heroBgImg from '../assets/hero_bg.jpg';

export default function Hero({ onExploreClick, onWhyClick }) {
  return (
    <section className="relative pt-2 pb-8 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#795BFF]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-64 h-64 bg-[#C8FF43]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ========================================================
          DESKTOP VIEW (lg+): Full Scene with Background Image & Overlays
          ======================================================== */}
      <div className="hidden lg:block relative rounded-2xl border-2 border-[#2A3242] bg-[#0A0D14] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        {/* Background Battlestation Pixel Art */}
        <img
          src={heroBgImg}
          alt="CtrlAltDev Developer Battlestation"
          className="absolute inset-0 w-full h-full object-cover object-right-bottom xl:object-center select-none pointer-events-none"
        />

        {/* Readability Gradients / Scrims */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080A0F] via-[#080A0F]/85 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080A0F]/70 via-transparent to-[#080A0F]/30 pointer-events-none" />

        {/* Content Overlaid Directly Upon the Background */}
        <div className="relative z-10 p-10 xl:p-14 min-h-[500px] flex flex-col justify-center">
          <div className="max-w-xl xl:max-w-2xl">
            {/* Tag Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#1A1838]/90 border border-[#795BFF]/50 text-xs font-mono mb-6 shadow-[0_0_15px_rgba(121,91,255,0.2)] backdrop-blur-sm">
              <span className="text-[#C8FF43] font-bold">⚡ FAST</span>
              <span className="text-[#7886A1]">•</span>
              <span className="text-[#62B9FF] font-bold">⚡ FREE</span>
              <span className="text-[#7886A1]">•</span>
              <span className="text-[#F05CE8] font-bold">⚡ NO SIGN UP</span>
            </div>

            {/* Main Display Heading */}
            <h1 className="font-['Silkscreen',monospace] text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] leading-[1.18] tracking-normal mb-5 text-[#F4F2EC] drop-shadow-md">
              ALL THE DEV TOOLS <br />
              YOU <span className="text-[#C8FF43]">ACTUALLY</span> NEED
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#C2CEE3] leading-relaxed max-w-lg mb-8 drop-shadow-sm font-medium">
              Convert, compress, edit and optimize your assets — all in one place. No sign up. No limits. Just useful tools for modern developers.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Button
                to="/tools"
                onClick={onExploreClick}
                variant="lime"
                size="lg"
                className="text-sm font-bold tracking-wider shadow-[0_4px_20px_rgba(200,255,67,0.3)] hover:shadow-[0_6px_25px_rgba(200,255,67,0.45)]"
                iconRight={<ArrowRight className="w-4 h-4" />}
              >
                EXPLORE TOOLS
              </Button>

              <Button
                to="/about"
                variant="dark"
                size="lg"
                className="text-sm font-bold text-[#F4F2EC] bg-[#0F131D]/90 hover:bg-[#1A2030] border border-[#2A3242]"
                icon={<Play className="w-3.5 h-3.5 fill-current" />}
              >
                WHY CTRLALTDEV?
              </Button>
            </div>
          </div>

          {/* Floating Terminal Code Window - Floating over the scene */}
          <div className="absolute top-6 right-6 xl:top-8 xl:right-8 bg-[#080A0F]/90 border border-[#2A3242] rounded-[8px] p-3 font-mono text-[11px] shadow-2xl backdrop-blur-md hidden xl:block">
            <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-[#2A3242]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF9855]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FFD84D]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#C8FF43]" />
              <span className="text-[10px] text-[#7886A1] ml-1.5">toolkit.sh</span>
            </div>
            <div className="text-[#C8FF43] space-y-1">
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
          <div className="absolute bottom-6 right-6 xl:bottom-8 xl:right-8 bg-[#111620]/95 border border-[#46536B] rounded-[8px] px-3.5 py-2 font-mono text-xs shadow-2xl flex items-center gap-2.5 backdrop-blur-md">
            <span className="text-[#F05CE8] font-bold">PNG</span>
            <span className="text-[#C8FF43]">&rarr;</span>
            <span className="text-[#C8FF43] font-bold">WEBP</span>
            <span className="text-[#7886A1] text-[10px]">• 100% LOCAL</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          MOBILE VIEW (< lg): Stacked with Existing Mascot Image
          ======================================================== */}
      <div className="block lg:hidden">
        <div className="flex flex-col gap-8">
          {/* Left Column: Copy & Actions */}
          <div className="flex flex-col items-start z-10">
            {/* Tag Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#1A1838] border border-[#795BFF]/50 text-xs font-mono mb-5 shadow-[0_0_15px_rgba(121,91,255,0.2)]">
              <span className="text-[#C8FF43] font-bold">⚡ FAST</span>
              <span className="text-[#7886A1]">•</span>
              <span className="text-[#62B9FF] font-bold">⚡ FREE</span>
              <span className="text-[#7886A1]">•</span>
              <span className="text-[#F05CE8] font-bold">⚡ NO SIGN UP</span>
            </div>

            {/* Main Display Heading */}
            <h1 className="font-['Silkscreen',monospace] text-2xl sm:text-3xl md:text-4xl leading-[1.2] tracking-normal mb-4 text-[#F4F2EC]">
              ALL THE DEV TOOLS <br />
              YOU <span className="text-[#C8FF43]">ACTUALLY</span> NEED
            </h1>

            {/* Subtitle */}
            <p className="text-sm text-[#AAB7D0] leading-relaxed mb-6">
              Convert, compress, edit and optimize your assets — all in one place. No sign up. No limits. Just useful tools for modern developers.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <Button
                to="/tools"
                onClick={onExploreClick}
                variant="lime"
                size="md"
                className="text-xs sm:text-sm font-bold tracking-wider flex-1 sm:flex-none justify-center"
                iconRight={<ArrowRight className="w-4 h-4" />}
              >
                EXPLORE TOOLS
              </Button>

              <Button
                to="/about"
                variant="dark"
                size="md"
                className="text-xs sm:text-sm font-bold text-[#F4F2EC] flex-1 sm:flex-none justify-center"
                icon={<Play className="w-3.5 h-3.5 fill-current" />}
              >
                WHY CTRLALTDEV?
              </Button>
            </div>
          </div>

          {/* Existing Image Card for Mobile */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-md rounded-[12px] border-2 border-[#2A3242] bg-[#0D1018] p-2 shadow-[0_12px_32px_rgba(0,0,0,0.8)] overflow-hidden group">
              {/* Mascot Image */}
              <img
                src={mascotHeroImg}
                alt="CtrlAltDev Pixel Art Mascot typing at laptop with black cat"
                className="w-full h-auto rounded-[8px] object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />

              {/* Floating Terminal Code Window */}
              <div className="absolute top-4 left-4 bg-[#080A0F]/90 border border-[#2A3242] rounded-[6px] p-2.5 font-mono text-[11px] shadow-lg backdrop-blur-xs">
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
      </div>
    </section>
  );
}
