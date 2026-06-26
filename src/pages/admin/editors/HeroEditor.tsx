import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Loader2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { getContent, saveContent } from '../lib/adminApi';
import { heroConfig, type HeroConfig } from '../../../config';
import { ImageUploader } from '../components/ImageUploader';

export function HeroEditor({ setIsDirty }: { setIsDirty?: (dirty: boolean) => void }) {
  const [data, setData] = useState<HeroConfig>({ ...heroConfig });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showJson, setShowJson] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getContent<HeroConfig>('hero');
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
      await saveContent('hero', data);
      setIsDirty?.(false);
      showToast('success', 'Berhasil disimpan! Perubahan sudah tayang di website.');
    } catch (err: any) {
      showToast('error', err.message || 'Gagal menyimpan');
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

  const addStat = () => {
    setIsDirty?.(true);
    setData((prev) => ({
      ...prev,
      stats: [...prev.stats, { value: 0, suffix: '', label: '' }],
    }));
  };

  const removeStat = (index: number) => {
    setIsDirty?.(true);
    setData((prev) => ({ ...prev, stats: prev.stats.filter((_, i) => i !== index) }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-fade-up ${
            toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Hero Section (Beranda)</h2>
          <p className="text-sm text-slate-400 mt-1">Edit konten utama yang pertama kali dilihat pengunjung</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none flex justify-center items-center gap-2 px-3 py-2.5 md:py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors text-slate-300"
            title="Buka website di tab baru untuk melihat perubahan"
          >
            <ExternalLink size={16} />
            Lihat Web
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 md:flex-none flex justify-center items-center gap-2 px-4 py-2.5 md:py-2 bg-amber-500 text-slate-900 font-semibold text-sm rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-60"
          >
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
        <div className="space-y-6">
          {/* Text fields */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">Teks Utama</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2" title="Teks kecil di atas judul utama">
                  Teks Skrip (Kecil) <span className="text-slate-500 text-xs font-normal cursor-help">❔</span>
                </label>
                <input
                  type="text"
                  value={data.scriptText}
                  onChange={(e) => updateField('scriptText', e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2" title="Teks dekoratif pudar di latar belakang">
                  Teks Dekorasi <span className="text-slate-500 text-xs font-normal cursor-help">❔</span>
                </label>
                <input
                  type="text"
                  value={data.decorativeText}
                  onChange={(e) => updateField('decorativeText', e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2" title="Judul paling besar di halaman utama">
                Judul Utama <span className="text-slate-500 text-xs font-normal cursor-help">❔</span>
              </label>
              <textarea
                value={data.mainTitle}
                onChange={(e) => updateField('mainTitle', e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 resize-none"
                placeholder="Gunakan \n untuk baris baru"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2" title="Teks yang muncul di tombol">
                  Teks Tombol Aksi <span className="text-slate-500 text-xs font-normal cursor-help">❔</span>
                </label>
                <input
                  type="text"
                  value={data.ctaButtonText}
                  onChange={(e) => updateField('ctaButtonText', e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2" title="Tujuan saat tombol diklik. Gunakan # untuk bagian halaman (misal: #about), atau https:// untuk tautan luar">
                  Tujuan Link Tombol <span className="text-slate-500 text-xs font-normal cursor-help">❔</span>
                </label>
                <input
                  type="text"
                  value={data.ctaTarget}
                  onChange={(e) => updateField('ctaTarget', e.target.value)}
                  placeholder="Misal: #about atau https://..."
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                />
              </div>
            </div>
          </div>

          {/* Background image */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-4">Gambar Latar Belakang</h3>
            <ImageUploader
              value={data.backgroundImage}
              onChange={(url) => updateField('backgroundImage', url)}
              label=""
            />
          </div>

          {/* Stats */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">Statistik</h3>
              <button
                onClick={addStat}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <Plus size={14} /> Tambah
              </button>
            </div>

            {data.stats.map((stat, i) => (
              <div key={i} className="flex items-end gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <div className="flex-1">
                  <label className="block text-xs text-slate-400 mb-1">Value</label>
                  <input
                    type="number"
                    value={stat.value}
                    onChange={(e) => updateStat(i, 'value', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                  />
                </div>
                <div className="w-20">
                  <label className="block text-xs text-slate-400 mb-1">Suffix</label>
                  <input
                    type="text"
                    value={stat.suffix}
                    onChange={(e) => updateStat(i, 'suffix', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-slate-400 mb-1">Label</label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => updateStat(i, 'label', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                  />
                </div>
                <button
                  onClick={() => removeStat(i)}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
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
