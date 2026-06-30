import { useState } from 'react';
import {
  LayoutDashboard,
  Home,
  Users,
  Calendar,
  FlaskConical,
  Newspaper,
  Mail,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Camera,
  PanelBottom,
  Phone,
  Award,
} from 'lucide-react';

export type AdminSection =
  | 'dashboard'
  | 'hero'
  | 'about'
  | 'events'
  | 'research'
  | 'news'
  | 'gallery'
  | 'messages'
  | 'footer'
  | 'contact'
  | 'achievements';

interface SidebarItem {
  id: AdminSection;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface AdminLayoutProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  onLogout: () => void;
  adminName?: string;
  unreadCount?: number;
  children: React.ReactNode;
}

interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

const sidebarGroups: SidebarGroup[] = [
  {
    title: 'Utama',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
      { id: 'messages', label: 'Pesan Masuk', icon: <Mail size={18} /> },
    ],
  },
  {
    title: 'Konten Halaman',
    items: [
      { id: 'hero', label: 'Beranda (Hero)', icon: <Home size={18} /> },
      { id: 'about', label: 'Tentang Kami', icon: <Users size={18} /> },
      { id: 'events', label: 'Kegiatan', icon: <Calendar size={18} /> },
      { id: 'research', label: 'Riset', icon: <FlaskConical size={18} /> },
      { id: 'news', label: 'Berita', icon: <Newspaper size={18} /> },
      { id: 'achievements', label: 'Pencapaian', icon: <Award size={18} /> },
      { id: 'gallery', label: 'Galeri Foto', icon: <Camera size={18} /> },
    ],
  },
  {
    title: 'Pengaturan Global',
    items: [
      { id: 'contact', label: 'Kontak', icon: <Phone size={18} /> },
      { id: 'footer', label: 'Footer', icon: <PanelBottom size={18} /> },
    ],
  },
];

export function AdminLayout({
  activeSection,
  onSectionChange,
  onLogout,
  adminName = 'Admin',
  unreadCount = 0,
  children,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f0ede6] text-[#1c1515] overflow-hidden font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white text-[#1c1515] border-r border-[#eae6dd] flex flex-col transition-transform duration-300 shadow-xl shadow-[#1c1515]/5 lg:shadow-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-[#eae6dd]">
          <div className="w-10 h-10 flex items-center justify-center">
            <img src="/images/kspm-logo.png" alt="KSPM" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="font-semibold text-sm tracking-wide text-[#1c1515]">KSPM Admin</h1>
            <p className="text-[11px] text-[#7a7575]">FEB UIKA Bogor</p>
          </div>
          <button
            className="ml-auto lg:hidden p-1.5 hover:bg-[#faf9f5] rounded-lg transition-colors text-neutral-500"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4 custom-scrollbar bg-white">
          {sidebarGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <h3 className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5 font-sans">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = activeSection === item.id;
                  const badge = item.id === 'messages' ? unreadCount : 0;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSectionChange(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-2.5 lg:px-3 lg:py-2 rounded-xl text-[14px] lg:text-[13px] font-medium transition-all duration-300 group border
                        ${isActive
                          ? 'bg-[#966917]/10 text-[#966917] border-[#966917]/20 shadow-[0_2px_8px_rgba(150,105,23,0.08)]'
                          : 'text-[#4a4545] hover:text-[#966917] hover:bg-[#faf9f5] border-transparent'
                        }
                      `}
                    >
                      <span className={isActive ? 'text-[#966917]' : 'text-[#7a7575] group-hover:text-[#966917] transition-colors'}>
                        {item.icon}
                      </span>
                      <span className="flex-1 text-left">{item.label}</span>
                      {badge > 0 && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                          {badge}
                        </span>
                      )}
                      {isActive && <ChevronRight size={14} className="text-[#966917]/50" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="border-t border-[#eae6dd] p-4 bg-[#faf9f6]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#dcae44] to-[#b88c2b] flex items-center justify-center text-xs font-bold text-white shadow-sm shadow-[#c9922a]/20">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-[#1c1515]">{adminName}</p>
              <p className="text-[11px] text-[#7a7575]">Administrator</p>
            </div>
            <button
              onClick={onLogout}
              className="p-3 lg:p-2 text-[#4a4545] hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-all"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Top bar */}
        <header className="h-16 flex items-center gap-4 px-4 lg:px-8 border-b border-[#eae6dd] bg-white shrink-0 z-10 sticky top-0">
          <button
            className="lg:hidden p-2.5 hover:bg-slate-100 rounded-xl"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <div className="flex-1">
            <h2 className="text-sm font-semibold capitalize text-[#1c1515]">
              {sidebarGroups.flatMap((g) => g.items).find((i) => i.id === activeSection)?.label || 'Dashboard'}
            </h2>
          </div>
          {/* Removed KSPM Content Manager text */}
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#f0ede6] relative admin-theme-main">
          {/* Subtle background glow for main content */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-amber-500/[0.02] blur-[120px] pointer-events-none rounded-full" />
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
