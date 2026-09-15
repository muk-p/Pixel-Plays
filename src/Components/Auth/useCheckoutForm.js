import { useState, useEffect, useRef } from 'react';
import { useCart } from '../../Context/CartContext'; 
import { useAuth } from '../../Context/AuthContext'; 
import { API_ENDPOINTS } from '../../config/api';

const fetchWithTimeout = async (url, options = {}, timeoutMs = 15000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
};


export const useCheckoutForm = () => {
  const { items, totalPrice, formatCurrency, clearCart } = useCart();
  const { user } = useAuth();
  
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const pollingCleanupRef = useRef(null);

  useEffect(() => () => {
    pollingCleanupRef.current?.();
  }, []);

  const hasHardware = items.some(item => item.category !== 'gaming-codes' && item.category !== 'codes');
  const isDigitalOnly = items.length > 0 && !hasHardware;

  const getAuthToken = () => {
    if (typeof window !== 'undefined') return localStorage.getItem('token') || '';
    return '';
  };

  // FIXED: Dynamic polling tracking utilizing central API configuration mapping definitions
  const startHardwarePolling = (merchantRequestId, timer) => {
    let checkCount = 0;
    const maxChecks = 25; 
    let pollTimer;
    let activeRequestController;
    const cleanup = () => {
      clearTimeout(pollTimer);
      activeRequestController?.abort();
      pollingCleanupRef.current = null;
    };
    pollingCleanupRef.current?.();
    pollingCleanupRef.current = cleanup;

    const poll = async () => {
      checkCount++;
      if (checkCount > maxChecks) {
        cleanup();
        clearTimeout(timer);
        setLoading(false);
        setErrorMessage('Verification timed out. Please check your order management page.');
        return;
      }

      try {
        const token = getAuthToken();
        const requestController = new AbortController();
        activeRequestController = requestController;
        const requestTimeout = setTimeout(() => requestController.abort(), 10000);
        const res = await fetch(`${API_ENDPOINTS.SHOPPING.ORDER_STATUS(merchantRequestId)}?t=${Date.now()}`, {
          headers: { 
            ...(token && { 'Authorization': `Bearer ${token}` }),
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          signal: requestController.signal
        });
        clearTimeout(requestTimeout);
        activeRequestController = null;
        const data = await res.json();

        if (data.status === 'processing' || data.status === 'delivered') {
          cleanup();
          clearTimeout(timer);
          setLoading(false);
          setOrderId(data.orderNumber || data.orderId || merchantRequestId);
          setSuccess(true);
          clearCart();
          setPhone('');
          setAddress('');
        } else if (data.status === 'canceled') {
          cleanup();
          clearTimeout(timer);
          setLoading(false);
          setErrorMessage('❌ Transaction cancelled or declined on your phone handset screen.');
        }
      } catch (err) {
        activeRequestController = null;
        console.error('Hardware polling error:', err);
      }
      if (pollingCleanupRef.current === cleanup) {
        pollTimer = setTimeout(poll, 3000);
      }
    };

    poll();
  };

  // FIXED: Dynamic polling tracking utilizing central API configuration mapping definitions
  const startDigitalPolling = (merchantRequestId, timer) => {
    let checkCount = 0;
    const maxChecks = 25;
    let pollTimer;
    let activeRequestController;
    const cleanup = () => {
      clearTimeout(pollTimer);
      activeRequestController?.abort();
      pollingCleanupRef.current = null;
    };
    pollingCleanupRef.current?.();
    pollingCleanupRef.current = cleanup;

    const poll = async () => {
      checkCount++;
      if (checkCount > maxChecks) {
        cleanup();
        clearTimeout(timer);
        setLoading(false);
        setErrorMessage('Verification timed out. Please check your email.');
        return;
      }

      try {
        const token = getAuthToken();
        const requestController = new AbortController();
        activeRequestController = requestController;
        const requestTimeout = setTimeout(() => requestController.abort(), 10000);
        const res = await fetch(`${API_ENDPOINTS.GAMING.CODE_STATUS(merchantRequestId)}?t=${Date.now()}`, {
        headers: { 
          ...(token && { 'Authorization': `Bearer ${token}` }),
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
          },
          signal: requestController.signal
      });
        clearTimeout(requestTimeout);
        activeRequestController = null;
        const data = await res.json();

        if (data.status === 'completed') {
          cleanup();
          clearTimeout(timer);
          setLoading(false);
          setOrderId(merchantRequestId);
          setSuccess(true);
          clearCart();
          setPhone('');
        } else if (data.status === 'failed') {
          cleanup();
          clearTimeout(timer);
          setLoading(false);
          setErrorMessage('❌ Transaction cancelled or declined on your phone screen.');
        } else if (data.status === 'refund_required') {
          cleanup();
          clearTimeout(timer);
          setLoading(false);
          setErrorMessage('⚠️ Code sold out during payment. Support will issue a refund.');
        }
      } catch (err) {
        activeRequestController = null;
        console.error('Polling error:', err);
      }
      if (pollingCleanupRef.current === cleanup) {
        pollTimer = setTimeout(poll, 3000);
      }
    };

    poll();
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimedOut(false);
    setErrorMessage("");
    setOrderId(null);

    let cleanPhone = phone.trim().replace(/^\+/, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '254' + cleanPhone.substring(1);
    } else if (!cleanPhone.startsWith('254')) {
      cleanPhone = '254' + cleanPhone;
    }

    const token = getAuthToken();
    const paymentTimer = setTimeout(() => {
      pollingCleanupRef.current?.();
      setLoading(false);
      setTimedOut(true);
    }, 60000); 

    try {
      if (isDigitalOnly) {
        // ==========================================
        // ROUTE A: PROCESS DIGITAL CODES
        // ==========================================
        const targetItemId = items[0]?.id || 5; 
        
        // FIXED: Converted to point directly at your configuration variables path mapping helper
        const response = await fetchWithTimeout(`${API_ENDPOINTS.GAMING.PURCHASE}/${targetItemId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify({ mpesaPhone: cleanPhone })
        });

        const data = await response.json();
        if (!response.ok) {
          clearTimeout(paymentTimer);
          setLoading(false);
          setErrorMessage(data.message || 'Failed to trigger payment prompt.');
          return;
        }

        setErrorMessage("🔒 Push prompt sent! Enter your M-Pesa PIN on your phone handset screen.");
        startDigitalPolling(data.merchantRequestId, paymentTimer);

      } else {
        // ==========================================
        // ROUTE B: PROCESS PHYSICAL ITEMS
        // ==========================================
        const orderPayload = {
          items: items.map((item) => ({ productId: Number(item.id), quantity: Number(item.quantity) })),
          customerName: fullName || user?.name || '',
          address: hasHardware ? address : 'Digital Delivery',
          paymentMethod: 'M-PESA',
          mpesaPhone: cleanPhone,
          notes: hasHardware ? `Shipping to ${address}` : 'Digital delivery'
        };

        const response = await fetchWithTimeout(API_ENDPOINTS.SHOPPING.CHECKOUT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify(orderPayload)
        });

        const data = await response.json();

        if (!response.ok) {
          clearTimeout(paymentTimer);
          setLoading(false);
          const validationErrors = data.errors ? data.errors.map(err => err.msg).join(', ') : null;
          setErrorMessage(validationErrors || data.message || 'Could not complete checkout.');
          return;
        }

        if (!data.paymentInitiated || !data.MerchantRequestID) {
          clearTimeout(paymentTimer);
          setLoading(false);
          setErrorMessage(data.message || 'M-Pesa prompt could not be started right now. Your order has been saved and support can help you complete payment.');
          return;
        }

        setErrorMessage("🔒 M-Pesa STK push initiated. Enter your PIN to complete the cargo purchase.");
        startHardwarePolling(data.MerchantRequestID, paymentTimer);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      clearTimeout(paymentTimer);
      setLoading(false);
      setErrorMessage('Network error: Could not reach payment servers.');
    }
  };

  return {
    items, totalPrice, formatCurrency, phone, setPhone, fullName: fullName || user?.name || '', setFullName,
    address, setAddress, loading, timedOut, errorMessage, success, orderId,
    hasHardware, handlePayment
  };
};
