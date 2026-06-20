import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, CheckCircle, User, BookOpen, Hash, Calendar, Phone, Mail, FileText, MessageCircle, GraduationCap } from 'lucide-react';

const facultyProdiMap: Record<string, string[]> = {
  "Fakultas Keguruan dan Ilmu Pendidikan (FKIP)": [
    "Pendidikan Masyarakat",
    "Pendidikan Bahasa Inggris",
    "Teknologi Pendidikan",
    "Pendidikan Vokasional Desain Fashion"
  ],
  "Fakultas Teknik dan Sains (FTS)": [
    "Teknik Informatika",
    "Teknik Sipil",
    "Teknik Mesin",
    "Teknik Elektro",
    "Sistem Informasi",
    "Rekayasa Pertanian dan Biosistem",
    "Ilmu Lingkungan"
  ],
  "Fakultas Ekonomi dan Bisnis (FEB)": [
    "Manajemen",
    "Akuntansi",
    "Perdagangan Internasional",
    "Bisnis Digital",
    "D4 Perbankan dan Keuangan Digital"
  ],
  "Fakultas Agama Islam (FAI)": [
    "Pendidikan Agama Islam",
    "Komunikasi dan Penyiaran Islam",
    "Hukum Keluarga Islam (Ahwal Al Syakhsyiyyah)",
    "Pendidikan Guru Madrasah Ibtidaiyah",
    "Bimbingan dan Konseling Pendidikan Islam"
  ],
  "Fakultas Hukum (FH)": [
    "Ilmu Hukum"
  ],
  "Fakultas Ilmu Kesehatan (FIKES)": [
    "Kesehatan Masyarakat",
    "Gizi"
  ],
  "Sekolah Pascasarjana (SPS)": [
    "Magister Pendidikan Islam",
    "Magister Teknologi Pendidikan",
    "Magister Ekonomi Syariah",
    "Magister Manajemen",
    "Magister Ilmu Hukum",
    "Doktor Pendidikan Islam"
  ]
};

export function RegisterForm({ onNavigate }: { onNavigate?: (href: string) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    nim: '',
    faculty: 'Fakultas Ekonomi dan Bisnis (FEB)',
    major: 'Manajemen',
    semester: '1',
    phone: '',
    email: '',
    reason: '',
    skills: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (sectionRef.current) {
      sectionRef.current.classList.add('visible');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFacultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFaculty = e.target.value;
    const majors = facultyProdiMap[selectedFaculty] || [];
    setFormData(prev => ({
      ...prev,
      faculty: selectedFaculty,
      major: majors[0] || ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.nim || !formData.phone || !formData.email) {
      return;
    }
    
    setStatus('submitting');
    
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          access_key: "7f955c73-43be-4994-bad1-8e3afcf9f610",
          name: formData.name,
          nim: formData.nim,
          faculty: formData.faculty,
          major: formData.major,
          semester: formData.semester,
          phone: formData.phone,
          email: formData.email,
          reason: formData.reason,
          skills: formData.skills,
          subject: `Pendaftaran Anggota Baru KSPM - ${formData.name}`,
          from_name: "KSPM FEB UIKA Bogor"
        })
      });

      const result = await response.json();
      if (result.success) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("Registration submission error:", error);
      setStatus('error');
    }
  };

  const handleWhatsAppConfirm = () => {
    const waText = `Halo Admin KSPM FEB UIKA Bogor, saya telah mengisi formulir pendaftaran anggota:
- Nama: ${formData.name}
- NIM: ${formData.nim}
- Fakultas: ${formData.faculty}
- Prodi: ${formData.major}
- Semester: ${formData.semester}
- No. WA: ${formData.phone}
- Email: ${formData.email}

Mohon bantuannya untuk verifikasi pendaftaran saya. Terima kasih!`;
    const waLink = `https://wa.me/6289514455380?text=${encodeURIComponent(waText)}`;
    window.open(waLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      ref={sectionRef}
      className="pt-32 pb-20 relative overflow-hidden bg-[#f0ede6] min-h-screen flex items-center justify-center text-left"
    >
      {/* Background Accent */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom relative max-w-3xl w-full">
        {/* Back Button */}
        <button
          onClick={() => onNavigate?.('#hero')}
          className="mb-8 flex items-center gap-2 text-neutral-600 hover:text-gold-600 transition-colors group cursor-pointer text-sm font-medium w-fit border-none bg-transparent"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Kembali ke Beranda
        </button>

        {status === 'success' ? (
          <div className="bg-white/95 backdrop-blur-sm border border-neutral-200/60 rounded-2xl p-6 sm:p-8 md:p-12 shadow-premium text-center hover:shadow-gold-soft transition-all duration-500">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="font-serif text-3xl text-neutral-900 text-center mb-4 font-semibold">Pendaftaran Berhasil Terkirim!</h2>
            <p className="text-neutral-600 text-center mb-8 max-w-lg mx-auto leading-relaxed">
              Terima kasih telah mendaftar sebagai calon anggota KSPM FEB UIKA Bogor. Data Anda telah direkam. Silakan lakukan konfirmasi pendaftaran via WhatsApp admin untuk proses verifikasi berkas lebih lanjut.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleWhatsAppConfirm}
                className="btn-primary rounded-sm flex items-center justify-center gap-2 px-6 py-3 cursor-pointer shadow-sm bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 text-white font-medium"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                Konfirmasi via WhatsApp
              </button>
              <button
                onClick={() => onNavigate?.('#hero')}
                className="bg-[#1c1515] text-white hover:bg-gold-500 transition-all duration-300 px-6 py-3 text-sm font-medium tracking-wide rounded-sm cursor-pointer border border-[#1c1515] hover:border-gold-500 shadow-sm"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur-sm border border-neutral-200/60 rounded-2xl p-6 sm:p-8 md:p-12 shadow-premium hover:shadow-gold-soft transition-all duration-500">
            <div className="text-center mb-10">
              <span className="font-script text-3xl md:text-5xl text-gold-gradient block mb-2">Formulir Pendaftaran</span>
              <h2 className="font-serif text-3xl text-neutral-900 font-semibold uppercase tracking-wide">Gabung KSPM FEB UIKA</h2>
              <div className="w-16 h-0.5 bg-gold-gradient mx-auto mt-4" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Nama Lengkap */}
                <div>
                  <label htmlFor="reg-name" className="block text-sm text-[#4a4545] mb-2 font-medium flex items-center gap-2">
                    <User className="w-4 h-4 text-gold-500" />
                    Nama Lengkap <span className="text-gold-500">*</span>
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Masukkan nama lengkap Anda"
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-colors"
                  />
                </div>

                {/* NIM */}
                <div>
                  <label htmlFor="reg-nim" className="block text-sm text-[#4a4545] mb-2 font-medium flex items-center gap-2">
                    <Hash className="w-4 h-4 text-gold-500" />
                    NIM (Nomor Induk Mahasiswa) <span className="text-gold-500">*</span>
                  </label>
                  <input
                    id="reg-nim"
                    type="text"
                    name="nim"
                    required
                    value={formData.nim}
                    onChange={handleChange}
                    placeholder="Masukkan NIM Anda"
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-colors"
                  />
                </div>

                {/* Fakultas */}
                <div>
                  <label htmlFor="reg-faculty" className="block text-sm text-[#4a4545] mb-2 font-medium flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-gold-500" />
                    Fakultas <span className="text-gold-500">*</span>
                  </label>
                  <select
                    id="reg-faculty"
                    name="faculty"
                    value={formData.faculty}
                    onChange={handleFacultyChange}
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-sm text-neutral-800 focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-colors"
                  >
                    {Object.keys(facultyProdiMap).map(fac => (
                      <option key={fac} value={fac}>{fac}</option>
                    ))}
                  </select>
                </div>

                {/* Program Studi */}
                <div>
                  <label htmlFor="reg-major" className="block text-sm text-[#4a4545] mb-2 font-medium flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-gold-500" />
                    Program Studi <span className="text-gold-500">*</span>
                  </label>
                  <select
                    id="reg-major"
                    name="major"
                    value={formData.major}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-sm text-neutral-800 focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-colors"
                  >
                    {(facultyProdiMap[formData.faculty] || []).map(major => (
                      <option key={major} value={major}>{major}</option>
                    ))}
                  </select>
                </div>

                {/* Semester */}
                <div>
                  <label htmlFor="reg-semester" className="block text-sm text-[#4a4545] mb-2 font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gold-500" />
                    Semester <span className="text-gold-500">*</span>
                  </label>
                  <select
                    id="reg-semester"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-sm text-neutral-800 focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-colors"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>

                {/* WhatsApp */}
                <div>
                  <label htmlFor="reg-phone" className="block text-sm text-[#4a4545] mb-2 font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gold-500" />
                    Nomor WhatsApp <span className="text-gold-500">*</span>
                  </label>
                  <input
                    id="reg-phone"
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+62 xxx-xxxx-xxxx"
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-colors"
                  />
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <label htmlFor="reg-email" className="block text-sm text-[#4a4545] mb-2 font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gold-500" />
                    Email Aktif <span className="text-gold-500">*</span>
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-colors"
                  />
                </div>
              </div>

              {/* Alasan Bergabung */}
              <div>
                <label htmlFor="reg-reason" className="block text-sm text-[#4a4545] mb-2 font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gold-500" />
                  Mengapa Anda tertarik bergabung dengan KSPM?
                </label>
                <textarea
                  id="reg-reason"
                  name="reason"
                  rows={3}
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Tuliskan motivasi atau alasan singkat Anda..."
                  className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-colors resize-none"
                />
              </div>

              {/* Keahlian / Minat */}
              <div>
                <label htmlFor="reg-skills" className="block text-sm text-[#4a4545] mb-2 font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gold-500" />
                  Keahlian atau Minat Khusus (Desain, Menulis, Riset, Trading, dll.)
                </label>
                <textarea
                  id="reg-skills"
                  name="skills"
                  rows={2}
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="Tuliskan jika ada minat atau keahlian khusus..."
                  className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-colors resize-none"
                />
              </div>

              {status === 'error' && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-700 text-sm rounded-sm text-center">
                  Gagal mengirim pendaftaran. Silakan periksa koneksi Anda dan coba lagi.
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full btn-primary rounded-sm flex items-center justify-center gap-2 py-3.5 cursor-pointer shadow-sm mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Kirim Pendaftaran
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
