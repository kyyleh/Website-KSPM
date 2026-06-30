import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Loader2, Code, Eye, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { getContent, saveContent } from '../lib/adminApi';
import { kegiatanCarouselConfig, type KegiatanCarouselConfig, type SlideKegiatan } from '../../../config';
import { ImageUploader } from '../components/ImageUploader';
import { toast } from 'sonner';

export function EditorKegiatan({ setIsDirty }: { setIsDirty?: (dirty: boolean) => void }) {
  const [data, setData] = useState<KegiatanCarouselConfig>({ ...kegiatanCarouselConfig });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [showAddSlideModal, setShowAddSlideModal] = useState(false);
  const [newSlide, setNewSlide] = useState<SlideKegiatan>({ title: '', description: '' });
  const [expandedSlide, setExpandedSlide] = useState<number | null>(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await getContent<any>('events');
        if (res && res.content) {
          setData({
            ...kegiatanCarouselConfig,
            ...res.content,
            slides: res.content.slides || kegiatanCarouselConfig.slides,
          });
        } else {
          setData(kegiatanCarouselConfig);
        }
      } catch (err: any) {
        toast.error('Gagal memuat data Kegiatan dari server.');
        setData(kegiatanCarouselConfig);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveContent('events', data);
      setIsDirty?.(false);
      toast.success('Kegiatan berhasil disimpan!');
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan data.');
    } finally {
      setSaving(false);
    }
  };

  const updateSlide = (index: number, field: keyof SlideKegiatan, value: string) => {
    setIsDirty?.(true);
    const updated = [...data.slides];
    updated[index] = { ...updated[index], [field]: value };
    setData((prev) => ({ ...prev, slides: updated }));
  };

  const handleConfirmAddSlide = () => {
    if (!newSlide.title) {
      alert('Judul slide harus diisi!');
      return;
    }
    setIsDirty?.(true);
    setData((prev) => ({ ...prev, slides: [...prev.slides, { ...newSlide }] }));
    setShowAddSlideModal(false);
    setExpandedSlide(data.slides.length);
  };

  const removeSlide = (index: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus slide kegiatan ini?")) {
      return;
    }
    setIsDirty?.(true);
    setData((prev) => ({ ...prev, slides: prev.slides.filter((_, i) => i !== index) }));
    setExpandedSlide(null);
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const slides = [...data.slides];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= slides.length) return;
    setIsDirty?.(true);
    [slides[index], slides[newIndex]] = [slides[newIndex], slides[index]];
    setData((prev) => ({ ...prev, slides }));
    setExpandedSlide(newIndex);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="text-[#a67e2a] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#eae6dd] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#1c1515]">Kegiatan / Events</h2>
          <p className="text-xs text-neutral-500 mt-0.5">Kelola slide kegiatan carousel</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button onClick={() => setShowJson(!showJson)} className="flex-1 sm:flex-none flex justify-center items-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-[#d2cbbe] rounded-lg hover:bg-[#faf9f5] transition-colors text-[#1c1515] font-semibold">
            {showJson ? <Eye size={14} /> : <Code size={14} />}
            {showJson ? 'Form' : 'JSON'}
          </button>
          <button onClick={handleSave} disabled={saving} className="flex-1 sm:flex-none flex justify-center items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#dcae44] to-[#b88c2b] text-white font-bold text-xs rounded-lg hover:brightness-105 transition-all disabled:opacity-60 shadow-[0_2px_8px_rgba(195,147,49,0.1)]">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Simpan
          </button>
        </div>
      </div>

      {showJson ? (
        <pre className="bg-[#faf9f5] border border-[#eae6dd] rounded-xl p-3 text-xs text-[#1c1515] overflow-auto max-h-[500px]">
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <div className="space-y-3.5">
          {/* Section meta */}
          <div className="bg-white border border-[#eae6dd] rounded-xl p-4 space-y-3 shadow-sm">
            <h3 className="font-script text-[10px] text-[#a67e2a] font-bold tracking-[0.12em]">Header Halaman</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Judul Header</label>
                <input type="text" value={data.eventsHeaderTitle || ''} onChange={(e) => { setIsDirty?.(true); setData(prev => ({ ...prev, eventsHeaderTitle: e.target.value })); }} className="w-full text-xs bg-[#faf9f5] border-b border-[#d2cbbe] hover:border-[#a67e2a] focus:border-[#a67e2a] px-2 py-1.5 focus:bg-white transition-all outline-none rounded-t duration-200 text-[#1c1515]" />
              </div>
              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Gambar Header</label>
                <ImageUploader value={data.eventsHeaderImage || ''} onChange={(url) => { setIsDirty?.(true); setData(prev => ({ ...prev, eventsHeaderImage: url })); }} />
              </div>
            </div>
            <div>
              <label className="font-script text-[10px] text-neutral-500 block mb-1">Deskripsi Header</label>
              <textarea value={data.eventsHeaderDescription || ''} onChange={(e) => { setIsDirty?.(true); setData(prev => ({ ...prev, eventsHeaderDescription: e.target.value })); }} rows={2} className="w-full text-xs bg-[#faf9f5] border-b border-[#d2cbbe] hover:border-[#a67e2a] focus:border-[#a67e2a] px-2 py-1.5 focus:bg-white transition-all outline-none rounded-t duration-200 text-[#1c1515] resize-none" />
            </div>
          </div>

          <div className="bg-white border border-[#eae6dd] rounded-xl p-4 space-y-3 shadow-sm">
            <h3 className="font-script text-[10px] text-[#a67e2a] font-bold tracking-[0.12em]">
              Detail Section Kegiatan
            </h3>
            <div>
              <label className="font-script text-[10px] text-neutral-500 block mb-1">Judul Utama (Main Title)</label>
              <input type="text" value={data.mainTitle} onChange={(e) => { setIsDirty?.(true); setData(prev => ({ ...prev, mainTitle: e.target.value })); }} className="w-full text-xs bg-[#faf9f5] border-b border-[#d2cbbe] hover:border-[#a67e2a] focus:border-[#a67e2a] px-2 py-1.5 focus:bg-white transition-all outline-none rounded-t duration-200 text-[#1c1515]" />
            </div>
          </div>

          {/* Slides */}
          <div className="bg-white border border-[#eae6dd] rounded-xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#eae6dd]/40 pb-2">
              <h3 className="font-script text-[10px] text-[#a67e2a] font-bold tracking-[0.12em]">
                Daftar Slide ({data.slides.length})
              </h3>
               <button
                onClick={() => {
                  setNewSlide({ title: '', description: '' });
                  setShowAddSlideModal(true);
                }}
                className="flex items-center gap-1 px-2.5 py-1 text-[10px] bg-[#faf9f5] border border-[#d2cbbe] rounded hover:bg-neutral-100 text-[#1c1515] font-semibold transition-colors"
              >
                <Plus size={12} /> Tambah Slide
              </button>
            </div>

            <div className="space-y-2">
              {data.slides.map((slide, i) => (
                <div key={i} className="border border-[#eae6dd] rounded-lg overflow-hidden bg-[#faf9f5]/30">
                  {/* Slide header */}
                  <div
                    className="flex items-center justify-between px-3 py-2 bg-white cursor-pointer hover:bg-neutral-50 transition-colors"
                    onClick={() => setExpandedSlide(expandedSlide === i ? null : i)}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-[10px] font-bold text-[#a67e2a]">#{i + 1}</span>
                      <p className="text-xs font-bold text-[#1c1515] truncate">{slide.title || '(Tanpa Judul)'}</p>
                    </div>
                    <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => moveSlide(i, 'up')} disabled={i === 0} className="p-1 text-neutral-400 hover:text-neutral-600 disabled:opacity-30">
                        <ChevronUp size={14} />
                      </button>
                      <button onClick={() => moveSlide(i, 'down')} disabled={i === data.slides.length - 1} className="p-1 text-neutral-400 hover:text-neutral-600 disabled:opacity-30">
                        <ChevronDown size={14} />
                      </button>
                      <button onClick={() => removeSlide(i)} className="p-1 text-neutral-400 hover:text-red-600 rounded">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Slide content */}
                  {expandedSlide === i && (
                    <div className="p-3 space-y-3 border-t border-[#eae6dd] bg-white">
                      <div>
                        <label className="font-script text-[9px] text-neutral-500 block mb-1">Judul Slide</label>
                        <input type="text" value={slide.title} onChange={(e) => updateSlide(i, 'title', e.target.value)} className="w-full text-xs bg-[#faf9f5] border border-[#d2cbbe] px-2 py-1 rounded focus:outline-none" />
                      </div>
                      <div>
                        <label className="font-script text-[9px] text-neutral-500 block mb-1">Deskripsi Slide</label>
                        <textarea value={slide.description} onChange={(e) => updateSlide(i, 'description', e.target.value)} rows={2} className="w-full text-xs bg-[#faf9f5] border border-[#d2cbbe] px-2 py-1 rounded resize-none focus:outline-none" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {showAddSlideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-[#eae6dd] rounded-xl p-4 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-[#1c1515]">Tambah Slide Kegiatan</h3>
            
            <div className="space-y-3">
              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Judul (Title)</label>
                <input
                  type="text"
                  value={newSlide.title}
                  onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                  placeholder="Misal: Investalk 2026"
                  className="w-full px-2.5 py-1.5 bg-[#faf9f5] border border-[#d2cbbe] rounded text-xs text-[#1c1515] focus:outline-none"
                />
              </div>
              
              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Deskripsi</label>
                <textarea
                  value={newSlide.description}
                  onChange={(e) => setNewSlide({ ...newSlide, description: e.target.value })}
                  rows={3}
                  placeholder="Deskripsi kegiatan..."
                  className="w-full px-2.5 py-1.5 bg-[#faf9f5] border border-[#d2cbbe] rounded text-xs text-[#1c1515] focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#eae6dd]">
              <button
                type="button"
                onClick={() => setShowAddSlideModal(false)}
                className="px-3 py-1.5 text-xs bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 rounded transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAddSlide}
                className="px-3 py-1.5 text-xs bg-[#a67e2a] hover:bg-[#8e6b21] text-white font-bold rounded transition-colors"
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
