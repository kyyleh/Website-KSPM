import { useRef, useEffect } from 'react';
import { organizationConfig, type OrgNode } from '../config';

// Recursive component to render the tree
const OrgChartNode = ({ node }: { node: OrgNode }) => {
  return (
    <div className="flex flex-col items-center">
      {/* Node Card */}
      <div 
        className="relative z-10 p-4 rounded-lg border transition-all duration-300 hover:scale-105 bg-gold-500/10 border-gold-500 shadow-[0_0_15px_rgba(210,168,85,0.3)] flex flex-col items-center gap-3"
      >
        {node.image && (
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gold-500/50 flex-shrink-0 bg-[#141414] shadow-inner flex items-center justify-center p-0.5 mt-1">
            <img 
              src={node.image} 
              alt={node.name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        )}
        <div className="text-center">
          <h4 className="font-serif text-sm md:text-base text-gold-400">
            {node.name}
          </h4>
          {node.role && (
            <p className="text-xs text-white/60 mt-1 uppercase tracking-wider">
              {node.role}
            </p>
          )}
        </div>
      </div>

      {/* Children */}
      {node.children && node.children.length > 0 && (
        <div className="relative pt-6 mt-0">
          {/* Vertical line descending from the parent */}
          <div className="absolute top-0 left-1/2 -mt-px w-px h-6 bg-gold-500/30" />
          
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 relative">
            {/* Horizontal connecting line for siblings */}
            {node.children.length > 1 && (
              <div 
                className="absolute top-0 h-px bg-gold-500/30" 
                style={{ 
                  left: 'calc(50% / ' + node.children.length + ')', 
                  right: 'calc(50% / ' + node.children.length + ')' 
                }} 
              />
            )}
            
            {node.children.map((child, index) => (
              <div key={index} className="relative flex flex-col items-center flex-1 min-w-[120px]">
                {/* Vertical line connecting horizontal line to child */}
                <div className="absolute top-0 w-px h-6 bg-gold-500/30 -mt-6" />
                <OrgChartNode node={child} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export function Organization() {
  if (!organizationConfig.structure) return null;

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

    const elements = sectionRef.current?.querySelectorAll('.fade-up');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="organization" 
      ref={sectionRef}
      className="section-padding relative overflow-hidden bg-[#141414]"
    >
      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="fade-up text-center mb-16">
          <span className="font-script text-6xl md:text-7xl text-gold-400 block mb-2">{organizationConfig.scriptText}</span>
          <span className="text-gold-500 text-xs uppercase tracking-[0.2em] mb-4 block">
            {organizationConfig.subtitle}
          </span>
          <h2 className="font-serif text-h1 text-white">{organizationConfig.mainTitle}</h2>
          {organizationConfig.description && (
            <p className="text-white/70 max-w-2xl mx-auto mt-6">
              {organizationConfig.description}
            </p>
          )}
        </div>

        {/* Organization Chart */}
        <div className="fade-up overflow-x-auto pb-8 pt-4 w-full" style={{ transitionDelay: '0.2s' }}>
          <div className="min-w-max mx-auto px-4 flex flex-col items-center">
            
            <OrgChartNode node={organizationConfig.structure} />
          </div>
        </div>
      </div>
    </section>
  );
}
