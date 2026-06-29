import { contactFormConfig } from '../config';

export function WhatsAppButton() {
  if (!contactFormConfig.whatsappLink) return null;

  return (
    <a
      href={contactFormConfig.whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi kami melalui WhatsApp"
      className="fixed bottom-8 right-8 z-40 cursor-pointer group"
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 scale-100 group-hover:scale-125 group-hover:opacity-0 transition-all duration-500 pointer-events-none" />

      {/* Button */}
      <span className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
          boxShadow: '0 4px 24px 0 rgba(37,211,102,0.35), 0 1.5px 6px 0 rgba(0,0,0,0.12)'
        }}
      >
        {/* WhatsApp SVG icon */}
        <svg
          viewBox="0 0 48 48"
          className="w-8 h-8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Phone body */}
          <path
            d="M24 4C13.0 4 4 13.0 4 24c0 3.6 1.0 7.0 2.7 9.9L4 44l10.4-2.7C17.1 42.9 20.4 44 24 44c11.0 0 20-9.0 20-20S35.0 4 24 4z"
            fill="white"
            fillOpacity="0.15"
          />
          <path
            d="M24 4C13.0 4 4 13.0 4 24c0 3.6 1.0 7.0 2.7 9.9L4 44l10.4-2.7C17.1 42.9 20.4 44 24 44c11.0 0 20-9.0 20-20S35.0 4 24 4z"
            fill="white"
          />
          {/* Chat bubble */}
          <path
            d="M35.2 28.5c-.2-.4-1.6-2.5-2.7-3-.6-.3-1-.3-1.4.1-.5.5-1.8 2.1-2.2 2.5-.4.4-.8.5-1.4.2-3.5-1.7-5.8-3.8-7.4-7-.2-.5 0-.8.3-1.1.6-.6 1.2-1.5 1.4-1.8.2-.4.1-.7-.1-1-.2-.4-1.9-4.6-2.6-6.3-.7-1.6-1.4-1.4-1.9-1.4-.5 0-1 0-1.5 0-.5 0-1.4.2-2.1 1C13 12.5 11 14.5 11 18.6c0 4.1 3.1 8.1 3.5 8.6 4 5.8 9.4 9.6 14.3 10.6 2.2.5 4.2.3 5.7-.5 1.7-.9 2.7-2.4 3-3.8.3-1.2.2-2.2 0-2.5-.2-.3-.4-.4-.3-.5z"
            fill="#25D366"
          />
        </svg>
      </span>
    </a>
  );
}
