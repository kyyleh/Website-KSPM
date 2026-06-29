import { useState } from 'react';
import { galleryConfig, type GalleryItem } from '../config';

interface GalleryProps {
  isStandalone?: boolean;
  onNavigate?: (href: string) => void;
  data?: any;
}

export function Gallery({ isStandalone = false, onNavigate, data }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Fallback pattern: support both array and wrapper object { items: GalleryItem[] }
  const activeGallery = data 
    ? (Array.isArray(data) ? data : (data.items || galleryConfig))
    : galleryConfig;

  const itemsToDisplay = isStandalone ? activeGallery : activeGallery.slice(0, 4);

  const handleNavigateToGallery = () => {
    if (onNavigate) {
      onNavigate('#gallery');
    }
  };

  const handleNavigateToHome = () => {
    if (onNavigate) {
      onNavigate('#hero');
    }
  };

  return (
    <section
      id="gallery"
      className="relative w-full overflow-hidden bg-background py-8 sm:py-12 md:py-16"
    >
      {/* Standalone page back button */}
      {isStandalone && (
        <div className="container-custom mb-6 sm:mb-8 md:mb-12 relative z-10">
          <button
            onClick={handleNavigateToHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-widest text-primary hover:text-gold-600 bg-transparent border-none cursor-pointer uppercase transition-colors duration-300"
          >
            &larr; Kembali ke Beranda
          </button>
        </div>
      )}

      {/* Decorative background accents matching BEM */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 10% 20%, rgba(201, 146, 42, 0.3) 0%, transparent 40%),
                            radial-gradient(circle at 90% 80%, rgba(201, 146, 42, 0.25) 0%, transparent 40%)`
        }}
      />

      <div className="container-custom relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-baseline gap-2 mb-6 sm:mb-10 md:mb-16 border-b border-border pb-4 sm:pb-6 md:pb-8">
          <div>
            <h2 className="font-sans text-4xl sm:text-5xl font-extrabold text-primary tracking-tight uppercase">
              {isStandalone ? 'Galeri Lengkap KSPM' : 'Galeri KSPM'}
            </h2>
          </div>
        </div>

        {/* Gallery Grid Wrapped in Card Box */}
        <div className="bg-white border border-border rounded-2xl p-3 sm:p-6 md:p-10 shadow-premium">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
            {itemsToDisplay.map((item: any, index: number) => {
              const isHovered = hoveredIndex === index;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => setSelectedImage(item)}
                  className="relative rounded-2xl overflow-hidden cursor-pointer border border-border shadow-sm hover:shadow-premium transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.01] bg-neutral-100"
                  style={{
                    aspectRatio: '4/3',
                  }}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out"
                    style={{
                      transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                    }}
                  />

                  {/* Hover overlay content matching BEM */}
                  <div
                    className="absolute inset-0 flex flex-col justify-end p-6 transition-all duration-500 ease-out"
                    style={{
                      background: 'linear-gradient(to top, rgba(201, 146, 42, 0.9) 0%, rgba(201, 146, 42, 0.35) 60%, rgba(0,0,0,0) 100%)',
                      opacity: isHovered ? 1 : 0,
                      transform: isHovered ? 'translateY(0)' : 'translateY(15px)',
                    }}
                  >
                    <h3 className="text-white text-lg font-bold mb-1 leading-tight font-sans">
                      {item.title}
                    </h3>
                    <p className="text-slate-200 text-xs leading-relaxed mb-3">
                      {item.description}
                    </p>
                    <span className="text-gold-300 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                      Lihat Penuh &rarr;
                    </span>
                  </div>

                  {/* Mobile / static thumbnail title */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 pointer-events-none"
                    style={{
                      opacity: isHovered ? 0 : 1
                    }}
                  >
                    <span className="text-white text-xs font-medium truncate block">
                      {item.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Load More Button (homepage only) */}
        {!isStandalone && (
          <div className="text-center mt-8 sm:mt-12 md:mt-16">
            <button
              onClick={handleNavigateToGallery}
              className="font-sans text-xs sm:text-sm font-bold tracking-widest text-white bg-primary hover:bg-transparent hover:text-primary border border-primary px-8 py-4 rounded-lg cursor-pointer uppercase transition-all duration-300 shadow-md hover:shadow-none"
            >
              Lihat Galeri Selengkapnya &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 sm:p-6 backdrop-blur-sm animate-fade-in overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full bg-white rounded-2xl overflow-hidden border border-border shadow-2xl flex flex-col md:grid md:grid-cols-2 my-auto"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-primary border border-white/20 text-white text-lg cursor-pointer flex items-center justify-center transition-all duration-300 z-10"
            >
              &times;
            </button>

            {/* Image display */}
            <div className="w-full h-64 md:h-full max-h-[70vh] bg-neutral-100 overflow-hidden flex items-center justify-center">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Details panel */}
            <div className="p-8 flex flex-col justify-center bg-white text-left">
              <h3 className="font-sans text-2xl md:text-3xl font-extrabold text-primary mb-4 leading-tight">
                {selectedImage.title}
              </h3>
              <p className="font-sans text-sm md:text-base leading-relaxed text-muted-foreground">
                {selectedImage.description}
              </p>
              <div className="mt-8">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="font-sans text-xs font-bold tracking-widest text-white bg-primary hover:bg-accent border border-primary hover:border-accent px-6 py-3 rounded-lg cursor-pointer uppercase transition-all duration-300"
                >
                  Tutup Galeri
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
