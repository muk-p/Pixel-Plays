"use client";

import { useState } from "react";
import CodesManager from "@/Components/Manager/Codes";

export default function ManagerCodesPage() {
  const [search, setSearch] = useState("");

  return (
    <>
      <div className="mt-6 mb-8 max-w-md">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search gaming codes..."
            className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-sm shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none"
          />
          <svg className="w-4 h-4 absolute left-4 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CodesManager search={search} />
      </div>
    </>
  );
}
