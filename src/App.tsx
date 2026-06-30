import { useState, useCallback, useEffect } from 'react';
import { Navigasi } from './sections/Navigasi';
import { Hero } from './sections/Hero';
import { RisetPublikasi } from './sections/RisetPublikasi';
import { CarouselKegiatan } from './sections/CarouselKegiatan';
import { HeaderHalaman } from './sections/HeaderHalaman';
import { Sejarah } from './sections/Sejarah';
import { Organisasi } from './sections/Organisasi';
import { Berita } from './sections/Berita';
import { Testimoni } from './sections/Testimoni';
import { Pencapaian } from './sections/Pencapaian';
import { FormKontak } from './sections/FormKontak';
import { Footer } from './sections/Footer';
import { FormPendaftaran } from './sections/FormPendaftaran';

import { ScrollToTop } from './components/ScrollToTop';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Galeri } from './sections/Galeri';
import {
  getMappedHero,
  getMappedAbout,
  getMappedActivities,
  getMappedResearch,
  getMappedContact,
  getMappedNews,
  getMappedGallery,
  getMappedAchievements
} from './lib/strapi';

// Admin Panel (lazy check via URL)
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { isLoggedIn, verifyToken } from './pages/admin/lib/adminApi';
import { Toaster } from 'sonner';

const getPageStateFromPath = (path: string): 'home' | 'about' | 'events' | 'research' | 'register' | 'gallery' => {
  if (path === '/tentang-kami') return 'about';
  if (path === '/kegiatan') return 'events';
  if (path === '/riset') return 'research';
  if (path === '/galeri') return 'gallery';
  if (path === '/pendaftaran') return 'register';
  return 'home'; // default for '/' or '/beranda'
};

function App() {

  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'events' | 'research' | 'register' | 'gallery'>(() => {
    return getPageStateFromPath(window.location.pathname);
  });

  // Admin state
  const [isAdminRoute, setIsAdminRoute] = useState(() => {
    return window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin');
  });
  const [isAdminAuthed, setIsAdminAuthed] = useState(false);
  const [adminChecking, setAdminChecking] = useState(true);

  // Remove legacy token from localStorage if present
  useEffect(() => {
    const oldToken = localStorage.getItem('kspm_admin_token');
    if (oldToken) {
      localStorage.removeItem('kspm_admin_token');
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
  const [achievementsData, setAchievementsData] = useState<any>(undefined);

  // Routing effect
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname;
      const isAdmin = path === '/admin' || path.startsWith('/admin');
      setIsAdminRoute(isAdmin);

      if (!isAdmin) {
        const page = getPageStateFromPath(path);
        setCurrentPage(page);

        // Handle scrolling to hash if present in URL
        const hash = window.location.hash;
        if (hash) {
          setTimeout(() => {
            const element = document.querySelector(hash);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 200);
        }
      }
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
      getMappedGallery().then(res => res && setGalleryData(res)),
      getMappedAchievements().then(res => res && setAchievementsData(res))
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

    let targetPage: 'home' | 'about' | 'events' | 'research' | 'register' | 'gallery' = 'home';
    let targetPath = '/beranda';

    if (href === '#about' || href === '#philosophy' || href === '#history' || href === '#organization') {
      targetPage = 'about';
      targetPath = '/tentang-kami';
    } else if (href === '#events') {
      targetPage = 'events';
      targetPath = '/kegiatan';
    } else if (href === '#research') {
      targetPage = 'research';
      targetPath = '/riset';
    } else if (href === '#gallery') {
      targetPage = 'gallery';
      targetPath = '/galeri';
    } else if (href === '#register') {
      targetPage = 'register';
      targetPath = '/pendaftaran';
    } else {
      targetPage = 'home';
      targetPath = window.location.pathname === '/' ? '/' : '/beranda';
    }

    // Update URL in address bar (path only, without hash)
    const currentPath = window.location.pathname;

    if (currentPath !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }

    setCurrentPage(targetPage);

    setTimeout(() => {
      if (href === '#hero' || href === '#' || href === targetPath) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        scrollToTarget(href);
      }
    }, 100);
  }, []);

  // ── Admin Panel Rendering ──
  if (isAdminRoute) {
    if (adminChecking) {
      return (
        <div className="min-h-screen bg-[#f0ede6] flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#c9922a] border-t-transparent rounded-full" />
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
        <Navigasi currentPage={currentPage} onNavigate={handlePageChange} />

        <main>
          {currentPage === 'home' && (
            <>
              <Hero isReady={true} data={heroData} onNavigate={handlePageChange} />
              <Testimoni data={newsData} />
              <Pencapaian data={achievementsData} />
              <Berita data={newsData} />
              <Galeri onNavigate={handlePageChange} data={galleryData} />
              <FormKontak data={contactData} />
            </>
          )}
          {currentPage === 'about' && (
            <>
              <HeaderHalaman 
                id="about"
                title={aboutData?.aboutConfig?.aboutHeaderTitle || "Tentang Kami"}
                description={aboutData?.aboutConfig?.aboutHeaderDescription || "Mengenal lebih dekat KSPM FEB UIKA Bogor. Kami adalah wadah edukasi, riset, dan sosialisasi pasar modal yang berdedikasi mencetak investor muda yang cerdas, profesional, dan berintegritas tinggi sejak tahun 2019."}
                image={aboutData?.aboutConfig?.aboutHeaderImage || "/images/about-vision.jpg"}
              />
              <Sejarah onNavigate={handlePageChange} data={aboutData?.aboutConfig} />
              <Organisasi data={aboutData?.orgConfig} />
            </>
          )}
          {currentPage === 'events' && (
            <>
              <HeaderHalaman 
                id="events"
                title={activitiesData?.eventsHeaderTitle || "Kegiatan KSPM"}
                description={activitiesData?.eventsHeaderDescription || "Kami menyelenggarakan berbagai kegiatan akademis dan non-akademis yang bertujuan meningkatkan literasi, inklusi, serta keahlian praktis dalam industri pasar modal bagi seluruh civitas akademika dan masyarakat luas."}
                image={activitiesData?.eventsHeaderImage || "/images/event-investalk.jpg"}
              />
              <CarouselKegiatan onNavigate={handlePageChange} data={activitiesData} />
            </>
          )}
          {currentPage === 'research' && (
            <>
              <HeaderHalaman 
                id="research"
                title={researchData?.researchHeaderTitle || "Riset KSPM"}
                description={researchData?.researchHeaderDescription || "Kami membimbing dan memfasilitasi mahasiswa dalam riset analisis fundamental dan teknikal saham, publikasi ringkasan pasar modal mingguan, serta program edukasi terpadu untuk membentuk kebiasaan investasi yang sehat."}
                image={researchData?.researchHeaderImage || "/images/research-equity.jpg"}
              />
              <RisetPublikasi onNavigate={handlePageChange} data={researchData} />
            </>
          )}
          {currentPage === 'register' && (
            <FormPendaftaran onNavigate={handlePageChange} />
          )}
          {currentPage === 'gallery' && (
            <Galeri isStandalone={true} onNavigate={handlePageChange} data={galleryData} />
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
