import { useState, useEffect } from 'react';
import { getContent, saveContent } from '../lib/adminApi';
import { wineShowcaseConfig } from '../../../config';
import { Save, Plus, Trash2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { ImageUploader } from '../components/ImageUploader';

export function ResearchEditor() {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [showAddProgramModal, setShowAddProgramModal] = useState(false);
  const [newProgram, setNewProgram] = useState({
    name: '', subtitle: '', year: '', image: '', description: '', tastingNotes: '',
    alcohol: 'Semua Level', temperature: 'Online & Offline', aging: 'Bulanan',
    filter: '', glowColor: 'bg-blue-900/20'
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await getContent('research');
        setData(res.content || wineShowcaseConfig);
      } catch {
        setData(wineShowcaseConfig);
      }
    })();
  }, []);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveContent('research', data);
      showToast('success', 'Data riset berhasil disimpan!');
    } catch {
      showToast('error', 'Gagal menyimpan data.');
    }
    setSaving(false);
  };

  if (!data) return <div className="text-white">Memuat...</div>;

  const updateField = (key: string, value: any) => setData({ ...data, [key]: value });

  const updateWine = (index: number, key: string, value: any) => {
    const wines = [...data.wines];
    wines[index] = { ...wines[index], [key]: value };
    setData({ ...data, wines });
  };

  const handleConfirmAddProgram = () => {
    if (!newProgram.name) {
      alert('Nama program harus diisi!');
      return;
    }
    setData({
      ...data,
      wines: [...data.wines, { id: Date.now().toString(), ...newProgram }],
    });
    setShowAddProgramModal(false);
  };

  const removeWine = (index: number) => {
    setData({ ...data, wines: data.wines.filter((_: any, i: number) => i !== index) });
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg flex items-center gap-2 text-sm ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'} text-white shadow-lg`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Editor Riset & Program</h1>
          <p className="text-slate-400 text-sm mt-1">Kelola program riset dan edukasi pasar modal</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan
        </button>
      </div>

      {/* Section Info */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-4">
        <h2 className="text-white font-semibold">Info Section</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-400 text-xs mb-1">Script Text</label>
            <input type="text" value={data.scriptText || ''} onChange={e => updateField('scriptText', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
          </div>
          <div>
            <label className="block text-slate-400 text-xs mb-1">Subtitle</label>
            <input type="text" value={data.subtitle || ''} onChange={e => updateField('subtitle', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
          </div>
          <div>
            <label className="block text-slate-400 text-xs mb-1">Main Title</label>
            <input type="text" value={data.mainTitle || ''} onChange={e => updateField('mainTitle', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
          </div>
        </div>
      </div>

      {/* Programs List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold">Program Riset ({data.wines?.length || 0})</h2>
          <button
            onClick={() => {
              setNewProgram({
                name: '', subtitle: '', year: '', image: '', description: '', tastingNotes: '',
                alcohol: 'Semua Level', temperature: 'Online & Offline', aging: 'Bulanan',
                filter: '', glowColor: 'bg-blue-900/20'
              });
              setShowAddProgramModal(true);
            }}
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-sm"
          >
            <Plus className="w-4 h-4" /> Tambah
          </button>
        </div>

        {data.wines?.map((wine: any, i: number) => (
          <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 font-medium text-sm">Program #{i + 1}</span>
              <button onClick={() => removeWine(i)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 text-xs mb-1">Nama</label>
                <input type="text" value={wine.name || ''} onChange={e => updateWine(i, 'name', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-slate-400 text-xs mb-1">Subtitle</label>
                <input type="text" value={wine.subtitle || ''} onChange={e => updateWine(i, 'subtitle', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-slate-400 text-xs mb-1">Nomor/Year</label>
                <input type="text" value={wine.year || ''} onChange={e => updateWine(i, 'year', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-slate-400 text-xs mb-1">Deskripsi</label>
              <textarea value={wine.description || ''} onChange={e => updateWine(i, 'description', e.target.value)} rows={2} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 text-xs mb-1">Tasting Notes / Tags</label>
                <input type="text" value={wine.tastingNotes || ''} onChange={e => updateWine(i, 'tastingNotes', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
              <div>
                <ImageUploader
                  value={wine.image || ''}
                  onChange={(url) => updateWine(i, 'image', url)}
                  label="Gambar Program"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quote */}
      {data.quote && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-3">
          <h2 className="text-white font-semibold">Quote</h2>
          <div>
            <label className="block text-slate-400 text-xs mb-1">Teks Quote</label>
            <textarea value={data.quote.text || ''} onChange={e => updateField('quote', { ...data.quote, text: e.target.value })} rows={2} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 text-xs mb-1">Attribution</label>
              <input type="text" value={data.quote.attribution || ''} onChange={e => updateField('quote', { ...data.quote, attribution: e.target.value })} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
            </div>
            <div>
              <label className="block text-slate-400 text-xs mb-1">Prefix</label>
              <input type="text" value={data.quote.prefix || ''} onChange={e => updateField('quote', { ...data.quote, prefix: e.target.value })} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
            </div>
          </div>
        </div>
      )}
      {showAddProgramModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4 my-8 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-white">Tambah Program Riset</h3>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <ImageUploader
                value={newProgram.image}
                onChange={(url) => setNewProgram({ ...newProgram, image: url })}
                label="Gambar Utama Program"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Nama Program</label>
                  <input
                    type="text"
                    value={newProgram.name}
                    onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
                    placeholder="Nama program..."
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Sub-Judul</label>
                  <input
                    type="text"
                    value={newProgram.subtitle}
                    onChange={(e) => setNewProgram({ ...newProgram, subtitle: e.target.value })}
                    placeholder="Misal: SiPalingSaham"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Nomor / Urutan</label>
                  <input
                    type="text"
                    value={newProgram.year}
                    onChange={(e) => setNewProgram({ ...newProgram, year: e.target.value })}
                    placeholder="Misal: 01, 02"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Tags / Tasting Notes</label>
                  <input
                    type="text"
                    value={newProgram.tastingNotes}
                    onChange={(e) => setNewProgram({ ...newProgram, tastingNotes: e.target.value })}
                    placeholder="Koma sebagai pemisah, misal: Saham, Investasi"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Level (alcohol)</label>
                  <input
                    type="text"
                    value={newProgram.alcohol}
                    onChange={(e) => setNewProgram({ ...newProgram, alcohol: e.target.value })}
                    placeholder="Misal: Semua Level, Intermediate+"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Frekuensi / Hari (temperature)</label>
                  <input
                    type="text"
                    value={newProgram.temperature}
                    onChange={(e) => setNewProgram({ ...newProgram, temperature: e.target.value })}
                    placeholder="Misal: Setiap Rabu, Rilis Bulanan"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Waktu / Jadwal (aging)</label>
                  <input
                    type="text"
                    value={newProgram.aging}
                    onChange={(e) => setNewProgram({ ...newProgram, aging: e.target.value })}
                    placeholder="Misal: 16.00 – 17.00, Per Emiten"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Deskripsi</label>
                <textarea
                  value={newProgram.description}
                  onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
                  rows={3}
                  placeholder="Deskripsi lengkap program..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddProgramModal(false)}
                className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAddProgram}
                className="px-4 py-2 text-sm bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-lg transition-colors"
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
