import { useState, useEffect } from 'react';
import { getContent, saveContent } from '../lib/adminApi';
import { galleryConfig, type GalleryItem } from '../../../config';
import { Save, Plus, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import { ImageUploader } from '../components/ImageUploader';
import { toast } from 'sonner';

export function GalleryEditor({ setIsDirty }: { setIsDirty?: (dirty: boolean) => void }) {
  const [items, setItems] = useState<GalleryItem[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    alt: '',
    src: '',
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await getContent('gallery');
        const loaded = res.content || res;
        // Handle array directly or wrapped object
        if (Array.isArray(loaded)) {
          setItems(loaded);
        } else if (loaded && Array.isArray(loaded.items)) {
          setItems(loaded.items);
        } else {
          setItems(galleryConfig);
        }
      } catch (err: any) {
        toast.error('Gagal memuat data galeri dari server.');
        setItems(galleryConfig);
      }
    })();
  }, []);

  const handleSave = async () => {
    if (!items) return;
    setSaving(true);
    try {
      // Save directly as array or wrapped object. Let's save as wrapped object to be consistent
      await saveContent('gallery', { items });
      setIsDirty?.(false);
      toast.success('Data galeri foto berhasil disimpan!');
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan data.');
    }
    setSaving(false);
  };

  const updateItem = (index: number, key: keyof GalleryItem, value: any) => {
    if (!items) return;
    setIsDirty?.(true);
    const updated = [...items];
    updated[index] = { ...updated[index], [key]: value };
    setItems(updated);
  };

  const handleConfirmAdd = () => {
    if (!newItem.src) {
      alert('File gambar harus di-upload!');
      return;
    }
    if (!newItem.title) {
      alert('Judul foto harus diisi!');
      return;
    }
    setIsDirty?.(true);
    const addedItem: GalleryItem = {
      id: Date.now().toString(),
      src: newItem.src,
      alt: newItem.alt || newItem.title,
      title: newItem.title,
      description: newItem.description,
    };
    setItems([...(items || []), addedItem]);
    setNewItem({ title: '', description: '', alt: '', src: '' });
    setShowAddModal(false);
  };

  const removeItem = (index: number) => {
    if (!items) return;
    if (!window.confirm('Apakah Anda yakin ingin menghapus foto ini dari galeri?')) {
      return;
    }
    setIsDirty?.(true);
    setItems(items.filter((_, i) => i !== index));
  };

  if (!items) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="text-[#a67e2a] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center border-b border-[#eae6dd] pb-5">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1c1515] tracking-tight">Galeri Foto KSPM</h1>
          <p className="text-neutral-500 mt-1 text-[14px]">Kelola dokumentasi foto kegiatan KSPM FEB UIKA Bogor.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-white border border-[#d2cbbe] hover:bg-[#faf9f6] text-[#1c1515] rounded-xl cursor-pointer transition-all duration-300 shadow-sm"
          >
            <Plus size={16} />
            Tambah Foto
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#dcae44] to-[#b88c2b] hover:from-[#e3b853] hover:to-[#c49633] text-white rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Simpan Perubahan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="bg-white border border-[#eae6dd] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100 border border-[#eae6dd] relative">
                  {item.src ? (
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400">
                      <ImageIcon size={40} className="stroke-1 mb-2" />
                      <span className="text-xs">Belum ada gambar</span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 cursor-pointer self-start"
                  title="Hapus foto"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Ganti Gambar
                  </label>
                  <ImageUploader
                    value={item.src}
                    onChange={(url) => updateItem(index, 'src', url)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Judul Foto
                  </label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateItem(index, 'title', e.target.value)}
                    className="w-full text-sm rounded-xl border border-[#d2cbbe] bg-[#faf9f5] px-4 py-2.5 text-[#1c1515] focus:bg-white focus:border-[#a67e2a] focus:ring-2 focus:ring-[#a67e2a]/10 outline-none transition-all duration-200"
                    placeholder="Contoh: Investalk Series 2026"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Deskripsi Singkat / Caption
                  </label>
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    className="w-full text-sm rounded-xl border border-[#d2cbbe] bg-[#faf9f5] px-4 py-2.5 text-[#1c1515] focus:bg-white focus:border-[#a67e2a] focus:ring-2 focus:ring-[#a67e2a]/10 outline-none transition-all duration-200 resize-none"
                    placeholder="Jelaskan secara singkat aktivitas dalam foto ini..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Alt Text (Aksesibilitas)
                  </label>
                  <input
                    type="text"
                    value={item.alt}
                    onChange={(e) => updateItem(index, 'alt', e.target.value)}
                    className="w-full text-sm rounded-xl border border-[#d2cbbe] bg-[#faf9f5] px-4 py-2.5 text-[#1c1515] focus:bg-white focus:border-[#a67e2a] focus:ring-2 focus:ring-[#a67e2a]/10 outline-none transition-all duration-200"
                    placeholder="Deskripsi untuk pembaca layar..."
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="bg-white border border-dashed border-[#d2cbbe] rounded-2xl p-12 text-center text-neutral-400">
          <ImageIcon size={48} className="mx-auto stroke-1 mb-3" />
          <p className="text-[15px] font-medium">Belum ada foto dalam galeri.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-white border border-[#d2cbbe] hover:bg-[#faf9f6] text-[#1c1515] rounded-xl cursor-pointer transition-all duration-300"
          >
            Tambah Foto Baru
          </button>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#1c1515]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#eae6dd] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold font-serif text-[#1c1515] mb-4">
              Tambah Foto ke Galeri
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Upload Gambar
                </label>
                <ImageUploader
                  value={newItem.src}
                  onChange={(url) => setNewItem({ ...newItem, src: url })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Judul Foto
                </label>
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full text-sm rounded-xl border border-[#d2cbbe] bg-[#faf9f5] px-4 py-2.5 text-[#1c1515] focus:bg-white focus:border-[#a67e2a] outline-none transition-all duration-200"
                  placeholder="Contoh: Comparative Study 2026"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Deskripsi / Caption
                </label>
                <textarea
                  rows={3}
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full text-sm rounded-xl border border-[#d2cbbe] bg-[#faf9f5] px-4 py-2.5 text-[#1c1515] focus:bg-white focus:border-[#a67e2a] outline-none transition-all duration-200 resize-none"
                  placeholder="Deskripsi singkat..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={newItem.alt}
                  onChange={(e) => setNewItem({ ...newItem, alt: e.target.value })}
                  className="w-full text-sm rounded-xl border border-[#d2cbbe] bg-[#faf9f5] px-4 py-2.5 text-[#1c1515] focus:bg-white focus:border-[#a67e2a] outline-none transition-all duration-200"
                  placeholder="Deskripsi aksesibilitas gambar..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-[#d2cbbe] hover:bg-[#faf9f6] text-[#1c1515] rounded-xl cursor-pointer transition-all duration-300"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAdd}
                className="px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#dcae44] to-[#b88c2b] text-white rounded-xl cursor-pointer hover:from-[#e3b853] hover:to-[#c49633] transition-all duration-300"
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
