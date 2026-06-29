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
import { Testimonials } from './sections/Testimonials';
import { Achievements } from './sections/Achievements';
import { ContactForm } from './sections/ContactForm';
import { Footer } from './sections/Footer';
import { RegisterForm } from './sections/RegisterForm';

import { ScrollToTop } from './components/ScrollToTop';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Gallery } from './sections/Gallery';
import {
  getMappedHero,
  getMappedAbout,
  getMappedActivities,
  getMappedResearch,
  getMappedContact,
  getMappedNews,
  getMappedGallery
} from './lib/strapi';

// Admin Panel (lazy check via URL)
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { isLoggedIn, verifyToken, logout } from './pages/admin/lib/adminApi';
import { Toaster } from 'sonner';

function App() {

  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'events' | 'research' | 'register' | 'gallery'>('home');

  // Admin state
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isAdminAuthed, setIsAdminAuthed] = useState(false);
  const [adminChecking, setAdminChecking] = useState(true);

  // Clear admin session and redirect to home on page refresh/reload if logged in
  useEffect(() => {
    const loggedIn = localStorage.getItem('kspm_logged_in');
    const oldToken = localStorage.getItem('kspm_admin_token');
    if (oldToken) {
      localStorage.removeItem('kspm_admin_token');
    }
    if (loggedIn) {
      logout();
      if (window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin')) {
        window.location.href = '/';
      }
    }
  }, []);

  // Backend state data
  const [heroData, setHeroData] = useState<any>(undefined);
  const [aboutData, setAboutData] = useState<any>(undefined);
  const [activitiesData, setActivitiesData] = useState<any>(undefined);
  const [researchData, setResearchData] = useState<any>(undefined);
  const [contactData, setContactData] = useState<any>(undefined);
  const [newsData, setNewsData] = useState<any>(undefined);
  const [galleryData, setGalleryData] = useState<any>(undefined);

  // Check if we're on the /admin route
  useEffect(() => {
    const checkRoute = () => {
      const isAdmin = window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin');
      setIsAdminRoute(isAdmin);
    };
    checkRoute();
    window.addEventListener('popstate', checkRoute);
    return () => window.removeEventListener('popstate', checkRoute);
  }, []);

  // Verify admin token if on admin route
  useEffect(() => {
    if (!isAdminRoute) {
      setAdminChecking(false);
      return;
    }
    (async () => {
      if (isLoggedIn()) {
        const valid = await verifyToken();
        setIsAdminAuthed(valid);
      }
      setAdminChecking(false);
    })();
  }, [isAdminRoute]);

  useEffect(() => {
    if (isAdminRoute) return; // Skip data fetch for admin route
    // Fetch all backend configs concurrently
    Promise.all([
      getMappedHero().then(res => res && setHeroData(res)),
      getMappedAbout().then(res => res && setAboutData(res)),
      getMappedActivities().then(res => res && setActivitiesData(res)),
      getMappedResearch().then(res => res && setResearchData(res)),
      getMappedContact().then(res => res && setContactData(res)),
      getMappedNews().then(res => res && setNewsData(res)),
      getMappedGallery().then(res => res && setGalleryData(res))
    ]).catch(err => {
      console.error("Error loading data from backend:", err);
    });
  }, [isAdminRoute]);



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

    if (href === '#about' || href === '#philosophy' || href === '#history' || href === '#organization') {
      setCurrentPage('about');
      setTimeout(() => scrollToTarget(href), 100);
    } else if (href === '#events') {
      setCurrentPage('events');
      setTimeout(() => scrollToTarget(href), 100);
    } else if (href === '#research') {
      setCurrentPage('research');
      setTimeout(() => scrollToTarget(href), 100);
    } else if (href === '#gallery') {
      setCurrentPage('gallery');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
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

  // ── Admin Panel Rendering ──
  if (isAdminRoute) {
    if (adminChecking) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full" />
        </div>
      );
    }

    if (!isAdminAuthed) {
      return <AdminLogin onLoginSuccess={() => setIsAdminAuthed(true)} />;
    }

    return <AdminDashboard />;
  }

  // ── Public Site Rendering ──
  return (
    <>
      <Toaster richColors position="top-right" />


      <div className="min-h-screen bg-background">
        <Navigation currentPage={currentPage} onNavigate={handlePageChange} />

        <main>
          {currentPage === 'home' && (
            <>
              <Hero isReady={true} data={heroData} onNavigate={handlePageChange} />
              <Testimonials data={newsData} />
              <Achievements />
              <News data={newsData} />
              <Gallery onNavigate={handlePageChange} data={galleryData} />
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
          {currentPage === 'gallery' && (
            <Gallery isStandalone={true} onNavigate={handlePageChange} data={galleryData} />
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
