import { ShieldCheck, Zap, UserCheck } from 'lucide-react';

export default function BottomBanner() {
  return (
    <section id="features-banner" className="pt-2 pb-12">
      <div className="bg-[#0D1018] border border-[#2A3242] rounded-[10px] p-6 lg:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
        {/* Left: Handwritten neon sketch box */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="border-2 border-[#C8FF43] border-dashed rounded-[6px] p-3 text-center bg-[#C8FF43]/5 rotate-[-2deg]">
            <div className="font-['Kalam',cursive] font-bold text-[#C8FF43] text-sm leading-tight uppercase tracking-wider">
              LESS<br />
              SETUP.<br />
              MORE<br />
              BUILDING.
            </div>
          </div>
          <svg className="w-6 h-6 text-[#C8FF43] hidden sm:block rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>

        {/* Middle 3 Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 w-full lg:px-6">
          {/* Feature 1 */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full border border-[#2A3242] bg-[#111620] flex items-center justify-center shrink-0 text-[#AAB7D0]">
              <UserCheck className="w-5 h-5 text-[#62B9FF]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#F4F2EC]">100% Free</h4>
              <p className="text-xs text-[#7886A1] leading-relaxed">
                No hidden fees. No sign up.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full border border-[#2A3242] bg-[#111620] flex items-center justify-center shrink-0 text-[#AAB7D0]">
              <Zap className="w-5 h-5 text-[#C8FF43]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#F4F2EC]">Blazing Fast</h4>
              <p className="text-xs text-[#7886A1] leading-relaxed">
                Optimised for speed &amp; simplicity.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full border border-[#2A3242] bg-[#111620] flex items-center justify-center shrink-0 text-[#AAB7D0]">
              <ShieldCheck className="w-5 h-5 text-[#50E6E6]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#F4F2EC]">No Uploads</h4>
              <p className="text-xs text-[#7886A1] leading-relaxed">
                Your files stay on your device.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Angled Sticker Badge */}
        <div className="shrink-0">
          <div className="inline-block transform rotate-6 border border-[#C8FF43] bg-[#C8FF43]/10 px-3.5 py-2 rounded-[6px] shadow-[0_2px_0_#7BA512]">
            <span className="font-['Silkscreen',monospace] font-bold text-xs text-[#C8FF43] tracking-wider leading-none block text-center">
              TOOLS<br />
              FOR REAL<br />
              + BUILDERS
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
