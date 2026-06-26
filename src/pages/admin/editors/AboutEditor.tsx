import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Loader2, CheckCircle, AlertCircle, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { getContent, saveContent } from '../lib/adminApi';
import { museumConfig, organizationConfig } from '../../../config';

interface AboutData {
  museum: typeof museumConfig;
  organization: typeof organizationConfig;
}

export function AboutEditor({ setIsDirty }: { setIsDirty?: (dirty: boolean) => void }) {
  const [data, setData] = useState<AboutData>({
    museum: { ...museumConfig },
    organization: { ...organizationConfig },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showJson, setShowJson] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    general: true,
    timeline: false,
    tabs: false,
    organization: false,
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await getContent<AboutData>('about');
        if (res && Object.keys(res).length > 0) setData(res);
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

  const addTimeline = () => {
    updateMuseum('timeline', [...data.museum.timeline, { year: '', event: '' }]);
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
                <button onClick={addTimeline} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors">
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
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <p className="text-xs text-slate-400 mb-2">Struktur organisasi disimpan sebagai format pohon JSON. Buka mode Developer untuk mengedit secara mendalam.</p>
                  <pre className="text-xs text-slate-500 overflow-auto max-h-40">{JSON.stringify(data.organization.structure, null, 2)}</pre>
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
    </div>
  );
}
