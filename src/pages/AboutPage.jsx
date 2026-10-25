import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Terminal, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Cpu, 
  Layers, 
  Rocket 
} from 'lucide-react';
import Button from '../components/ui/Button';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto py-4">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 font-mono text-xs text-[#7886A1] mb-8" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-[#C8FF43] transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="text-[#F4F2EC] font-bold">The Story</span>
      </nav>

      {/* 1. The Hero — BIG, BOLD, A LITTLE UNHINGED */}
      <section className="mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#C8FF43]/10 border border-[#C8FF43] text-xs font-mono font-bold text-[#C8FF43] mb-6 shadow-[0_2px_0_#7BA512]">
          <Terminal className="w-3.5 h-3.5" />
          <span>FOUNDER_LOG.TXT • THE STORY</span>
        </div>

        <h1 className="font-['Silkscreen',monospace] text-3xl sm:text-5xl md:text-6xl text-[#F4F2EC] leading-[1.1] tracking-normal mb-8">
          AI BUILT THE APP. <br />
          <span className="text-[#C8FF43]">NOW FIX EVERYTHING ELSE.</span>
        </h1>

        <div className="bg-[#111620] border-l-4 border-l-[#C8FF43] border border-[#2A3242] p-5 sm:p-6 rounded-[8px] max-w-3xl">
          <p className="text-base sm:text-lg text-[#F4F2EC] font-medium leading-relaxed">
            So, here&apos;s the thing. AI has made building apps ridiculously easy. Got an idea? Generate some code. Need a design? Ask AI. Need assets? ChatGPT and Midjourney have your back.
          </p>
          <p className="font-['Silkscreen',monospace] text-[#F05CE8] text-sm mt-3 font-bold tracking-wide">
            UNTIL THEY DON&apos;T.
          </p>
        </div>
      </section>

      {/* 2. The Origin Story — Split Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-20">
        {/* Left Column: The Raw Narrative */}
        <div className="lg:col-span-7 space-y-6 text-sm sm:text-base text-[#AAB7D0] leading-relaxed">
          <p>
            I was building my own projects with AI and kept running into the exact same stupid little problems. The assets looked great in the prompt, but they were massive PNGs and JPEGs when I desperately needed lightweight WebP.
          </p>

          <p>
            Backgrounds that needed removing. SVGs that were bloated with Adobe Illustrator junk. Files that were easily 10x bigger than they had any right to be.
          </p>

          <p>
            And fixing them? Another random ad-infested website. Another tool. Sometimes a credit card form demanding a <span className="text-[#FF9855] font-mono font-bold">$14/month subscription</span> just to export transparent pixels.
          </p>

          {/* Developer Callout Box */}
          <div className="p-4 sm:p-5 bg-[#0D1018] border-2 border-[#2A3242] rounded-[8px] my-6 shadow-[0_4px_0_#000000]">
            <p className="font-['Space_Grotesk',sans-serif] text-xl sm:text-2xl font-bold text-[#F4F2EC] italic">
              &ldquo;Bro, I&apos;m just trying to ship my app.&rdquo;
            </p>
          </div>

          <p>
            The funny part? A lot of these conversions and image transformations can be done completely for free right inside modern browsers using standard Web APIs and WebAssembly.
          </p>

          <p>
            Why am I paying or waiting on cloud servers for something that shouldn&apos;t be this complicated?
          </p>

          <div className="pt-2">
            <h2 className="font-['Silkscreen',monospace] text-xl text-[#F4F2EC] font-bold mb-3">
              SO I BUILT <span className="text-[#C8FF43]">CTRL ALT DEV</span>.
            </h2>
            <p>
              A focused, client-side toolbox for the exact friction that slows developers down. Convert images. Tame bloated assets. Keep privacy absolute.
            </p>
            <p className="mt-3 text-xs sm:text-sm text-[#7886A1] font-mono">
              No jumping between 15 different sketchy tabs. No subscriptions for basic utilities. Just open a tool, get the job done at native silicon speed, and get back to building.
            </p>
          </div>
        </div>

        {/* Right Column: Fake Developer Workflow (The Pain Visualizer) */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="bg-[#0D1018] border-2 border-[#2A3242] rounded-[10px] p-5 shadow-[0_8px_0_#000000] overflow-hidden">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#2A3242] font-mono text-xs">
              <span className="text-[#C8FF43] font-bold">&gt; WORKFLOW_TRACE.SH</span>
              <span className="text-[#7886A1]">EXIT: 0</span>
            </div>

            {/* Pain Step 1 */}
            <div className="p-3.5 bg-[#111620] border border-[#2A3242] rounded-[6px] mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs text-[#F4F2EC] font-bold">ai-generated-hero.png</span>
                <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-[#FF9855]/20 text-[#FF9855] border border-[#FF9855]/40 font-bold">
                  4.8 MB ⚠️
                </span>
              </div>
              <div className="font-mono text-[11px] text-[#7886A1]">
                Uncompressed PNG-24 • 3840x2160
              </div>
            </div>

            {/* Arrow & Rant Note */}
            <div className="my-2 flex items-center justify-center gap-2 font-mono text-xs text-[#F05CE8]">
              <AlertTriangle className="w-4 h-4 animate-bounce" />
              <span className="font-bold">&ldquo;WHY IS IT 4.8 MB?!&rdquo;</span>
            </div>

            {/* Pain Step 2: The Solution */}
            <div className="p-3.5 bg-[#171D29] border border-[#795BFF] rounded-[6px] my-3 shadow-[0_2px_0_#462AB8]">
              <div className="flex items-center gap-2 mb-1">
                <Cpu className="w-4 h-4 text-[#795BFF]" />
                <span className="font-mono text-xs text-[#F4F2EC] font-bold">CtrlAltDev Engine</span>
              </div>
              <div className="font-mono text-[11px] text-[#AAB7D0]">
                Client Canvas • Local WebP Encode (80% Quality)
              </div>
            </div>

            {/* Arrow down */}
            <div className="my-2 text-center text-[#C8FF43] font-mono font-bold text-xs">
              ↓ 0 ms upload (100% local)
            </div>

            {/* Pain Step 3: Success */}
            <div className="p-3.5 bg-[#C8FF43]/10 border-2 border-[#C8FF43] rounded-[6px] shadow-[0_3px_0_#7BA512]">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs text-[#F4F2EC] font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C8FF43]" />
                  <span>FINALLY.webp</span>
                </span>
                <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-[#C8FF43] text-[#080A0F] font-bold">
                  184 KB ✅
                </span>
              </div>
              <div className="font-mono text-[11px] text-[#C8FF43] font-semibold">
                Saved 96.2% • LCP reduced by 3.8s
              </div>
            </div>

            {/* Handwritten doodle sticker */}
            <div className="mt-4 pt-3 border-t border-[#2A3242] text-center">
              <span className="font-['Kalam',cursive] text-[#C8FF43] text-sm block rotate-[-1deg]">
                &ldquo;Took 2 seconds. No credit card required.&rdquo;
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Philosophy — Three Punchy Cards */}
      <section className="mb-20">
        <div className="mb-8 pb-3 border-b border-[#2A3242]">
          <h2 className="font-['Silkscreen',monospace] text-2xl text-[#F4F2EC] font-bold">
            THE PHILOSOPHY
          </h2>
          <p className="text-xs sm:text-sm text-[#7886A1] font-mono mt-1">
            Three rules for every tool we ship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 01 */}
          <div className="bg-[#111620] border-2 border-[#2A3242] hover:border-[#C8FF43] rounded-[8px] p-6 shadow-[0_4px_0_#000000] transition-colors group">
            <span className="font-mono font-bold text-xs px-2 py-1 rounded bg-[#C8FF43] text-[#080A0F] mb-4 inline-block">
              01
            </span>
            <h3 className="font-['Space_Grotesk',sans-serif] font-bold text-lg text-[#F4F2EC] mb-2 tracking-tight group-hover:text-[#C8FF43] transition-colors">
              LESS TAB HOPPING
            </h3>
            <p className="text-sm text-[#AAB7D0] leading-relaxed">
              One reliable toolbox. Fewer random, suspicious websites littered with banner ads and trackers.
            </p>
          </div>

          {/* Card 02 */}
          <div className="bg-[#111620] border-2 border-[#2A3242] hover:border-[#795BFF] rounded-[8px] p-6 shadow-[0_4px_0_#000000] transition-colors group">
            <span className="font-mono font-bold text-xs px-2 py-1 rounded bg-[#795BFF] text-[#F4F2EC] mb-4 inline-block">
              02
            </span>
            <h3 className="font-['Space_Grotesk',sans-serif] font-bold text-lg text-[#F4F2EC] mb-2 tracking-tight group-hover:text-[#795BFF] transition-colors">
              NO PAYWALL NONSENSE
            </h3>
            <p className="text-sm text-[#AAB7D0] leading-relaxed">
              Basic utilities shouldn&apos;t cost a subscription. If code runs on your hardware, it belongs to you.
            </p>
          </div>

          {/* Card 03 */}
          <div className="bg-[#111620] border-2 border-[#2A3242] hover:border-[#F05CE8] rounded-[8px] p-6 shadow-[0_4px_0_#000000] transition-colors group">
            <span className="font-mono font-bold text-xs px-2 py-1 rounded bg-[#F05CE8] text-[#080A0F] mb-4 inline-block">
              03
            </span>
            <h3 className="font-['Space_Grotesk',sans-serif] font-bold text-lg text-[#F4F2EC] mb-2 tracking-tight group-hover:text-[#F05CE8] transition-colors">
              BUILT FOR THE SHIP
            </h3>
            <p className="text-sm text-[#AAB7D0] leading-relaxed">
              Spend less time fixing assets and wrestling formats. Spend more time building cool stuff.
            </p>
          </div>
        </div>
      </section>

      {/* 4. The Bigger Picture */}
      <section className="bg-[#0D1018] border border-[#2A3242] rounded-[10px] p-8 sm:p-10 mb-16 relative overflow-hidden">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">👀</span>
            <h2 className="font-['Silkscreen',monospace] text-xl sm:text-2xl text-[#F4F2EC] font-bold">
              THE BIGGER PICTURE
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#AAB7D0] leading-relaxed mb-4">
            AI isn&apos;t going anywhere, and honestly, neither are the annoying little tasks that come with building modern software.
          </p>

          <p className="text-sm sm:text-base text-[#AAB7D0] leading-relaxed mb-4">
            AI can get you 80% of the way there. But the final stretch? That&apos;s where the details matter. Performance, asset weight, optimization, Core Web Vitals — all the stuff that turns <span className="font-mono text-[#F4F2EC] bg-[#171D29] px-1 rounded">&ldquo;it works on my machine&rdquo;</span> into something you&apos;re actually proud to ship to real users.
          </p>

          <p className="text-sm sm:text-base text-[#F4F2EC] font-medium leading-relaxed">
            I want Ctrl Alt Dev to be that missing toolbox.
          </p>

          <p className="text-xs sm:text-sm text-[#7886A1] mt-4 font-mono">
            Built by a dev who got tired of the same nonsense. For devs who get it.
          </p>
        </div>
      </section>

      {/* 5. The Ending / Call to Action */}
      <section className="text-center py-12 px-6 bg-[#111620] border-2 border-[#2A3242] rounded-[12px] shadow-[0_8px_0_#000000]">
        <div className="font-['Silkscreen',monospace] text-2xl sm:text-4xl text-[#F4F2EC] font-bold mb-2">
          LESS BUSYWORK. MORE BUILDING.
        </div>
        <div className="font-['Silkscreen',monospace] text-xl sm:text-3xl text-[#C8FF43] font-bold mb-6">
          CTRL. ALT. SHIP. 🚀
        </div>

        <div className="flex justify-center">
          <Button
            to="/tools"
            variant="lime"
            size="lg"
            className="text-base font-bold tracking-wider px-8"
            iconRight={<ArrowRight className="w-5 h-5" />}
          >
            EXPLORE THE TOOLS
          </Button>
        </div>
      </section>
    </div>
  );
}
