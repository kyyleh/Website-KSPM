import { useState, useEffect, useRef } from 'react';
import { Wine, Sparkles, Clock, ArrowRight, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { wineShowcaseConfig } from '../config';

// Icon lookup map for dynamic icon resolution from config strings
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wine, Sparkles, Clock, BookOpen,
};

export function WineShowcase() {
  // Null check: if config is empty, render nothing
  if (!wineShowcaseConfig.mainTitle || wineShowcaseConfig.wines.length === 0) return null;

  const [activeWine, setActiveWine] = useState(0);
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
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );

    const elements = sectionRef.current?.querySelectorAll('.fade-up, .slide-in-left, .slide-in-right');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const wines = wineShowcaseConfig.wines;
  const features = wineShowcaseConfig.features;
  const quote = wineShowcaseConfig.quote;
  const wine = wines[activeWine];

  const nextWine = () => setActiveWine((prev) => (prev + 1) % wines.length);
  const prevWine = () => setActiveWine((prev) => (prev - 1 + wines.length) % wines.length);

  return (
    <section
      id="research"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      {/* Subtle Texture Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #d2a855 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container-custom relative">
        {/* Section Title */}
        <div className="fade-up text-center mb-16">
          <span className="font-script text-5xl md:text-6xl text-gold-400 block mb-2">{wineShowcaseConfig.scriptText}</span>
          <span className="text-gold-500 text-xs uppercase tracking-[0.2em] mb-4 block">
            {wineShowcaseConfig.subtitle}
          </span>
          <h2 className="font-serif text-h1 text-white">{wineShowcaseConfig.mainTitle}</h2>
        </div>

        {/* Wine Tabs */}
        <div className="fade-up flex justify-center gap-2 mb-16" style={{ transitionDelay: '0.1s' }}>
          {wines.map((w, i) => (
            <button
              key={w.id}
              onClick={() => setActiveWine(i)}
              className={`px-6 py-3 rounded-sm text-sm transition-all duration-300 cursor-pointer ${
                i === activeWine
                  ? 'bg-gold-500 text-white font-semibold'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
              }`}
            >
              {w.name}
            </button>
          ))}
        </div>

        {/* Main Content (2-Column Layout) */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Info & Features Grid */}
          <div className="slide-in-left lg:col-span-7 flex flex-col gap-10">
            {/* Active Program Info */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-left">
              {/* Year + Name */}
              <div className="mb-6">
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="font-serif text-5xl lg:text-6xl text-gold-500/20 leading-none">{wine.year}</span>
                  <div>
                    <h3 className="font-serif text-2xl lg:text-3xl text-white leading-tight">{wine.name}</h3>
                    <span className="font-script text-lg text-gold-400">{wine.subtitle}</span>
                  </div>
                </div>
                <div className="w-16 h-px bg-gold-500 mt-2" />
              </div>

              {/* Mobile Image (Visible only on mobile/tablet) */}
              <div className="block lg:hidden w-full my-6">
                <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden border border-white/10 shadow-lg bg-[#181818]">
                  {/* Glow */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className={`w-48 h-48 ${wine.glowColor} rounded-full blur-3xl opacity-30 transition-colors duration-700`} />
                  </div>
                  {/* Images */}
                  {wines.map((w, i) => (
                    <div
                      key={w.id}
                      className={`absolute inset-0 transition-all duration-700 ease-out ${
                        i === activeWine
                          ? 'opacity-100 scale-100 translate-x-0'
                          : i < activeWine
                            ? 'opacity-0 scale-95 -translate-x-8 pointer-events-none'
                            : 'opacity-0 scale-95 translate-x-8 pointer-events-none'
                      }`}
                    >
                      <img
                        src={w.image}
                        alt={`${w.name} - ${w.subtitle}`}
                        className="w-full h-full object-contain bg-[#181818]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                    </div>
                  ))}
                </div>

                {/* Mobile Switcher Controls */}
                <div className="flex items-center justify-center gap-6 mt-4">
                  <button
                    onClick={prevWine}
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-gold-500 hover:border-gold-500 hover:text-black transition-all duration-300 cursor-pointer"
                    aria-label="Sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-white/50 font-serif tabular-nums tracking-widest">
                    {activeWine + 1} / {wines.length}
                  </span>
                  <button
                    onClick={nextWine}
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-gold-500 hover:border-gold-500 hover:text-black transition-all duration-300 cursor-pointer"
                    aria-label="Selanjutnya"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-white/75 text-sm lg:text-base leading-relaxed mb-6">
                {wine.description}
              </p>

              {/* Tasting Notes */}
              {wine.tastingNotes && (
                <div className="mb-8">
                  <span className="text-xs text-white/45 uppercase tracking-wider block mb-2">Fokus Materi</span>
                  <div className="flex flex-wrap gap-2">
                    {wine.tastingNotes.split(',').map((note) => (
                      <span key={note} className="px-3 py-1 bg-white/5 rounded-full text-xs text-gold-400 border border-white/5">
                        {note.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Details table */}
              <div className="grid grid-cols-3 gap-4 py-4 border-t border-white/10 mb-6 text-left">
                <div>
                  <div className="font-serif text-lg text-gold-500">{wine.alcohol}</div>
                  <div className="text-[10px] text-white/50 uppercase tracking-wider mt-1">Level</div>
                </div>
                <div className="w-px bg-white/10 self-stretch" />
                <div>
                  <div className="font-serif text-lg text-gold-500">{wine.temperature}</div>
                  <div className="text-[10px] text-white/50 uppercase tracking-wider mt-1">Format</div>
                </div>
                <div className="w-px bg-white/10 self-stretch" />
                <div>
                  <div className="font-serif text-lg text-gold-500">{wine.aging}</div>
                  <div className="text-[10px] text-white/50 uppercase tracking-wider mt-1">Jadwal</div>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => {
                  const element = document.querySelector('#contact');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-primary rounded-sm flex items-center gap-2 group w-fit cursor-pointer"
                aria-label="Pelajari program KSPM"
              >
                Pelajari Program
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            {/* General Features Grid (2x2) */}
            <div>
              <h4 className="font-serif text-xl text-white mb-6 text-left">Materi Pembelajaran Utama</h4>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                {features.map((feature) => {
                  const IconComponent = iconMap[feature.icon] || BookOpen;
                  return (
                    <div key={feature.title} className="flex items-start gap-4 group bg-white/[0.02] border border-white/5 hover:border-gold-500/20 p-5 rounded-lg transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-gold-500/30 transition-colors">
                        <IconComponent className="w-5 h-5 text-gold-500" />
                      </div>
                      <div>
                        <h5 className="font-serif text-base text-white mb-1">{feature.title}</h5>
                        <p className="text-xs text-white/60 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Large Photo & Switcher & Quote */}
          <div className="slide-in-right lg:col-span-5 flex flex-col gap-8 w-full">
            {/* Large Image Container (Desktop only) */}
            <div className="hidden lg:block relative aspect-[4/3] w-full rounded-lg overflow-hidden border border-white/10 shadow-2xl bg-[#181818]">
              {/* Glow background accent */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className={`w-72 h-72 ${wine.glowColor} rounded-full blur-3xl opacity-30 transition-colors duration-700`} />
              </div>

              {/* Images mapping */}
              {wines.map((w, i) => (
                <div
                  key={w.id}
                  className={`absolute inset-0 transition-all duration-700 ease-out ${
                    i === activeWine
                      ? 'opacity-100 scale-100 translate-x-0'
                      : i < activeWine
                        ? 'opacity-0 scale-95 -translate-x-8 pointer-events-none'
                        : 'opacity-0 scale-95 translate-x-8 pointer-events-none'
                  }`}
                >
                  <img
                    src={w.image}
                    alt={`${w.name} - ${w.subtitle}`}
                    loading={i === 0 ? undefined : 'lazy'}
                    className="w-full h-full object-contain bg-[#181818]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                </div>
              ))}

              {/* Bottom Badge for index */}
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded border border-white/10 text-xs text-gold-400 font-serif">
                {wine.year}
              </div>
            </div>

            {/* Switcher Controls (Desktop only) */}
            <div className="hidden lg:flex items-center justify-center gap-6">
              <button
                onClick={prevWine}
                className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-gold-500 hover:border-gold-500 hover:text-black transition-all duration-300 cursor-pointer"
                aria-label="Sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-white/50 font-serif tabular-nums tracking-widest">
                {activeWine + 1} / {wines.length}
              </span>
              <button
                onClick={nextWine}
                className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-gold-500 hover:border-gold-500 hover:text-black transition-all duration-300 cursor-pointer"
                aria-label="Selanjutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Quote block */}
            {quote.text && (
              <div className="p-6 bg-white/[0.03] rounded-lg border-l-2 border-gold-500/50 text-left mt-2">
                {quote.prefix && <p className="font-script text-2xl text-gold-400 mb-2">{quote.prefix}</p>}
                <p className="text-white/70 text-sm italic leading-relaxed">
                  "{quote.text}"
                </p>
                {quote.attribution && <p className="text-gold-500 text-xs mt-3">— {quote.attribution}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
