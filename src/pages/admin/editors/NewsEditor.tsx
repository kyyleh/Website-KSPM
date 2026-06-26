import { useState, useEffect } from 'react';
import { getContent, saveContent } from '../lib/adminApi';
import { newsConfig } from '../../../config';
import { Save, Plus, Trash2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { ImageUploader } from '../components/ImageUploader';

export function NewsEditor() {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [showAddArticleModal, setShowAddArticleModal] = useState(false);
  const [newArticle, setNewArticle] = useState({ title: '', category: '', excerpt: '', date: '', image: '', url: '' });
  const [showAddTestimonialModal, setShowAddTestimonialModal] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({ name: '', role: '', text: '', rating: 5, image: '' });

  useEffect(() => {
    (async () => {
      try {
        const res = await getContent('news');
        setData(res.content || newsConfig);
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

  const handleConfirmAddArticle = () => {
    if (!newArticle.title) {
      alert('Judul artikel harus diisi!');
      return;
    }
    setData({
      ...data,
      articles: [...data.articles, { id: Date.now(), ...newArticle }],
    });
    setShowAddArticleModal(false);
  };

  const removeArticle = (index: number) => {
    setData({ ...data, articles: data.articles.filter((_: any, i: number) => i !== index) });
  };

  const updateTestimonial = (index: number, key: string, value: any) => {
    const testimonials = [...data.testimonials];
    testimonials[index] = { ...testimonials[index], [key]: value };
    setData({ ...data, testimonials });
  };

  const handleConfirmAddTestimonial = () => {
    if (!newTestimonial.name) {
      alert('Nama testimoni harus diisi!');
      return;
    }
    setData({
      ...data,
      testimonials: [...(data.testimonials || []), { ...newTestimonial }],
    });
    setShowAddTestimonialModal(false);
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
          <button
            onClick={() => {
              setNewArticle({ title: '', category: '', excerpt: '', date: '', image: '', url: '' });
              setShowAddArticleModal(true);
            }}
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-sm"
          >
            <Plus className="w-4 h-4" /> Tambah Artikel
          </button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 text-xs mb-1">Tanggal</label>
                <input type="text" value={article.date || ''} onChange={e => updateArticle(i, 'date', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-slate-400 text-xs mb-1">Link URL</label>
                <input type="text" value={article.url || ''} onChange={e => updateArticle(i, 'url', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
              <div className="md:col-span-2">
                <ImageUploader
                  value={article.image || ''}
                  onChange={(url) => updateArticle(i, 'image', url)}
                  label="Gambar Artikel"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold">Testimoni ({data.testimonials?.length || 0})</h2>
          <button
            onClick={() => {
              setNewTestimonial({ name: '', role: '', text: '', rating: 5, image: '' });
              setShowAddTestimonialModal(true);
            }}
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-sm"
          >
            <Plus className="w-4 h-4" /> Tambah Testimoni
          </button>
        </div>

        {data.testimonials?.map((t: any, i: number) => (
          <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 font-medium text-sm">Testimoni #{i + 1}</span>
              <button onClick={() => removeTestimonial(i)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-3">
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
              <div>
                <ImageUploader
                  value={t.image || ''}
                  onChange={(url) => updateTestimonial(i, 'image', url)}
                  label="Foto Testimoni"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {showAddArticleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4 my-8 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-white">Tambah Artikel Baru</h3>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <ImageUploader
                value={newArticle.image}
                onChange={(url) => setNewArticle({ ...newArticle, image: url })}
                label="Gambar Utama Artikel"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Judul Artikel</label>
                  <input
                    type="text"
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                    placeholder="Judul artikel berita..."
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Kategori</label>
                  <input
                    type="text"
                    value={newArticle.category}
                    onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                    placeholder="Misal: Finansial, Kegiatan"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Tanggal</label>
                  <input
                    type="text"
                    value={newArticle.date}
                    onChange={(e) => setNewArticle({ ...newArticle, date: e.target.value })}
                    placeholder="Misal: 27 Juni 2026"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Link URL</label>
                  <input
                    type="text"
                    value={newArticle.url}
                    onChange={(e) => setNewArticle({ ...newArticle, url: e.target.value })}
                    placeholder="Link baca selengkapnya..."
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Ringkasan (Excerpt)</label>
                <textarea
                  value={newArticle.excerpt}
                  onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                  rows={3}
                  placeholder="Ringkasan singkat isi artikel..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddArticleModal(false)}
                className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAddArticle}
                className="px-4 py-2 text-sm bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-lg transition-colors"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddTestimonialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4 my-8 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-white">Tambah Testimoni Baru</h3>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <ImageUploader
                value={newTestimonial.image}
                onChange={(url) => setNewTestimonial({ ...newTestimonial, image: url })}
                label="Foto Profil Testimoni"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Nama</label>
                    <input
                      type="text"
                      value={newTestimonial.name}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                      placeholder="Nama pemberi testimoni..."
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Role / Jabatan</label>
                    <input
                      type="text"
                      value={newTestimonial.role}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                      placeholder="Misal: Anggota KSPM, Mahasiswa"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Rating (1-5)</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={newTestimonial.rating}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Isi Testimoni</label>
                <textarea
                  value={newTestimonial.text}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })}
                  rows={3}
                  placeholder="Pesan testimoni..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddTestimonialModal(false)}
                className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAddTestimonial}
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
