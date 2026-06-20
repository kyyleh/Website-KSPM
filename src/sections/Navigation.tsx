import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Wine, Home, BookOpen, Newspaper, Users, Mail, Grape } from 'lucide-react';
import { navigationConfig } from '../config';

// Icon lookup map for dynamic icon resolution from config strings
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home, BookOpen, Newspaper, Users, Mail, Grape, Wine, Menu, X, ChevronDown,
};

export function Navigation({ currentPage, onNavigate }: { currentPage?: 'home' | 'about' | 'events' | 'research' | 'register'; onNavigate?: (href: string) => void }) {
  // Null check: if config is empty, render nothing
  if (!navigationConfig.brandName) return null;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isMobileMenuOpen
          ? 'bg-[#f0ede6] py-3'
          : isScrolled
            ? 'bg-[#f0ede6]/95 backdrop-blur-md py-3 shadow-premium border-b border-gold-500/10'
            : 'bg-transparent py-5'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => scrollToSection('#hero')}
          className="flex items-center gap-3 group"
          aria-label={navigationConfig.brandName}
        >
          {navigationConfig.brandLogo ? (
            <img 
              src={navigationConfig.brandLogo} 
              alt={`${navigationConfig.brandName} Logo`} 
              className="h-12 sm:h-16 w-auto transition-transform duration-300 group-hover:scale-110" 
            />
          ) : (
            <Wine className="w-8 h-8 text-gold-500 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
          )}
          <div className="flex flex-col text-left">
            <span className="font-serif text-2xl sm:text-3xl text-neutral-900 tracking-wide">{navigationConfig.brandName}</span>
            <span className="text-[9px] sm:text-xs text-gold-gradient tracking-wider sm:tracking-widest uppercase mt-0.5">{navigationConfig.tagline}</span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8" role="menubar">
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
                  className={`flex items-center gap-1 text-sm transition-colors duration-300 py-2 ${
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

                {/* Dropdown Menu */}
                {link.dropdown && (
                  <div
                    className={`absolute top-full left-0 pt-2 transition-all duration-300 ${
                      activeDropdown === link.name
                        ? 'opacity-100 visible translate-y-0'
                        : 'opacity-0 invisible -translate-y-2'
                    }`}
                    role="menu"
                  >
                    <div className="bg-white/95 backdrop-blur-md rounded-xl overflow-hidden min-w-[180px] border border-neutral-200/60 shadow-premium py-1">
                      {link.dropdown.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => scrollToSection(item.href)}
                          className="block w-full text-left px-4 py-3 text-sm text-neutral-700 hover:bg-gold-500/10 hover:text-gold-600 transition-colors"
                          role="menuitem"
                        >
                          {item.name}
                        </button>
                      ))}
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
            className="hidden lg:block btn-primary rounded"
            aria-label={navigationConfig.ctaButtonText}
          >
            {navigationConfig.ctaButtonText}
          </button>
        )}

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-neutral-800"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 top-[72px] mobile-menu-blur transition-all duration-500 ${
          isMobileMenuOpen
            ? 'opacity-100 visible'
            : 'opacity-0 invisible pointer-events-none'
        }`}
        role="menu"
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="container-custom py-8 flex flex-col gap-2">
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
                    <div className="flex items-center justify-between w-full border-b border-neutral-200/60">
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
                    className={`flex items-center gap-3 w-full py-4 text-lg border-b border-neutral-200/60 transition-colors ${
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
              className="btn-primary rounded mt-6 text-center"
              role="menuitem"
            >
              {navigationConfig.ctaButtonText}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
