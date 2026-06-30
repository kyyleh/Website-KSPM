import { useState, useEffect } from 'react';
import { getContent, saveContent } from '../lib/adminApi';
import { contactFormConfig } from '../../../config';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function EditorKontak({ setIsDirty }: { setIsDirty?: (dirty: boolean) => void }) {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [newContact, setNewContact] = useState({ icon: 'MapPin', label: '', value: '', subtext: '' });

  useEffect(() => {
    (async () => {
      try {
        const res = await getContent('contact');
        setData(res.content ? { ...contactFormConfig, ...res.content } : contactFormConfig);
      } catch (err: any) {
        toast.error('Gagal memuat data Kontak dari server.');
        setData(contactFormConfig);
      }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveContent('contact', data);
      setIsDirty?.(false);
      toast.success('Data kontak berhasil disimpan!');
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

  const updateContactInfo = (index: number, key: string, value: any) => {
    setIsDirty?.(true);
    const contactInfo = [...data.contactInfo];
    contactInfo[index] = { ...contactInfo[index], [key]: value };
    setData({ ...data, contactInfo });
  };

  const handleConfirmAddContact = () => {
    if (!newContact.label || !newContact.value) {
      alert('Label dan Value kontak harus diisi!');
      return;
    }
    setIsDirty?.(true);
    setData({ ...data, contactInfo: [...data.contactInfo, { ...newContact }] });
    setShowAddContactModal(false);
  };

  const removeContactInfo = (index: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus informasi kontak ini?")) {
      return;
    }
    setIsDirty?.(true);
    setData({ ...data, contactInfo: data.contactInfo.filter((_: any, i: number) => i !== index) });
  };

  return (
    <div className="max-w-4xl space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#eae6dd] pb-4">
        <div>
          <h1 className="text-xl font-bold text-[#1c1515]">Editor Kontak</h1>
          <p className="text-xs text-neutral-500 mt-0.5">Kelola informasi kontak dan form</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex justify-center items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#dcae44] to-[#b88c2b] text-white font-bold text-xs rounded-lg hover:brightness-105 transition-all disabled:opacity-60 shadow-[0_2px_8px_rgba(195,147,49,0.1)]">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan
        </button>
      </div>

      {/* Section Info */}
      <div className="bg-white border border-[#eae6dd] rounded-xl p-4 space-y-3 shadow-sm">
        <h2 className="font-script text-[10px] text-[#a67e2a] font-bold tracking-[0.12em]">Info Section</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="font-script text-[10px] text-neutral-500 block mb-1">Judul Utama</label>
            <input type="text" value={data.mainTitle || ''} onChange={e => updateField('mainTitle', e.target.value)} className="w-full text-xs bg-[#faf9f5] border-b border-[#d2cbbe] hover:border-[#a67e2a] focus:border-[#a67e2a] px-2 py-1.5 focus:bg-white transition-all outline-none rounded-t duration-200 text-[#1c1515]" />
          </div>
          <div>
            <label className="font-script text-[10px] text-neutral-500 block mb-1">Tautan WhatsApp</label>
            <input type="text" value={data.whatsappLink || ''} onChange={e => updateField('whatsappLink', e.target.value)} className="w-full text-xs bg-[#faf9f5] border-b border-[#d2cbbe] hover:border-[#a67e2a] focus:border-[#a67e2a] px-2 py-1.5 focus:bg-white transition-all outline-none rounded-t duration-200 text-[#1c1515]" />
          </div>
        </div>
        <div>
          <label className="font-script text-[10px] text-neutral-500 block mb-1">Teks Pengantar</label>
          <textarea value={data.introText || ''} onChange={e => updateField('introText', e.target.value)} rows={2} className="w-full text-xs bg-[#faf9f5] border-b border-[#d2cbbe] hover:border-[#a67e2a] focus:border-[#a67e2a] px-2 py-1.5 focus:bg-white transition-all outline-none rounded-t duration-200 text-[#1c1515] resize-none" />
        </div>
      </div>

      {/* Contact Info Items */}
      <div className="bg-white border border-[#eae6dd] rounded-xl p-4 space-y-3.5 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#eae6dd]/40 pb-2">
          <h2 className="font-script text-[10px] text-[#a67e2a] font-bold tracking-[0.12em]">Info Kontak ({data.contactInfo?.length || 0})</h2>
          <button
            onClick={() => {
              setNewContact({ icon: 'MapPin', label: '', value: '', subtext: '' });
              setShowAddContactModal(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1 text-[10px] bg-[#faf9f5] border border-[#d2cbbe] rounded hover:bg-neutral-100 text-[#1c1515] font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.contactInfo?.map((item: any, i: number) => (
            <div key={i} className="p-3 bg-[#faf9f5]/50 border border-[#eae6dd] rounded-lg space-y-2 relative pt-8 group">
              <button 
                onClick={() => removeContactInfo(i)} 
                className="absolute top-2 right-2 text-neutral-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                title="Hapus kontak"
              >
                <Trash2 size={13} />
              </button>
              
              <span className="absolute top-2 left-3 font-mono text-[9px] font-bold text-neutral-400">ITEM #{i + 1}</span>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-script text-[9px] text-[#a67e2a] font-bold block mb-0.5">Icon type</label>
                  <select value={item.icon || ''} onChange={e => updateContactInfo(i, 'icon', e.target.value)} className="w-full text-xs bg-white border border-[#d2cbbe] rounded px-1.5 py-0.5 text-[#1c1515] focus:outline-none">
                    <option value="MapPin">MapPin</option>
                    <option value="Phone">Phone</option>
                    <option value="Mail">Mail</option>
                    <option value="Clock">Clock</option>
                  </select>
                </div>
                <div>
                  <label className="font-script text-[9px] text-[#a67e2a] font-bold block mb-0.5">Label</label>
                  <input type="text" value={item.label || ''} onChange={e => updateContactInfo(i, 'label', e.target.value)} className="w-full text-xs bg-white border border-[#d2cbbe] rounded px-1.5 py-0.5 text-[#1c1515] focus:outline-none" />
                </div>
              </div>
              
              <div>
                <label className="font-script text-[9px] text-[#a67e2a] font-bold block mb-0.5">Nilai / Value</label>
                <input type="text" value={item.value || ''} onChange={e => updateContactInfo(i, 'value', e.target.value)} className="w-full text-xs bg-white border border-[#d2cbbe] rounded px-1.5 py-0.5 text-[#1c1515] focus:outline-none" />
              </div>
              
              <div>
                <label className="font-script text-[9px] text-[#a67e2a] font-bold block mb-0.5">Subteks</label>
                <input type="text" value={item.subtext || ''} onChange={e => updateContactInfo(i, 'subtext', e.target.value)} className="w-full text-xs bg-white border border-[#d2cbbe] rounded px-1.5 py-0.5 text-[#1c1515] focus:outline-none" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-[#eae6dd] rounded-xl p-4 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-[#1c1515]">Tambah Info Kontak</h3>
            
            <div className="space-y-3">
              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Icon (MapPin, Phone, Mail, Clock)</label>
                <select
                  value={newContact.icon}
                  onChange={(e) => setNewContact({ ...newContact, icon: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-[#faf9f5] border border-[#d2cbbe] rounded text-xs text-[#1c1515] focus:outline-none"
                >
                  <option value="MapPin">MapPin</option>
                  <option value="Phone">Phone</option>
                  <option value="Mail">Mail</option>
                  <option value="Clock">Clock</option>
                </select>
              </div>
              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Label</label>
                <input
                  type="text"
                  value={newContact.label}
                  onChange={(e) => setNewContact({ ...newContact, label: e.target.value })}
                  placeholder="Misal: Alamat"
                  className="w-full px-2.5 py-1.5 bg-[#faf9f5] border border-[#d2cbbe] rounded text-xs text-[#1c1515] focus:outline-none"
                />
              </div>
              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Value (Nilai Utama)</label>
                <input
                  type="text"
                  value={newContact.value}
                  onChange={(e) => setNewContact({ ...newContact, value: e.target.value })}
                  placeholder="Misal: Jalan Raya No. 12"
                  className="w-full px-2.5 py-1.5 bg-[#faf9f5] border border-[#d2cbbe] rounded text-xs text-[#1c1515] focus:outline-none"
                />
              </div>
              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Subtext (Keterangan Tambahan)</label>
                <input
                  type="text"
                  value={newContact.subtext}
                  onChange={(e) => setNewContact({ ...newContact, subtext: e.target.value })}
                  placeholder="Misal: Bogor, Jawa Barat"
                  className="w-full px-2.5 py-1.5 bg-[#faf9f5] border border-[#d2cbbe] rounded text-xs text-[#1c1515] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#eae6dd]">
              <button
                type="button"
                onClick={() => setShowAddContactModal(false)}
                className="px-3 py-1.5 text-xs bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 rounded transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAddContact}
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
