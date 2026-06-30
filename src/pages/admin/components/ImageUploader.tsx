import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadToCloudinary } from '../lib/adminApi';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export function ImageUploader({ value, onChange, label = 'Gambar', className = '' }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Pilih file berformat gambar');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Ukuran file maksimal 10MB');
      return;
    }

    setError('');
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      onChange(url);
    } catch (err: any) {
      setError(err.message || 'Gagal mengunggah gambar');
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5 font-sans">
          {label}
        </label>
      )}

      {value ? (
        /* Space-saving Preview Card with Hover Overlay Actions */
        <div className="relative rounded-xl overflow-hidden border border-[#eae6dd] group h-32 bg-[#faf9f5] shadow-sm">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 bg-white hover:bg-neutral-100 text-[11px] font-bold text-[#1c1515] rounded-lg transition-all shadow flex items-center gap-1.5 active:scale-95"
            >
              <Upload size={12} />
              Ganti Gambar
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-[11px] font-bold text-white rounded-lg transition-all shadow flex items-center gap-1.5 active:scale-95"
            >
              <X size={12} />
              Hapus
            </button>
          </div>
          {/* Uploading Spinner Overlay */}
          {uploading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex flex-col items-center justify-center gap-1">
              <Loader2 size={18} className="text-[#966917] animate-spin" />
              <span className="text-[10px] font-bold text-[#966917] font-sans uppercase tracking-wider">Mengunggah…</span>
            </div>
          )}
        </div>
      ) : (
        /* Compact Dropzone when empty */
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            relative flex flex-col items-center justify-center gap-1 p-4 rounded-xl border-2 border-dashed cursor-pointer transition-colors min-h-[96px]
            ${dragOver ? 'border-[#966917] bg-amber-500/[0.03]' : 'border-[#d2cbbe] hover:border-[#966917] bg-[#faf9f5] hover:bg-white'}
            ${uploading ? 'pointer-events-none opacity-60' : ''}
          `}
        >
          {uploading ? (
            <>
              <Loader2 size={18} className="text-[#966917] animate-spin" />
              <span className="text-xs font-semibold text-neutral-500 font-sans">Mengunggah…</span>
            </>
          ) : (
            <>
              <ImageIcon size={18} className="text-[#966917]/50" />
              <span className="text-xs font-semibold text-neutral-500 text-center font-sans px-2">
                Tarik & lepas gambar, atau klik untuk unggah
              </span>
              <span className="text-[9px] text-neutral-400 font-sans">
                JPG, PNG, WEBP (Maksimal 10MB)
              </span>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {error && (
        <p className="mt-1 text-[11px] font-semibold text-red-600 font-sans">{error}</p>
      )}
    </div>
  );
}
