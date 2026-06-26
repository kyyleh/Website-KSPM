import { useState, useEffect } from 'react';
import { getContent, saveContent } from '../lib/adminApi';
import { contactFormConfig } from '../../../config';
import { Save, Loader2, CheckCircle, AlertCircle, Plus, Trash2 } from 'lucide-react';

export function ContactEditor() {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [newContact, setNewContact] = useState({ icon: 'Info', label: '', value: '', subtext: '' });

  useEffect(() => {
    (async () => {
      try {
        const res = await getContent('contact');
        setData(res.content || contactFormConfig);
      } catch {
        setData(contactFormConfig);
      }
    })();
  }, []);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveContent('contact', data);
      showToast('success', 'Data kontak berhasil disimpan!');
    } catch {
      showToast('error', 'Gagal menyimpan data.');
    }
    setSaving(false);
  };

  if (!data) return <div className="text-white">Memuat...</div>;

  const updateField = (key: string, value: any) => setData({ ...data, [key]: value });

  const updateContactInfo = (index: number, key: string, value: any) => {
    const contactInfo = [...data.contactInfo];
    contactInfo[index] = { ...contactInfo[index], [key]: value };
    setData({ ...data, contactInfo });
  };

  const handleConfirmAddContact = () => {
    if (!newContact.label || !newContact.value) {
      alert('Label dan Value kontak harus diisi!');
      return;
    }
    setData({ ...data, contactInfo: [...data.contactInfo, { ...newContact }] });
    setShowAddContactModal(false);
  };

  const removeContactInfo = (index: number) => {
    setData({ ...data, contactInfo: data.contactInfo.filter((_: any, i: number) => i !== index) });
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg flex items-center gap-2 text-sm ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'} text-white shadow-lg`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Editor Kontak</h1>
          <p className="text-slate-400 text-sm mt-1">Kelola informasi kontak dan form</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan
        </button>
      </div>

      {/* Section Info */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-4">
        <h2 className="text-white font-semibold">Info Section</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 text-xs mb-1">Main Title</label>
            <input type="text" value={data.mainTitle || ''} onChange={e => updateField('mainTitle', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
          </div>
          <div>
            <label className="block text-slate-400 text-xs mb-1">WhatsApp Link</label>
            <input type="text" value={data.whatsappLink || ''} onChange={e => updateField('whatsappLink', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-slate-400 text-xs mb-1">Intro Text</label>
          <textarea value={data.introText || ''} onChange={e => updateField('introText', e.target.value)} rows={2} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
        </div>
      </div>

      {/* Contact Info Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold">Info Kontak ({data.contactInfo?.length || 0})</h2>
          <button
            onClick={() => {
              setNewContact({ icon: 'Info', label: '', value: '', subtext: '' });
              setShowAddContactModal(true);
            }}
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-sm"
          >
            <Plus className="w-4 h-4" /> Tambah
          </button>
        </div>

        {data.contactInfo?.map((item: any, i: number) => (
          <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 font-medium text-sm">Item #{i + 1}</span>
              <button onClick={() => removeContactInfo(i)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 text-xs mb-1">Icon (MapPin, Phone, Mail, Clock)</label>
                <input type="text" value={item.icon || ''} onChange={e => updateContactInfo(i, 'icon', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-slate-400 text-xs mb-1">Label</label>
                <input type="text" value={item.label || ''} onChange={e => updateContactInfo(i, 'label', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 text-xs mb-1">Value</label>
                <input type="text" value={item.value || ''} onChange={e => updateContactInfo(i, 'value', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-slate-400 text-xs mb-1">Subtext</label>
                <input type="text" value={item.subtext || ''} onChange={e => updateContactInfo(i, 'subtext', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
            </div>
          </div>
        ))}
      </div>
      {showAddContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4 my-8 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-white">Tambah Info Kontak</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Icon (MapPin, Phone, Mail, Clock)</label>
                <input
                  type="text"
                  value={newContact.icon}
                  onChange={(e) => setNewContact({ ...newContact, icon: e.target.value })}
                  placeholder="Misal: MapPin"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Label</label>
                <input
                  type="text"
                  value={newContact.label}
                  onChange={(e) => setNewContact({ ...newContact, label: e.target.value })}
                  placeholder="Misal: Alamat"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Value (Nilai Utama)</label>
                <input
                  type="text"
                  value={newContact.value}
                  onChange={(e) => setNewContact({ ...newContact, value: e.target.value })}
                  placeholder="Misal: Jalan Raya No. 12"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Subtext (Keterangan Tambahan)</label>
                <input
                  type="text"
                  value={newContact.subtext}
                  onChange={(e) => setNewContact({ ...newContact, subtext: e.target.value })}
                  placeholder="Misal: Bogor, Jawa Barat"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddContactModal(false)}
                className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAddContact}
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
