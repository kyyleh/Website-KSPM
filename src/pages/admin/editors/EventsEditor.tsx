import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Loader2, Code, Eye, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { getContent, saveContent } from '../lib/adminApi';
import { wineryCarouselConfig, type WineryCarouselConfig, type CarouselSlide } from '../../../config';
import { ImageUploader } from '../components/ImageUploader';
import { toast } from 'sonner';

export function EventsEditor({ setIsDirty }: { setIsDirty?: (dirty: boolean) => void }) {
  const [data, setData] = useState<WineryCarouselConfig>({ ...wineryCarouselConfig });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [showAddSlideModal, setShowAddSlideModal] = useState(false);
  const [newSlide, setNewSlide] = useState<CarouselSlide>({ title: '', description: '' });
  const [expandedSlide, setExpandedSlide] = useState<number | null>(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await getContent<any>('events');
        if (res && res.content) {
          setData({
            ...wineryCarouselConfig,
            ...res.content,
            slides: res.content.slides || wineryCarouselConfig.slides,
          });
        } else {
          setData(wineryCarouselConfig);
        }
      } catch (err: any) {
        toast.error('Gagal memuat data Kegiatan dari server.');
        setData(wineryCarouselConfig);
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

  const updateSlide = (index: number, field: keyof CarouselSlide, value: string) => {
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
    <div className="max-w-4xl space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1c1515]">Kegiatan / Events</h2>
          <p className="text-sm text-neutral-500 mt-1">Kelola slide kegiatan carousel</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowJson(!showJson)} className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-[#d2cbbe] rounded-xl hover:bg-[#faf9f5] transition-colors text-[#1c1515]">
            {showJson ? <Eye size={16} /> : <Code size={16} />}
            {showJson ? 'Form' : 'JSON'}
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#dcae44] to-[#b88c2b] text-white font-bold text-sm rounded-xl hover:brightness-105 transition-all disabled:opacity-60 shadow-[0_4px_12px_rgba(195,147,49,0.15)]">
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
        <div className="space-y-4">
          {/* Section meta */}
          <div className="bg-white border border-[#eae6dd] rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-[#a67e2a] uppercase tracking-wider">Header Halaman</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Judul Header</label>
                <input type="text" value={data.eventsHeaderTitle || ''} onChange={(e) => { setIsDirty?.(true); setData(prev => ({ ...prev, eventsHeaderTitle: e.target.value })); }} className="w-full px-3 py-2 bg-[#faf9f5] border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Gambar Header</label>
                <ImageUploader value={data.eventsHeaderImage || ''} onChange={(url) => { setIsDirty?.(true); setData(prev => ({ ...prev, eventsHeaderImage: url })); }} label="Unggah Foto Header" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Deskripsi Header</label>
              <textarea value={data.eventsHeaderDescription || ''} onChange={(e) => { setIsDirty?.(true); setData(prev => ({ ...prev, eventsHeaderDescription: e.target.value })); }} rows={3} className="w-full px-3 py-2 bg-[#faf9f5] border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
            </div>
          </div>

          <div className="bg-white border border-[#eae6dd] rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-[#a67e2a] uppercase tracking-wider">
              Detail Section Kegiatan
            </h3>
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Judul Utama (Main Title)</label>
              <input type="text" value={data.mainTitle} onChange={(e) => { setIsDirty?.(true); setData(prev => ({ ...prev, mainTitle: e.target.value })); }} className="w-full px-3 py-2 bg-[#faf9f5] border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
            </div>
          </div>

          {/* Slides */}
          <div className="bg-white border border-[#eae6dd] rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#a67e2a] uppercase tracking-wider">
                Slides ({data.slides.length})
              </h3>
               <button
                onClick={() => {
                  setNewSlide({ title: '', description: '' });
                  setShowAddSlideModal(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#faf9f5] border border-[#d2cbbe] rounded-lg hover:bg-neutral-100 text-[#1c1515] font-semibold transition-colors"
              >
                <Plus size={14} /> Tambah Slide
              </button>
            </div>

            {data.slides.map((slide, i) => (
              <div key={i} className="border border-[#eae6dd] rounded-xl overflow-hidden">
                {/* Slide header */}
                <div
                  className="flex items-center gap-3 p-3 bg-[#faf9f5] cursor-pointer hover:bg-neutral-100 transition-colors"
                  onClick={() => setExpandedSlide(expandedSlide === i ? null : i)}
                >
                  <GripVertical size={16} className="text-neutral-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1c1515] truncate">{slide.title || '(Untitled)'}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={(e) => { e.stopPropagation(); moveSlide(i, 'up'); }} disabled={i === 0} className="p-1 text-neutral-400 hover:text-neutral-600 disabled:opacity-30">
                      <ChevronUp size={14} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); moveSlide(i, 'down'); }} disabled={i === data.slides.length - 1} className="p-1 text-neutral-400 hover:text-neutral-600 disabled:opacity-30">
                      <ChevronDown size={14} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); removeSlide(i); }} className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Slide content */}
                {expandedSlide === i && (
                  <div className="p-4 space-y-4 border-t border-[#eae6dd] bg-white">
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Title</label>
                      <input type="text" value={slide.title} onChange={(e) => updateSlide(i, 'title', e.target.value)} className="w-full px-3 py-2 bg-[#faf9f5] border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Description</label>
                      <textarea value={slide.description} onChange={(e) => updateSlide(i, 'description', e.target.value)} rows={3} className="w-full px-3 py-2 bg-[#faf9f5] border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {showAddSlideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white border border-[#eae6dd] rounded-2xl p-6 shadow-2xl space-y-4 my-8 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-[#1c1515]">Tambah Slide Kegiatan</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Judul (Title)</label>
                <input
                  type="text"
                  value={newSlide.title}
                  onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                  placeholder="Misal: Investalk 2026"
                  className="w-full px-3 py-2 bg-[#faf9f5] border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                />
              </div>
              
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Deskripsi</label>
                <textarea
                  value={newSlide.description}
                  onChange={(e) => setNewSlide({ ...newSlide, description: e.target.value })}
                  rows={3}
                  placeholder="Deskripsi kegiatan..."
                  className="w-full px-3 py-2 bg-[#faf9f5] border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a] resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-[#eae6dd]">
              <button
                type="button"
                onClick={() => setShowAddSlideModal(false)}
                className="px-4 py-2 text-sm bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAddSlide}
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
