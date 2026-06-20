import { useEffect, useRef } from 'react';
import { Wine, Sparkles, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { wineShowcaseConfig, navigationConfig } from '../config';

// Icon lookup map for dynamic icon resolution from config strings
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wine, Sparkles, Clock, BookOpen,
};

export function WineShowcase({ onNavigate }: { onNavigate?: (href: string) => void }) {
  // Null check: if config is empty, render nothing
  if (!wineShowcaseConfig.mainTitle || wineShowcaseConfig.wines.length === 0) return null;

  const wines = wineShowcaseConfig.wines;
  const features = wineShowcaseConfig.features;
  const quote = wineShowcaseConfig.quote;
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
      id="research"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      {/* Subtle Texture Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #d2a855 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container-custom relative">
        {/* Section Title */}
        <div className="fade-up text-center mb-16">
          <span className="font-script text-3xl md:text-5xl lg:text-6xl text-gold-gradient block mb-2">{wineShowcaseConfig.scriptText}</span>
          <span className="text-gold-gradient text-xs uppercase tracking-[0.2em] mb-4 block">
            {wineShowcaseConfig.subtitle}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-h1 text-[#1c1515] mb-4">{wineShowcaseConfig.mainTitle}</h2>
          <div className="w-24 h-1 bg-gold-gradient mx-auto" />
        </div>

        {/* General Features Grid (Materi Pembelajaran Utama) - Placed nicely at the top */}
        {features.length > 0 && (
          <div className="fade-up mb-20">
            <h4 className="font-serif text-2xl text-[#1c1515] mb-8 text-center uppercase tracking-wide">Materi Pembelajaran Utama</h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => {
                const IconComponent = iconMap[feature.icon] || BookOpen;
                return (
                  <div key={feature.title} className="flex flex-col items-center text-center group bg-white/90 border border-neutral-200/60 hover:border-gold-400 shadow-premium hover:shadow-gold-soft p-6 rounded-2xl transition-all duration-300">
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
        <div className="space-y-12 md:space-y-16 border-t border-neutral-200/60 pt-16">
          <div className="fade-up text-center mb-10">
            <span className="font-script text-2xl md:text-4xl text-gold-gradient block mb-1">Daftar Riset & Edukasi</span>
            <h3 className="font-serif text-2xl md:text-3xl text-neutral-900 font-semibold uppercase tracking-wide">Program Belajar & Layanan Riset</h3>
            <div className="w-16 h-0.5 bg-gold-gradient mx-auto mt-3" />
          </div>

          <div className="space-y-10 md:space-y-12">
            {wines.map((wine, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={wine.id}
                  className="fade-up bg-white/95 backdrop-blur-sm border border-neutral-200/60 rounded-2xl overflow-hidden shadow-premium hover:shadow-gold-soft hover:-translate-y-1 transition-all duration-500"
                >
                  <div className="grid md:grid-cols-12 items-stretch">
                    {/* Image Container */}
                    <div className={`relative w-full md:col-span-5 overflow-hidden md:min-h-0 ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                      {/* Glow background accent */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className={`w-48 h-48 ${wine.glowColor} rounded-full blur-3xl opacity-10`} />
                      </div>
                      <img
                        src={wine.image}
                        alt={wine.name}
                        loading="lazy"
                        className="relative z-10 w-full h-auto object-cover object-center hover:scale-105 transition-transform duration-700 md:absolute md:inset-0 md:h-full"
                      />
                      {/* Year Badge */}
                      <div className="absolute bottom-4 right-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-sm border border-gold-300 text-xs text-[#7a6024] font-serif font-semibold shadow-gold-soft">
                        {wine.year}
                      </div>
                    </div>

                    {/* Content Container */}
                    <div className={`p-6 md:p-8 lg:p-10 md:col-span-7 flex flex-col justify-start ${isEven ? 'md:order-2' : 'md:order-1'}`}>
                      {/* Name & Subtitle */}
                      <div className="mb-4">
                        <h3 className="font-serif text-2xl md:text-3xl text-neutral-900 font-bold mb-1">
                          {wine.name}
                        </h3>
                        <span className="font-script text-xl text-gold-gradient block">{wine.subtitle}</span>
                      </div>

                      {/* Description */}
                      <p className="text-neutral-600 text-sm md:text-base leading-relaxed mb-6">
                        {wine.description}
                      </p>

                      {/* Focus Materi */}
                      {wine.tastingNotes && (
                        <div className="mb-6">
                          <span className="text-xs text-neutral-500 uppercase tracking-wider block mb-2 font-medium">Fokus Materi</span>
                          <div className="flex flex-wrap gap-2">
                            {wine.tastingNotes.split(',').map((note) => (
                              <span key={note} className="px-3 py-1 bg-gold-500/10 rounded-full text-xs text-[#7a6024] font-medium border border-gold-500/20">
                                {note.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Details Table */}
                      <div className="grid grid-cols-3 gap-1 sm:gap-4 py-4 border-y border-neutral-200/60 mb-6 text-left">
                        <div className="border-r border-neutral-200/60 pr-1 sm:pr-2 md:pr-4">
                          <div className="font-serif text-[10px] min-[375px]:text-xs sm:text-sm md:text-base text-gold-600 font-bold">{wine.temperature}</div>
                          <div className="text-[9px] text-neutral-500 uppercase tracking-wider mt-1 font-semibold">Jadwal</div>
                        </div>
                        <div className="border-r border-neutral-200/60 pr-1 sm:pr-2 md:pr-4">
                          <div className="font-serif text-[10px] min-[375px]:text-xs sm:text-sm md:text-base text-[#7a6024] font-bold">{wine.aging}</div>
                          <div className="text-[9px] text-neutral-500 uppercase tracking-wider mt-1 font-semibold">Jam</div>
                        </div>
                        <div>
                          <div className="font-serif text-[10px] min-[375px]:text-xs sm:text-sm md:text-base text-[#7a6024] font-bold">{wine.alcohol}</div>
                          <div className="text-[9px] text-neutral-500 uppercase tracking-wider mt-1 font-semibold">Level</div>
                        </div>
                      </div>

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
                          aria-label={`Pelajari program ${wine.name}`}
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

        {/* Philosophy / Quote banner at the bottom */}
        {quote.text && (
          <div className="fade-up mt-16 max-w-3xl mx-auto">
            <div className="p-6 md:p-8 bg-white/95 backdrop-blur-sm rounded-2xl border border-neutral-200/60 border-l-4 border-l-gold-500 shadow-premium hover:shadow-gold-soft transition-all duration-300 text-left">
              {quote.prefix && <p className="font-script text-2xl text-gold-gradient mb-2">{quote.prefix}</p>}
              <p className="text-neutral-600 text-sm md:text-base italic leading-relaxed">
                "{quote.text}"
              </p>
              {quote.attribution && <p className="text-[#7a6024] text-xs font-semibold mt-3">— {quote.attribution}</p>}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
