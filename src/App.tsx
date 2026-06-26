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

// Admin Panel (lazy check via URL)
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { isLoggedIn, verifyToken, logout } from './pages/admin/lib/adminApi';
import { Toaster } from 'sonner';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'events' | 'research' | 'register'>('home');

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
      getMappedContact().then(res => res && setContactData(res))
    ]).catch(err => {
      console.error("Error loading data from backend:", err);
    });
  }, [isAdminRoute]);

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
