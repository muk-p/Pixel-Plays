"use client"; // Marked for execution within Next.js interactive form layouts

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getImageUrl } from '../../config/api';
import { isRemoteImageSource } from '../../config/ImageLoader';

const ProductForm = ({
  formData,
  setFormData,
  imagePreview,
  handleImageChange,
  handleSave,
  loading,
  closeForm
}) => {
  // Local string buffers to prevent input resetting or jumping while typing commas
  const [featuresString, setFeaturesString] = useState("");
  const [specsString, setSpecsString] = useState("");

  // Populate localized string fields when the editing form mounts or changes products
  useEffect(() => {
    if (formData.features && Array.isArray(formData.features)) {
      setFeaturesString(formData.features.join(', '));
    } else {
      setFeaturesString("");
    }

    if (formData.specs && typeof formData.specs === 'object') {
      const parsedPairs = Object.entries(formData.specs)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
      setSpecsString(parsedPairs);
    } else {
      setSpecsString("");
    }
  }, [formData.id, formData.slug, formData.features, formData.specs]); 

  // Intercept form submit to pack local string inputs back into clean structural parameters
  const previewSrc = imagePreview ? getImageUrl(imagePreview) : null;
  const useUnoptimizedPreview = Boolean(previewSrc && isRemoteImageSource(previewSrc));

  const handleSubmitIntercept = (e) => {
    e.preventDefault();

    // Clean up features text into an array
    const finalFeatures = featuresString
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== "");

    // Clean up specs text into a valid JSON object structure
    const finalSpecs = {};
    specsString.split(',').forEach(pair => {
      const parts = pair.split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join(':').trim(); // Handles cases with URLs or extra colons gracefully
        if (key && value) finalSpecs[key] = value;
      }
    });

    // Update the parent state right before triggering the API post action
    const updatedData = {
      ...formData,
      features: finalFeatures,
      specs: finalSpecs
    };

    // Update state and immediately pass the data onwards to prevent state sync latency delays
    setFormData(updatedData);

    // Call your existing handleSave logic using the direct updatedData payload
    handleSave(e, updatedData);
  };

  return (
    <form 
      onSubmit={handleSubmitIntercept} 
      // CRUCIAL ADDITION: Catches clipboard image paste actions anywhere inside the form window
      onPaste={(e) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            if (file) {
              // Update the frontend visual preview box immediately
              handleImageChange({ target: { files: [file] } });
            }
          }
        }
      }}
      className="bg-white rounded-4xl p-5 md:p-8 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        
        {/* Left Side: Image Upload & Long-form Description Layout */}
        <div className="flex flex-col gap-6">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Product Image</label>
            <div className="mt-2 border-2 border-dashed border-gray-200 rounded-4xl aspect-square flex flex-col items-center justify-center p-2 relative overflow-hidden bg-gray-50">
              {imagePreview ? (
                <div className="w-full h-full relative">
                  <Image 
                    src={previewSrc} 
                    className="object-contain" 
                    alt="Preview UI upload stream visual illustration frame layout" 
                    fill
                    sizes="(max-w-7xl) 50vw, 33vw"
                    unoptimized={useUnoptimizedPreview}
                  />
                </div>
              ) : (
                <div className="text-center p-4">
                  <p className="text-gray-400 text-xs font-bold">Click or drag to upload</p>
                </div>
              )}
              <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Description</label>
            <textarea 
              placeholder="Enter full, engaging product description..." rows="6" required
              className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none text-sm font-medium mt-1 transition-all"
              value={formData.description || ''} 
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
        </div>

        {/* Right Side: Controlled Fields */}
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 block mb-1">General Info</label>
            <input 
              type="text" placeholder="Product Name" required
              className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none font-bold transition-all"
              value={formData.name || ''} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <input 
            type="text" placeholder="Brand Name" required
            className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none font-bold transition-all"
            value={formData.brand || ''} 
            onChange={(e) => setFormData({...formData, brand: e.target.value})}
          />
          
          <input 
            type="text" placeholder="Category"
            className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none font-bold transition-all"
            value={formData.category || ''} 
            onChange={(e) => setFormData({...formData, category: e.target.value})} 
          />

          {/* URL Slug Management Control Row */}
          <div>
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider ml-2 block mb-1">URL Slug</label>
            <input 
              type="text" 
              placeholder="e.g. wireless-headphones (Optional)"
              className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none font-medium text-xs text-gray-600 lowercase"
              value={formData.slug || ''} 
              onChange={(e) => setFormData({
                ...formData, 
                slug: e.target.value.toLowerCase().replace(/\s+/g, '-')
              })} 
            />
            <p className="text-[9px] text-slate-400 mt-1 ml-2 font-medium">
              Leave blank to automatically auto-generate a slug from the product name.
            </p>
          </div>

          {/* Pricing & Stock Configuration Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider ml-2">Price</label>
              <input 
                type="number" placeholder="Price" required step="0.01" min="0"
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none font-bold mt-1"
                value={formData.price || ''} 
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider ml-2">Old Price</label>
              <input 
                type="number" placeholder="Old Price" step="0.01" min="0"
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none font-bold mt-1"
                value={formData.old_price || ''} 
                onChange={(e) => setFormData({...formData, old_price: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider ml-2">Qty</label>
              <input 
                type="number" placeholder="Qty" required min="0"
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none font-bold mt-1"
                value={formData.stock || ''} 
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
              />
            </div>
          </div>

          {/* Bulk Specification Array Textareas */}
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Features</label>
            <textarea 
              placeholder="Features (comma separated: 4K Ultra HD, Wireless, 1TB Storage)" rows="3"
              className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none text-sm font-medium mt-1 transition-all"
              value={featuresString || ''} 
              onChange={(e) => setFeaturesString(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Specifications</label>
            <textarea 
              placeholder="Specs (comma separated pairs — e.g., CPU: Intel i9, RAM: 32GB)" rows="4"
              className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none text-sm font-medium mt-1 transition-all"
              value={specsString || ''}
              onChange={(e) => setSpecsString(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Button Action Block */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button 
          type="submit" 
          disabled={loading}
          className="order-1 sm:order-2 flex-2 flex items-center justify-center min-h-15 bg-green-600 text-white rounded-2xl font-bold shadow-lg active:scale-95 disabled:bg-gray-300 transition-all"
        >
          {loading ? "Processing..." : (formData.id ? 'Update Product' : 'Confirm & Post')}
        </button>

        <button 
          type="button" 
          onClick={closeForm} 
          className="order-2 sm:order-1 flex-1 min-h-15 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
