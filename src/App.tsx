import { useState, useCallback, useEffect } from 'react';
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
import {
  getMappedHero,
  getMappedAbout,
  getMappedActivities,
  getMappedResearch,
  getMappedContact
} from './lib/strapi';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'events' | 'research' | 'register'>('home');

  // Backend state data
  const [heroData, setHeroData] = useState<any>(undefined);
  const [aboutData, setAboutData] = useState<any>(undefined);
  const [activitiesData, setActivitiesData] = useState<any>(undefined);
  const [researchData, setResearchData] = useState<any>(undefined);
  const [contactData, setContactData] = useState<any>(undefined);

  useEffect(() => {
    // Fetch all backend configs concurrently
    Promise.all([
      getMappedHero().then(res => res && setHeroData(res)),
      getMappedAbout().then(res => res && setAboutData(res)),
      getMappedActivities().then(res => res && setActivitiesData(res)),
      getMappedResearch().then(res => res && setResearchData(res)),
      getMappedContact().then(res => res && setContactData(res))
    ]).catch(err => {
      console.error("Error loading data from Strapi backend:", err);
    });
  }, []);

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
              <Hero isReady={!isLoading} data={heroData} />
              <News />
              <ContactForm data={contactData} />
            </>
          )}
          {currentPage === 'about' && (
            <>
              <AboutHeader />
              <Museum onNavigate={handlePageChange} data={aboutData?.aboutConfig} />
              <Organization data={aboutData?.orgConfig} />
            </>
          )}
          {currentPage === 'events' && (
            <>
              <EventsHeader />
              <WineryCarousel onNavigate={handlePageChange} data={activitiesData} />
            </>
          )}
          {currentPage === 'research' && (
            <>
              <ResearchHeader />
              <WineShowcase onNavigate={handlePageChange} data={researchData} />
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
