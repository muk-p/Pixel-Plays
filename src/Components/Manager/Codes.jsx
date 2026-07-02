"use client"; // 🚀 CRUCIAL: Enables state, hooks, and browser APIs in Next.js

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import CodesForm from './CodesForm';
import CodesList from './CodesList';
import InventoryModal from './InventoryModal';

const CodesManager = ({ search = '' }) => {
  const [digitalProducts, setDigitalProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [newCodes, setNewCodes] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    region: 'Global',
    platform: 'Mobile',
    description: ''
  });

  // Get auth token for API calls - Wrapped in a Next.js environment check
  const getAuthHeaders = useCallback(() => {
    if (typeof window === 'undefined') return {};
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  // Fetch gaming codes from API
  const fetchGamingCodes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(API_ENDPOINTS.GAMING.CODES, {
        headers: getAuthHeaders()
      });
      setDigitalProducts(response.data);
    } catch (err) {
      console.error('Error fetching gaming codes:', err);
      setError('Failed to load gaming codes. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchGamingCodes();
  }, [fetchGamingCodes]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setError(null);

      const codeData = {
        name: formData.name,
        price: parseFloat(formData.price),
        region: formData.region,
        platform: formData.platform,
        description: formData.description || null
      };

      if (formData.id) {
        // Update existing code
        await axios.put(API_ENDPOINTS.GAMING.UPDATE_CODE(formData.slug || formData.id), codeData, {
          headers: getAuthHeaders()
        });
      } else {
        // Create new code
        await axios.post(API_ENDPOINTS.GAMING.CODES, codeData, {
          headers: getAuthHeaders()
        });
      }

      // Refresh the list
      await fetchGamingCodes();
      setIsEditing(false);
      setFormData({ name: '', price: '', region: 'Global', platform: 'Mobile', description: '' });
    } catch (err) {
      console.error('Error saving gaming code:', err);
      if (err.response?.status === 403) {
        setError('You do not have permission to manage gaming codes.');
      } else if (err.response?.status === 409) {
        setError('A gaming code with this name already exists.');
      } else {
        setError('Failed to save gaming code. Please try again.');
      }
    }
  };

  const handleDelete = async (id) => {
    // Next.js Guard: Avoid running window confirmation modal elements on server pre-build checks
    if (typeof window === 'undefined') return;
    if (!window.confirm("Delete this gaming code? This action cannot be undone.")) {
      return;
    }

    try {
      await axios.delete(API_ENDPOINTS.GAMING.DELETE_CODE(id), {
        headers: getAuthHeaders()
      });
      // Refresh the list
      await fetchGamingCodes();
    } catch (err) {
      console.error('Error deleting gaming code:', err);
      if (err.response?.status === 403) {
        setError('You do not have permission to delete gaming codes.');
      } else if (err.response?.status === 409) {
        setError('Cannot delete gaming code that has been purchased.');
      } else {
        setError('Failed to delete gaming code. Please try again.');
      }
    }
  };

  // Inventory management functions
  const openInventory = async (product) => {
    setSelectedProduct(product);
    try {
      const response = await axios.get(API_ENDPOINTS.GAMING.GET_INVENTORY(product.slug || product.id), {
        headers: getAuthHeaders()
      });
      setInventory(response.data);
      setShowInventory(true);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError('Failed to load inventory. Please try again.');
    }
  };

  const handleAddCodes = async () => {
    if (!newCodes.trim()) {
      setError('Please enter at least one code.');
      return;
    }

    const codes = newCodes.split('\n').map(code => code.trim()).filter(code => code);
    if (codes.length === 0) {
      setError('Please enter at least one valid code.');
      return;
    }

    try {
      setError(null);
      await axios.post(API_ENDPOINTS.GAMING.ADD_INVENTORY(selectedProduct.slug || selectedProduct.id), 
        { codes },
        { headers: getAuthHeaders() }
      );
      
      // Refresh inventory and product list
      await openInventory(selectedProduct);
      await fetchGamingCodes();
      setNewCodes('');
    } catch (err) {
      console.error('Error adding codes:', err);
      if (err.response?.status === 409) {
        setError('Some codes already exist in inventory.');
      } else {
        setError('Failed to add codes. Please try again.');
      }
    }
  };

  const openForm = (product = null) => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name,
        price: product.price.toString(),
        region: product.region,
        platform: product.platform,
        description: product.description || ''
      });
    } else {
      setFormData({ name: '', price: '', region: 'Global', platform: 'Mobile', description: '' });
    }
    setIsEditing(true);
    
    // Next.js Guard: Wrap browser window scrolling effects safely
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  };

  const filteredProducts = digitalProducts.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-xl mx-auto">
        {/* Header - Stacked on mobile, side-by-side on desktop */}
        {!isEditing && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">Digital Codes Manager</h1>
              <p className="text-gray-500 text-xs md:text-sm">Manage UC, Diamonds, and Gift Cards</p>
            </div>
            <button 
              onClick={() => openForm()}
              className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-100"
            >
              + New Item
            </button>
          </div>
        )}

        {isEditing ? (
          <CodesForm
            formData={formData}
            setFormData={setFormData}
            handleSave={handleSave}
            error={error}
            setIsEditing={setIsEditing}
          />
        ) : (
          <CodesList
            filteredProducts={filteredProducts}
            hasProducts={digitalProducts.length > 0}
            loading={loading}
            error={error}
            fetchGamingCodes={fetchGamingCodes}
            openForm={openForm}
            openInventory={openInventory}
            handleDelete={handleDelete}
          />
        )}

        {showInventory && selectedProduct && (
          <InventoryModal
            selectedProduct={selectedProduct}
            inventory={inventory}
            newCodes={newCodes}
            setNewCodes={setNewCodes}
            handleAddCodes={handleAddCodes}
            setShowInventory={setShowInventory}
          />
        )}
      </div>
    </div>
  );
};

export default CodesManager;
