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
    { name: "Beranda", href: "#", icon: "Home" },
    {
      name: "Tentang Kami",
      href: "#about",
      icon: "Users",
      dropdown: [
        { name: "Visi & Misi", href: "#about" },
        { name: "Sejarah", href: "#history" },
        { name: "Struktur Organisasi", href: "#organization" },
      ]
    },
    {
      name: "Kegiatan",
      href: "#events",
      icon: "Grape",
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
        { name: "Capital Market Explained", href: "#research" },
        { name: "Weekly Research", href: "#research" },
        { name: "Equity Research", href: "#research" },
      ]
    },
    { name: "Kontak", href: "#contact", icon: "Mail" },
  ],
  ctaButtonText: "Gabung Kami",
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
}

export const heroConfig: HeroConfig = {
  scriptText: "Kelompok Studi Pasar Modal",
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
};

// -----------------------------------------------------------------------------
// Wine Showcase Config → Adapted for Research Programs
// -----------------------------------------------------------------------------
export interface Wine {
  id: string;
  name: string;
  subtitle: string;
  year: string;
  image: string;
  filter: string;
  glowColor: string;
  description: string;
  tastingNotes: string;
  alcohol: string;
  temperature: string;
  aging: string;
}

export interface WineFeature {
  icon: string;
  title: string;
  description: string;
}

export interface WineQuote {
  text: string;
  attribution: string;
  prefix: string;
}

export interface WineShowcaseConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  wines: Wine[];
  features: WineFeature[];
  quote: WineQuote;
}

export const wineShowcaseConfig: WineShowcaseConfig = {
  scriptText: "Program Unggulan",
  subtitle: "PEMBELAJARAN PASAR MODAL",
  mainTitle: "Riset & Edukasi",
  wines: [
    {
      id: "cme",
      name: "Capital Market",
      subtitle: "Explained",
      year: "2024",
      image: "/images/research-cme.jpg",
      filter: "",
      glowColor: "bg-blue-900/20",
      description: "Serial edukasi pasar modal yang menjelaskan konsep-konsep fundamental hingga advanced dalam dunia investasi dan trading.",
      tastingNotes: "Fundamental Analysis, Technical Analysis, Risk Management",
      alcohol: "All Levels",
      temperature: "Online & Offline",
      aging: "Monthly Release",
    },
    {
      id: "weekly",
      name: "Weekly",
      subtitle: "Research",
      year: "2024",
      image: "/images/research-weekly.jpg",
      filter: "brightness(1.1)",
      glowColor: "bg-emerald-900/20",
      description: "Analisis mingguan terhadap pergerakan pasar saham Indonesia dan global dengan rekomendasi investasi yang terukur.",
      tastingNotes: "Market Update, Sector Analysis, Stock Picks",
      alcohol: "Intermediate",
      temperature: "Weekly Release",
      aging: "Every Monday",
    },
    {
      id: "equity",
      name: "Equity",
      subtitle: "Research",
      year: "2024",
      image: "/images/research-equity.jpg",
      filter: "brightness(1.15) sepia(0.2)",
      glowColor: "bg-amber-900/20",
      description: "Riset mendalam tentang perusahaan-perusahaan terbuka di Bursa Efek Indonesia dengan valuasi dan proyeksi kinerja.",
      tastingNotes: "Fundamental Analysis, Valuation, Financial Modeling",
      alcohol: "Advanced",
      temperature: "Monthly Release",
      aging: "In-depth Research",
    },
  ],
  features: [
    { icon: "Wine", title: "Analisis Fundamental", description: "Pembelajaran analisis laporan keuangan dan valuasi perusahaan" },
    { icon: "Thermometer", title: "Technical Analysis", description: "Studi pola grafik dan indikator teknikal untuk timing investasi" },
    { icon: "Clock", title: "Risk Management", description: "Strategi pengelolaan risiko dan alokasi portofolio optimal" },
    { icon: "Sparkles", title: "Market Psychology", description: "Memahami perilaku pasar dan psikologi investor" },
  ],
  quote: {
    text: "Investasi terbaik adalah investasi dalam pengetahuan. Semakin banyak Anda belajar, semakin baik keputusan investasi Anda.",
    attribution: "KSPM FEB UIKA Bogor",
    prefix: "Quote",
  },
};

// -----------------------------------------------------------------------------
// Winery Carousel Config → Adapted for Events
// -----------------------------------------------------------------------------
export interface CarouselSlide {
  image: string;
  title: string;
  subtitle: string;
  area: string;
  unit: string;
  description: string;
}

export interface WineryCarouselConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  locationTag: string;
  slides: CarouselSlide[];
}

export const wineryCarouselConfig: WineryCarouselConfig = {
  scriptText: "Kegiatan Kami",
  subtitle: "EVENTS & ACTIVITIES",
  mainTitle: "Program Kerja",
  locationTag: "FEB UIKA Bogor",
  slides: [
    {
      image: "/images/event-investalk.jpg",
      title: "Investalk",
      subtitle: "Investor Talk Show",
      area: "1000+",
      unit: "Peserta",
      description: "Talk show interaktif dengan praktisi pasar modal, investor sukses, dan analis terkemuka untuk berbagi pengalaman dan insight.",
    },
    {
      image: "/images/event-kpm.jpg",
      title: "Kursus Pasar Modal",
      subtitle: "Comprehensive Learning",
      area: "500+",
      unit: "Alumni",
      description: "Program pembelajaran sistematis tentang pasar modal dari dasar hingga mahir dengan sertifikat resmi.",
    },
    {
      image: "/images/event-companyvisit.jpg",
      title: "Company Visit",
      subtitle: "Direct Learning",
      area: "20+",
      unit: "Perusahaan",
      description: "Kunjungan langsung ke perusahaan terbuka, bursa efek, dan lembaga keuangan untuk pengalaman belajar nyata.",
    },
    {
      image: "/images/event-comparative.jpg",
      title: "Comparative Study",
      subtitle: "Cross-Campus Learning",
      area: "15+",
      unit: "Kampus",
      description: "Program pertukaran ilmu dengan KSPM dari berbagai universitas di Indonesia untuk memperluas wawasan.",
    },
  ],
};

// -----------------------------------------------------------------------------
// Museum Config → Adapted for About/History
// -----------------------------------------------------------------------------
export interface TimelineEvent {
  year: string;
  event: string;
}

export interface MuseumTabContent {
  title: string;
  description: string | string[];
  highlight?: string;
}

export interface MuseumTab {
  id: string;
  name: string;
  icon: string;
  image: string;
  content: MuseumTabContent;
}

export interface MuseumQuote {
  prefix: string;
  text: string;
  attribution: string;
}

export interface MuseumConfig {
  scriptText: string;
  subtitle: string;
  mainTitle: string;
  introText: string;
  timeline: TimelineEvent[];
  tabs: MuseumTab[];
  openingHours: string;
  openingHoursLabel: string;
  ctaButtonText: string;
  yearBadge: string;
  yearBadgeLabel: string;
  quote: MuseumQuote;
  founderPhotoAlt: string;
  founderPhoto: string;
}

export const museumConfig: MuseumConfig = {
  scriptText: "Tentang Kami",
  subtitle: "OUR JOURNEY",
  mainTitle: "Sejarah KSPM FEB UIKA",
  introText: "Kelompok Studi Pasar Modal Fakultas Ekonomi dan Bisnis Universitas Ibn Khaldun Bogor didirikan dengan visi menjadi komunitas pasar modal terdepan yang mencetak generasi investor dan trader yang cerdas, berintegritas, dan profesional.",
  timeline: [
    { year: "2019", event: "KSPM FEB UIKA Bogor resmi berdiri" },
    { year: "2020", event: "Program KPM pertama diluncurkan" },
    { year: "2021", event: "Kerjasama dengan OJK dan BEI" },
    { year: "2023", event: "Peluncuran riset weekly dan CME" },
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
        highlight: "Edukasi • Informasi • Sosialisasi",
      },
    },
    {
      id: "mission",
      name: "Misi",
      icon: "Target",
      image: "/images/about-values.jpg",
      content: {
        title: "Misi KSPM",
        description: [
          "• Membentuk generasi yang berwawasan keilmuan, terampil, dan ahli dalam pasar modal",
          "• Menumbuhkan rasa tanggung jawab serta komitmen anggota dalam berorganisasi",
          "• Mengedukasi dan mensosialisasikan pengetahuan mengenai pasar modal",
          "• Menyelenggarakan kegiatan-kegiatan terkait pasar modal"
        ],
        highlight: "Terampil • Komitmen • Organisasi",
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
        highlight: "Integrity • Professionalism • Collaboration",
      },
    },
    {
      id: "achievements",
      name: "Pencapaian",
      icon: "Award",
      image: "/images/about-achievements.jpg",
      content: {
        title: "Berkontribusi untuk Pasar Modal Indonesia",
        description: "Telah meluluskan ratusan alumni yang aktif di industri pasar modal, menerbitkan puluhan riset, dan menjalin kerjasama dengan berbagai lembaga keuangan.",
        highlight: "500+ Alumni • 50+ Riset • 20+ Partnership",
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
  founderPhotoAlt: "Founder KSPM FEB UIKA Bogor",
  founderPhoto: "/images/about-founder.jpg",
};

// -----------------------------------------------------------------------------
// Organization Config
// -----------------------------------------------------------------------------
export interface OrgNode {
  name: string;
  role: string;
  image?: string;
  children?: OrgNode[];
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
    image: "/images/kspm-logo.png",
    children: [
      {
        name: "Dewan Kehormatan",
        role: "",
        image: "/images/kspm-logo.png",
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
                name: "Department of Research",
                role: "Riset",
                image: "/images/media__1773276198605.jpg",
              },
              {
                name: "Department of Media",
                role: "Media Kreatif",
                image: "/images/kspm-logo.png",
              },
              {
                name: "Department of HR and Program",
                role: "Program & SDM",
                image: "/images/kspm-logo.png",
              },
              {
                name: "Department of Finance",
                role: "Pendanaan",
                image: "/images/kspm-logo.png",
              }
            ]
          }
        ]
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
  scriptText: string;
  subtitle: string;
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
  scriptText: "Terbaru",
  subtitle: "ARTIKEL & BERITA",
  mainTitle: "Update Terkini",
  viewAllText: "Lihat Semua",
  readMoreText: "Baca Selengkapnya",
  articles: [
    {
      id: 1,
      image: "/images/article-1.jpg",
      title: "MSCI Rebalancing: Momentum atau Risiko?",
      excerpt: "Analisis dampak rebalancing MSCI terhadap pergerakan saham-saham Indonesia dan strategi investasi yang tepat.",
      date: "15 Maret 2024",
      category: "Market Analysis",
      url: "#",
    },
    {
      id: 2,
      image: "/images/article-2.jpg",
      title: "Single Stock Futures: Instrumen Derivatif Masa Depan",
      excerpt: "Memahami mekanisme SSF sebagai instrumen hedging dan spekulasi di pasar modal Indonesia.",
      date: "10 Maret 2024",
      category: "Education",
      url: "#",
    },
    {
      id: 3,
      image: "/images/article-3.jpg",
      title: "Short Selling: Strategi Kontroversial",
      excerpt: "Pembahasan mendalam tentang short selling, regulasinya di Indonesia, dan risiko-benefitnya.",
      date: "5 Maret 2024",
      category: "Strategy",
      url: "#",
    },
    {
      id: 4,
      image: "/images/article-4.jpg",
      title: "Transformasi Industri Pertambangan",
      excerpt: "Studi kasus akuisisi Petrosea oleh Petrindo dan implikasinya terhadap sektor pertambangan.",
      date: "1 Maret 2024",
      category: "Equity Research",
      url: "#",
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
    },
    {
      name: "Agung Supriatna",
      role: "Mahasiswa Pebankan dan Keuangan Digital 2025",
      text: "Program Kursus Pasar Modal sangat komprehensif. Mentor-mentornya berpengalaman dan materinya aplikatif. Sangat recommended untuk pemula!",
      rating: 5,
    },
    {
      name: "Andi Nadya",
      role: "Research Team",
      text: "Bergabung dengan tim riset KSPM memberikan saya pengalaman berharga dalam menganalisis pasar dan menyusun laporan keuangan yang profesional.",
      rating: 4,
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
}

export const contactFormConfig: ContactFormConfig = {
  scriptText: "Hubungi Kami",
  subtitle: "GET IN TOUCH",
  mainTitle: "Mari Berkolaborasi",
  introText: "Punya pertanyaan tentang KSPM atau ingin berkolaborasi? Jangan ragu untuk menghubungi kami. Tim kami siap membantu Anda.",
  contactInfoTitle: "Informasi Kontak",
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
      value: "+62 857-XXXX-XXXX",
      subtext: "Public Relation",
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
    visitDateLabel: "Tanggal Kunjungan",
    visitorsLabel: "Jumlah Pengunjung",
    visitorsOptions: ["1", "2", "3-5", "6-10", "10+"],
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
    { icon: "Instagram", label: "Instagram", href: "https://instagram.com/kspmfeb_uika" },
    { icon: "Facebook", label: "LinkedIn", href: "https://linkedin.com/company/kspmfeb-uika" },
    { icon: "Twitter", label: "YouTube", href: "https://youtube.com/kspmfeb-uika" },
    { icon: "Youtube", label: "TikTok", href: "https://tiktok.com/@kspmfeb_uika" },
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
        { name: "Capital Market Explained", href: "#research" },
        { name: "Weekly Research", href: "#research" },
        { name: "Equity Research", href: "#research" },
        { name: "Casual of the Day", href: "#research" },
      ],
    },
  ],
  contactItems: [
    { icon: "MapPin", text: "FEB UIKA Bogor, Jl. K.H. Sholeh Iskandar" },
    { icon: "Phone", text: "+62 857-XXXX-XXXX" },
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
