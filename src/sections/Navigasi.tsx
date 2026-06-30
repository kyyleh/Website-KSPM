import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, TrendingUp, Home, BookOpen, Newspaper, Users, Mail, Activity, Camera } from 'lucide-react';
import { navigationConfig } from '../config';

// Icon lookup map for dynamic icon resolution from config strings
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home, BookOpen, Newspaper, Users, Mail, Activity, TrendingUp, Menu, X, ChevronDown, Camera,
};

export function Navigasi({ currentPage, onNavigate }: { currentPage?: 'home' | 'about' | 'events' | 'research' | 'register' | 'gallery'; onNavigate?: (href: string) => void }) {
  // Null check: if config is empty, render nothing
  if (!navigationConfig.brandName) return null;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 100);
      
      // Smart sticky logic: hide on scroll down (if passed 300px), show on scroll up
      if (currentScrollY > lastScrollY.current && currentScrollY > 300) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const scrollToSection = (href: string) => {
    if (onNavigate) {
      onNavigate(href);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const navLinks = navigationConfig.navLinks;

  return (
    <>
      <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isMobileMenuOpen
          ? 'bg-background py-3 translate-y-0'
          : isHidden
            ? '-translate-y-full'
            : isScrolled
              ? 'bg-background/95 backdrop-blur-md py-3 shadow-premium border-b border-gold-500/10 translate-y-0'
              : 'bg-background py-5 shadow-sm border-b border-gold-500/5 translate-y-0'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => scrollToSection('#hero')}
          className="flex items-center gap-2 sm:gap-3 group"
          aria-label={navigationConfig.brandName}
        >
          {navigationConfig.brandLogo ? (
            <img 
              src={navigationConfig.brandLogo} 
              alt={`${navigationConfig.brandName} Logo`} 
              className="h-10 lg:h-12 xl:h-16 w-auto transition-transform duration-300 group-hover:scale-110" 
            />
          ) : (
            <TrendingUp className="w-8 h-8 text-gold-500 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
          )}
          <div className="flex flex-col text-left">
            <span className="font-serif text-xl sm:text-2xl lg:text-xl xl:text-3xl text-neutral-900 tracking-wide">{navigationConfig.brandName}</span>
            <span className="text-[8px] sm:text-xs lg:text-[9px] xl:text-xs text-gold-gradient tracking-wider xl:tracking-widest uppercase mt-0.5">{navigationConfig.tagline}</span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-8" role="menubar">
          {navLinks.map((link) => {
            return (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() => link.dropdown && setActiveDropdown(link.name)}
                onMouseLeave={() => setActiveDropdown(null)}
                role="none"
              >
                <button
                  onClick={() => scrollToSection(link.href)}
                  className={`flex items-center gap-1 text-xs xl:text-sm transition-colors duration-300 py-2 ${
                    (link.name === 'Tentang Kami' && currentPage === 'about') ||
                    (link.name === 'Beranda' && currentPage === 'home') ||
                    (link.name === 'Kegiatan' && currentPage === 'events') ||
                    (link.name === 'Riset' && currentPage === 'research')
                      ? 'text-gold-600 font-semibold'
                      : 'text-neutral-800 hover:text-gold-600'
                  }`}
                  role="menuitem"
                  aria-haspopup={link.dropdown ? 'true' : undefined}
                  aria-expanded={link.dropdown ? activeDropdown === link.name : undefined}
                >
                  {link.name}
                  {link.dropdown && (
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                      activeDropdown === link.name ? 'rotate-180' : ''
                    }`} aria-hidden="true" />
                  )}
                </button>

                {/* Dropdown Menu (Mega Menu Style) */}
                {link.dropdown && (
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 ${
                      activeDropdown === link.name
                        ? 'opacity-100 visible translate-y-0'
                        : 'opacity-0 invisible -translate-y-2'
                    }`}
                    role="menu"
                  >
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden min-w-[320px] border border-gold-500/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] p-3 relative">
                      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-gold-400 to-gold-600" />
                      <div className="px-3 pt-3 pb-2 mb-2 border-b border-border flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gold-600 uppercase tracking-widest">
                          Menu {link.name}
                        </span>
                      </div>
                      <div className="grid gap-1">
                        {link.dropdown.map((item) => (
                          <button
                            key={item.name}
                            onClick={() => scrollToSection(item.href)}
                            className="group flex items-center gap-3 w-full text-left px-3 py-3 rounded-xl transition-all duration-300 hover:bg-gold-50/80"
                            role="menuitem"
                          >
                            <div className="w-10 h-10 rounded-lg bg-gold-50 flex items-center justify-center border border-gold-100 group-hover:border-gold-300 group-hover:bg-gold-100 transition-colors shadow-sm">
                              <span className="text-gold-500 font-serif font-bold text-lg leading-none transform group-hover:scale-110 transition-transform">{item.name.charAt(0)}</span>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-neutral-800 group-hover:text-gold-700 transition-colors">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-neutral-500 mt-0.5">Lihat selengkapnya</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        {navigationConfig.ctaButtonText && (
          <button
            onClick={() => scrollToSection('#register')}
            className="hidden lg:block btn-primary rounded-lg px-3 py-1.5 text-xs xl:px-8 xl:py-3 xl:text-sm"
            aria-label={navigationConfig.ctaButtonText}
          >
            {navigationConfig.ctaButtonText}
          </button>
        )}

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-4 -mr-4 text-neutral-800 relative z-50 pointer-events-auto cursor-pointer"
          onClick={() => {
            console.log('Mobile menu clicked! Previous state:', isMobileMenuOpen);
            setIsMobileMenuOpen(prev => !prev);
          }}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>
    </nav>

    {/* Mobile Menu */}
    <div
      className={`lg:hidden fixed inset-0 top-[72px] sm:top-[88px] z-40 mobile-menu-blur transition-opacity duration-500 overflow-y-auto ${
        isMobileMenuOpen
          ? 'opacity-100 visible'
            : 'opacity-0 invisible pointer-events-none'
        }`}
        role="menu"
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="container-custom pt-8 pb-20 flex flex-col gap-2">
          {navLinks.map((link, index) => {
            const IconComponent = iconMap[link.icon];
            return (
              <div
                key={link.name}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {link.dropdown ? (
                  <div>
                    <div className="flex items-center justify-between w-full border-b border-border">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                        className={`flex items-center gap-3 py-4 text-lg transition-colors flex-1 text-left ${
                          (link.name === 'Tentang Kami' && currentPage === 'about') ||
                          (link.name === 'Kegiatan' && currentPage === 'events') ||
                          (link.name === 'Riset' && currentPage === 'research')
                            ? 'text-gold-600 font-semibold'
                            : 'text-neutral-800 hover:text-gold-600'
                        }`}
                        role="menuitem"
                      >
                        {IconComponent && <IconComponent className="w-5 h-5 text-gold-500" />}
                        {link.name}
                      </button>
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                        className="p-4 text-neutral-800 hover:text-gold-600 transition-colors"
                        aria-expanded={activeDropdown === link.name}
                        aria-label={`Toggle ${link.name} dropdown`}
                      >
                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${
                          activeDropdown === link.name ? 'rotate-180' : ''
                        }`} aria-hidden="true" />
                      </button>
                    </div>
                    <div
                      className={`overflow-hidden transition-all duration-500 ${
                        activeDropdown === link.name ? 'max-h-60' : 'max-h-0'
                      }`}
                      role="menu"
                    >
                      {link.dropdown.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => scrollToSection(item.href)}
                          className="block w-full text-left pl-12 py-3 text-neutral-600 hover:text-gold-600"
                          role="menuitem"
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className={`flex items-center gap-3 w-full py-4 text-lg border-b border-border transition-colors ${
                      (link.name === 'Beranda' && currentPage === 'home') ||
                      (link.name === 'Tentang Kami' && currentPage === 'about') ||
                      (link.name === 'Kegiatan' && currentPage === 'events') ||
                      (link.name === 'Riset' && currentPage === 'research')
                        ? 'text-gold-600 font-semibold'
                        : 'text-neutral-800 hover:text-gold-600'
                    }`}
                    role="menuitem"
                  >
                    {IconComponent && <IconComponent className="w-5 h-5 text-gold-500" />}
                    {link.name}
                  </button>
                )}
              </div>
            );
          })}

          {navigationConfig.ctaButtonText && (
            <button
              onClick={() => scrollToSection('#register')}
              className="btn-primary rounded-lg mt-6 text-center"
              role="menuitem"
            >
              {navigationConfig.ctaButtonText}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
