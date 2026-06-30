import { Quote, Star } from 'lucide-react';
import { getMediaUrl } from '../lib/strapi';
import { newsConfig as staticNewsConfig } from '../config';

export function Testimoni({ data }: { data?: typeof staticNewsConfig }) {
  const newsConfig = data || staticNewsConfig;

  if (!newsConfig.testimonials || newsConfig.testimonials.length === 0) return null;

  return (
    <section
      id="testimonials"
      className="relative w-full overflow-hidden bg-background py-8 sm:py-12 md:py-16 border-b border-border"
    >
      {/* Background accents */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(201, 146, 42, 0.3) 0%, transparent 40%),
                            radial-gradient(circle at 80% 20%, rgba(201, 146, 42, 0.25) 0%, transparent 40%)`
        }}
      />

      <div className="container-custom relative z-10">
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h3 className="font-sans text-3xl sm:text-4xl font-extrabold text-primary uppercase">
            {newsConfig.testimonialsMainTitle || 'Apa Kata Mereka?'}
          </h3>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
          {newsConfig.testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white border border-border rounded-2xl p-3 sm:p-6 md:p-8 shadow-premium relative transition-all duration-300 hover:shadow-hover hover:-translate-y-1 text-left flex flex-col justify-between"
            >
              <div>
                <Quote className="w-5 h-5 sm:w-8 sm:h-8 text-gold-500/10 absolute top-3 right-3 sm:top-6 sm:right-6" />
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-gold-500 fill-gold-500" />
                  ))}
                </div>
                <p className="text-neutral-700 text-xs sm:text-sm leading-relaxed mb-4 md:mb-6 italic">
                  "{t.text}"
                </p>
              </div>

              <div className="flex items-start gap-2 mt-2">
                {t.image && (
                  <img
                    src={getMediaUrl(t.image)}
                    alt={t.name}
                    className="w-8 h-8 rounded-full object-cover border border-border flex-shrink-0 mt-0.5"
                  />
                )}
                <div className="text-left">
                  <p className="text-neutral-900 font-bold text-[10px] sm:text-sm leading-snug">{t.name}</p>
                  <p className="text-muted-foreground text-[8px] sm:text-xs leading-tight mt-0.5">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
