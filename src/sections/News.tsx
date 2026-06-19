import { useEffect, useRef, useState, useMemo } from 'react';
import { ArrowRight, Calendar, Star, Quote, Search, X } from 'lucide-react';
import { newsConfig } from '../config';

export function News() {
  // Null check: if config is empty, render nothing
  if (!newsConfig.mainTitle) return null;

  const sectionRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );

    const elements = sectionRef.current?.querySelectorAll('.fade-up, .slide-in-left, .slide-in-right, .scale-in');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="news"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute left-0 top-1/4 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl" />
      <div className="absolute right-0 bottom-1/4 w-48 h-48 bg-gold-500/5 rounded-full blur-3xl" />

      <div className="container-custom relative">
        {/* Section Header */}
        <div className="fade-up flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="font-script text-5xl md:text-6xl text-gold-400 block mb-2">{newsConfig.scriptText}</span>
            <span className="text-gold-500 text-xs uppercase tracking-[0.2em] mb-4 block">
              {newsConfig.subtitle}
            </span>
            <h2 className="font-serif text-h1 text-white has-bar">
              {newsConfig.mainTitle}
            </h2>
          </div>
          {newsConfig.viewAllText && (
            <button
              onClick={() => setShowAllModal(true)}
              className="btn-dark rounded-sm flex items-center gap-2 group w-fit cursor-pointer"
              aria-label={newsConfig.viewAllText}
            >
              {newsConfig.viewAllText}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          )}
        </div>

        {/* News Grid */}
        {newsConfig.articles.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {newsConfig.articles.slice(0, 4).map((item, index) => (
              <article
                key={item.id}
                className="fade-up group cursor-pointer"
                style={{ transitionDelay: `${0.1 + index * 0.1}s` }}
              >
                <a
                  href={item.url || "#"}
                  target={item.url?.startsWith('http') ? '_blank' : undefined}
                  rel={item.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="block w-full h-full"
                >
                {/* Image */}
                <div className="relative aspect-[3/2] rounded-lg overflow-hidden mb-5">
                  <img
                    src={item.image}
                    alt={`${item.title} - ${item.category}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-gold-500/90 text-white text-xs rounded-sm">
                      {item.category}
                    </span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div>
                  {/* Date */}
                  <div className="flex items-center gap-2 text-white/60 text-sm mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{item.date}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-h5 text-white mb-3 group-hover:text-gold-400 transition-colors">
                    {item.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-3">
                    {item.excerpt}
                  </p>

                  {/* Read More Link */}
                  {newsConfig.readMoreText && (
                    <span className="inline-flex items-center gap-2 text-gold-500 text-sm group-hover:gap-3 transition-all duration-300">
                      {newsConfig.readMoreText}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </div>
                </a>
              </article>
            ))}
          </div>
        )}

        {/* Testimonials Section */}
        {newsConfig.testimonials.length > 0 && (
          <div className="mt-24">
            <div className="fade-up text-center mb-12">
              <span className="font-script text-5xl md:text-6xl text-gold-400 block mb-2">{newsConfig.testimonialsScriptText}</span>
              <span className="text-gold-500 text-xs uppercase tracking-[0.2em] mb-4 block">
                {newsConfig.testimonialsSubtitle}
              </span>
              <h2 className="font-serif text-h2 text-white">
                {newsConfig.testimonialsMainTitle}
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {newsConfig.testimonials.map((t, index) => (
                <div
                  key={t.name}
                  className="scale-in p-8 bg-white/5 rounded-lg border border-white/10 relative"
                  style={{ transitionDelay: `${0.1 + index * 0.1}s` }}
                >
                  <Quote className="w-8 h-8 text-gold-500/30 absolute top-6 right-6" />
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-gold-500 fill-gold-500" />
                    ))}
                  </div>
                  <p className="text-white/80 leading-relaxed mb-6 italic">
                    "{t.text}"
                  </p>
                  <div>
                    <p className="text-white font-medium text-sm">{t.name}</p>
                    <p className="text-white/50 text-xs">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Story Section */}
        {newsConfig.storyTitle && (
          <div id="story" className="fade-up mt-24 pt-20 border-t border-white/10" style={{ transitionDelay: '0.1s' }}>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="slide-in-left">
                <span className="font-script text-5xl md:text-6xl text-gold-400 block mb-2">{newsConfig.storyScriptText}</span>
                <span className="text-gold-500 text-xs uppercase tracking-[0.2em] mb-4 block">
                  {newsConfig.storySubtitle}
                </span>
                <h2 className="font-serif text-h2 text-white mb-6">
                  {newsConfig.storyTitle}
                </h2>
                <div className="space-y-4 text-white/75 leading-relaxed">
                  {newsConfig.storyParagraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                {/* Timeline Highlights */}
                {newsConfig.storyTimeline.length > 0 && (
                  <div className="mt-8 grid grid-cols-3 gap-4">
                    {newsConfig.storyTimeline.map((item, index) => (
                      <div key={index} className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="font-serif text-2xl text-gold-500 mb-1">{item.value}</div>
                        <div className="text-xs text-white/60">{item.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Image */}
              <div className="slide-in-right relative">
                <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
                  {newsConfig.storyImage && (
                    <>
                      <img
                        src={newsConfig.storyImage}
                        alt={newsConfig.storyImageCaption}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </>
                  )}
                </div>

                {/* Quote Overlay */}
                {newsConfig.storyQuote.text && (
                  <div className="absolute bottom-6 left-6 right-6 p-6 bg-black/60 backdrop-blur-sm rounded-lg">
                    {newsConfig.storyQuote.prefix && (
                      <p className="font-script text-2xl text-gold-400 mb-1">{newsConfig.storyQuote.prefix}</p>
                    )}
                    <p className="text-white italic text-sm leading-relaxed mb-2">
                      "{newsConfig.storyQuote.text}"
                    </p>
                    {newsConfig.storyQuote.attribution && (
                      <p className="text-gold-400 text-xs">— {newsConfig.storyQuote.attribution}</p>
                    )}
                  </div>
                )}

                {/* Decorative Frame */}
                <div className="absolute -top-4 -right-4 w-full h-full border border-gold-500/20 rounded-lg -z-10" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* All News Modal */}
      {showAllModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-xl flex flex-col animate-fade-in text-left">
          {/* Header */}
          <div className="border-b border-white/10 bg-[#141414]/95 sticky top-0 z-10 px-4 md:px-8 py-6 backdrop-blur-md">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="font-script text-3xl text-gold-400 block mb-1">KSPM FEB UIKA</span>
                <h2 className="font-serif text-2xl md:text-3xl text-white tracking-wide">Semua Berita & Update Terkini</h2>
              </div>
              
              <div className="flex items-center gap-4 flex-wrap">
                {/* Search Input */}
                <div className="relative min-w-[260px]">
                  <Search className="w-4 h-4 text-white/50 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari berita..."
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-gold-500 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
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
                  className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
                  aria-label="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Category Pills */}
            <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto mt-6 pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-gold-500 text-black font-semibold'
                      : 'bg-white/5 hover:bg-white/10 text-white/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Modal Content */}
          <div className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-10 w-full">
            {filteredArticles.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((item) => (
                  <article
                    key={item.id}
                    className="group cursor-pointer flex flex-col bg-white/5 border border-white/10 rounded-lg overflow-hidden transition-all duration-300 hover:border-gold-500/30"
                  >
                    <a
                      href={item.url || "#"}
                      target={item.url?.startsWith('http') ? '_blank' : undefined}
                      rel={item.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex flex-col h-full"
                    >
                      {/* Image */}
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-gold-500/90 text-white text-xs rounded-sm">
                            {item.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-white/50 text-xs mb-3">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{item.date}</span>
                          </div>
                          <h3 className="font-serif text-lg text-white mb-3 group-hover:text-gold-400 transition-colors line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-white/70 text-sm leading-relaxed mb-6 line-clamp-3">
                            {item.excerpt}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-2 text-gold-500 text-sm font-medium mt-auto group-hover:gap-3 transition-all duration-300">
                          {newsConfig.readMoreText || "Baca Selengkapnya"}
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </a>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-white/60 text-lg">Tidak ada berita yang cocok dengan pencarian atau kategori ini.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('Semua');
                  }}
                  className="mt-4 text-gold-500 hover:text-gold-400 text-sm underline underline-offset-4 cursor-pointer"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
