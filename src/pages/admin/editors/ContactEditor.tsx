import { useState, useEffect } from 'react';
import { getContent, saveContent } from '../lib/adminApi';
import { contactFormConfig } from '../../../config';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function ContactEditor({ setIsDirty }: { setIsDirty?: (dirty: boolean) => void }) {
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
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1c1515]">Editor Kontak</h1>
          <p className="text-neutral-500 text-sm mt-1">Kelola informasi kontak dan form</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-gradient-to-r from-[#dcae44] to-[#b88c2b] text-white font-bold px-4 py-2 rounded-xl hover:brightness-105 transition-colors disabled:opacity-50 shadow-[0_4px_12px_rgba(195,147,49,0.15)]">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan
        </button>
      </div>

      {/* Section Info */}
      <div className="bg-white border border-[#eae6dd] rounded-2xl p-6 space-y-4 shadow-sm">
        <h2 className="text-[#a67e2a] font-bold text-sm uppercase tracking-wider">Info Section</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-neutral-500 text-xs mb-1">Main Title</label>
            <input type="text" value={data.mainTitle || ''} onChange={e => updateField('mainTitle', e.target.value)} className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-lg px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
          </div>
          <div>
            <label className="block text-neutral-500 text-xs mb-1">WhatsApp Link</label>
            <input type="text" value={data.whatsappLink || ''} onChange={e => updateField('whatsappLink', e.target.value)} className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-lg px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
          </div>
        </div>
        <div>
          <label className="block text-neutral-500 text-xs mb-1">Intro Text</label>
          <textarea value={data.introText || ''} onChange={e => updateField('introText', e.target.value)} rows={2} className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-lg px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
        </div>
      </div>

      {/* Contact Info Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[#1c1515] font-bold">Info Kontak ({data.contactInfo?.length || 0})</h2>
          <button
            onClick={() => {
              setNewContact({ icon: 'MapPin', label: '', value: '', subtext: '' });
              setShowAddContactModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#faf9f5] border border-[#d2cbbe] rounded-lg hover:bg-neutral-100 text-[#1c1515] font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah
          </button>
        </div>

        {data.contactInfo?.map((item: any, i: number) => (
          <div key={i} className="bg-white border border-[#eae6dd] rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#eae6dd] pb-2">
              <span className="text-[#a67e2a] font-bold text-sm uppercase">Item #{i + 1}</span>
              <button onClick={() => removeContactInfo(i)} className="text-neutral-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-500 text-xs mb-1">Icon (MapPin, Phone, Mail, Clock)</label>
                <select value={item.icon || ''} onChange={e => updateContactInfo(i, 'icon', e.target.value)} className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-lg px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]">
                  <option value="MapPin">MapPin</option>
                  <option value="Phone">Phone</option>
                  <option value="Mail">Mail</option>
                  <option value="Clock">Clock</option>
                </select>
              </div>
              <div>
                <label className="block text-neutral-500 text-xs mb-1">Label</label>
                <input type="text" value={item.label || ''} onChange={e => updateContactInfo(i, 'label', e.target.value)} className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-lg px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-500 text-xs mb-1">Value</label>
                <input type="text" value={item.value || ''} onChange={e => updateContactInfo(i, 'value', e.target.value)} className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-lg px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
              </div>
              <div>
                <label className="block text-neutral-500 text-xs mb-1">Subtext</label>
                <input type="text" value={item.subtext || ''} onChange={e => updateContactInfo(i, 'subtext', e.target.value)} className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-lg px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
              </div>
            </div>
          </div>
        ))}
      </div>
      {showAddContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white border border-[#eae6dd] rounded-2xl p-6 shadow-2xl space-y-4 my-8 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-[#1c1515]">Tambah Info Kontak</h3>
            
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Icon (MapPin, Phone, Mail, Clock)</label>
                <select
                  value={newContact.icon}
                  onChange={(e) => setNewContact({ ...newContact, icon: e.target.value })}
                  className="w-full px-3 py-2 bg-[#faf9f5] border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                >
                  <option value="MapPin">MapPin</option>
                  <option value="Phone">Phone</option>
                  <option value="Mail">Mail</option>
                  <option value="Clock">Clock</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Label</label>
                <input
                  type="text"
                  value={newContact.label}
                  onChange={(e) => setNewContact({ ...newContact, label: e.target.value })}
                  placeholder="Misal: Alamat"
                  className="w-full px-3 py-2 bg-[#faf9f5] border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Value (Nilai Utama)</label>
                <input
                  type="text"
                  value={newContact.value}
                  onChange={(e) => setNewContact({ ...newContact, value: e.target.value })}
                  placeholder="Misal: Jalan Raya No. 12"
                  className="w-full px-3 py-2 bg-[#faf9f5] border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Subtext (Keterangan Tambahan)</label>
                <input
                  type="text"
                  value={newContact.subtext}
                  onChange={(e) => setNewContact({ ...newContact, subtext: e.target.value })}
                  placeholder="Misal: Bogor, Jawa Barat"
                  className="w-full px-3 py-2 bg-[#faf9f5] border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-[#eae6dd]">
              <button
                type="button"
                onClick={() => setShowAddContactModal(false)}
                className="px-4 py-2 text-sm bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAddContact}
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
