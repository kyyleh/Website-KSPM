import { useState, useEffect } from 'react';
import { getMessages, deleteMessage } from '../lib/adminApi';
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
      setMessages((res as any).data || res || []);
    } catch {
      setMessages([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

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
          <h1 className="text-2xl font-bold text-white">Pesan Masuk</h1>
          <p className="text-slate-400 text-sm mt-1">{messages.length} pesan total, {messages.filter(m => !m.is_read).length} belum dibaca</p>
        </div>
        <button onClick={fetchMessages} disabled={loading} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Message List */}
        <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Belum ada pesan masuk</p>
            </div>
          ) : (
            messages.map(msg => (
              <div
                key={msg.id}
                onClick={() => setSelected(msg)}
                className={`bg-slate-800 border rounded-xl p-4 cursor-pointer transition-all hover:border-amber-500/50 ${
                  selected?.id === msg.id ? 'border-amber-500' : 'border-slate-700'
                } ${!msg.is_read ? 'border-l-4 border-l-amber-400' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-sm truncate">{msg.name}</span>
                      {!msg.is_read && <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />}
                    </div>
                    <p className="text-slate-400 text-xs mt-1">{msg.email}</p>
                    <p className="text-slate-500 text-xs mt-1 truncate">{msg.message}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                    <span className="text-slate-500 text-xs">{formatDate(msg.created_at)}</span>
                    <button onClick={e => { e.stopPropagation(); handleDelete(msg.id); }} className="text-red-400 hover:text-red-300 p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Detail */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 min-h-[300px]">
          {selected ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-white font-semibold text-lg">{selected.name}</h2>
                <button onClick={() => handleDelete(selected.id)} className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1">
                  <Trash2 className="w-4 h-4" /> Hapus
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 w-20">Email:</span>
                  <a href={`mailto:${selected.email}`} className="text-amber-400 hover:underline">{selected.email}</a>
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 w-20">Telepon:</span>
                    <span className="text-white">{selected.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 w-20">Tanggal:</span>
                  <span className="text-white">{formatDate(selected.created_at)}</span>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Eye className="w-10 h-10 mb-3 opacity-50" />
              <p>Pilih pesan untuk melihat detail</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
