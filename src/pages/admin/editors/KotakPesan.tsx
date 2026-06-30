import { useState, useEffect } from 'react';
import { getMessages, deleteMessage, markMessageRead } from '../lib/adminApi';
import { Mail, Trash2, RefreshCw, Loader2, Eye } from 'lucide-react';

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

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await getMessages();
      const msgList = Array.isArray(res) ? res : ((res as any).messages || (res as any).data || []);
      setMessages(msgList);
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

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus pesan ini?')) return;
    try {
      await deleteMessage(String(id));
      setMessages(messages.filter(m => m.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch { /* ignore */ }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  const contactUnread = messages.filter(m => (m.category || 'contact') === 'contact' && !m.is_read).length;
  const regUnread = messages.filter(m => m.category === 'registration' && !m.is_read).length;

  const filteredMessages = messages.filter(m => {
    const category = m.category || 'contact';
    return category === activeCategory;
  });

  return (
    <div className="max-w-4xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#eae6dd] pb-3">
        <div>
          <h1 className="text-xl font-bold text-[#1c1515]">Pesan Masuk</h1>
          <p className="text-xs text-neutral-500 mt-0.5">{messages.length} pesan total, {messages.filter(m => !m.is_read).length} belum dibaca</p>
        </div>
        <button onClick={fetchMessages} disabled={loading} className="flex justify-center items-center gap-1.5 px-3 py-1.5 text-xs bg-[#faf9f5] border border-[#d2cbbe] rounded-lg hover:bg-neutral-100 text-[#1c1515] font-semibold transition-colors disabled:opacity-50">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 border-b border-[#eae6dd] pb-px">
        <button
          onClick={() => { setActiveCategory('contact'); setSelected(null); }}
          className={`px-3 py-1.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            activeCategory === 'contact'
              ? 'border-[#a67e2a] text-[#a67e2a]'
              : 'border-transparent text-neutral-500 hover:text-neutral-700'
          }`}
        >
          Hubungi Kami
          {contactUnread > 0 && (
            <span className="bg-[#a67e2a] text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
              {contactUnread}
            </span>
          )}
        </button>
        <button
          onClick={() => { setActiveCategory('registration'); setSelected(null); }}
          className={`px-3 py-1.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            activeCategory === 'registration'
              ? 'border-[#a67e2a] text-[#a67e2a]'
              : 'border-transparent text-neutral-500 hover:text-neutral-700'
          }`}
        >
          Pendaftaran Anggota
          {regUnread > 0 && (
            <span className="bg-[#a67e2a] text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
              {regUnread}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {/* Message List */}
        <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-[#a67e2a]" />
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-8 text-neutral-400 bg-white border border-[#eae6dd] rounded-xl">
              <Mail className="w-8 h-8 mx-auto mb-2 opacity-50 text-neutral-400" />
              <p className="text-xs">Belum ada pesan masuk di kategori ini</p>
            </div>
          ) : (
            filteredMessages.map(msg => (
              <div
                key={msg.id}
                onClick={() => {
                  setSelected(msg);
                  if (!msg.is_read) {
                    handleMarkAsRead(msg.id);
                  }
                }}
                className={`bg-white border rounded-xl p-3 cursor-pointer transition-all hover:border-[#a67e2a]/40 ${
                  selected?.id === msg.id ? 'border-[#a67e2a] bg-[#faf9f5]/40 shadow-sm' : 'border-[#eae6dd]'
                } ${!msg.is_read ? 'border-l-4 border-l-[#a67e2a]' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#1c1515] font-bold text-xs truncate">{msg.name}</span>
                      {!msg.is_read && <span className="w-1.5 h-1.5 rounded-full bg-[#a67e2a] flex-shrink-0" />}
                    </div>
                    <p className="text-neutral-500 text-[10px] mt-0.5 truncate">{msg.email}</p>
                    <p className="text-neutral-600 text-xs mt-1 truncate">{msg.message}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-neutral-400 text-[9px]">{formatDate(msg.created_at)}</span>
                    <button onClick={e => { e.stopPropagation(); handleDelete(msg.id); }} className="text-neutral-400 hover:text-red-600 p-0.5 rounded transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Detail */}
        <div className="bg-white border border-[#eae6dd] rounded-xl p-4 min-h-[250px] shadow-sm">
          {selected ? (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between border-b border-[#eae6dd] pb-2">
                <h2 className="text-[#1c1515] font-bold text-sm">{selected.name}</h2>
                <button onClick={() => handleDelete(selected.id)} className="text-red-600 hover:text-red-700 text-xs font-bold flex items-center gap-0.5">
                  <Trash2 size={13} /> Hapus
                </button>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-400 w-16">Email:</span>
                  <a href={`mailto:${selected.email}`} className="text-[#a67e2a] font-semibold hover:underline">{selected.email}</a>
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-neutral-400 w-16">Telepon:</span>
                    <span className="text-[#1c1515]">{selected.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-400 w-16">Tanggal:</span>
                  <span className="text-[#1c1515]">{formatDate(selected.created_at)}</span>
                </div>
              </div>

              <div className="border-t border-[#eae6dd] pt-3">
                <p className="text-neutral-755 text-xs leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-neutral-400 py-12">
              <Eye className="w-8 h-8 mb-2 opacity-50 text-[#a67e2a]" />
              <p className="text-xs font-semibold">Pilih pesan untuk melihat detail</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
