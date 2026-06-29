import { useEffect, useState } from 'react';
import { museumConfig } from '../config';

export default function Philosophy({ data }: { data?: typeof museumConfig }) {
  const activeConfig = data || museumConfig;

  // Find Vision and Mission tabs
  const visionTab = activeConfig.tabs.find(t => t.id === 'vision' || t.id === 'visi');
  const missionTab = activeConfig.tabs.find(t => t.id === 'mission' || t.id === 'misi');

  if (!visionTab || !missionTab) return null;

  const visionText = visionTab.content.description;
  const missionsList = Array.isArray(missionTab.content.description) 
    ? missionTab.content.description 
    : [missionTab.content.description];

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      id="philosophy"
      className="relative w-full py-6"
    >
      <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 md:p-12 shadow-premium max-w-[1400px] mx-auto relative z-10">
        {/* BEM Title Header */}
        <div
          className={`flex flex-col sm:flex-row justify-between items-baseline gap-2 mb-8 sm:mb-12 md:mb-16 border-b border-border pb-8 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div>
            <h2 className="font-sans text-4xl sm:text-5xl font-extrabold text-primary tracking-tight uppercase">
              Visi & Misi
            </h2>
          </div>
        </div>

        {/* BEM side-by-side grid columns */}
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-24 items-start">
          {/* Left Column: Visi */}
          <div 
            className={`flex flex-col gap-6 transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <span className="font-script text-xs tracking-[0.18em] text-gold-600 font-bold uppercase">
              Visi Utama
            </span>
            <div className="border-l-4 border-secondary pl-6 relative">
              <p className="font-sans text-xl sm:text-2xl md:text-3xl font-semibold leading-relaxed tracking-tight text-primary italic">
                &ldquo;{visionText}&rdquo;
              </p>
            </div>
          </div>

          {/* Right Column: Misi */}
          <div 
            className={`flex flex-col gap-6 transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <span className="font-script text-xs tracking-[0.18em] text-gold-600 font-bold uppercase">
              Misi Strategis
            </span>
            <div className="flex flex-col gap-8">
              {missionsList.map((misi, index) => {
                // Clean bullet symbols if present
                const cleanMisi = misi.replace(/^[•\-\s\d\.]+\s*/, '');
                const labelNo = String(index + 1).padStart(2, '0');
                
                return (
                  <div key={index} className="flex gap-5 items-start group">
                    <span className="font-script bg-white border border-border text-primary font-bold text-xs px-3.5 py-1.5 rounded-lg flex-shrink-0 transition-colors group-hover:border-primary group-hover:bg-primary/5">
                      MISI {labelNo}
                    </span>
                    <p className="font-sans text-sm sm:text-base leading-relaxed text-muted-foreground pt-1">
                      {cleanMisi}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
