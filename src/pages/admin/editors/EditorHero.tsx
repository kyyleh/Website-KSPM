import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Loader2, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { getContent, saveContent } from '../lib/adminApi';
import { heroConfig, newsConfig } from '../../../config';
import { ImageUploader } from '../components/ImageUploader';
import { ConfirmModal } from '../components/ConfirmModal';
import { toast } from 'sonner';

export function EditorHero({ setIsDirty }: { setIsDirty?: (dirty: boolean) => void }) {
  const [activeTab, setActiveTab] = useState<'hero' | 'testimonials'>('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showJson, setShowJson] = useState(false);

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

  // States for Hero Section
  const [heroData, setHeroData] = useState<any>(null);
  const [showAddStatModal, setShowAddStatModal] = useState(false);
  const [newStat, setNewStat] = useState({ value: 0, suffix: '', label: '' });

  // States for Testimonials Section
  const [testimonialsData, setTestimonialsData] = useState<any>(null);
  const [showAddTestimonialModal, setShowAddTestimonialModal] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({ name: '', role: '', text: '', rating: 5, image: '' });
  const [expandedTestimonial, setExpandedTestimonial] = useState<number | null>(0);

  useEffect(() => {
    (async () => {
      try {
        const [heroRes, newsRes] = await Promise.all([
          getContent('hero'),
          getContent('news'),
        ]);

        setHeroData(heroRes.content ? { ...heroConfig, ...heroRes.content } : heroConfig);
        setTestimonialsData(newsRes.content ? { ...newsConfig, ...newsRes.content } : newsConfig);
      } catch (err: any) {
        toast.error('Gagal memuat data Beranda dari server.');
        setHeroData(heroConfig);
        setTestimonialsData(newsConfig);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      let latestNewsData = newsConfig;
      try {
        const latestNewsRes = await getContent('news');
        if (latestNewsRes && latestNewsRes.content) {
          latestNewsData = latestNewsRes.content;
        }
      } catch (err) {
        console.warn("Gagal mengambil data 'news' terbaru, menggunakan fallback default", err);
      }

      const mergedNewsData = {
        ...latestNewsData,
        testimonials: testimonialsData.testimonials,
        testimonialsMainTitle: testimonialsData.testimonialsMainTitle,
        testimonialsSubtitle: testimonialsData.testimonialsSubtitle,
        testimonialsScriptText: testimonialsData.testimonialsScriptText,
      };

      await Promise.all([
        saveContent('hero', heroData),
        saveContent('news', mergedNewsData),
      ]);
      setIsDirty?.(false);
      toast.success('Seluruh data beranda berhasil disimpan!');
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan data.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !heroData || !testimonialsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="text-[#a67e2a] animate-spin" />
      </div>
    );
  }

  const updateHeroField = (key: string, value: any) => {
    setIsDirty?.(true);
    setHeroData({ ...heroData, [key]: value });
  };

  const updateHeroStat = (index: number, field: string, value: any) => {
    setIsDirty?.(true);
    const stats = [...heroData.stats];
    stats[index] = { ...stats[index], [field]: value };
    setHeroData({ ...heroData, stats });
  };

  const handleConfirmAddStat = () => {
    if (!newStat.label) {
      alert('Label statistik harus diisi!');
      return;
    }
    setIsDirty?.(true);
    setHeroData({
      ...heroData,
      stats: [...heroData.stats, { ...newStat }],
    });
    setShowAddStatModal(false);
  };

  const removeHeroStat = (index: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Statistik',
      message: 'Apakah Anda yakin ingin menghapus statistik ini dari beranda?',
      onConfirm: () => {
        setIsDirty?.(true);
        setHeroData({ ...heroData, stats: heroData.stats.filter((_: any, i: number) => i !== index) });
      }
    });
  };

  const updateTestimonialField = (key: string, value: any) => {
    setIsDirty?.(true);
    setTestimonialsData({ ...testimonialsData, [key]: value });
  };

  const updateTestimonialItem = (index: number, key: string, value: any) => {
    setIsDirty?.(true);
    const testimonials = [...testimonialsData.testimonials];
    testimonials[index] = { ...testimonials[index], [key]: value };
    setTestimonialsData({ ...testimonialsData, testimonials });
  };

  const handleConfirmAddTestimonial = () => {
    if (!newTestimonial.name) {
      alert('Nama testimoni harus diisi!');
      return;
    }
    setIsDirty?.(true);
    const list = testimonialsData.testimonials || [];
    setTestimonialsData({
      ...testimonialsData,
      testimonials: [...list, { ...newTestimonial }],
    });
    setShowAddTestimonialModal(false);
    setExpandedTestimonial(list.length);
  };

  const removeTestimonial = (index: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Testimoni',
      message: 'Apakah Anda yakin ingin menghapus testimoni ini?',
      onConfirm: () => {
        setIsDirty?.(true);
        setTestimonialsData({
          ...testimonialsData,
          testimonials: testimonialsData.testimonials.filter((_: any, i: number) => i !== index),
        });
        setExpandedTestimonial(null);
      }
    });
  };

  return (
    <div className="max-w-4xl space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#eae6dd] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#1c1515]">Pengelola Beranda</h2>
          <p className="text-xs text-neutral-500 mt-0.5">Kelola seluruh bagian halaman depan (Hero dan Testimoni)</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none flex justify-center items-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-[#d2cbbe] rounded-lg hover:bg-[#faf9f5] transition-colors text-[#1c1515] font-semibold"
          >
            <ExternalLink size={14} />
            Lihat Web
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 sm:flex-none flex justify-center items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#dcae44] to-[#b88c2b] text-white font-bold text-xs rounded-lg hover:brightness-105 transition-all disabled:opacity-60 shadow-[0_2px_8px_rgba(195,147,49,0.1)]"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Simpan
          </button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-[#eae6dd] pb-px">
        <button
          onClick={() => { setActiveTab('hero'); setShowJson(false); }}
          className={`px-3 py-1.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'hero'
              ? 'border-[#a67e2a] text-[#a67e2a]'
              : 'border-transparent text-neutral-500 hover:text-neutral-700'
          }`}
        >
          Header Beranda
        </button>
        <button
          onClick={() => { setActiveTab('testimonials'); setShowJson(false); }}
          className={`px-3 py-1.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'testimonials'
              ? 'border-[#a67e2a] text-[#a67e2a]'
              : 'border-transparent text-neutral-500 hover:text-neutral-700'
          }`}
        >
          Apa Kata Mereka (Testimoni)
        </button>
      </div>

      {showJson ? (
        <pre className="bg-[#faf9f5] border border-[#eae6dd] rounded-xl p-3 text-xs text-[#1c1515] overflow-auto max-h-[500px]">
          {JSON.stringify({ hero: heroData, testimonials: testimonialsData }, null, 2)}
        </pre>
      ) : (
        <div className="space-y-4">
          {activeTab === 'hero' && (
            <div className="space-y-4">
              <div className="bg-white border border-[#eae6dd] rounded-xl p-4 space-y-4 shadow-sm">
                <h3 className="font-script text-[10px] text-[#a67e2a] font-bold tracking-[0.12em]">Teks Utama</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="font-script text-[10px] text-neutral-500 block mb-1">Judul Utama</label>
                    <textarea
                      value={heroData.mainTitle || ''}
                      onChange={(e) => updateHeroField('mainTitle', e.target.value)}
                      rows={2}
                      className="w-full text-xs bg-[#faf9f5] border-b border-[#d2cbbe] hover:border-[#a67e2a] focus:border-[#a67e2a] px-2 py-1.5 focus:bg-white transition-all outline-none rounded-t duration-200 text-[#1c1515] resize-none"
                    />
                  </div>
                  <div>
                    <label className="font-script text-[10px] text-neutral-500 block mb-1">Deskripsi</label>
                    <textarea
                      value={heroData.description || ''}
                      onChange={(e) => updateHeroField('description', e.target.value)}
                      rows={2}
                      className="w-full text-xs bg-[#faf9f5] border-b border-[#d2cbbe] hover:border-[#a67e2a] focus:border-[#a67e2a] px-2 py-1.5 focus:bg-white transition-all outline-none rounded-t duration-200 text-[#1c1515] resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#eae6dd] rounded-xl p-4 shadow-sm">
                <h3 className="font-script text-[10px] text-[#a67e2a] font-bold tracking-[0.12em] mb-2">Gambar Unggulan (Foto)</h3>
                <ImageUploader
                  value={heroData.backgroundImage}
                  onChange={(url) => updateHeroField('backgroundImage', url)}
                  label="Unggah Foto Hero"
                />
              </div>

              <div className="bg-white border border-[#eae6dd] rounded-xl p-4 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-script text-[10px] text-[#a67e2a] font-bold tracking-[0.12em]">Statistik Angka</h3>
                  <button
                    onClick={() => {
                      setNewStat({ value: 0, suffix: '', label: '' });
                      setShowAddStatModal(true);
                    }}
                    className="flex items-center gap-1 px-2 py-1 text-[10px] bg-[#faf9f5] border border-[#d2cbbe] rounded hover:bg-neutral-100 text-[#1c1515] font-semibold transition-colors"
                  >
                    <Plus size={12} /> Tambah
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {heroData.stats?.map((stat: any, i: number) => (
                    <div key={i} className="flex items-end gap-2 p-2.5 bg-[#faf9f5]/50 rounded-lg border border-[#eae6dd] relative group">
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <div className="col-span-1">
                          <label className="block text-[9px] font-mono text-neutral-400 uppercase">Angka</label>
                          <input
                            type="number"
                            value={stat.value}
                            onChange={(e) => updateHeroStat(i, 'value', Number(e.target.value))}
                            className="w-full text-xs bg-white border border-[#d2cbbe] rounded px-1.5 py-1 text-[#1c1515] focus:outline-none"
                          />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-[9px] font-mono text-neutral-400 uppercase">Akhiran</label>
                          <input
                            type="text"
                            value={stat.suffix || ''}
                            onChange={(e) => updateHeroStat(i, 'suffix', e.target.value)}
                            className="w-full text-xs bg-white border border-[#d2cbbe] rounded px-1.5 py-1 text-[#1c1515] focus:outline-none"
                          />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-[9px] font-mono text-neutral-400 uppercase">Label</label>
                          <input
                            type="text"
                            value={stat.label || ''}
                            onChange={(e) => updateHeroStat(i, 'label', e.target.value)}
                            className="w-full text-xs bg-white border border-[#d2cbbe] rounded px-1.5 py-1 text-[#1c1515] focus:outline-none"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeHeroStat(i)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                        title="Hapus"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div className="space-y-4">
              <div className="bg-white border border-[#eae6dd] rounded-xl p-4 space-y-3 shadow-sm">
                <h3 className="font-script text-[10px] text-[#a67e2a] font-bold tracking-[0.12em]">Judul Section</h3>
                <div>
                  <label className="font-script text-[10px] text-neutral-500 block mb-1">Judul Utama</label>
                  <input
                    type="text"
                    value={testimonialsData.testimonialsMainTitle || ''}
                    onChange={e => updateTestimonialField('testimonialsMainTitle', e.target.value)}
                    className="w-full text-xs bg-[#faf9f5] border-b border-[#d2cbbe] hover:border-[#a67e2a] focus:border-[#a67e2a] px-2 py-1.5 focus:bg-white transition-all outline-none rounded-t duration-200 text-[#1c1515]"
                  />
                </div>
              </div>

              <div className="bg-white border border-[#eae6dd] rounded-xl p-4 space-y-3 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#eae6dd] pb-2">
                  <h3 className="font-script text-[10px] text-[#a67e2a] font-bold tracking-[0.12em]">Daftar Testimoni ({testimonialsData.testimonials?.length || 0})</h3>
                  <button
                    onClick={() => {
                      setNewTestimonial({ name: '', role: '', text: '', rating: 5, image: '' });
                      setShowAddTestimonialModal(true);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 text-[10px] bg-[#faf9f5] border border-[#d2cbbe] rounded hover:bg-neutral-100 text-[#1c1515] font-semibold transition-colors"
                  >
                    <Plus size={12} /> Tambah
                  </button>
                </div>

                <div className="space-y-2">
                  {testimonialsData.testimonials?.map((t: any, i: number) => {
                    const isExpanded = expandedTestimonial === i;
                    return (
                      <div key={i} className="border border-[#eae6dd] rounded-lg overflow-hidden bg-[#faf9f5]/30">
                        <div 
                          onClick={() => setExpandedTestimonial(isExpanded ? null : i)}
                          className="flex items-center justify-between px-3 py-2 bg-white border-b border-[#eae6dd] cursor-pointer hover:bg-neutral-50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold text-[#a67e2a]">#{i + 1}</span>
                            <span className="text-xs font-bold text-[#1c1515]">{t.name || 'Testimoni Baru'}</span>
                            <span className="text-[10px] text-neutral-400 truncate hidden sm:inline">({t.role})</span>
                          </div>
                          <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => removeTestimonial(i)}
                              className="p-1 text-neutral-400 hover:text-red-600 rounded transition-colors"
                              title="Hapus"
                            >
                              <Trash2 size={14} />
                            </button>
                            <button 
                              onClick={() => setExpandedTestimonial(isExpanded ? null : i)}
                              className="p-1 text-neutral-500 rounded hover:bg-neutral-100"
                            >
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="p-3 space-y-3 bg-[#faf9f5]/50 border-t border-[#eae6dd]/40">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="font-script text-[9px] text-neutral-500 block mb-1">Nama</label>
                                <input
                                  type="text"
                                  value={t.name || ''}
                                  onChange={e => updateTestimonialItem(i, 'name', e.target.value)}
                                  className="w-full text-xs bg-white border border-[#d2cbbe] rounded px-2 py-1 text-[#1c1515] focus:outline-none focus:border-[#a67e2a]"
                                />
                              </div>
                              <div>
                                <label className="font-script text-[9px] text-neutral-500 block mb-1">Jabatan / Role</label>
                                <input
                                  type="text"
                                  value={t.role || ''}
                                  onChange={e => updateTestimonialItem(i, 'role', e.target.value)}
                                  className="w-full text-xs bg-white border border-[#d2cbbe] rounded px-2 py-1 text-[#1c1515] focus:outline-none focus:border-[#a67e2a]"
                                />
                              </div>
                              <div>
                                <label className="font-script text-[9px] text-neutral-500 block mb-1">Bintang (1-5)</label>
                                <input
                                  type="number"
                                  min={1}
                                  max={5}
                                  value={t.rating || 5}
                                  onChange={e => updateTestimonialItem(i, 'rating', parseInt(e.target.value))}
                                  className="w-full text-xs bg-white border border-[#d2cbbe] rounded px-2 py-1 text-[#1c1515] focus:outline-none focus:border-[#a67e2a]"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
                              <div>
                                <label className="font-script text-[9px] text-neutral-500 block mb-1">Isi Testimoni</label>
                                <textarea
                                  value={t.text || ''}
                                  onChange={e => updateTestimonialItem(i, 'text', e.target.value)}
                                  rows={2}
                                  className="w-full text-xs bg-white border border-[#d2cbbe] rounded px-2 py-1 text-[#1c1515] focus:outline-none focus:border-[#a67e2a] resize-none"
                                />
                              </div>
                              <div>
                                <label className="font-script text-[9px] text-neutral-500 block mb-1">Foto Avatar</label>
                                <ImageUploader
                                  value={t.image}
                                  onChange={(url) => updateTestimonialItem(i, 'image', url)}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-[#eae6dd] flex justify-center">
            <button
              onClick={() => setShowJson(!showJson)}
              className="text-[10px] text-neutral-400 hover:text-[#a67e2a] transition-colors"
            >
              Mode Developer (JSON)
            </button>
          </div>
        </div>
      )}

      {showAddStatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-[#eae6dd] rounded-xl p-4 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-[#1c1515]">Tambah Statistik Beranda</h3>
            <div className="space-y-3">
              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Value (Angka)</label>
                <input
                  type="number"
                  value={newStat.value}
                  onChange={(e) => setNewStat({ ...newStat, value: Number(e.target.value) })}
                  className="w-full px-2 py-1.5 bg-[#faf9f5] border border-[#d2cbbe] rounded text-[#1c1515] text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Suffix (Akhiran)</label>
                <input
                  type="text"
                  value={newStat.suffix}
                  onChange={(e) => setNewStat({ ...newStat, suffix: e.target.value })}
                  placeholder="Misal: + atau %"
                  className="w-full px-2 py-1.5 bg-[#faf9f5] border border-[#d2cbbe] rounded text-[#1c1515] text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Label</label>
                <input
                  type="text"
                  value={newStat.label}
                  onChange={(e) => setNewStat({ ...newStat, label: e.target.value })}
                  placeholder="Misal: Anggota Aktif"
                  className="w-full px-2 py-1.5 bg-[#faf9f5] border border-[#d2cbbe] rounded text-[#1c1515] text-xs focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-[#eae6dd]">
              <button
                type="button"
                onClick={() => setShowAddStatModal(false)}
                className="px-3 py-1.5 text-xs bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 rounded transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAddStat}
                className="px-3 py-1.5 text-xs bg-[#a67e2a] hover:bg-[#8e6b21] text-white font-bold rounded transition-colors"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddTestimonialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-[#eae6dd] rounded-xl p-4 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-[#1c1515]">Tambah Testimoni Baru</h3>
            <div className="space-y-3">
              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Foto Avatar</label>
                <ImageUploader
                  value={newTestimonial.image}
                  onChange={(url) => setNewTestimonial({ ...newTestimonial, image: url })}
                />
              </div>
              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={newTestimonial.name}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                  placeholder="Nama pemberi testimoni..."
                  className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded px-2.5 py-1.5 text-[#1c1515] text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Jabatan / Keterangan</label>
                <input
                  type="text"
                  value={newTestimonial.role}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                  placeholder="Misal: Alumni Angkatan 2020..."
                  className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded px-2.5 py-1.5 text-[#1c1515] text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Rating Bintang (1-5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={newTestimonial.rating}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: Number(e.target.value) })}
                  className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded px-2.5 py-1.5 text-[#1c1515] text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Isi Testimoni</label>
                <textarea
                  value={newTestimonial.text}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })}
                  placeholder="Tuliskan testimoni..."
                  rows={3}
                  className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded px-2.5 py-1.5 text-[#1c1515] text-xs focus:outline-none resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-[#eae6dd]">
              <button
                type="button"
                onClick={() => setShowAddTestimonialModal(false)}
                className="px-3 py-1.5 text-xs bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 rounded transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAddTestimonial}
                className="px-3 py-1.5 text-xs bg-[#a67e2a] hover:bg-[#8e6b21] text-white font-bold rounded transition-colors"
              >
                Tambah
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
