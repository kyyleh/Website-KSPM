import { useState, useEffect } from 'react';
import { getContent, saveContent } from '../lib/adminApi';
import { footerConfig } from '../../../config';
import { Save, Plus, Trash2, Loader2 } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';
import { toast } from 'sonner';

export function EditorFooter({ setIsDirty }: { setIsDirty?: (dirty: boolean) => void }) {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [showAddSocialModal, setShowAddSocialModal] = useState(false);
  const [newSocial, setNewSocial] = useState({ icon: 'Instagram', label: '', href: '' });

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
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Tautan Sosial',
      message: 'Apakah Anda yakin ingin menghapus tautan sosial ini?',
      onConfirm: () => {
        setIsDirty?.(true);
        setData({ ...data, socialLinks: data.socialLinks.filter((_: any, i: number) => i !== index) });
      }
    });
  };

  return (
    <div className="w-full space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#eae6dd] pb-4">
        <div>
          <h1 className="text-xl font-bold text-[#1c1515]">Editor Footer</h1>
          <p className="text-xs text-neutral-500 mt-0.5">Kelola konten footer website</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex justify-center items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#dcae44] to-[#b88c2b] text-white font-bold text-xs rounded-lg hover:brightness-105 transition-all disabled:opacity-60 shadow-[0_2px_8px_rgba(195,147,49,0.1)]">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan
        </button>
      </div>

      {/* Brand Info */}
      <div className="bg-white border border-[#eae6dd] rounded-xl p-4 space-y-3.5 shadow-sm">
        <h2 className="font-script text-[10px] text-[#a67e2a] font-bold tracking-[0.12em]">Info Brand</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="font-script text-[10px] text-neutral-500 block mb-1">Nama Brand</label>
            <input type="text" value={data.brandName || ''} onChange={e => updateField('brandName', e.target.value)} className="w-full text-xs bg-[#faf9f5] border-b border-[#d2cbbe] hover:border-[#a67e2a] focus:border-[#a67e2a] px-2 py-1.5 focus:bg-white transition-all outline-none rounded-t duration-200 text-[#1c1515]" />
          </div>
          <div>
            <label className="font-script text-[10px] text-neutral-500 block mb-1">Tagline</label>
            <input type="text" value={data.tagline || ''} onChange={e => updateField('tagline', e.target.value)} className="w-full text-xs bg-[#faf9f5] border-b border-[#d2cbbe] hover:border-[#a67e2a] focus:border-[#a67e2a] px-2 py-1.5 focus:bg-white transition-all outline-none rounded-t duration-200 text-[#1c1515]" />
          </div>
        </div>
        <div>
          <label className="font-script text-[10px] text-neutral-500 block mb-1">Deskripsi</label>
          <textarea value={data.description || ''} onChange={e => updateField('description', e.target.value)} rows={2} className="w-full text-xs bg-[#faf9f5] border-b border-[#d2cbbe] hover:border-[#a67e2a] focus:border-[#a67e2a] px-2 py-1.5 focus:bg-white transition-all outline-none rounded-t duration-200 text-[#1c1515] resize-none" />
        </div>
        <div>
          <label className="font-script text-[10px] text-neutral-500 block mb-1">Teks Hak Cipta (Copyright)</label>
          <input type="text" value={data.copyrightText || ''} onChange={e => updateField('copyrightText', e.target.value)} className="w-full text-xs bg-[#faf9f5] border-b border-[#d2cbbe] hover:border-[#a67e2a] focus:border-[#a67e2a] px-2 py-1.5 focus:bg-white transition-all outline-none rounded-t duration-200 text-[#1c1515]" />
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white border border-[#eae6dd] rounded-xl p-4 space-y-3.5 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#eae6dd]/40 pb-2">
          <h2 className="font-script text-[10px] text-[#a67e2a] font-bold tracking-[0.12em]">Tautan Media Sosial ({data.socialLinks?.length || 0})</h2>
          <button
            onClick={() => {
              setNewSocial({ icon: 'Instagram', label: '', href: '' });
              setShowAddSocialModal(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1 text-[10px] bg-[#faf9f5] border border-[#d2cbbe] rounded hover:bg-neutral-100 text-[#1c1515] font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.socialLinks?.map((link: any, i: number) => (
            <div key={i} className="p-3 bg-[#faf9f5]/50 border border-[#eae6dd] rounded-lg space-y-2 relative pt-8 group">
              <button 
                onClick={() => removeSocialLink(i)} 
                className="absolute top-2 right-2 text-neutral-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                title="Hapus tautan sosial"
              >
                <Trash2 size={13} />
              </button>
              
              <span className="absolute top-2 left-3 font-mono text-[9px] font-bold text-neutral-400">LINK #{i + 1}</span>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-script text-[9px] text-[#a67e2a] font-bold block mb-0.5">Ikon</label>
                  <select value={link.icon || ''} onChange={e => updateSocialLink(i, 'icon', e.target.value)} className="w-full text-xs bg-white border border-[#d2cbbe] rounded px-1.5 py-0.5 text-[#1c1515] focus:outline-none">
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
                  <label className="font-script text-[9px] text-[#a67e2a] font-bold block mb-0.5">Label</label>
                  <input type="text" value={link.label || ''} onChange={e => updateSocialLink(i, 'label', e.target.value)} className="w-full text-xs bg-white border border-[#d2cbbe] rounded px-1.5 py-0.5 text-[#1c1515] focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="font-script text-[9px] text-[#a67e2a] font-bold block mb-0.5">Tautan URL</label>
                <input type="text" value={link.href || ''} onChange={e => updateSocialLink(i, 'href', e.target.value)} className="w-full text-xs bg-white border border-[#d2cbbe] rounded px-1.5 py-0.5 text-[#1c1515] focus:outline-none" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddSocialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-[#eae6dd] rounded-xl p-4 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-[#1c1515]">Tambah Tautan Media Sosial</h3>
            
            <div className="space-y-3">
              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Ikon (Instagram, Linkedin, dll.)</label>
                <select
                  value={newSocial.icon}
                  onChange={(e) => setNewSocial({ ...newSocial, icon: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-[#faf9f5] border border-[#d2cbbe] rounded text-xs text-[#1c1515] focus:outline-none"
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
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Label</label>
                <input
                  type="text"
                  value={newSocial.label}
                  onChange={(e) => setNewSocial({ ...newSocial, label: e.target.value })}
                  placeholder="Misal: Instagram KSPM"
                  className="w-full px-2.5 py-1.5 bg-[#faf9f5] border border-[#d2cbbe] rounded text-[#1c1515] text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">URL (Tautan)</label>
                <input
                  type="text"
                  value={newSocial.href}
                  onChange={(e) => setNewSocial({ ...newSocial, href: e.target.value })}
                  placeholder="Misal: https://instagram.com/kspm_uika"
                  className="w-full px-2.5 py-1.5 bg-[#faf9f5] border border-[#d2cbbe] rounded text-[#1c1515] text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#eae6dd]">
              <button
                type="button"
                onClick={() => setShowAddSocialModal(false)}
                className="px-3 py-1.5 text-xs bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 rounded transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAddSocial}
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
