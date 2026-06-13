'use strict';

const ContactStrip = () => {
  return (
    <div className="w-full bg-indigo-600 text-white py-1.5 px-3 text-[11px] sm:text-xs font-medium border-b border-indigo-500 whitespace-nowrap overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left Side Phone Number */}
        <a 
          href="tel:+254794966733" 
          className="flex items-center gap-1.5 hover:text-indigo-100 transition-colors duration-200 flex-shrink-0"
        >
          <svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 flex-shrink-0 opacity-90">
            <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c1.353 2.8 3.594 5.04 6.39 6.39l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
          </svg>
          <span><span className="hidden xs:inline">Support: </span>+254 794 966 733</span>
        </a>

        {/* Center Label */}
        <span className="hidden md:inline text-indigo-200 text-[11px] uppercase tracking-wider font-semibold truncate px-2">
          Pixel Plays: Your Gateway to Gaming in Kenya
        </span>

        {/* Right Side Phone Number */}
        <a 
          href="tel:+254795040185" 
          className="flex items-center gap-1.5 hover:text-indigo-100 transition-colors duration-200 flex-shrink-0"
        >
          <svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 flex-shrink-0 opacity-90">
            <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c1.353 2.8 3.594 5.04 6.39 6.39l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
          </svg>
          <span><span className="hidden xs:inline">Sales: </span>+254 795 040 185</span>
        </a>

      </div>
    </div>
  );
};

export default ContactStrip;
