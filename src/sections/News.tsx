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
        {/* Story Section */}
        {newsConfig.storyTitle && (
          <div id="story" className="fade-up" style={{ transitionDelay: '0.1s' }}>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="slide-in-left">
                <span className="font-script text-3xl md:text-5xl lg:text-6xl text-gold-gradient block mb-2">{newsConfig.storyScriptText}</span>
                <span className="text-gold-gradient text-xs uppercase tracking-[0.2em] mb-4 block">
                  {newsConfig.storySubtitle}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-h2 text-[#1c1515] mb-6">
                  {newsConfig.storyTitle}
                </h2>
                <div className="space-y-4 text-[#4a4545] leading-relaxed">
                  {newsConfig.storyParagraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                {/* Timeline Highlights */}
                {newsConfig.storyTimeline.length > 0 && (
                  <div className="mt-8 grid grid-cols-3 gap-4">
                    {newsConfig.storyTimeline.map((item, index) => (
                      <div key={index} className="text-center p-2 sm:p-4 bg-white/80 border border-neutral-200/50 rounded-xl shadow-premium hover:shadow-gold-soft transition-all duration-300">
                        <div className="font-serif text-2xl text-gold-gradient font-bold mb-1">{item.value}</div>
                        <div className="text-xs text-neutral-500">{item.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Image & Quote Side */}
              <div className="slide-in-right space-y-6">
                <div className="relative">
                  <div className="relative aspect-[3/2] rounded-xl overflow-hidden border border-neutral-200/60 shadow-premium bg-white z-10">
                    {newsConfig.storyImage && (
                      <img
                        src={newsConfig.storyImage}
                        alt={newsConfig.storyImageCaption}
                        loading="lazy"
                        className="w-full h-full object-cover object-center"
                      />
                    )}
                  </div>
                  {/* Decorative Frame */}
                  <div className="absolute -top-4 -right-4 w-full h-full border border-gold-500/20 rounded-lg z-0 pointer-events-none" />
                </div>

                {/* Quote Box */}
                {newsConfig.storyQuote.text && (
                  <div className="p-6 bg-white/95 backdrop-blur-md rounded-xl shadow-premium border border-gold-300/40">
                    {newsConfig.storyQuote.prefix && (
                      <p className="font-script text-2xl text-[#7a6024] mb-1">{newsConfig.storyQuote.prefix}</p>
                    )}
                    <p className="text-[#1c1515] italic text-sm leading-relaxed mb-2">
                      "{newsConfig.storyQuote.text}"
                    </p>
                    {newsConfig.storyQuote.attribution && (
                      <p className="text-[#7a6024] text-xs">— {newsConfig.storyQuote.attribution}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Testimonials Section */}
        {newsConfig.testimonials.length > 0 && (
          <div className="mt-24 pt-20 border-t border-neutral-200">
            <div className="fade-up text-center mb-12">
              <span className="font-script text-3xl md:text-5xl lg:text-6xl text-gold-gradient block mb-2">{newsConfig.testimonialsScriptText}</span>
              <span className="text-gold-gradient text-xs uppercase tracking-[0.2em] mb-4 block">
                {newsConfig.testimonialsSubtitle}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-h2 text-[#1c1515]">
                {newsConfig.testimonialsMainTitle}
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {newsConfig.testimonials.map((t, index) => (
                <div
                  key={t.name}
                  className="scale-in p-8 bg-white/90 backdrop-blur-sm border border-neutral-200/60 rounded-xl shadow-premium relative hover:shadow-gold-soft hover:-translate-y-1 transition-all duration-300"
                  style={{ transitionDelay: `${0.1 + index * 0.1}s` }}
                >
                  <Quote className="w-8 h-8 text-gold-500/20 absolute top-6 right-6" />
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-gold-500 fill-gold-500" />
                    ))}
                  </div>
                  <p className="text-[#4a4545] leading-relaxed mb-6 italic">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-4">
                    {t.image ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-gold-500/30 flex-shrink-0">
                        <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 font-semibold text-sm flex-shrink-0 border border-neutral-200">
                        {t.name.charAt(0)}
                      </div>
                    )}
                    <div className="text-left">
                      <p className="text-[#1c1515] font-medium text-sm">{t.name}</p>
                      <p className="text-neutral-500 text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* News Section */}
        <div className="mt-24 pt-20 border-t border-neutral-200">
          {/* Section Header */}
          <div className="fade-up flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <span className="font-script text-3xl md:text-5xl lg:text-6xl text-gold-gradient block mb-2">{newsConfig.scriptText}</span>
              <span className="text-gold-gradient text-xs uppercase tracking-[0.2em] mb-4 block">
                {newsConfig.subtitle}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-h1 text-[#1c1515] has-bar">
                {newsConfig.mainTitle}
              </h2>
            </div>
            {newsConfig.viewAllText && (
              <button
                onClick={() => setShowAllModal(true)}
                className="bg-[#1c1515] text-white hover:bg-gold-500 transition-all duration-300 px-6 py-3 text-sm font-medium tracking-wide rounded-sm flex items-center gap-2 group w-fit cursor-pointer border border-[#1c1515] hover:border-gold-500"
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
                  className="fade-up group cursor-pointer bg-white/90 border border-neutral-200/60 rounded-xl p-4 shadow-premium hover:shadow-gold-soft hover:border-gold-400 hover:-translate-y-1 transition-all duration-300 flex flex-col"
                  style={{ transitionDelay: `${0.1 + index * 0.1}s` }}
                >
                  <a
                    href={item.url || "#"}
                    target={item.url?.startsWith('http') ? '_blank' : undefined}
                    rel={item.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex flex-col h-full justify-between"
                  >
                    <div>
                      {/* Image */}
                      <div className="relative aspect-[3/2] rounded-lg overflow-hidden mb-5 border border-neutral-100">
                        <img
                          src={item.image}
                          alt={`${item.title} - ${item.category}`}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-gold-btn-gradient text-white text-xs font-medium rounded-sm shadow-sm">
                            {item.category}
                          </span>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10">
                          <div className="w-12 h-12 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center text-neutral-800 shadow-gold-soft">
                            <ArrowRight className="w-5 h-5 text-gold-600" />
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div>
                        {/* Date */}
                        <div className="flex items-center gap-2 text-neutral-500 text-xs mb-3">
                          <Calendar className="w-3.5 h-3.5 text-gold-500" />
                          <span>{item.date}</span>
                        </div>

                        {/* Title */}
                        <h3 className="font-serif text-h5 text-[#1c1515] mb-3 group-hover:text-gold-600 transition-colors font-semibold">
                          {item.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-[#4a4545] text-sm leading-relaxed mb-4 line-clamp-3">
                          {item.excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Read More Link */}
                    {newsConfig.readMoreText && (
                      <div className="pt-2 border-t border-neutral-100 mt-2">
                        <span className="inline-flex items-center gap-2 text-[#7a6024] font-medium text-sm group-hover:gap-3 transition-all duration-300">
                          {newsConfig.readMoreText}
                          <ArrowRight className="w-4 h-4 text-gold-500" />
                        </span>
                      </div>
                    )}
                  </a>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* All News Modal */}
      {showAllModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#f0ede6]/95 backdrop-blur-xl flex flex-col animate-fade-in text-left">
          {/* Header */}
          <div className="border-b border-neutral-200 bg-[#f0ede6]/95 sticky top-0 z-10 px-4 md:px-8 py-6 backdrop-blur-md">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="font-script text-3xl text-[#7a6024] block mb-1">KSPM FEB UIKA</span>
                <h2 className="font-serif text-2xl md:text-3xl text-[#1c1515] tracking-wide">Semua Berita & Update Terkini</h2>
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
                    className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-300 rounded text-neutral-800 text-sm focus:outline-none focus:border-gold-500 transition-colors"
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
                  className="p-3 bg-white border border-neutral-200 rounded-full hover:bg-neutral-100 text-neutral-800 transition-colors cursor-pointer shadow-sm"
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
                  className={`px-4 py-1.5 rounded-full text-xs transition-all whitespace-nowrap cursor-pointer border ${
                    selectedCategory === cat
                      ? 'bg-gold-500 border-gold-500 text-white font-semibold shadow-md'
                      : 'bg-white hover:bg-neutral-100 text-neutral-800 border-neutral-200 shadow-sm'
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
                    className="group cursor-pointer flex flex-col bg-white/90 border border-neutral-200/60 rounded-xl overflow-hidden transition-all duration-300 shadow-premium hover:shadow-gold-soft hover:border-gold-400 hover:-translate-y-1"
                  >
                    <a
                      href={item.url || "#"}
                      target={item.url?.startsWith('http') ? '_blank' : undefined}
                      rel={item.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex flex-col h-full"
                    >
                      {/* Image */}
                      <div className="relative aspect-[16/10] overflow-hidden border-b border-neutral-150">
                        <img
                          src={item.image}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-gold-500/90 text-white text-xs rounded-sm">
                            {item.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-neutral-500 text-xs mb-3">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{item.date}</span>
                          </div>
                          <h3 className="font-serif text-lg text-[#1c1515] mb-3 group-hover:text-gold-500 transition-colors line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-[#4a4545] text-sm leading-relaxed mb-6 line-clamp-3">
                            {item.excerpt}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-2 text-[#7a6024] text-sm font-medium mt-auto group-hover:gap-3 transition-all duration-300">
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
                <p className="text-neutral-600 text-lg">Tidak ada berita yang cocok dengan pencarian atau kategori ini.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('Semua');
                  }}
                  className="mt-4 text-[#7a6024] hover:text-gold-500 text-sm underline underline-offset-4 cursor-pointer"
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
