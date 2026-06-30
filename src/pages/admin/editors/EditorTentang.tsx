import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Loader2, ExternalLink, ArrowUp, ArrowDown, Pencil } from 'lucide-react';
import { getContent, saveContent } from '../lib/adminApi';
import { sejarahConfig, organizationConfig } from '../../../config';
import { getMediaUrl } from '../../../lib/strapi';
import { ImageUploader } from '../components/ImageUploader';
import { ConfirmModal } from '../components/ConfirmModal';
import { toast } from 'sonner';

interface OrgMember {
  id: string;
  name: string;
  role: string;
  category: string;
  image?: string;
  department?: string;
}

const ORG_CATEGORY_LABELS: Record<string, string> = {
  'PEMBINA': 'Pembina',
  'STEERING COMMITTEE': 'Steering Committee',
  'KETUA UMUM': 'Ketua Umum',
  'SEKRETARIS': 'Sekretaris',
  'BENDAHARA': 'Bendahara',
  'DEPARTEMEN': 'Kepala Divisi / Departemen',
  'ANGGOTA DEPARTEMEN': 'Anggota Divisi / Departemen'
};

interface AboutData {
  sejarah: typeof sejarahConfig;
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
      department: m.department || '',
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

  const steeringCommitteeNodes = root.children ?? [];
  steeringCommitteeNodes.forEach((node: any, idx: number) => {
    list.push({
      id: `member-sc-${idx}-${Date.now()}`,
      name: node.name || '',
      role: node.role || '',
      category: 'STEERING COMMITTEE',
      image: node.image || '',
    });
  });

  const dewanKehormatanNode = steeringCommitteeNodes[0];
  if (dewanKehormatanNode) {
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
          department: node.name || '',
        });

        if (node.children && Array.isArray(node.children)) {
          node.children.forEach((childNode: any, cidx: number) => {
            list.push({
              id: `member-dept-${idx}-member-${cidx}-${Date.now()}`,
              name: childNode.name || '',
              role: childNode.role || '',
              category: 'ANGGOTA DEPARTEMEN',
              image: childNode.image || '',
              department: node.name,
            });
          });
        }
      });
    }
  }

  return list;
}

export function EditorTentang({ setIsDirty }: { setIsDirty?: (dirty: boolean) => void }) {
  const [data, setData] = useState<AboutData>(() => {
    const defaultData = {
      sejarah: { ...sejarahConfig },
      organization: { ...organizationConfig },
    };
    return {
      sejarah: defaultData.sejarah,
      organization: {
        ...defaultData.organization,
        structure: flattenOrgStructure(defaultData.organization.structure)
      }
    };
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddTimelineModal, setShowAddTimelineModal] = useState(false);
  const [newTimeline, setNewTimeline] = useState({ year: '', event: '' });
  const [showAddEditMemberModal, setShowAddEditMemberModal] = useState(false);
  const [editingMemberIndex, setEditingMemberIndex] = useState<number | null>(null);
  const [memberForm, setMemberForm] = useState<OrgMember>({
    id: '',
    name: '',
    role: '',
    category: 'DEPARTEMEN',
    image: '',
    department: ''
  });
  const [activeTab, setActiveTab] = useState<'general' | 'timeline' | 'tabs' | 'organization'>('general');

  // Confirm Modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await getContent<any>('about');
        if (res && res.content) {
          const content = res.content;
          const mergedSejarah = content.sejarah || content.museum ? { ...sejarahConfig, ...(content.sejarah || content.museum) } : sejarahConfig;
          const mergedOrg = content.organization ? { ...organizationConfig, ...content.organization } : organizationConfig;
          mergedOrg.structure = flattenOrgStructure(mergedOrg.structure);
          
          setData({
            sejarah: mergedSejarah,
            organization: mergedOrg
          });
        }
      } catch (err: any) {
        toast.error('Gagal memuat data Tentang Kami dari server.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        museum: data.sejarah,   // Double write for backward compatibility
        sejarah: data.sejarah
      };
      await saveContent('about', payload);
      setIsDirty?.(false);
      toast.success('Berhasil disimpan! Perubahan sudah tayang di website.');
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan data.');
    } finally {
      setSaving(false);
    }
  };



  const updateSejarah = (field: string, value: any) => {
    setIsDirty?.(true);
    setData((prev) => ({ ...prev, sejarah: { ...prev.sejarah, [field]: value } }));
  };

  const updateTimeline = (index: number, field: string, value: string) => {
    const updated = [...data.sejarah.timeline];
    updated[index] = { ...updated[index], [field]: value };
    updateSejarah('timeline', updated);
  };

  const handleConfirmAddTimeline = () => {
    if (!newTimeline.year || !newTimeline.event) {
      alert('Tahun dan deskripsi event harus diisi!');
      return;
    }
    updateSejarah('timeline', [...data.sejarah.timeline, { ...newTimeline }]);
    setShowAddTimelineModal(false);
  };

  const removeTimeline = (index: number) => {
    updateSejarah('timeline', data.sejarah.timeline.filter((_, i) => i !== index));
  };

  const updateTab = (index: number, field: string, value: any) => {
    const updated = [...data.sejarah.tabs];
    if (field.startsWith('content.')) {
      const contentField = field.replace('content.', '');
      updated[index] = {
        ...updated[index],
        content: { ...updated[index].content, [contentField]: value },
      };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    updateSejarah('tabs', updated);
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
      image: '',
      department: ''
    });
    setEditingMemberIndex(null);
    setShowAddEditMemberModal(true);
  };

  const handleOpenEditMember = (index: number) => {
    setMemberForm({
      department: '',
      ...data.organization.structure[index]
    });
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
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Pengurus',
      message: 'Apakah Anda yakin ingin menghapus pengurus ini dari struktur organisasi?',
      onConfirm: () => {
        setIsDirty?.(true);
        const updatedStructure = (data.organization.structure as any).filter((_: any, i: number) => i !== index);
        updateOrg('structure', updatedStructure);
      }
    });
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

  return (
    <div className="w-full space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#eae6dd] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#1c1515]">Tentang Kami</h2>
          <p className="text-xs text-neutral-500 mt-0.5">Edit konten tentang, sejarah (timeline), visi misi, dan organisasi</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a
            href="/#about"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none flex justify-center items-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-[#d2cbbe] rounded-lg hover:bg-[#faf9f5] transition-colors text-[#1c1515] font-semibold"
            title="Buka website di tab baru untuk melihat perubahan"
          >
            <ExternalLink size={14} />
            Lihat Web
          </a>
          <button onClick={handleSave} disabled={saving} className="flex-1 sm:flex-none flex justify-center items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#dcae44] to-[#b88c2b] text-white font-bold text-xs rounded-lg hover:brightness-105 transition-all disabled:opacity-60 shadow-[0_2px_8px_rgba(195,147,49,0.1)]">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Simpan
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex flex-wrap gap-2 border-b border-[#eae6dd] pb-px">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-3 py-1.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'general'
              ? 'border-[#a67e2a] text-[#a67e2a]'
              : 'border-transparent text-neutral-500 hover:text-neutral-700'
          }`}
        >
          Informasi Umum & Header
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-3 py-1.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'timeline'
              ? 'border-[#a67e2a] text-[#a67e2a]'
              : 'border-transparent text-neutral-500 hover:text-neutral-700'
          }`}
        >
          Sejarah / Timeline
        </button>
        <button
          onClick={() => setActiveTab('tabs')}
          className={`px-3 py-1.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'tabs'
              ? 'border-[#a67e2a] text-[#a67e2a]'
              : 'border-transparent text-neutral-500 hover:text-neutral-700'
          }`}
        >
          Visi, Misi & Nilai
        </button>
        <button
          onClick={() => setActiveTab('organization')}
          className={`px-3 py-1.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'organization'
              ? 'border-[#a67e2a] text-[#a67e2a]'
              : 'border-transparent text-neutral-500 hover:text-neutral-700'
          }`}
        >
          Struktur Organisasi
        </button>
      </div>

      <div className="space-y-4">
        {/* Tab 1: General / Sejarah Info */}
        {activeTab === 'general' && (
          <div className="bg-white border border-[#eae6dd] rounded-xl p-4 space-y-4 shadow-sm">
            <div className="border-b border-[#eae6dd]/40 pb-3 space-y-3">
              <h4 className="font-script text-[9px] text-neutral-400 font-bold tracking-[0.12em] mb-1.5">Header Halaman</h4>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-3.5">
                  <div>
                    <label className="font-script text-[10px] text-neutral-500 block mb-1">Judul Header</label>
                    <input type="text" value={data.sejarah.aboutHeaderTitle || ''} onChange={(e) => updateSejarah('aboutHeaderTitle', e.target.value)} className="w-full text-xs bg-[#faf9f5] border-b border-[#d2cbbe] hover:border-[#a67e2a] focus:border-[#a67e2a] px-2 py-1.5 focus:bg-white transition-all outline-none rounded-t duration-200 text-[#1c1515]" />
                  </div>
                  <div>
                    <label className="font-script text-[10px] text-neutral-500 block mb-1">Deskripsi Header</label>
                    <textarea value={data.sejarah.aboutHeaderDescription || ''} onChange={(e) => updateSejarah('aboutHeaderDescription', e.target.value)} rows={3} className="w-full text-xs bg-[#faf9f5] border-b border-[#d2cbbe] hover:border-[#a67e2a] focus:border-[#a67e2a] px-2 py-1.5 focus:bg-white transition-all outline-none rounded-t duration-200 text-[#1c1515] resize-none" />
                  </div>
                </div>
                <div className="w-full md:w-auto md:shrink-0 flex justify-start md:justify-end">
                  <ImageUploader label="Gambar Header" value={data.sejarah.aboutHeaderImage || ''} onChange={(url) => updateSejarah('aboutHeaderImage', url)} />
                </div>
              </div>
            </div>

            <h4 className="font-script text-[9px] text-neutral-400 font-bold tracking-[0.12em] pt-1">Detail Profil & Sejarah</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Judul Utama</label>
                <input type="text" value={data.sejarah.mainTitle} onChange={(e) => updateSejarah('mainTitle', e.target.value)} className="w-full text-xs bg-[#faf9f5] border-b border-[#d2cbbe] hover:border-[#a67e2a] focus:border-[#a67e2a] px-2 py-1.5 focus:bg-white transition-all outline-none rounded-t duration-200 text-[#1c1515]" />
              </div>
              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Teks Intro</label>
                <textarea value={data.sejarah.introText} onChange={(e) => updateSejarah('introText', e.target.value)} rows={2} className="w-full text-xs bg-[#faf9f5] border-b border-[#d2cbbe] hover:border-[#a67e2a] focus:border-[#a67e2a] px-2 py-1.5 focus:bg-white transition-all outline-none rounded-t duration-200 text-[#1c1515] resize-none" />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Timeline */}
        {activeTab === 'timeline' && (
          <div className="bg-white border border-[#eae6dd] rounded-xl p-4 space-y-4 shadow-sm">
            <h3 className="font-script text-[10px] text-[#a67e2a] font-bold tracking-[0.12em] border-b border-[#eae6dd]/40 pb-2">Sejarah / Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
              {data.sejarah.timeline.map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-[#faf9f5]/50 rounded-lg border border-[#eae6dd]">
                  <div className="w-16 flex-shrink-0">
                    <input type="text" value={item.year} onChange={(e) => updateTimeline(i, 'year', e.target.value)} placeholder="Tahun" className="w-full px-2 py-1 bg-white border border-[#d2cbbe] rounded text-xs text-[#1c1515] focus:outline-none" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <input type="text" value={item.event} onChange={(e) => updateTimeline(i, 'event', e.target.value)} placeholder="Milestone" className="w-full px-2 py-1 bg-white border border-[#d2cbbe] rounded text-xs text-[#1c1515] focus:outline-none" />
                  </div>
                  <button onClick={() => removeTimeline(i)} className="p-1 text-neutral-400 hover:text-red-600 rounded transition-colors flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setNewTimeline({ year: '', event: '' });
                setShowAddTimelineModal(true);
              }}
              className="flex items-center gap-1 px-2.5 py-1 text-[10px] bg-[#faf9f5] border border-[#d2cbbe] rounded hover:bg-neutral-100 text-[#1c1515] font-semibold transition-colors w-fit"
            >
              <Plus size={12} /> Tambah Tahun
            </button>
          </div>
        )}

        {/* Tab 3: Visi, Misi & Nilai */}
        {activeTab === 'tabs' && (
          <div className="bg-white border border-[#eae6dd] rounded-xl p-4 space-y-4 shadow-sm">
            <h3 className="font-script text-[10px] text-[#a67e2a] font-bold tracking-[0.12em] border-b border-[#eae6dd]/40 pb-2">Visi, Misi & Nilai</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {data.sejarah.tabs.map((tab, i) => (
                <div key={tab.id} className="p-3 bg-[#faf9f5]/50 rounded-xl border border-[#eae6dd] space-y-2">
                  <div className="flex items-center justify-between border-b border-[#eae6dd]/60 pb-1">
                    <span className="font-mono text-[9px] font-bold text-neutral-400 uppercase">ID: {tab.id}</span>
                  </div>
                  <div>
                    <label className="font-script text-[9px] text-neutral-500 block mb-0.5">Judul</label>
                    <input type="text" value={tab.content.title} onChange={(e) => updateTab(i, 'content.title', e.target.value)} className="w-full text-xs bg-white border border-[#d2cbbe] rounded px-2 py-1 text-[#1c1515] focus:outline-none" />
                  </div>
                  <div>
                    <label className="font-script text-[9px] text-neutral-500 block mb-0.5">Deskripsi</label>
                    <textarea
                      value={tab.content.description}
                      onChange={(e) => updateTab(i, 'content.description', e.target.value)}
                      rows={3}
                      className="w-full text-xs bg-white border border-[#d2cbbe] rounded px-2 py-1 text-[#1c1515] resize-none focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Struktur Organisasi */}
        {activeTab === 'organization' && (
          <div className="bg-white border border-[#eae6dd] rounded-xl p-4 space-y-4 shadow-sm">
            <h3 className="font-script text-[10px] text-[#a67e2a] font-bold tracking-[0.12em] border-b border-[#eae6dd]/40 pb-2">Struktur Organisasi</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Subjudul (Script Text)</label>
                <input type="text" value={data.organization.scriptText} onChange={(e) => updateOrg('scriptText', e.target.value)} className="w-full text-xs bg-[#faf9f5] border-b border-[#d2cbbe] hover:border-[#a67e2a] focus:border-[#a67e2a] px-2 py-1.5 focus:bg-white transition-all outline-none rounded-t duration-200 text-[#1c1515]" />
              </div>
              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Judul Utama</label>
                <input type="text" value={data.organization.mainTitle} onChange={(e) => updateOrg('mainTitle', e.target.value)} className="w-full text-xs bg-[#faf9f5] border-b border-[#d2cbbe] hover:border-[#a67e2a] focus:border-[#a67e2a] px-2 py-1.5 focus:bg-white transition-all outline-none rounded-t duration-200 text-[#1c1515]" />
              </div>
              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Deskripsi Pengantar</label>
                <textarea value={data.organization.description} onChange={(e) => updateOrg('description', e.target.value)} rows={2} className="w-full text-xs bg-[#faf9f5] border-b border-[#d2cbbe] hover:border-[#a67e2a] focus:border-[#a67e2a] px-2 py-1.5 focus:bg-white transition-all outline-none rounded-t duration-200 text-[#1c1515] resize-none" />
              </div>
            </div>
            
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between border-b border-[#eae6dd] pb-1">
                <h4 className="font-script text-[10px] text-[#a67e2a] font-bold tracking-[0.12em]">Daftar Pengurus ({data.organization.structure?.length || 0})</h4>
                <button
                  type="button"
                  onClick={handleOpenAddMember}
                  className="flex items-center gap-1 text-[#a67e2a] hover:text-[#b88c2b] text-[10px] font-bold"
                >
                  <Plus size={12} /> Tambah Anggota
                </button>
              </div>
              
              <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                {data.organization.structure?.length === 0 ? (
                  <div className="text-center py-4 text-neutral-400 text-xs">Belum ada data pengurus.</div>
                ) : (
                  data.organization.structure.map((item, idx) => (
                    <div key={item.id || idx} className="flex items-center justify-between p-2 bg-[#faf9f5]/55 rounded-lg border border-[#eae6dd] gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-100 flex-shrink-0 border border-[#eae6dd]">
                          {item.image ? (
                            <img src={getMediaUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-[#a67e2a] bg-[#faf9f5]">K</div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[#1c1515] font-bold text-xs truncate">{item.name}</div>
                          <div className="text-[10px] text-neutral-500 truncate flex items-center gap-1.5">
                            <span className="bg-amber-500/10 text-[#a67e2a] px-1 rounded-[3px] text-[8px] uppercase font-semibold">
                              {ORG_CATEGORY_LABELS[item.category] || item.category}
                            </span>
                            {item.department ? <span className="text-[9px] text-[#a67e2a] font-medium">({item.department})</span> : null}
                            {item.role ? `• ${item.role}` : ''}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handleMoveMember(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-neutral-400 hover:text-neutral-600 disabled:opacity-30"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveMember(idx, 'down')}
                          disabled={idx === (data.organization.structure?.length || 0) - 1}
                          className="p-1 text-neutral-400 hover:text-neutral-600 disabled:opacity-30"
                        >
                          <ArrowDown size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditMember(idx)}
                          className="p-1 text-[#a67e2a] hover:text-[#b88c2b]"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMember(idx)}
                          className="p-1 text-neutral-400 hover:text-red-600 rounded"
                        >
                          <Trash2 size={13} />
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
      {showAddTimelineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-[#eae6dd] rounded-xl p-4 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-[#1c1515]">Tambah Timeline</h3>
            <div className="space-y-3">
              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Tahun</label>
                <input
                  type="text"
                  value={newTimeline.year}
                  onChange={(e) => setNewTimeline({ ...newTimeline, year: e.target.value })}
                  placeholder="Misal: 2019"
                  className="w-full px-2.5 py-1.5 bg-[#faf9f5] border border-[#d2cbbe] rounded text-[#1c1515] text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Event / Milestone</label>
                <input
                  type="text"
                  value={newTimeline.event}
                  onChange={(e) => setNewTimeline({ ...newTimeline, event: e.target.value })}
                  placeholder="Deskripsi singkat milestone..."
                  className="w-full px-2.5 py-1.5 bg-[#faf9f5] border border-[#d2cbbe] rounded text-[#1c1515] text-xs focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-[#eae6dd]">
              <button
                type="button"
                onClick={() => setShowAddTimelineModal(false)}
                className="px-3 py-1.5 text-xs bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 rounded transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAddTimeline}
                className="px-3 py-1.5 text-xs bg-[#a67e2a] hover:bg-[#8e6b21] text-white font-bold rounded transition-colors"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddEditMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-[#eae6dd] rounded-xl p-4 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-[#1c1515]">
              {editingMemberIndex !== null ? 'Edit Pengurus' : 'Tambah Pengurus'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Nama Pengurus</label>
                <input
                  type="text"
                  value={memberForm.name}
                  onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                  placeholder="Nama Lengkap & Gelar..."
                  className="w-full px-2.5 py-1.5 bg-[#faf9f5] border border-[#d2cbbe] rounded text-[#1c1515] text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Jabatan / Detail Peran</label>
                <input
                  type="text"
                  value={memberForm.role}
                  onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                  placeholder="Misal: Leader, Riset, Administrasi..."
                  className="w-full px-2.5 py-1.5 bg-[#faf9f5] border border-[#d2cbbe] rounded text-[#1c1515] text-xs focus:outline-none"
                />
              </div>              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Kategori Jabatan</label>
                <select
                  value={memberForm.category}
                  onChange={(e) => setMemberForm({ ...memberForm, category: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-[#faf9f5] border border-[#d2cbbe] rounded text-[#1c1515] text-xs focus:outline-none"
                >
                  <option value="PEMBINA">Pembina</option>
                  <option value="STEERING COMMITTEE">Steering Committee</option>
                  <option value="KETUA UMUM">Ketua Umum</option>
                  <option value="SEKRETARIS">Sekretaris</option>
                  <option value="BENDAHARA">Bendahara</option>
                  <option value="DEPARTEMEN">Kepala Divisi / Departemen</option>
                  <option value="ANGGOTA DEPARTEMEN">Anggota Divisi / Departemen</option>
                </select>
              </div>
              {(memberForm.category === 'ANGGOTA DEPARTEMEN' || memberForm.category === 'DEPARTEMEN') && (
                <div>
                  <label className="font-script text-[10px] text-neutral-500 block mb-1">Departemen / Divisi</label>
                  <select
                    value={memberForm.department || ''}
                    onChange={(e) => setMemberForm({ ...memberForm, department: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-[#faf9f5] border border-[#d2cbbe] rounded text-[#1c1515] text-xs focus:outline-none"
                  >
                    <option value="">-- Pilih Departemen --</option>
                    <option value="Dept. Research">Dept. Research</option>
                    <option value="Dept. Media">Dept. Media</option>
                    <option value="Dept. HR & Program">Dept. HR & Program</option>
                    <option value="Dept. Finance">Dept. Finance</option>
                  </select>
                </div>
              )}

              <div>
                <ImageUploader
                  value={memberForm.image || ''}
                  onChange={(url) => setMemberForm({ ...memberForm, image: url })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-[#eae6dd]">
              <button
                type="button"
                onClick={() => setShowAddEditMemberModal(false)}
                className="px-3 py-1.5 text-xs bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 rounded transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveMember}
                className="px-3 py-1.5 text-xs bg-[#a67e2a] hover:bg-[#8e6b21] text-white font-bold rounded transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        variant="danger"
      />
    </div>
  );
}
