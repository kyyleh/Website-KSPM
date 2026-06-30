import { useState, useEffect } from 'react';
import { getContent, saveContent } from '../lib/adminApi';
import { newsConfig } from '../../../config';
import { Save, Plus, Trash2, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { ImageUploader } from '../components/ImageUploader';
import { ConfirmModal } from '../components/ConfirmModal';
import { toast } from 'sonner';

export function EditorBerita({ setIsDirty }: { setIsDirty?: (dirty: boolean) => void }) {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [showAddArticleModal, setShowAddArticleModal] = useState(false);
  const [newArticle, setNewArticle] = useState({ title: '', category: 'Market Analysis', excerpt: '', date: '', image: '', url: '' });
  const [expandedArticle, setExpandedArticle] = useState<number | null>(0);

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
    const list = data.articles || [];
    setData({
      ...data,
      articles: [...list, { id: Date.now(), ...newArticle }],
    });
    setShowAddArticleModal(false);
    setExpandedArticle(list.length);
  };

  const removeArticle = (index: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Artikel',
      message: 'Apakah Anda yakin ingin menghapus artikel berita ini?',
      onConfirm: () => {
        setIsDirty?.(true);
        setData({ ...data, articles: data.articles.filter((_: any, i: number) => i !== index) });
        setExpandedArticle(null);
      }
    });
  };

  return (
    <div className="max-w-4xl space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#eae6dd] pb-4">
        <div>
          <h1 className="text-xl font-bold text-[#1c1515]">Editor Berita & Artikel</h1>
          <p className="text-xs text-neutral-500 mt-0.5">Kelola artikel berita dan testimoni</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex justify-center items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#dcae44] to-[#b88c2b] text-white font-bold text-xs rounded-lg hover:brightness-105 transition-all disabled:opacity-60 shadow-[0_2px_8px_rgba(195,147,49,0.1)]">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan
        </button>
      </div>

      {/* Section Info / Header */}
      <div className="bg-white border border-[#eae6dd] rounded-xl p-4 space-y-3 shadow-sm">
        <h2 className="font-script text-[10px] text-[#a67e2a] font-bold tracking-[0.12em]">Judul & Teks Section</h2>
        <div>
          <label className="font-script text-[10px] text-neutral-500 block mb-1">Judul Utama</label>
          <input type="text" value={data.mainTitle || ''} onChange={e => { setIsDirty?.(true); setData({ ...data, mainTitle: e.target.value }); }} className="w-full text-xs bg-[#faf9f5] border-b border-[#d2cbbe] hover:border-[#a67e2a] focus:border-[#a67e2a] px-2 py-1.5 focus:bg-white transition-all outline-none rounded-t duration-200 text-[#1c1515]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="font-script text-[10px] text-neutral-500 block mb-1">Teks Tombol "Lihat Semua Artikel"</label>
            <input type="text" value={data.viewAllText || ''} onChange={e => { setIsDirty?.(true); setData({ ...data, viewAllText: e.target.value }); }} className="w-full text-xs bg-[#faf9f5] border-b border-[#d2cbbe] hover:border-[#a67e2a] focus:border-[#a67e2a] px-2 py-1.5 focus:bg-white transition-all outline-none rounded-t duration-200 text-[#1c1515]" />
          </div>
          <div>
            <label className="font-script text-[10px] text-neutral-500 block mb-1">Teks Link "Selengkapnya"</label>
            <input type="text" value={data.readMoreText || ''} onChange={e => { setIsDirty?.(true); setData({ ...data, readMoreText: e.target.value }); }} className="w-full text-xs bg-[#faf9f5] border-b border-[#d2cbbe] hover:border-[#a67e2a] focus:border-[#a67e2a] px-2 py-1.5 focus:bg-white transition-all outline-none rounded-t duration-200 text-[#1c1515]" />
          </div>
        </div>
      </div>

      {/* Articles */}
      <div className="bg-white border border-[#eae6dd] rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#eae6dd]/40 pb-2">
          <h2 className="font-script text-[10px] text-[#a67e2a] font-bold tracking-[0.12em]">Daftar Artikel ({data.articles?.length || 0})</h2>
          <button
            onClick={() => {
              setNewArticle({ title: '', category: 'Market Analysis', excerpt: '', date: '', image: '', url: '' });
              setShowAddArticleModal(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1 text-[10px] bg-[#faf9f5] border border-[#d2cbbe] rounded hover:bg-neutral-100 text-[#1c1515] font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah
          </button>
        </div>

        <div className="space-y-2">
          {data.articles?.map((article: any, i: number) => {
            const isExpanded = expandedArticle === i;
            return (
              <div key={i} className="border border-[#eae6dd] rounded-lg overflow-hidden bg-[#faf9f5]/30">
                {/* Header bar (Click to collapse/expand) */}
                <div 
                  onClick={() => setExpandedArticle(isExpanded ? null : i)}
                  className="flex items-center justify-between px-3 py-2 bg-white border-b border-[#eae6dd] cursor-pointer hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-[10px] font-bold text-[#a67e2a]">#{i + 1}</span>
                    <span className="text-xs font-bold text-[#1c1515] truncate">{article.title || 'Artikel Baru'}</span>
                    <span className="text-[10px] text-neutral-400 truncate hidden sm:inline">({article.category})</span>
                  </div>
                  <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => removeArticle(i)}
                      className="p-1 text-neutral-400 hover:text-red-600 rounded transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={14} />
                    </button>
                    <button 
                      onClick={() => setExpandedArticle(isExpanded ? null : i)}
                      className="p-1 text-neutral-500 rounded hover:bg-neutral-100"
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>

                {/* Collapsible Content */}
                {isExpanded && (
                  <div className="p-3 space-y-3 bg-[#faf9f5]/50 border-t border-[#eae6dd]/40">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="font-script text-[9px] text-neutral-500 block mb-1">Judul Artikel</label>
                        <input type="text" value={article.title || ''} onChange={e => updateArticle(i, 'title', e.target.value)} className="w-full text-xs bg-white border border-[#d2cbbe] rounded px-2 py-1 text-[#1c1515] focus:outline-none focus:border-[#a67e2a]" />
                      </div>
                      <div>
                        <label className="font-script text-[9px] text-neutral-500 block mb-1">Kategori</label>
                        <input
                          type="text"
                          list={`news-categories-${i}`}
                          value={article.category || ''}
                          onChange={e => updateArticle(i, 'category', e.target.value)}
                          placeholder="Pilih atau ketik kategori..."
                          className="w-full text-xs bg-white border border-[#d2cbbe] rounded px-2 py-1 text-[#1c1515] focus:outline-none focus:border-[#a67e2a]"
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
                      <label className="font-script text-[9px] text-neutral-500 block mb-1">Ringkasan (Excerpt)</label>
                      <textarea value={article.excerpt || ''} onChange={e => updateArticle(i, 'excerpt', e.target.value)} rows={2} className="w-full text-xs bg-white border border-[#d2cbbe] rounded px-2 py-1 text-[#1c1515] focus:outline-none focus:border-[#a67e2a] resize-none" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
                      <div>
                        <label className="font-script text-[9px] text-neutral-500 block mb-1">Tanggal</label>
                        <input type="text" value={article.date || ''} onChange={e => updateArticle(i, 'date', e.target.value)} className="w-full text-xs bg-white border border-[#d2cbbe] rounded px-2 py-1 text-[#1c1515] focus:outline-none focus:border-[#a67e2a]" />
                      </div>
                      <div>
                        <label className="font-script text-[9px] text-neutral-500 block mb-1">Link URL</label>
                        <input type="text" value={article.url || ''} onChange={e => updateArticle(i, 'url', e.target.value)} className="w-full text-xs bg-white border border-[#d2cbbe] rounded px-2 py-1 text-[#1c1515] focus:outline-none focus:border-[#a67e2a]" />
                      </div>
                    </div>
                    <div>
                      <label className="font-script text-[9px] text-neutral-500 block mb-1">Gambar Pendukung</label>
                      <ImageUploader
                        value={article.image || ''}
                        onChange={(url) => updateArticle(i, 'image', url)}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {showAddArticleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md bg-white border border-[#eae6dd] rounded-xl p-4 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-[#1c1515]">Tambah Artikel Baru</h3>
            
            <div className="space-y-3">
              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Gambar Utama Artikel</label>
                <ImageUploader
                  value={newArticle.image}
                  onChange={(url) => setNewArticle({ ...newArticle, image: url })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-script text-[10px] text-neutral-500 block mb-1">Judul Artikel</label>
                  <input
                    type="text"
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                    placeholder="Judul artikel berita..."
                    className="w-full px-2.5 py-1.5 bg-[#faf9f5] border border-[#d2cbbe] rounded text-xs text-[#1c1515] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-script text-[10px] text-neutral-500 block mb-1">Kategori</label>
                  <input
                    type="text"
                    list="new-news-categories"
                    value={newArticle.category}
                    onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                    placeholder="Ketik kategori..."
                    className="w-full px-2.5 py-1.5 bg-[#faf9f5] border border-[#d2cbbe] rounded text-xs text-[#1c1515] focus:outline-none"
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
                  <label className="font-script text-[10px] text-neutral-500 block mb-1">Tanggal</label>
                  <input
                    type="text"
                    value={newArticle.date}
                    onChange={(e) => setNewArticle({ ...newArticle, date: e.target.value })}
                    placeholder="Misal: 27 Juni 2026"
                    className="w-full px-2.5 py-1.5 bg-[#faf9f5] border border-[#d2cbbe] rounded text-xs text-[#1c1515] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-script text-[10px] text-neutral-500 block mb-1">Link URL</label>
                  <input
                    type="text"
                    value={newArticle.url}
                    onChange={(e) => setNewArticle({ ...newArticle, url: e.target.value })}
                    placeholder="Link baca..."
                    className="w-full px-2.5 py-1.5 bg-[#faf9f5] border border-[#d2cbbe] rounded text-xs text-[#1c1515] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Ringkasan (Excerpt)</label>
                <textarea
                  value={newArticle.excerpt}
                  onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                  rows={2}
                  placeholder="Ringkasan singkat isi artikel..."
                  className="w-full px-2.5 py-1.5 bg-[#faf9f5] border border-[#d2cbbe] rounded text-xs text-[#1c1515] focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#eae6dd]">
              <button
                type="button"
                onClick={() => setShowAddArticleModal(false)}
                className="px-3 py-1.5 text-xs bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 rounded transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAddArticle}
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
