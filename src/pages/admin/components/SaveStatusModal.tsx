import { CheckCircle2, XCircle } from 'lucide-react';

interface SaveStatusModalProps {
  isOpen: boolean;
  status: 'success' | 'error' | null;
  message: string;
  onClose: () => void;
}

export function SaveStatusModal({
  isOpen,
  status,
  message,
  onClose,
}: SaveStatusModalProps) {
  if (!isOpen || !status) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm bg-white border border-[#eae6dd] rounded-[1.5rem] p-6 shadow-2xl space-y-4 text-center animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center">
          {status === 'success' ? (
            <div className="p-3 bg-emerald-50 text-emerald-500 rounded-full border border-emerald-100 shadow-sm">
              <CheckCircle2 className="w-10 h-10 stroke-[2]" />
            </div>
          ) : (
            <div className="p-3 bg-red-50 text-red-500 rounded-full border border-red-100 shadow-sm">
              <XCircle className="w-10 h-10 stroke-[2]" />
            </div>
          )}
        </div>
        
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-[#1c1515] tracking-tight">
            {status === 'success' ? 'Berhasil Disimpan' : 'Gagal Menyimpan'}
          </h3>
          <p className="text-xs text-neutral-500 max-w-[280px] mx-auto leading-relaxed">
            {message}
          </p>
        </div>

        <div className="pt-2 border-t border-[#eae6dd]/40">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 bg-[#a67e2a] hover:bg-[#8e6b21] text-white font-bold text-xs rounded-xl shadow-md transition-all duration-200"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
