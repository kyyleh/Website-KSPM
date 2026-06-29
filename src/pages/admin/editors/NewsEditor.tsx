import { useState, useEffect } from 'react';
import { getContent, saveContent } from '../lib/adminApi';
import { newsConfig } from '../../../config';
import { Save, Plus, Trash2, Loader2 } from 'lucide-react';
import { ImageUploader } from '../components/ImageUploader';
import { toast } from 'sonner';

export function NewsEditor({ setIsDirty }: { setIsDirty?: (dirty: boolean) => void }) {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [showAddArticleModal, setShowAddArticleModal] = useState(false);
  const [newArticle, setNewArticle] = useState({ title: '', category: 'Market Analysis', excerpt: '', date: '', image: '', url: '' });

  useEffect(() => {
    (async () => {
      try {
        const res = await getContent('news');
        setData(res.content || newsConfig);
      } catch (err: any) {
        toast.error('Gagal memuat data Berita dari server.');
        setData(newsConfig);
      }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveContent('news', data);
      setIsDirty?.(false);
      toast.success('Data berita berhasil disimpan!');
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan data.');
    }
    setSaving(false);
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="text-[#a67e2a] animate-spin" />
      </div>
    );
  }

  const updateArticle = (index: number, key: string, value: any) => {
    setIsDirty?.(true);
    const articles = [...data.articles];
    articles[index] = { ...articles[index], [key]: value };
    setData({ ...data, articles });
  };

  const handleConfirmAddArticle = () => {
    if (!newArticle.title) {
      alert('Judul artikel harus diisi!');
      return;
    }
    setIsDirty?.(true);
    setData({
      ...data,
      articles: [...data.articles, { id: Date.now(), ...newArticle }],
    });
    setShowAddArticleModal(false);
  };

  const removeArticle = (index: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      return;
    }
    setIsDirty?.(true);
    setData({ ...data, articles: data.articles.filter((_: any, i: number) => i !== index) });
  };

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1c1515]">Editor Berita & Artikel</h1>
          <p className="text-neutral-500 text-sm mt-1">Kelola artikel berita dan testimoni</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-gradient-to-r from-[#dcae44] to-[#b88c2b] text-white font-bold px-4 py-2 rounded-xl hover:brightness-105 transition-colors disabled:opacity-50 shadow-[0_4px_12px_rgba(195,147,49,0.15)]">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan
        </button>
      </div>

      {/* Section Info / Header */}
      <div className="bg-white border border-[#eae6dd] rounded-2xl p-6 space-y-4 shadow-sm">
        <h2 className="text-[#a67e2a] font-bold text-sm uppercase tracking-wider">Judul & Teks Section</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-neutral-500 text-xs mb-1">Teks Skrip (Kecil)</label>
            <input type="text" value={data.scriptText || ''} onChange={e => { setIsDirty?.(true); setData({ ...data, scriptText: e.target.value }); }} className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-lg px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
          </div>
          <div>
            <label className="block text-neutral-500 text-xs mb-1">Subjudul</label>
            <input type="text" value={data.subtitle || ''} onChange={e => { setIsDirty?.(true); setData({ ...data, subtitle: e.target.value }); }} className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-lg px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
          </div>
          <div>
            <label className="block text-neutral-500 text-xs mb-1">Judul Utama</label>
            <input type="text" value={data.mainTitle || ''} onChange={e => { setIsDirty?.(true); setData({ ...data, mainTitle: e.target.value }); }} className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-lg px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-neutral-500 text-xs mb-1">Teks Tombol "Lihat Semua Artikel"</label>
            <input type="text" value={data.viewAllText || ''} onChange={e => { setIsDirty?.(true); setData({ ...data, viewAllText: e.target.value }); }} className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-lg px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
          </div>
          <div>
            <label className="block text-neutral-500 text-xs mb-1">Teks Link "Selengkapnya"</label>
            <input type="text" value={data.readMoreText || ''} onChange={e => { setIsDirty?.(true); setData({ ...data, readMoreText: e.target.value }); }} className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-lg px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
          </div>
        </div>
      </div>

      {/* Articles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[#1c1515] font-bold">Artikel ({data.articles?.length || 0})</h2>
          <button
            onClick={() => {
              setNewArticle({ title: '', category: 'Market Analysis', excerpt: '', date: '', image: '', url: '' });
              setShowAddArticleModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#faf9f5] border border-[#d2cbbe] rounded-lg hover:bg-neutral-100 text-[#1c1515] font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah Artikel
          </button>
        </div>

        {data.articles?.map((article: any, i: number) => (
          <div key={i} className="bg-white border border-[#eae6dd] rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#eae6dd] pb-2">
              <span className="text-[#a67e2a] font-bold text-sm uppercase">Artikel #{i + 1}</span>
              <button onClick={() => removeArticle(i)} className="text-neutral-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-500 text-xs mb-1">Judul</label>
                <input type="text" value={article.title || ''} onChange={e => updateArticle(i, 'title', e.target.value)} className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-lg px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
              </div>
              <div>
                <label className="block text-neutral-500 text-xs mb-1">Kategori</label>
                <input
                  type="text"
                  list={`news-categories-${i}`}
                  value={article.category || ''}
                  onChange={e => updateArticle(i, 'category', e.target.value)}
                  placeholder="Pilih atau ketik kategori..."
                  className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-lg px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                />
                <datalist id={`news-categories-${i}`}>
                  <option value="Market Analysis">Analisis Pasar (Market Analysis)</option>
                  <option value="Regulation">Regulasi (Regulation)</option>
                  <option value="Education">Edukasi (Education)</option>
                  <option value="Video Review">Ulasan Video (Video Review)</option>
                  <option value="Pengumuman">Pengumuman</option>
                  <option value="Kegiatan">Kegiatan</option>
                </datalist>
              </div>
            </div>
            <div>
              <label className="block text-neutral-500 text-xs mb-1">Ringkasan</label>
              <textarea value={article.excerpt || ''} onChange={e => updateArticle(i, 'excerpt', e.target.value)} rows={2} className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-lg px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-500 text-xs mb-1">Tanggal</label>
                <input type="text" value={article.date || ''} onChange={e => updateArticle(i, 'date', e.target.value)} className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-lg px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
              </div>
              <div>
                <label className="block text-neutral-500 text-xs mb-1">Link URL</label>
                <input type="text" value={article.url || ''} onChange={e => updateArticle(i, 'url', e.target.value)} className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-lg px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
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
      {showAddArticleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white border border-[#eae6dd] rounded-2xl p-6 shadow-2xl space-y-4 my-8 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-[#1c1515]">Tambah Artikel Baru</h3>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <ImageUploader
                value={newArticle.image}
                onChange={(url) => setNewArticle({ ...newArticle, image: url })}
                label="Gambar Utama Artikel"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Judul Artikel</label>
                  <input
                    type="text"
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                    placeholder="Judul artikel berita..."
                    className="w-full px-3 py-2 bg-[#faf9f5] border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Kategori</label>
                  <input
                    type="text"
                    list="new-news-categories"
                    value={newArticle.category}
                    onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                    placeholder="Pilih atau ketik kategori..."
                    className="w-full px-3 py-2 bg-[#faf9f5] border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                  />
                  <datalist id="new-news-categories">
                    <option value="Market Analysis">Analisis Pasar (Market Analysis)</option>
                    <option value="Regulation">Regulasi (Regulation)</option>
                    <option value="Education">Edukasi (Education)</option>
                    <option value="Video Review">Ulasan Video (Video Review)</option>
                    <option value="Pengumuman">Pengumuman</option>
                    <option value="Kegiatan">Kegiatan</option>
                  </datalist>
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Tanggal</label>
                  <input
                    type="text"
                    value={newArticle.date}
                    onChange={(e) => setNewArticle({ ...newArticle, date: e.target.value })}
                    placeholder="Misal: 27 Juni 2026"
                    className="w-full px-3 py-2 bg-[#faf9f5] border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Link URL</label>
                  <input
                    type="text"
                    value={newArticle.url}
                    onChange={(e) => setNewArticle({ ...newArticle, url: e.target.value })}
                    placeholder="Link baca selengkapnya..."
                    className="w-full px-3 py-2 bg-[#faf9f5] border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-neutral-500 mb-1">Ringkasan (Excerpt)</label>
                <textarea
                  value={newArticle.excerpt}
                  onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                  rows={3}
                  placeholder="Ringkasan singkat isi artikel..."
                  className="w-full px-3 py-2 bg-[#faf9f5] border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a] resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-[#eae6dd]">
              <button
                type="button"
                onClick={() => setShowAddArticleModal(false)}
                className="px-4 py-2 text-sm bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAddArticle}
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
