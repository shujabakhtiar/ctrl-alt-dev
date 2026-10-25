import { Menu, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import BrandMark from '../brand/BrandMark';

export default function Header({ onMenuClick }) {
  const [isLight, setIsLight] = useState(false);

  const toggleTheme = () => {
    setIsLight(!isLight);
    document.documentElement.setAttribute('data-theme', !isLight ? 'light' : 'dark');
  };

  return (
    <header className="h-16 border-b border-[#2A3242] bg-[#080A0F]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8">
      {/* Mobile Menu Toggle & Brand */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-[6px] text-[#AAB7D0] hover:text-[#F4F2EC] hover:bg-[#111620] border border-[#2A3242]"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="lg:hidden">
          <BrandMark showVersion={false} />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4 sm:gap-6 ml-auto">
        {/* Tagline */}
        <span className="hidden sm:inline-block font-mono text-xs tracking-wider text-[#7886A1] uppercase">
          SMALL TOOLS. BIG TIME SAVINGS.
        </span>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full border border-[#2A3242] bg-[#111620] hover:bg-[#171D29] hover:border-[#46536B] text-[#AAB7D0] hover:text-[#F4F2EC] flex items-center justify-center transition-colors"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* GitHub Link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="w-8 h-8 rounded-full border border-[#2A3242] bg-[#111620] hover:bg-[#171D29] hover:border-[#46536B] text-[#AAB7D0] hover:text-[#F4F2EC] flex items-center justify-center transition-colors"
            title="GitHub Repository"
            aria-label="GitHub Repository"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
