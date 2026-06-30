import { useState, useEffect } from 'react';
import { getContent, saveContent } from '../lib/adminApi';
import { galleryConfig, type GalleryItem } from '../../../config';
import { Save, Plus, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import { ImageUploader } from '../components/ImageUploader';
import { ConfirmModal } from '../components/ConfirmModal';
import { toast } from 'sonner';

export function EditorGaleri({ setIsDirty }: { setIsDirty?: (dirty: boolean) => void }) {
  const [items, setItems] = useState<GalleryItem[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

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
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Foto Galeri',
      message: 'Apakah Anda yakin ingin menghapus foto ini dari galeri?',
      onConfirm: () => {
        setIsDirty?.(true);
        setItems(items.filter((_, i) => i !== index));
      }
    });
  };

  if (!items) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="text-[#a67e2a] animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#eae6dd] pb-4">
        <div>
          <h1 className="text-xl font-bold text-[#1c1515]">Galeri Foto KSPM</h1>
          <p className="text-xs text-neutral-500 mt-0.5">Kelola dokumentasi foto kegiatan KSPM FEB UIKA Bogor</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex-1 sm:flex-none flex justify-center items-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-[#d2cbbe] rounded-lg hover:bg-[#faf9f5] transition-colors text-[#1c1515] font-semibold"
          >
            <Plus size={14} />
            Tambah Foto
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 sm:flex-none flex justify-center items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#dcae44] to-[#b88c2b] text-white font-bold text-xs rounded-lg hover:brightness-105 transition-all disabled:opacity-60 shadow-[0_2px_8px_rgba(195,147,49,0.1)]"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Simpan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="bg-white border border-[#eae6dd] rounded-xl p-3 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-[#faf9f5] border border-[#eae6dd]">
                {item.src ? (
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400">
                    <ImageIcon size={24} className="stroke-1 mb-1" />
                    <span className="text-[10px]">Belum ada gambar</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="absolute top-1.5 right-1.5 p-1 bg-white/90 backdrop-blur-sm text-red-500 hover:text-red-700 rounded shadow-sm transition-colors"
                  title="Hapus foto"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              <div className="space-y-2 pb-1.5">
                <div>
                  <label className="font-script text-[9px] text-[#a67e2a] font-bold block mb-0.5">Gambar</label>
                  <ImageUploader
                    value={item.src}
                    onChange={(url) => updateItem(index, 'src', url)}
                  />
                </div>

                <div>
                  <label className="font-script text-[9px] text-[#a67e2a] font-bold block mb-0.5">Judul Foto</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateItem(index, 'title', e.target.value)}
                    className="w-full text-xs bg-[#faf9f5] border-b border-[#d2cbbe] hover:border-[#a67e2a] focus:border-[#a67e2a] px-1.5 py-1 focus:bg-white transition-all outline-none rounded-t text-[#1c1515]"
                    placeholder="Contoh: Investalk 2026"
                  />
                </div>

                <div>
                  <label className="font-script text-[9px] text-[#a67e2a] font-bold block mb-0.5">Deskripsi / Caption</label>
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    className="w-full text-xs bg-[#faf9f5] border-b border-[#d2cbbe] hover:border-[#a67e2a] focus:border-[#a67e2a] px-1.5 py-1 focus:bg-white transition-all outline-none rounded-t resize-none text-[#1c1515]"
                    placeholder="Keterangan singkat..."
                  />
                </div>

                <div>
                  <label className="font-script text-[9px] text-[#a67e2a] font-bold block mb-0.5">Alt Text (Aksesibilitas)</label>
                  <input
                    type="text"
                    value={item.alt}
                    onChange={(e) => updateItem(index, 'alt', e.target.value)}
                    className="w-full text-xs bg-[#faf9f5] border-b border-[#d2cbbe] hover:border-[#a67e2a] focus:border-[#a67e2a] px-1.5 py-1 focus:bg-white transition-all outline-none rounded-t text-[#1c1515]"
                    placeholder="Aksesibilitas..."
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="bg-white border border-dashed border-[#d2cbbe] rounded-xl p-8 text-center text-neutral-400">
          <ImageIcon size={32} className="mx-auto stroke-1 mb-2 text-[#a67e2a]" />
          <p className="text-xs font-semibold">Belum ada foto dalam galeri.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-3 px-3 py-1.5 text-xs bg-white border border-[#d2cbbe] hover:bg-[#faf9f5] text-[#1c1515] rounded-lg transition-colors font-semibold"
          >
            Tambah Foto Baru
          </button>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#1c1515]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#eae6dd] rounded-xl max-w-md w-full p-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-[#1c1515] border-b border-[#eae6dd] pb-2 mb-3">
              Tambah Foto ke Galeri
            </h3>
            <div className="space-y-3">
              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Upload Gambar</label>
                <ImageUploader
                  value={newItem.src}
                  onChange={(url) => setNewItem({ ...newItem, src: url })}
                />
              </div>

              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Judul Foto</label>
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-[#faf9f5] border border-[#d2cbbe] rounded text-xs text-[#1c1515] focus:outline-none"
                  placeholder="Contoh: Comparative Study 2026"
                />
              </div>

              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Deskripsi / Caption</label>
                <textarea
                  rows={2}
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-[#faf9f5] border border-[#d2cbbe] rounded text-xs text-[#1c1515] focus:outline-none resize-none"
                  placeholder="Keterangan singkat..."
                />
              </div>

              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Alt Text</label>
                <input
                  type="text"
                  value={newItem.alt}
                  onChange={(e) => setNewItem({ ...newItem, alt: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-[#faf9f5] border border-[#d2cbbe] rounded text-xs text-[#1c1515] focus:outline-none"
                  placeholder="Deskripsi aksesibilitas..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#eae6dd] mt-4">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 text-xs bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 rounded transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAdd}
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
