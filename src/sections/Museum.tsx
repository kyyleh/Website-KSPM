import { useEffect, useRef } from 'react';
import { History, Award, BookOpen, Target } from 'lucide-react';
import { museumConfig } from '../config';
import Philosophy from './Philosophy';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  History, Award, BookOpen, Target,
};

export function Museum({ data }: { onNavigate?: (href: string) => void; data?: typeof museumConfig }) {
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
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.fade-up');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Filter out Visi/Misi tabs since they are rendered in Philosophy component
  const remainingTabs = activeConfig.tabs.filter(
    (tab) => tab.id !== 'vision' && tab.id !== 'vision' && tab.id !== 'misi' && tab.id !== 'mission' && tab.id !== 'visi'
  );

  return (
    <section
      id="history"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-background py-12 md:py-16"
    >
      <div className="container-custom relative z-10">
        
        {/* Intro Grid */}
        <div className="max-w-4xl mx-auto mb-20">
          {/* Main content area */}
          <div className="space-y-8 fade-up">
            <div className="text-center">
              <h2 className="font-sans text-4xl sm:text-5xl font-extrabold text-primary tracking-tight uppercase">
                {activeConfig.mainTitle}
              </h2>
            </div>

            {/* Introduction */}
            {activeConfig.introText && (
              <p className="text-muted-foreground text-center leading-relaxed text-sm sm:text-base max-w-2xl mx-auto">
                {activeConfig.introText}
              </p>
            )}

          </div>
        </div>

        {/* Philosophy: Visi & Misi Component */}
        <div className="border-t border-border pt-12">
          <Philosophy data={activeConfig} />
        </div>

        {/* Remaining Pillars (Nilai Kami & Pencapaian) */}
        {remainingTabs.length > 0 && (
          <div className="space-y-12 md:space-y-16 border-t border-border pt-16 mt-8">
            <div className="text-center mb-10 fade-up">
              <h3 className="font-sans text-2xl md:text-3xl font-extrabold text-primary uppercase tracking-wide">
                Nilai & Pencapaian
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-8">
              {remainingTabs.map((tab) => {
                const IconComponent = iconMap[tab.icon];
                return (
                  <div
                    key={tab.id}
                    className="fade-up bg-white border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-500 ease-out flex flex-col justify-between"
                  >
                    <div className="p-3 sm:p-6 md:p-8 space-y-4">
                      {/* Icon & Title */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <div className="w-10 h-10 rounded-full bg-gold-500/5 border border-gold-500/10 flex items-center justify-center flex-shrink-0">
                          {IconComponent && <IconComponent className="w-5 h-5 text-gold-600" />}
                        </div>
                        <h4 className="font-sans text-xs min-[375px]:text-sm sm:text-base md:text-xl font-bold text-primary uppercase leading-snug">
                          {tab.content.title}
                        </h4>
                      </div>

                      {/* Description */}
                      <p className="text-muted-foreground text-[10px] min-[375px]:text-xs sm:text-sm sm:text-base leading-relaxed">
                        {tab.content.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Timeline (Garis Waktu Perjalanan) */}
        {activeConfig.timeline.length > 0 && (
          <div id="history" className="fade-up border-t border-border pt-16 mt-16">
            <h3 className="font-sans text-2xl sm:text-3xl font-extrabold text-primary tracking-tight text-center uppercase mb-12">
              Garis Waktu Perjalanan
            </h3>
            <div className="relative">
              {/* Green connection line */}
              <div className="absolute top-3 left-0 right-0 h-0.5 bg-primary/20" />
              {/* Timeline points */}
              <div className="flex justify-between overflow-x-auto gap-6 scrollbar-none pb-4 snap-x snap-mandatory">
                {activeConfig.timeline.map((event) => (
                  <div 
                    key={event.year} 
                    className="relative flex flex-col items-center flex-shrink-0 min-w-[120px] text-center snap-center group"
                  >
                    {/* Gold dot with hover pulse */}
                    <div className="w-4.5 h-4.5 rounded-full bg-white border-[3px] border-secondary z-10 shadow-sm transition-transform duration-300 group-hover:scale-120" />
                    <span className="font-script text-base text-primary mt-3 font-bold">
                      {event.year}
                    </span>
                    <span className="text-[11px] text-muted-foreground mt-1 max-w-[140px] font-bold leading-relaxed uppercase tracking-wider">
                      {event.event}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
