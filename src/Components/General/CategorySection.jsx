'use strict';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const CategorySection = () => {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category');

  const categories = [
    { 
      id: 'Console', 
      name: 'Consoles', 
      icon: (
        <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-full h-full">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3-3V7.5a3 3 0 0 0-3-3h-9a3 3 0 0 0-3 3v8.25a3 3 0 0 0 3 3m9 0H7.5m9 0a3 3 0 0 0 3-3M7.5 18.75a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v8.25a3 3 0 0 1-3 3M6 10h3m-1.5-1.5v3m6-1.5h.008v.008H13.5V10Zm3 1.5h.008v.008H16.5V11.5Z" />
        </svg>
      )
    },
    { 
      id: 'Accessories', 
      name: 'Accessories', 
      icon: (
        <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-full h-full">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
        </svg>
      )
    },
    { 
      id: 'Phones', 
      name: 'Phones', 
      icon: (
        <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-full h-full">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
        </svg>
      )
    },
    { 
      id: 'TVs', 
      name: 'TVs', 
      icon: (
        <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-full h-full">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-9-3v3m6-3v3M2.25 4.5h19.5c.621 0 1.125.504 1.125 1.125v10.125c0 .621-.504 1.125-1.125 1.125H2.25A1.125 1.125 0 0 1 1 15.75V5.625C1 5.004 1.504 4.5 2.25 4.5Z" />
        </svg>
      )
    },
    { 
      id: 'Digital', 
      name: 'Digital', 
      icon: (
        <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-full h-full">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-12v.75m0 3v.75m0 3v.75m0 3V18M3 6a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 6v12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18V6Z" />
        </svg>
      )
    },
    { 
      id: 'Games', 
      name: 'Games', 
      icon: (
        <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-full h-full">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 3.75H8.25A2.25 2.25 0 0 0 6 6v12a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 18V6a2.25 2.25 0 0 0-2.25-2.25ZM9 9.75h1.5M13.5 9.75H15M9 14.25h6M10.5 6.75V5.25m3 1.5V5.25" />
        </svg>
      )
    },
    { 
      id: 'Pre-owned', 
      name: 'Pre-owned', 
      icon: (
        <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-full h-full">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      )
    },
    { 
      id: 'VR Gear', 
      name: 'VR Gear', 
      icon: (
        <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-full h-full">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5H3M21 12H3m18 4.5H3M21 7.5a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 7.5m18 0v9a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 16.5v-9" />
          <circle cx="7.5" cy="12" r="1.5" stroke="currentColor" strokeWidth={2} />
          <circle cx="16.5" cy="12" r="1.5" stroke="currentColor" strokeWidth={2} />
        </svg>
      )
    },
    { 
      id: 'Merch', 
      name: 'Merch', 
      icon: (
        <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-full h-full">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 21l3.621-1.81A5.25 5.25 0 0 0 15 14.5V11.25M2.25 9.75l4.5-4.5V3H11v2.25l4.5 4.5M21.75 9.75l-4.5-4.5V3H13v2.25l-4.5 4.5m13.25 0H18m0 0v11.25a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25V9.75m12 0h-12" />
        </svg>
      )
    }
  ];

  return (
    <div className="relative w-full bg-white py-1.5 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar touch-pan-x">
        <div className="flex items-center gap-6 md:gap-8 min-w-max py-0.5">
          {categories.map((category) => {
            const isActive = activeCategory === category.id;
            
            return (
              <Link
                key={category.id}
                href={`/?category=${category.id}`}
                prefetch={false}
                onClick={(e) => {
                  if (isActive) {
                    // Deactivates click completely if already selected
                    e.preventDefault();
                    return;
                  }

                  // Runs a smooth scroll to the products display area
                  setTimeout(() => {
                    const target = document.getElementById('product-display');
                    if (target) {
                      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 100);
                }}
                className={`flex items-center gap-1.5 group whitespace-nowrap scroll-ml-4 ${
                  isActive ? 'pointer-events-none' : ''
                }`}
              >
                <div className={`
                  w-7 h-7 p-1.5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-300
                  ${isActive 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-100' 
                    : 'bg-gray-50 border-gray-100 text-indigo-600 group-hover:bg-indigo-50 group-hover:border-indigo-100'
                  }
                `}>
                  {category.icon}
                </div>

                <span className={`
                  font-semibold text-xs transition-all duration-300
                  ${isActive ? 'text-indigo-600' : 'text-gray-600 group-hover:text-indigo-600'}
                `}>
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-white/80 to-transparent pointer-events-none md:hidden" />
      <div className="absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-white/80 to-transparent pointer-events-none md:hidden" />
      
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default CategorySection;
