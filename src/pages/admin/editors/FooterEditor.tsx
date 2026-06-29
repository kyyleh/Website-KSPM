import { useState, useEffect } from 'react';
import { getContent, saveContent } from '../lib/adminApi';
import { footerConfig } from '../../../config';
import { Save, Plus, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function FooterEditor({ setIsDirty }: { setIsDirty?: (dirty: boolean) => void }) {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [showAddSocialModal, setShowAddSocialModal] = useState(false);
  const [newSocial, setNewSocial] = useState({ icon: 'Instagram', label: '', href: '' });

  useEffect(() => {
    (async () => {
      try {
        const res = await getContent('footer');
        setData(res.content ? { ...footerConfig, ...res.content } : footerConfig);
      } catch (err: any) {
        toast.error('Gagal memuat data Footer dari server.');
        setData(footerConfig);
      }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveContent('footer', data);
      setIsDirty?.(false);
      toast.success('Footer berhasil disimpan!');
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

  const updateSocialLink = (index: number, key: string, value: any) => {
    setIsDirty?.(true);
    const socialLinks = [...data.socialLinks];
    socialLinks[index] = { ...socialLinks[index], [key]: value };
    setData({ ...data, socialLinks });
  };

  const handleConfirmAddSocial = () => {
    if (!newSocial.label || !newSocial.href) {
      alert('Label dan URL social link harus diisi!');
      return;
    }
    setIsDirty?.(true);
    setData({ ...data, socialLinks: [...data.socialLinks, { ...newSocial }] });
    setShowAddSocialModal(false);
  };

  const removeSocialLink = (index: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus tautan sosial ini?")) {
      return;
    }
    setIsDirty?.(true);
    setData({ ...data, socialLinks: data.socialLinks.filter((_: any, i: number) => i !== index) });
  };

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1c1515]">Editor Footer</h1>
          <p className="text-neutral-500 text-sm mt-1">Kelola konten footer website</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-gradient-to-r from-[#dcae44] to-[#b88c2b] text-white font-bold px-4 py-2 rounded-xl hover:brightness-105 transition-colors disabled:opacity-50 shadow-[0_4px_12px_rgba(195,147,49,0.15)]">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan
        </button>
      </div>

      {/* Brand Info */}
      <div className="bg-white border border-[#eae6dd] rounded-2xl p-6 space-y-4 shadow-sm">
        <h2 className="text-[#a67e2a] font-bold text-sm uppercase tracking-wider">Info Brand</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-neutral-500 text-xs mb-1">Brand Name</label>
            <input type="text" value={data.brandName || ''} onChange={e => updateField('brandName', e.target.value)} className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-lg px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
          </div>
          <div>
            <label className="block text-neutral-500 text-xs mb-1">Tagline</label>
            <input type="text" value={data.tagline || ''} onChange={e => updateField('tagline', e.target.value)} className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-lg px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
          </div>
        </div>
        <div>
          <label className="block text-neutral-500 text-xs mb-1">Deskripsi</label>
          <textarea value={data.description || ''} onChange={e => updateField('description', e.target.value)} rows={2} className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-lg px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
        </div>
        <div>
          <label className="block text-neutral-500 text-xs mb-1">Copyright Text</label>
          <input type="text" value={data.copyrightText || ''} onChange={e => updateField('copyrightText', e.target.value)} className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-lg px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[#1c1515] font-bold">Social Links ({data.socialLinks?.length || 0})</h2>
          <button
            onClick={() => {
              setNewSocial({ icon: 'Instagram', label: '', href: '' });
              setShowAddSocialModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#faf9f5] border border-[#d2cbbe] rounded-lg hover:bg-neutral-100 text-[#1c1515] font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah
          </button>
        </div>

        {data.socialLinks?.map((link: any, i: number) => (
          <div key={i} className="bg-white border border-[#eae6dd] rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#eae6dd] pb-2">
              <span className="text-[#a67e2a] font-bold text-sm uppercase">Link #{i + 1}</span>
              <button onClick={() => removeSocialLink(i)} className="text-neutral-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-neutral-500 text-xs mb-1">Icon (Instagram, Linkedin, Youtube, etc.)</label>
                <select value={link.icon || ''} onChange={e => updateSocialLink(i, 'icon', e.target.value)} className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-lg px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]">
                  <option value="Instagram">Instagram</option>
                  <option value="Linkedin">Linkedin</option>
                  <option value="Youtube">Youtube</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Twitter">Twitter</option>
                  <option value="Globe">Globe</option>
                  <option value="Mail">Mail</option>
                </select>
              </div>
              <div>
                <label className="block text-neutral-500 text-xs mb-1">Label</label>
                <input type="text" value={link.label || ''} onChange={e => updateSocialLink(i, 'label', e.target.value)} className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-lg px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
              </div>
              <div>
                <label className="block text-neutral-500 text-xs mb-1">URL</label>
                <input type="text" value={link.href || ''} onChange={e => updateSocialLink(i, 'href', e.target.value)} className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-lg px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
              </div>
            </div>
          </div>
        ))}
      </div>
      {showAddSocialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white border border-[#eae6dd] rounded-2xl p-6 shadow-2xl space-y-4 my-8 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-[#1c1515]">Tambah Social Link</h3>
            
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Icon (Instagram, Linkedin, Youtube, Facebook, etc.)</label>
                <select
                  value={newSocial.icon}
                  onChange={(e) => setNewSocial({ ...newSocial, icon: e.target.value })}
                  className="w-full px-3 py-2 bg-[#faf9f5] border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                >
                  <option value="Instagram">Instagram</option>
                  <option value="Linkedin">Linkedin</option>
                  <option value="Youtube">Youtube</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Twitter">Twitter</option>
                  <option value="Globe">Globe</option>
                  <option value="Mail">Mail</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Label</label>
                <input
                  type="text"
                  value={newSocial.label}
                  onChange={(e) => setNewSocial({ ...newSocial, label: e.target.value })}
                  placeholder="Misal: Instagram KSPM"
                  className="w-full px-3 py-2 bg-[#faf9f5] border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">URL (Tautan)</label>
                <input
                  type="text"
                  value={newSocial.href}
                  onChange={(e) => setNewSocial({ ...newSocial, href: e.target.value })}
                  placeholder="Misal: https://instagram.com/kspm_uika"
                  className="w-full px-3 py-2 bg-[#faf9f5] border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-[#eae6dd]">
              <button
                type="button"
                onClick={() => setShowAddSocialModal(false)}
                className="px-4 py-2 text-sm bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAddSocial}
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
