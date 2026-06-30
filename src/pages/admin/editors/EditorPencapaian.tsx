import { useState, useEffect } from 'react';
import { getContent, saveContent } from '../lib/adminApi';
import { achievementsConfig } from '../../../config';
import { Save, Loader2, Plus, Trash2, ArrowUp, ArrowDown, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

export function EditorPencapaian({ setIsDirty }: { setIsDirty?: (dirty: boolean) => void }) {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({ value: '', label: '', description: '', icon: 'Users' });
  const [expandedItem, setExpandedItem] = useState<number | null>(0);

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
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [key]: value };
    setData({ ...data, items: newItems });
  };

  const handleConfirmAddItem = () => {
    if (!newItem.value || !newItem.label) {
      alert('Value dan Label harus diisi!');
      return;
    }
    setIsDirty?.(true);
    const list = data.items || [];
    setData({
      ...data,
      items: [...list, newItem]
    });
    setNewItem({ value: '', label: '', description: '', icon: 'Users' });
    setShowAddModal(false);
    setExpandedItem(list.length);
  };

  const removeItem = (index: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus pencapaian ini?")) {
      return;
    }
    setIsDirty?.(true);
    setData({ ...data, items: data.items.filter((_: any, i: number) => i !== index) });
    setExpandedItem(null);
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
    <div className="max-w-4xl space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#eae6dd] pb-4">
        <div>
          <h1 className="text-xl font-bold text-[#1c1515]">Editor Pencapaian</h1>
          <p className="text-xs text-neutral-500 mt-0.5">Kelola data pencapaian dan statistik utama KSPM</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex justify-center items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#dcae44] to-[#b88c2b] text-white font-bold text-xs rounded-lg hover:brightness-105 transition-all disabled:opacity-60 shadow-[0_2px_8px_rgba(195,147,49,0.1)]"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan
        </button>
      </div>

      <div className="bg-white border border-[#eae6dd] rounded-xl p-4 space-y-3 shadow-sm">
        <h2 className="font-script text-[10px] text-[#a67e2a] font-bold tracking-[0.12em]">Meta Informasi</h2>
        <div>
          <label className="font-script text-[10px] text-neutral-500 block mb-1">Main Title</label>
          <input
            type="text"
            value={data.mainTitle}
            onChange={(e) => updateField('mainTitle', e.target.value)}
            className="w-full text-xs bg-[#faf9f5] border-b border-[#d2cbbe] hover:border-[#a67e2a] focus:border-[#a67e2a] px-2 py-1.5 focus:bg-white transition-all outline-none rounded-t duration-200 text-[#1c1515]"
          />
        </div>
        <div>
          <label className="font-script text-[10px] text-neutral-500 block mb-1">Subtitle</label>
          <textarea
            value={data.subtitle}
            onChange={(e) => updateField('subtitle', e.target.value)}
            rows={2}
            className="w-full text-xs bg-[#faf9f5] border-b border-[#d2cbbe] hover:border-[#a67e2a] focus:border-[#a67e2a] px-2 py-1.5 focus:bg-white transition-all outline-none rounded-t duration-200 text-[#1c1515] resize-none"
          />
        </div>
      </div>

      <div className="bg-white border border-[#eae6dd] rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#eae6dd]/40 pb-2">
          <h2 className="font-script text-[10px] text-[#a67e2a] font-bold tracking-[0.12em]">Daftar Pencapaian ({data.items.length})</h2>
          <button
            onClick={() => {
              setNewItem({ value: '', label: '', description: '', icon: 'Users' });
              setShowAddModal(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1 text-[10px] bg-[#faf9f5] border border-[#d2cbbe] rounded hover:bg-neutral-100 text-[#1c1515] font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah
          </button>
        </div>

        <div className="space-y-2">
          {data.items.map((item: any, i: number) => {
            const isExpanded = expandedItem === i;
            return (
              <div key={i} className="border border-[#eae6dd] rounded-lg overflow-hidden bg-[#faf9f5]/30">
                <div 
                  onClick={() => setExpandedItem(isExpanded ? null : i)}
                  className="flex items-center justify-between px-3 py-2 bg-white border-b border-[#eae6dd] cursor-pointer hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-[#a67e2a]">#{i + 1}</span>
                    <span className="text-xs font-bold text-[#1c1515]">{item.label || 'Pencapaian Baru'}</span>
                    <span className="text-[10px] text-neutral-400">({item.value})</span>
                  </div>
                  <div className="flex items-center gap-0.5" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => moveItem(i, 'up')}
                      disabled={i === 0}
                      className="p-1 text-neutral-400 hover:text-neutral-600 disabled:opacity-30"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      onClick={() => moveItem(i, 'down')}
                      disabled={i === data.items.length - 1}
                      className="p-1 text-neutral-400 hover:text-neutral-600 disabled:opacity-30"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      onClick={() => removeItem(i)}
                      className="p-1 text-neutral-400 hover:text-red-600 rounded transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={13} />
                    </button>
                    <button 
                      onClick={() => setExpandedItem(isExpanded ? null : i)}
                      className="p-1 text-neutral-500 rounded hover:bg-neutral-100 animate-none"
                    >
                      {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-3 space-y-3 bg-[#faf9f5]/50 border-t border-[#eae6dd]/40">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="font-script text-[9px] text-neutral-500 block mb-1">Angka / Value (Contoh: 500+)</label>
                        <input
                          type="text"
                          value={item.value}
                          onChange={(e) => updateItem(i, 'value', e.target.value)}
                          className="w-full text-xs bg-white border border-[#d2cbbe] rounded px-2 py-1 text-[#1c1515] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-script text-[9px] text-neutral-500 block mb-1">Label (Contoh: Alumni Aktif)</label>
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => updateItem(i, 'label', e.target.value)}
                          className="w-full text-xs bg-white border border-[#d2cbbe] rounded px-2 py-1 text-[#1c1515] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-script text-[9px] text-neutral-500 block mb-1">Icon Lucide</label>
                        <input
                          type="text"
                          value={item.icon}
                          onChange={(e) => updateItem(i, 'icon', e.target.value)}
                          className="w-full text-xs bg-white border border-[#d2cbbe] rounded px-2 py-1 text-[#1c1515] focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-script text-[9px] text-neutral-500 block mb-1">Deskripsi Singkat</label>
                      <textarea
                        value={item.description}
                        onChange={(e) => updateItem(i, 'description', e.target.value)}
                        rows={2}
                        className="w-full text-xs bg-white border border-[#d2cbbe] rounded px-2 py-1 text-[#1c1515] focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-[#eae6dd] rounded-xl p-4 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-[#1c1515]">Tambah Pencapaian baru</h3>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-script text-[10px] text-neutral-500 block mb-1">Value (Contoh: 100+)</label>
                  <input
                    type="text"
                    value={newItem.value}
                    onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
                    placeholder="Misal: 100+"
                    className="w-full px-2.5 py-1.5 bg-[#faf9f5] border border-[#d2cbbe] rounded text-[#1c1515] text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-script text-[10px] text-neutral-500 block mb-1">Icon</label>
                  <input
                    type="text"
                    value={newItem.icon}
                    onChange={(e) => setNewItem({ ...newItem, icon: e.target.value })}
                    placeholder="Misal: Users"
                    className="w-full px-2.5 py-1.5 bg-[#faf9f5] border border-[#d2cbbe] rounded text-[#1c1515] text-xs focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Label</label>
                <input
                  type="text"
                  value={newItem.label}
                  onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                  placeholder="Misal: Riset Terbit"
                  className="w-full px-2.5 py-1.5 bg-[#faf9f5] border border-[#d2cbbe] rounded text-[#1c1515] text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Deskripsi</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  rows={2}
                  placeholder="Deskripsi pencapaian..."
                  className="w-full px-2.5 py-1.5 bg-[#faf9f5] border border-[#d2cbbe] rounded text-[#1c1515] text-xs focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#eae6dd]">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 text-xs bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 rounded transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAddItem}
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
