import { useState, useEffect } from 'react';
import { getContent, saveContent } from '../lib/adminApi';
import { achievementsConfig } from '../../../config';
import { Save, Loader2, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';

export function AchievementsEditor({ setIsDirty }: { setIsDirty?: (dirty: boolean) => void }) {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({ value: '', label: '', description: '', icon: 'Users' });

  useEffect(() => {
    (async () => {
      try {
        const res = await getContent('achievements');
        setData(res.content ? { ...achievementsConfig, ...res.content } : achievementsConfig);
      } catch (err: any) {
        toast.error('Gagal memuat data Pencapaian dari server.');
        setData(achievementsConfig);
      }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveContent('achievements', data);
      setIsDirty?.(false);
      toast.success('Data pencapaian berhasil disimpan!');
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

  const updateField = (key: string, value: any) => {
    setIsDirty?.(true);
    setData({ ...data, [key]: value });
  };

  const updateItem = (index: number, key: string, value: any) => {
    setIsDirty?.(true);
    const items = [...data.items];
    items[index] = { ...items[index], [key]: value };
    setData({ ...data, items });
  };

  const handleConfirmAddItem = () => {
    if (!newItem.value || !newItem.label) {
      alert('Angka/Value dan Label harus diisi!');
      return;
    }
    setIsDirty?.(true);
    setData({ ...data, items: [...data.items, { ...newItem }] });
    setShowAddModal(false);
  };

  const removeItem = (index: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus pencapaian ini?")) {
      return;
    }
    setIsDirty?.(true);
    setData({ ...data, items: data.items.filter((_: any, i: number) => i !== index) });
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...data.items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    
    setIsDirty?.(true);
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setData({ ...data, items: newItems });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1c1515]">Editor Pencapaian</h1>
          <p className="text-neutral-500 text-sm mt-1">Kelola data pencapaian dan statistik utama KSPM</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-[#dcae44] to-[#b88c2b] text-white font-bold px-4 py-2 rounded-xl hover:brightness-105 transition-colors disabled:opacity-50 shadow-[0_4px_12px_rgba(195,147,49,0.15)]"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan
        </button>
      </div>

      {/* Header Fields */}
      <div className="bg-white border border-[#eae6dd] rounded-2xl p-6 space-y-4 shadow-sm">
        <h2 className="text-[#a67e2a] font-bold text-sm uppercase tracking-wider">Judul & Deskripsi Section</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-neutral-500 text-xs mb-1">Judul Utama</label>
            <input
              type="text"
              value={data.mainTitle || ''}
              onChange={e => updateField('mainTitle', e.target.value)}
              className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-xl px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
            />
          </div>
          <div>
            <label className="block text-neutral-500 text-xs mb-1">Subjudul / Deskripsi Pengantar</label>
            <textarea
              value={data.subtitle || ''}
              onChange={e => updateField('subtitle', e.target.value)}
              rows={3}
              className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-xl px-3 py-2 text-[#1c1515] text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
            />
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="bg-white border border-[#eae6dd] rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#eae6dd] pb-3">
          <h2 className="text-[#a67e2a] font-bold text-sm uppercase tracking-wider">Daftar Pencapaian ({data.items?.length || 0})</h2>
          <button
            onClick={() => {
              setNewItem({ value: '', label: '', description: '', icon: 'Users' });
              setShowAddModal(true);
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-[#faf9f5] border border-[#d2cbbe] rounded-lg hover:bg-neutral-100 text-[#1c1515] font-semibold transition-colors"
          >
            <Plus size={14} /> Tambah Baru
          </button>
        </div>

        <div className="space-y-4">
          {data.items?.map((item: any, idx: number) => (
            <div key={idx} className="flex flex-col md:flex-row md:items-end gap-3 p-4 bg-[#faf9f5] rounded-xl border border-[#eae6dd] relative">
              <div className="w-full md:w-32">
                <label className="block text-neutral-500 text-[10px] uppercase font-bold mb-1">Ikon</label>
                <select
                  value={item.icon}
                  onChange={e => updateItem(idx, 'icon', e.target.value)}
                  className="w-full bg-white border border-[#d2cbbe] rounded-lg px-2.5 py-1.5 text-[#1c1515] text-xs focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                >
                  <option value="Users">Users (Alumni/Anggota)</option>
                  <option value="FileText">FileText (Riset/Publikasi)</option>
                  <option value="Calendar">Calendar (Kegiatan)</option>
                  <option value="Award">Award (Penghargaan)</option>
                  <option value="TrendingUp">TrendingUp (Perkembangan)</option>
                  <option value="Handshake">Handshake (Kemitraan)</option>
                </select>
              </div>
              <div className="w-full md:w-28">
                <label className="block text-neutral-500 text-[10px] uppercase font-bold mb-1">Angka (Value)</label>
                <input
                  type="text"
                  value={item.value}
                  onChange={e => updateItem(idx, 'value', e.target.value)}
                  placeholder="Misal: 500+"
                  className="w-full bg-white border border-[#d2cbbe] rounded-lg px-3 py-1.5 text-[#1c1515] text-xs focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                />
              </div>
              <div className="w-full md:w-44">
                <label className="block text-neutral-500 text-[10px] uppercase font-bold mb-1">Label</label>
                <input
                  type="text"
                  value={item.label}
                  onChange={e => updateItem(idx, 'label', e.target.value)}
                  placeholder="Misal: Alumni Aktif"
                  className="w-full bg-white border border-[#d2cbbe] rounded-lg px-3 py-1.5 text-[#1c1515] text-xs focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                />
              </div>
              <div className="flex-1">
                <label className="block text-neutral-500 text-[10px] uppercase font-bold mb-1">Deskripsi Singkat</label>
                <input
                  type="text"
                  value={item.description}
                  onChange={e => updateItem(idx, 'description', e.target.value)}
                  className="w-full bg-white border border-[#d2cbbe] rounded-lg px-3 py-1.5 text-[#1c1515] text-xs focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                />
              </div>
              <div className="flex items-center gap-1 justify-end mt-2 md:mt-0 flex-shrink-0">
                <button
                  onClick={() => moveItem(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 text-neutral-400 hover:text-neutral-600 disabled:opacity-30"
                  title="Pindah Ke Atas"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  onClick={() => moveItem(idx, 'down')}
                  disabled={idx === data.items.length - 1}
                  className="p-1.5 text-neutral-400 hover:text-neutral-600 disabled:opacity-30"
                  title="Pindah Ke Bawah"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  onClick={() => removeItem(idx)}
                  className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus Item"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {(!data.items || data.items.length === 0) && (
            <div className="text-center py-6 text-neutral-400 text-sm">Belum ada data pencapaian.</div>
          )}
        </div>
      </div>

      {/* Creation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white border border-[#eae6dd] rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl relative">
            <div className="px-6 py-4 border-b border-[#eae6dd] bg-[#faf9f6]">
              <h3 className="text-base font-bold text-[#1c1515]">Tambah Pencapaian Baru</h3>
            </div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <label className="block text-neutral-500 text-xs mb-1">Ikon Pencapaian</label>
                <select
                  value={newItem.icon}
                  onChange={e => setNewItem({ ...newItem, icon: e.target.value })}
                  className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-xl px-3 py-2 text-[#1c1515] text-sm focus:outline-none"
                >
                  <option value="Users">Users (Alumni/Anggota)</option>
                  <option value="FileText">FileText (Riset/Publikasi)</option>
                  <option value="Calendar">Calendar (Kegiatan)</option>
                  <option value="Award">Award (Penghargaan)</option>
                  <option value="TrendingUp">TrendingUp (Perkembangan)</option>
                  <option value="Handshake">Handshake (Kemitraan)</option>
                </select>
              </div>
              <div>
                <label className="block text-neutral-500 text-xs mb-1">Angka / Nilai Pencapaian</label>
                <input
                  type="text"
                  value={newItem.value}
                  onChange={e => setNewItem({ ...newItem, value: e.target.value })}
                  placeholder="Misal: 500+, 30+, atau 7"
                  className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-xl px-3 py-2 text-[#1c1515] text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-500 text-xs mb-1">Label Pencapaian</label>
                <input
                  type="text"
                  value={newItem.label}
                  onChange={e => setNewItem({ ...newItem, label: e.target.value })}
                  placeholder="Misal: Alumni Aktif atau Tahun Berdedikasi"
                  className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-xl px-3 py-2 text-[#1c1515] text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-500 text-xs mb-1">Deskripsi Singkat</label>
                <input
                  type="text"
                  value={newItem.description}
                  onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Keterangan tambahan..."
                  className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-xl px-3 py-2 text-[#1c1515] text-sm focus:outline-none"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-[#eae6dd] bg-[#faf9f6] flex items-center justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-bold text-neutral-500 hover:text-neutral-700 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmAddItem}
                className="px-4 py-2 text-xs font-bold bg-[#c9922a] text-white rounded-lg hover:bg-[#b07f20] transition-colors"
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
