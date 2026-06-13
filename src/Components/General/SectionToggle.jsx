"use client"; // Required for interactivity and state changes in Next.js

import React from 'react';

const SectionToggle = ({ isGaming, setIsGaming }) => {
  return (
    <div className="flex justify-center py-2">
      <div 
        onClick={() => setIsGaming(!isGaming)}
        className="relative flex w-[300px] h-12 p-1 bg-(--surface-alt) rounded-full cursor-pointer items-center shadow-inner"
      >
        <div 
          className={`absolute h-10 w-[146px] bg-(--surface) rounded-full shadow-md transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            isGaming ? 'translate-x-[144px]' : 'translate-x-0'
          }`} 
        />

        <button className={`relative z-10 flex-1 flex justify-center items-center gap-2 text-[11px] font-black tracking-wider transition-colors duration-300 ${
          !isGaming ? 'text-indigo-600' : 'text-(--muted)'
        }`}>
           SHOPPING
        </button>

        <button className={`relative z-10 flex-1 flex justify-center items-center gap-2 text-[11px] font-black tracking-wider transition-colors duration-300 ${
          isGaming ? 'text-indigo-600' : 'text-(--muted)'
        }`}>
           GAMING CODES
        </button>
      </div>
    </div>
  );
};

export default SectionToggle;
