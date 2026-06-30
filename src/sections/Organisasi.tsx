import { useRef, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { organizationConfig, type OrgNode } from '../config';
import { getMediaUrl } from '../lib/strapi';

const OrgMemberCard = ({
  node,
  category,
  onClick,
}: {
  node: OrgNode;
  category: string;
  onClick: () => void;
}) => {
  if (!node) return null;

  return (
    <button
      onClick={onClick}
      className="group bg-white border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-500 ease-out flex flex-col w-full max-w-sm mx-auto text-left cursor-pointer focus:outline-none"
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 flex-shrink-0">
        {node.image ? (
          <img
            src={getMediaUrl(node.image)}
            alt={node.name}
            loading="lazy"
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-secondary/5 flex items-center justify-center">
            <span className="font-script text-3xl text-primary font-bold">K</span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col justify-between flex-grow w-full border-t border-border">
        <div>
          {/* Category / Position label */}
          <span className="font-script text-gold-600 text-[10px] uppercase tracking-wider font-bold block mb-1">
            {category === "DEPARTEMEN" && node.department ? node.department : category}
          </span>
          {/* Name */}
          <h4 className="font-sans text-sm sm:text-base md:text-lg text-primary font-bold mt-1 leading-snug group-hover:text-gold-600 transition-colors duration-300">
            {node.name}
          </h4>
          {node.role && (
            <p className="text-[10px] text-neutral-500 font-semibold mt-1 uppercase tracking-wider">
              {node.role}
            </p>
          )}
        </div>
        {/* Detail CTA */}
        <div className="flex justify-end mt-4">
          <span className="text-gold-600 text-[10px] md:text-xs font-bold uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300">
            Detail →
          </span>
        </div>
      </div>
    </button>
  );
};

export function Organisasi({ data }: { data?: typeof organizationConfig }) {
  const activeConfig = data || organizationConfig;

  if (!activeConfig.structure) return null;

  const [activeMember, setActiveMember] = useState<{ node: OrgNode; category: string } | null>(null);
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

  let members: { node: OrgNode; category: string }[] = [];
  if (Array.isArray(activeConfig.structure)) {
    members = activeConfig.structure.map((m: any) => ({
      node: {
        name: m.name,
        role: m.role || '',
        image: m.image,
        department: m.department || '',
        description: m.description || '',
      },
      category: m.category
    }));
  } else if (activeConfig.structure) {
    const root = activeConfig.structure;
    const pembinaNode = root;
    const steeringCommitteeNodes = root.children ?? [];
    const dewanKehormatanNode = steeringCommitteeNodes[0];
    const ketuaUmumNode = dewanKehormatanNode?.children?.[0];
    const sekBendNodes = ketuaUmumNode?.children?.filter(c => c.name !== '_departments_') ?? [];
    const deptBridgeNode = ketuaUmumNode?.children?.find(c => c.name === '_departments_');
    const departmentNodes = deptBridgeNode?.children ?? [];

    const deptMembersNodes: { node: OrgNode; category: string }[] = [];
    departmentNodes.forEach(deptNode => {
      if (deptNode.children) {
        deptNode.children.forEach(child => {
          deptMembersNodes.push({
            node: {
              ...child,
              department: deptNode.name,
            },
            category: "ANGGOTA DEPARTEMEN"
          });
        });
      }
    });

    members = [
      { node: pembinaNode, category: "PEMBINA" },
      ...steeringCommitteeNodes.map(node => ({ node, category: "STEERING COMMITTEE" })),
      { node: ketuaUmumNode, category: "KETUA UMUM" },
      ...sekBendNodes.map(node => ({
        node,
        category: node.name.includes("Sekretaris") ? "SEKRETARIS" : "BENDAHARA"
      })),
      ...departmentNodes.map(node => ({
        node,
        category: "DEPARTEMEN"
      })),
      ...deptMembersNodes
    ].filter((m): m is { node: OrgNode; category: string } => !!m.node);
  }

  const pembinaList = members.filter(m => m.category.toUpperCase() === "PEMBINA" || m.category.toUpperCase().includes("PEMBINA"));
  const scList = members.filter(m => m.category.toUpperCase() === "STEERING COMMITTEE" || m.category.toUpperCase() === "DEWAN KEHORMATAN");
  const ketua = members.find(m => m.category.toUpperCase() === "KETUA UMUM" || m.category.toUpperCase() === "KETUA");
  const sekBend = members.filter(m => 
    m.category.toUpperCase() === "SEKRETARIS" || 
    m.category.toUpperCase() === "BENDAHARA" || 
    m.category.toUpperCase().includes("SEKRETARIS") || 
    m.category.toUpperCase().includes("BENDAHARA")
  );
  const depts = members.filter(m => 
    m.category.toUpperCase() === "DEPARTEMEN" || 
    m.category.toUpperCase().includes("DEPT") || 
    m.category.toUpperCase().includes("DIVISI") || 
    m.category.toUpperCase().includes("DIVISION")
  );

  const getDepartmentMembers = (deptName: string) => {
    const cleanName = deptName.toLowerCase();
    let keyword = '';
    if (cleanName.includes('research') || cleanName.includes('riset')) keyword = 'research';
    else if (cleanName.includes('media')) keyword = 'media';
    else if (cleanName.includes('hr') || cleanName.includes('sdm') || cleanName.includes('program')) keyword = 'hr';
    else if (cleanName.includes('finance') || cleanName.includes('dana') || cleanName.includes('pendanaan')) keyword = 'finance';
    else {
      keyword = cleanName.split(' ')[1] || cleanName;
    }

    return members.filter(m => {
      const isAnggota = m.category.toUpperCase() === "ANGGOTA" || m.category.toUpperCase() === "ANGGOTA DEPARTEMEN";
      if (!isAnggota) return false;

      // If department is explicitly defined, match it
      if (m.node.department) {
        return m.node.department.toLowerCase() === deptName.toLowerCase();
      }

      // Fallback to role-based keyword matching
      const roleLower = (m.node.role || '').toLowerCase();
      if (keyword === 'hr') {
        return roleLower.includes('hr') || roleLower.includes('sdm') || roleLower.includes('program');
      }
      if (keyword === 'finance') {
        return roleLower.includes('finance') || roleLower.includes('dana') || roleLower.includes('pendanaan');
      }
      return roleLower.includes(keyword);
    });
  };

  const classifiedNames = new Set([
    ...pembinaList.map(m => m.node.name),
    ...scList.map(m => m.node.name),
    ketua?.node.name,
    ...sekBend.map(m => m.node.name),
    ...depts.map(m => m.node.name),
    ...members.filter(m => m.category.toUpperCase() === "ANGGOTA" || m.category.toUpperCase() === "ANGGOTA DEPARTEMEN").map(m => m.node.name)
  ].filter(Boolean));
  const otherMembers = members.filter(m => !classifiedNames.has(m.node.name));



  return (
    <section
      id="organization"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-background py-12 md:py-16 border-t border-border"
    >
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(201, 146, 42, 0.3) 0%, transparent 40%),
                            radial-gradient(circle at 80% 20%, rgba(201, 146, 42, 0.25) 0%, transparent 40%)`
        }}
      />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 fade-up">
          <h2 className="font-sans text-4xl sm:text-5xl font-extrabold text-primary tracking-tight uppercase mb-4">
            {activeConfig.mainTitle}
          </h2>
          {activeConfig.description && (
            <p className="text-muted-foreground max-w-2xl mx-auto mt-4 text-sm sm:text-base leading-relaxed">
              {activeConfig.description}
            </p>
          )}
        </div>

        {/* Hierarchical Organizational Layout */}
        <div className="space-y-8 sm:space-y-12 lg:space-y-16">
          {/* Level 1: Pembina (Centered at the top) */}
          {pembinaList.length > 0 && (
            <div className="fade-up flex flex-wrap gap-4 sm:gap-8 justify-center max-w-sm mx-auto">
              {pembinaList.map((member) => (
                <OrgMemberCard
                  key={member.node.name}
                  node={member.node}
                  category={member.category}
                  onClick={() => setActiveMember({ node: member.node, category: member.category })}
                />
              ))}
            </div>
          )}

          {/* Level 2: Steering Committee (Below Pembina) */}
          {scList.length > 0 && (
            <div className="fade-up flex flex-wrap gap-4 sm:gap-6 lg:gap-8 justify-center max-w-4xl mx-auto">
              {scList.map((member) => (
                <div key={member.node.name} className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] max-w-sm">
                  <OrgMemberCard
                    node={member.node}
                    category={member.category}
                    onClick={() => setActiveMember({ node: member.node, category: member.category })}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Level 3: Ketua Umum */}
          {ketua && (
            <div className="fade-up max-w-sm mx-auto">
              <OrgMemberCard
                node={ketua.node}
                category={ketua.category}
                onClick={() => setActiveMember({ node: ketua.node, category: ketua.category })}
              />
            </div>
          )}

          {/* Level 4: Sekretaris & Bendahara */}
          {sekBend.length > 0 && (
            <div className="fade-up flex flex-wrap gap-4 sm:gap-6 lg:gap-8 justify-center max-w-2xl mx-auto">
              {sekBend.map((member, idx) => (
                <div key={idx} className="w-full sm:w-[calc(50%-12px)] max-w-sm">
                  <OrgMemberCard
                    node={member.node}
                    category={member.category}
                    onClick={() => setActiveMember({ node: member.node, category: member.category })}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Level 5: Departemen */}
          {depts.length > 0 && (
            <div className="space-y-8">
              <div className="w-24 h-px bg-neutral-200 mx-auto" />
              <div className="fade-up flex flex-wrap gap-4 sm:gap-6 lg:gap-8 justify-center">
                {depts.map((member, idx) => {
                  const deptMembers = getDepartmentMembers(member.node.department || member.node.name);
                  
                  return (
                    <div key={idx} className="flex flex-col gap-4 w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-24px)] max-w-sm">
                      {/* Coordinator / Head */}
                      <OrgMemberCard
                        node={member.node}
                        category={member.category}
                        onClick={() => setActiveMember({ node: member.node, category: member.category })}
                      />
                      
                      {/* Department Members (with smaller circular photos) */}
                      {deptMembers.length > 0 && (
                        <div className="bg-neutral-50 border border-border rounded-2xl p-4 shadow-sm">
                          <h5 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3 border-b border-border pb-1.5 text-center">
                            Anggota Departemen
                          </h5>
                          <div className="grid grid-cols-3 gap-3 justify-items-center">
                            {deptMembers.map((subMember, sIdx) => {
                              return (
                                <button
                                  key={sIdx}
                                  onClick={() => setActiveMember({ node: subMember.node, category: "ANGGOTA DEPARTEMEN" })}
                                  className="group flex flex-col items-center text-center cursor-pointer focus:outline-none w-full"
                                >
                                  <div className="w-12 h-12 rounded-full overflow-hidden border border-border bg-neutral-100 flex-shrink-0 relative aspect-square shadow-sm group-hover:border-gold-500 group-hover:shadow-md transition-all duration-300">
                                    {subMember.node.image ? (
                                      <img
                                        src={getMediaUrl(subMember.node.image)}
                                        alt={subMember.node.name}
                                        className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-secondary/5 flex items-center justify-center">
                                        <span className="text-[10px] font-bold text-primary">K</span>
                                      </div>
                                    )}
                                  </div>
                                  <span className="text-[9px] font-bold text-neutral-800 mt-1.5 line-clamp-1 group-hover:text-gold-600 transition-colors w-full">
                                    {subMember.node.name.split(' ')[0]}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Level 6: Other Members */}
          {otherMembers.length > 0 && (
            <div className="space-y-8">
              <div className="w-24 h-px bg-neutral-200 mx-auto" />
              <div className="fade-up flex flex-wrap gap-4 sm:gap-6 lg:gap-8 justify-center">
                {otherMembers.map((member, idx) => (
                  <div key={idx} className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] max-w-sm">
                    <OrgMemberCard
                      node={member.node}
                      category={member.category}
                      onClick={() => setActiveMember({ node: member.node, category: member.category })}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Member Details Modal */}
      {activeMember && (
        <div 
          onClick={() => setActiveMember(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in text-left overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-md w-full border border-border shadow-2xl p-6 sm:p-8 relative animate-scale-up my-auto"
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveMember(null)}
              className="absolute top-4 right-4 p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full text-neutral-800 transition-colors cursor-pointer border-none flex items-center justify-center w-8 h-8"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Member Info */}
            <div className="flex flex-col items-center text-center mt-4">
              {activeMember.node.image ? (
                <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-secondary shadow-md mb-6 bg-neutral-100 flex-shrink-0">
                  <img
                    src={getMediaUrl(activeMember.node.image)}
                    alt={activeMember.node.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              ) : (
                <div className="w-28 h-28 rounded-full bg-secondary/5 flex items-center justify-center mb-6 border border-border">
                  <span className="font-script text-3xl text-primary font-bold">K</span>
                </div>
              )}
              
              <span className="font-script text-gold-600 text-[10px] uppercase tracking-widest font-bold block mb-1">
                {activeMember.category === "DEPARTEMEN" && activeMember.node.department ? activeMember.node.department : activeMember.category}
              </span>
              
              <h3 className="font-sans text-xl md:text-2xl text-primary font-bold leading-snug">
                {activeMember.node.name}
              </h3>
              {activeMember.node.role && (
                <p className="text-xs text-neutral-500 font-semibold mt-1 uppercase tracking-wider">
                  {activeMember.node.role}
                </p>
              )}
              
              <div className="w-12 h-0.5 bg-gold-400 my-4 rounded-full" />
              
              <p className="font-sans text-muted-foreground text-sm leading-relaxed max-w-sm mb-8 whitespace-pre-wrap">
                {activeMember.node.description || `Sebagai ${
                  activeMember.category === "PEMBINA" 
                    ? "Pembina" 
                    : activeMember.category === "STEERING COMMITTEE" 
                    ? "Steering Committee" 
                    : activeMember.category === "DEPARTEMEN" && activeMember.node.department 
                    ? `Kepala ${activeMember.node.department}` 
                    : activeMember.node.role || activeMember.category
                } KSPM FEB UIKA Bogor, berdedikasi tinggi untuk memajukan pasar modal melalui berbagai program edukasi, riset analisis saham, dan sosialisasi berkelanjutan bagi mahasiswa serta masyarakat.`}
              </p>

              <button
                onClick={() => setActiveMember(null)}
                className="btn-primary w-full text-xs py-3 px-6 cursor-pointer font-bold tracking-widest uppercase rounded-lg"
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
