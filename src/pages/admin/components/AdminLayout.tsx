import { useState } from 'react';
import {
  LayoutDashboard,
  Home,
  Users,
  Calendar,
  FlaskConical,
  Newspaper,
  Phone,
  Mail,
  PanelBottom,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Camera,
} from 'lucide-react';

export type AdminSection =
  | 'dashboard'
  | 'hero'
  | 'about'
  | 'events'
  | 'research'
  | 'news'
  | 'gallery'
  | 'contact'
  | 'messages'
  | 'footer';

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

const sidebarItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'hero', label: 'Beranda (Hero)', icon: <Home size={20} /> },
  { id: 'about', label: 'Tentang Kami', icon: <Users size={20} /> },
  { id: 'events', label: 'Kegiatan', icon: <Calendar size={20} /> },
  { id: 'research', label: 'Riset', icon: <FlaskConical size={20} /> },
  { id: 'news', label: 'Berita', icon: <Newspaper size={20} /> },
  { id: 'gallery', label: 'Galeri Foto', icon: <Camera size={20} /> },
  { id: 'contact', label: 'Kontak', icon: <Phone size={20} /> },
  { id: 'messages', label: 'Pesan Masuk', icon: <Mail size={20} /> },
  { id: 'footer', label: 'Footer', icon: <PanelBottom size={20} /> },
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
    <div className="flex h-screen bg-[#f8f7f2] text-[#1c1515] overflow-hidden font-sans">
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
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#141010] text-white border-r border-[#262121] flex flex-col transition-transform duration-300 shadow-2xl shadow-black/40 lg:shadow-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
          <div className="w-10 h-10 flex items-center justify-center">
            <img src="/images/kspm-logo.png" alt="KSPM" className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(245,158,11,0.2)]" />
          </div>
          <div>
            <h1 className="font-semibold text-sm tracking-wide">KSPM Admin</h1>
            <p className="text-[11px] text-slate-400">FEB UIKA Bogor</p>
          </div>
          <button
            className="ml-auto lg:hidden p-1 hover:bg-slate-800 rounded"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-1.5 custom-scrollbar">
          {sidebarItems.map((item) => {
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
                  w-full flex items-center gap-3 px-4 py-3 lg:px-3 lg:py-2.5 rounded-xl text-[14px] lg:text-[13px] font-medium transition-all duration-300 group
                  ${isActive
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                    : 'text-[#c2baa9] hover:text-white hover:bg-white/5 border border-transparent'
                  }
                `}
              >
                <span className={isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'}>
                  {item.icon}
                </span>
                <span className="flex-1 text-left">{item.label}</span>
                {badge > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                    {badge}
                  </span>
                )}
                {isActive && <ChevronRight size={14} className="text-amber-500/50" />}
              </button>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="border-t border-white/5 p-4 bg-[#0d0a0a]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xs font-bold text-slate-900 shadow-md shadow-amber-500/20">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{adminName}</p>
              <p className="text-[11px] text-slate-400">Administrator</p>
            </div>
            <button
              onClick={onLogout}
              className="p-3 lg:p-2 text-[#c2baa9] hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
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
              {sidebarItems.find((i) => i.id === activeSection)?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span className="hidden sm:inline">KSPM Content Manager</span>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#f8f7f2] relative admin-theme-main">
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
