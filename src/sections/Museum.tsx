import { useEffect, useRef } from 'react';
import { History, Award, BookOpen, Target } from 'lucide-react';
import { museumConfig } from '../config';

// Icon lookup map for dynamic icon resolution from config strings
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  History, Award, BookOpen, Target,
};

import { getMediaUrl } from '../lib/strapi';


export function Museum({ onNavigate, data }: { onNavigate?: (href: string) => void; data?: typeof museumConfig }) {
  const activeConfig = data || museumConfig;

  // Null check: if config is empty, render nothing
  if (!activeConfig.mainTitle) return null;

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

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      {/* Background Accent */}
      <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-gold-500/5 to-transparent pointer-events-none" />

      <div className="container-custom relative">
        {/* Intro Grid (Header + Sejarah + Founder Quote & Main Image) */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
          
          {/* Left Column: Header, Intro, Founder Quote */}
          <div className="lg:col-span-7 space-y-8 slide-in-left">
            {/* Section Header */}
            <div>
              <span className="font-script text-3xl md:text-5xl lg:text-6xl text-gold-gradient block mb-2">{activeConfig.scriptText}</span>
              <span className="text-gold-gradient text-xs uppercase tracking-[0.2em] mb-4 block">
                {activeConfig.subtitle}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-h2 text-neutral-900 has-bar">
                {activeConfig.mainTitle}
              </h2>
            </div>

            {/* Introduction */}
            {activeConfig.introText && (
              <p className="text-neutral-600 leading-relaxed text-base">
                {activeConfig.introText}
              </p>
            )}

            {/* Founder Quote */}
            {activeConfig.quote.text && (
              <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 sm:gap-6 p-6 bg-white/85 backdrop-blur-sm rounded-2xl border border-neutral-200/50 shadow-premium">
                {activeConfig.founderPhoto && (
                  <div className="w-20 h-20 rounded-xl overflow-hidden border border-gold-300 shadow-premium flex-shrink-0">
                    <img
                      src={getMediaUrl(activeConfig.founderPhoto)}
                      alt={activeConfig.founderPhotoAlt}
                      loading="lazy"
                      className="w-full h-full object-contain bg-white p-2"
                    />
                  </div>
                )}
                <div>
                  {activeConfig.quote.prefix && (
                    <p className="font-script text-xl text-gold-gradient mb-1">
                      &ldquo;{activeConfig.quote.prefix}&rdquo;
                    </p>
                  )}
                  <p className="text-neutral-600 text-sm italic">
                    "{activeConfig.quote.text}"
                  </p>
                  {activeConfig.quote.attribution && (
                    <p className="text-gold-600 text-xs mt-1.5 font-medium text-center sm:text-left">
                      — {activeConfig.quote.attribution}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Featured image + year badge + opening hours */}
          <div className="lg:col-span-5 slide-in-right relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-200/60 shadow-premium bg-white">
              {/* Main showcase photo (use first tab's image as default) */}
              <img
                src={getMediaUrl(activeConfig.tabs[0]?.image || "/images/about-vision.jpg")}
                alt={activeConfig.mainTitle}
                loading="lazy"
                className="w-full h-full object-cover"
              />

              {/* Year Badge */}
              {activeConfig.yearBadge && (
                <div className="absolute top-6 right-6 w-20 h-20 rounded-full bg-white/95 backdrop-blur-sm border border-gold-400/40 shadow-gold-soft flex items-center justify-center transition-all duration-300 hover:shadow-gold-glow hover:scale-105">
                  <div className="text-center">
                    <div className="font-serif text-xl text-gold-gradient font-bold">{activeConfig.yearBadge}</div>
                    <div className="text-[9px] text-neutral-700 uppercase tracking-wider font-semibold">{activeConfig.yearBadgeLabel}</div>
                  </div>
                </div>
              )}

              {/* Bottom Info Card */}
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-white/95 backdrop-blur-md border-t border-neutral-200/60 shadow-premium">
                <div className="flex items-center justify-between">
                  <div>
                    {activeConfig.openingHoursLabel && <p className="text-[#7a6024] text-[10px] uppercase tracking-wider mb-0.5 font-medium">{activeConfig.openingHoursLabel}</p>}
                    {activeConfig.openingHours && <p className="text-[#1c1515] font-serif text-base font-bold">{activeConfig.openingHours}</p>}
                  </div>
                  {activeConfig.ctaButtonText && (
                    <button
                      onClick={() => {
                        if (onNavigate) {
                          onNavigate('#contact');
                        } else {
                          const element = document.querySelector('#contact');
                          if (element) element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="btn-primary rounded-sm text-xs px-5 py-2 cursor-pointer shadow-sm"
                      aria-label={activeConfig.ctaButtonText}
                    >
                      {activeConfig.ctaButtonText}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Timeline (spanning full width below the intro row) */}
        {activeConfig.timeline.length > 0 && (
          <div id="history" className="fade-up border-t border-neutral-200/60 pt-10 pb-16">
            <h3 className="font-serif text-xl text-neutral-800 font-semibold mb-8 text-center uppercase tracking-wider">Garis Waktu Perjalanan</h3>
            <div className="relative">
              {/* Horizontal line */}
              <div className="absolute top-3 left-0 right-0 h-px bg-gold-500/30" />
              {/* Timeline points */}
              <div className="flex justify-between overflow-x-auto gap-4 scrollbar-none pb-4">
                {activeConfig.timeline.map((event) => (
                  <div key={event.year} className="relative flex flex-col items-center flex-shrink-0 min-w-[100px] text-center">
                    <div className="w-3 h-3 rounded-full bg-[#f0ede6] border-2 border-gold-500 z-10 shadow-sm" />
                    <span className="font-serif text-sm text-gold-600 mt-2 font-bold">{event.year}</span>
                    <span className="text-[11px] text-neutral-600 mt-1 max-w-[120px] font-medium leading-tight">{event.event}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pillars / Core Items Stack (Visi, Misi, Nilai Kami, Pencapaian) */}
        <div className="space-y-12 md:space-y-16 border-t border-neutral-200/60 pt-16">
          <div className="fade-up text-center mb-10">
            <span className="font-script text-2xl md:text-4xl text-gold-gradient block mb-1">Pilar Organisasi</span>
            <h3 className="font-serif text-2xl md:text-3xl text-neutral-900 font-semibold uppercase tracking-wide">Visi, Misi, Nilai & Pencapaian</h3>
            <div className="w-16 h-0.5 bg-gold-gradient mx-auto mt-3" />
          </div>

          <div className="space-y-10 md:space-y-12">
            {activeConfig.tabs.map((tab, index) => {
              const isEven = index % 2 === 0;
              const IconComponent = iconMap[tab.icon];
              return (
                <div
                  key={tab.id}
                  className="fade-up bg-white/95 backdrop-blur-sm border border-neutral-200/60 rounded-2xl overflow-hidden shadow-premium hover:shadow-gold-soft hover:-translate-y-1 transition-all duration-500"
                >
                  <div className="grid md:grid-cols-12 items-stretch">
                    {/* Image */}
                    <div className={`relative w-full md:col-span-5 overflow-hidden md:min-h-0 ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                      <img
                        src={getMediaUrl(tab.image)}
                        alt={tab.name}
                        loading="lazy"
                        className="relative z-10 w-full h-auto object-cover object-center hover:scale-105 transition-transform duration-700 md:absolute md:inset-0 md:h-full"
                      />
                    </div>

                    {/* Content */}
                    <div className={`p-6 md:p-8 lg:p-10 md:col-span-7 flex flex-col justify-start ${isEven ? 'md:order-2' : 'md:order-1'}`}>
                      {/* Icon & Title */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                          {IconComponent && <IconComponent className="w-5 h-5 text-gold-600" />}
                        </div>
                        <h4 className="font-serif text-xl md:text-2xl text-neutral-900 font-bold uppercase tracking-wide">
                          {tab.content.title}
                        </h4>
                      </div>

                      {/* Description */}
                      {Array.isArray(tab.content.description) ? (
                        <div className="text-neutral-600 text-sm md:text-base leading-relaxed mb-6 flex flex-col gap-2.5">
                          {tab.content.description.map((line, i) => (
                            <p key={i} className="flex items-start gap-2">
                              <span className="text-gold-500 flex-shrink-0 mt-1">&bull;</span>
                              <span>{line.replace(/^•\s*/, '')}</span>
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-neutral-600 text-sm md:text-base leading-relaxed mb-6">
                          {tab.content.description}
                        </p>
                      )}

                      {/* Highlight */}
                      {tab.content.highlight && (
                        <div className="flex items-center gap-3 text-gold-600">
                          <div className="w-8 h-px bg-gold-500" />
                          <span className="text-xs md:text-sm font-semibold uppercase tracking-wider">
                            {tab.content.highlight}
                          </span>
                        </div>
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
