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
        <label className="block text-sm font-medium text-neutral-700 mb-2">{label}</label>
      )}

      {/* Preview */}
      {value && (
        <div className="relative mb-3 rounded-lg overflow-hidden border border-[#eae6dd] group">
          <img
            src={value}
            alt="Preview"
            className="w-full h-40 object-cover"
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1.5 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          relative flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed cursor-pointer transition-colors
          ${dragOver ? 'border-[#a67e2a] bg-amber-500/[0.03]' : 'border-[#d2cbbe] hover:border-[#a67e2a] bg-[#faf9f5] hover:bg-white'}
          ${uploading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        {uploading ? (
          <>
            <Loader2 size={24} className="text-[#a67e2a] animate-spin" />
            <span className="text-sm text-neutral-500">Mengunggah…</span>
          </>
        ) : (
          <>
            {value ? (
              <Upload size={24} className="text-neutral-400" />
            ) : (
              <ImageIcon size={24} className="text-[#a67e2a]/60" />
            )}
            <span className="text-sm text-neutral-500 text-center px-4">
              {value ? 'Ganti gambar' : 'Tarik & lepas gambar di sini, atau klik untuk menelusuri'}
            </span>
            {!value && (
              <span className="text-[11px] text-neutral-400 text-center mt-1">
                Maksimal ukuran file: 10MB. Rekomendasi format: JPG, PNG, WEBP.
              </span>
            )}
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
