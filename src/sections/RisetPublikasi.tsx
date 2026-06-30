import { useEffect, useRef } from 'react';
import { Wine, Sparkles, Clock, ArrowRight, BookOpen, TrendingUp } from 'lucide-react';
import { risetPublikasiConfig, navigationConfig } from '../config';

// Icon lookup map for dynamic icon resolution from config strings
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wine, Sparkles, Clock, BookOpen, TrendingUp,
};

import { getMediaUrl } from '../lib/strapi';

export function RisetPublikasi({ onNavigate, data }: { onNavigate?: (href: string) => void; data?: typeof risetPublikasiConfig }) {
  const activeConfig = data || risetPublikasiConfig;

  // Null check: if config is empty, render nothing
  if (!activeConfig.mainTitle || activeConfig.programs.length === 0) return null;

  const programs = activeConfig.programs;
  const features = activeConfig.features;
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.05 }
    );

    const elements = sectionRef.current?.querySelectorAll('.fade-up, .slide-in-left, .slide-in-right');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="programs"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-background py-8 sm:py-12 md:py-16 border-t border-border"
    >
      {/* Subtle Texture Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #d2a855 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container-custom relative z-10">
        {/* Section Title */}
        <div className="fade-up text-center mb-6 sm:mb-10 md:mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-h1 text-[#1c1515] mb-4">{activeConfig.mainTitle}</h2>
        </div>

        {/* General Features Grid (Materi Pembelajaran Utama) */}
        {features.length > 0 && (
          <div className="fade-up mb-10 sm:mb-16 md:mb-20">
            <h4 className="font-serif text-xl sm:text-2xl text-[#1c1515] mb-4 sm:mb-8 text-center uppercase tracking-wide">Materi Pembelajaran Utama</h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {features.map((feature) => {
                const IconComponent = iconMap[feature.icon] || BookOpen;
                return (
                  <div key={feature.title} className="flex flex-col items-center text-center group bg-white/90 border border-border hover:border-gold-400 shadow-premium hover:shadow-gold-soft p-4 sm:p-6 rounded-2xl transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center mb-4 group-hover:bg-gold-500/20 transition-colors">
                      <IconComponent className="w-6 h-6 text-gold-500" />
                    </div>
                    <h5 className="font-serif text-base text-[#1c1515] mb-2 font-semibold">{feature.title}</h5>
                    <p className="text-xs text-[#4a4545] leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Programs List (Vertical Stack of Alternating Cards) */}
        <div className="space-y-8 sm:space-y-12 md:space-y-16 border-t border-border pt-8 sm:pt-12 md:pt-16">
          <div className="fade-up text-center mb-6 sm:mb-10">
            <span className="font-script text-2xl md:text-4xl text-gold-gradient block mb-1">Daftar Program</span>
            <h3 className="font-serif text-2xl md:text-3xl text-neutral-900 font-semibold uppercase tracking-wide">Detail Program KSPM</h3>
          </div>

          <div className="space-y-6 sm:space-y-10 md:space-y-12">
            {programs.map((program, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={program.id}
                  className="fade-up bg-white/95 backdrop-blur-sm border border-border rounded-2xl overflow-hidden shadow-premium hover:shadow-gold-soft hover:-translate-y-1 transition-all duration-500"
                >
                  <div className="grid md:grid-cols-12 items-stretch">
                    {/* Image Container */}
                    <div className={`relative w-full md:col-span-5 overflow-hidden md:min-h-0 ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                      <img
                        src={getMediaUrl(program.image)}
                        alt={program.name}
                        loading="lazy"
                        className="relative z-10 w-full h-auto object-cover object-center hover:scale-105 transition-transform duration-700 md:absolute md:inset-0 md:h-full"
                      />
                    </div>

                    {/* Content Container */}
                    <div className={`p-4 sm:p-6 md:p-8 lg:p-10 md:col-span-7 flex flex-col justify-center ${isEven ? 'md:order-2' : 'md:order-1'}`}>
                      {/* Name */}
                      <div className="mb-4">
                        <h3 className="font-serif text-2xl md:text-3xl text-neutral-900 font-bold mb-1">
                          {program.name}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-neutral-600 text-sm md:text-base leading-relaxed mb-6">
                        {program.description}
                      </p>

                      {/* CTA */}
                      {navigationConfig.ctaButtonText && (
                        <button
                          onClick={() => {
                            if (onNavigate) {
                              onNavigate('#contact');
                            } else {
                              const element = document.querySelector('#contact');
                              if (element) element.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className="bg-[#1c1515] text-white hover:bg-gold-500 transition-all duration-300 px-6 py-2.5 text-xs font-medium tracking-wide rounded-sm cursor-pointer border border-[#1c1515] hover:border-gold-500 shadow-sm w-fit flex items-center gap-2 group"
                          aria-label={`Pelajari program ${program.name}`}
                        >
                          Pelajari Program
                          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
