import { Wine, MapPin, Phone, Mail, Instagram, Facebook, Twitter, Youtube, ArrowUp, Linkedin, Music, MessageCircle } from 'lucide-react';
import { footerConfig } from '../config';

// Icon lookup map for dynamic icon resolution from config strings
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wine, MapPin, Phone, Mail, Instagram, Facebook, Twitter, Youtube, ArrowUp, Linkedin, Music, MessageCircle,
};

export function Footer({ onNavigate }: { onNavigate?: (href: string) => void }) {
  // Null check: if config is empty, render nothing
  if (!footerConfig.brandName) return null;

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
    <footer className="relative border-t border-neutral-300/50 bg-[#f0ede6] text-neutral-800" role="contentinfo">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              {footerConfig.brandLogo ? (
                <img 
                  src={footerConfig.brandLogo} 
                  alt={`${footerConfig.brandName} Logo`} 
                  className="h-16 w-auto" 
                />
              ) : (
                <Wine className="w-8 h-8 text-gold-500" aria-hidden="true" />
              )}
              <div>
                <span className="font-serif text-3xl md:text-4xl text-[#1c1515] tracking-wide block">{footerConfig.brandName}</span>
                {footerConfig.tagline && (
                  <span className="text-xs md:text-sm text-[#7a6024] tracking-widest uppercase mt-1 block">{footerConfig.tagline}</span>
                )}
              </div>
            </div>
            {footerConfig.description && (
              <p className="text-neutral-600 text-sm leading-relaxed mb-6">
                {footerConfig.description}
              </p>
            )}
            {/* Social Links */}
            {footerConfig.socialLinks.length > 0 && (
              <nav aria-label="Social media links">
                <div className="flex gap-3">
                  {footerConfig.socialLinks.map((social) => {
                    const IconComponent = iconMap[social.icon];
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        aria-label={social.label}
                        className="w-10 h-10 rounded-full bg-white border border-neutral-300 flex items-center justify-center text-neutral-600 hover:bg-gold-500 hover:border-gold-500 hover:text-white transition-all duration-300 shadow-sm cursor-pointer"
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
          {footerConfig.linkGroups.map((group, index) => (
            <nav key={index} aria-label={group.title}>
              <h3 className="font-serif text-lg text-[#1c1515] mb-5">{group.title}</h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-neutral-600 text-sm hover:text-[#7a6024] transition-colors cursor-pointer"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Contact Info + Newsletter */}
          <div>
            {footerConfig.contactItems.length > 0 && (
              <>
                <h3 className="font-serif text-lg text-[#1c1515] mb-5">Kontak</h3>
                <ul className="space-y-4">
                  {footerConfig.contactItems.map((item, index) => {
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
      <div className="border-t border-neutral-300/50">
        <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-neutral-500 text-xs">
            {footerConfig.copyrightText && (
              <span>{footerConfig.copyrightText}</span>
            )}
            {footerConfig.legalLinks.map((link, index) => (
              <span key={index}>
                <span className="hidden md:inline">|</span>
                <button className="hover:text-[#7a6024] transition-colors ml-2 md:ml-0 cursor-pointer">{link}</button>
              </span>
            ))}
            {footerConfig.icpText && (
              <>
                <span className="hidden md:inline">|</span>
                <span>{footerConfig.icpText}</span>
              </>
            )}
          </div>

          {/* Back to Top */}
          {footerConfig.backToTopText && (
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-neutral-600 hover:text-[#7a6024] transition-colors group cursor-pointer"
              aria-label={footerConfig.backToTopText}
            >
              <span className="text-sm font-medium">{footerConfig.backToTopText}</span>
              <div className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center group-hover:border-gold-500 group-hover:bg-gold-500 group-hover:text-white transition-all duration-300 shadow-sm">
                <ArrowUp className="w-4 h-4" />
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Age Verification Note */}
      {footerConfig.ageVerificationText && (
        <div className="bg-[#e3ded4] py-3">
          <div className="container-custom">
            <p className="text-center text-neutral-600 text-xs">
              {footerConfig.ageVerificationText}
            </p>
          </div>
        </div>
      )}
    </footer>
  );
}
