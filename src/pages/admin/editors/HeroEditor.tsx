import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Loader2, ExternalLink, ArrowUp, ArrowDown } from 'lucide-react';
import { getContent, saveContent } from '../lib/adminApi';
import { heroConfig, achievementsConfig, newsConfig } from '../../../config';
import { ImageUploader } from '../components/ImageUploader';
import { toast } from 'sonner';

export function HeroEditor({ setIsDirty }: { setIsDirty?: (dirty: boolean) => void }) {
  const [activeTab, setActiveTab] = useState<'hero' | 'achievements' | 'testimonials'>('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showJson, setShowJson] = useState(false);

  // States for Hero Section
  const [heroData, setHeroData] = useState<any>(null);
  const [showAddStatModal, setShowAddStatModal] = useState(false);
  const [newStat, setNewStat] = useState({ value: 0, suffix: '', label: '' });

  // States for Achievements Section
  const [achData, setAchData] = useState<any>(null);
  const [showAddAchModal, setShowAddAchModal] = useState(false);
  const [newAchItem, setNewAchItem] = useState({ value: '', label: '', description: '', icon: 'Users' });

  // States for Testimonials Section
  const [testimonialsData, setTestimonialsData] = useState<any>(null);
  const [showAddTestimonialModal, setShowAddTestimonialModal] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({ name: '', role: '', text: '', rating: 5, image: '' });

  useEffect(() => {
    (async () => {
      try {
        const [heroRes, achRes, newsRes] = await Promise.all([
          getContent('hero'),
          getContent('achievements'),
          getContent('news'),
        ]);

        setHeroData(heroRes.content ? { ...heroConfig, ...heroRes.content } : heroConfig);
        setAchData(achRes.content ? { ...achievementsConfig, ...achRes.content } : achievementsConfig);
        setTestimonialsData(newsRes.content ? { ...newsConfig, ...newsRes.content } : newsConfig);
      } catch (err: any) {
        toast.error('Gagal memuat beberapa data dari server.');
        setHeroData(heroConfig);
        setAchData(achConfigFallback());
        setTestimonialsData(newsConfig);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const achConfigFallback = () => {
    // Return achievementsConfig or achievements list from config
    return achievementsConfig;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Fetch latest 'news' content from server to merge and prevent overwriting articles
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
        saveContent('achievements', achData),
        saveContent('news', mergedNewsData),
      ]);
      setIsDirty?.(false);
      toast.success('Seluruh data beranda berhasil disimpan!');
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan beberapa data.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !heroData || !achData || !testimonialsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="text-[#a67e2a] animate-spin" />
      </div>
    );
  }

  // --- Hero Section Helpers ---
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
    if (!window.confirm("Apakah Anda yakin ingin menghapus statistik ini?")) return;
    setIsDirty?.(true);
    setHeroData({ ...heroData, stats: heroData.stats.filter((_: any, i: number) => i !== index) });
  };

  // --- Achievements Section Helpers ---
  const updateAchField = (key: string, value: any) => {
    setIsDirty?.(true);
    setAchData({ ...achData, [key]: value });
  };

  const updateAchItem = (index: number, key: string, value: any) => {
    setIsDirty?.(true);
    const items = [...achData.items];
    items[index] = { ...items[index], [key]: value };
    setAchData({ ...achData, items });
  };

  const handleConfirmAddAchItem = () => {
    if (!newAchItem.value || !newAchItem.label) {
      alert('Angka/Value dan Label harus diisi!');
      return;
    }
    setIsDirty?.(true);
    setAchData({ ...achData, items: [...achData.items, { ...newAchItem }] });
    setShowAddAchModal(false);
  };

  const removeAchItem = (index: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus pencapaian ini?")) return;
    setIsDirty?.(true);
    setAchData({ ...achData, items: achData.items.filter((_: any, i: number) => i !== index) });
  };

  const moveAchItem = (index: number, direction: 'up' | 'down') => {
    const items = [...achData.items];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    setIsDirty?.(true);
    const temp = items[index];
    items[index] = items[targetIdx];
    items[targetIdx] = temp;
    setAchData({ ...achData, items });
  };

  // --- Testimonials Section Helpers ---
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
    setTestimonialsData({
      ...testimonialsData,
      testimonials: [...(testimonialsData.testimonials || []), { ...newTestimonial }],
    });
    setShowAddTestimonialModal(false);
  };

  const removeTestimonial = (index: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus testimoni ini?")) return;
    setIsDirty?.(true);
    setTestimonialsData({
      ...testimonialsData,
      testimonials: testimonialsData.testimonials.filter((_: any, i: number) => i !== index),
    });
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1c1515]">Pengelola Beranda</h2>
          <p className="text-sm text-neutral-500 mt-1">Kelola seluruh bagian halaman depan (Hero, Pencapaian, dan Testimoni)</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none flex justify-center items-center gap-2 px-3 py-2.5 md:py-2 text-sm bg-white border border-[#d2cbbe] rounded-xl hover:bg-[#faf9f5] transition-colors text-[#1c1515]"
          >
            <ExternalLink size={16} />
            Lihat Web
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 md:flex-none flex justify-center items-center gap-2 px-4 py-2.5 md:py-2 bg-gradient-to-r from-[#dcae44] to-[#b88c2b] text-white font-bold text-sm rounded-xl hover:brightness-105 transition-all disabled:opacity-60 shadow-[0_4px_12px_rgba(195,147,49,0.15)]"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Simpan
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#eae6dd] pb-px">
        <button
          onClick={() => { setActiveTab('hero'); setShowJson(false); }}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'hero'
              ? 'border-[#a67e2a] text-[#a67e2a]'
              : 'border-transparent text-neutral-500 hover:text-neutral-700'
          }`}
        >
          Header Beranda
        </button>
        <button
          onClick={() => { setActiveTab('achievements'); setShowJson(false); }}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'achievements'
              ? 'border-[#a67e2a] text-[#a67e2a]'
              : 'border-transparent text-neutral-500 hover:text-neutral-700'
          }`}
        >
          Pencapaian Kami
        </button>
        <button
          onClick={() => { setActiveTab('testimonials'); setShowJson(false); }}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'testimonials'
              ? 'border-[#a67e2a] text-[#a67e2a]'
              : 'border-transparent text-neutral-500 hover:text-neutral-700'
          }`}
        >
          Apa Kata Mereka (Testimoni)
        </button>
      </div>

      {showJson ? (
        <pre className="bg-[#faf9f5] border border-[#eae6dd] rounded-xl p-4 text-xs text-[#1c1515] overflow-auto max-h-[600px]">
          {JSON.stringify({ hero: heroData, achievements: achData, testimonials: testimonialsData }, null, 2)}
        </pre>
      ) : (
        <div className="space-y-6">
          {/* TAB 1: HERO / HEADER BERANDA */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              {/* Text fields */}
              <div className="bg-white border border-[#eae6dd] rounded-2xl p-6 space-y-5 shadow-sm">
                <h3 className="text-sm font-bold text-[#a67e2a] uppercase tracking-wider">Teks Utama</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-2">Teks Skrip (Kecil)</label>
                    <input
                      type="text"
                      value={heroData.scriptText || ''}
                      onChange={(e) => updateHeroField('scriptText', e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#faf9f5] border border-[#d2cbbe] rounded-xl text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-2">Teks Dekorasi</label>
                    <input
                      type="text"
                      value={heroData.decorativeText || ''}
                      onChange={(e) => updateHeroField('decorativeText', e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#faf9f5] border border-[#d2cbbe] rounded-xl text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-2">Judul Utama</label>
                  <textarea
                    value={heroData.mainTitle || ''}
                    onChange={(e) => updateHeroField('mainTitle', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-[#faf9f5] border border-[#d2cbbe] rounded-xl text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-2">Deskripsi</label>
                  <textarea
                    value={heroData.description || ''}
                    onChange={(e) => updateHeroField('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-[#faf9f5] border border-[#d2cbbe] rounded-xl text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-2">Teks Tombol Aksi</label>
                    <input
                      type="text"
                      value={heroData.ctaButtonText || ''}
                      onChange={(e) => updateHeroField('ctaButtonText', e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#faf9f5] border border-[#d2cbbe] rounded-xl text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-2">Tujuan Link Tombol</label>
                    <input
                      type="text"
                      value={heroData.ctaTarget || ''}
                      onChange={(e) => updateHeroField('ctaTarget', e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#faf9f5] border border-[#d2cbbe] rounded-xl text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                    />
                  </div>
                </div>
              </div>

              {/* Background photo */}
              <div className="bg-white border border-[#eae6dd] rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-[#a67e2a] uppercase tracking-wider mb-4">Gambar Unggulan (Foto)</h3>
                <ImageUploader
                  value={heroData.backgroundImage}
                  onChange={(url) => updateHeroField('backgroundImage', url)}
                  label="Unggah Foto Hero"
                />
              </div>

              {/* Stats */}
              <div className="bg-white border border-[#eae6dd] rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#a67e2a] uppercase tracking-wider">Statistik Angka</h3>
                  <button
                    onClick={() => {
                      setNewStat({ value: 0, suffix: '', label: '' });
                      setShowAddStatModal(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs bg-[#faf9f5] border border-[#d2cbbe] rounded-lg hover:bg-neutral-100 text-[#1c1515] font-semibold transition-colors"
                  >
                    <Plus size={14} /> Tambah Statistik
                  </button>
                </div>

                <div className="space-y-4">
                  {heroData.stats?.map((stat: any, i: number) => (
                    <div key={i} className="flex items-end gap-3 p-3 bg-[#faf9f5] rounded-xl border border-[#eae6dd]">
                      <div className="flex-1">
                        <label className="block text-[10px] uppercase text-neutral-500 mb-1">Angka</label>
                        <input
                          type="number"
                          value={stat.value}
                          onChange={(e) => updateHeroStat(i, 'value', Number(e.target.value))}
                          className="w-full px-3 py-2 bg-white border border-[#d2cbbe] rounded-lg text-[#1c1515] text-xs focus:outline-none"
                        />
                      </div>
                      <div className="w-24">
                        <label className="block text-[10px] uppercase text-neutral-500 mb-1">Akhiran (Suffix)</label>
                        <input
                          type="text"
                          value={stat.suffix || ''}
                          onChange={(e) => updateHeroStat(i, 'suffix', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#d2cbbe] rounded-lg text-[#1c1515] text-xs focus:outline-none"
                        />
                      </div>
                      <div className="flex-[2_2_0%]">
                        <label className="block text-[10px] uppercase text-neutral-500 mb-1">Label</label>
                        <input
                          type="text"
                          value={stat.label || ''}
                          onChange={(e) => updateHeroStat(i, 'label', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#d2cbbe] rounded-lg text-[#1c1515] text-xs focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={() => removeHeroStat(i)}
                        className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACHIEVEMENTS / PENCAPAIAN (NO FOTO, PAKE IKON) */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <div className="bg-white border border-[#eae6dd] rounded-2xl p-6 space-y-4 shadow-sm">
                <h3 className="text-sm font-bold text-[#a67e2a] uppercase tracking-wider">Judul Section</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-2">Judul Utama</label>
                    <input
                      type="text"
                      value={achData.mainTitle || ''}
                      onChange={e => updateAchField('mainTitle', e.target.value)}
                      className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-xl px-4 py-2.5 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-2">Subjudul / Deskripsi Pengantar</label>
                    <textarea
                      value={achData.subtitle || ''}
                      onChange={e => updateAchField('subtitle', e.target.value)}
                      rows={3}
                      className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-xl px-4 py-2.5 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a] resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#eae6dd] rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#eae6dd] pb-3">
                  <h3 className="text-sm font-bold text-[#a67e2a] uppercase tracking-wider">Daftar Pencapaian ({achData.items?.length || 0})</h3>
                  <button
                    onClick={() => {
                      setNewAchItem({ value: '', label: '', description: '', icon: 'Users' });
                      setShowAddAchModal(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs bg-[#faf9f5] border border-[#d2cbbe] rounded-lg hover:bg-neutral-100 text-[#1c1515] font-semibold transition-colors"
                  >
                    <Plus size={14} /> Tambah Baru
                  </button>
                </div>

                <div className="space-y-4">
                  {achData.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex flex-col md:flex-row md:items-end gap-3 p-4 bg-[#faf9f5] rounded-xl border border-[#eae6dd] relative">
                      <div className="w-full md:w-36">
                        <label className="block text-neutral-500 text-[10px] uppercase font-bold mb-1">Ikon</label>
                        <select
                          value={item.icon}
                          onChange={e => updateAchItem(idx, 'icon', e.target.value)}
                          className="w-full bg-white border border-[#d2cbbe] rounded-lg px-2.5 py-1.5 text-[#1c1515] text-xs focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                        >
                          <option value="Users">Users (Alumni/Anggota)</option>
                          <option value="FileText">FileText (Riset/Publikasi)</option>
                          <option value="Calendar">Calendar (Kegiatan)</option>
                          <option value="Award">Award (Penghargaan)</option>
                          <option value="TrendingUp">TrendingUp (Perkembangan)</option>
                          <option value="Handshake">Handshake (Kemitraan)</option>
                        </select>
                      </div>
                      <div className="w-full md:w-32">
                        <label className="block text-neutral-500 text-[10px] uppercase font-bold mb-1">Angka (Value)</label>
                        <input
                          type="text"
                          value={item.value}
                          onChange={e => updateAchItem(idx, 'value', e.target.value)}
                          placeholder="Misal: 500+"
                          className="w-full bg-white border border-[#d2cbbe] rounded-lg px-3 py-1.5 text-[#1c1515] text-xs focus:outline-none"
                        />
                      </div>
                      <div className="w-full md:w-44">
                        <label className="block text-neutral-500 text-[10px] uppercase font-bold mb-1">Label</label>
                        <input
                          type="text"
                          value={item.label}
                          onChange={e => updateAchItem(idx, 'label', e.target.value)}
                          placeholder="Misal: Alumni Aktif"
                          className="w-full bg-white border border-[#d2cbbe] rounded-lg px-3 py-1.5 text-[#1c1515] text-xs focus:outline-none"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-neutral-500 text-[10px] uppercase font-bold mb-1">Deskripsi</label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={e => updateAchItem(idx, 'description', e.target.value)}
                          className="w-full bg-white border border-[#d2cbbe] rounded-lg px-3 py-1.5 text-[#1c1515] text-xs focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-1 justify-end mt-2 md:mt-0 flex-shrink-0">
                        <button
                          onClick={() => moveAchItem(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 text-neutral-400 hover:text-neutral-600 disabled:opacity-30"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          onClick={() => moveAchItem(idx, 'down')}
                          disabled={idx === achData.items.length - 1}
                          className="p-1.5 text-neutral-400 hover:text-neutral-600 disabled:opacity-30"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          onClick={() => removeAchItem(idx)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TESTIMONIALS / APA KATA MEREKA (PAKE FOTO AVATAR) */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="bg-white border border-[#eae6dd] rounded-2xl p-6 space-y-4 shadow-sm">
                <h3 className="text-sm font-bold text-[#a67e2a] uppercase tracking-wider">Judul Section</h3>
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-2">Judul Utama</label>
                  <input
                    type="text"
                    value={testimonialsData.testimonialsMainTitle || ''}
                    onChange={e => updateTestimonialField('testimonialsMainTitle', e.target.value)}
                    className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-xl px-4 py-2.5 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                  />
                </div>
              </div>

              <div className="bg-white border border-[#eae6dd] rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#eae6dd] pb-3">
                  <h3 className="text-sm font-bold text-[#a67e2a] uppercase tracking-wider">Daftar Testimoni ({testimonialsData.testimonials?.length || 0})</h3>
                  <button
                    onClick={() => {
                      setNewTestimonial({ name: '', role: '', text: '', rating: 5, image: '' });
                      setShowAddTestimonialModal(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#faf9f5] border border-[#d2cbbe] rounded-lg hover:bg-neutral-100 text-[#1c1515] font-semibold transition-colors"
                  >
                    <Plus size={14} /> Tambah Testimoni
                  </button>
                </div>

                <div className="space-y-4">
                  {testimonialsData.testimonials?.map((t: any, i: number) => (
                    <div key={i} className="border border-[#eae6dd] rounded-2xl p-4 bg-[#faf9f5] space-y-4 relative">
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={() => removeTestimonial(i)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-neutral-500 mb-1">Nama</label>
                          <input
                            type="text"
                            value={t.name || ''}
                            onChange={e => updateTestimonialItem(i, 'name', e.target.value)}
                            className="w-full bg-white border border-[#d2cbbe] rounded-lg px-3 py-1.5 text-[#1c1515] text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-neutral-500 mb-1">Jabatan / Role</label>
                          <input
                            type="text"
                            value={t.role || ''}
                            onChange={e => updateTestimonialItem(i, 'role', e.target.value)}
                            className="w-full bg-white border border-[#d2cbbe] rounded-lg px-3 py-1.5 text-[#1c1515] text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-neutral-500 mb-1">Rating Bintang (1-5)</label>
                          <input
                            type="number"
                            min={1}
                            max={5}
                            value={t.rating || 5}
                            onChange={e => updateTestimonialItem(i, 'rating', parseInt(e.target.value))}
                            className="w-full bg-white border border-[#d2cbbe] rounded-lg px-3 py-1.5 text-[#1c1515] text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-neutral-500 mb-1">Foto Avatar</label>
                          <ImageUploader
                            value={t.image}
                            onChange={(url) => updateTestimonialItem(i, 'image', url)}
                            label="Unggah Foto Profil"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-neutral-500 mb-1">Isi Testimoni</label>
                        <textarea
                          value={t.text || ''}
                          onChange={e => updateTestimonialItem(i, 'text', e.target.value)}
                          rows={2}
                          className="w-full bg-white border border-[#d2cbbe] rounded-lg px-3 py-1.5 text-[#1c1515] text-xs focus:outline-none resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="pt-8 border-t border-[#eae6dd] flex justify-center">
            <button
              onClick={() => setShowJson(!showJson)}
              className="text-xs text-neutral-400 hover:text-[#a67e2a] transition-colors"
            >
              Mode Developer (JSON)
            </button>
          </div>
        </div>
      )}

      {/* Hero Stat Modal */}
      {showAddStatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white border border-[#eae6dd] rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-[#1c1515]">Tambah Statistik Beranda</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Value (Angka)</label>
                <input
                  type="number"
                  value={newStat.value}
                  onChange={(e) => setNewStat({ ...newStat, value: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#faf9f5] border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Suffix (Akhiran)</label>
                <input
                  type="text"
                  value={newStat.suffix}
                  onChange={(e) => setNewStat({ ...newStat, suffix: e.target.value })}
                  placeholder="Misal: + atau %"
                  className="w-full px-3 py-2 bg-[#faf9f5] border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Label</label>
                <input
                  type="text"
                  value={newStat.label}
                  onChange={(e) => setNewStat({ ...newStat, label: e.target.value })}
                  placeholder="Misal: Anggota Aktif"
                  className="w-full px-3 py-2 bg-[#faf9f5] border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-[#eae6dd]">
              <button
                type="button"
                onClick={() => setShowAddStatModal(false)}
                className="px-4 py-2 text-sm bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAddStat}
                className="px-4 py-2 text-sm bg-gradient-to-r from-[#dcae44] to-[#b88c2b] text-white font-bold rounded-lg"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Item Modal */}
      {showAddAchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white border border-[#eae6dd] rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-[#1c1515]">Tambah Pencapaian Baru</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-neutral-500 text-xs mb-1">Ikon Pencapaian</label>
                <select
                  value={newAchItem.icon}
                  onChange={e => setNewAchItem({ ...newAchItem, icon: e.target.value })}
                  className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-xl px-3 py-2 text-[#1c1515] text-sm focus:outline-none"
                >
                  <option value="Users">Users (Alumni/Anggota)</option>
                  <option value="FileText">FileText (Riset/Publikasi)</option>
                  <option value="Calendar">Calendar (Kegiatan)</option>
                  <option value="Award">Award (Penghargaan)</option>
                  <option value="TrendingUp">TrendingUp (Perkembangan)</option>
                  <option value="Handshake">Handshake (Kemitraan)</option>
                </select>
              </div>
              <div>
                <label className="block text-neutral-500 text-xs mb-1">Angka / Nilai Pencapaian</label>
                <input
                  type="text"
                  value={newAchItem.value}
                  onChange={e => setNewAchItem({ ...newAchItem, value: e.target.value })}
                  placeholder="Misal: 500+, 30+, atau 7"
                  className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-xl px-3 py-2 text-[#1c1515] text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-500 text-xs mb-1">Label Pencapaian</label>
                <input
                  type="text"
                  value={newAchItem.label}
                  onChange={e => setNewAchItem({ ...newAchItem, label: e.target.value })}
                  placeholder="Misal: Alumni Aktif"
                  className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-xl px-3 py-2 text-[#1c1515] text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-500 text-xs mb-1">Deskripsi Singkat</label>
                <input
                  type="text"
                  value={newAchItem.description}
                  onChange={e => setNewAchItem({ ...newAchItem, description: e.target.value })}
                  placeholder="Keterangan tambahan..."
                  className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-xl px-3 py-2 text-[#1c1515] text-sm focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-[#eae6dd]">
              <button
                type="button"
                onClick={() => setShowAddAchModal(false)}
                className="px-4 py-2 text-sm bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAddAchItem}
                className="px-4 py-2 text-sm bg-gradient-to-r from-[#dcae44] to-[#b88c2b] text-white font-bold rounded-lg"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Testimonial Modal */}
      {showAddTestimonialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white border border-[#eae6dd] rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-[#1c1515]">Tambah Testimoni Baru</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-neutral-500 text-xs mb-1">Foto Avatar</label>
                <ImageUploader
                  value={newTestimonial.image}
                  onChange={(url) => setNewTestimonial({ ...newTestimonial, image: url })}
                  label="Unggah Foto Profil"
                />
              </div>
              <div>
                <label className="block text-neutral-500 text-xs mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={newTestimonial.name}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                  placeholder="Nama pemberi testimoni..."
                  className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-xl px-3 py-2 text-[#1c1515] text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-500 text-xs mb-1">Jabatan / Keterangan</label>
                <input
                  type="text"
                  value={newTestimonial.role}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                  placeholder="Misal: Alumni Angkatan 2020..."
                  className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-xl px-3 py-2 text-[#1c1515] text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-500 text-xs mb-1">Rating Bintang (1-5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={newTestimonial.rating}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: Number(e.target.value) })}
                  className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-xl px-3 py-2 text-[#1c1515] text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-500 text-xs mb-1">Isi Testimoni</label>
                <textarea
                  value={newTestimonial.text}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })}
                  placeholder="Tuliskan testimoni..."
                  rows={3}
                  className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-xl px-3 py-2 text-[#1c1515] text-sm focus:outline-none resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-[#eae6dd]">
              <button
                type="button"
                onClick={() => setShowAddTestimonialModal(false)}
                className="px-4 py-2 text-sm bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAddTestimonial}
                className="px-4 py-2 text-sm bg-gradient-to-r from-[#dcae44] to-[#b88c2b] text-white font-bold rounded-lg"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
