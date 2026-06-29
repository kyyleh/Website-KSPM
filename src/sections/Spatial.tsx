import { useEffect, useRef, useState } from 'react';
import { heroConfig } from '../config';
import { getMediaUrl } from '../lib/strapi';
import { ArrowRight, MessageSquare } from 'lucide-react';

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!start || hasRun.current) return;
    hasRun.current = true;

    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);

  return count;
}

export function Spatial({ data, onNavigate }: { data?: typeof heroConfig; onNavigate?: (page: string) => void }) {
  const activeConfig = data || heroConfig;

  // Null check: if config is empty, render nothing
  if (!activeConfig.mainTitle) return null;

  const [isVisible, setIsVisible] = useState(false);

  // Build count-up hooks from stats config
  const stat0 = activeConfig.stats[0];
  const stat1 = activeConfig.stats[1];
  const stat2 = activeConfig.stats[2];
  const stat3 = activeConfig.stats[3];
  
  const count0 = useCountUp(stat0?.value ?? 0, 2000, isVisible && (stat0?.value ?? 0) < 2000);
  const count1 = useCountUp(stat1?.value ?? 0, 2200, isVisible && (stat1?.value ?? 0) < 2000);
  const count2 = useCountUp(stat2?.value ?? 0, 1800, isVisible && (stat2?.value ?? 0) < 2000);
  const count3 = useCountUp(stat3?.value ?? 0, 1500, isVisible && (stat3?.value ?? 0) < 2000);
  
  const counts = [
    (stat0?.value ?? 0) >= 2000 ? stat0?.value : count0, 
    (stat1?.value ?? 0) >= 2000 ? stat1?.value : count1, 
    (stat2?.value ?? 0) >= 2000 ? stat2?.value : count2, 
    (stat3?.value ?? 0) >= 2000 ? stat3?.value : count3
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="spatial"
      className="relative w-full min-h-screen bg-background flex flex-col justify-between pt-20 sm:pt-28 lg:pt-32 pb-8 lg:pb-12 overflow-hidden"
    >
      {/* Abstract background gradient overlays matching BEM */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-background/50 to-background pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(201, 146, 42, 0.4) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(201, 146, 42, 0.3) 0%, transparent 50%)`
        }}
      />

      <div className="container-custom relative z-10 flex-grow grid grid-cols-12 gap-4 sm:gap-8 lg:gap-16 items-center w-full">
        {/* Left Column: Text Content */}
        <div 
          className={`col-span-12 lg:col-span-7 flex flex-col items-start gap-2.5 sm:gap-4 lg:gap-6 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 className="font-sans text-[1.25rem]/[1.1] sm:text-2xl/[1.1] md:text-4xl/[1.1] lg:text-[3.8rem]/[1.05] xl:text-[4.8rem]/[1.05] 2xl:text-[5.5rem]/[1.05] text-primary tracking-tight font-extrabold max-w-2xl">
            {activeConfig.mainTitle}
          </h1>

          <p className="text-muted-foreground text-[10px] sm:text-xs md:text-sm lg:text-base leading-relaxed max-w-xl">
            {activeConfig.description || "Kelompok Studi Pasar Modal FEB UIKA Bogor hadir sebagai wadah edukasi, riset, dan analisis instrumen pasar modal bagi seluruh akademisi Universitas Ibn Khaldun."}
          </p>

          <div className="flex flex-wrap gap-2 sm:gap-4 mt-1 sm:mt-2">
            <button
              onClick={() => onNavigate ? onNavigate(activeConfig.ctaTarget || '#about') : scrollToSection(activeConfig.ctaTarget || '#about')}
              className="btn-primary px-3 py-1.5 sm:px-8 sm:py-3 text-[10px] sm:text-sm flex items-center gap-1 sm:gap-2 group cursor-pointer"
            >
              {activeConfig.ctaButtonText || "Jelajahi Kami"}
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => scrollToSection('#contact')}
              className="btn-dark px-3 py-1.5 sm:px-8 sm:py-3 text-[10px] sm:text-sm flex items-center gap-1 sm:gap-2 group cursor-pointer"
            >
              Hubungi Kami
              <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Featured Image Box */}
        <div 
          className={`col-span-12 lg:col-span-5 w-full max-w-xl mx-auto rounded-lg sm:rounded-2xl overflow-hidden border border-border shadow-premium bg-white transition-all duration-1000 delay-300 ease-out ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
          }`}
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden group">
            <img
              src={getMediaUrl(activeConfig.backgroundImage)}
              alt="KSPM FEB UIKA Banner"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </div>

      {/* Bottom Segment: Stats Counter & Scroll indicator */}
      <div 
        className={`container-custom relative z-10 w-full mt-6 sm:mt-8 lg:mt-12 transition-all duration-1000 delay-500 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="border-t border-border pt-4 sm:pt-6 lg:pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-12">
            {activeConfig.stats.map((stat, index) => (
              <div 
                key={index} 
                className={`text-left ${
                  index === 0
                    ? ''
                    : index % 2 === 0
                      ? 'border-none md:border-l border-border pl-0 md:pl-8'
                      : 'border-l border-border pl-6 md:pl-8'
                }`}
              >
                <div className="font-serif text-2xl md:text-4xl text-primary font-bold mb-1 tabular-nums">
                  {counts[index]}{stat.suffix}
                </div>
                <div className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest font-bold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
