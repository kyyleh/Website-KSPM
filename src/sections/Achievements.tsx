import { useRef, useEffect } from 'react';
import { Users, FileText, Calendar, Award, TrendingUp } from 'lucide-react';
import { achievementsConfig } from '../config';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  FileText,
  Calendar,
  Award,
  TrendingUp,
};

const HandshakeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11L3.5 6.5a2 2 0 0 1 0-2.82l1.06-1.06a2 2 0 0 1 2.83 0L11 7" />
    <path d="m15 13 5.5 5.5a2 2 0 0 1-2.83 2.83L12 16" />
    <path d="m9 11 3 3" /><path d="M15 13l-3-3" />
    <path d="m11 7 3 3-3.5 3.5-3-3" />
    <path d="m13 9 3 3-1.5 1.5" />
  </svg>
);

export function Achievements() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }); },
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const config = achievementsConfig;

  return (
    <section
      id="achievements"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-background py-8 sm:py-12 md:py-16"
    >
      {/* Background accents */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 70%, rgba(201,146,42,0.3) 0%, transparent 40%),
                            radial-gradient(circle at 80% 30%, rgba(201,146,42,0.25) 0%, transparent 40%)`
        }}
      />

      <div className="container-custom relative z-10">
        {/* Header — same pattern as News/Gallery */}
        <div className="fade-up flex flex-col sm:flex-row justify-between items-baseline gap-2 mb-6 sm:mb-10 md:mb-16 border-b border-border pb-4 sm:pb-6 md:pb-8">
          <div>
            <h2 className="font-sans text-4xl sm:text-5xl font-extrabold text-primary tracking-tight uppercase">
              {config.mainTitle}
            </h2>
          </div>
        </div>

        {/* Achievement Cards Grid */}
        <div className="fade-up grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12">
          {config.items.map((item, idx) => {
            const Icon = item.icon === 'Handshake'
              ? HandshakeIcon
              : (iconMap[item.icon] || TrendingUp);

            return (
              <div
                key={idx}
                className="group bg-white border border-border rounded-2xl p-4 sm:p-6 text-center shadow-sm hover:shadow-premium hover:-translate-y-1.5 transition-all duration-500 ease-out"
              >
                {/* Icon */}
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gold-50 border border-gold-200 flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-gold-100 transition-colors duration-300">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gold-600" />
                </div>

                {/* Value */}
                <div className="font-sans text-2xl sm:text-3xl font-extrabold text-primary mb-1 group-hover:text-gold-600 transition-colors duration-300">
                  {item.value}
                </div>

                {/* Label */}
                <div className="font-sans text-[9px] sm:text-[11px] font-bold text-gold-600 uppercase tracking-wider mb-2">
                  {item.label}
                </div>

                {/* Divider */}
                <div className="w-6 h-px bg-border mx-auto mb-2 group-hover:w-10 group-hover:bg-gold-300 transition-all duration-300" />

                {/* Description */}
                <p className="text-muted-foreground text-[9px] sm:text-[11px] leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
