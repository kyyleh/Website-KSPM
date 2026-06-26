const STRAPI_URL = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';

/**
 * Resolves media paths from Strapi. If the path is relative, it prepends the Strapi URL.
 * If the path is already an absolute URL (e.g. stored on Cloudinary), it returns it as is.
 */
export function getMediaUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `${STRAPI_URL}${url}`;
}

/**
 * Helper to perform fetch requests to the Strapi API.
 */
export async function fetchStrapi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${STRAPI_URL}/api/${path}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch from Strapi: ${response.statusText}`);
  }

  const json = await response.json();
  return json.data as T;
}

/**
 * Interface structures matching Strapi REST response payloads (v4/v5 format).
 */

export interface StrapiImage {
  id: number;
  attributes?: {
    url: string;
    alternativeText?: string;
  };
  url?: string; // Strapi v5 style
}

export interface StrapiHero {
  scriptText?: string;
  mainTitle?: string;
  ctaButtonText?: string;
  ctaTarget?: string;
  stats?: Array<{ value: number; suffix: string; label: string }>;
  decorativeText?: string;
  backgroundImage?: { data?: StrapiImage; url?: string };
}

export interface StrapiAboutUs {
  visionMission?: string;
  historyTimeline?: Array<{ year: string; event: string }>;
  introduction?: string;
}

export interface StrapiTeamMember {
  id: number;
  attributes?: {
    name: string;
    role: string;
    avatar?: { data?: StrapiImage; url?: string };
  };
  name?: string;
  role?: string;
  avatar?: { url?: string };
}

export interface StrapiActivity {
  id: number;
  attributes?: {
    title: string;
    description: string;
    date: string;
    category?: string;
    image?: { data?: StrapiImage; url?: string };
  };
  title?: string;
  description?: string;
  date?: string;
  category?: string;
  image?: { url?: string };
}

export interface StrapiResearch {
  id: number;
  attributes?: {
    title: string;
    author?: string;
    publishDate: string;
    abstract?: string;
    content?: string;
    coverPhoto?: { data?: StrapiImage; url?: string };
    pdfFile?: { data?: { attributes?: { url: string } }; url?: string };
  };
  title?: string;
  author?: string;
  publishDate?: string;
  abstract?: string;
  content?: string;
  coverPhoto?: { url?: string };
  pdfFile?: { url?: string };
}

export interface StrapiContactPage {
  address?: string;
  phone?: string;
  email?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
}

/**
 * Fetch functions for specific website components
 */

export async function getHeroData(): Promise<StrapiHero | null> {
  try {
    return await fetchStrapi<StrapiHero>('homepage?populate=*');
  } catch (error) {
    console.warn('Failed to fetch Hero data from Strapi, using config fallback', error);
    return null;
  }
}

export async function getAboutUsData(): Promise<StrapiAboutUs | null> {
  try {
    return await fetchStrapi<StrapiAboutUs>('about-us?populate=*');
  } catch (error) {
    console.warn('Failed to fetch About Us data from Strapi, using config fallback', error);
    return null;
  }
}

export async function getTeamMembers(): Promise<StrapiTeamMember[] | null> {
  try {
    return await fetchStrapi<StrapiTeamMember[]>('team-members?populate=*');
  } catch (error) {
    console.warn('Failed to fetch Team Members from Strapi, using config fallback', error);
    return null;
  }
}

export async function getActivities(): Promise<StrapiActivity[] | null> {
  try {
    return await fetchStrapi<StrapiActivity[]>('activities?populate=*');
  } catch (error) {
    console.warn('Failed to fetch Activities from Strapi, using config fallback', error);
    return null;
  }
}

export async function getResearchPublications(): Promise<StrapiResearch[] | null> {
  try {
    return await fetchStrapi<StrapiResearch[]>('research-publications?populate=*');
  } catch (error) {
    console.warn('Failed to fetch Research from Strapi, using config fallback', error);
    return null;
  }
}

export async function getContactInfo(): Promise<StrapiContactPage | null> {
  try {
    return await fetchStrapi<StrapiContactPage>('contact-page?populate=*');
  } catch (error) {
    console.warn('Failed to fetch Contact Info from Strapi, using config fallback', error);
    return null;
  }
}

/**
 * Submit contact form submission to Strapi
 */
export async function submitContactForm(data: { name: string; email: string; phone: string; message: string }) {
  const url = `${STRAPI_URL}/api/contact-submissions`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit message to backend');
  }
  return await response.json();
}

/**
 * Utility to extract image URL from either Strapi v4 or v5 payload
 */
function extractImageUrl(mediaObj: any): string {
  if (!mediaObj) return '';
  // Check nested data.attributes.url (Strapi v4)
  if (mediaObj.data && mediaObj.data.attributes && mediaObj.data.attributes.url) {
    return mediaObj.data.attributes.url;
  }
  // Check flat url (Strapi v5 / custom populated)
  if (mediaObj.url) {
    return mediaObj.url;
  }
  if (mediaObj.data && mediaObj.data.url) {
    return mediaObj.data.url;
  }
  return '';
}

/**
 * Mappers to frontend config formats
 */

export async function getMappedHero(): Promise<any | null> {
  const data = await getHeroData();
  if (!data) return null;
  const raw = (data as any).attributes || data;
  return {
    scriptText: raw.scriptText || '',
    mainTitle: raw.mainTitle || '',
    ctaButtonText: raw.ctaButtonText || '',
    ctaTarget: raw.ctaTarget || '',
    stats: raw.stats || [],
    decorativeText: raw.decorativeText || '',
    backgroundImage: extractImageUrl(raw.backgroundImage),
  };
}

export async function getMappedAbout(): Promise<any | null> {
  const aboutData = await getAboutUsData();
  const teamData = await getTeamMembers();

  if (!aboutData && !teamData) return null;

  const rawAbout = aboutData ? ((aboutData as any).attributes || aboutData) : {};

  // Build the timeline
  const timeline = rawAbout.historyTimeline || [];

  // Build the vision/mission pillars as tabs
  const tabs = [
    {
      id: 'vision-mission',
      name: 'Visi & Misi',
      icon: 'Target',
      image: '/images/about-vision.jpg',
      content: {
        title: 'Visi & Misi KSPM',
        description: rawAbout.visionMission || 'Menjadi komunitas edukasi pasar modal yang unggul, tepercaya, dan berkontribusi aktif dalam mencetak investor muda.',
        highlight: 'Smart, Professional, Integrity'
      }
    }
  ];

  // Map team members to org structure
  const rawMembers = teamData || [];
  const mappedMembers = rawMembers.map((member: any) => {
    const rawMem = member.attributes || member;
    return {
      name: rawMem.name,
      role: rawMem.role,
      image: extractImageUrl(rawMem.avatar)
    };
  });

  // Re-create the org tree/nested structure if member list exists
  // For KSPM, if we have a flat list from backend, we can display them as a list.
  // We'll hook it up by constructing the tree representation
  const pembina = mappedMembers.find(m => m.role.toLowerCase().includes('pembina')) || { name: 'Pembina KSPM', role: 'Pembina', image: '' };
  const steering = mappedMembers.filter(m => m.role.toLowerCase().includes('steering') || m.role.toLowerCase().includes('dewan kehormatan'))[0] || { name: 'Steering Committee', role: 'SC', image: '' };
  const ketua = mappedMembers.find(m => m.role.toLowerCase().includes('ketua umum') || m.role.toLowerCase().includes('presiden')) || { name: 'Ketua Umum', role: 'Ketua', image: '' };
  const sekBend = mappedMembers.filter(m => m.role.toLowerCase().includes('sekretaris') || m.role.toLowerCase().includes('bendahara'));
  const depts = mappedMembers.filter(m => !m.role.toLowerCase().includes('pembina') && !m.role.toLowerCase().includes('steering') && !m.role.toLowerCase().includes('ketua') && !m.role.toLowerCase().includes('sekretaris') && !m.role.toLowerCase().includes('bendahara'));

  const structure = {
    name: pembina.name,
    role: pembina.role,
    image: pembina.image,
    children: [
      {
        name: steering.name,
        role: steering.role,
        image: steering.image,
        children: [
          {
            name: ketua.name,
            role: ketua.role,
            image: ketua.image,
            children: [
              ...sekBend,
              {
                name: '_departments_',
                role: '',
                image: '',
                children: depts.map(d => ({
                  name: d.name,
                  role: d.role,
                  image: d.image
                }))
              }
            ]
          }
        ]
      }
    ]
  };

  return {
    aboutConfig: {
      scriptText: 'KSPM FEB UIKA BOGOR',
      subtitle: 'Tentang Kami',
      mainTitle: 'Mengenal KSPM',
      introText: rawAbout.introduction || 'Kelompok Studi Pasar Modal Fakultas Ekonomi dan Bisnis Universitas Ibn Khaldun Bogor...',
      quote: {
        text: 'Edukasi investasi sejak dini untuk masa depan gemilang.',
        attribution: 'KSPM FEB UIKA',
        prefix: 'Investasi Masa Depan'
      },
      tabs,
      timeline,
      yearBadge: '2019',
      yearBadgeLabel: 'Founded',
      founderPhoto: '/images/kspm-logo.png',
      founderPhotoAlt: 'KSPM Logo'
    },
    orgConfig: {
      scriptText: 'STRUKTUR ORGANISASI',
      subtitle: 'Kepengurusan KSPM',
      mainTitle: 'Pengurus KSPM',
      description: 'Struktur kepengurusan aktif KSPM FEB UIKA Bogor.',
      structure
    }
  };
}

export async function getMappedActivities(): Promise<any | null> {
  const data = await getActivities();
  if (!data || data.length === 0) return null;

  const slides = data.map((item: any) => {
    const raw = item.attributes || item;
    return {
      title: raw.title,
      subtitle: raw.category || 'Kegiatan',
      description: raw.description,
      image: extractImageUrl(raw.image) || '/images/slider01.jpg',
      area: new Date(raw.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      unit: ''
    };
  });

  return {
    scriptText: 'KEGIATAN KAMI',
    subtitle: 'Agenda & Dokumentasi',
    mainTitle: 'Aktivitas KSPM',
    locationTag: 'UIKA Bogor',
    slides
  };
}

export async function getMappedResearch(): Promise<any | null> {
  const data = await getResearchPublications();
  if (!data || data.length === 0) return null;

  const wines = data.map((item: any) => {
    const raw = item.attributes || item;
    
    // Resolve attachment link
    let pdfUrl = '';
    if (raw.pdfFile) {
      if (raw.pdfFile.url) {
        pdfUrl = raw.pdfFile.url;
      } else if (raw.pdfFile.data && raw.pdfFile.data.attributes) {
        pdfUrl = raw.pdfFile.data.attributes.url;
      }
    }

    return {
      id: item.id.toString(),
      name: raw.title,
      subtitle: `Penulis: ${raw.author || 'Tim Riset KSPM'}`,
      year: new Date(raw.publishDate).getFullYear().toString(),
      image: extractImageUrl(raw.coverPhoto) || '/images/news01.jpg',
      glowColor: 'bg-gold-500/15',
      description: raw.abstract || raw.content?.substring(0, 150) + '...',
      tastingNotes: raw.category || 'Equity Research, Market Update',
      alcohol: raw.author || 'KSPM',
      temperature: new Date(raw.publishDate).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
      aging: pdfUrl ? 'Unduh PDF' : 'Baca Online',
      pdfLink: pdfUrl ? getMediaUrl(pdfUrl) : ''
    };
  });

  return {
    scriptText: 'RISET & PUBLIKASI',
    subtitle: 'Analisis & Edukasi Pasar Modal',
    mainTitle: 'Riset KSPM',
    wines,
    features: [
      { icon: 'BookOpen', title: 'Analisis Fundamental', description: 'Bedah laporan keuangan emiten saham secara mendalam.' },
      { icon: 'Sparkles', title: 'Analisis Teknikal', description: 'Mempelajari tren pergerakan harga saham lewat grafik.' },
      { icon: 'Clock', title: 'Market Update', description: 'Rangkuman berita ekonomi terhangat setiap pekan.' }
    ],
    quote: {
      text: 'Riset objektif dan edukasi berkualitas menjadi landasan keputusan investasi yang cerdas.',
      attribution: 'Divisi Riset KSPM',
      prefix: 'KSPM Research'
    }
  };
}

export async function getMappedContact(): Promise<any | null> {
  const data = await getContactInfo();
  if (!data) return null;
  const raw = (data as any).attributes || data;

  const contactInfo = [
    { icon: 'MapPin', label: 'Alamat Kantor', value: raw.address || 'Gedung H.E.M. Kahfie, FEB UIKA Bogor', subtext: 'Bogor, Jawa Barat' },
    { icon: 'Phone', label: 'Telepon / WhatsApp', value: raw.phone || '+62 812-3456-7890', subtext: 'Hubungi admin kami' },
    { icon: 'Mail', label: 'Email Resmi', value: raw.email || 'kspm@uika-bogor.ac.id', subtext: 'Kirim email ke kami' }
  ];

  return {
    scriptText: 'HUBUNGI KAMI',
    subtitle: 'Hubungan & Kemitraan',
    mainTitle: 'Kontak KSPM',
    introText: 'Hubungi kami untuk kolaborasi, seminar, atau pertanyaan seputar pasar modal.',
    contactInfoTitle: 'Detail Kontak',
    contactInfo,
    form: {
      nameLabel: 'Nama Lengkap',
      namePlaceholder: 'Masukkan nama Anda...',
      emailLabel: 'Email Aktif',
      emailPlaceholder: 'nama@domain.com',
      phoneLabel: 'Nomor WhatsApp',
      phonePlaceholder: '+62...',
      visitDateLabel: 'Rencana Tanggal Hubungi',
      visitorsLabel: 'Kategori / Keperluan',
      visitorsOptions: ['Kolaborasi', 'Pertanyaan Umum', 'Media & Publikasi', 'Lainnya'],
      messageLabel: 'Pesan',
      messagePlaceholder: 'Tuliskan pesan Anda di sini...',
      submitText: 'Kirim Pesan',
      submittingText: 'Mengirim...',
      successMessage: 'Pesan Anda berhasil dikirim ke KSPM FEB UIKA Bogor!',
      errorMessage: 'Terjadi kesalahan. Silakan coba kembali beberapa saat lagi.'
    }
  };
}

