import { useEffect, useRef } from 'react';
import { wineryCarouselConfig } from '../config';

export function WineryCarousel({ data }: { onNavigate?: (href: string) => void; data?: typeof wineryCarouselConfig }) {
  const activeConfig = data || wineryCarouselConfig;

  // Null check: if config is empty, render nothing
  if (!activeConfig.mainTitle || activeConfig.slides.length === 0) return null;

  const slides = activeConfig.slides;
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
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.fade-up, .scale-in');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="activities"
      className="py-8 sm:py-12 md:py-16 relative overflow-hidden bg-neutral-50/50 border-b border-border"
    >
      {/* Background Accent */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 20%, rgba(201, 146, 42, 0.3) 0%, transparent 40%),
                            radial-gradient(circle at 70% 80%, rgba(201, 146, 42, 0.25) 0%, transparent 40%)`
        }}
      />

      <div className="container-custom relative z-10">
        <div className="text-center mb-6 sm:mb-10 md:mb-16 fade-up">
          <h2 className="font-sans text-4xl sm:text-5xl font-extrabold text-primary tracking-tight uppercase mb-4">
            {activeConfig.mainTitle}
          </h2>
        </div>

        {/* Activities 3-Column Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          {slides.map((slide, index) => {
            const labelNo = String(index + 1).padStart(2, '0');
            return (
              <div
                key={index}
                className="fade-up bg-white border border-border rounded-2xl p-3 sm:p-6 md:p-8 shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-500 ease-out flex flex-col justify-between h-full"
              >
                <div className="flex flex-col items-start gap-4 h-full">
                  {/* Eyebrow / No */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-script bg-neutral-100 border border-border text-primary font-bold text-xs px-3 py-1.5 rounded-lg">
                      KEGIATAN {labelNo}
                    </span>
                  </div>

                  <div className="flex-grow">
                    {/* Title */}
                    <h3 className="font-sans text-sm min-[375px]:text-base sm:text-lg md:text-2xl font-bold text-primary mb-2">
                      {slide.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                      {slide.description}
                    </p>
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
