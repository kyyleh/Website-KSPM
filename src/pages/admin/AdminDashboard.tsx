import { useState, useEffect } from 'react';
import { AdminLayout } from './components/AdminLayout';
import { HeroEditor } from './editors/HeroEditor';
import { AboutEditor } from './editors/AboutEditor';
import { EventsEditor } from './editors/EventsEditor';
import { ResearchEditor } from './editors/ResearchEditor';
import { NewsEditor } from './editors/NewsEditor';
import { ContactEditor } from './editors/ContactEditor';
import { FooterEditor } from './editors/FooterEditor';
import { MessagesInbox } from './editors/MessagesInbox';
import { verifyToken, logout, getMessages } from './lib/adminApi';
import { LayoutDashboard, MessageSquare, AlertCircle } from 'lucide-react';

type AdminSection = 'dashboard' | 'hero' | 'about' | 'events' | 'research' | 'news' | 'contact' | 'footer' | 'messages';

export function AdminDashboard() {
  const [section, setSection] = useState<AdminSection>('dashboard');
  const [adminName] = useState('Admin');
  const [stats, setStats] = useState({ totalMessages: 0, unreadMessages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const valid = await verifyToken();
      if (!valid) {
        logout();
        window.location.hash = '';
        window.location.reload();
        return;
      }
      // Fetch message stats
      try {
        const res = await getMessages();
        const msgs = (res as any).data || res || [];
        setStats({
          totalMessages: msgs.length,
          unreadMessages: msgs.filter((m: any) => !m.is_read).length,
        });
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, [section]);

  const handleLogout = () => {
    logout();
    window.location.hash = '';
    window.location.reload();
  };

  const renderEditor = () => {
    switch (section) {
      case 'hero': return <HeroEditor />;
      case 'about': return <AboutEditor />;
      case 'events': return <EventsEditor />;
      case 'research': return <ResearchEditor />;
      case 'news': return <NewsEditor />;
      case 'contact': return <ContactEditor />;
      case 'footer': return <FooterEditor />;
      case 'messages': return <MessagesInbox />;
      default: return (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-slate-400 mt-1">Selamat datang di panel admin KSPM FEB UIKA Bogor</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="w-5 h-5 text-amber-400" />
                <span className="text-slate-400 text-sm">Total Pesan</span>
              </div>
              <p className="text-3xl font-bold text-white">{stats.totalMessages}</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-slate-400 text-sm">Belum Dibaca</span>
              </div>
              <p className="text-3xl font-bold text-white">{stats.unreadMessages}</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <LayoutDashboard className="w-5 h-5 text-emerald-400" />
                <span className="text-slate-400 text-sm">Sections</span>
              </div>
              <p className="text-3xl font-bold text-white">8</p>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Panduan Cepat</h2>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>• Pilih menu di sidebar kiri untuk mengedit konten tiap halaman</li>
              <li>• Klik <strong>Simpan</strong> setelah selesai mengedit</li>
              <li>• Upload gambar langsung ke Cloudinary melalui editor</li>
              <li>• Cek <strong>Pesan Masuk</strong> untuk melihat pesan dari form kontak</li>
            </ul>
          </div>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <AdminLayout
      activeSection={section}
      onSectionChange={(s) => setSection(s as AdminSection)}
      adminName={adminName}
      onLogout={handleLogout}
      unreadCount={stats.unreadMessages}
    >
      {renderEditor()}
    </AdminLayout>
  );
}
