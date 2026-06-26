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
} from 'lucide-react';

export type AdminSection =
  | 'dashboard'
  | 'hero'
  | 'about'
  | 'events'
  | 'research'
  | 'news'
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
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-slate-900 text-sm">
            K
          </div>
          <div>
            <h1 className="font-semibold text-sm tracking-wide">KSPM Admin</h1>
            <p className="text-[11px] text-slate-500">FEB UIKA Bogor</p>
          </div>
          <button
            className="ml-auto lg:hidden p-1 hover:bg-slate-800 rounded"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
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
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group
                  ${isActive
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
                  }
                `}
              >
                <span className={isActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'}>
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
        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xs font-bold text-slate-900">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{adminName}</p>
              <p className="text-[11px] text-slate-500">Administrator</p>
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 flex items-center gap-4 px-4 lg:px-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm shrink-0">
          <button
            className="lg:hidden p-2 hover:bg-slate-800 rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div className="flex-1">
            <h2 className="text-sm font-semibold capitalize">
              {sidebarItems.find((i) => i.id === activeSection)?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="hidden sm:inline">KSPM Content Manager</span>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
