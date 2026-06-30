// =============================================================================
// KSPM FEB UIKA BOGOR - Configuration
// =============================================================================
// All site content is configured here. Components render nothing when their
// primary config fields are empty strings or empty arrays.
// =============================================================================

// -----------------------------------------------------------------------------
// Site Config
// -----------------------------------------------------------------------------
export interface SiteConfig {
  title: string;
  description: string;
  language: string;
  keywords: string;
  ogImage: string;
  canonical: string;
}

export const siteConfig: SiteConfig = {
  title: "KSPM FEB UIKA Bogor - Kelompok Studi Pasar Modal",
  description: "Kelompok Studi Pasar Modal Fakultas Ekonomi dan Bisnis Universitas Ibn Khaldun Bogor. Komunitas pasar modal terbesar di UIKA Bogor.",
  language: "id",
  keywords: "KSPM, FEB UIKA, Pasar Modal, Investasi, Trading, UIKA Bogor, Kelompok Studi",
  ogImage: "/images/og-image.jpg",
  canonical: "https://kspmfeb-uika.com",
};

// -----------------------------------------------------------------------------
// Navigation Config
// -----------------------------------------------------------------------------
export interface NavDropdownItem {
  name: string;
  href: string;
}

export interface NavLink {
  name: string;
  href: string;
  icon: string;
  dropdown?: NavDropdownItem[];
}

export interface NavigationConfig {
  brandName: string;
  brandLogo?: string;
  brandSubname: string;
  tagline: string;
  navLinks: NavLink[];
  ctaButtonText: string;
}

export const navigationConfig: NavigationConfig = {
  brandName: "KSPM",
  brandLogo: "/images/kspm-logo.png",
  brandSubname: "FEB UIKA Bogor",
  tagline: "Kelompok Studi Pasar Modal",
  navLinks: [
    { name: "Beranda", href: "#hero", icon: "Home" },
    {
      name: "Tentang Kami",
      href: "#about",
      icon: "Users",
      dropdown: [
        { name: "Visi & Misi", href: "#philosophy" },
        { name: "Sejarah", href: "#history" },
        { name: "Struktur Organisasi", href: "#organization" },
      ]
    },
    {
      name: "Kegiatan",
      href: "#events",
      icon: "Activity",
      dropdown: [
        { name: "Investalk", href: "#events" },
        { name: "Kursus Pasar Modal", href: "#events" },
        { name: "Company Visit", href: "#events" },
        { name: "Comparative Study", href: "#events" },
      ]
    },
    {
      name: "Riset",
      href: "#research",
      icon: "BookOpen",
      dropdown: [
        { name: "Kelas SPS (SiPalingSaham)", href: "#research" },
        { name: "Equity Research", href: "#research" },
        { name: "Weekly Market Update", href: "#research" },
        { name: "Sekolah Pasar Modal", href: "#research" },
      ]
    },
    { name: "Galeri", href: "#gallery", icon: "Camera" },
    { name: "Kontak", href: "#contact", icon: "Mail" },
  ],
  ctaButtonText: "Gabung Jadi Anggota",
};

// -----------------------------------------------------------------------------
// Preloader Config
// -----------------------------------------------------------------------------
export interface PreloaderConfig {
  brandName: string;
  brandLogo?: string;
  brandSubname: string;
  yearText: string;
}

export const preloaderConfig: PreloaderConfig = {
  brandName: "KSPM",
  brandLogo: "/images/kspm-logo.png",
  brandSubname: "FEB UIKA Bogor",
  yearText: "Est. 2019",
};

// -----------------------------------------------------------------------------
// Hero Config
// -----------------------------------------------------------------------------
export interface HeroStat {
  value: number;
  suffix: string;
  label: string;
}

export interface HeroConfig {
  scriptText: string;
  mainTitle: string;
  ctaButtonText: string;
  ctaTarget: string;
  stats: HeroStat[];
  decorativeText: string;
  backgroundImage: string;
  description: string;
}

export const heroConfig: HeroConfig = {
  scriptText: "Edukasi, Riset & Investasi",
  mainTitle: "Komunitas Pasar Modal\nTerbesar di UIKA Bogor",
  ctaButtonText: "Jelajahi Kami",
  ctaTarget: "#about",
  stats: [
    { value: 50, suffix: "+", label: "Anggota Aktif" },
    { value: 10, suffix: "+", label: "Riset Terbit" },
    { value: 30, suffix: "+", label: "Kegiatan" },
    { value: 2019, suffix: "", label: "Tahun Berdiri" },
  ],
  decorativeText: "KSPM FEB UIKA BOGOR",
  backgroundImage: "/images/hero-banner.jpg",
  description: "Kelompok Studi Pasar Modal FEB UIKA Bogor hadir sebagai wadah edukasi, riset, dan analisis instrumen pasar modal bagi seluruh akademisi Universitas Ibn Khaldun.",
};

// -----------------------------------------------------------------------------
// Achievements Config
// -----------------------------------------------------------------------------
export interface Achievement {
  value: string;
  label: string;
  description: string;
  icon: string;
}

export interface AchievementsConfig {
  scriptText: string;
  mainTitle: string;
  subtitle: string;
  items: Achievement[];
  ctaText?: string;
  ctaTarget?: string;
}

export const achievementsConfig: AchievementsConfig = {
  scriptText: "Pencapaian Kami",
  mainTitle: "Pencapaian Kami",
  subtitle: "Dalam 7 tahun perjalanan, KSPM FEB UIKA Bogor telah menorehkan berbagai pencapaian nyata di bidang edukasi, riset, dan pengembangan komunitas pasar modal.",
  items: [
    {
      value: "500+",
      label: "Alumni Aktif",
      description: "Lulusan program yang kini berkiprah di industri keuangan & pasar modal",
      icon: "Users",
    },
    {
      value: "50+",
      label: "Riset Diterbitkan",
      description: "Laporan riset fundamental & teknikal yang dipublikasikan secara rutin",
      icon: "FileText",
    },
    {
      value: "30+",
      label: "Kegiatan Per Tahun",
      description: "Seminar, workshop, company visit, dan kursus pasar modal setiap tahunnya",
      icon: "Calendar",
    },
    {
      value: "20+",
      label: "Mitra Institusi",
      description: "Kerja sama dengan broker, OJK, BEI, dan lembaga keuangan terkemuka",
      icon: "Handshake",
    },
    {
      value: "7",
      label: "Tahun Berdedikasi",
      description: "Konsisten mendidik generasi investor muda sejak 2019 hingga kini",
      icon: "Award",
    },
    {
      value: "#1",
      label: "KSP Pasar Modal UIKA",
      description: "Kelompok studi pasar modal terbesar dan paling aktif di lingkungan UIKA Bogor",
      icon: "TrendingUp",
    },
  ],
  ctaText: "Bergabung Bersama Kami",
  ctaTarget: "#register",
};


// // -----------------------------------------------------------------------------
// Config Riset & Publikasi
// -----------------------------------------------------------------------------
export interface ProgramRiset {
  id: string;
  name: string;
  image: string;
  description: string;
}

export interface FiturRiset {
  icon: string;
  title: string;
  description: string;
}

export interface RisetPublikasiConfig {
  mainTitle: string;
  programs: ProgramRiset[];
  features: FiturRiset[];
  researchHeaderTitle: string;
  researchHeaderDescription: string;
  researchHeaderImage: string;
}

export const risetPublikasiConfig: RisetPublikasiConfig = {
  mainTitle: "Riset & Publikasi",
  researchHeaderTitle: "Riset KSPM",
  researchHeaderDescription: "Kami membimbing dan memfasilitasi mahasiswa dalam riset analisis fundamental dan teknikal saham, publikasi ringkasan pasar modal mingguan, serta program edukasi terpadu untuk membentuk kebiasaan investasi yang sehat.",
  researchHeaderImage: "/images/research-equity.jpg",
  programs: [
    {
      id: "sps",
      name: "Kelas SPS",
      image: "/images/research-sps.jpg",
      description: "Kelas edukasi pasar modal interaktif yang membahas dunia saham secara fun dan mudah dipahami. Dari analisis dasar hingga strategi trading praktis untuk semua level.",
    },
    {
      id: "equity",
      name: "Equity",
      image: "/images/research-equity.jpg",
      description: "Riset mendalam tentang emiten-emiten terbuka di Bursa Efek Indonesia. Analisis fundamental, valuasi, dan proyeksi kinerja keuangan perusahaan.",
    },
    {
      id: "weekly",
      name: "Weekly Market",
      image: "/images/research-weekly.jpg",
      description: "Update mingguan pergerakan pasar saham Indonesia dan global. Berisi analisis sektor, sentimen pasar, dan rekomendasi saham pilihan yang terukur.",
    },
    {
      id: "spm",
      name: "Sekolah",
      image: "/images/research-cme.jpg",
      description: "Program pembelajaran pasar modal secara komprehensif dan berjenjang. Dari pengenalan investasi hingga strategi portofolio, dengan sertifikat resmi.",
    },
  ],
  features: [
    { icon: "BookOpen", title: "Analisis Fundamental", description: "Pembelajaran analisis laporan keuangan dan valuasi perusahaan secara mendalam" },
    { icon: "Sparkles", title: "Technical Analysis", description: "Studi pola grafik dan indikator teknikal untuk timing masuk & keluar investasi" },
    { icon: "Clock", title: "Risk Management", description: "Strategi pengelolaan risiko portofolio dan alokasi aset yang optimal" },
    { icon: "TrendingUp", title: "Market Update", description: "Update kondisi pasar terkini dan sentimen investor setiap minggunya" },
  ],
};

// -----------------------------------------------------------------------------
// Config Carousel Kegiatan (Events)
// -----------------------------------------------------------------------------
export interface SlideKegiatan {
  title: string;
  description: string;
}

export interface KegiatanCarouselConfig {
  mainTitle: string;
  slides: SlideKegiatan[];
  eventsHeaderTitle: string;
  eventsHeaderDescription: string;
  eventsHeaderImage: string;
}

export const kegiatanCarouselConfig: KegiatanCarouselConfig = {
  mainTitle: "Program Kerja",
  eventsHeaderTitle: "Kegiatan KSPM",
  eventsHeaderDescription: "Kami menyelenggarakan berbagai kegiatan akademis dan non-akademis yang bertujuan meningkatkan literasi, inklusi, serta keahlian praktis dalam industri pasar modal bagi seluruh civitas akademika dan masyarakat luas.",
  eventsHeaderImage: "/images/event-investalk.jpg",
  slides: [
    {
      title: "Investalk",
      description: "Talk show interaktif dengan praktisi pasar modal, investor sukses, dan analis terkemuka untuk berbagi pengalaman dan insight.",
    },
    {
      title: "Kursus Pasar Modal",
      description: "Program pembelajaran sistematis tentang pasar modal dari dasar hingga mahir dengan sertifikat resmi.",
    },
    {
      title: "Kunjungan OJK",
      description: "Kunjungan edukatif ke Otoritas Jasa Keuangan (OJK) untuk memahami regulasi, pengawasan industri jasa keuangan, serta peningkatan literasi keuangan.",
    },
    {
      title: "Kunjungan Bursa",
      description: "Kunjungan langsung ke Bursa Efek Indonesia untuk mempraktikkan pembukaan rekening efek dan melihat mekanisme perdagangan saham secara real-time.",
    },
    {
      title: "Comparative Study",
      description: "Program pertukaran ilmu dengan KSPM dari berbagai universitas di Indonesia untuk memperluas wawasan.",
    },
  ],
};

// -----------------------------------------------------------------------------
// Config Sejarah & Tentang Kami
// -----------------------------------------------------------------------------
export interface EventSejarah {
  year: string;
  event: string;
}

export interface SejarahTabContent {
  title: string;
  description: string | string[];
}

export interface SejarahTab {
  id: string;
  name: string;
  icon: string;
  image: string;
  content: SejarahTabContent;
}

export interface SejarahQuote {
  prefix: string;
  text: string;
  attribution: string;
}

export interface SejarahConfig {
  mainTitle: string;
  introText: string;
  timeline: EventSejarah[];
  tabs: SejarahTab[];
  openingHours: string;
  openingHoursLabel: string;
  ctaButtonText: string;
  yearBadge: string;
  yearBadgeLabel: string;
  quote: SejarahQuote;
  founderPhotoAlt: string;
  founderPhoto: string;
  aboutHeaderTitle: string;
  aboutHeaderDescription: string;
  aboutHeaderImage: string;
}

export const sejarahConfig: SejarahConfig = {
  mainTitle: "Sejarah KSPM FEB UIKA",
  introText: "Kelompok Studi Pasar Modal (KSPM) FEB UIKA Bogor adalah wadah edukasi untuk mendalami dunia investasi dan pasar modal secara akademis maupun praktis.",
  aboutHeaderTitle: "Tentang Kami",
  aboutHeaderDescription: "Mengenal lebih dekat KSPM FEB UIKA Bogor. Kami adalah wadah edukasi, riset, dan sosialisasi pasar modal yang berdedikasi mencetak investor muda yang cerdas, profesional, dan berintegritas tinggi sejak tahun 2019.",
  aboutHeaderImage: "/images/about-vision.jpg",
  timeline: [
    { year: "2019", event: "KSPM FEB UIKA Bogor resmi berdiri" },
    { year: "2020", event: "Program KPM pertama diluncurkan" },
    { year: "2021", event: "Kerja sama dengan OJK dan BEI" },
    { year: "2023", event: "Peluncuran riset weekly" },
    { year: "2025", event: "500+ anggota aktif tercapai" },
    { year: "2026", event: "Ekspansi program nasional" },
  ],
  tabs: [
    {
      id: "vision",
      name: "Visi",
      icon: "History",
      image: "/images/about-vision.jpg",
      content: {
        title: "Visi KSPM",
        description: "Menjadikan kelompok studi pasar modal Universitas Ibn Khaldun Bogor sebagai pusat edukasi, informasi, dan sosialisasi pasar modal serta mengembangkan pengetahuan tentang investasi kepada Civitas Akademika Universitas Ibn Khaldun Bogor.",
      },
    },
    {
      id: "mission",
      name: "Misi",
      icon: "Target",
      image: "/images/about-mission.jpg",
      content: {
        title: "Misi KSPM",
        description: [
          "• Membentuk generasi yang berwawasan keilmuan, terampil, dan ahli dalam pasar modal",
          "• Menumbuhkan rasa tanggung jawab serta komitmen anggota dalam berorganisasi",
          "• Mengedukasi dan menyosialisasikan pengetahuan mengenai pasar modal",
          "• Menyelenggarakan kegiatan-kegiatan terkait pasar modal"
        ],
      },
    },
    {
      id: "values",
      name: "Nilai Kami",
      icon: "BookOpen",
      image: "/images/about-values.jpg",
      content: {
        title: "Integritas, Profesionalisme, Kolaborasi",
        description: "Kami menjunjung tinggi integritas dalam setiap analisis, profesionalisme dalam setiap kegiatan, dan semangat kolaborasi untuk pertumbuhan bersama.",
      },
    },
    {
      id: "achievements",
      name: "Pencapaian",
      icon: "Award",
      image: "/images/about-achievements.jpg",
      content: {
        title: "Berkontribusi untuk Pasar Modal Indonesia",
        description: "Telah meluluskan ratusan alumni yang aktif di industri pasar modal, menerbitkan puluhan riset, dan menjalin kerja sama dengan berbagai lembaga keuangan.",
      },
    },
  ],
  openingHours: "09.00 - 16.00 WIB",
  openingHoursLabel: "Jam Operasional",
  ctaButtonText: "Pelajari Lebih Lanjut",
  yearBadge: "2019",
  yearBadgeLabel: "Berdiri Sejak",
  quote: {
    prefix: "Motto",
    text: "Learn, Invest, Grow. Belajar untuk berinvestasi, berinvestasi untuk tumbuh.",
    attribution: "KSPM FEB UIKA Bogor",
  },
  founderPhotoAlt: "Logo KSPM FEB UIKA Bogor",
  founderPhoto: "/images/kspm-logo.png",
};

// -----------------------------------------------------------------------------
// Organization Config
// -----------------------------------------------------------------------------
export interface OrgNode {
  name: string;
  role: string;
  image?: string;
  children?: OrgNode[];
  department?: string;
  description?: string;
}

export interface OrganizationConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  description: string;
  structure: OrgNode;
}

export const organizationConfig: OrganizationConfig = {
  scriptText: "Struktur Organisasi",
  subtitle: "LEADERSHIP & DIVISIONS",
  mainTitle: "Pengurus KSPM",
  description: "Struktur kepengurusan KSPM FEB UIKA Bogor yang didedikasikan untuk membangun komunitas pasar modal yang unggul.",
  structure: {
    name: "Pembina",
    role: "",
    image: "/images/pembina.png",
    children: [
      {
        name: "Steering Committee",
        role: "",
        image: "/images/dewan-kehormatan.jpg",
        children: [
          {
            name: "Ketua Umum",
            role: "Leader",
            image: "/images/media__1773276765779.jpg",
            children: [
              {
                name: "Sekretaris Umum",
                role: "Administrasi",
                image: "/images/media__1773276185544.jpg",
              },
              {
                name: "Bendahara Umum",
                role: "Keuangan",
                image: "/images/media__1773276783628.jpg",
              },
              {
                name: "_departments_",
                role: "",
                image: "",
                children: [
                  {
                    name: "Dept. Research",
                    role: "Riset",
                    image: "/images/dept-research.jpg",
                    children: [
                      { name: "Ahmad Fauzi", role: "Anggota Research" },
                      { name: "Luthfi Halim", role: "Anggota Research" },
                      { name: "Sarah Utami", role: "Anggota Research" }
                    ]
                  },
                  {
                    name: "Dept. Media",
                    role: "Media Kreatif",
                    image: "/images/dept-media.jpg",
                    children: [
                      { name: "Budi Santoso", role: "Anggota Media" },
                      { name: "Rian Aditama", role: "Anggota Media" },
                      { name: "Nadia Safitri", role: "Anggota Media" },
                      { name: "sdnsjvn", role: "Staff Media", image: "https://res.cloudinary.com/doqg9io96/image/upload/v1782514052/kspm/g4suzhnbp5b2ujuzz8mv.png" }
                    ]
                  },
                  {
                    name: "Dept. HR & Program",
                    role: "Program & SDM",
                    image: "/images/dept-hr.jpg",
                    children: [
                      { name: "Dian Lestari", role: "Anggota HR" },
                      { name: "Fikri Haikal", role: "Anggota HR" },
                      { name: "Indah Permata", role: "Anggota HR" }
                    ]
                  },
                  {
                    name: "Dept. Finance",
                    role: "Pendanaan",
                    image: "/images/dept-finance.jpg",
                    children: [
                      { name: "Hendra Wijaya", role: "Anggota Finance" },
                      { name: "Rina Amelia", role: "Anggota Finance" },
                      { name: "Taufik Hidayat", role: "Anggota Finance" }
                    ]
                  },
                ],
              },
            ],
          }
        ]
      },
      {
        name: "Steering Committee",
        role: "",
        image: "/images/agung-supriatna.png",
      }
    ]
  }
};

// -----------------------------------------------------------------------------
// News Config → Articles & Testimonials
// -----------------------------------------------------------------------------
export interface NewsArticle {
  id: number;
  image: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  url?: string;
}

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
  image?: string;
}

export interface StoryQuote {
  prefix: string;
  text: string;
  attribution: string;
}

export interface StoryTimelineItem {
  value: string;
  label: string;
}

export interface NewsConfig {
  mainTitle: string;
  viewAllText: string;
  viewAllUrl?: string;
  readMoreText: string;
  articles: NewsArticle[];
  testimonialsScriptText: string;
  testimonialsSubtitle: string;
  testimonialsMainTitle: string;
  testimonials: Testimonial[];
  storyScriptText: string;
  storySubtitle: string;
  storyTitle: string;
  storyParagraphs: string[];
  storyTimeline: StoryTimelineItem[];
  storyQuote: StoryQuote;
  storyImage: string;
  storyImageCaption: string;
}

export const newsConfig: NewsConfig = {
  mainTitle: "Update Terkini",
  viewAllText: "Lihat Semua",
  readMoreText: "Baca Selengkapnya",
  articles: [
    {
      id: 1,
      image: "/images/article-1.png",
      title: "Rapor Merah Transparansi Saham Indonesia dari MSCI",
      excerpt: "Hasil review MSCI menyoroti kurang transparannya struktur kepemilikan saham di pasar modal Indonesia yang berisiko menekan arus modal asing.",
      date: "19 Juni 2026",
      category: "Market Analysis",
      url: "https://www.cnbcindonesia.com/research/20260619041735-128-743896/hasil-review-msci-transparansi-saham-indonesia-jadi-rapor-merah",
    },
    {
      id: 2,
      image: "/images/article-2.png",
      title: "OJK Restui Jajaran Direksi Baru BEI 2026-2030",
      excerpt: "Otoritas Jasa Keuangan (OJK) merestui jajaran direksi baru BEI, dengan Jeffrey Hendrik resmi diusulkan sebagai Direktur Utama.",
      date: "19 Juni 2026",
      category: "Regulation",
      url: "https://rmol.id/bisnis/read/2026/06/19/711337/nakhoda-baru-pasar-modal-ojk-restui-jajaran-calon-direksi-bei-2026-2030",
    },
    {
      id: 3,
      image: "/images/article-3.png",
      title: "OJK Siapkan Aturan Ketat untuk Finfluencer di 2026",
      excerpt: "Langkah pengawasan konkret dari OJK untuk menertibkan influencer keuangan demi edukasi investasi yang lebih terukur dan kredibel.",
      date: "Juni 2026",
      category: "Education",
      url: "https://ojk.go.id/id/berita-dan-kegiatan/siaran-pers/Pages/Pembukaan-Perdagangan-Bursa-Efek-2026.aspx",
    },
    {
      id: 4,
      image: "/images/article-4.png",
      title: "Analisis Volatilitas IHSG Usai Review MSCI",
      excerpt: "Ulasan visual dan analisis pergerakan IHSG yang berfluktuasi merespons rilis evaluasi terbaru dari MSCI.",
      date: "Juni 2026",
      category: "Video Review",
      url: "https://www.youtube.com/watch?v=UBgMLWO0cSo",
    },
    {
      id: 5,
      image: "/images/event-kpm.jpg",
      title: "Sekolah Pasar Modal KSPM FEB UIKA x BEI",
      excerpt: "Kolaborasi edukatif KSPM FEB UIKA dengan Bursa Efek Indonesia dalam menghadirkan Sekolah Pasar Modal tingkat dasar untuk mahasiswa umum.",
      date: "Mei 2026",
      category: "Education",
      url: "https://www.instagram.com/kspmuika/",
    },
    {
      id: 6,
      image: "/images/event-ojkvisit.jpg",
      title: "Kunjungan Industri & Studi Banding ke OJK Bogor",
      excerpt: "KSPM FEB UIKA melakukan kunjungan edukasi dan studi banding ke kantor Otoritas Jasa Keuangan (OJK) Bogor untuk memahami regulasi pasar modal secara langsung.",
      date: "Maret 2026",
      category: "Market Analysis",
      url: "https://www.instagram.com/kspmuika/",
    },
    {
      id: 7,
      image: "/images/event-investalk.jpg",
      title: "Investalk KSPM UIKA: Menakar Arah IHSG 2026",
      excerpt: "Seminar nasional Investalk membahas strategi alokasi portofolio di tengah ketidakpastian makroekonomi global dan lokal.",
      date: "Februari 2026",
      category: "Market Analysis",
      url: "https://www.instagram.com/kspmuika/",
    },
  ],
  testimonialsScriptText: "Testimoni",
  testimonialsSubtitle: "Suara Anggota",
  testimonialsMainTitle: "Apa Kata Mereka?",
  testimonials: [
    {
      name: "Rizkyllah",
      role: "Mahasiswa Perdagangan Internasional 2022",
      text: "KSPM FEB UIKA mengubah cara pandang saya tentang investasi. Dari awalnya tidak mengerti apa-apa, sekarang saya bisa menganalisis saham dengan fundamental yang kuat.",
      rating: 5,
      image: "/images/rizkyllah.jpg",
    },
    {
      name: "Agung Supriatna",
      role: "Mahasiswa Perbankan dan Keuangan Digital 2025",
      text: "Program Kursus Pasar Modal sangat komprehensif. Mentor-mentornya berpengalaman dan materinya aplikatif. Sangat recommended untuk pemula!",
      rating: 5,
      image: "/images/agung-supriatna.png",
    },
    {
      name: "Andi Nadya",
      role: "Research Team",
      text: "Bergabung dengan tim riset KSPM memberikan saya pengalaman berharga dalam menganalisis pasar dan menyusun laporan keuangan yang profesional.",
      rating: 4,
      image: "/images/andi-nadya.jpg",
    },
  ],
  storyScriptText: "Perjalanan Kami",
  storySubtitle: "OUR STORY",
  storyTitle: "7 Tahun Mencetak Investor Cerdas",
  storyParagraphs: [
    "Dari sebuah komunitas kecil di Fakultas Ekonomi dan Bisnis UIKA Bogor, KSPM telah tumbuh menjadi salah satu kelompok studi pasar modal terbesar di kawasan Bogor.",
    "Perjalanan kami dimulai dari kesederhanaan, namun dengan tekad yang kuat untuk menyebarkan literasi keuangan dan investasi kepada mahasiswa.",
    "Hingga kini, kami terus berkomitmen untuk menghasilkan generasi investor yang tidak hanya cerdas secara finansial, tetapi juga berintegritas dan berkontribusi positif bagi masyarakat.",
  ],
  storyTimeline: [
    { value: "50+", label: "Anggota Aktif" },
    { value: "10+", label: "Riset" },
    { value: "30+", label: "Kegiatan" },
    { value: "2019", label: "Tahun" },
  ],
  storyQuote: {
    prefix: "Filosofi",
    text: "Kami percaya bahwa setiap orang berhak memiliki akses ke pendidikan keuangan yang berkualitas.",
    attribution: "KSPM FEB UIKA Bogor",
  },
  storyImage: "/images/story-image.jpg",
  storyImageCaption: "Kegiatan KSPM FEB UIKA Bogor",
};

// -----------------------------------------------------------------------------
// Contact Form Config
// -----------------------------------------------------------------------------
export interface ContactInfoItem {
  icon: string;
  label: string;
  value: string;
  subtext: string;
}

export interface ContactFormFields {
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  visitDateLabel: string;
  visitorsLabel: string;
  visitorsOptions: string[];
  messageLabel: string;
  messagePlaceholder: string;
  submitText: string;
  submittingText: string;
  successMessage: string;
  errorMessage: string;
}

export interface ContactFormConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  introText: string;
  contactInfoTitle: string;
  contactInfo: ContactInfoItem[];
  form: ContactFormFields;
  privacyNotice: string;
  formEndpoint: string;
  whatsappLink: string;
}

export const contactFormConfig: ContactFormConfig = {
  scriptText: "Hubungi Kami",
  subtitle: "GET IN TOUCH",
  whatsappLink: "https://wa.me/6289514455380",
  mainTitle: "Mari Berkolaborasi",
  introText: "Punya pertanyaan tentang KSPM atau ingin berkolaborasi? Jangan ragu untuk menghubungi kami. Tim kami siap membantu Anda.",
  contactInfoTitle: "Hubungi Kami",
  contactInfo: [
    {
      icon: "MapPin",
      label: "Alamat",
      value: "FEB UIKA Bogor",
      subtext: "Jl. K.H. Sholeh Iskandar, Kedung Badak, Bogor",
    },
    {
      icon: "Phone",
      label: "Telepon",
      value: "+62 895-1445-5380",
      subtext: "Agung Permana (Public Relation)",
    },
    {
      icon: "Mail",
      label: "Email",
      value: "kspm@uika-bogor.ac.id",
      subtext: "Kirimkan pertanyaan Anda",
    },
    {
      icon: "Clock",
      label: "Jam Operasional",
      value: "Senin - Jumat",
      subtext: "09.00 - 16.00 WIB",
    },
  ],
  form: {
    nameLabel: "Nama Lengkap",
    namePlaceholder: "Masukkan nama Anda",
    emailLabel: "Email",
    emailPlaceholder: "email@example.com",
    phoneLabel: "Nomor Telepon",
    phonePlaceholder: "+62 xxx-xxxx-xxxx",
    visitDateLabel: "Tanggal",
    visitorsLabel: "Kategori",
    visitorsOptions: ["Mahasiswa UIKA", "Akademisi/Dosen", "Komunitas/Organisasi", "Instansi/Perusahaan", "Lainnya"],
    messageLabel: "Pesan",
    messagePlaceholder: "Tulis pesan Anda di sini...",
    submitText: "Kirim Pesan",
    submittingText: "Mengirim...",
    successMessage: "Pesan berhasil dikirim! Kami akan menghubungi Anda segera.",
    errorMessage: "Terjadi kesalahan. Silakan coba lagi nanti.",
  },
  privacyNotice: "Dengan mengirimkan formulir ini, Anda menyetujui kebijakan privasi kami.",
  formEndpoint: "https://formspree.io/f/YOUR_FORM_ID",
};

// -----------------------------------------------------------------------------
// Footer Config
// -----------------------------------------------------------------------------
export interface SocialLink {
  icon: string;
  label: string;
  href: string;
}

export interface FooterLink {
  name: string;
  href: string;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

export interface FooterContactItem {
  icon: string;
  text: string;
}

export interface FooterConfig {
  brandName: string;
  brandLogo?: string;
  tagline: string;
  description: string;
  socialLinks: SocialLink[];
  linkGroups: FooterLinkGroup[];
  contactItems: FooterContactItem[];
  newsletterLabel: string;
  newsletterPlaceholder: string;
  newsletterButtonText: string;
  newsletterSuccessText: string;
  newsletterErrorText: string;
  newsletterEndpoint: string;
  copyrightText: string;
  legalLinks: string[];
  icpText: string;
  backToTopText: string;
  ageVerificationText: string;
}

export const footerConfig: FooterConfig = {
  brandName: "KSPM",
  brandLogo: "/images/kspm-logo.png",
  tagline: "FEB UIKA Bogor",
  description: "Kelompok Studi Pasar Modal Fakultas Ekonomi dan Bisnis Universitas Ibn Khaldun Bogor. Mencetak generasi investor cerdas sejak 2019.",
  socialLinks: [
    { icon: "Instagram", label: "Instagram", href: "https://www.instagram.com/kspmuika/" },
    { icon: "Linkedin", label: "LinkedIn", href: "https://id.linkedin.com/in/kelompok-studi-pasar-modal-kspm-uika" },
    { icon: "Youtube", label: "YouTube", href: "https://youtube.com/kspmfeb-uika" },
    { icon: "MessageCircle", label: "WhatsApp", href: "https://wa.me/6289514455380" },
  ],
  linkGroups: [
    {
      title: "Kegiatan",
      links: [
        { name: "Investalk", href: "#events" },
        { name: "Kursus Pasar Modal", href: "#events" },
        { name: "Company Visit", href: "#events" },
        { name: "Comparative Study", href: "#events" },
      ],
    },
    {
      title: "Riset",
      links: [
        { name: "Kelas SPS (SiPalingSaham)", href: "#research" },
        { name: "Equity Research", href: "#research" },
        { name: "Weekly Market Update", href: "#research" },
        { name: "Sekolah Pasar Modal", href: "#research" },
      ],
    },
  ],
  contactItems: [
    { icon: "MapPin", text: "FEB UIKA Bogor, Jl. K.H. Sholeh Iskandar" },
    { icon: "Phone", text: "+62 895-1445-5380" },
    { icon: "Mail", text: "kspm@uika-bogor.ac.id" },
  ],
  newsletterLabel: "Berlangganan Newsletter",
  newsletterPlaceholder: "Masukkan email Anda",
  newsletterButtonText: "Berlangganan",
  newsletterSuccessText: "Berhasil berlangganan!",
  newsletterErrorText: "Gagal berlangganan. Silakan coba lagi.",
  newsletterEndpoint: "https://formspree.io/f/YOUR_NEWSLETTER_ID",
  copyrightText: "Copyright © 2019 — 2026 KSPM FEB UIKA Bogor. All rights reserved.",
  legalLinks: ["Kebijakan Privasi", "Syarat & Ketentuan"],
  icpText: "",
  backToTopText: "Kembali ke Atas",
  ageVerificationText: "",
};

// -----------------------------------------------------------------------------
// Scroll To Top Config
// -----------------------------------------------------------------------------
export interface ScrollToTopConfig {
  ariaLabel: string;
}

export const scrollToTopConfig: ScrollToTopConfig = {
  ariaLabel: "Kembali ke atas",
};

// -----------------------------------------------------------------------------
// Gallery Config
// -----------------------------------------------------------------------------
export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
}

export const galleryConfig: GalleryItem[] = [
  {
    id: "gal-01",
    src: "/images/event-investalk.jpg",
    alt: "Investalk KSPM FEB UIKA",
    title: "Investalk KSPM",
    description: "Talkshow pasar modal dan investasi bersama praktisi industri keuangan nasional.",
  },
  {
    id: "gal-02",
    src: "/images/event-kpm.jpg",
    alt: "Kursus Pasar Modal",
    title: "Kursus Pasar Modal",
    description: "Pelatihan rutin untuk anggota KSPM mengenai fundamental dan teknik analisis saham.",
  },
  {
    id: "gal-03",
    src: "/images/event-companyvisit.jpg",
    alt: "Company Visit BEI",
    title: "Company Visit",
    description: "Kunjungan resmi KSPM FEB UIKA ke Bursa Efek Indonesia dan Sekuritas mitra.",
  },
  {
    id: "gal-04",
    src: "/images/event-comparative.jpg",
    alt: "Comparative Study",
    title: "Comparative Study",
    description: "Studi banding KSPM FEB UIKA bersama Kelompok Studi dari universitas lain.",
  },
  {
    id: "gal-05",
    src: "/images/about-vision.jpg",
    alt: "Edukasi Pasar Modal",
    title: "Edukasi Anggota",
    description: "Pertemuan rutin edukasi anggota baru mengenai dasar-dasar trading dan investasi.",
  },
  {
    id: "gal-06",
    src: "/images/research-sps.jpg",
    alt: "Kelas Si Paling Saham",
    title: "Kelas SPS",
    description: "Kelas interaktif analisis pasar modal yang santai namun berbobot untuk mahasiswa.",
  },
  {
    id: "gal-07",
    src: "/images/research-equity.jpg",
    alt: "Diskusi Riset Saham",
    title: "Riset Emiten",
    description: "Kegiatan analisis emiten dan pembedahan laporan keuangan secara berkelompok.",
  },
  {
    id: "gal-08",
    src: "/images/story-image.jpg",
    alt: "Foto Bersama Pengurus",
    title: "Kebersamaan Pengurus",
    description: "Momen keakraban seluruh pengurus KSPM FEB UIKA setelah menyelesaikan program kerja.",
  }
];
