import { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { wineryCarouselConfig, navigationConfig } from '../config';

export function WineryCarousel({ onNavigate }: { onNavigate?: (href: string) => void }) {
  // Null check: if config is empty, render nothing
  if (!wineryCarouselConfig.mainTitle || wineryCarouselConfig.slides.length === 0) return null;

  const slides = wineryCarouselConfig.slides;
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
      id="events"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(45deg, #d2a855 25%, transparent 25%), linear-gradient(-45deg, #d2a855 25%, transparent 25%)`,
          backgroundSize: '60px 60px',
          backgroundPosition: '0 0, 30px 0'
        }} />
      </div>

      <div className="container-custom relative">
        {/* Section Header */}
        <div className="fade-up text-center mb-16">
          <span className="font-script text-3xl md:text-5xl lg:text-6xl text-gold-gradient block mb-2">{wineryCarouselConfig.scriptText}</span>
          <span className="text-gold-gradient text-xs uppercase tracking-[0.2em] mb-4 block">
            {wineryCarouselConfig.subtitle}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-h1 text-[#1c1515] mb-4">
            {wineryCarouselConfig.mainTitle}
          </h2>
          <div className="w-24 h-1 bg-gold-gradient mx-auto" />
        </div>

        {/* Activities List */}
        <div className="space-y-12 md:space-y-16">
          {slides.map((slide, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={index}
                className="fade-up bg-white/95 backdrop-blur-sm border border-neutral-200/60 rounded-2xl overflow-hidden shadow-premium hover:shadow-gold-soft hover:-translate-y-1 transition-all duration-500"
              >
                <div className="grid md:grid-cols-12 items-stretch">
                  {/* Image Container */}
                  <div className={`relative w-full md:col-span-5 overflow-hidden md:min-h-0 ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                    <img
                      src={slide.image}
                      alt={slide.title}
                      loading="lazy"
                      className="relative z-10 w-full h-auto object-cover object-center hover:scale-105 transition-transform duration-700 md:absolute md:inset-0 md:h-full"
                    />
                  </div>

                  {/* Content Container */}
                  <div className={`p-6 md:p-8 lg:p-10 md:col-span-7 lg:col-span-7 flex flex-col justify-start ${isEven ? 'md:order-2' : 'md:order-1'}`}>
                    {/* Location Tag */}
                    {wineryCarouselConfig.locationTag && (
                      <div className="flex items-center gap-2 text-[#7a6024] text-xs uppercase tracking-wider mb-3">
                        <MapPin className="w-4 h-4 text-gold-500" />
                        <span>{wineryCarouselConfig.locationTag}</span>
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="font-serif text-2xl md:text-3xl text-neutral-900 font-semibold mb-1">
                      {slide.title}
                    </h3>
                    
                    {/* Subtitle */}
                    <p className="text-[#7a6024] text-sm md:text-base font-medium italic mb-4">
                      {slide.subtitle}
                    </p>

                    {/* Area Stats */}
                    <div className="flex items-baseline gap-2 mb-4 bg-gold-500/5 px-4 py-1.5 rounded-lg w-fit border border-gold-500/10">
                      <span className="font-serif text-2xl md:text-3xl text-gold-gradient font-bold">
                        {slide.area}
                      </span>
                      <span className="text-neutral-600 text-xs md:text-sm font-medium">{slide.unit}</span>
                    </div>

                    {/* Description */}
                    <p className="text-neutral-600 text-sm md:text-base leading-relaxed mb-6">
                      {slide.description}
                    </p>

                    {/* CTA */}
                    {navigationConfig.ctaButtonText && (
                      <button
                        onClick={() => {
                          if (onNavigate) {
                            onNavigate('#register');
                          } else {
                            const element = document.querySelector('#contact');
                            if (element) element.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="bg-[#1c1515] text-white hover:bg-gold-500 transition-all duration-300 px-6 py-2.5 text-xs font-medium tracking-wide rounded-sm cursor-pointer border border-[#1c1515] hover:border-gold-500 shadow-sm w-fit"
                        aria-label={navigationConfig.ctaButtonText}
                      >
                        {navigationConfig.ctaButtonText}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

