import { useState, useEffect, useRef } from 'react';
import { Send, CheckCircle, AlertCircle, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { contactFormConfig } from '../config';
import { submitContactForm } from '../lib/strapi';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MapPin, Phone, Mail, Clock,
};

export function FormKontak({ data }: { data?: typeof contactFormConfig }) {
  const activeConfig = {
    ...contactFormConfig,
    ...data,
    contactInfo: data?.contactInfo && data.contactInfo.length > 0 
      ? data.contactInfo 
      : contactFormConfig.contactInfo,
    form: data?.form 
      ? { ...contactFormConfig.form, ...data.form } 
      : contactFormConfig.form
  };

  // Null check: if config is empty, render nothing
  if (!activeConfig.mainTitle) return null;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    visitDate: '',
    visitors: 'Mahasiswa UIKA',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.fade-up');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Nama lengkap wajib diisi';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    // Phone validation
    const digitCount = formData.phone.replace(/\D/g, '').length;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor telepon wajib diisi';
    } else if (digitCount < 9 || digitCount > 15) {
      newErrors.phone = 'Nomor telepon harus terdiri dari 9-15 digit';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await submitContactForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: `Tanggal: ${formData.visitDate || 'Tidak ada'}, Kategori: ${formData.visitors}. Pesan: ${formData.message}`,
        category: 'contact',
      });
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', visitDate: '', visitors: 'Mahasiswa UIKA', message: '' });
      setErrors({});
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    let value = e.target.value;
    const name = e.target.name;

    if (name === 'phone') {
      // Only allow digits, plus (+), hyphen (-), and space ( )
      value = value.replace(/[^0-9+\-\s]/g, '');
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const form = activeConfig.form;

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-8 sm:py-12 md:py-16 bg-background border-t border-border"
    >
      <div className="container-custom relative z-10">
        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-premium grid lg:grid-cols-12 items-stretch min-h-[600px]">
          {/* Left Column: Background image overlay with details */}
          <div className="relative lg:col-span-5 w-full min-h-[320px] lg:min-h-0 overflow-hidden flex flex-col justify-between p-6 sm:p-10 lg:p-16">
        <img
          src="/images/story-image.jpg"
          alt="Hubungi KSPM FEB UIKA"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark forest green gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-black/80 via-black/50 to-primary/40 pointer-events-none z-10" />

        {/* Content top: eyebrow label */}
        <div className="relative z-20">
          <span className="font-script text-xs sm:text-sm tracking-[0.24em] text-secondary font-bold uppercase block">
            {activeConfig.scriptText.toUpperCase()}
          </span>
        </div>

        {/* Content middle: main header */}
        <div className="relative z-20 my-auto py-6 sm:py-10 md:py-12">
          <h2 className="font-sans text-2xl sm:text-4xl lg:text-[2.2rem] xl:text-[2.8rem] font-extrabold text-white leading-[1.05] tracking-tighter uppercase max-w-sm">
            {activeConfig.mainTitle}
          </h2>
          {activeConfig.introText && (
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-sm mt-4 font-sans">
              {activeConfig.introText}
            </p>
          )}
        </div>

        {/* Content bottom: contact details list */}
        <div className="relative z-20 space-y-4">
          {activeConfig.contactInfo.map((item) => {
            const IconComponent = iconMap[item.icon];
            return (
              <div key={item.label} className="flex items-center gap-3.5 text-white/95">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  {IconComponent && <IconComponent className="w-4 h-4 text-gold-400" />}
                </div>
                <div>
                  <span className="block text-[10px] text-gold-300 tracking-wider font-bold uppercase">
                    {item.label}
                  </span>
                  <span className="text-xs sm:text-sm font-medium">
                    {item.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Message & Collaboration Form */}
      <div className="lg:col-span-7 bg-white text-primary p-6 sm:p-10 lg:p-16 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-border">
        <div className="max-w-xl w-full mx-auto">
          <h3 className="font-sans text-xl sm:text-3xl font-extrabold text-primary uppercase tracking-tight mb-4 sm:mb-8">
            {activeConfig.contactInfoTitle || 'Kirim pesan atau ajukan kolaborasi'}
          </h3>

          {status === 'success' ? (
            <div className="text-center py-12 bg-neutral-50 rounded-2xl border border-border p-8" role="alert">
              <CheckCircle className="w-14 h-14 text-gold-600 mx-auto mb-4" />
              <h4 className="font-sans text-xl font-bold text-primary mb-2">
                {form.successMessage}
              </h4>
              <p className="text-muted-foreground text-sm">
                Pesan Anda telah kami terima. Tim KSPM FEB UIKA akan segera meninjau dan merespons email Anda.
              </p>
            </div>
          ) : status === 'error' ? (
            <div className="text-center py-12 bg-neutral-50 rounded-2xl border border-border p-8" role="alert">
              <AlertCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
              <h4 className="font-sans text-xl font-bold text-primary mb-2">
                {form.errorMessage}
              </h4>
              <p className="text-muted-foreground text-sm">
                Terjadi kendala pengiriman. Silakan hubungi kami langsung melalui WhatsApp atau Email resmi.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-bold text-neutral-700 uppercase tracking-widest mb-2">
                    {form.nameLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder={form.namePlaceholder}
                    autoComplete="name"
                    className={`w-full px-0 py-2.5 bg-transparent border-b text-neutral-800 placeholder-neutral-400 focus:outline-none transition-all ${
                      errors.name 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-border focus:border-gold-500'
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="contact-phone" className="block text-xs font-bold text-neutral-700 uppercase tracking-widest mb-2">
                    {form.phoneLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder={form.phonePlaceholder}
                    autoComplete="tel"
                    className={`w-full px-0 py-2.5 bg-transparent border-b text-neutral-800 placeholder-neutral-400 focus:outline-none transition-all ${
                      errors.phone 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-border focus:border-gold-500'
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.phone}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-bold text-neutral-700 uppercase tracking-widest mb-2">
                    {form.emailLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder={form.emailPlaceholder}
                    autoComplete="email"
                    className={`w-full px-0 py-2.5 bg-transparent border-b text-neutral-800 placeholder-neutral-400 focus:outline-none transition-all ${
                      errors.email 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-border focus:border-gold-500'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.email}</p>}
                </div>

                {/* Visit Date */}
                <div>
                  <label htmlFor="contact-date" className="block text-xs font-bold text-neutral-700 uppercase tracking-widest mb-2">
                    {form.visitDateLabel}
                  </label>
                  <input
                    id="contact-date"
                    type="date"
                    name="visitDate"
                    value={formData.visitDate}
                    onChange={handleChange}
                    className="w-full px-0 py-2 bg-transparent border-b border-border text-neutral-800 focus:outline-none focus:border-gold-500 transition-all"
                  />
                </div>
              </div>

              {/* Number of Visitors */}
              {form.visitorsOptions.length > 0 && (
                <div>
                  <label htmlFor="contact-visitors" className="block text-xs font-bold text-neutral-700 uppercase tracking-widest mb-2">
                    {form.visitorsLabel}
                  </label>
                  <select
                    id="contact-visitors"
                    name="visitors"
                    value={formData.visitors}
                    onChange={handleChange}
                    className="w-full px-0 py-2.5 bg-transparent border-b border-border text-neutral-800 focus:outline-none focus:border-gold-500 transition-all"
                  >
                    {form.visitorsOptions.map((option) => (
                      <option key={option} value={option} className="text-primary bg-white">{option}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Message */}
              <div>
                <label htmlFor="contact-message" className="block text-xs font-bold text-neutral-700 uppercase tracking-widest mb-2">
                  {form.messageLabel}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                  placeholder={form.messagePlaceholder}
                  className="w-full px-0 py-2.5 bg-transparent border-b border-border text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-gold-500 transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary rounded-lg flex items-center justify-center gap-2 py-3 sm:py-4 px-6 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer uppercase tracking-widest font-bold text-xs shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {form.submittingText}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {form.submitText}
                  </>
                )}
              </button>

              {contactFormConfig.privacyNotice && (
                <p className="text-[10px] text-muted-foreground text-center mt-4">
                  {contactFormConfig.privacyNotice}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  </div>
</section>
  );
}
