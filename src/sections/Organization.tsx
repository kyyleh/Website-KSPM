import { useRef, useEffect } from 'react';
import { organizationConfig, type OrgNode } from '../config';

// ─── Card ─────────────────────────────────────────────────────────────────────
const OrgCard = ({ node }: { node: OrgNode }) => (
  <div className="relative z-10 p-4 rounded-lg border transition-all duration-300 hover:scale-105 bg-gold-500/10 border-gold-500 shadow-[0_0_15px_rgba(201,146,42,0.25)] flex flex-col items-center gap-2 min-w-[120px]">
    {node.image && (
      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gold-500/50 flex-shrink-0 bg-[#141414] shadow-inner flex items-center justify-center p-0.5 mt-1">
        <img src={node.image} alt={node.name} className="w-full h-full object-cover rounded-full" />
      </div>
    )}
    <div className="text-center">
      <h4 className="font-serif text-sm md:text-base text-gold-400 whitespace-nowrap">{node.name}</h4>
      {node.role && (
        <p className="text-xs text-white/60 mt-1 uppercase tracking-wider">{node.role}</p>
      )}
    </div>
  </div>
);

// ─── Connector line (vertical) ────────────────────────────────────────────────
const VLine = () => <div className="w-px h-6 bg-gold-500/30 mx-auto" />;
// ─── Connector line (horizontal full) ────────────────────────────────────────
const HLine = ({ width }: { width: string }) => (
  <div className="h-px bg-gold-500/30 absolute top-0" style={{ left: width, right: width }} />
);

// ─── Recursive tree node ──────────────────────────────────────────────────────
const OrgChartNode = ({ node }: { node: OrgNode }) => {
  // Invisible bridge: "_departments_" — render as a row without a card
  if (node.name === '_departments_' && node.children) {
    return (
      <div className="flex flex-col items-center w-full">
        {/* horizontal span above departments */}
        <VLine />
        <div className="relative w-full flex justify-center">
          {node.children.length > 1 && (
            <HLine width={`calc(100% / ${node.children.length * 2})`} />
          )}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 w-full">
            {node.children.map((child, i) => (
              <div key={i} className="flex flex-col items-center flex-1 min-w-[120px]">
                <VLine />
                <OrgCard node={child} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Ketua Umum — special 3-row layout:
  //   row A: Sekretaris | Bendahara
  //   row B: Departments (via bridge node)
  const sekBendNodes = node.children?.filter(c => c.name !== '_departments_') ?? [];
  const deptBridge   = node.children?.find(c => node.name !== '_departments_' && c.name === '_departments_');

  const hasSpecialLayout = sekBendNodes.length > 0 && deptBridge;

  return (
    <div className="flex flex-col items-center">
      <OrgCard node={node} />

      {node.children && node.children.length > 0 && (
        <div className="relative pt-6 mt-0 w-full">
          {/* Vertical line from parent */}
          <div className="absolute top-0 left-1/2 -mt-px w-px h-6 bg-gold-500/30" />

          {hasSpecialLayout ? (
            <>
              {/* ── ROW A: Sekretaris & Bendahara ── */}
              <div className="relative flex justify-center gap-6 md:gap-10">
                {sekBendNodes.length > 1 && (
                  <HLine width={`calc(100% / ${sekBendNodes.length * 2})`} />
                )}
                {sekBendNodes.map((child, i) => (
                  <div key={i} className="flex flex-col items-center flex-1 min-w-[120px]">
                    <VLine />
                    <OrgChartNode node={child} />
                  </div>
                ))}
              </div>

              {/* ── ROW B: Departments (via bridge) ── */}
              <div className="mt-8 relative flex flex-col items-center w-full">
                {/* vertical line from Ketua row down to dept row */}
                <div className="w-px h-8 bg-gold-500/30 mx-auto" />
                <div className="relative flex justify-center gap-6 md:gap-8 w-full">
                  {deptBridge.children && deptBridge.children.length > 1 && (
                    <HLine width={`calc(100% / ${deptBridge.children.length * 2})`} />
                  )}
                  {deptBridge.children?.map((dept, i) => (
                    <div key={i} className="flex flex-col items-center flex-1 min-w-[120px]">
                      <VLine />
                      <OrgCard node={dept} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* ── Default recursive layout ── */
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 relative">
              {node.children.length > 1 && (
                <HLine width={`calc(50% / ${node.children.length})`} />
              )}
              {node.children.map((child, i) => (
                <div key={i} className="relative flex flex-col items-center flex-1 min-w-[120px]">
                  <div className="absolute top-0 w-px h-6 bg-gold-500/30 -mt-6" />
                  <OrgChartNode node={child} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Section ──────────────────────────────────────────────────────────────────
export function Organization() {
  if (!organizationConfig.structure) return null;

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
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
