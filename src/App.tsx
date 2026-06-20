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
import { RegisterForm } from './sections/RegisterForm';
import { Preloader } from './components/Preloader';
import { ScrollToTop } from './components/ScrollToTop';
import { WhatsAppButton } from './components/WhatsAppButton';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'events' | 'research' | 'register'>('home');

  const handlePreloaderComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handlePageChange = useCallback((href: string) => {
    const scrollToTarget = (targetHref: string, retryCount = 0) => {
      const element = document.querySelector(targetHref);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else if (retryCount < 3) {
        setTimeout(() => scrollToTarget(targetHref, retryCount + 1), 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    if (href === '#about' || href === '#history' || href === '#organization') {
      setCurrentPage('about');
      setTimeout(() => scrollToTarget(href), 100);
    } else if (href === '#events') {
      setCurrentPage('events');
      setTimeout(() => scrollToTarget(href), 100);
    } else if (href === '#research') {
      setCurrentPage('research');
      setTimeout(() => scrollToTarget(href), 100);
    } else if (href === '#register') {
      setCurrentPage('register');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } else {
      setCurrentPage('home');
      setTimeout(() => {
        if (href === '#hero' || href === '#') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          scrollToTarget(href);
        }
      }, 100);
    }
  }, []);

  return (
    <>
      {isLoading && <Preloader onComplete={handlePreloaderComplete} />}

      <div className={`min-h-screen bg-[#f0ede6] ${isLoading ? 'overflow-hidden max-h-screen' : ''}`}>
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
              <Museum onNavigate={handlePageChange} />
              <Organization />
            </>
          )}
          {currentPage === 'events' && (
            <>
              <EventsHeader />
              <WineryCarousel onNavigate={handlePageChange} />
            </>
          )}
          {currentPage === 'research' && (
            <>
              <ResearchHeader />
              <WineShowcase onNavigate={handlePageChange} />
            </>
          )}
          {currentPage === 'register' && (
            <RegisterForm onNavigate={handlePageChange} />
          )}
        </main>

        <Footer onNavigate={handlePageChange} />
        <ScrollToTop />
        <WhatsAppButton />
      </div>
    </>
  );
}

export default App;
