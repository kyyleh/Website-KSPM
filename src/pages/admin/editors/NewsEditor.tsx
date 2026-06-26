import { useState, useEffect } from 'react';
import { getContent, saveContent } from '../lib/adminApi';
import { newsConfig } from '../../../config';
import { Save, Plus, Trash2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export function NewsEditor() {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getContent('news');
        setData(res.data || newsConfig);
      } catch {
        setData(newsConfig);
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
      await saveContent('news', data);
      showToast('success', 'Data berita berhasil disimpan!');
    } catch {
      showToast('error', 'Gagal menyimpan data.');
    }
    setSaving(false);
  };

  if (!data) return <div className="text-white">Memuat...</div>;

  const updateArticle = (index: number, key: string, value: any) => {
    const articles = [...data.articles];
    articles[index] = { ...articles[index], [key]: value };
    setData({ ...data, articles });
  };

  const addArticle = () => {
    setData({
      ...data,
      articles: [...data.articles, { id: Date.now(), image: '', title: '', excerpt: '', date: '', category: '', url: '' }],
    });
  };

  const removeArticle = (index: number) => {
    setData({ ...data, articles: data.articles.filter((_: any, i: number) => i !== index) });
  };

  const updateTestimonial = (index: number, key: string, value: any) => {
    const testimonials = [...data.testimonials];
    testimonials[index] = { ...testimonials[index], [key]: value };
    setData({ ...data, testimonials });
  };

  const addTestimonial = () => {
    setData({
      ...data,
      testimonials: [...(data.testimonials || []), { name: '', role: '', text: '', rating: 5, image: '' }],
    });
  };

  const removeTestimonial = (index: number) => {
    setData({ ...data, testimonials: data.testimonials.filter((_: any, i: number) => i !== index) });
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
          <h1 className="text-2xl font-bold text-white">Editor Berita & Artikel</h1>
          <p className="text-slate-400 text-sm mt-1">Kelola artikel berita dan testimoni</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan
        </button>
      </div>

      {/* Articles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold">Artikel ({data.articles?.length || 0})</h2>
          <button onClick={addArticle} className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-sm"><Plus className="w-4 h-4" /> Tambah Artikel</button>
        </div>

        {data.articles?.map((article: any, i: number) => (
          <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 font-medium text-sm">Artikel #{i + 1}</span>
              <button onClick={() => removeArticle(i)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 text-xs mb-1">Judul</label>
                <input type="text" value={article.title || ''} onChange={e => updateArticle(i, 'title', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-slate-400 text-xs mb-1">Kategori</label>
                <input type="text" value={article.category || ''} onChange={e => updateArticle(i, 'category', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-slate-400 text-xs mb-1">Ringkasan</label>
              <textarea value={article.excerpt || ''} onChange={e => updateArticle(i, 'excerpt', e.target.value)} rows={2} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 text-xs mb-1">Tanggal</label>
                <input type="text" value={article.date || ''} onChange={e => updateArticle(i, 'date', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-slate-400 text-xs mb-1">Image URL</label>
                <input type="text" value={article.image || ''} onChange={e => updateArticle(i, 'image', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-slate-400 text-xs mb-1">Link URL</label>
                <input type="text" value={article.url || ''} onChange={e => updateArticle(i, 'url', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold">Testimoni ({data.testimonials?.length || 0})</h2>
          <button onClick={addTestimonial} className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-sm"><Plus className="w-4 h-4" /> Tambah Testimoni</button>
        </div>

        {data.testimonials?.map((t: any, i: number) => (
          <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 font-medium text-sm">Testimoni #{i + 1}</span>
              <button onClick={() => removeTestimonial(i)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 text-xs mb-1">Nama</label>
                <input type="text" value={t.name || ''} onChange={e => updateTestimonial(i, 'name', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-slate-400 text-xs mb-1">Role</label>
                <input type="text" value={t.role || ''} onChange={e => updateTestimonial(i, 'role', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-slate-400 text-xs mb-1">Rating (1-5)</label>
                <input type="number" min={1} max={5} value={t.rating || 5} onChange={e => updateTestimonial(i, 'rating', parseInt(e.target.value))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-slate-400 text-xs mb-1">Teks Testimoni</label>
              <textarea value={t.text || ''} onChange={e => updateTestimonial(i, 'text', e.target.value)} rows={2} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
