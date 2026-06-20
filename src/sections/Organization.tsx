import { useRef, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { organizationConfig, type OrgNode } from '../config';

const OrgMemberCard = ({
  node,
  index,
  category,
  onClick,
}: {
  node: OrgNode;
  index: string;
  category: string;
  onClick: () => void;
}) => {
  if (!node) return null;

  return (
    <button
      onClick={onClick}
      className="group bg-white/95 backdrop-blur-sm border border-neutral-200/60 rounded-xl overflow-hidden shadow-premium hover:shadow-gold-soft hover:-translate-y-1 transition-all duration-500 flex flex-col w-full max-w-sm mx-auto text-left cursor-pointer focus:outline-none"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 flex-shrink-0">
        {node.image ? (
          <img
            src={node.image}
            alt={node.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gold-500/10 flex items-center justify-center">
            <span className="font-serif text-3xl text-gold-600 font-bold">K</span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col justify-between flex-grow w-full">
        <div className="flex items-center justify-between gap-4 w-full">
          <div>
            {/* Category / Position label */}
            <span className="text-gold-600 text-[10px] uppercase tracking-wider font-semibold block">
              {index} &bull; {category}
            </span>
            {/* Name */}
            <h4 className="font-serif text-base md:text-lg text-neutral-900 font-bold mt-1 leading-snug group-hover:text-gold-600 transition-colors">
              {node.name}
            </h4>
          </div>
          {/* Detail CTA */}
          <span className="text-[#7a6024] text-[10px] md:text-xs font-bold uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform flex-shrink-0">
            Detail &rarr;
          </span>
        </div>
      </div>
    </button>
  );
};

export function Organization() {
  if (!organizationConfig.structure) return null;

  const [activeMember, setActiveMember] = useState<{ node: OrgNode; index: string; category: string } | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.05 }
    );
    const elements = sectionRef.current?.querySelectorAll('.fade-up');
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Lock scroll when modal is open
  useEffect(() => {
    if (activeMember) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeMember]);

  const root = organizationConfig.structure;
  const pembinaNode = root;
  const dewanKehormatanNode = root.children?.[0];
  const ketuaUmumNode = dewanKehormatanNode?.children?.[0];
  const sekBendNodes = ketuaUmumNode?.children?.filter(c => c.name !== '_departments_') ?? [];
  const deptBridgeNode = ketuaUmumNode?.children?.find(c => c.name === '_departments_');
  const departmentNodes = deptBridgeNode?.children ?? [];

  // Flatten the organization structure into a sequential list
  const members = [
    { node: pembinaNode, category: "PEMBINA" },
    { node: dewanKehormatanNode, category: "STEERING COMMITTEE" },
    { node: ketuaUmumNode, category: "KETUA UMUM" },
    ...sekBendNodes.map(node => ({
      node,
      category: node.name.includes("Sekretaris") ? "SEKRETARIS" : "BENDAHARA"
    })),
    ...departmentNodes.map(node => ({
      node,
      category: "DEPARTEMEN"
    }))
  ].filter((m): m is { node: OrgNode; category: string } => !!m.node);

  return (
    <section
      id="organization"
      ref={sectionRef}
      className="section-padding relative overflow-hidden bg-[#f0ede6]"
    >
      <div className="container-custom relative z-10 max-w-6xl">
        {/* Section Header */}
        <div className="fade-up text-center mb-16">
          <span className="font-script text-4xl md:text-6xl lg:text-7xl text-gold-gradient block mb-2">
            {organizationConfig.scriptText}
          </span>
          <span className="text-gold-gradient text-xs uppercase tracking-[0.2em] mb-4 block">
            {organizationConfig.subtitle}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-h1 text-[#1c1515]">{organizationConfig.mainTitle}</h2>
          {organizationConfig.description && (
            <p className="text-[#4a4545] max-w-2xl mx-auto mt-6">
              {organizationConfig.description}
            </p>
          )}
        </div>

        {/* Structured Grid Layout matching the request */}
        <div className="fade-up grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member, idx) => {
            const indexStr = String(idx + 1).padStart(2, '0');
            return (
              <OrgMemberCard
                key={idx}
                node={member.node}
                index={indexStr}
                category={member.category}
                onClick={() => setActiveMember({ node: member.node, index: indexStr, category: member.category })}
              />
            );
          })}
        </div>
      </div>

      {/* Member Details Modal */}
      {activeMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1c1515]/60 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl max-w-md w-full overflow-hidden border border-neutral-200/60 shadow-premium p-6 relative animate-scale-up">
            {/* Close Button */}
            <button
              onClick={() => setActiveMember(null)}
              className="absolute top-4 right-4 p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full text-neutral-800 transition-colors cursor-pointer border-none"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Member Info */}
            <div className="flex flex-col items-center text-center mt-4">
              {activeMember.node.image ? (
                <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-gold-400 shadow-md mb-4 bg-neutral-100 flex-shrink-0">
                  <img
                    src={activeMember.node.image}
                    alt={activeMember.node.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-28 h-28 rounded-full bg-gold-500/10 flex items-center justify-center mb-4 border border-gold-300/40">
                  <span className="font-serif text-3xl text-gold-600 font-bold">K</span>
                </div>
              )}
              
              <span className="text-[10px] text-gold-600 uppercase tracking-widest font-semibold block mb-1">
                {activeMember.index} &bull; {activeMember.category}
              </span>
              
              <h3 className="font-serif text-xl md:text-2xl text-neutral-900 font-bold leading-snug">
                {activeMember.node.name}
              </h3>
              
              <div className="w-12 h-0.5 bg-gold-gradient my-4" />
              
              <p className="text-neutral-600 text-sm leading-relaxed max-w-sm mb-6">
                Sebagai {activeMember.category === "PEMBINA" ? "Pembina" : activeMember.category === "STEERING COMMITTEE" ? "Steering Committee" : activeMember.node.role || activeMember.category} KSPM FEB UIKA Bogor, berdedikasi tinggi untuk memajukan pasar modal melalui berbagai program edukasi, riset analisis saham, dan sosialisasi berkelanjutan bagi mahasiswa serta masyarakat.
              </p>

              <button
                onClick={() => setActiveMember(null)}
                className="btn-primary rounded-sm text-xs px-6 py-2.5 cursor-pointer shadow-sm w-full"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
