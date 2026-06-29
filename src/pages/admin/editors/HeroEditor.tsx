import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Loader2, ExternalLink } from 'lucide-react';
import { getContent, saveContent } from '../lib/adminApi';
import { heroConfig, type HeroConfig } from '../../../config';
import { ImageUploader } from '../components/ImageUploader';
import { toast } from 'sonner';

export function HeroEditor({ setIsDirty }: { setIsDirty?: (dirty: boolean) => void }) {
  const [data, setData] = useState<HeroConfig>({ ...heroConfig });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStat, setNewStat] = useState({ value: 0, suffix: '', label: '' });

  useEffect(() => {
    (async () => {
      try {
        const res = await getContent<any>('hero');
        if (res && res.content) setData(res.content);
      } catch (err: any) {
        toast.error('Gagal memuat data Hero Section dari server.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveContent('hero', data);
      setIsDirty?.(false);
      toast.success('Berhasil disimpan! Perubahan sudah tayang di website.');
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan data.');
    } finally {
      setSaving(false);
    }
  };

  const updateField = <K extends keyof HeroConfig>(key: K, value: HeroConfig[K]) => {
    setIsDirty?.(true);
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const updateStat = (index: number, field: string, value: any) => {
    setIsDirty?.(true);
    const updated = [...data.stats];
    updated[index] = { ...updated[index], [field]: value };
    setData((prev) => ({ ...prev, stats: updated }));
  };

  const handleConfirmAddStat = () => {
    if (!newStat.label) {
      alert('Label statistik harus diisi!');
      return;
    }
    setIsDirty?.(true);
    setData((prev) => ({
      ...prev,
      stats: [...prev.stats, { ...newStat }],
    }));
    setShowAddModal(false);
  };

  const removeStat = (index: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus statistik ini?")) {
      return;
    }
    setIsDirty?.(true);
    setData((prev) => ({ ...prev, stats: prev.stats.filter((_, i) => i !== index) }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="text-[#a67e2a] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1c1515]">Hero Section (Beranda)</h2>
          <p className="text-sm text-neutral-500 mt-1">Edit konten utama yang pertama kali dilihat pengunjung</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none flex justify-center items-center gap-2 px-3 py-2.5 md:py-2 text-sm bg-white border border-[#d2cbbe] rounded-xl hover:bg-[#faf9f5] transition-colors text-[#1c1515]"
            title="Buka website di tab baru untuk melihat perubahan"
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

      {showJson ? (
        <pre className="bg-[#faf9f5] border border-[#eae6dd] rounded-xl p-4 text-xs text-[#1c1515] overflow-auto max-h-[600px]">
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <div className="space-y-6">
          {/* Text fields */}
          <div className="bg-white border border-[#eae6dd] rounded-2xl p-6 space-y-5 shadow-sm">
            <h3 className="text-sm font-bold text-[#a67e2a] uppercase tracking-wider">Teks Utama</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-2" title="Teks kecil di atas judul utama">
                  Teks Skrip (Kecil) <span className="text-neutral-400 text-xs font-normal cursor-help">❔</span>
                </label>
                <input
                  type="text"
                  value={data.scriptText}
                  onChange={(e) => updateField('scriptText', e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#faf9f5] border border-[#d2cbbe] rounded-xl text-[#1c1515] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#a67e2a]/10 focus:border-[#a67e2a] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-2" title="Teks dekoratif pudar di latar belakang">
                  Teks Dekorasi <span className="text-neutral-400 text-xs font-normal cursor-help">❔</span>
                </label>
                <input
                  type="text"
                  value={data.decorativeText}
                  onChange={(e) => updateField('decorativeText', e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#faf9f5] border border-[#d2cbbe] rounded-xl text-[#1c1515] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#a67e2a]/10 focus:border-[#a67e2a] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-2" title="Judul paling besar di halaman utama">
                Judul Utama <span className="text-neutral-400 text-xs font-normal cursor-help">❔</span>
              </label>
              <textarea
                value={data.mainTitle}
                onChange={(e) => updateField('mainTitle', e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 bg-[#faf9f5] border border-[#d2cbbe] rounded-xl text-[#1c1515] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#a67e2a]/10 focus:border-[#a67e2a] transition-all resize-none"
                placeholder="Gunakan \n untuk baris baru"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-2" title="Deskripsi singkat paragraf di halaman utama">
                Deskripsi <span className="text-neutral-400 text-xs font-normal cursor-help">❔</span>
              </label>
              <textarea
                value={data.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 bg-[#faf9f5] border border-[#d2cbbe] rounded-xl text-[#1c1515] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#a67e2a]/10 focus:border-[#a67e2a] transition-all resize-none"
                placeholder="Masukkan paragraf deskripsi singkat..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-2" title="Teks yang muncul di tombol">
                  Teks Tombol Aksi <span className="text-neutral-400 text-xs font-normal cursor-help">❔</span>
                </label>
                <input
                  type="text"
                  value={data.ctaButtonText}
                  onChange={(e) => updateField('ctaButtonText', e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#faf9f5] border border-[#d2cbbe] rounded-xl text-[#1c1515] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#a67e2a]/10 focus:border-[#a67e2a] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-2" title="Tujuan saat tombol diklik. Gunakan # untuk bagian halaman (misal: #about), atau https:// untuk tautan luar">
                  Tujuan Link Tombol <span className="text-neutral-400 text-xs font-normal cursor-help">❔</span>
                </label>
                <input
                  type="text"
                  value={data.ctaTarget}
                  onChange={(e) => updateField('ctaTarget', e.target.value)}
                  placeholder="Misal: #about atau https://..."
                  className="w-full px-4 py-2.5 bg-[#faf9f5] border border-[#d2cbbe] rounded-xl text-[#1c1515] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#a67e2a]/10 focus:border-[#a67e2a] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Background image */}
          <div className="bg-white border border-[#eae6dd] rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-[#a67e2a] uppercase tracking-wider mb-4">Gambar Latar Belakang</h3>
            <ImageUploader
              value={data.backgroundImage}
              onChange={(url) => updateField('backgroundImage', url)}
              label=""
            />
          </div>

          {/* Stats */}
          <div className="bg-white border border-[#eae6dd] rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#a67e2a] uppercase tracking-wider">Statistik</h3>
               <button
                onClick={() => {
                  setNewStat({ value: 0, suffix: '', label: '' });
                  setShowAddModal(true);
                }}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-[#faf9f5] border border-[#d2cbbe] rounded-lg hover:bg-neutral-100 text-[#1c1515] font-semibold transition-colors"
              >
                <Plus size={14} /> Tambah
              </button>
            </div>

            {data.stats.map((stat, i) => (
              <div key={i} className="flex items-end gap-3 p-3 bg-[#faf9f5] rounded-xl border border-[#eae6dd]">
                <div className="flex-1">
                  <label className="block text-xs text-neutral-500 mb-1">Value</label>
                  <input
                    type="number"
                    value={stat.value}
                    onChange={(e) => updateStat(i, 'value', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                  />
                </div>
                <div className="w-20">
                  <label className="block text-xs text-neutral-500 mb-1">Suffix</label>
                  <input
                    type="text"
                    value={stat.suffix}
                    onChange={(e) => updateStat(i, 'suffix', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-neutral-500 mb-1">Label</label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => updateStat(i, 'label', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                  />
                </div>
                <button
                  onClick={() => removeStat(i)}
                  className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

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
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white border border-[#eae6dd] rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-[#1c1515]">Tambah Statistik</h3>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Value (Angka)</label>
                <input
                  type="number"
                  value={newStat.value}
                  onChange={(e) => setNewStat({ ...newStat, value: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#faf9f5] border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Suffix (Akhiran, misal: +, %)</label>
                <input
                  type="text"
                  value={newStat.suffix}
                  onChange={(e) => setNewStat({ ...newStat, suffix: e.target.value })}
                  placeholder="Misal: + atau %"
                  className="w-full px-3 py-2 bg-[#faf9f5] border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Label (Deskripsi)</label>
                <input
                  type="text"
                  value={newStat.label}
                  onChange={(e) => setNewStat({ ...newStat, label: e.target.value })}
                  placeholder="Misal: Anggota Aktif"
                  className="w-full px-3 py-2 bg-[#faf9f5] border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-[#eae6dd]">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAddStat}
                className="px-4 py-2 text-sm bg-gradient-to-r from-[#dcae44] to-[#b88c2b] text-white font-bold rounded-lg transition-colors"
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
