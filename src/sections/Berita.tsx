import { useEffect, useState, useMemo } from 'react';
import { Calendar, Search, X } from 'lucide-react';
import { newsConfig as staticNewsConfig } from '../config';
import { getMediaUrl } from '../lib/strapi';

export function Berita({ data }: { data?: typeof staticNewsConfig }) {
  const newsConfig = data || staticNewsConfig;
  // Null check: if config is empty, render nothing
  if (!newsConfig.mainTitle) return null;

  const [showAllModal, setShowAllModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  useEffect(() => {
    // block scroll when modal is open
    if (showAllModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showAllModal]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    newsConfig.articles.forEach(art => {
      if (art.category) cats.add(art.category);
    });
    return ['Semua', ...Array.from(cats)];
  }, []);

  const filteredArticles = useMemo(() => {
    return newsConfig.articles.filter(art => {
      const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Semua' || art.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <section
      id="articles"
      className="relative w-full overflow-hidden bg-background py-8 sm:py-12 md:py-16"
    >
      {/* Background accents matching BEM */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 80% 30%, rgba(201, 146, 42, 0.3) 0%, transparent 40%),
                            radial-gradient(circle at 20% 70%, rgba(201, 146, 42, 0.25) 0%, transparent 40%)`
        }}
      />

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-baseline gap-2 mb-6 sm:mb-10 md:mb-16 border-b border-border pb-4 sm:pb-6 md:pb-8">
          <div>
            <h2 className="font-sans text-4xl sm:text-5xl font-extrabold text-primary tracking-tight uppercase">
              {newsConfig.mainTitle}
            </h2>
          </div>
        </div>

        {/* Grid of Articles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
          {newsConfig.articles.slice(0, 4).map((art) => (
            <article
              key={art.id}
              onClick={() => {
                if (art.url) {
                  window.open(art.url, art.url.startsWith('http') ? '_blank' : '_self', 'noopener noreferrer');
                }
              }}
              className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-premium hover:-translate-y-1.5 transition-all duration-500 ease-out flex flex-col cursor-pointer group"
            >
              {/* Image container */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-neutral-100">
                <img
                  src={getMediaUrl(art.image)}
                  alt={art.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 text-[8px] sm:text-[10px] font-bold tracking-widest text-primary bg-white border border-border px-2 sm:px-3 py-1 sm:py-1.5 rounded-full sm:rounded-lg shadow-sm font-script uppercase">
                  {art.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-3 sm:p-5 md:p-6 flex flex-col gap-2 sm:gap-3 md:gap-4 flex-grow">
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[9px] sm:text-xs text-gold-600 font-bold font-script uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 flex-shrink-0" />
                    <span>{art.date}</span>
                  </div>
                </div>

                <div className="flex-grow">
                  <h3 className="font-sans text-xs min-[375px]:text-sm sm:text-base md:text-lg font-bold text-primary leading-snug mb-2 group-hover:text-gold-600 transition-colors duration-300">
                    {art.title}
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>

                <button className="self-start bg-transparent border-none text-gold-600 font-bold text-[10px] sm:text-xs tracking-normal sm:tracking-widest uppercase flex items-center gap-1 mt-2 sm:mt-auto cursor-pointer">
                  {newsConfig.readMoreText || 'Selengkapnya'} &rarr;
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        {newsConfig.articles.length > 4 && (
          <div className="text-center mt-8 sm:mt-12 md:mt-16">
            <button
              onClick={() => setShowAllModal(true)}
              className="font-sans text-xs sm:text-sm font-bold tracking-widest text-primary bg-transparent hover:bg-primary hover:text-white border border-primary px-8 py-4 rounded-lg cursor-pointer uppercase transition-all duration-300"
            >
              {newsConfig.viewAllText || 'Lihat Semua Artikel'} &rarr;
            </button>
          </div>
        )}

      </div>

      {/* All News Modal */}
      {showAllModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-background/95 backdrop-blur-md flex flex-col animate-fade-in text-left">
          {/* Header */}
          <div className="border-b border-border bg-background/90 sticky top-0 z-10 px-6 py-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-sans text-2xl md:text-3xl font-extrabold text-primary uppercase">Semua Berita & Update</h2>
              </div>
              
              <div className="flex items-center gap-4 flex-wrap">
                {/* Search Input */}
                <div className="relative min-w-[260px]">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari berita..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-lg text-neutral-800 text-sm focus:outline-none focus:ring-1 focus:ring-secondary transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
  
                {/* Close Button */}
                <button
                  onClick={() => {
                    setShowAllModal(false);
                    setSearchQuery('');
                    setSelectedCategory('Semua');
                  }}
                  className="p-3 bg-white border border-border rounded-full hover:bg-neutral-50 text-neutral-800 transition-colors cursor-pointer shadow-sm"
                  aria-label="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Category Pills */}
            <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto mt-6 pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                    selectedCategory === cat
                      ? 'bg-secondary border-secondary text-white font-bold shadow-sm'
                      : 'bg-white hover:bg-neutral-50 text-neutral-600 border-border'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Modal Content */}
          <div className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full">
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((art) => (
                  <article
                    key={art.id}
                    onClick={() => {
                      if (art.url) {
                        window.open(art.url, art.url.startsWith('http') ? '_blank' : '_self', 'noopener noreferrer');
                      }
                    }}
                    className="group cursor-pointer flex flex-col bg-white border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-premium hover:-translate-y-1.5 transition-all duration-500 ease-out"
                  >
                    {/* Image */}
                    <div className="relative w-full aspect-[16/10] overflow-hidden bg-neutral-100">
                      <img
                        src={getMediaUrl(art.image)}
                        alt={art.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <span className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 text-[8px] sm:text-[10px] font-bold tracking-widest text-primary bg-white border border-border px-2 sm:px-3 py-1 sm:py-1.5 rounded-full sm:rounded-lg shadow-sm font-script uppercase">
                        {art.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-grow flex flex-col justify-between gap-4">
                      {/* Details */}
                      <div className="flex-grow">
                        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[9px] sm:text-xs text-gold-600 font-bold font-script uppercase tracking-wider mb-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 flex-shrink-0" />
                            <span>{art.date}</span>
                          </div>
                        </div>
                        <h3 className="font-sans text-xs min-[375px]:text-sm sm:text-base md:text-lg font-bold text-primary leading-snug mb-2 group-hover:text-gold-600 transition-colors duration-300">
                          {art.title}
                        </h3>
                        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed line-clamp-3">
                          {art.excerpt}
                        </p>
                      </div>
                      <button className="self-start bg-transparent border-none text-gold-600 font-bold text-[10px] sm:text-xs tracking-normal sm:tracking-widest uppercase flex items-center gap-1 mt-2 sm:mt-auto cursor-pointer">
                        {newsConfig.readMoreText || 'Selengkapnya'} &rarr;
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-base">Tidak ada artikel yang cocok dengan pencarian Anda.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
