import { useState, useCallback } from 'react';
import { Navigation } from './sections/Navigation';
import { Hero } from './sections/Hero';
import { WineShowcase } from './sections/WineShowcase';
import { WineryCarousel } from './sections/WineryCarousel';
import { AboutHeader } from './sections/AboutHeader';
import { EventsHeader } from './sections/EventsHeader';
import { ResearchHeader } from './sections/ResearchHeader';
import { Museum } from './sections/Museum';
import { Organization } from './sections/Organization';
import { News } from './sections/News';
import { ContactForm } from './sections/ContactForm';
import { Footer } from './sections/Footer';
import { Preloader } from './components/Preloader';
import { ScrollToTop } from './components/ScrollToTop';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'events' | 'research'>('home');

  const handlePreloaderComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handlePageChange = useCallback((href: string) => {
    if (href === '#about' || href === '#history' || href === '#organization') {
      setCurrentPage('about');
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } else if (href === '#events') {
      setCurrentPage('events');
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } else if (href === '#research') {
      setCurrentPage('research');
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } else {
      setCurrentPage('home');
      setTimeout(() => {
        if (href === '#hero' || href === '#') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 100);
    }
  }, []);

  return (
    <>
      {isLoading && <Preloader onComplete={handlePreloaderComplete} />}

      <div className={`min-h-screen bg-[#141414] ${isLoading ? 'overflow-hidden max-h-screen' : ''}`}>
        <Navigation currentPage={currentPage} onNavigate={handlePageChange} />

        <main>
          {currentPage === 'home' && (
            <>
              <Hero isReady={!isLoading} />
              <News />
              <ContactForm />
            </>
          )}
          {currentPage === 'about' && (
            <>
              <AboutHeader />
              <Museum />
              <Organization />
            </>
          )}
          {currentPage === 'events' && (
            <>
              <EventsHeader />
              <WineryCarousel />
            </>
          )}
          {currentPage === 'research' && (
            <>
              <ResearchHeader />
              <WineShowcase />
            </>
          )}
        </main>

        <Footer onNavigate={handlePageChange} />
        <ScrollToTop />
      </div>
    </>
  );
}

export default App;
