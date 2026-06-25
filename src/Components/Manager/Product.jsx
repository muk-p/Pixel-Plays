"use client"; // 🚀 CRUCIAL: Enables state, hooks, and browser APIs in Next.js

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, getImageUrl } from '../../config/api';
import ProductForm from './ProductForm';
import ProductList from './ProductList';

const API_URL = API_ENDPOINTS.SHOPPING.PRODUCTS;

const ProductManager = ({ search = '' }) => {
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const initialFormState = { 
    id: null,
    name: '', 
    brand: '', 
    category: '',
    price: '', 
    old_price: '',
    stock: '', 
    image_url: '', 
    description: '',
    features: [],
    is_hero: false,
    specs: {}, 
    image_file: null 
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  // ADMINISTRATIVE FIX: Parses the newly optimization-grouped categoric arrays
  // and flattens them cleanly for table inventory lists
  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_URL);
      const catalogData = res.data.catalog || [];
      
      // Flatten out the [category, items] matrices back into a direct plain array map
      const flattenedProducts = catalogData.flatMap(([_, items]) => items);
      
      // Maintain chronological list formatting (id ASC) inside your panel list
      const chronologicallySorted = [...flattenedProducts].sort((a, b) => a.id - b.id);
      
      setProducts(chronologicallySorted);
    } catch (err) {
      console.error("Error fetching inventory data:", err);
    }
  };

  const handleImageChange = (e) => {
    // SYSTEM FIX: Safely selects index 0 from either standard clicks or custom clipboard triggers
    const file = e.target?.files?.[0] || e.target?.files?.[0] || e.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, image_file: file }));
    }
  };

  const handleSave = async (e, directData = null) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);

    const activeFormData = directData || formData;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const data = new FormData();
    
    Object.keys(activeFormData).forEach(key => {
      if (key === 'id') return;
      
      if (key === 'image_file') {
        if (activeFormData.image_file) {
          data.append('image', activeFormData.image_file);
        }
      } else if (key === 'image_url') {
        if (!activeFormData.image_file && activeFormData.image_url) {
          data.append('image_url', activeFormData.image_url);
        }
      } else if (key === 'features' || key === 'specs') {
        data.append(key, JSON.stringify(activeFormData[key] || (key === 'features' ? [] : {})));
      } else {
        data.append(key, activeFormData[key] !== null && activeFormData[key] !== undefined ? activeFormData[key] : '');
      }
    });

    try {
      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      if (activeFormData.id) {
        await axios.put(`${API_URL}/${activeFormData.id}`, data, config);
      } else {
        await axios.post(API_URL, data, config);
      }
      
      await fetchProducts();
      closeForm();
    } catch (err) {
      alert(err.response?.data?.message || "Save failed.");
    } finally {
      setLoading(false);
    }
  };

  const openForm = async (product = null) => {
    if (product) {
      let activeProduct = { ...product };

      // SYSTEM FIX: Remove conditional guards to force a deep API fetch 
      // from the single-item (/:id) endpoint every time an item is opened for editing.
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/${product.id}`);
        
        // Dynamic fallback extracts data whether backend responds with { product } or direct object
        activeProduct = res.data.product || res.data;
      } catch (err) {
        console.error("Failed to load deep single product profile info:", err);
        alert("Could not load rich specifications. Editing raw base product from memory cache.");
      } finally {
        setLoading(false);
      }

      let parsedFeatures = [];
      let parsedSpecs = {};

      try {
        parsedFeatures = typeof activeProduct.features === 'string' 
          ? JSON.parse(activeProduct.features || '[]') 
          : (activeProduct.features || []);
      } catch (e) {
        console.warn("Failed to parse product features field:", e);
        parsedFeatures = [];
      }

      try {
        parsedSpecs = typeof activeProduct.specs === 'string' 
          ? JSON.parse(activeProduct.specs || '{}') 
          : (activeProduct.specs || {});
      } catch (e) {
        console.warn("Failed to parse product specs field:", e);
        parsedSpecs = {};
      }

      // Populate form data parameters, explicitly guaranteeing string fallbacks for the description field
      setFormData({
        ...initialFormState,
        ...activeProduct,
        description: activeProduct.description || '', // Safe fallback keeps textarea running cleanly
        features: parsedFeatures,
        specs: parsedSpecs,
        image_file: null 
      });

      const fullUrl = activeProduct.image_url?.startsWith('/uploads') 
        ? getImageUrl(activeProduct.image_url) 
        : activeProduct.image_url;
      setImagePreview(fullUrl);
    } else {
      setFormData(initialFormState);
      setImagePreview(null);
    }
    setIsEditing(true);
  };

  const closeForm = () => {
    setIsEditing(false);
    setFormData(initialFormState);
    setImagePreview(null);
  };

  const toggleHero = async (product) => {
    setLoading(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const data = new FormData();
    const newHeroStatus = !product.is_hero;

    Object.keys(product).forEach(key => {
      if (key === 'is_hero') {
        data.append(key, newHeroStatus);
      } else if (key === 'features' || key === 'specs') {
        const value = typeof product[key] === 'string' ? JSON.parse(product[key]) : product[key];
        data.append(key, JSON.stringify(value || (key === 'features' ? [] : {})));
      } else if (key === 'image_url') {
        data.append(key, product[key] || '');
      } else {
        data.append(key, product[key] !== null && product[key] !== undefined ? product[key] : '');
      }
    });

    try {
      await axios.put(`${API_URL}/${product.id}`, data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      await fetchProducts();
    } catch (err) {
      console.error("Failed to toggle Hero status", err);
      alert("Could not update Hero status.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (typeof window === 'undefined') return;
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.delete(`${API_URL}/${id}`, config);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert("Delete failed.");
    }
  };

  // PERFORMANCE PERFORMANCE CACHE: Stops text filtering from dropping mobile input frame rates
  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return products;
    return products.filter(product =>
      (product.name || '').toLowerCase().includes(query)
    );
  }, [products, search]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900">Inventory Management</h1>
          {!isEditing && (
            <button 
              onClick={() => openForm()}
              className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-transform cursor-pointer"
            >
              + Post New Product
            </button>
          )}
        </div>

        {isEditing ? (
          <ProductForm
            formData={formData}
            setFormData={setFormData}
            imagePreview={imagePreview}
            handleImageChange={handleImageChange}
            handleSave={handleSave}
            loading={loading}
            closeForm={closeForm}
          />
        ) : (
          <ProductList
            filteredProducts={filteredProducts}
            productCount={products.length}
            openForm={openForm}
            handleDelete={handleDelete}
            toggleHero={toggleHero}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default ProductManager;
