import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Loader2, CheckCircle, AlertCircle, ChevronDown, ChevronUp, ExternalLink, ArrowUp, ArrowDown, Pencil } from 'lucide-react';
import { getContent, saveContent } from '../lib/adminApi';
import { museumConfig, organizationConfig } from '../../../config';
import { getMediaUrl } from '../../../lib/strapi';
import { ImageUploader } from '../components/ImageUploader';

interface OrgMember {
  id: string;
  name: string;
  role: string;
  category: string;
  image?: string;
}

interface AboutData {
  museum: typeof museumConfig;
  organization: Omit<typeof organizationConfig, 'structure'> & {
    structure: OrgMember[];
  };
}

function flattenOrgStructure(structure: any): OrgMember[] {
  if (Array.isArray(structure)) {
    return structure.map((m, i) => ({
      id: m.id || `member-${i}-${Date.now()}`,
      name: m.name || '',
      role: m.role || '',
      category: m.category || 'DEPARTEMEN',
      image: m.image || '',
    }));
  }

  const list: OrgMember[] = [];
  if (!structure) return list;

  const root = structure;
  list.push({
    id: `member-pembina-${Date.now()}`,
    name: root.name || '',
    role: root.role || '',
    category: 'PEMBINA',
    image: root.image || '',
  });

  const dewanKehormatanNode = root.children?.[0];
  if (dewanKehormatanNode) {
    list.push({
      id: `member-sc-${Date.now()}`,
      name: dewanKehormatanNode.name || '',
      role: dewanKehormatanNode.role || '',
      category: 'STEERING COMMITTEE',
      image: dewanKehormatanNode.image || '',
    });

    const ketuaUmumNode = dewanKehormatanNode.children?.[0];
    if (ketuaUmumNode) {
      list.push({
        id: `member-ketua-${Date.now()}`,
        name: ketuaUmumNode.name || '',
        role: ketuaUmumNode.role || '',
        category: 'KETUA UMUM',
        image: ketuaUmumNode.image || '',
      });

      const children = ketuaUmumNode.children || [];
      const sekBendNodes = children.filter((c: any) => c.name !== '_departments_');
      const deptBridgeNode = children.find((c: any) => c.name === '_departments_');
      const departmentNodes = deptBridgeNode?.children || [];

      sekBendNodes.forEach((node: any, idx: number) => {
        list.push({
          id: `member-sekbend-${idx}-${Date.now()}`,
          name: node.name || '',
          role: node.role || '',
          category: node.name.includes('Sekretaris') ? 'SEKRETARIS' : 'BENDAHARA',
          image: node.image || '',
        });
      });

      departmentNodes.forEach((node: any, idx: number) => {
        list.push({
          id: `member-dept-${idx}-${Date.now()}`,
          name: node.name || '',
          role: node.role || '',
          category: 'DEPARTEMEN',
          image: node.image || '',
        });
      });
    }
  }

  return list;
}

export function AboutEditor({ setIsDirty }: { setIsDirty?: (dirty: boolean) => void }) {
  const [data, setData] = useState<AboutData>(() => {
    const defaultData = {
      museum: { ...museumConfig },
      organization: { ...organizationConfig },
    };
    return {
      museum: defaultData.museum,
      organization: {
        ...defaultData.organization,
        structure: flattenOrgStructure(defaultData.organization.structure)
      }
    };
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showJson, setShowJson] = useState(false);
  const [showAddTimelineModal, setShowAddTimelineModal] = useState(false);
  const [newTimeline, setNewTimeline] = useState({ year: '', event: '' });
  const [showAddEditMemberModal, setShowAddEditMemberModal] = useState(false);
  const [editingMemberIndex, setEditingMemberIndex] = useState<number | null>(null);
  const [memberForm, setMemberForm] = useState<OrgMember>({
    id: '',
    name: '',
    role: '',
    category: 'DEPARTEMEN',
    image: ''
  });
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    general: true,
    timeline: false,
    tabs: false,
    organization: false,
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await getContent<any>('about');
        if (res && res.content) {
          const content = res.content;
          if (content.organization) {
            content.organization.structure = flattenOrgStructure(content.organization.structure);
          }
          setData(content);
        }
      } catch {
        // use fallback defaults
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveContent('about', data);
      setIsDirty?.(false);
      showToast('success', 'Berhasil disimpan! Perubahan sudah tayang di website.');
    } catch (err: any) {
      showToast('error', err.message || 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const updateMuseum = (field: string, value: any) => {
    setIsDirty?.(true);
    setData((prev) => ({ ...prev, museum: { ...prev.museum, [field]: value } }));
  };

  const updateTimeline = (index: number, field: string, value: string) => {
    const updated = [...data.museum.timeline];
    updated[index] = { ...updated[index], [field]: value };
    updateMuseum('timeline', updated);
  };

  const handleConfirmAddTimeline = () => {
    if (!newTimeline.year || !newTimeline.event) {
      alert('Tahun dan deskripsi event harus diisi!');
      return;
    }
    updateMuseum('timeline', [...data.museum.timeline, { ...newTimeline }]);
    setShowAddTimelineModal(false);
  };

  const removeTimeline = (index: number) => {
    updateMuseum('timeline', data.museum.timeline.filter((_, i) => i !== index));
  };

  const updateTab = (index: number, field: string, value: any) => {
    const updated = [...data.museum.tabs];
    if (field.startsWith('content.')) {
      const contentField = field.replace('content.', '');
      updated[index] = {
        ...updated[index],
        content: { ...updated[index].content, [contentField]: value },
      };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    updateMuseum('tabs', updated);
  };

  const updateOrg = (field: string, value: any) => {
    setIsDirty?.(true);
    setData((prev) => ({ ...prev, organization: { ...prev.organization, [field]: value } }));
  };

  const handleOpenAddMember = () => {
    setMemberForm({
      id: `member-${Date.now()}`,
      name: '',
      role: '',
      category: 'DEPARTEMEN',
      image: ''
    });
    setEditingMemberIndex(null);
    setShowAddEditMemberModal(true);
  };

  const handleOpenEditMember = (index: number) => {
    setMemberForm({ ...data.organization.structure[index] });
    setEditingMemberIndex(index);
    setShowAddEditMemberModal(true);
  };

  const handleSaveMember = () => {
    if (!memberForm.name) {
      alert('Nama pengurus harus diisi!');
      return;
    }
    setIsDirty?.(true);
    const updatedStructure = [...(data.organization.structure as any)];
    if (editingMemberIndex !== null) {
      updatedStructure[editingMemberIndex] = memberForm;
    } else {
      updatedStructure.push(memberForm);
    }
    updateOrg('structure', updatedStructure);
    setShowAddEditMemberModal(false);
  };

  const handleDeleteMember = (index: number) => {
    if (!confirm('Hapus pengurus ini?')) return;
    setIsDirty?.(true);
    const updatedStructure = (data.organization.structure as any).filter((_: any, i: number) => i !== index);
    updateOrg('structure', updatedStructure);
  };

  const handleMoveMember = (index: number, direction: 'up' | 'down') => {
    const list = [...(data.organization.structure as any)];
    if (direction === 'up' && index > 0) {
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
    } else if (direction === 'down' && index < list.length - 1) {
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
    } else {
      return;
    }
    setIsDirty?.(true);
    updateOrg('structure', list);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="text-amber-400 animate-spin" />
      </div>
    );
  }

  const SectionHeader = ({ title, sectionKey }: { title: string; sectionKey: string }) => (
    <button
      onClick={() => toggleSection(sectionKey)}
      className="w-full flex items-center justify-between py-3"
    >
      <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">{title}</h3>
      {openSections[sectionKey] ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
    </button>
  );

  return (
    <div className="max-w-4xl space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-fade-up ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Tentang Kami</h2>
          <p className="text-sm text-slate-400 mt-1">Edit konten tentang, sejarah (timeline), visi misi, dan organisasi</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <a
            href="/#about"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none flex justify-center items-center gap-2 px-3 py-2.5 md:py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors text-slate-300"
            title="Buka website di tab baru untuk melihat perubahan"
          >
            <ExternalLink size={16} />
            Lihat Web
          </a>
          <button onClick={handleSave} disabled={saving} className="flex-1 md:flex-none flex justify-center items-center gap-2 px-4 py-2.5 md:py-2 bg-amber-500 text-slate-900 font-semibold text-sm rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-60">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Simpan
          </button>
        </div>
      </div>

      {showJson ? (
        <pre className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-xs text-slate-300 overflow-auto max-h-[600px]">
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <div className="space-y-4">
          {/* General / Museum Info */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-6">
            <SectionHeader title="Informasi Umum" sectionKey="general" />
            {openSections.general && (
              <div className="pb-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1" title="Teks kecil di atas judul utama">Teks Skrip (Kecil) <span className="text-slate-500 text-xs font-normal cursor-help">❔</span></label>
                    <input type="text" value={data.museum.scriptText} onChange={(e) => updateMuseum('scriptText', e.target.value)} className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1" title="Sub-judul">Sub-Judul <span className="text-slate-500 text-xs font-normal cursor-help">❔</span></label>
                    <input type="text" value={data.museum.subtitle} onChange={(e) => updateMuseum('subtitle', e.target.value)} className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1" title="Judul utama sesi ini">Judul Utama <span className="text-slate-500 text-xs font-normal cursor-help">❔</span></label>
                  <input type="text" value={data.museum.mainTitle} onChange={(e) => updateMuseum('mainTitle', e.target.value)} className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1" title="Teks paragraf pengantar">Teks Pengantar <span className="text-slate-500 text-xs font-normal cursor-help">❔</span></label>
                  <textarea value={data.museum.introText} onChange={(e) => updateMuseum('introText', e.target.value)} rows={4} className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none focus:outline-none focus:ring-1 focus:ring-amber-500/50" />
                </div>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-6">
            <SectionHeader title="Timeline / Sejarah" sectionKey="timeline" />
            {openSections.timeline && (
              <div className="pb-6 space-y-3">
                {data.museum.timeline.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    <div className="w-24">
                      <input type="text" value={item.year} onChange={(e) => updateTimeline(i, 'year', e.target.value)} placeholder="Tahun" className="w-full px-2 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50" />
                    </div>
                    <div className="flex-1">
                      <input type="text" value={item.event} onChange={(e) => updateTimeline(i, 'event', e.target.value)} placeholder="Event / milestone" className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50" />
                    </div>
                    <button onClick={() => removeTimeline(i)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setNewTimeline({ year: '', event: '' });
                    setShowAddTimelineModal(true);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <Plus size={14} /> Tambah Timeline
                </button>
              </div>
            )}
          </div>

          {/* Tabs (Visi, Misi, Nilai, Pencapaian) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-6">
            <SectionHeader title="Tab Konten (Visi, Misi, dll)" sectionKey="tabs" />
            {openSections.tabs && (
              <div className="pb-6 space-y-4">
                {data.museum.tabs.map((tab, i) => (
                  <div key={tab.id} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-amber-300">{tab.name}</span>
                      <span className="text-xs text-slate-500">ID: {tab.id}</span>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Title</label>
                      <input type="text" value={tab.content.title} onChange={(e) => updateTab(i, 'content.title', e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Description</label>
                      <textarea
                        value={Array.isArray(tab.content.description) ? tab.content.description.join('\n') : tab.content.description}
                        onChange={(e) => updateTab(i, 'content.description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm resize-none focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Highlight</label>
                      <input type="text" value={tab.content.highlight || ''} onChange={(e) => updateTab(i, 'content.highlight', e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Organization */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-6">
            <SectionHeader title="Struktur Organisasi" sectionKey="organization" />
            {openSections.organization && (
              <div className="pb-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Script Text</label>
                    <input type="text" value={data.organization.scriptText} onChange={(e) => updateOrg('scriptText', e.target.value)} className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Main Title</label>
                    <input type="text" value={data.organization.mainTitle} onChange={(e) => updateOrg('mainTitle', e.target.value)} className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                  <textarea value={data.organization.description} onChange={(e) => updateOrg('description', e.target.value)} rows={3} className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none focus:outline-none focus:ring-1 focus:ring-amber-500/50" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-700/50 pb-2">
                    <span className="text-sm font-semibold text-white">Daftar Pengurus ({data.organization.structure?.length || 0})</span>
                    <button
                      type="button"
                      onClick={handleOpenAddMember}
                      className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-xs font-semibold"
                    >
                      <Plus size={14} /> Tambah Pengurus Baru
                    </button>
                  </div>
                  
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                    {data.organization.structure?.length === 0 ? (
                      <div className="text-center py-6 text-slate-500 text-sm">Belum ada data pengurus.</div>
                    ) : (
                      data.organization.structure.map((item, idx) => (
                        <div key={item.id || idx} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Thumbnail image */}
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-700 flex-shrink-0 border border-slate-600">
                              {item.image ? (
                                <img src={getMediaUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-amber-400">K</div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="text-white font-medium text-sm truncate">{item.name}</div>
                              <div className="text-xs text-slate-400 truncate">
                                <span className="bg-amber-400/10 text-amber-400 px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold mr-1.5">
                                  {item.category}
                                </span>
                                {item.role ? `${item.role}` : ''}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => handleMoveMember(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30"
                              title="Pindahkan Ke Atas"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveMember(idx, 'down')}
                              disabled={idx === (data.organization.structure?.length || 0) - 1}
                              className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30"
                              title="Pindahkan Ke Bawah"
                            >
                              <ArrowDown size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEditMember(idx)}
                              className="p-1.5 text-amber-400 hover:text-amber-300"
                              title="Edit Detail"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteMember(idx)}
                              className="p-1.5 text-slate-500 hover:text-red-400"
                              title="Hapus"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-8 border-t border-slate-800 flex justify-center">
            <button
              onClick={() => setShowJson(!showJson)}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Mode Developer (JSON)
            </button>
          </div>
        </div>
      )}
      {showAddTimelineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-white">Tambah Timeline</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Tahun</label>
                <input
                  type="text"
                  value={newTimeline.year}
                  onChange={(e) => setNewTimeline({ ...newTimeline, year: e.target.value })}
                  placeholder="Misal: 2019"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Event / Milestone</label>
                <input
                  type="text"
                  value={newTimeline.event}
                  onChange={(e) => setNewTimeline({ ...newTimeline, event: e.target.value })}
                  placeholder="Deskripsi singkat milestone..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddTimelineModal(false)}
                className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAddTimeline}
                className="px-4 py-2 text-sm bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-lg transition-colors"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddEditMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-white">
              {editingMemberIndex !== null ? 'Edit Pengurus' : 'Tambah Pengurus'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Nama Pengurus</label>
                <input
                  type="text"
                  value={memberForm.name}
                  onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                  placeholder="Nama Lengkap & Gelar..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Jabatan / Detail Peran</label>
                <input
                  type="text"
                  value={memberForm.role}
                  onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                  placeholder="Misal: Leader, Riset, Administrasi..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Kategori Jabatan</label>
                <select
                  value={memberForm.category}
                  onChange={(e) => setMemberForm({ ...memberForm, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="PEMBINA">PEMBINA</option>
                  <option value="STEERING COMMITTEE">STEERING COMMITTEE</option>
                  <option value="KETUA UMUM">KETUA UMUM</option>
                  <option value="SEKRETARIS">SEKRETARIS</option>
                  <option value="BENDAHARA">BENDAHARA</option>
                  <option value="DEPARTEMEN">DEPARTEMEN</option>
                </select>
              </div>
              <div>
                <ImageUploader
                  value={memberForm.image || ''}
                  onChange={(url) => setMemberForm({ ...memberForm, image: url })}
                  label="Foto Anggota"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddEditMemberModal(false)}
                className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveMember}
                className="px-4 py-2 text-sm bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-lg transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
