import { useState, useEffect } from 'react';
import { getContent, saveContent } from '../lib/adminApi';
import { footerConfig } from '../../../config';
import { Save, Plus, Trash2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export function FooterEditor() {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [showAddSocialModal, setShowAddSocialModal] = useState(false);
  const [newSocial, setNewSocial] = useState({ icon: '', label: '', href: '' });

  useEffect(() => {
    (async () => {
      try {
        const res = await getContent('footer');
        setData(res.content || footerConfig);
      } catch {
        setData(footerConfig);
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
      await saveContent('footer', data);
      showToast('success', 'Footer berhasil disimpan!');
    } catch {
      showToast('error', 'Gagal menyimpan data.');
    }
    setSaving(false);
  };

  if (!data) return <div className="text-white">Memuat...</div>;

  const updateField = (key: string, value: any) => setData({ ...data, [key]: value });

  const updateSocialLink = (index: number, key: string, value: any) => {
    const socialLinks = [...data.socialLinks];
    socialLinks[index] = { ...socialLinks[index], [key]: value };
    setData({ ...data, socialLinks });
  };

  const handleConfirmAddSocial = () => {
    if (!newSocial.label || !newSocial.href) {
      alert('Label dan URL social link harus diisi!');
      return;
    }
    setData({ ...data, socialLinks: [...data.socialLinks, { ...newSocial }] });
    setShowAddSocialModal(false);
  };

  const removeSocialLink = (index: number) => {
    setData({ ...data, socialLinks: data.socialLinks.filter((_: any, i: number) => i !== index) });
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
          <h1 className="text-2xl font-bold text-white">Editor Footer</h1>
          <p className="text-slate-400 text-sm mt-1">Kelola konten footer website</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan
        </button>
      </div>

      {/* Brand Info */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-4">
        <h2 className="text-white font-semibold">Info Brand</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 text-xs mb-1">Brand Name</label>
            <input type="text" value={data.brandName || ''} onChange={e => updateField('brandName', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
          </div>
          <div>
            <label className="block text-slate-400 text-xs mb-1">Tagline</label>
            <input type="text" value={data.tagline || ''} onChange={e => updateField('tagline', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-slate-400 text-xs mb-1">Deskripsi</label>
          <textarea value={data.description || ''} onChange={e => updateField('description', e.target.value)} rows={2} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
        </div>
        <div>
          <label className="block text-slate-400 text-xs mb-1">Copyright Text</label>
          <input type="text" value={data.copyrightText || ''} onChange={e => updateField('copyrightText', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold">Social Links ({data.socialLinks?.length || 0})</h2>
          <button
            onClick={() => {
              setNewSocial({ icon: '', label: '', href: '' });
              setShowAddSocialModal(true);
            }}
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-sm"
          >
            <Plus className="w-4 h-4" /> Tambah
          </button>
        </div>

        {data.socialLinks?.map((link: any, i: number) => (
          <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-amber-400 font-medium text-sm">Link #{i + 1}</span>
              <button onClick={() => removeSocialLink(i)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 text-xs mb-1">Icon (Instagram, Linkedin, Youtube, etc.)</label>
                <input type="text" value={link.icon || ''} onChange={e => updateSocialLink(i, 'icon', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-slate-400 text-xs mb-1">Label</label>
                <input type="text" value={link.label || ''} onChange={e => updateSocialLink(i, 'label', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-slate-400 text-xs mb-1">URL</label>
                <input type="text" value={link.href || ''} onChange={e => updateSocialLink(i, 'href', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
            </div>
          </div>
        ))}
      </div>
      {showAddSocialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4 my-8 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-white">Tambah Social Link</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Icon (Instagram, Linkedin, Youtube, Facebook, etc.)</label>
                <input
                  type="text"
                  value={newSocial.icon}
                  onChange={(e) => setNewSocial({ ...newSocial, icon: e.target.value })}
                  placeholder="Misal: Instagram"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Label</label>
                <input
                  type="text"
                  value={newSocial.label}
                  onChange={(e) => setNewSocial({ ...newSocial, label: e.target.value })}
                  placeholder="Misal: Instagram KSPM"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">URL (Tautan)</label>
                <input
                  type="text"
                  value={newSocial.href}
                  onChange={(e) => setNewSocial({ ...newSocial, href: e.target.value })}
                  placeholder="Misal: https://instagram.com/kspm_uika"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddSocialModal(false)}
                className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAddSocial}
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
