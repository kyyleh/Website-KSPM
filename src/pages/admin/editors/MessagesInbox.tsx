import { useState, useEffect } from 'react';
import { getMessages, deleteMessage, markMessageRead } from '../lib/adminApi';
import { Mail, Trash2, RefreshCw, Loader2, Eye } from 'lucide-react';

interface Message {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export function MessagesInbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1c1515]">Pesan Masuk</h1>
          <p className="text-neutral-500 text-sm mt-1">{messages.length} pesan total, {messages.filter(m => !m.is_read).length} belum dibaca</p>
        </div>
        <button onClick={fetchMessages} disabled={loading} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#faf9f5] border border-[#d2cbbe] rounded-lg hover:bg-neutral-100 text-[#1c1515] font-semibold transition-colors disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Message List */}
        <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-[#a67e2a]" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 bg-white border border-[#eae6dd] rounded-2xl">
              <Mail className="w-12 h-12 mx-auto mb-3 opacity-50 text-neutral-400" />
              <p>Belum ada pesan masuk</p>
            </div>
          ) : (
            messages.map(msg => (
              <div
                key={msg.id}
                onClick={() => {
                  setSelected(msg);
                  if (!msg.is_read) {
                    handleMarkAsRead(msg.id);
                  }
                }}
                className={`bg-white border rounded-2xl p-4 cursor-pointer transition-all hover:border-[#a67e2a]/50 ${
                  selected?.id === msg.id ? 'border-[#a67e2a] shadow-[0_4px_12px_rgba(166,126,42,0.08)]' : 'border-[#eae6dd]'
                } ${!msg.is_read ? 'border-l-4 border-l-[#a67e2a]' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[#1c1515] font-semibold text-sm truncate">{msg.name}</span>
                      {!msg.is_read && <span className="w-2 h-2 rounded-full bg-[#a67e2a] flex-shrink-0" />}
                    </div>
                    <p className="text-neutral-500 text-xs mt-1">{msg.email}</p>
                    <p className="text-neutral-600 text-xs mt-1 truncate">{msg.message}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                    <span className="text-neutral-400 text-xs">{formatDate(msg.created_at)}</span>
                    <button onClick={e => { e.stopPropagation(); handleDelete(msg.id); }} className="text-neutral-400 hover:text-red-600 p-1 rounded transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Detail */}
        <div className="bg-white border border-[#eae6dd] rounded-2xl p-6 min-h-[300px] shadow-sm">
          {selected ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#eae6dd] pb-3">
                <h2 className="text-[#1c1515] font-bold text-lg">{selected.name}</h2>
                <button onClick={() => handleDelete(selected.id)} className="text-red-600 hover:text-red-700 text-sm font-semibold flex items-center gap-1">
                  <Trash2 className="w-4 h-4" /> Hapus
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400 w-20">Email:</span>
                  <a href={`mailto:${selected.email}`} className="text-[#a67e2a] font-medium hover:underline">{selected.email}</a>
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400 w-20">Telepon:</span>
                    <span className="text-[#1c1515]">{selected.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400 w-20">Tanggal:</span>
                  <span className="text-[#1c1515]">{formatDate(selected.created_at)}</span>
                </div>
              </div>

              <div className="border-t border-[#eae6dd] pt-4">
                <p className="text-neutral-700 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-neutral-400 py-12">
              <Eye className="w-10 h-10 mb-3 opacity-50" />
              <p>Pilih pesan untuk melihat detail</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
