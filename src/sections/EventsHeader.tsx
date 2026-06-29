import { useEffect, useRef } from 'react';
import { getMediaUrl } from '../lib/strapi';

export function EventsHeader({ data }: { data?: any }) {
  const headerRef = useRef<HTMLDivElement>(null);

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

    const elements = headerRef.current?.querySelectorAll('.fade-up, .scale-in');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const title = data?.eventsHeaderTitle || "Kegiatan KSPM";
  const description = data?.eventsHeaderDescription || "Kami menyelenggarakan berbagai kegiatan akademis dan non-akademis yang bertujuan meningkatkan literasi, inklusi, serta keahlian praktis dalam industri pasar modal bagi seluruh civitas akademika dan masyarakat luas.";
  const image = data?.eventsHeaderImage || "/images/event-investalk.jpg";

  return (
    <section 
      id="events"
      ref={headerRef}
      className="pt-28 sm:pt-36 lg:pt-40 pb-12 sm:pb-16 lg:pb-20 relative overflow-hidden bg-gradient-to-b from-[#f0ede6] via-white to-[#f0ede6] border-b border-border"
    >
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl" />
      
      <div className="container-custom relative z-10 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full text-left">
        {/* Left Column: Text Content */}
        <div className="lg:col-span-7 flex flex-col items-start gap-4">
          <h1 className="font-sans text-3xl sm:text-4xl md:text-6xl lg:text-[4.8rem] xl:text-[5.5rem] text-primary leading-[1.05] tracking-tight font-extrabold fade-up opacity-0" style={{ transitionDelay: '0.1s' }}>
            {title}
          </h1>
          <p className="text-neutral-600 text-sm sm:text-base md:text-lg leading-relaxed fade-up opacity-0" style={{ transitionDelay: '0.4s' }}>
            {description}
          </p>
        </div>

        {/* Right Column: Featured Image Box */}
        <div 
          className="lg:col-span-5 w-full max-w-xl mx-auto rounded-2xl overflow-hidden border border-border shadow-premium bg-white fade-up opacity-0"
          style={{ transitionDelay: '0.5s' }}
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <img
              src={getMediaUrl(image)}
              alt="KSPM FEB UIKA Kegiatan"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
