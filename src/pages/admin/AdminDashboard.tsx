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
  const [isDirty, setIsDirty] = useState(false);

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
        const msgs = Array.isArray(res) ? res : ((res as any).messages || (res as any).data || []);
        setStats({
          totalMessages: msgs.length,
          unreadMessages: msgs.filter((m: any) => !m.is_read).length,
        });
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, [section]);

  const handleLogout = () => {
    if (isDirty) {
      if (!window.confirm("Anda memiliki perubahan yang belum disimpan. Yakin ingin keluar (logout)?")) {
        return;
      }
    }
    logout();
    window.location.hash = '';
    window.location.reload();
  };

  const handleSectionChange = (newSection: AdminSection) => {
    if (isDirty) {
      if (!window.confirm("Anda memiliki perubahan yang belum disimpan. Yakin ingin pindah halaman?")) {
        return;
      }
    }
    setIsDirty(false);
    setSection(newSection);
  };

  const renderEditor = () => {
    switch (section) {
      case 'hero': return <HeroEditor setIsDirty={setIsDirty} />;
      case 'about': return <AboutEditor setIsDirty={setIsDirty} />;
      case 'events': return <EventsEditor setIsDirty={setIsDirty} />;
      case 'research': return <ResearchEditor setIsDirty={setIsDirty} />;
      case 'news': return <NewsEditor setIsDirty={setIsDirty} />;
      case 'contact': return <ContactEditor setIsDirty={setIsDirty} />;
      case 'footer': return <FooterEditor setIsDirty={setIsDirty} />;
      case 'messages': return <MessagesInbox />;
      default: return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#1c1515] tracking-tight">Dashboard</h1>
            <p className="text-neutral-500 mt-2 text-[15px]">Selamat datang kembali di panel admin KSPM FEB UIKA Bogor.</p>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#eae6dd] rounded-2xl p-6 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#1c1515]/5 transition-all duration-300 group">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-amber-500/10 rounded-xl group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300">
                  <MessageSquare className="w-6 h-6 text-[#a67e2a] drop-shadow-[0_0_10px_rgba(195,147,49,0.15)]" />
                </div>
                <span className="text-neutral-500 font-medium text-[15px]">Total Pesan</span>
              </div>
              <p className="text-4xl font-bold text-[#1c1515] tracking-tight">{stats.totalMessages}</p>
            </div>
            
            <div className="bg-white border border-[#eae6dd] rounded-2xl p-6 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#1c1515]/5 transition-all duration-300 group">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-red-500/10 rounded-xl group-hover:scale-110 group-hover:bg-red-500/20 transition-all duration-300">
                  <AlertCircle className="w-6 h-6 text-red-600 drop-shadow-[0_0_10px_rgba(239,68,68,0.15)]" />
                </div>
                <span className="text-neutral-500 font-medium text-[15px]">Belum Dibaca</span>
              </div>
              <p className="text-4xl font-bold text-[#1c1515] tracking-tight">{stats.unreadMessages}</p>
            </div>
 
            <div className="bg-white border border-[#eae6dd] rounded-2xl p-6 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#1c1515]/5 transition-all duration-300 group">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
                  <LayoutDashboard className="w-6 h-6 text-emerald-600 drop-shadow-[0_0_10px_rgba(16,185,129,0.15)]" />
                </div>
                <span className="text-neutral-500 font-medium text-[15px]">Total Section</span>
              </div>
              <p className="text-4xl font-bold text-[#1c1515] tracking-tight">8</p>
            </div>
          </div>
 
          <div className="bg-white border border-[#eae6dd] rounded-2xl p-8 relative overflow-hidden group shadow-sm">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
              <LayoutDashboard className="w-32 h-32 text-amber-500" />
            </div>
            <h2 className="text-xl font-bold text-[#1c1515] mb-4 flex items-center gap-2">
              Panduan Cepat
            </h2>
            <ul className="space-y-3 text-neutral-600 text-[15px] leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-[#a67e2a] mt-1">•</span>
                <span>Pilih menu di sidebar kiri untuk mengedit konten tiap halaman.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#a67e2a] mt-1">•</span>
                <span>Klik <strong className="text-[#1c1515]">Simpan</strong> setelah selesai mengedit untuk menerapkan perubahan ke website.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#a67e2a] mt-1">•</span>
                <span>Upload gambar langsung ke sistem melalui editor yang tersedia.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#a67e2a] mt-1">•</span>
                <span>Cek menu <strong className="text-[#1c1515]">Pesan Masuk</strong> secara berkala untuk memantau pesan dari pengunjung.</span>
              </li>
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
      onSectionChange={(s) => handleSectionChange(s as AdminSection)}
      adminName={adminName}
      onLogout={handleLogout}
      unreadCount={stats.unreadMessages}
    >
      {renderEditor()}
    </AdminLayout>
  );
}
