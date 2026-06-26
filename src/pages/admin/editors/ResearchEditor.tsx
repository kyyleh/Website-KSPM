import { useState, useEffect } from 'react';
import { getContent, saveContent } from '../lib/adminApi';
import { wineShowcaseConfig } from '../../../config';
import { Save, Plus, Trash2, Loader2 } from 'lucide-react';
import { ImageUploader } from '../components/ImageUploader';
import { toast } from 'sonner';

export function ResearchEditor({ setIsDirty }: { setIsDirty?: (dirty: boolean) => void }) {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [showAddProgramModal, setShowAddProgramModal] = useState(false);
  const [newProgram, setNewProgram] = useState({
    name: '', subtitle: '', year: '', image: '', description: '', tastingNotes: '',
    alcohol: 'Semua Level', temperature: 'Online & Offline', aging: 'Bulanan',
    filter: '', glowColor: 'bg-blue-900/20'
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await getContent('research');
        setData(res.content || wineShowcaseConfig);
      } catch (err: any) {
        toast.error('Gagal memuat data Riset dari server.');
        setData(wineShowcaseConfig);
      }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveContent('research', data);
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

  const updateWine = (index: number, key: string, value: any) => {
    setIsDirty?.(true);
    const wines = [...data.wines];
    wines[index] = { ...wines[index], [key]: value };
    setData({ ...data, wines });
  };

  const handleConfirmAddProgram = () => {
    if (!newProgram.name) {
      alert('Nama program harus diisi!');
      return;
    }
    setIsDirty?.(true);
    setData({
      ...data,
      wines: [...data.wines, { id: Date.now().toString(), ...newProgram }],
    });
    setShowAddProgramModal(false);
  };

  const removeWine = (index: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus program riset ini?")) {
      return;
    }
    setIsDirty?.(true);
    setData({ ...data, wines: data.wines.filter((_: any, i: number) => i !== index) });
  };

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1c1515]">Editor Riset & Program</h1>
          <p className="text-neutral-500 text-sm mt-1">Kelola program riset dan edukasi pasar modal</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-gradient-to-r from-[#dcae44] to-[#b88c2b] text-white font-bold px-4 py-2 rounded-xl hover:brightness-105 transition-colors disabled:opacity-50 shadow-[0_4px_12px_rgba(195,147,49,0.15)]">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan
        </button>
      </div>

      {/* Section Info */}
      <div className="bg-white border border-[#eae6dd] rounded-2xl p-6 space-y-4 shadow-sm">
        <h2 className="text-[#1c1515] font-bold text-sm uppercase tracking-wider text-[#a67e2a]">Info Section</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-neutral-500 text-xs mb-1">Script Text</label>
            <input type="text" value={data.scriptText || ''} onChange={e => updateField('scriptText', e.target.value)} className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-lg px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
          </div>
          <div>
            <label className="block text-neutral-500 text-xs mb-1">Subtitle</label>
            <input type="text" value={data.subtitle || ''} onChange={e => updateField('subtitle', e.target.value)} className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-lg px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
          </div>
          <div>
            <label className="block text-neutral-500 text-xs mb-1">Main Title</label>
            <input type="text" value={data.mainTitle || ''} onChange={e => updateField('mainTitle', e.target.value)} className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-lg px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
          </div>
        </div>
      </div>

      {/* Programs List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[#1c1515] font-bold">Program Riset ({data.wines?.length || 0})</h2>
          <button
            onClick={() => {
              setNewProgram({
                name: '', subtitle: '', year: '', image: '', description: '', tastingNotes: '',
                alcohol: 'Semua Level', temperature: 'Online & Offline', aging: 'Bulanan',
                filter: '', glowColor: 'bg-blue-900/20'
              });
              setShowAddProgramModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#faf9f5] border border-[#d2cbbe] rounded-lg hover:bg-neutral-100 text-[#1c1515] font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah
          </button>
        </div>

        {data.wines?.map((wine: any, i: number) => (
          <div key={i} className="bg-white border border-[#eae6dd] rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#eae6dd] pb-2">
              <span className="text-[#a67e2a] font-bold text-sm uppercase">Program #{i + 1}</span>
              <button onClick={() => removeWine(i)} className="text-neutral-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-neutral-500 text-xs mb-1">Nama</label>
                <input type="text" value={wine.name || ''} onChange={e => updateWine(i, 'name', e.target.value)} className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-lg px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
              </div>
              <div>
                <label className="block text-neutral-500 text-xs mb-1">Subtitle</label>
                <input type="text" value={wine.subtitle || ''} onChange={e => updateWine(i, 'subtitle', e.target.value)} className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-lg px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
              </div>
              <div>
                <label className="block text-neutral-500 text-xs mb-1">Nomor/Year</label>
                <input type="text" value={wine.year || ''} onChange={e => updateWine(i, 'year', e.target.value)} className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-lg px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
              </div>
            </div>
            <div>
              <label className="block text-neutral-500 text-xs mb-1">Deskripsi</label>
              <textarea value={wine.description || ''} onChange={e => updateWine(i, 'description', e.target.value)} rows={2} className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-lg px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-500 text-xs mb-1">Tasting Notes / Tags</label>
                <input type="text" value={wine.tastingNotes || ''} onChange={e => updateWine(i, 'tastingNotes', e.target.value)} className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-lg px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
              </div>
              <div>
                <ImageUploader
                  value={wine.image || ''}
                  onChange={(url) => updateWine(i, 'image', url)}
                  label="Gambar Program"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quote */}
      {data.quote && (
        <div className="bg-white border border-[#eae6dd] rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="text-[#a67e2a] font-bold text-sm uppercase tracking-wider">Quote</h2>
          <div>
            <label className="block text-neutral-500 text-xs mb-1">Teks Quote</label>
            <textarea value={data.quote.text || ''} onChange={e => updateField('quote', { ...data.quote, text: e.target.value })} rows={2} className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-lg px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-500 text-xs mb-1">Attribution</label>
              <input type="text" value={data.quote.attribution || ''} onChange={e => updateField('quote', { ...data.quote, attribution: e.target.value })} className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-lg px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
            </div>
            <div>
              <label className="block text-neutral-500 text-xs mb-1">Prefix</label>
              <input type="text" value={data.quote.prefix || ''} onChange={e => updateField('quote', { ...data.quote, prefix: e.target.value })} className="w-full bg-[#faf9f5] border border-[#d2cbbe] rounded-lg px-3 py-2 text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]" />
            </div>
          </div>
        </div>
      )}
      {showAddProgramModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white border border-[#eae6dd] rounded-2xl p-6 shadow-2xl space-y-4 my-8 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-[#1c1515]">Tambah Program Riset</h3>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <ImageUploader
                value={newProgram.image}
                onChange={(url) => setNewProgram({ ...newProgram, image: url })}
                label="Gambar Utama Program"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Nama Program</label>
                  <input
                    type="text"
                    value={newProgram.name}
                    onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
                    placeholder="Nama program..."
                    className="w-full px-3 py-2 bg-[#faf9f5] border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Sub-Judul</label>
                  <input
                    type="text"
                    value={newProgram.subtitle}
                    onChange={(e) => setNewProgram({ ...newProgram, subtitle: e.target.value })}
                    placeholder="Misal: SiPalingSaham"
                    className="w-full px-3 py-2 bg-[#faf9f5] border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Nomor / Urutan</label>
                  <input
                    type="text"
                    value={newProgram.year}
                    onChange={(e) => setNewProgram({ ...newProgram, year: e.target.value })}
                    placeholder="Misal: 01, 02"
                    className="w-full px-3 py-2 bg-[#faf9f5] border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Tags / Tasting Notes</label>
                  <input
                    type="text"
                    value={newProgram.tastingNotes}
                    onChange={(e) => setNewProgram({ ...newProgram, tastingNotes: e.target.value })}
                    placeholder="Koma sebagai pemisah, misal: Saham, Investasi"
                    className="w-full px-3 py-2 bg-[#faf9f5] border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Level</label>
                  <input
                    type="text"
                    value={newProgram.alcohol}
                    onChange={(e) => setNewProgram({ ...newProgram, alcohol: e.target.value })}
                    placeholder="Misal: Semua Level, Intermediate+"
                    className="w-full px-3 py-2 bg-[#faf9f5] border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Frekuensi / Hari</label>
                  <input
                    type="text"
                    value={newProgram.temperature}
                    onChange={(e) => setNewProgram({ ...newProgram, temperature: e.target.value })}
                    placeholder="Misal: Setiap Rabu, Rilis Bulanan"
                    className="w-full px-3 py-2 bg-[#faf9f5] border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Waktu / Jadwal</label>
                  <input
                    type="text"
                    value={newProgram.aging}
                    onChange={(e) => setNewProgram({ ...newProgram, aging: e.target.value })}
                    placeholder="Misal: 16.00 – 17.00, Per Emiten"
                    className="w-full px-3 py-2 bg-[#faf9f5] border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-neutral-500 mb-1">Deskripsi</label>
                <textarea
                  value={newProgram.description}
                  onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
                  rows={3}
                  placeholder="Deskripsi lengkap program..."
                  className="w-full px-3 py-2 bg-[#faf9f5] border border-[#d2cbbe] rounded-lg text-[#1c1515] text-sm focus:outline-none focus:ring-1 focus:ring-[#a67e2a] resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-[#eae6dd]">
              <button
                type="button"
                onClick={() => setShowAddProgramModal(false)}
                className="px-4 py-2 text-sm bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAddProgram}
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
