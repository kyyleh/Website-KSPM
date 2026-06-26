import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { heroConfig } from '../config';

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

import { getMediaUrl } from '../lib/strapi';

export function Hero({ isReady, data }: { isReady: boolean; data?: typeof heroConfig }) {
  const activeConfig = data || heroConfig;

  // Null check: if config is empty, render nothing
  if (!activeConfig.mainTitle) return null;

  const [phase, setPhase] = useState(0);
  // phase 0: hidden, 1: bg visible, 2: title, 3: cta, 4: stats counting

  // Build count-up hooks from stats config
  const stat0 = activeConfig.stats[0];
  const stat1 = activeConfig.stats[1];
  const stat2 = activeConfig.stats[2];
  const stat3 = activeConfig.stats[3];
  const count0 = useCountUp(stat0?.value ?? 0, 2000, phase >= 4 && (stat0?.value ?? 0) < 2000);
  const count1 = useCountUp(stat1?.value ?? 0, 2200, phase >= 4 && (stat1?.value ?? 0) < 2000);
  const count2 = useCountUp(stat2?.value ?? 0, 1800, phase >= 4 && (stat2?.value ?? 0) < 2000);
  const count3 = useCountUp(stat3?.value ?? 0, 1500, phase >= 4 && (stat3?.value ?? 0) < 2000);
  const counts = [
    (stat0?.value ?? 0) >= 2000 ? stat0?.value : count0, 
    (stat1?.value ?? 0) >= 2000 ? stat1?.value : count1, 
    (stat2?.value ?? 0) >= 2000 ? stat2?.value : count2, 
    (stat3?.value ?? 0) >= 2000 ? stat3?.value : count3
  ];

  useEffect(() => {
    if (!isReady) return;
    // Stagger: bg -> title -> cta -> stats
    const t1 = setTimeout(() => setPhase(1), 100);   // bg reveal
    const t2 = setTimeout(() => setPhase(2), 800);   // title
    const t3 = setTimeout(() => setPhase(3), 1400);  // cta
    const t4 = setTimeout(() => setPhase(4), 2000);  // stats
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [isReady]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background with subtle Ken Burns (disabled on mobile) */}
      <div className={`absolute inset-0 transition-opacity duration-[1.5s] ease-out ${phase >= 1 ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 lg:hero-kenburns">
          <img
            src={getMediaUrl(activeConfig.backgroundImage)}
            alt={activeConfig.mainTitle}
            className="w-full h-full object-cover scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#f0ede6]/90 via-[#f0ede6]/85 to-[#f0ede6]" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom text-center py-32 lg:py-40">
        {/* Script accent */}
        <div className={`transition-all duration-1000 ease-out ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="font-script text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-gold-gradient">
            {activeConfig.scriptText}
          </span>
        </div>

        {/* Divider line */}
        <div className={`mx-auto my-6 h-px bg-gold-500/50 transition-all duration-1000 ease-out ${phase >= 2 ? 'w-24 opacity-100' : 'w-0 opacity-0'}`} style={{ transitionDelay: '0.2s' }} />

        {/* Main Title */}
        <h1 className={`font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] xl:text-[6.5rem] text-[#1c1515] leading-[1.05] tracking-wide transition-all duration-1000 ease-out ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '0.3s' }}>
          {activeConfig.mainTitle}
        </h1>

        {/* CTA */}
        {activeConfig.ctaButtonText && (
          <div className={`mt-10 transition-all duration-700 ease-out ${phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <button
              onClick={() => scrollToSection(activeConfig.ctaTarget || '#about')}
              className="btn-primary rounded-sm inline-flex items-center gap-2 group"
              aria-label={activeConfig.ctaButtonText}
            >
              {activeConfig.ctaButtonText}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>

      {/* Stats with count-up */}
      {activeConfig.stats.length > 0 && (
        <div className={`absolute bottom-20 left-0 right-0 z-10 transition-all duration-1000 ease-out ${phase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="container-custom">
            <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md py-6 px-4 md:px-8 rounded-xl shadow-premium border border-white/50 hover:shadow-gold-soft transition-all duration-500">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {activeConfig.stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className={`text-center px-2 ${
                      index === 0 ? '' : 
                      index === 1 ? 'border-l border-neutral-200/60' : 
                      index === 2 ? 'md:border-l border-neutral-200/0 md:border-l-neutral-200/60' : 
                      'border-l border-neutral-200/60'
                    }`}
                  >
                    <div className="font-serif text-2xl md:text-4xl text-gold-gradient mb-1 md:mb-2 tabular-nums font-semibold">
                      {counts[index]}{stat.suffix}
                    </div>
                    <div className="text-[10px] md:text-sm text-neutral-600 uppercase tracking-wider font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#f0ede6] to-transparent" />

      {/* Side decorative */}
      {activeConfig.decorativeText && (
        <div className={`absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4 transition-opacity duration-1000 ${phase >= 3 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-gold-500/50 to-transparent" />
          <span className="text-gold-500 text-xs tracking-widest" style={{ writingMode: 'vertical-lr' }}>{activeConfig.decorativeText}</span>
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-gold-500/50 to-transparent" />
        </div>
      )}
    </section>
  );
}
