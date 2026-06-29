import { TrendingUp, MapPin, Phone, Mail, Instagram, Facebook, Twitter, Youtube, ArrowUp, Linkedin, Music, MessageCircle } from 'lucide-react';
import { footerConfig } from '../config';

// Icon lookup map for dynamic icon resolution from config strings
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp, MapPin, Phone, Mail, Instagram, Facebook, Twitter, Youtube, ArrowUp, Linkedin, Music, MessageCircle,
};

export function Footer({ onNavigate, data }: { onNavigate?: (href: string) => void; data?: typeof footerConfig }) {
  const activeConfig = data || footerConfig;

  // Null check: if config is empty, render nothing
  if (!activeConfig.brandName) return null;

  const scrollToTop = () => {
    if (onNavigate) {
      onNavigate('#hero');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToSection = (href: string) => {
    if (onNavigate) {
      onNavigate(href);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="relative border-t border-border bg-background text-neutral-800" role="contentinfo">
      {/* Main Footer */}
      <div className="container-custom py-10 sm:py-12 lg:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              {activeConfig.brandLogo ? (
                <img 
                  src={activeConfig.brandLogo} 
                  alt={`${activeConfig.brandName} Logo`} 
                  className="h-16 w-auto" 
                />
              ) : (
                <TrendingUp className="w-8 h-8 text-gold-500" aria-hidden="true" />
              )}
              <div>
                <span className="font-serif text-3xl md:text-4xl text-[#1c1515] tracking-wide block">{activeConfig.brandName}</span>
                {activeConfig.tagline && (
                  <span className="text-xs md:text-sm text-[#7a6024] tracking-widest uppercase mt-1 block">{activeConfig.tagline}</span>
                )}
              </div>
            </div>
            {activeConfig.description && (
              <p className="text-neutral-600 text-sm leading-relaxed mb-6">
                {activeConfig.description}
              </p>
            )}
            {/* Social Links */}
            {activeConfig.socialLinks.length > 0 && (
              <nav aria-label="Social media links">
                <div className="flex gap-3">
                  {activeConfig.socialLinks.map((social) => {
                    const IconComponent = iconMap[social.icon];
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        aria-label={social.label}
                        className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-neutral-600 hover:bg-gold-500 hover:border-gold-500 hover:text-white transition-all duration-300 shadow-sm cursor-pointer"
                      >
                        {IconComponent && <IconComponent className="w-4 h-4" />}
                      </a>
                    );
                  })}
                </div>
              </nav>
            )}
          </div>

          {/* Link Groups */}
          {activeConfig.linkGroups.map((group, index) => (
            <nav key={index} aria-label={group.title} className="col-span-1">
              <h3 className="font-serif text-lg text-[#1c1515] mb-5">{group.title}</h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-left text-neutral-600 text-sm hover:text-[#7a6024] transition-colors cursor-pointer"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Contact Info + Newsletter */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            {activeConfig.contactItems.length > 0 && (
              <>
                <h3 className="font-serif text-lg text-[#1c1515] mb-5">Kontak</h3>
                <ul className="space-y-4">
                  {activeConfig.contactItems.map((item, index) => {
                    const IconComponent = iconMap[item.icon];
                    return (
                      <li key={index} className="flex items-start gap-3">
                        {IconComponent && <IconComponent className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" aria-hidden="true" />}
                        <span className="text-neutral-600 text-sm">{item.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}


          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container-custom py-4 sm:py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-neutral-500 text-xs">
            {activeConfig.copyrightText && (
              <span>{activeConfig.copyrightText}</span>
            )}
            {activeConfig.legalLinks.map((link, index) => (
              <span key={index}>
                <span className="hidden md:inline">|</span>
                <button className="hover:text-[#7a6024] transition-colors ml-2 md:ml-0 cursor-pointer">{link}</button>
              </span>
            ))}
            {activeConfig.icpText && (
              <>
                <span className="hidden md:inline">|</span>
                <span>{activeConfig.icpText}</span>
              </>
            )}
          </div>

          {/* Back to Top */}
          {activeConfig.backToTopText && (
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-neutral-600 hover:text-[#7a6024] transition-colors group cursor-pointer"
              aria-label={activeConfig.backToTopText}
            >
              <span className="text-sm font-medium">{activeConfig.backToTopText}</span>
              <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:border-gold-500 group-hover:bg-gold-500 group-hover:text-white transition-all duration-300 shadow-sm">
                <ArrowUp className="w-4 h-4" />
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Age Verification Note */}
      {activeConfig.ageVerificationText && (
        <div className="bg-[#e3ded4] py-3">
          <div className="container-custom">
            <p className="text-center text-neutral-600 text-xs">
              {activeConfig.ageVerificationText}
            </p>
          </div>
        </div>
      )}
    </footer>
  );
}
