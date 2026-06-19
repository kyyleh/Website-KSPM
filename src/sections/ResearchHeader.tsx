import { useEffect, useRef } from 'react';

export function ResearchHeader() {
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

  return (
    <section 
      ref={headerRef}
      className="pt-40 pb-20 relative overflow-hidden bg-gradient-to-b from-wine-950/40 via-[#181818] to-[#141414] border-b border-white/5"
    >
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl" />
      
      <div className="container-custom relative text-center">
        <span className="font-script text-4xl md:text-5xl text-gold-400 block mb-3 scale-in opacity-0" style={{ transitionDelay: '0.1s' }}>
          Riset & Edukasi
        </span>
        <h1 className="font-serif text-4xl md:text-6xl text-white tracking-wide mb-6 fade-up opacity-0" style={{ transitionDelay: '0.2s' }}>
          Riset KSPM
        </h1>
        <div className="w-24 h-1 bg-gold-500 mx-auto mb-8 fade-up opacity-0" style={{ transitionDelay: '0.3s' }} />
        <p className="max-w-2xl mx-auto text-white/70 text-base md:text-lg leading-relaxed fade-up opacity-0" style={{ transitionDelay: '0.4s' }}>
          Kami membimbing dan memfasilitasi mahasiswa dalam riset analisis fundamental dan teknikal saham, publikasi ringkasan pasar modal mingguan, serta program edukasi terpadu untuk membentuk kebiasaan investasi yang sehat.
        </p>
      </div>
    </section>
  );
}
