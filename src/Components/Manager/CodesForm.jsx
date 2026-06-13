"use client"; // 🚀 Ensures proper element events tracking inside Next.js layout structures

import React from 'react';

const CodesForm = ({
  formData,
  setFormData,
  handleSave,
  error,
  setIsEditing
}) => {
  return (
    <form onSubmit={handleSave} className="bg-(--surface) rounded-3xl p-6 md:p-8 border border-(--border) shadow-sm animate-in fade-in zoom-in-95 duration-200">
      <h2 className="text-lg font-bold mb-6 text-foreground">
        {formData.id ? 'Edit Gaming Code' : 'Add New Gaming Code'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="text-[10px] font-black text-(--muted) uppercase ml-2 mb-1 block tracking-wider">Product Name</label>
          <input
            type="text"
            placeholder="e.g. PUBG Mobile 660 UC"
            required
            className="w-full p-4 bg-(--surface-alt) rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-(--surface) transition-all outline-none font-bold text-foreground placeholder:text-(--muted)"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        {/* First Row: Price and Platform inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block tracking-wider">Price (KES)</label>
            <input
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              required
              className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none font-bold"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-(--muted) uppercase ml-2 mb-1 block tracking-wider">Platform</label>
            <select
              className="w-full p-4 bg-(--surface-alt) rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-(--surface) outline-none font-bold appearance-none text-foreground"
              value={formData.platform}
              onChange={(e) => setFormData({...formData, platform: e.target.value})}
            >
              <option>Mobile</option>
              <option>PC</option>
              <option>PS5</option>
              <option>Xbox</option>
              <option>Nintendo</option>
            </select>
          </div>
        </div>

        {/* Second Row: Region input alone (duplicate dropdown block removed layout bug) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block tracking-wider">Region</label>
            <select
              className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none font-bold appearance-none"
              value={formData.region}
              onChange={(e) => setFormData({...formData, region: e.target.value})}
            >
              <option>Global</option>
              <option>USA</option>
              <option>India</option>
              <option>Europe</option>
              <option>Asia</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-(--muted) uppercase ml-2 mb-1 block tracking-wider">Description (Optional)</label>
          <textarea
            placeholder="Describe the gaming code, usage instructions, etc."
            rows="3"
            className="w-full p-4 bg-(--surface-alt) rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-(--surface) transition-all outline-none font-bold resize-none text-foreground placeholder:text-(--muted)"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-xl active:bg-indigo-700 transition-all">
            {formData.id ? 'Update Gaming Code' : 'Add Gaming Code'}
          </button>
          <button type="button" onClick={() => setIsEditing(false)} className="w-full text-(--muted) py-3 font-bold text-sm">
            Cancel and Go Back
          </button>
        </div>
      </div>
    </form>
  );
};

export default CodesForm;
