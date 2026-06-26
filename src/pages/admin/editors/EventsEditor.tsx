import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Loader2, Code, Eye, CheckCircle, AlertCircle, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { getContent, saveContent } from '../lib/adminApi';
import { wineryCarouselConfig, type WineryCarouselConfig, type CarouselSlide } from '../../../config';
import { ImageUploader } from '../components/ImageUploader';

export function EventsEditor() {
  const [data, setData] = useState<WineryCarouselConfig>({ ...wineryCarouselConfig });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showJson, setShowJson] = useState(false);
  const [showAddSlideModal, setShowAddSlideModal] = useState(false);
  const [newSlide, setNewSlide] = useState<CarouselSlide>({ image: '', title: '', subtitle: '', area: '', unit: '', description: '' });
  const [expandedSlide, setExpandedSlide] = useState<number | null>(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await getContent<any>('events');
        if (res && res.content) setData(res.content);
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
      await saveContent('events', data);
      showToast('success', 'Kegiatan berhasil disimpan!');
    } catch (err: any) {
      showToast('error', err.message || 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const updateSlide = (index: number, field: keyof CarouselSlide, value: string) => {
    const updated = [...data.slides];
    updated[index] = { ...updated[index], [field]: value };
    setData((prev) => ({ ...prev, slides: updated }));
  };

  const handleConfirmAddSlide = () => {
    if (!newSlide.title) {
      alert('Judul slide harus diisi!');
      return;
    }
    setData((prev) => ({ ...prev, slides: [...prev.slides, { ...newSlide }] }));
    setShowAddSlideModal(false);
    setExpandedSlide(data.slides.length);
  };

  const removeSlide = (index: number) => {
    setData((prev) => ({ ...prev, slides: prev.slides.filter((_, i) => i !== index) }));
    setExpandedSlide(null);
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const slides = [...data.slides];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= slides.length) return;
    [slides[index], slides[newIndex]] = [slides[newIndex], slides[index]];
    setData((prev) => ({ ...prev, slides }));
    setExpandedSlide(newIndex);
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
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-fade-up ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Kegiatan / Events</h2>
          <p className="text-sm text-slate-400 mt-1">Kelola slide kegiatan carousel</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowJson(!showJson)} className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors">
            {showJson ? <Eye size={16} /> : <Code size={16} />}
            {showJson ? 'Form' : 'JSON'}
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-slate-900 font-semibold text-sm rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-60">
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
        <div className="space-y-4">
          {/* Section meta */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">Header Section</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Script Text</label>
                <input type="text" value={data.scriptText} onChange={(e) => setData(prev => ({ ...prev, scriptText: e.target.value }))} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Subtitle</label>
                <input type="text" value={data.subtitle} onChange={(e) => setData(prev => ({ ...prev, subtitle: e.target.value }))} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Main Title</label>
                <input type="text" value={data.mainTitle} onChange={(e) => setData(prev => ({ ...prev, mainTitle: e.target.value }))} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50" />
              </div>
            </div>
          </div>

          {/* Slides */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">
                Slides ({data.slides.length})
              </h3>
               <button
                onClick={() => {
                  setNewSlide({ image: '', title: '', subtitle: '', area: '', unit: '', description: '' });
                  setShowAddSlideModal(true);
                }}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <Plus size={14} /> Tambah Slide
              </button>
            </div>

            {data.slides.map((slide, i) => (
              <div key={i} className="border border-slate-700/50 rounded-lg overflow-hidden">
                {/* Slide header */}
                <div
                  className="flex items-center gap-3 p-3 bg-slate-800/50 cursor-pointer hover:bg-slate-800/80 transition-colors"
                  onClick={() => setExpandedSlide(expandedSlide === i ? null : i)}
                >
                  <GripVertical size={16} className="text-slate-600" />
                  {slide.image && (
                    <img src={slide.image} alt="" className="w-10 h-10 rounded object-cover" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{slide.title || '(Untitled)'}</p>
                    <p className="text-xs text-slate-500">{slide.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={(e) => { e.stopPropagation(); moveSlide(i, 'up'); }} disabled={i === 0} className="p-1 text-slate-500 hover:text-white disabled:opacity-30">
                      <ChevronUp size={14} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); moveSlide(i, 'down'); }} disabled={i === data.slides.length - 1} className="p-1 text-slate-500 hover:text-white disabled:opacity-30">
                      <ChevronDown size={14} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); removeSlide(i); }} className="p-1 text-slate-500 hover:text-red-400">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Slide content */}
                {expandedSlide === i && (
                  <div className="p-4 space-y-4 border-t border-slate-700/50">
                    <ImageUploader
                      value={slide.image}
                      onChange={(url) => updateSlide(i, 'image', url)}
                      label="Image"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Title</label>
                        <input type="text" value={slide.title} onChange={(e) => updateSlide(i, 'title', e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Subtitle</label>
                        <input type="text" value={slide.subtitle} onChange={(e) => updateSlide(i, 'subtitle', e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Area / Stat</label>
                        <input type="text" value={slide.area} onChange={(e) => updateSlide(i, 'area', e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Unit</label>
                        <input type="text" value={slide.unit} onChange={(e) => updateSlide(i, 'unit', e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Description</label>
                      <textarea value={slide.description} onChange={(e) => updateSlide(i, 'description', e.target.value)} rows={3} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm resize-none focus:outline-none focus:ring-1 focus:ring-amber-500/50" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {showAddSlideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4 my-8 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-white">Tambah Slide Kegiatan</h3>
            
            <div className="space-y-4">
              <ImageUploader
                value={newSlide.image}
                onChange={(url) => setNewSlide({ ...newSlide, image: url })}
                label="Gambar Kegiatan"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Judul (Title)</label>
                  <input
                    type="text"
                    value={newSlide.title}
                    onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                    placeholder="Misal: Investalk 2026"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Sub-Judul (Subtitle)</label>
                  <input
                    type="text"
                    value={newSlide.subtitle}
                    onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
                    placeholder="Misal: Seminar Nasional"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Area / Stat</label>
                  <input
                    type="text"
                    value={newSlide.area}
                    onChange={(e) => setNewSlide({ ...newSlide, area: e.target.value })}
                    placeholder="Misal: 200"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Unit</label>
                  <input
                    type="text"
                    value={newSlide.unit}
                    onChange={(e) => setNewSlide({ ...newSlide, unit: e.target.value })}
                    placeholder="Misal: + Peserta"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-slate-400 mb-1">Deskripsi</label>
                <textarea
                  value={newSlide.description}
                  onChange={(e) => setNewSlide({ ...newSlide, description: e.target.value })}
                  rows={3}
                  placeholder="Deskripsi kegiatan..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddSlideModal(false)}
                className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAddSlide}
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
