import { contactFormConfig } from '../config';

export function WhatsAppButton() {
  if (!contactFormConfig.whatsappLink) return null;

  return (
    <a
      href={contactFormConfig.whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi kami melalui WhatsApp"
      className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-[#25D366]/20 transition-all duration-300 hover:bg-[#20ba5a] hover:scale-110 hover:shadow-green-500/35 animate-fade-in cursor-pointer"
    >
      <svg
        viewBox="0 0 24 24"
        className="w-7 h-7 fill-current"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.5 1.453 5.457 1.454 5.539 0 10.043-4.507 10.046-10.05.002-2.68-1.038-5.2-2.93-7.093C17.278 1.671 14.76 .63 12.008.631 6.471.631 1.968 5.137 1.965 10.68c-.001 1.96.51 3.878 1.482 5.51l-.97 3.547 3.63-.952zm11.233-5.205c-.3-.15-1.77-.875-2.04-.972-.27-.099-.47-.15-.67.15-.2.3-.77.972-.94 1.17-.18.195-.35.225-.65.075-3.08-1.527-4.14-2.532-5.78-5.362-.18-.3-.02-.465.13-.615.13-.135.3-.35.45-.525.15-.18.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.67-1.62-.92-2.2-.24-.58-.5-.5-.67-.512-.17-.008-.37-.01-.57-.01-.2 0-.52.075-.79.375-.27.3-1.04 1.02-1.04 2.487 0 1.47 1.07 2.887 1.22 3.09 1.5 1.97 3.27 3.62 5.61 4.54.72.28 1.24.45 1.66.58.73.23 1.4.2 1.93.12.58-.087 1.77-.72 2.02-1.38.25-.66.25-1.23.175-1.35-.075-.12-.27-.18-.57-.33z" />
      </svg>
    </a>
  );
}
