import { useState, useEffect } from 'react';
import { getContent, saveContent } from '../lib/adminApi';
import { risetPublikasiConfig } from '../../../config';
import { Save, Plus, Trash2, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { ImageUploader } from '../components/ImageUploader';
import { ConfirmModal } from '../components/ConfirmModal';
import { toast } from 'sonner';

export function EditorRiset({ setIsDirty }: { setIsDirty?: (dirty: boolean) => void }) {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [showAddProgramModal, setShowAddProgramModal] = useState(false);
  const [newProgram, setNewProgram] = useState({
    name: '', image: '', description: ''
  });
  const [expandedProgram, setExpandedProgram] = useState<number | null>(0);

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
        const res = await getContent('research');
        if (res && res.content) {
          setData({
            ...risetPublikasiConfig,
            ...res.content,
            programs: res.content.programs || res.content.wines || risetPublikasiConfig.programs,
            features: res.content.features || risetPublikasiConfig.features,
          });
        } else {
          setData(risetPublikasiConfig);
        }
      } catch (err: any) {
        toast.error('Gagal memuat data Riset dari server.');
        setData(risetPublikasiConfig);
      }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        wines: data.programs,     // Double write for backward compatibility
        programs: data.programs,
      };
      await saveContent('research', payload);
      setIsDirty?.(false);
      toast.success('Data riset berhasil disimpan!');
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

  const updateProgram = (index: number, key: string, value: any) => {
    setIsDirty?.(true);
    const programs = [...data.programs];
    programs[index] = { ...programs[index], [key]: value };
    setData({ ...data, programs });
  };

  const handleConfirmAddProgram = () => {
    if (!newProgram.name) {
      alert('Nama program harus diisi!');
      return;
    }
    setIsDirty?.(true);
    const list = data.programs || [];
    setData({
      ...data,
      programs: [...list, { id: Date.now().toString(), ...newProgram }],
    });
    setShowAddProgramModal(false);
    setExpandedProgram(list.length);
  };

  const removeProgram = (index: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Program Riset',
      message: 'Apakah Anda yakin ingin menghapus program riset ini?',
      onConfirm: () => {
        setIsDirty?.(true);
        setData({ ...data, programs: data.programs.filter((_: any, i: number) => i !== index) });
        setExpandedProgram(null);
      }
    });
  };

  return (
    <div className="max-w-4xl space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#eae6dd] pb-4">
        <div>
          <h1 className="text-xl font-bold text-[#1c1515]">Editor Riset & Program</h1>
          <p className="text-xs text-neutral-500 mt-0.5">Kelola program riset dan edukasi pasar modal</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex justify-center items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#dcae44] to-[#b88c2b] text-white font-bold text-xs rounded-lg hover:brightness-105 transition-all disabled:opacity-60 shadow-[0_2px_8px_rgba(195,147,49,0.1)]">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan
        </button>
      </div>

      {/* Section Info */}
      <div className="bg-white border border-[#eae6dd] rounded-xl p-4 space-y-3.5 shadow-sm">
        <h2 className="font-script text-[10px] text-[#a67e2a] font-bold tracking-[0.12em]">Header Halaman</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="font-script text-[10px] text-neutral-500 block mb-1">Judul Header</label>
            <input type="text" value={data.researchHeaderTitle || ''} onChange={e => updateField('researchHeaderTitle', e.target.value)} className="w-full text-xs bg-[#faf9f5] border-b border-[#d2cbbe] hover:border-[#a67e2a] focus:border-[#a67e2a] px-2 py-1.5 focus:bg-white transition-all outline-none rounded-t duration-200 text-[#1c1515]" />
          </div>
          <div>
            <label className="font-script text-[10px] text-neutral-500 block mb-1">Gambar Header</label>
            <ImageUploader value={data.researchHeaderImage || ''} onChange={(url) => updateField('researchHeaderImage', url)} />
          </div>
        </div>
        <div>
          <label className="font-script text-[10px] text-neutral-500 block mb-1">Deskripsi Header</label>
          <textarea value={data.researchHeaderDescription || ''} onChange={e => updateField('researchHeaderDescription', e.target.value)} rows={2} className="w-full text-xs bg-[#faf9f5] border-b border-[#d2cbbe] hover:border-[#a67e2a] focus:border-[#a67e2a] px-2 py-1.5 focus:bg-white transition-all outline-none rounded-t duration-200 text-[#1c1515] resize-none" />
        </div>

        <h2 className="font-script text-[10px] text-[#a67e2a] font-bold tracking-[0.12em] pt-2 border-t border-[#eae6dd]">Detail Program Riset</h2>
        <div>
          <label className="font-script text-[10px] text-neutral-500 block mb-1">Judul Utama (Main Title)</label>
          <input type="text" value={data.mainTitle || ''} onChange={e => updateField('mainTitle', e.target.value)} className="w-full text-xs bg-[#faf9f5] border-b border-[#d2cbbe] hover:border-[#a67e2a] focus:border-[#a67e2a] px-2 py-1.5 focus:bg-white transition-all outline-none rounded-t duration-200 text-[#1c1515]" />
        </div>
      </div>

      {/* Programs List */}
      <div className="bg-white border border-[#eae6dd] rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#eae6dd]/40 pb-2">
          <h2 className="font-script text-[10px] text-[#a67e2a] font-bold tracking-[0.12em]">Program Riset ({data.programs?.length || 0})</h2>
          <button
            onClick={() => {
              setNewProgram({
                name: '', image: '', description: ''
              });
              setShowAddProgramModal(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1 text-[10px] bg-[#faf9f5] border border-[#d2cbbe] rounded hover:bg-neutral-100 text-[#1c1515] font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah
          </button>
        </div>

        <div className="space-y-2">
          {data.programs?.map((program: any, i: number) => {
            const isExpanded = expandedProgram === i;
            return (
              <div key={i} className="border border-[#eae6dd] rounded-lg overflow-hidden bg-[#faf9f5]/30">
                {/* Header bar (Click to collapse/expand) */}
                <div 
                  onClick={() => setExpandedProgram(isExpanded ? null : i)}
                  className="flex items-center justify-between px-3 py-2 bg-white border-b border-[#eae6dd] cursor-pointer hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-[#a67e2a]">#{i + 1}</span>
                    <span className="text-xs font-bold text-[#1c1515]">{program.name || 'Program Riset Baru'}</span>
                  </div>
                  <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => removeProgram(i)}
                      className="p-1 text-neutral-400 hover:text-red-600 rounded transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={14} />
                    </button>
                    <button 
                      onClick={() => setExpandedProgram(isExpanded ? null : i)}
                      className="p-1 text-neutral-500 rounded hover:bg-neutral-100"
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>

                {/* Collapsible Content */}
                {isExpanded && (
                  <div className="p-3 space-y-3 bg-[#faf9f5]/50 border-t border-[#eae6dd]/40">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
                      <div>
                        <label className="font-script text-[9px] text-neutral-500 block mb-1">Nama Program</label>
                        <input type="text" value={program.name || ''} onChange={e => updateProgram(i, 'name', e.target.value)} className="w-full text-xs bg-white border border-[#d2cbbe] rounded px-2 py-1 text-[#1c1515] focus:outline-none focus:border-[#a67e2a]" />
                      </div>
                      <div>
                        <label className="font-script text-[9px] text-neutral-500 block mb-1">Gambar Program</label>
                        <ImageUploader
                          value={program.image || ''}
                          onChange={(url) => updateProgram(i, 'image', url)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-script text-[9px] text-neutral-500 block mb-1">Deskripsi</label>
                      <textarea value={program.description || ''} onChange={e => updateProgram(i, 'description', e.target.value)} rows={2} className="w-full text-xs bg-white border border-[#d2cbbe] rounded px-2 py-1 text-[#1c1515] focus:outline-none focus:border-[#a67e2a] resize-none" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {showAddProgramModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-[#eae6dd] rounded-xl p-4 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-[#1c1515]">Tambah Program Riset</h3>
            
            <div className="space-y-3">
              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Gambar Utama Program</label>
                <ImageUploader
                  value={newProgram.image}
                  onChange={(url) => setNewProgram({ ...newProgram, image: url })}
                />
              </div>

              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Nama Program</label>
                <input
                  type="text"
                  value={newProgram.name}
                  onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
                  placeholder="Nama program..."
                  className="w-full px-2.5 py-1.5 bg-[#faf9f5] border border-[#d2cbbe] rounded text-xs text-[#1c1515] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-script text-[10px] text-neutral-500 block mb-1">Deskripsi</label>
                <textarea
                  value={newProgram.description}
                  onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
                  rows={3}
                  placeholder="Deskripsi lengkap program..."
                  className="w-full px-2.5 py-1.5 bg-[#faf9f5] border border-[#d2cbbe] rounded text-xs text-[#1c1515] focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#eae6dd]">
              <button
                type="button"
                onClick={() => setShowAddProgramModal(false)}
                className="px-3 py-1.5 text-xs bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 rounded transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAddProgram}
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
