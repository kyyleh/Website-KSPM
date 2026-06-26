import { useState, useEffect } from 'react';
import { getContent, saveContent } from '../lib/adminApi';
import { wineShowcaseConfig } from '../../../config';
import { Save, Plus, Trash2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export function ResearchEditor() {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getContent('research');
        setData(res.data || wineShowcaseConfig);
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

  const addWine = () => {
    setData({
      ...data,
      wines: [...data.wines, { id: Date.now().toString(), name: '', subtitle: '', year: '', image: '', description: '', tastingNotes: '', alcohol: '', temperature: '', aging: '', filter: '', glowColor: 'bg-blue-900/20' }],
    });
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
          <button onClick={addWine} className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-sm"><Plus className="w-4 h-4" /> Tambah</button>
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
                <label className="block text-slate-400 text-xs mb-1">Image URL</label>
                <input type="text" value={wine.image || ''} onChange={e => updateWine(i, 'image', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-slate-400 text-xs mb-1">Tasting Notes / Tags</label>
                <input type="text" value={wine.tastingNotes || ''} onChange={e => updateWine(i, 'tastingNotes', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
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
    </div>
  );
}
