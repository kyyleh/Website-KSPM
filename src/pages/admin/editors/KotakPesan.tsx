import { useState, useEffect } from 'react';
import { getMessages, deleteMessage, markMessageRead } from '../lib/adminApi';
import { Mail, Trash2, RefreshCw, Loader2, Eye, Search, CheckSquare, Square, Reply, CheckCheck } from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';
import { toast } from 'sonner';

interface Message {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  category?: string;
  is_read: boolean;
  created_at: string;
}

export function KotakPesan() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);
  const [activeCategory, setActiveCategory] = useState<'contact' | 'registration'>('contact');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Confirm Modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    variant: 'warning',
    onConfirm: () => {},
  });

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await getMessages();
      const msgList = Array.isArray(res) ? res : ((res as any).messages || (res as any).data || []);
      setMessages(msgList);
      setSelectedIds([]);
    } catch {
      setMessages([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await markMessageRead(String(id));
      setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
    } catch { /* ignore */ }
  };

  const handleDeleteMessage = async (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Pesan',
      message: 'Apakah Anda yakin ingin menghapus pesan ini secara permanen?',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await deleteMessage(String(id));
          setMessages(prev => prev.filter(m => m.id !== id));
          if (selected?.id === id) setSelected(null);
          setSelectedIds(prev => prev.filter(item => item !== id));
          toast.success('Pesan berhasil dihapus.');
        } catch {
          toast.error('Gagal menghapus pesan.');
        }
      }
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Pesan Terpilih',
      message: `Apakah Anda yakin ingin menghapus ${selectedIds.length} pesan terpilih secara permanen?`,
      variant: 'danger',
      onConfirm: async () => {
        try {
          await Promise.all(selectedIds.map(id => deleteMessage(String(id))));
          setMessages(prev => prev.filter(m => !selectedIds.includes(m.id)));
          if (selected && selectedIds.includes(selected.id)) setSelected(null);
          setSelectedIds([]);
          toast.success('Pesan terpilih berhasil dihapus.');
        } catch {
          toast.error('Gagal menghapus beberapa pesan.');
          fetchMessages();
        }
      }
    });
  };

  const handleBulkMarkRead = async () => {
    if (selectedIds.length === 0) return;
    try {
      await Promise.all(selectedIds.map(id => markMessageRead(String(id))));
      setMessages(prev => prev.map(m => selectedIds.includes(m.id) ? { ...m, is_read: true } : m));
      setSelectedIds([]);
      toast.success('Pesan terpilih ditandai sebagai dibaca.');
    } catch {
      toast.error('Gagal memperbarui status pesan.');
    }
  };

  const toggleSelect = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (visibleMessages: Message[]) => {
    const visibleIds = visibleMessages.map(m => m.id);
    const allSelected = visibleIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !visibleIds.includes(id)));
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...visibleIds])]);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const contactUnread = messages.filter(m => (m.category || 'contact') === 'contact' && !m.is_read).length;
  const regUnread = messages.filter(m => m.category === 'registration' && !m.is_read).length;

  const filteredMessages = messages.filter(m => {
    const category = m.category || 'contact';
    if (category !== activeCategory) return false;

    // Filter status
    if (statusFilter === 'unread' && m.is_read) return false;
    if (statusFilter === 'read' && !m.is_read) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = (m.name || '').toLowerCase();
      const email = (m.email || '').toLowerCase();
      const body = (m.message || '').toLowerCase();
      return name.includes(q) || email.includes(q) || body.includes(q);
    }

    return true;
  });

  return (
    <div className="max-w-4xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#eae6dd] pb-3">
        <div>
          <h1 className="text-xl font-bold text-[#1c1515] font-sans">Pesan Masuk</h1>
          <p className="text-xs text-neutral-500 mt-0.5 font-sans">
            {messages.length} pesan total, {messages.filter(m => !m.is_read).length} belum dibaca
          </p>
        </div>
        <button 
          onClick={fetchMessages} 
          disabled={loading} 
          className="flex justify-center items-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-[#d2cbbe] rounded-lg hover:bg-neutral-100 text-[#1c1515] font-semibold transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 border-b border-[#eae6dd] pb-px">
        <button
          onClick={() => { setActiveCategory('contact'); setSelected(null); setSelectedIds([]); }}
          className={`px-3 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 font-sans ${
            activeCategory === 'contact'
              ? 'border-[#966917] text-[#966917]'
              : 'border-transparent text-neutral-500 hover:text-neutral-700'
          }`}
        >
          Hubungi Kami
          {contactUnread > 0 && (
            <span className="bg-[#966917] text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
              {contactUnread}
            </span>
          )}
        </button>
        <button
          onClick={() => { setActiveCategory('registration'); setSelected(null); setSelectedIds([]); }}
          className={`px-3 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 font-sans ${
            activeCategory === 'registration'
              ? 'border-[#966917] text-[#966917]'
              : 'border-transparent text-neutral-500 hover:text-neutral-700'
          }`}
        >
          Pendaftaran Anggota
          {regUnread > 0 && (
            <span className="bg-[#966917] text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
              {regUnread}
            </span>
          )}
        </button>
      </div>

      {/* Toolbar: Search, Filters & Bulk Actions */}
      <div className="bg-white border border-[#eae6dd] rounded-xl p-3.5 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, email, atau isi pesan..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#faf9f5] border border-[#d2cbbe] rounded-lg focus:outline-none focus:border-[#966917] focus:bg-white transition-all font-sans"
            />
          </div>

          {/* Filter Status */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-neutral-500 font-sans uppercase tracking-wider">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-2 text-xs bg-[#faf9f5] border border-[#d2cbbe] rounded-lg focus:outline-none focus:border-[#966917] font-sans"
            >
              <option value="all">Semua Pesan</option>
              <option value="unread">Belum Dibaca</option>
              <option value="read">Sudah Dibaca</option>
            </select>
          </div>
        </div>

        {/* Bulk Operations Toolbar */}
        {filteredMessages.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#eae6dd]/40">
            <button
              onClick={() => toggleSelectAll(filteredMessages)}
              className="flex items-center gap-1.5 px-2 py-1 text-xs text-neutral-600 hover:text-[#966917] transition-colors"
            >
              {filteredMessages.every(m => selectedIds.includes(m.id)) ? (
                <CheckSquare size={15} className="text-[#966917]" />
              ) : (
                <Square size={15} />
              )}
              <span className="font-semibold text-[11px] font-sans">Pilih Semua Halaman Ini</span>
            </button>

            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-200">
                <span className="text-[11px] font-medium text-neutral-500 font-sans">
                  {selectedIds.length} terpilih:
                </span>
                <button
                  onClick={handleBulkMarkRead}
                  className="flex items-center gap-1 px-2.5 py-1 text-[10px] bg-amber-500/10 hover:bg-amber-500/20 text-[#966917] border border-[#966917]/20 font-bold rounded-lg transition-colors"
                >
                  <CheckCheck size={12} /> Tandai Dibaca
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-1 px-2.5 py-1 text-[10px] bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-500/20 font-bold rounded-lg transition-colors"
                >
                  <Trash2 size={12} /> Hapus
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Message List */}
        <div className="space-y-2 h-[calc(100vh-320px)] overflow-y-auto pr-1.5 custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-[#966917]" />
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 bg-white border border-[#eae6dd] rounded-2xl shadow-sm">
              <Mail className="w-10 h-10 mx-auto mb-2.5 opacity-40 text-neutral-400" />
              <p className="text-xs font-semibold font-sans">Tidak ada pesan masuk</p>
              <p className="text-[10px] text-neutral-400 mt-1 font-sans">Coba ubah kata kunci pencarian atau filter status</p>
            </div>
          ) : (
            filteredMessages.map(msg => {
              const isSelectedForAction = selectedIds.includes(msg.id);
              return (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelected(msg);
                    if (!msg.is_read) {
                      handleMarkAsRead(msg.id);
                    }
                  }}
                  className={`bg-white border rounded-xl p-3 cursor-pointer transition-all hover:border-[#966917]/40 relative ${
                    selected?.id === msg.id ? 'border-[#966917] bg-[#faf9f5]/50 shadow-sm' : 'border-[#eae6dd]'
                  } ${!msg.is_read ? 'border-l-4 border-l-[#966917]' : ''}`}
                >
                  <div className="flex items-start gap-2.5">
                    {/* Checkbox */}
                    <div 
                      onClick={(e) => toggleSelect(msg.id, e)}
                      className="mt-0.5 text-neutral-400 hover:text-[#966917] transition-colors"
                    >
                      {isSelectedForAction ? (
                        <CheckSquare size={16} className="text-[#966917]" />
                      ) : (
                        <Square size={16} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#1c1515] font-bold text-xs truncate font-sans">{msg.name}</span>
                        {!msg.is_read && <span className="w-1.5 h-1.5 rounded-full bg-[#966917] flex-shrink-0" />}
                      </div>
                      <p className="text-neutral-500 text-[10px] mt-0.5 truncate font-sans">{msg.email}</p>
                      <p className="text-neutral-600 text-xs mt-1.5 truncate font-sans leading-relaxed">{msg.message}</p>
                    </div>

                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className="text-neutral-400 text-[9px] font-sans">{formatDate(msg.created_at)}</span>
                      <button 
                        onClick={e => { e.stopPropagation(); handleDeleteMessage(msg.id); }} 
                        className="text-neutral-400 hover:text-red-600 p-1 rounded hover:bg-neutral-50 transition-all"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Message Detail Panel */}
        <div className="bg-white border border-[#eae6dd] rounded-xl p-5 h-[calc(100vh-320px)] overflow-y-auto shadow-sm sticky top-0 custom-scrollbar flex flex-col justify-between">
          {selected ? (
            <div className="space-y-4 flex-1">
              <div className="flex items-center justify-between border-b border-[#eae6dd] pb-3">
                <div className="min-w-0 flex-1">
                  <h2 className="text-[#1c1515] font-bold text-sm truncate font-sans">{selected.name}</h2>
                  <p className="text-[10px] text-neutral-400 mt-0.5 font-sans">
                    Kategori: {selected.category === 'registration' ? 'Pendaftaran Anggota' : 'Hubungi Kami'}
                  </p>
                </div>
                <button 
                  onClick={() => handleDeleteMessage(selected.id)} 
                  className="text-red-600 hover:text-red-700 text-xs font-bold flex items-center gap-1 p-1 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                >
                  <Trash2 size={14} /> Hapus
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400 w-16 font-sans">Email:</span>
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <a 
                      href={`mailto:${selected.email}`} 
                      className="text-[#966917] font-semibold hover:underline truncate flex-1"
                    >
                      {selected.email}
                    </a>
                    <a
                      href={`mailto:${selected.email}?subject=Balasan%20Pesan%20KSPM%20FEB%20UIKA&body=Halo%20${encodeURIComponent(selected.name)},%0A%0ATerima%20kasih%20telah%20menghubungi%20kami.%0A%0ASalam,%0AAdmin%20KSPM`}
                      className="flex items-center gap-1 px-2 py-0.5 bg-[#966917]/10 hover:bg-[#966917]/20 text-[#966917] font-bold text-[9px] rounded transition-colors"
                      title="Kirim email balasan"
                    >
                      <Reply size={10} /> Balas
                    </a>
                  </div>
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400 w-16 font-sans">Telepon:</span>
                    <span className="text-[#1c1515] font-medium flex-1">{selected.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400 w-16 font-sans">Tanggal:</span>
                  <span className="text-[#1c1515] flex-1">{formatDate(selected.created_at)}</span>
                </div>
              </div>

              <div className="border-t border-[#eae6dd]/60 pt-4">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2 font-sans">Isi Pesan:</h4>
                <div className="bg-[#faf9f5] border border-[#eae6dd] rounded-xl p-4 min-h-[120px]">
                  <p className="text-neutral-700 text-xs leading-relaxed whitespace-pre-wrap font-sans">{selected.message}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-neutral-400 py-12 flex-1">
              <Eye className="w-10 h-10 mb-2.5 opacity-40 text-[#966917]" />
              <p className="text-xs font-bold font-sans text-neutral-500">Pilih pesan dari daftar</p>
              <p className="text-[10px] text-neutral-400 mt-1 font-sans text-center max-w-[200px]">
                Klik pada pesan di sebelah kiri untuk melihat detail isi pesan dan membalas pengirim.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        variant={confirmModal.variant}
      />
    </div>
  );
}
