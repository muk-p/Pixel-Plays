'use client';

import { useState } from 'react';

const SUPPORT_PHONE = '+254794966733';
const SALES_PHONE = '+254795040185';

const buildWhatsAppUrl = (phone, message = 'Hello Pixel Plays, I need help.') => {
  const digits = phone.replace(/\D/g, '');
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${encodedMsg}`;
};

const ContactStrip = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside
      aria-label="WhatsApp Support & Sales"
      className="fixed right-3 top-1/2 z-[130] -translate-y-1/2 sm:right-4"
    >
      <div
        className={`overflow-hidden border border-green-200/80 bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-[0_16px_45px_rgba(16,185,129,0.32)] transition-all duration-300 ease-out ${
          isOpen
            ? 'w-[min(88vw,16rem)] rounded-2xl'
            : 'h-13 w-13 rounded-full sm:h-auto sm:w-max sm:rounded-2xl'
        }`}
      >
        {/* Toggle Button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls="whatsapp-menu"
          className="flex h-full w-full items-center justify-center gap-2 p-2.5 text-left font-semibold transition hover:scale-[1.02] active:scale-[0.97] sm:justify-between sm:px-3.5 sm:py-2.5"
        >
          <span className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 p-1.5 shadow-sm sm:h-auto sm:w-auto sm:p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5 sm:h-4 sm:w-4"
                aria-hidden="true"
              >
                <path d="M12.04 2.5A9.54 9.54 0 0 0 3.4 11.58c0 1.68.44 3.3 1.27 4.72L2.5 21.5l5.34-1.4a9.53 9.53 0 0 0 4.2 1.02h.01c5.27 0 9.54-4.27 9.54-9.54A9.54 9.54 0 0 0 12.04 2.5Zm0 17.34h-.01a7.8 7.8 0 0 1-3.95-1.1l-.28-.17-3.17.83.85-3.08-.18-.3a7.8 7.8 0 0 1-1.22-4.17c0-4.31 3.5-7.81 7.81-7.81a7.8 7.8 0 0 1 7.81 7.81c0 4.31-3.5 7.81-7.81 7.81Zm4.3-5.86c-.24-.12-1.41-.69-1.63-.77-.22-.08-.38-.12-.54.12-.16.24-.62.77-.76.93-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.19-.71-.64-1.19-1.42-1.33-1.66-.14-.24-.015-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.41-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2.01 0 1.19.86 2.33.98 2.49.12.16 1.7 2.6 4.13 3.55.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.41-.58 1.61-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
              </svg>
            </span>
            <span className={`text-xs sm:inline sm:text-sm ${isOpen ? 'inline' : 'hidden'}`}>
              Chat
            </span>
          </span>

          <span
            className={`font-black transition-transform duration-300 ${
              isOpen ? 'inline rotate-45 text-lg sm:text-xl' : 'hidden text-xl sm:inline'
            }`}
            aria-hidden="true"
          >
            +
          </span>
        </button>

        {/* Expandable Menu */}
        <div
          id="whatsapp-menu"
          aria-hidden={!isOpen}
          className={`grid transition-all duration-300 ease-in-out ${
            isOpen ? 'grid-rows-[1fr] opacity-100 p-2.5 pt-0' : 'grid-rows-[0fr] opacity-0 p-0'
          }`}
        >
          <div className="space-y-2 overflow-hidden">
            {/* Header Badge */}
            <div className="flex items-center gap-2.5 rounded-2xl border border-white/20 bg-white/10 p-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-black shadow-inner sm:text-sm">
                PP
              </div>
              <div>
                <p className="text-xs font-black sm:text-sm">Pixel Plays</p>
                <p className="text-[10px] text-green-50/90 sm:text-[11px]">Support & sales team</p>
              </div>
            </div>

            {/* Support Link */}
            <a
              href={buildWhatsAppUrl(SUPPORT_PHONE, 'Hello Pixel Plays, I need support assistance.')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-white/20 bg-white/10 px-2.5 py-2 text-xs font-semibold text-white transition hover:bg-white/20 sm:px-3 sm:py-2.5 sm:text-sm"
            >
              <span>Support</span>
              <span className="text-[10px] opacity-90 sm:text-xs">{SUPPORT_PHONE}</span>
            </a>

            {/* Sales Link */}
            <a
              href={buildWhatsAppUrl(SALES_PHONE, 'Hello Pixel Plays, I have a sales inquiry.')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-white/20 bg-white/10 px-2.5 py-2 text-xs font-semibold text-white transition hover:bg-white/20 sm:px-3 sm:py-2.5 sm:text-sm"
            >
              <span>Sales</span>
              <span className="text-[10px] opacity-90 sm:text-xs">{SALES_PHONE}</span>
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ContactStrip;