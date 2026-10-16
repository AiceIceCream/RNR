import React, { useState, useEffect, useMemo } from 'react';
import emailjs from '@emailjs/browser';
import { INITIAL_PRODUCTS, SHIPPING_RATES } from './src/initialData';
import './Store.css';

export function RnrLogo({ size = 42, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="RNR OnlineShop Logo"
    >
      {/* Left faceted structure */}
      <polygon points="12,148 38,148 38,36 12,62" fill="#E2DFD8" />
      <polygon points="38,148 68,148 68,66 38,36" fill="#EDE9E2" />
      <polygon points="12,62 38,36 68,66 42,92" fill="#D5D0C6" opacity="0.65" />
      <polygon points="38,36 68,66 68,12 38,12" fill="#F4F1EA" opacity="0.8" />

      {/* Top center inverted triangle */}
      <polygon points="56,12 104,12 80,40" fill="#F8AC9A" />

      {/* Right 3 ascending coral-vermilion bars */}
      {/* Bar 1 (short, peach coral) */}
      <polygon points="76,148 100,148 100,74 76,98" fill="#FA9E87" />

      {/* Bar 2 (mid, bright coral) */}
      <polygon points="105,148 129,148 129,44 105,68" fill="#FA603B" />

      {/* Bar 3 (tallest, radiant vermilion) */}
      <polygon points="134,148 158,148 158,12 134,36" fill="#EE3E1C" />
    </svg>
  );
}

const PRESET_COLORS = [
  { name: 'Black', hex: '#111827' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Navy Blue', hex: '#1E3A8A' },
  { name: 'Royal Blue', hex: '#2563EB' },
  { name: 'Crimson Red', hex: '#DC2626' },
  { name: 'Emerald Green', hex: '#059669' },
  { name: 'Heather Gray', hex: '#6B7280' },
  { name: 'Olive Green', hex: '#4D7C0F' },
  { name: 'Amber Gold', hex: '#D97706' },
  { name: 'Coral Pink', hex: '#F43F5E' },
];

const LOCAL_STORAGE_KEYS = {
  PRODUCTS: 'rnr_store_products_v11',
  ORDERS: 'rnr_store_orders_v11',
  CART: 'rnr_store_cart_v11',
};

export const EMAILJS_HTML_TEMPLATE = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: #141312; padding: 24px 8px; background-color: #F9F8F6;">
  <div style="max-width: 600px; margin: auto; background-color: #FFFFFF; border: 1px solid #E8E5DF; border-radius: 6px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
    <!-- Top Vermilion Brand Bar -->
    <div style="border-top: 6px solid #EE3E1C; padding: 18px 24px 14px; background: #FFFFFF; border-bottom: 1px solid #F0ECE1;">
      <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
        <tr>
          <td style="vertical-align: middle;">
            <div style="display: inline-block; vertical-align: middle; margin-right: 12px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background: #141312; color: #FFFFFF; font-family: 'Arial Black', Arial, sans-serif; font-size: 16px; font-weight: 900; padding: 6px 10px; border-radius: 4px; letter-spacing: 1px;">
                    RNR<span style="color: #EE3E1C;">.</span>PH
                  </td>
                </tr>
              </table>
            </div>
            <span style="font-size: 16px; vertical-align: middle; border-left: 2px solid #EE3E1C; padding-left: 10px; color: #141312; font-weight: 800; letter-spacing: 0.02em;">
              Order Confirmation &amp; Official Receipt
            </span>
          </td>
        </tr>
      </table>
    </div>

    <!-- Body Container -->
    <div style="padding: 24px;">
      <p style="margin-top: 0; font-size: 14px; line-height: 1.6; color: #333333;">
        Dear <strong>{{to_name}}</strong>,<br />
        Thank you for your order with <strong>RNR OnlineShop</strong>. Your payment has been verified by our team and your gear is being prepared for dispatch.
      </p>

      <!-- Order ID & Receipt Number Bar -->
      <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-bottom: 2px solid #141312; padding-bottom: 8px; margin-bottom: 14px;">
        <tr>
          <td style="font-size: 14px; font-weight: 800; color: #141312;">
            ORDER # {{order_id}}
          </td>
          <td style="text-align: right; font-size: 12px; font-weight: 700; color: #EE3E1C;">
            {{receipt_number}}
          </td>
        </tr>
      </table>

      <!-- Order Summary & Delivery Meta Box -->
      <div style="background-color: #F8F7F4; border: 1px solid #E8E5DF; padding: 12px 14px; border-radius: 4px; margin-bottom: 20px; font-size: 12px; line-height: 1.6; color: #444444;">
        <div><strong>Recipient:</strong> {{to_name}} • {{customer_phone}}</div>
        <div><strong>Delivery Address:</strong> {{customer_address}}</div>
        <div><strong>Payment Method:</strong> {{payment_method}} (Ref: {{payment_ref}})</div>
      </div>

      <!-- Items Section (EmailJS Dynamic Loop) -->
      {{#orders}}
      <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-bottom: 1px solid #F0ECE1;">
        <tr style="vertical-align: middle;">
          <td style="padding: 14px 10px 14px 0; width: 64px;">
            <img style="width: 58px; height: 58px; object-fit: cover; border-radius: 4px; border: 1px solid #E8E5DF; display: block;" src="{{image_url}}" alt="item" />
          </td>
          <td style="padding: 14px 10px; width: 100%;">
            <div style="font-weight: 700; color: #141312; font-size: 13px; line-height: 1.4;">{{name}}</div>
            <div style="font-size: 12px; color: #777777; margin-top: 4px;">QTY: <strong>{{units}}</strong></div>
          </td>
          <td style="padding: 14px 0 14px 10px; white-space: nowrap; text-align: right;">
            <strong style="font-size: 14px; color: #141312;">₱{{price}}</strong>
          </td>
        </tr>
      </table>
      {{/orders}}

      <!-- Cost Breakdown Table -->
      <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; text-align: right; margin-top: 18px; font-size: 13px;">
        <tr>
          <td style="width: 55%;"></td>
          <td style="color: #666666; padding: 6px 10px;">Subtotal Shipping:</td>
          <td style="padding: 6px 0 6px 10px; white-space: nowrap; font-weight: 600; color: #141312;">₱{{cost.shipping}}</td>
        </tr>
        <tr>
          <td style="width: 55%;"></td>
          <td style="color: #666666; padding: 6px 10px;">Taxes / VAT:</td>
          <td style="padding: 6px 0 6px 10px; white-space: nowrap; color: #059669; font-weight: 600;">{{cost.tax}}</td>
        </tr>
        <tr>
          <td style="width: 55%;"></td>
          <td style="border-top: 2px solid #141312; padding: 14px 10px 8px;">
            <strong style="font-size: 15px; color: #141312;">Total Paid:</strong>
          </td>
          <td style="border-top: 2px solid #141312; padding: 14px 0 8px 10px; white-space: nowrap;">
            <strong style="font-size: 18px; color: #EE3E1C;">₱{{cost.total}}</strong>
          </td>
        </tr>
      </table>

      <!-- Courier Dispatch & Tracking Banner -->
      <div style="margin-top: 24px; background: #EFF6FF; border: 1.5px solid #3B82F6; border-radius: 6px; padding: 16px; text-align: center;">
        <div style="font-size: 11px; font-weight: 800; color: #1E40AF; text-transform: uppercase; letter-spacing: 0.05em;">
          🚚 Courier Dispatch &amp; Real-Time Tracking
        </div>
        <p style="font-size: 12px; color: #1E3A8A; margin: 8px 0 12px; line-height: 1.5;">
          Once handed over to our courier, you can track your parcel live to your doorstep.
        </p>
        <a href="{{tracking_url}}" target="_blank" style="display: inline-block; background: #1E40AF; color: #FFFFFF; font-weight: 800; font-size: 12px; text-decoration: none; padding: 10px 22px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.05em;">
          Track Your Parcel Online →
        </a>
      </div>
    </div>
  </div>

  <!-- Email Footer -->
  <div style="max-width: 600px; margin: 20px auto 0; text-align: center;">
    <p style="color: #888888; font-size: 11px; line-height: 1.6; margin: 0;">
      This email was sent to <strong>{{email}}</strong> regarding your order at <strong>RNR OnlineShop</strong>.<br />
      High-Performance Sportswear &amp; Cycling Apparel • Official Store<br />
      Need assistance? Contact our dispatch desk at <strong>orders@rnr-onlineshop.ph</strong>
    </p>
  </div>
</div>`;

// Cycling Models (Bike1 and Bike2) for Editorial Homepage Campaign
const MODEL_POSES = {
  bike1: {
    id: 'bike1',
    title: 'Bike 1: Road Aero Pace',
    tag: 'High-Velocity Aero Cycling Jersey',
    portrait: '/Photocards/Bike1.jpeg',
    hero: '/Photocards/Bike2.jpeg',
    desc: 'Engineered aero-cut performance cycling jersey designed for coastal road climbs and high-speed pacelines.'
  },
  bike2: {
    id: 'bike2',
    title: 'Bike 2: Coastal Endurance',
    tag: 'Breathable Gradient Ride Kit',
    portrait: '/Photocards/Bike2.jpeg',
    hero: '/Photocards/Bike1.jpeg',
    desc: 'Breathable dual-blend endurance cycling kit tailored for long-distance training and panoramic summit rides.'
  }
};

export default function StoreApp() {
  // State initialization with localStorage
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 20 && parsed[0]?.title === 'Maroon Gold Athletic Dri-FIT Tee') {
          return parsed;
        }
      }
    } catch (e) {}
    localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  });

  // UI state
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedColors, setSelectedColors] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [previewImageIdx, setPreviewImageIdx] = useState(0);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminTab, setAdminTab] = useState('orders'); // 'orders' | 'inventory'
  const [productToDelete, setProductToDelete] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [toast, setToast] = useState(null);

  // Review Form state
  const [revName, setRevName] = useState('');
  const [revEmail, setRevEmail] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');

  // Admin login credentials (admin / admin12345)
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Checkout inputs
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [shippingRegion, setShippingRegion] = useState('standard_delivery');
  const [paymentMethod, setPaymentMethod] = useState('gcash'); // 'gcash' | 'bank'
  const [gcashRefNumber, setGcashRefNumber] = useState('');
  const [bankRefNumber, setBankRefNumber] = useState('');
  const [activeEmailModal, setActiveEmailModal] = useState(null);
  const [dispatchModalOrder, setDispatchModalOrder] = useState(null);
  const [dispatchCourier, setDispatchCourier] = useState('RNT Express');
  const [dispatchTrackingNum, setDispatchTrackingNum] = useState('');

  // Customer order tracking state
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [trackOrderQuery, setTrackOrderQuery] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [trackSearched, setTrackSearched] = useState(false);

  // Homepage editorial & model pose state (Bike1 and Bike2 Models)
  const [modelPose, setModelPose] = useState('bike1');

  // Smooth redirect to store catalog
  const handleShopNow = () => {
    setIsAdminView(false);
    const el = document.getElementById('store-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategoryJump = (catName) => {
    setIsAdminView(false);
    setActiveCategory(catName);
    const el = document.getElementById('store-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Customer tracking search handler (matches Order ID, Waybill, or Payment Reference)
  const handleTrackOrderSearch = (codeToSearch) => {
    const raw = (codeToSearch !== undefined ? codeToSearch : trackOrderQuery) || '';
    const query = raw.trim().toLowerCase();
    setTrackSearched(true);
    if (!query) {
      setTrackedOrder(null);
      return;
    }

    const cleanQuery = query.replace(/[^a-z0-9]/gi, '');
    const found = orders.find(ord => {
      const oId = (ord.orderId || '').toLowerCase();
      const cleanOId = oId.replace(/[^a-z0-9]/gi, '');
      const waybill = (ord.dispatch?.trackingNumber || '').toLowerCase();
      const cleanWaybill = waybill.replace(/[^a-z0-9]/gi, '');
      const gcashRef = (ord.payment?.gcashRefNumber || '').toLowerCase();
      const bankRef = (ord.payment?.bankRefNumber || '').toLowerCase();

      return oId === query ||
             cleanOId === cleanQuery ||
             (cleanQuery.length >= 4 && cleanOId.endsWith(cleanQuery)) ||
             (waybill && (waybill === query || cleanWaybill === cleanQuery)) ||
             (gcashRef && gcashRef === query) ||
             (bankRef && bankRef === query);
    });

    setTrackedOrder(found || null);
  };

  // EmailJS & Real Gmail Delivery configuration
  const [emailConfig, setEmailConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('rnr_emailjs_config_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          serviceId: parsed.serviceId || 'service_q87wozk',
          publicKey: parsed.publicKey || 'sFrMt_DI_Ca-c84FX',
          receiptTemplateId: parsed.receiptTemplateId || 'template_nzrxl0m',
          dispatchTemplateId: parsed.dispatchTemplateId || 'template_nzrxl0m',
        };
      }
    } catch (e) {}
    return {
      serviceId: import.meta.env?.VITE_EMAILJS_SERVICE_ID || 'service_q87wozk',
      publicKey: import.meta.env?.VITE_EMAILJS_PUBLIC_KEY || 'sFrMt_DI_Ca-c84FX',
      receiptTemplateId: import.meta.env?.VITE_EMAILJS_RECEIPT_TEMPLATE_ID || 'template_nzrxl0m',
      dispatchTemplateId: import.meta.env?.VITE_EMAILJS_DISPATCH_TEMPLATE_ID || 'template_nzrxl0m',
    };
  });
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [testEmailStatus, setTestEmailStatus] = useState(null);
  const [showEmailTemplateCode, setShowEmailTemplateCode] = useState(false);

  const handleSaveEmailConfig = (e) => {
    e.preventDefault();
    localStorage.setItem('rnr_emailjs_config_v1', JSON.stringify(emailConfig));
    showToast('✓ EmailJS configuration saved! Real email delivery updated.');
  };

  // Helper to send real emails to Gmail inboxes via EmailJS (ADMIN-ONLY RESPONSIBILITY)
  const sendRealEmail = async ({ templateId, templateParams }) => {
    if (!isAdminLoggedIn) {
      return {
        success: false,
        reason: 'UNAUTHORIZED',
        error: 'Email dispatch is restricted to authenticated administrators only.',
      };
    }
    const sId = emailConfig.serviceId?.trim();
    const pKey = emailConfig.publicKey?.trim();
    const tId = templateId?.trim();

    if (!sId || !pKey || !tId) {
      return { success: false, reason: 'NOT_CONFIGURED', error: 'EmailJS keys incomplete. Configure in Admin -> Email Delivery.' };
    }

    try {
      const res = await emailjs.send(sId, tId, templateParams, pKey);
      return { success: true, response: res };
    } catch (err) {
      console.error('EmailJS Send Error:', err);
      const errMsg = err?.text || err?.message || 'EmailJS service error';
      return { success: false, error: errMsg };
    }
  };

  const handleSendTestEmail = async (e) => {
    e.preventDefault();
    if (!testEmailAddress.trim()) {
      setTestEmailStatus({ type: 'error', msg: 'Please enter a valid Gmail address to test.' });
      return;
    }
    const templateId = emailConfig.receiptTemplateId?.trim() || emailConfig.dispatchTemplateId?.trim();
    if (!emailConfig.serviceId?.trim() || !emailConfig.publicKey?.trim() || !templateId) {
      setTestEmailStatus({
        type: 'error',
        msg: 'Please enter and save Service ID, Public Key, and at least one Template ID before testing.'
      });
      return;
    }

    setIsSendingTestEmail(true);
    setTestEmailStatus(null);

    const testParams = {
      email: testEmailAddress.trim(),
      to_email: testEmailAddress.trim(),
      to_name: 'Test Customer',
      subject: 'Order Confirmation — RNR OnlineShop Order #RNR-TEST-001',
      order_id: 'RNR-TEST-001',
      receipt_number: 'RCPT-TEST-001',
      orders: [
        {
          name: 'Maroon Gold Athletic Dri-FIT Tee (M • Black)',
          units: 1,
          price: '850',
          image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=60'
        },
        {
          name: 'Aero Pro Ergonomic Cycling Socks (L • White)',
          units: 2,
          price: '400',
          image_url: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=200&auto=format&fit=crop&q=60'
        }
      ],
      cost: {
        shipping: '80',
        tax: '0 (VAT Inclusive)',
        total: '1,330'
      },
      payment_method: 'GCASH',
      payment_ref: '1029384756102',
      total_amount: '₱1,330',
      items_summary: 'Maroon Gold Athletic Dri-FIT Tee (M • Black) x1, Aero Pro Socks x2',
      customer_address: 'RNR Sportswear Center, Cagayan de Oro City',
      customer_phone: '0917-889-1024',
      tracking_url: 'https://track.rnr-onlineshop.ph/?ref=RNT-98124801',
      courier: 'RNT Express',
      tracking_number: 'RNT-98124801',
      date: new Date().toLocaleDateString(),
      message: 'Thank you for choosing RNR OnlineShop! Your payment has been verified by our operations team.'
    };

    const res = await sendRealEmail({ templateId, templateParams: testParams });
    setIsSendingTestEmail(false);

    if (res.success) {
      setTestEmailStatus({
        type: 'success',
        msg: `✓ Email successfully transmitted to ${testEmailAddress.trim()}! Please check your Gmail Inbox and Spam folder.`
      });
      showToast(`✓ Test email delivered to ${testEmailAddress.trim()}!`);
    } else {
      setTestEmailStatus({
        type: 'error',
        msg: `❌ EmailJS Error: ${res.error}. Please check your Service ID, Public Key, or Template ID.`
      });
    }
  };

  // Admin new product
  const [newProdTitle, setNewProdTitle] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Tees');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdFabric, setNewProdFabric] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [imageUploadType, setImageUploadType] = useState('device'); // 'device' | 'url'
  const [newProdImages, setNewProdImages] = useState([]);
  const [newProdImageUrl, setNewProdImageUrl] = useState('');
  const [newProdColors, setNewProdColors] = useState([
    { name: 'Black', hex: '#111827' },
    { name: 'White', hex: '#FFFFFF' }
  ]);
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#2563EB');
  const [newProdStock, setNewProdStock] = useState({ S: 5, M: 8, L: 6, XL: 3 });

  // Toggle admin preset color
  const handleTogglePresetColor = (preset) => {
    setNewProdColors(prev => {
      const exists = prev.some(c => c.name.toLowerCase() === preset.name.toLowerCase());
      if (exists) {
        return prev.filter(c => c.name.toLowerCase() !== preset.name.toLowerCase());
      } else {
        return [...prev, preset];
      }
    });
  };

  // Add custom color variation
  const handleAddCustomColor = () => {
    if (!customColorName.trim()) return;
    const exists = newProdColors.some(c => c.name.toLowerCase() === customColorName.trim().toLowerCase());
    if (exists) {
      showToast('Color variation already added.');
      return;
    }
    setNewProdColors(prev => [...prev, { name: customColorName.trim(), hex: customColorHex }]);
    setCustomColorName('');
  };

  // Cleanup legacy storage and guarantee catalog synchronization
  useEffect(() => {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('rnr_store_') && !key.includes('_v11')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch (e) {}

    if (!products || products.length < 20 || products[0]?.title !== 'Maroon Gold Athletic Dri-FIT Tee') {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      setPreviewProduct(null);
    }
  }, []);

  // Admin action: reset catalog to fresh 20 distinct products
  const handleResetCatalog = () => {
    setProducts(INITIAL_PRODUCTS);
    localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    setPreviewProduct(null);
    showToast('Catalog restored: 20 distinct products from Photocards (1-20)!');
  };

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  // Toast feedback
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // Categories list
  const categories = useMemo(() => {
    return ['ALL', ...new Set(products.map(p => p.category))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'ALL') return products;
    return products.filter(p => p.category === activeCategory);
  }, [products, activeCategory]);

  // Cart calculations
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = cartSubtotal >= 3500 ? 0 : (SHIPPING_RATES[shippingRegion]?.fee || 60);
  const cartGrandTotal = cartSubtotal + shippingFee;

  // Color variation helpers - product image remains this product's photo
  const getActiveColor = (product) => {
    if (selectedColors[product.id]) return selectedColors[product.id];
    if (product.colors && product.colors.length > 0) return product.colors[0].name;
    return null;
  };

  const getActiveImage = (product) => {
    return product.image;
  };

  // Add to cart with color variation and stock validation
  const handleAddToCart = (product, forcedSize = null, forcedColor = null) => {
    const availableSizes = Object.keys(product.stock);
    const chosenSize = forcedSize || selectedSizes[product.id] || availableSizes[0];
    const chosenColor = forcedColor || getActiveColor(product);
    const availableQuantity = product.stock[chosenSize] || 0;
    const activeImg = product.image;

    if (availableQuantity <= 0) {
      showToast(`Size ${chosenSize} is currently sold out.`);
      return;
    }

    const inCart = cart.find(c => c.productId === product.id && c.size === chosenSize && c.color === chosenColor);
    const currentQtyInCart = inCart ? inCart.quantity : 0;

    if (currentQtyInCart >= availableQuantity) {
      showToast(`Cannot add more: only ${availableQuantity} units left in size ${chosenSize}.`);
      return;
    }

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.productId === product.id && item.size === chosenSize && item.color === chosenColor);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += 1;
        return next;
      }
      return [...prev, {
        productId: product.id,
        title: product.title,
        price: product.price,
        size: chosenSize,
        color: chosenColor,
        image: activeImg,
        quantity: 1,
      }];
    });

    showToast(`Added ${product.title} (${chosenColor ? chosenColor + ' / ' : ''}${chosenSize}) to bag.`);
    setIsCartOpen(true);
  };

  // Cart quantity controls with color support
  const handleUpdateCartQty = (productId, size, color, delta) => {
    const prod = products.find(p => p.id === productId);
    const maxStock = prod ? (prod.stock[size] || 0) : 99;

    setCart(prev => {
      return prev.map(item => {
        if (item.productId === productId && item.size === size && item.color === color) {
          const nextQty = item.quantity + delta;
          if (nextQty > maxStock) {
            showToast(`Max stock reached (${maxStock} units).`);
            return item;
          }
          return nextQty > 0 ? { ...item, quantity: nextQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  // Submit product review
  const handleAddReview = (e, productId) => {
    e.preventDefault();
    if (!revName || !revEmail || !revComment) {
      showToast('Please fill out all fields to submit your verified review.');
      return;
    }

    const reviewObj = {
      id: `rev-${Date.now()}`,
      name: revName,
      email: revEmail,
      rating: revRating,
      date: new Date().toISOString().split('T')[0],
      comment: revComment,
    };

    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const currentReviews = p.reviews || [];
          return { ...p, reviews: [reviewObj, ...currentReviews] };
        }
        return p;
      })
    );

    // Update current preview modal product
    setPreviewProduct(prev => (prev && prev.id === productId ? { ...prev, reviews: [reviewObj, ...(prev.reviews || [])] } : prev));

    setRevName('');
    setRevEmail('');
    setRevComment('');
    setRevRating(5);
    showToast('Verified review submitted successfully!');
  };

  // Average rating helper
  const getAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return null;
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    return avg.toFixed(1);
  };

  // Checkout submission (GCash or Bank Payment)
  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast('Cart is empty.');
      return;
    }

    if (paymentMethod === 'gcash' && (!gcashRefNumber || gcashRefNumber.trim().length < 8)) {
      showToast('Please enter a valid GCash Reference Number.');
      return;
    }

    if (paymentMethod === 'bank' && (!bankRefNumber || bankRefNumber.trim().length < 6)) {
      showToast('Please enter your Bank Reference / Transaction Number.');
      return;
    }

    const trimmedEmail = customerEmail.trim();
    if (!trimmedEmail) {
      showToast('Please enter an email address for receipt and tracking.');
      return;
    }

    // Decrement inventory stock
    setProducts(prevProducts => {
      return prevProducts.map(prod => {
        const cartItemsForProd = cart.filter(c => c.productId === prod.id);
        if (cartItemsForProd.length === 0) return prod;

        const updatedStock = { ...prod.stock };
        cartItemsForProd.forEach(ci => {
          updatedStock[ci.size] = Math.max(0, (updatedStock[ci.size] || 0) - ci.quantity);
        });

        return { ...prod, stock: updatedStock };
      });
    });

    const newOrderId = `RNR-SPT-${Date.now().toString().slice(-6)}`;
    const newOrder = {
      orderId: newOrderId,
      createdAt: new Date().toISOString(),
      customer: {
        name: customerName,
        email: trimmedEmail,
        phone: customerPhone,
        address: customerAddress,
        city: customerCity,
        region: shippingRegion,
      },
      items: [...cart],
      subtotal: cartSubtotal,
      shippingFee: shippingFee,
      total: cartGrandTotal,
      payment: {
        method: paymentMethod,
        gcashRefNumber: paymentMethod === 'gcash' ? gcashRefNumber : null,
        bankRefNumber: paymentMethod === 'bank' ? bankRefNumber : null,
        status: paymentMethod === 'gcash'
          ? 'PENDING GCASH VERIFICATION'
          : 'PENDING BANK TRANSFER VERIFICATION',
      },
      receipt: null,
      dispatch: null,
      emailLogs: [
        {
          id: `log-order-${Date.now()}`,
          type: 'ORDER_PLACED',
          timestamp: new Date().toISOString(),
          to: trimmedEmail,
          subject: `Order #${newOrderId} Received — Awaiting Payment Verification`,
          summary: `Order registered. Official receipt will be emailed once payment is verified.`,
        }
      ],
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setIsCheckoutOpen(false);
    setOrderSuccess(newOrder);
    setGcashRefNumber('');
    setBankRefNumber('');
    setCustomerEmail('');
    showToast(`Order #${newOrder.orderId} placed! Queued for verification.`);
  };

  // Admin login handler (admin / admin12345)
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminUsername === 'admin' && adminPassword === 'admin12345') {
      setIsAdminLoggedIn(true);
      setLoginError('');
      showToast('Logged in as RNR OnlineShop Administrator.');
    } else {
      setLoginError('Invalid username or password.');
    }
  };

  // Admin order verification with receipt email dispatch
  const handleVerifyOrderPayment = (orderId) => {
    const verifiedTimestamp = new Date().toISOString();
    let recipientEmail = '';
    let targetOrder = null;

    setOrders(prev =>
      prev.map(ord => {
        if (ord.orderId !== orderId) return ord;
        targetOrder = ord;
        recipientEmail = ord.customer?.email || '';
        const receiptData = {
          receiptNumber: `RCPT-${ord.orderId}`,
          sentAt: verifiedTimestamp,
          sentTo: ord.customer?.email,
        };
        const emailLog = {
          id: `log-rcpt-${Date.now()}`,
          type: 'RECEIPT',
          timestamp: verifiedTimestamp,
          to: ord.customer?.email,
          subject: `Official Receipt — RNR OnlineShop Order #${ord.orderId} (Payment Verified)`,
          receiptNumber: receiptData.receiptNumber,
          order: ord,
        };
        return {
          ...ord,
          payment: { ...ord.payment, status: 'PAYMENT VERIFIED (RECEIPT SENT)' },
          receipt: receiptData,
          emailLogs: [...(ord.emailLogs || []), emailLog],
        };
      })
    );

    // If EmailJS is configured, transmit real email to Gmail
    const tId = emailConfig.receiptTemplateId?.trim() || emailConfig.dispatchTemplateId?.trim();
    if (emailConfig.serviceId?.trim() && emailConfig.publicKey?.trim() && tId && recipientEmail) {
      const itemsList = targetOrder?.items || [];
      const ordersArray = itemsList.map(it => ({
        name: `${it.title}${it.size ? ` (${it.size})` : ''}${it.color ? ` • ${it.color}` : ''}`,
        units: it.quantity,
        price: it.price?.toLocaleString(),
        image_url: it.image?.startsWith('http') ? it.image : (window.location.origin + (it.image || '/Photocards/1.jpeg'))
      }));

      const templateParams = {
        email: recipientEmail,
        to_email: recipientEmail,
        to_name: targetOrder?.customer?.name || 'Valued Athlete',
        subject: `Official Receipt — RNR OnlineShop Order #${orderId} (Payment Verified)`,
        order_id: orderId,
        receipt_number: `RCPT-${orderId}`,
        payment_method: targetOrder?.payment?.method?.toUpperCase() || 'GCASH',
        payment_ref: targetOrder?.payment?.gcashRefNumber || targetOrder?.payment?.bankRefNumber || 'N/A',
        orders: ordersArray,
        cost: {
          shipping: targetOrder?.shippingFee ? targetOrder.shippingFee.toLocaleString() : '0',
          tax: '0 (VAT Inclusive)',
          total: targetOrder?.total ? targetOrder.total.toLocaleString() : '0',
        },
        total_amount: `₱${targetOrder?.total?.toLocaleString() || ''}`,
        items_summary: itemsList.map(it => `${it.title} (${it.size}${it.color ? ' • ' + it.color : ''}) x${it.quantity} - ₱${(it.price * it.quantity).toLocaleString()}`).join('\n') || '',
        customer_address: `${targetOrder?.customer?.address || ''}, ${targetOrder?.customer?.city || ''}`,
        customer_phone: targetOrder?.customer?.phone || '',
        date: new Date().toLocaleDateString(),
        message: `Thank you for choosing RNR OnlineShop! Your payment for order #${orderId} has been verified by our team. Your official receipt number is RCPT-${orderId}.`
      };

      sendRealEmail({ templateId: tId, templateParams }).then(res => {
        if (res.success) {
          showToast(`✓ Real receipt email delivered to ${recipientEmail} via Gmail!`);
        } else {
          showToast(`⚠️ EmailJS Notice: ${res.error}. Recorded locally.`);
        }
      });
    } else {
      showToast(`✓ Payment verified! Official receipt dispatched to ${recipientEmail || 'customer email'}.`);
    }
  };

  // Open courier dispatch modal
  const handleOpenDispatchModal = (order) => {
    setDispatchModalOrder(order);
    setDispatchCourier('RNT Express');
    setDispatchTrackingNum(`RNT-${Date.now().toString().slice(-8)}`);
  };

  // Confirm dispatch and send tracking email
  const handleConfirmDispatch = (e) => {
    e.preventDefault();
    if (!dispatchModalOrder) return;
    const orderId = dispatchModalOrder.orderId;
    const dispatchedTimestamp = new Date().toISOString();
    const trackingUrl = dispatchCourier === 'RNT Express'
      ? `https://track.rnr-onlineshop.ph/?ref=${dispatchTrackingNum}`
      : dispatchCourier === 'LBC Express'
      ? `https://www.lbcexpress.com/track/?tracking_no=${dispatchTrackingNum}`
      : `https://track.rnr-onlineshop.ph/?ref=${dispatchTrackingNum}`;

    const dispatchData = {
      courier: dispatchCourier,
      trackingNumber: dispatchTrackingNum,
      trackingUrl: trackingUrl,
      sentAt: dispatchedTimestamp,
      sentTo: dispatchModalOrder.customer.email,
    };

    const emailLog = {
      id: `log-disp-${Date.now()}`,
      type: 'DISPATCH_TRACKING',
      timestamp: dispatchedTimestamp,
      to: dispatchModalOrder.customer.email,
      subject: `Your RNR Sportswear Order #${orderId} Has Been Dispatched! Tracking: ${dispatchTrackingNum}`,
      courier: dispatchCourier,
      trackingNumber: dispatchTrackingNum,
      trackingUrl: trackingUrl,
      order: dispatchModalOrder,
    };

    setOrders(prev =>
      prev.map(ord => {
        if (ord.orderId !== orderId) return ord;
        return {
          ...ord,
          payment: { ...ord.payment, status: `DISPATCHED VIA ${dispatchCourier} (${dispatchTrackingNum})` },
          dispatch: dispatchData,
          emailLogs: [...(ord.emailLogs || []), emailLog],
        };
      })
    );

    const recipientEmail = dispatchModalOrder.customer?.email;
    const tId = emailConfig.dispatchTemplateId?.trim() || emailConfig.receiptTemplateId?.trim();

    if (emailConfig.serviceId?.trim() && emailConfig.publicKey?.trim() && tId && recipientEmail) {
      const itemsList = dispatchModalOrder?.items || [];
      const ordersArray = itemsList.map(it => ({
        name: `${it.title}${it.size ? ` (${it.size})` : ''}${it.color ? ` • ${it.color}` : ''}`,
        units: it.quantity,
        price: it.price?.toLocaleString(),
        image_url: it.image?.startsWith('http') ? it.image : (window.location.origin + (it.image || '/Photocards/1.jpeg'))
      }));

      const templateParams = {
        email: recipientEmail,
        to_email: recipientEmail,
        to_name: dispatchModalOrder.customer?.name || 'Valued Athlete',
        subject: `Your RNR Sportswear Order #${orderId} Has Been Dispatched! Tracking: ${dispatchTrackingNum}`,
        order_id: orderId,
        receipt_number: `RCPT-${orderId}`,
        courier: dispatchCourier,
        tracking_number: dispatchTrackingNum,
        tracking_url: trackingUrl,
        orders: ordersArray,
        cost: {
          shipping: dispatchModalOrder.shippingFee ? dispatchModalOrder.shippingFee.toLocaleString() : '0',
          tax: '0 (VAT Inclusive)',
          total: dispatchModalOrder.total ? dispatchModalOrder.total.toLocaleString() : '0',
        },
        total_amount: `₱${dispatchModalOrder.total?.toLocaleString() || ''}`,
        customer_address: `${dispatchModalOrder.customer?.address || ''}, ${dispatchModalOrder.customer?.city || ''}`,
        items_summary: itemsList.map(it => `${it.title} (${it.size}) x${it.quantity}`).join(', ') || '',
        dispatch_date: new Date().toLocaleDateString(),
        tracking_guide: `Track your parcel online using the link: ${trackingUrl}`,
        message: `Great news! Your package from RNR OnlineShop has been dispatched via ${dispatchCourier}. Tracking Waybill: ${dispatchTrackingNum}. Track live: ${trackingUrl}`
      };

      sendRealEmail({ templateId: tId, templateParams }).then(res => {
        if (res.success) {
          showToast(`✓ Real dispatch tracking email delivered to ${recipientEmail} via Gmail!`);
        } else {
          showToast(`⚠️ EmailJS Notice: ${res.error}. Recorded locally.`);
        }
      });
    } else {
      showToast(`🚚 Order #${orderId} marked as dispatched! Tracking email sent to ${dispatchModalOrder.customer.email}.`);
    }

    setDispatchModalOrder(null);
  };

  // Admin restock
  const handleQuickRestock = (productId, size) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === productId
          ? { ...p, stock: { ...p.stock, [size]: (p.stock[size] || 0) + 5 } }
          : p
      )
    );
    showToast(`Restocked +5 units for size ${size}.`);
  };

  // Admin delete product from catalog
  const handleDeleteProduct = (productId, productTitle) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setCart(prev => prev.filter(item => item.productId !== productId));
    if (previewProduct && previewProduct.id === productId) {
      setPreviewProduct(null);
    }
    setProductToDelete(null);
    showToast(`Deleted "${productTitle}" from catalog.`);
  };

  // File upload handler from device (supports multiple files)
  const handleDeviceImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    Promise.all(
      files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      })
    ).then(base64List => {
      setNewProdImages(prev => [...prev, ...base64List]);
      showToast(`Added ${base64List.length} image(s) from device.`);
    });
    e.target.value = '';
  };

  // Add image URL handler
  const handleAddImageUrl = (e) => {
    e.preventDefault();
    if (!newProdImageUrl.trim()) return;
    setNewProdImages(prev => [...prev, newProdImageUrl.trim()]);
    setNewProdImageUrl('');
    showToast('Image URL added.');
  };

  // Remove single image from admin list
  const handleRemoveProdImage = (indexToRemove) => {
    setNewProdImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Admin add new product
  const handleAddNewProduct = (e) => {
    e.preventDefault();
    if (!newProdTitle || !newProdPrice) {
      showToast('Product title and price are required.');
      return;
    }

    const defaultImg = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80';
    const productImages = newProdImages.length > 0 ? newProdImages : [defaultImg];

    const createdProd = {
      id: `prod-${Date.now()}`,
      title: newProdTitle,
      category: newProdCategory,
      price: Number(newProdPrice),
      fabric: newProdFabric || 'Heavyweight Cotton Twill',
      description: newProdDesc || 'Engineered for high performance, endurance, and everyday athletes.',
      badge: 'NEW ARRIVAL',
      colors: newProdColors.length > 0 ? newProdColors : [{ name: 'Standard', hex: '#111827' }],
      image: productImages[0],
      images: productImages,
      stock: { ...newProdStock },
      reviews: []
    };

    setProducts(prev => [createdProd, ...prev]);
    setNewProdTitle('');
    setNewProdPrice('');
    setNewProdFabric('');
    setNewProdDesc('');
    setNewProdImages([]);
    setNewProdImageUrl('');
    setNewProdColors([
      { name: 'Black', hex: '#111827' },
      { name: 'White', hex: '#FFFFFF' }
    ]);
    showToast(`Added ${createdProd.title} to catalog!`);
  };

  // Always derive active preview from latest products state to prevent stale data
  const activePreview = useMemo(() => {
    if (!previewProduct) return null;
    return products.find(p => p.id === previewProduct.id) || null;
  }, [previewProduct, products]);

  return (
    <div className="store-container">
      {/* Top Status Bar */}
      <div className="top-status-bar">
        <div className="top-status-left">
          <span className="pulse-dot" />
          <span>GCASH / BANK PAYMENT AVAILABLE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {!isAdminView && (
            <button
              type="button"
              className="top-bar-track-link"
              onClick={() => {
                setIsTrackOrderOpen(true);
                setTrackSearched(false);
                setTrackedOrder(null);
              }}
              title="Look up order status by Order ID or Tracking Number"
            >
              📦 TRACK ORDER STATUS
            </button>
          )}
          <span>PAY VIA GCASH OR BANK PAYMENT (₱ PHP)</span>
        </div>
      </div>

      {/* Main navigation */}
      <header className="main-header">
        <div className="header-container">
          {/* Logo as Home Button */}
          <div
            className="brand-section brand-home-btn"
            role="button"
            tabIndex={0}
            title="RNR OnlineShop — Home"
            aria-label="RNR OnlineShop Home"
            onClick={() => {
              setIsAdminView(false);
              setPreviewProduct(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsAdminView(false);
                setPreviewProduct(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <div className="rnr-logo-container">
              <img src="/Photocards/RNR.jpg" alt="RNR OnlineShop Logo" className="rnr-brand-logo-img" />
            </div>
            <div className="brand-lockup">
              <span className="brand-name">RNR OnlineShop</span>
              <span className="brand-tagline">
                Shopping <em>&amp;</em> Retail • <span className="brand-origin">SPORTSWEAR</span>
              </span>
            </div>
          </div>

          <div className="header-actions">
            {!isAdminView && (
              <button
                type="button"
                className="track-order-nav-btn"
                onClick={() => {
                  setIsTrackOrderOpen(true);
                  setTrackSearched(false);
                  setTrackedOrder(null);
                }}
                title="Track order status with tracking number or order ID"
              >
                <span className="track-nav-icon">📦</span>
                <span>Track Order</span>
              </button>
            )}

            <button
              className={`admin-nav-btn ${isAdminView ? 'active' : ''}`}
              onClick={() => { setIsAdminView(!isAdminView); setPreviewProduct(null); }}
            >
              {isAdminView ? '← Back to Store' : 'Admin Portal'}
            </button>

            {!isAdminView && (
              <button className="cart-toggle-btn" onClick={() => setIsCartOpen(true)}>
                <span>Bag</span>
                <span className="cart-count-pill">{cartItemCount}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Toast popup */}
      {toast && <div className="toast-msg"><span>ℹ</span> {toast}</div>}

      {/* Admin View */}
      {isAdminView ? (
        !isAdminLoggedIn ? (
          <div className="admin-login-wrapper">
            <div className="admin-login-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
                <img src="/Photocards/RNR.jpg" alt="RNR OnlineShop" style={{ height: '48px', width: 'auto', objectFit: 'contain' }} />
                <div>
                  <span className="brand-name" style={{ fontSize: '20px' }}>RNR OnlineShop</span>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Shopping &amp; Retail</div>
                </div>
              </div>
              <h2 className="admin-login-title">Administrator Portal</h2>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                HIGH-PERFORMANCE SPORTSWEAR &amp; CYCLING APPAREL
              </p>
            </div>
            {loginError && <p style={{ color: 'var(--status-red)', fontSize: '11px', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>{loginError}</p>}
            <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-field">
                <label className="field-label">Username</label>
                <input
                  type="text"
                  className="field-input"
                  value={adminUsername}
                  onChange={e => setAdminUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-field">
                <label className="field-label">Password</label>
                <input
                  type="password"
                  className="field-input"
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="checkout-action-btn" style={{ marginTop: '8px' }}>
                Sign In
              </button>
            </form>
          </div>
        ) : (
          <div className="admin-view-container">
            <div className="admin-header-bar">
              <div>
                <h1 style={{ fontSize: '22px', fontWeight: 800 }}>RNR ONLINESHOP // SPORTS OPERATIONS</h1>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Distribution &amp; Inventory Hub</p>
              </div>
              <div className="admin-tabs">
                <button
                  className={`admin-tab-btn ${adminTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setAdminTab('orders')}
                >
                  Order Queue ({orders.length})
                </button>
                <button
                  className={`admin-tab-btn ${adminTab === 'inventory' ? 'active' : ''}`}
                  onClick={() => setAdminTab('inventory')}
                >
                  Inventory & Catalog ({products.length})
                </button>
                <button
                  className={`admin-tab-btn ${adminTab === 'email_settings' ? 'active' : ''}`}
                  onClick={() => setAdminTab('email_settings')}
                >
                  ✉ Email Delivery (Gmail)
                </button>
                <button
                  className="admin-tab-btn"
                  style={{ color: 'var(--status-red)' }}
                  onClick={() => setIsAdminLoggedIn(false)}
                >
                  Log Out
                </button>
              </div>
            </div>

            {/* Admin: Orders Queue */}
            {adminTab === 'orders' && (
              <div className="admin-card">
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Incoming Orders & GCash Verification</h3>
                {orders.length === 0 ? (
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)' }}>
                    No customer orders in queue.
                  </p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Items</th>
                          <th>Valuation</th>
                          <th>Payment / GCash Ref</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(order => (
                          <tr key={order.orderId}>
                            <td style={{ fontWeight: 700 }}>{order.orderId}</td>
                            <td>
                              <div><strong>{order.customer.name}</strong></div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{order.customer.phone}</div>
                              <div style={{ fontSize: '11px', color: 'var(--rnr-coral)', fontWeight: 600 }}>✉ {order.customer.email}</div>
                              <div style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>{order.customer.address}, {order.customer.city}</div>
                            </td>
                            <td>
                              {order.items.map((it, idx) => (
                                <div key={idx} style={{ fontSize: '11px' }}>
                                  {it.quantity}x {it.title} ({it.size}{it.color ? `, ${it.color}` : ''})
                                </div>
                              ))}
                            </td>
                            <td style={{ fontWeight: 800 }}>₱{order.total.toLocaleString()}</td>
                            <td>
                              <div><strong>{order.payment.method.toUpperCase()}</strong></div>
                              {order.payment.gcashRefNumber && (
                                <div style={{ color: 'var(--gcash-blue)', fontWeight: 700 }}>
                                  REF: {order.payment.gcashRefNumber}
                                </div>
                              )}
                              {order.payment.bankRefNumber && (
                                <div style={{ color: '#0D8A58', fontWeight: 700 }}>
                                  REF: {order.payment.bankRefNumber}
                                </div>
                              )}
                            </td>
                            <td>
                              <span className={`status-badge ${
                                order.payment.status.includes('PENDING') ? 'status-pending' :
                                order.payment.status.includes('VERIFIED') ? 'status-verified' : 'status-dispatched'
                              }`}>
                                {order.payment.status}
                              </span>
                              {order.receipt && (
                                <div style={{ marginTop: '4px', fontSize: '10px', color: '#065F46', fontFamily: 'var(--font-mono)' }}>
                                  ✓ Receipt Emailed
                                </div>
                              )}
                              {order.dispatch && (
                                <div style={{ marginTop: '2px', fontSize: '10px', color: '#1E40AF', fontFamily: 'var(--font-mono)' }}>
                                  ✓ Tracking Emailed ({order.dispatch.courier})
                                </div>
                              )}
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {order.payment.status.includes('PENDING') && (
                                  <button
                                    className="admin-action-btn"
                                    style={{ background: '#D1FAE5', color: '#065F46', borderColor: '#10B981' }}
                                    onClick={() => handleVerifyOrderPayment(order.orderId)}
                                  >
                                    Verify &amp; Send Receipt
                                  </button>
                                )}
                                {!order.payment.status.includes('DISPATCHED') && (
                                  <button
                                    className="admin-action-btn"
                                    style={{ background: '#DBEAFE', color: '#1E40AF', borderColor: '#3B82F6' }}
                                    onClick={() => handleOpenDispatchModal(order)}
                                  >
                                    Dispatch &amp; Email Tracking
                                  </button>
                                )}
                                {order.emailLogs && order.emailLogs.length > 0 && (
                                  <button
                                    className="admin-action-btn"
                                    onClick={() => setActiveEmailModal(order.emailLogs[order.emailLogs.length - 1])}
                                  >
                                    View Email ({order.emailLogs.length})
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Admin: Inventory & Product Creator */}
            {adminTab === 'inventory' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="admin-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Add New Clothing Item to Catalog</h3>
                    <button
                      type="button"
                      className="cat-btn"
                      onClick={handleResetCatalog}
                      style={{ fontSize: '11px', padding: '6px 12px', background: 'var(--surface-cream)' }}
                      title="Reset catalog to fresh 20 distinct products from Photocards"
                    >
                      🔄 Reset Catalog to 20 Photocards
                    </button>
                  </div>
                  <form onSubmit={handleAddNewProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="form-grid-2">
                      <div className="form-field">
                        <label className="field-label">Garment Title</label>
                        <input
                          type="text"
                          className="field-input"
                          value={newProdTitle}
                          onChange={e => setNewProdTitle(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-field">
                        <label className="field-label">Category</label>
                        <select
                          className="field-select"
                          value={newProdCategory}
                          onChange={e => setNewProdCategory(e.target.value)}
                        >
                          <option value="Tees">Tees</option>
                          <option value="Shirts">Shirts</option>
                          <option value="Bottoms">Bottoms</option>
                          <option value="Outerwear">Outerwear</option>
                          <option value="Accessories">Accessories</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-field">
                        <label className="field-label">Price (₱ PHP)</label>
                        <input
                          type="number"
                          className="field-input"
                          value={newProdPrice}
                          onChange={e => setNewProdPrice(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-field">
                        <label className="field-label">Fabric / Construction Specs</label>
                        <input
                          type="text"
                          className="field-input"
                          value={newProdFabric}
                          onChange={e => setNewProdFabric(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-field">
                      <label className="field-label">Product Description</label>
                      <textarea
                        className="field-textarea"
                        rows="2"
                        value={newProdDesc}
                        onChange={e => setNewProdDesc(e.target.value)}
                      />
                    </div>

                    {/* Image Upload Source: From Device or Online URL (Supports Multiple) */}
                    <div className="form-field">
                      <label className="field-label">Garment Images (Upload Multiple / Device or URL)</label>
                      <div className="upload-mode-toggle">
                        <button
                          type="button"
                          className={`cat-btn ${imageUploadType === 'device' ? 'active' : ''}`}
                          onClick={() => setImageUploadType('device')}
                        >
                          Upload from Device
                        </button>
                        <button
                          type="button"
                          className={`cat-btn ${imageUploadType === 'url' ? 'active' : ''}`}
                          onClick={() => setImageUploadType('url')}
                        >
                          Image Web URL
                        </button>
                      </div>

                      {imageUploadType === 'device' ? (
                        <label className="file-upload-dropzone">
                          <span className="dropzone-title">📂 Choose Image Files from Device</span>
                          <span className="dropzone-subtitle">Hold Ctrl or Shift to select multiple photos (JPG, PNG, WEBP)</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            style={{ display: 'none' }}
                            onChange={handleDeviceImageUpload}
                          />
                        </label>
                      ) : (
                        <div className="admin-url-add-row">
                          <input
                            type="url"
                            className="field-input"
                            placeholder="https://images.unsplash.com/... or direct image link"
                            value={newProdImageUrl}
                            onChange={e => setNewProdImageUrl(e.target.value)}
                          />
                          <button
                            type="button"
                            className="admin-url-add-btn"
                            onClick={handleAddImageUrl}
                          >
                            Add URL
                          </button>
                        </div>
                      )}

                      {newProdImages.length > 0 && (
                        <div>
                          <div className="admin-images-summary">
                            <span>{newProdImages.length} Image(s) Attached</span>
                            <span>First image is primary thumbnail</span>
                          </div>
                          <div className="admin-image-grid">
                            {newProdImages.map((imgSrc, idx) => (
                              <div key={idx} className="admin-image-card">
                                <img src={imgSrc} alt={`Garment view ${idx + 1}`} />
                                <span className="admin-image-badge">#{idx + 1}</span>
                                <button
                                  type="button"
                                  className="admin-image-remove-btn"
                                  onClick={() => handleRemoveProdImage(idx)}
                                  title="Remove image"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Available Color Variations Picker */}
                    <div className="form-field">
                      <label className="field-label">Available Color Variations</label>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        Click preset colors to toggle on/off, or type custom colors:
                      </div>

                      {/* Preset color pills */}
                      <div className="admin-color-presets-row">
                        {PRESET_COLORS.map(preset => {
                          const isSelected = newProdColors.some(c => c.name.toLowerCase() === preset.name.toLowerCase());
                          return (
                            <button
                              key={preset.name}
                              type="button"
                              className={`admin-color-preset-pill ${isSelected ? 'selected' : ''}`}
                              onClick={() => handleTogglePresetColor(preset)}
                            >
                              <span className="preset-swatch-circle" style={{ backgroundColor: preset.hex }} />
                              <span>{preset.name}</span>
                              <span className="preset-check">{isSelected ? '✓' : '+'}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Custom color input row */}
                      <div className="admin-custom-color-row">
                        <input
                          type="text"
                          className="field-input"
                          placeholder="Or enter custom color name (e.g. Charcoal, Sand, Maroon)"
                          value={customColorName}
                          onChange={e => setCustomColorName(e.target.value)}
                          style={{ flex: 1 }}
                        />
                        <input
                          type="color"
                          value={customColorHex}
                          onChange={e => setCustomColorHex(e.target.value)}
                          title="Pick color hex"
                          className="admin-color-picker-input"
                        />
                        <button
                          type="button"
                          className="admin-url-add-btn"
                          onClick={handleAddCustomColor}
                        >
                          + Add Color
                        </button>
                      </div>

                      {/* Selected colors summary */}
                      <div className="admin-selected-colors-wrap">
                        <span className="admin-selected-colors-label">Selected Color Variations ({newProdColors.length}):</span>
                        {newProdColors.length === 0 ? (
                          <span style={{ fontSize: '12px', color: 'var(--status-red)', fontStyle: 'italic' }}>
                            No colors selected. Please click preset swatches above or add a custom color.
                          </span>
                        ) : (
                          <div className="admin-color-chips-list">
                            {newProdColors.map((col, idx) => (
                              <span key={idx} className="admin-color-chip">
                                <span className="preset-swatch-circle" style={{ backgroundColor: col.hex }} />
                                <span>{col.name}</span>
                                <button
                                  type="button"
                                  className="chip-remove-btn"
                                  onClick={() => setNewProdColors(prev => prev.filter((_, i) => i !== idx))}
                                  title={`Remove ${col.name}`}
                                >
                                  ✕
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Initial Stock Per Size Matrix */}
                    <div className="form-field">
                      <label className="field-label">Initial Stock Per Size (S / M / L / XL)</label>
                      <div className="stock-input-grid">
                        {['S', 'M', 'L', 'XL'].map(sz => (
                          <div key={sz} className="stock-size-cell">
                            <span className="stock-size-label">SIZE {sz}</span>
                            <input
                              type="number"
                              className="stock-size-input"
                              value={newProdStock[sz]}
                              onChange={e => setNewProdStock({ ...newProdStock, [sz]: Math.max(0, parseInt(e.target.value) || 0) })}
                              min="0"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ paddingTop: '4px' }}>
                      <button type="submit" className="admin-submit-btn">
                        <span>Publish to Store Catalog</span>
                        <span>→</span>
                      </button>
                    </div>
                  </form>
                </div>

                <div className="admin-card">
                  <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Real-Time Inventory Levels</h3>
                  <div className="admin-table-scroll-wrap">
                    <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock Breakdown</th>
                        <th>Quick Restock</th>
                        <th className="admin-manage-th">Manage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(prod => (
                        <tr key={prod.id}>
                          <td><strong>{prod.title}</strong></td>
                          <td>{prod.category}</td>
                          <td>₱{prod.price.toLocaleString()}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              {Object.entries(prod.stock).map(([sz, qty]) => (
                                <span
                                  key={sz}
                                  style={{
                                    padding: '2px 6px',
                                    background: qty === 0 ? '#FEE2E2' : qty < 3 ? '#FEF3C7' : '#F3F4F6',
                                    color: qty === 0 ? '#DC2626' : qty < 3 ? '#D97706' : '#111827',
                                    fontWeight: 700,
                                    fontSize: '11px',
                                  }}
                                >
                                  {sz}: {qty}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                              {Object.keys(prod.stock).map(sz => (
                                <button
                                  key={sz}
                                  className="admin-action-btn"
                                  onClick={() => handleQuickRestock(prod.id, sz)}
                                >
                                  +5 {sz}
                                </button>
                              ))}
                            </div>
                          </td>
                          <td className="admin-manage-td">
                            <button
                              type="button"
                              className="admin-delete-btn"
                              onClick={() => setProductToDelete(prod)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              </div>
            )}

            {/* Admin: Real Email Delivery Settings (Gmail / EmailJS) */}
            {adminTab === 'email_settings' && (
              <div className="admin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800 }}>✉ Real Email Delivery Settings (Gmail / EmailJS)</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Connect your personal Gmail to deliver real payment receipts and courier tracking emails directly to customer inboxes.
                    </p>
                  </div>
                  <div>
                    {emailConfig.serviceId && emailConfig.publicKey && (emailConfig.receiptTemplateId || emailConfig.dispatchTemplateId) ? (
                      <span className="email-status-pill email-status-active">
                        🟢 Real Gmail Delivery Active
                      </span>
                    ) : (
                      <span className="email-status-pill email-status-inactive">
                        ⚠️ Local Simulation Mode (Real Delivery Inactive)
                      </span>
                    )}
                  </div>
                </div>

                <div className="email-settings-grid">
                  {/* Left: Step by Step Setup Guide */}
                  <div className="email-guide-card">
                    <h4 style={{ fontSize: '13px', fontWeight: 800, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                      Quick 3-Minute Setup Guide (Free 200 emails/mo)
                    </h4>
                    
                    <div className="email-guide-step">
                      <div className="email-step-num">1</div>
                      <div className="email-step-content">
                        Create a free account at <a href="https://www.emailjs.com" target="_blank" rel="noreferrer" style={{ color: 'var(--rnr-coral)', fontWeight: 700 }}>emailjs.com</a>.
                      </div>
                    </div>

                    <div className="email-guide-step">
                      <div className="email-step-num">2</div>
                      <div className="email-step-content">
                        In EmailJS Dashboard, click <strong>Email Services</strong> &gt; <strong>Add New Service</strong> &gt; select <strong>Gmail</strong> &gt; Click <strong>Connect Account</strong> to link your Gmail. Copy your <strong>Service ID</strong> (e.g. <code>service_xxxxxx</code>).
                      </div>
                    </div>

                    <div className="email-guide-step">
                      <div className="email-step-num">3</div>
                      <div className="email-step-content">
                        Click <strong>Email Templates</strong> &gt; <strong>Create New Template</strong>.<br />
                        - Set Subject: <code>&#123;&#123;subject&#125;&#125;</code><br />
                        - Set Content: <code>&#123;&#123;message&#125;&#125;</code> (or include variables like <code>&#123;&#123;order_id&#125;&#125;</code>, <code>&#123;&#123;total_amount&#125;&#125;</code>, <code>&#123;&#123;tracking_url&#125;&#125;</code>).<br />
                        Save and copy your <strong>Template ID</strong> (e.g. <code>template_xxxxxx</code>).
                      </div>
                    </div>

                    <div className="email-guide-step">
                      <div className="email-step-num">4</div>
                      <div className="email-step-content">
                        Click <strong>Account</strong> (bottom-left) &gt; Copy your <strong>Public Key</strong> (e.g. <code>user_xxxxxx</code> or public key).
                      </div>
                    </div>

                    <div className="email-guide-step">
                      <div className="email-step-num">5</div>
                      <div className="email-step-content">
                        Paste them in the configuration form on the right and click <strong>Save EmailJS Configuration</strong>!
                      </div>
                    </div>
                  </div>

                  {/* Right: Credentials Form & Test Sandbox */}
                  <div>
                    <form onSubmit={handleSaveEmailConfig} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div className="form-field">
                        <label className="field-label">EmailJS Service ID</label>
                        <input
                          type="text"
                          className="field-input"
                          placeholder="e.g. service_gmaildelivery"
                          value={emailConfig.serviceId}
                          onChange={e => setEmailConfig(prev => ({ ...prev, serviceId: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="form-field">
                        <label className="field-label">EmailJS Public Key</label>
                        <input
                          type="text"
                          className="field-input"
                          placeholder="e.g. 5xYzAbCdE12345"
                          value={emailConfig.publicKey}
                          onChange={e => setEmailConfig(prev => ({ ...prev, publicKey: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="form-field">
                        <label className="field-label">Receipt Template ID</label>
                        <input
                          type="text"
                          className="field-input"
                          placeholder="e.g. template_receipt_verified"
                          value={emailConfig.receiptTemplateId}
                          onChange={e => setEmailConfig(prev => ({ ...prev, receiptTemplateId: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="form-field">
                        <label className="field-label">Dispatch Tracking Template ID (Optional: leave blank to reuse receipt template)</label>
                        <input
                          type="text"
                          className="field-input"
                          placeholder="e.g. template_courier_dispatch"
                          value={emailConfig.dispatchTemplateId}
                          onChange={e => setEmailConfig(prev => ({ ...prev, dispatchTemplateId: e.target.value }))}
                        />
                      </div>

                      <button type="submit" className="admin-submit-btn" style={{ marginTop: '6px' }}>
                        <span>💾 Save EmailJS Configuration</span>
                        <span>→</span>
                      </button>
                    </form>

                    {/* Test Email Sandbox */}
                    <div className="email-test-box">
                      <h4 style={{ fontSize: '12px', fontWeight: 800, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                        🧪 Test Real Gmail Delivery
                      </h4>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Send an instant live test message to verify delivery to your personal Gmail inbox.
                      </p>

                      <form onSubmit={handleSendTestEmail} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <input
                          type="email"
                          className="field-input"
                          style={{ flex: 1, minWidth: '200px' }}
                          placeholder="Enter your personal Gmail address..."
                          value={testEmailAddress}
                          onChange={e => setTestEmailAddress(e.target.value)}
                        />
                        <button
                          type="submit"
                          className="admin-action-btn"
                          disabled={isSendingTestEmail}
                          style={{ background: '#10B981', color: '#FFFFFF', borderColor: '#059669', padding: '10px 16px', fontWeight: 800 }}
                        >
                          {isSendingTestEmail ? 'Sending...' : '🚀 Send Real Test Email'}
                        </button>
                      </form>

                      {testEmailStatus && (
                        <div style={{
                          padding: '10px 12px',
                          fontSize: '12px',
                          fontFamily: 'var(--font-mono)',
                          borderRadius: '4px',
                          background: testEmailStatus.type === 'success' ? '#D1FAE5' : '#FEE2E2',
                          color: testEmailStatus.type === 'success' ? '#065F46' : '#991B1B',
                          border: `1px solid ${testEmailStatus.type === 'success' ? '#10B981' : '#F87171'}`
                        }}>
                          {testEmailStatus.msg}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* EmailJS Ready-to-use HTML Template Section */}
                <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                        📋 Tailored EmailJS HTML Template (RNR OnlineShop Format)
                      </h4>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Optimized with RNR vermilion branding, Philippine Peso (₱), order breakdown, and courier tracking button.
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        className="admin-action-btn"
                        onClick={() => {
                          navigator.clipboard?.writeText(EMAILJS_HTML_TEMPLATE);
                          showToast('✓ EmailJS HTML Template copied to clipboard! Paste it into emailjs.com.');
                        }}
                        style={{ background: 'var(--rnr-coral)', color: '#FFF', borderColor: 'var(--rnr-coral)', fontWeight: 800 }}
                      >
                        📋 Copy HTML Template
                      </button>
                      <button
                        type="button"
                        className="admin-action-btn"
                        onClick={() => setShowEmailTemplateCode(!showEmailTemplateCode)}
                      >
                        {showEmailTemplateCode ? 'Hide Code' : 'View Code'}
                      </button>
                    </div>
                  </div>

                  {showEmailTemplateCode && (
                    <div style={{ background: '#141312', color: '#FAF9F6', padding: '16px', borderRadius: '4px', maxHeight: '280px', overflowY: 'auto' }}>
                      <pre style={{ margin: 0, fontSize: '11px', fontFamily: 'var(--font-mono)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {EMAILJS_HTML_TEMPLATE}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      ) : (
        /* Customer Storefront View */
        <>
          {/* Lulus-Style Split Editorial Hero Section with Bike1 & Bike2 Models */}
          <section className="lulus-hero-section">
            <div className="lulus-hero-frame">
              {/* Left Inset Frame with Bike Model Portrait */}
              <div className="lulus-hero-left-box">
                <div className="lulus-portrait-card">
                  <img
                    src={(MODEL_POSES[modelPose] || MODEL_POSES.bike1).portrait}
                    alt={`Model - ${(MODEL_POSES[modelPose] || MODEL_POSES.bike1).title}`}
                    className="lulus-portrait-img"
                  />
                  <div className="lulus-portrait-tag">
                    <span className="portrait-tag-pill">LOOKBOOK // {(MODEL_POSES[modelPose] || MODEL_POSES.bike1).title.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Right Atmospheric Hero with Scenic Cycling Backdrop */}
              <div className="lulus-hero-right-stage">
                <img
                  src={(MODEL_POSES[modelPose] || MODEL_POSES.bike1).hero}
                  alt="RNR High-Performance Sportswear Campaign"
                  className="lulus-stage-backdrop-img"
                />
                <div className="lulus-stage-gradient-overlay" />
              </div>

              {/* Center Editorial Typography & CTAs (Exact composition from user reference image) */}
              <div className="lulus-hero-content-layer">
                <div className="lulus-hero-kicker">
                  [RNR ONLINESHOP // OFFICIAL ATHLETIC LOOKBOOK // CDO &amp; PH]
                </div>
                <h1 className="lulus-hero-title">
                  YOU'VE BEEN<br />
                  <span className="lulus-headline-serif">WARMED</span>
                </h1>
                <h2 className="lulus-hero-tagline">
                  Engineered for Speed. Built for Endurance &amp; Daily Athletes.
                </h2>
                <p className="lulus-hero-summary">
                  Cozy down in next-generation high-performance sportswear, aerodynamic cycling jerseys, and moisture-wicking Dri-FIT thermal layers.
                </p>

                {/* Shop Now Primary Button */}
                <div className="lulus-cta-group">
                  <button
                    type="button"
                    className="lulus-shop-now-btn"
                    onClick={handleShopNow}
                  >
                    SHOP NOW →
                  </button>
                </div>

                {/* Interactive Model Pose Selector (Adds pose of the model) */}
                <div className="lulus-pose-selector-wrap">
                  <span className="lulus-pose-label">CYCLING MODEL POSES:</span>
                  <div className="lulus-pose-btn-group">
                    {Object.entries(MODEL_POSES).map(([key, pose]) => (
                      <button
                        key={key}
                        type="button"
                        className={`lulus-pose-btn ${(modelPose === key || (!MODEL_POSES[modelPose] && key === 'bike1')) ? 'active' : ''}`}
                        onClick={() => setModelPose(key)}
                      >
                        <span className="pose-dot" />
                        <span>{pose.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Model Spotlight // Bike 1 & Bike 2 Feature Section */}
          <section className="model-spotlight-section">
            <div className="spotlight-header">
              <div className="spotlight-subtitle">[THE CYCLING LOOKBOOK // BIKE 1 &amp; BIKE 2 SIGNATURE POSES]</div>
              <h3 className="spotlight-title">Engineered for the Road. Modeled on Two Wheels.</h3>
              <p className="spotlight-desc">
                Tested for high-velocity wind resistance, aerodynamic contouring, and coastal endurance comfort.
              </p>
            </div>
            <div className="model-looks-grid">
              <div className="model-look-card" onClick={() => setModelPose('bike1')}>
                <div className="model-look-img-wrap">
                  <img src="/Photocards/Bike1.jpeg" alt="Bike 1: Road Aero Pace" />
                  <span className="look-badge">BIKE 01 • AERO PACE</span>
                </div>
                <div className="model-look-info">
                  <h4>Bike 1: Road Aero Pace</h4>
                  <p>High-velocity cycling jersey featuring aerodynamic print, ergonomic comfort seams, and active airflow ventilation.</p>
                  <button type="button" className="look-explore-btn" onClick={() => handleCategoryJump('CYCLING JERSEYS')}>Explore Cycling Jerseys →</button>
                </div>
              </div>

              <div className="model-look-card" onClick={() => setModelPose('bike2')}>
                <div className="model-look-img-wrap">
                  <img src="/Photocards/Bike2.jpeg" alt="Bike 2: Coastal Endurance" />
                  <span className="look-badge">BIKE 02 • COASTAL ENDURANCE</span>
                </div>
                <div className="model-look-info">
                  <h4>Bike 2: Coastal Endurance</h4>
                  <p>Breathable gradient ride kit engineered for long-distance endurance, sunrise hill climbs, and coastal training.</p>
                  <button type="button" className="look-explore-btn" onClick={() => handleCategoryJump('CYCLING JERSEYS')}>Explore Ride Kits →</button>
                </div>
              </div>
            </div>
          </section>

          {/* Store Catalog Section */}
          <section id="store-catalog" className="store-catalog-section">
            <div className="catalog-section-header">
              <div className="hero-subtitle">[STORE CATALOG // 20 DISTINCT DESIGNS]</div>
              <h3 className="catalog-section-title">High-Performance Sportswear Collection</h3>
              <p className="catalog-section-desc">
                Select your size and color variation. All orders verified by admin with real-time RNT Express tracking.
              </p>
            </div>

            {/* Filter Bar */}
            <div className="filter-container">
              <div className="category-buttons">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="filter-summary">
                {filteredProducts.length} DESIGNS AVAILABLE
              </div>
            </div>

          {/* Product Grid */}
          <main className="product-grid">
            {filteredProducts.map(product => {
              const sizes = Object.keys(product.stock);
              const selectedSize = selectedSizes[product.id] || sizes[0];
              const currentStock = product.stock[selectedSize] || 0;
              const isSoldOut = currentStock === 0;
              const avgRating = getAverageRating(product.reviews);

              return (
                <article key={product.id} className="item-card">
                  <div className="card-top">
                    <span className="card-rating-badge">
                      {avgRating ? `★ ${avgRating} (${product.reviews.length})` : '★ New'}
                    </span>
                    <span className="card-badge">{product.badge}</span>
                  </div>

                  <div className="card-image-box" onClick={() => { setPreviewProduct(product); setPreviewImageIdx(0); }}>
                    <img src={getActiveImage(product)} alt={product.title} className="card-img" loading="lazy" />
                    {product.images && product.images.length > 1 && (
                      <div className="card-multi-img-badge">
                        <span>📷 {product.images.length} photos</span>
                      </div>
                    )}
                    <div className="preview-overlay-hint">
                      Click to Preview & Reviews
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="card-heading-row">
                      <h2 className="item-title" onClick={() => { setPreviewProduct(product); setPreviewImageIdx(0); }}>{product.title}</h2>
                      <span className="item-price">₱{product.price.toLocaleString()}</span>
                    </div>

                    <p className="item-fabric">{product.fabric}</p>

                    {/* Color Variations */}
                    {product.colors && product.colors.length > 0 && (
                      <div className="color-swatches-section">
                        <div className="variation-label-row">
                          <span className="variation-label">Color:</span>
                          <span className="selected-variation-value">{getActiveColor(product)}</span>
                        </div>
                        <div className="color-swatches-row">
                          {product.colors.map(col => {
                            const isSel = getActiveColor(product) === col.name;
                            return (
                              <button
                                key={col.name}
                                type="button"
                                className={`color-swatch-btn ${isSel ? 'active' : ''}`}
                                style={{ backgroundColor: col.hex }}
                                title={col.name}
                                aria-label={`Select color ${col.name}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedColors(prev => ({ ...prev, [product.id]: col.name }));
                                }}
                              >
                                {isSel && <span className="swatch-check">✓</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="size-picker-section">
                      <div className="size-picker-header">
                        <span>Select Size</span>
                        <span>
                          {isSoldOut ? (
                            <strong style={{ color: 'var(--status-red)' }}>SOLD OUT</strong>
                          ) : currentStock < 3 ? (
                            <strong style={{ color: 'var(--status-amber)' }}>ONLY {currentStock} LEFT</strong>
                          ) : (
                            `${currentStock} in stock`
                          )}
                        </span>
                      </div>

                      <div className="size-button-row">
                        {sizes.map(size => {
                          const sizeQty = product.stock[size] || 0;
                          return (
                            <button
                              key={size}
                              className={`size-option-btn ${selectedSize === size ? 'selected' : ''} ${sizeQty === 0 ? 'out-of-stock' : ''}`}
                              onClick={() => setSelectedSizes(prev => ({ ...prev, [product.id]: size }))}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="card-actions-grid">
                      <button
                        className="btn-preview"
                        onClick={() => { setPreviewProduct(product); setPreviewImageIdx(0); }}
                      >
                        Preview
                      </button>
                      <button
                        className="btn-add-bag"
                        disabled={isSoldOut}
                        onClick={() => handleAddToCart(product, selectedSize, getActiveColor(product))}
                      >
                        {isSoldOut ? 'Sold Out' : 'Add to Bag'}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </main>
          </section>

          {/* Mobile Floating Quick Bag Bar */}
          {!isAdminView && cartItemCount > 0 && !isCartOpen && !isCheckoutOpen && (
            <aside className="mobile-floating-cart-bar" aria-label="Mobile Bag Access">
              <div className="mobile-cart-bar-info">
                <span className="mobile-cart-bar-count">🛒 {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} in Bag</span>
                <span className="mobile-cart-bar-total">₱{cartSubtotal.toLocaleString()}</span>
              </div>
              <button
                type="button"
                className="mobile-cart-bar-checkout-btn"
                onClick={() => setIsCartOpen(true)}
              >
                View Bag &amp; Checkout →
              </button>
            </aside>
          )}
        </>
      )}

      {/* Product Preview & Reviews Modal */}
      {activePreview && (
        <div className="modal-overlay" onClick={() => setPreviewProduct(null)}>
          <div className="preview-modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                GARMENT PREVIEW // {activePreview.category}
              </span>
              <button className="close-btn" onClick={() => setPreviewProduct(null)}>[CLOSE]</button>
            </div>

            <div className="preview-split-layout">
              <div className="preview-image-side">
                {(() => {
                  const gallery = (activePreview.images && activePreview.images.length > 0)
                    ? activePreview.images
                    : [activePreview.image];
                  const currentImg = gallery[previewImageIdx] || gallery[0];

                  return (
                    <>
                      <div className="preview-main-stage">
                        <img
                          src={currentImg}
                          alt={`${activePreview.title} - angle ${previewImageIdx + 1}`}
                          className="preview-large-img"
                        />
                        {gallery.length > 1 && (
                          <>
                            <button
                              type="button"
                              className="preview-nav-btn prev"
                              onClick={() => setPreviewImageIdx(prev => (prev > 0 ? prev - 1 : gallery.length - 1))}
                              aria-label="Previous image"
                            >
                              ‹
                            </button>
                            <button
                              type="button"
                              className="preview-nav-btn next"
                              onClick={() => setPreviewImageIdx(prev => (prev < gallery.length - 1 ? prev + 1 : 0))}
                              aria-label="Next image"
                            >
                              ›
                            </button>
                            <span className="preview-counter-pill">
                              {previewImageIdx + 1} / {gallery.length}
                            </span>
                          </>
                        )}
                      </div>

                      {gallery.length > 1 && (
                        <div className="preview-thumbs-strip" role="group" aria-label="Product thumbnails">
                          {gallery.map((imgUrl, idx) => (
                            <button
                              key={idx}
                              type="button"
                              className={`preview-thumb-btn ${previewImageIdx === idx ? 'active' : ''}`}
                              onClick={() => setPreviewImageIdx(idx)}
                              aria-label={`View photo ${idx + 1}`}
                            >
                              <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} />
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              <div className="preview-details-side">
                <div className="preview-header-meta">
                  <h2 className="preview-title">{activePreview.title}</h2>
                  <span className="preview-price">₱{activePreview.price.toLocaleString()}</span>
                </div>

                <div className="preview-stars-summary">
                  <span className="stars-gold">
                    {'★'.repeat(Math.round(getAverageRating(activePreview.reviews) || 5))}
                  </span>
                  <span>
                    {getAverageRating(activePreview.reviews)
                      ? `${getAverageRating(activePreview.reviews)} / 5.0 (${activePreview.reviews.length} verified reviews)`
                      : 'No reviews yet'}
                  </span>
                </div>

                <p className="preview-desc">{activePreview.description}</p>
                <p style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  <strong>Fabric Specs:</strong> {activePreview.fabric}
                </p>

                {/* Color Variations inside Modal */}
                {activePreview.colors && activePreview.colors.length > 0 && (
                  <div className="color-swatches-section">
                    <div className="variation-label-row">
                      <span className="variation-label">Choose Color:</span>
                      <span className="selected-variation-value">{getActiveColor(activePreview)}</span>
                    </div>
                    <div className="color-swatches-row">
                      {activePreview.colors.map(col => {
                        const isSel = getActiveColor(activePreview) === col.name;
                        return (
                          <button
                            key={col.name}
                            type="button"
                            className={`color-swatch-btn ${isSel ? 'active' : ''}`}
                            style={{ backgroundColor: col.hex }}
                            title={col.name}
                            aria-label={`Select ${col.name}`}
                            onClick={() => {
                              setSelectedColors(prev => ({ ...prev, [activePreview.id]: col.name }));
                            }}
                          >
                            {isSel && <span className="swatch-check">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Size picker inside modal */}
                <div className="size-picker-section">
                  <div className="size-picker-header">
                    <span>Available Sizes</span>
                    <span>Stock: {activePreview.stock[selectedSizes[activePreview.id] || Object.keys(activePreview.stock)[0]] || 0} units</span>
                  </div>
                  <div className="size-button-row">
                    {Object.keys(activePreview.stock).map(sz => (
                      <button
                        key={sz}
                        className={`size-option-btn ${(selectedSizes[activePreview.id] || Object.keys(activePreview.stock)[0]) === sz ? 'selected' : ''}`}
                        onClick={() => setSelectedSizes(prev => ({ ...prev, [activePreview.id]: sz }))}
                      >
                        {sz} ({activePreview.stock[sz]})
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  className="checkout-action-btn"
                  onClick={() => handleAddToCart(activePreview, selectedSizes[activePreview.id] || Object.keys(activePreview.stock)[0], getActiveColor(activePreview))}
                >
                  Add to Shopping Bag (₱{activePreview.price.toLocaleString()})
                </button>

                {isAdminLoggedIn && (
                  <div className="preview-admin-box">
                    <div className="preview-admin-label">
                      <span>ADMINISTRATOR ACTION</span>
                      <span>Garment ID: {activePreview.id}</span>
                    </div>
                    <button
                      type="button"
                      className="admin-delete-btn"
                      onClick={() => setProductToDelete(activePreview)}
                    >
                      Delete Garment from Catalog
                    </button>
                  </div>
                )}

                {/* Reviews section */}
                <div className="reviews-container">
                  <div className="reviews-heading">
                    <span>Verified Customer Feedback</span>
                    <span>{activePreview.reviews ? activePreview.reviews.length : 0} Reviews</span>
                  </div>

                  {/* Submit review form */}
                  <form className="review-form-box" onSubmit={e => handleAddReview(e, activePreview.id)}>
                    <div className="review-form-title">Write a Verified Customer Review</div>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Email verification required to confirm genuine buyer feedback.
                    </p>

                    <div className="star-picker">
                      {[1, 2, 3, 4, 5].map(st => (
                        <span
                          key={st}
                          className={`star-item ${st <= revRating ? 'active' : ''}`}
                          onClick={() => setRevRating(st)}
                        >
                          ★
                        </span>
                      ))}
                      <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', marginLeft: '8px' }}>
                        ({revRating} / 5 Stars)
                      </span>
                    </div>

                    <div className="form-grid-2">
                      <input
                        type="text"
                        className="field-input"
                        placeholder="Your Full Name"
                        value={revName}
                        onChange={e => setRevName(e.target.value)}
                        required
                      />
                      <input
                        type="email"
                        className="field-input"
                        placeholder="Your Email Address"
                        value={revEmail}
                        onChange={e => setRevEmail(e.target.value)}
                        required
                      />
                    </div>

                    <textarea
                      className="field-textarea"
                      placeholder="Share your fit, fabric, and sizing review..."
                      rows="2"
                      value={revComment}
                      onChange={e => setRevComment(e.target.value)}
                      required
                    />

                    <button type="submit" className="btn-preview" style={{ alignSelf: 'flex-start' }}>
                      Submit Verified Review
                    </button>
                  </form>

                  {/* Existing Reviews List */}
                  {activePreview.reviews && activePreview.reviews.length > 0 ? (
                    activePreview.reviews.map(r => (
                      <div key={r.id} className="review-card">
                        <div className="review-author-row">
                          <strong>{r.name}</strong>
                          <span className="verified-tag">✓ Verified Buyer</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                          <span className="stars-gold">{'★'.repeat(r.rating)}</span>
                          <span>{r.date}</span>
                        </div>
                        <p className="review-text">{r.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      No reviews yet for this garment. Be the first to review!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
          <aside className="cart-drawer" onClick={e => e.stopPropagation()}>
            <div className="cart-header">
              <h2 className="cart-title">Shopping Bag ({cartItemCount})</h2>
              <button className="close-btn" onClick={() => setIsCartOpen(false)}>[CLOSE]</button>
            </div>

            <div className="cart-items-list">
              {cart.length === 0 ? (
                <p className="empty-cart-msg">Your shopping bag is empty.</p>
              ) : (
                cart.map(item => (
                  <div key={`${item.productId}-${item.size}-${item.color || 'def'}`} className="cart-row">
                    <img src={item.image} alt={item.title} className="cart-item-thumb" />
                    <div className="cart-item-details">
                      <div className="cart-item-name">{item.title}</div>
                      <div className="cart-item-meta">
                        SIZE: {item.size} {item.color ? `// COLOR: ${item.color}` : ''} // ₱{item.price.toLocaleString()}
                      </div>
                      <div className="cart-qty-controls">
                        <button className="qty-btn" onClick={() => handleUpdateCartQty(item.productId, item.size, item.color, -1)}>-</button>
                        <span className="qty-val">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => handleUpdateCartQty(item.productId, item.size, item.color, 1)}>+</button>
                        <button className="remove-btn" onClick={() => handleUpdateCartQty(item.productId, item.size, item.color, -999)}>Remove</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-subtotal-row">
                  <span>Subtotal</span>
                  <span>₱{cartSubtotal.toLocaleString()}</span>
                </div>
                <button
                  className="checkout-action-btn"
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                >
                  Proceed to Checkout (₱{cartSubtotal.toLocaleString()})
                </button>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* Checkout Modal (Payment & Dispatch Queue) */}
      {isCheckoutOpen && (
        <div className="modal-overlay" onClick={() => setIsCheckoutOpen(false)}>
          <div className="checkout-modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Checkout & Payment</h2>
              <button className="close-btn" onClick={() => setIsCheckoutOpen(false)}>[CLOSE]</button>
            </div>

            <form onSubmit={handlePlaceOrder} className="modal-body">
              {/* Delivery info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>1. DELIVERY ADDRESS</h3>

                <div className="form-grid-2">
                  <div className="form-field">
                    <label className="field-label">Full Name</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="e.g. Juan dela Cruz"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label className="field-label">Email Address (For Official Receipt &amp; Live Tracking)</label>
                    <input
                      type="email"
                      className="field-input"
                      placeholder="e.g. buyer@example.com"
                      value={customerEmail}
                      onChange={e => setCustomerEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-field">
                    <label className="field-label">Mobile Contact (For Rider / SMS)</label>
                    <input
                      type="tel"
                      className="field-input"
                      placeholder="09XXXXXXXXX"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label className="field-label">City / Municipality</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="e.g. Metro Manila / Cebu / Davao"
                      value={customerCity}
                      onChange={e => setCustomerCity(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label className="field-label">Street Address &amp; Barangay</label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="House/Unit #, Street, Barangay"
                    value={customerAddress}
                    onChange={e => setCustomerAddress(e.target.value)}
                    required
                  />
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    ✉ Official payment receipt and courier tracking link will be sent to your email upon payment verification.
                  </p>
                </div>
                  <div className="form-field">
                    <label className="field-label">Shipping Dispatch Option</label>
                    <select
                      className="field-select"
                      value={shippingRegion}
                      onChange={e => setShippingRegion(e.target.value)}
                    >
                      <option value="standard_delivery">Standard Courier Dispatch (₱80 / Free ₱3,500+)</option>
                      <option value="express_delivery">Express Air Dispatch (₱150)</option>
                    </select>
                  </div>
                </div>

              {/* Payment selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>2. PAYMENT METHOD</h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    className={`cat-btn ${paymentMethod === 'gcash' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('gcash')}
                    style={{ flex: 1, padding: '10px' }}
                  >
                    GCash Instant QR
                  </button>
                  <button
                    type="button"
                    className={`cat-btn ${paymentMethod === 'bank' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('bank')}
                    style={{ flex: 1, padding: '10px' }}
                  >
                    Bank Payment (BDO / BPI / Maya)
                  </button>
                </div>
              </div>

              {/* GCash QR Interactive Module */}
              {paymentMethod === 'gcash' && (
                <div className="gcash-payment-box">
                  <div className="gcash-badge-row">
                    <span className="gcash-tag">Scan with GCash App</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gcash-blue)', fontWeight: 700 }}>
                      REAL-TIME ORDER DISPATCH
                    </span>
                  </div>

                  <div className="gcash-qr-split">
                    <div className="qr-frame">
                      {/* GCash QR Frame ready for direct replacement */}
                      <svg width="130" height="130" viewBox="0 0 140 140" style={{ background: '#FFF' }}>
                        <rect x="0" y="0" width="140" height="140" fill="#FFF" stroke="#005CE6" strokeWidth="2" />
                        <rect x="15" y="15" width="35" height="35" fill="#005CE6" />
                        <rect x="22" y="22" width="21" height="21" fill="#FFF" />
                        <rect x="26" y="26" width="13" height="13" fill="#005CE6" />
                        
                        <rect x="90" y="15" width="35" height="35" fill="#005CE6" />
                        <rect x="97" y="22" width="21" height="21" fill="#FFF" />
                        <rect x="101" y="26" width="13" height="13" fill="#005CE6" />

                        <rect x="15" y="90" width="35" height="35" fill="#005CE6" />
                        <rect x="22" y="97" width="21" height="21" fill="#FFF" />
                        <rect x="26" y="101" width="13" height="13" fill="#005CE6" />

                        <rect x="60" y="25" width="15" height="15" fill="#005CE6" />
                        <rect x="65" y="55" width="20" height="20" fill="#005CE6" />
                        <rect x="95" y="65" width="15" height="15" fill="#005CE6" />
                        <rect x="60" y="95" width="25" height="15" fill="#005CE6" />
                        <rect x="95" y="95" width="25" height="25" fill="#005CE6" />
                        <circle cx="70" cy="70" r="10" fill="#005CE6" />
                        <text x="70" y="74" fill="#FFF" fontSize="10" fontWeight="bold" textAnchor="middle">G</text>
                      </svg>
                      <span className="qr-caption">[SCAN VIA GCASH APP]</span>
                    </div>

                    <div className="gcash-details">
                      <div className="gcash-info-line">
                        <span className="gcash-info-key">Account Name:</span>
                        <span className="gcash-info-val">RNR ONLINESHOP PH</span>
                      </div>
                      <div className="gcash-info-line">
                        <span className="gcash-info-key">Mobile Number:</span>
                        <span className="gcash-info-val">0917-889-1024</span>
                      </div>
                      <div className="gcash-info-line">
                        <span className="gcash-info-key">Amount to Pay:</span>
                        <span className="gcash-info-val" style={{ color: 'var(--gcash-blue)', fontSize: '15px' }}>
                          ₱{cartGrandTotal.toLocaleString()}
                        </span>
                      </div>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                        1. Open GCash &gt; Tap <strong>Pay QR</strong> or <strong>Send Money</strong> to number above.<br />
                        2. Send exact amount (₱{cartGrandTotal.toLocaleString()}).<br />
                        3. Input the 13-digit Reference No. below to queue your order.
                      </p>
                    </div>
                  </div>

                  <div className="gcash-ref-input-box">
                    <label className="ref-label">Enter GCash Reference Number (Required to queue order)</label>
                    <input
                      type="text"
                      className="field-input"
                      value={gcashRefNumber}
                      onChange={e => setGcashRefNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Bank Transfer Payment Module */}
              {paymentMethod === 'bank' && (
                <div className="bank-payment-box">
                  <div className="gcash-badge-row">
                    <span className="bank-tag">Official Bank Transfer</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#0D8A58', fontWeight: 700 }}>
                      INSTAPAY / PESONET ACCEPTED
                    </span>
                  </div>

                  <div className="bank-details">
                    <div className="bank-info-line">
                      <span className="gcash-info-key">Primary Bank:</span>
                      <span className="gcash-info-val">BDO Unibank (Banco de Oro)</span>
                    </div>
                    <div className="bank-info-line">
                      <span className="gcash-info-key">Account Name:</span>
                      <span className="gcash-info-val">RNR ONLINESHOP</span>
                    </div>
                    <div className="bank-info-line">
                      <span className="gcash-info-key">Account Number:</span>
                      <span className="gcash-info-val" style={{ fontSize: '14px', letterSpacing: '0.05em' }}>0082-1402-9851</span>
                    </div>
                    <div className="bank-info-line">
                      <span className="gcash-info-key">Secondary (BPI):</span>
                      <span className="gcash-info-val">9283-1029-44 (RNR OnlineShop)</span>
                    </div>
                    <div className="bank-info-line">
                      <span className="gcash-info-key">Amount to Transfer:</span>
                      <span className="gcash-info-val" style={{ color: '#0D8A58', fontSize: '15px' }}>
                        ₱{cartGrandTotal.toLocaleString()}
                      </span>
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                      Transfer exact amount via BDO, BPI, UnionBank, Maya, or any InstaPay/PESONet banking app.<br />
                      Copy the generated Reference / Transaction number below to verify your order.
                    </p>
                  </div>

                  <div className="bank-ref-input-box">
                    <label className="bank-ref-label">Enter Bank Reference / Transaction No. (Required)</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="e.g. BDO-98124801 or InstaPay Ref No."
                      value={bankRefNumber}
                      onChange={e => setBankRefNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Valuation breakdown */}
              <div style={{ background: 'var(--surface-white)', padding: '16px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
                  <span>Items Subtotal:</span>
                  <span>₱{cartSubtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontFamily: 'var(--font-mono)', marginTop: '6px' }}>
                  <span>Shipping ({SHIPPING_RATES[shippingRegion]?.label.split(' ')[0]}):</span>
                  <span>{shippingFee === 0 ? 'FREE (₱3,500+ Promotion)' : `₱${shippingFee}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontFamily: 'var(--font-mono)', fontWeight: 800, marginTop: '10px', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
                  <span>Grand Total:</span>
                  <span>₱{cartGrandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button type="submit" className="checkout-action-btn" style={{ padding: '16px' }}>
                Confirm & Queue Order (₱{cartGrandTotal.toLocaleString()})
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Order Success Modal */}
      {orderSuccess && (
        <div className="modal-overlay" onClick={() => setOrderSuccess(null)}>
          <div className="checkout-modal-card" style={{ maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Order Queued Successfully</h2>
              <button className="close-btn" onClick={() => setOrderSuccess(null)}>[CLOSE]</button>
            </div>
            <div className="modal-body">
              <div style={{ background: '#D1FAE5', border: '1px solid #10B981', padding: '14px', color: '#065F46', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                ✓ Order #{orderSuccess.orderId} registered into the RNR OnlineShop dispatch line.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Customer:</span>
                  <strong>{orderSuccess.customer.name} ({orderSuccess.customer.phone})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Email Notification:</span>
                  <strong style={{ color: 'var(--rnr-coral)' }}>{orderSuccess.customer.email}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Delivery Address:</span>
                  <span>{orderSuccess.customer.address}, {orderSuccess.customer.city}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Payment Method:</span>
                  <strong>{orderSuccess.payment.method.toUpperCase()}</strong>
                </div>
                {orderSuccess.payment.gcashRefNumber && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--gcash-blue)' }}>
                    <span>GCash Ref #:</span>
                    <strong>{orderSuccess.payment.gcashRefNumber}</strong>
                  </div>
                )}
                {orderSuccess.payment.bankRefNumber && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0D8A58' }}>
                    <span>Bank Ref #:</span>
                    <strong>{orderSuccess.payment.bankRefNumber}</strong>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Current Status:</span>
                  <span className="status-badge status-pending">{orderSuccess.payment.status}</span>
                </div>
              </div>

              {/* Customer Tracking Code Box */}
              <div className="customer-tracking-box">
                <div className="customer-tracking-label-row">
                  <span className="customer-tracking-label">YOUR ORDER TRACKING CODE</span>
                  <span className="customer-tracking-tag">Save for Lookup</span>
                </div>
                <div className="customer-tracking-code-val-row">
                  <span className="customer-tracking-code">{orderSuccess.orderId}</span>
                  <button
                    type="button"
                    className="customer-copy-code-btn"
                    onClick={() => {
                      navigator.clipboard?.writeText(orderSuccess.orderId);
                      showToast(`✓ Tracking code ${orderSuccess.orderId} copied!`);
                    }}
                    title="Copy tracking code"
                  >
                    📋 Copy Code
                  </button>
                </div>
                <p className="customer-tracking-info-note">
                  ℹ Payment verification is strictly the store administrator's responsibility. As a customer, you can review your order status anytime by entering this tracking code in the <strong>Track Order</strong> tab.
                </p>
                <button
                  type="button"
                  className="customer-track-now-btn"
                  onClick={() => {
                    const code = orderSuccess.orderId;
                    setOrderSuccess(null);
                    setTrackOrderQuery(code);
                    setIsTrackOrderOpen(true);
                    handleTrackOrderSearch(code);
                  }}
                >
                  🔍 Track This Order Status Now →
                </button>
              </div>

              {/* Admin-only queued email notification preview */}
              {isAdminLoggedIn && orderSuccess.emailLogs && orderSuccess.emailLogs.length > 0 && (
                <button
                  type="button"
                  className="admin-action-btn"
                  style={{ width: '100%', padding: '10px', marginTop: '4px' }}
                  onClick={() => setActiveEmailModal(orderSuccess.emailLogs[0])}
                >
                  ✉ [Admin Preview] Queued Email Notification
                </button>
              )}

              <button className="checkout-action-btn" onClick={() => setOrderSuccess(null)}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Track Order Modal */}
      {isTrackOrderOpen && (
        <div className="modal-overlay" onClick={() => setIsTrackOrderOpen(false)}>
          <div className="track-order-modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>📦</span>
                <span className="modal-title" style={{ fontSize: '13px', letterSpacing: '0.06em' }}>
                  CUSTOMER ORDER STATUS // TRACKING PORTAL
                </span>
              </div>
              <button
                type="button"
                className="close-btn"
                onClick={() => setIsTrackOrderOpen(false)}
              >
                [CLOSE]
              </button>
            </div>

            <div className="modal-body track-order-modal-body">
              {/* Search Form */}
              <form
                className="track-search-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleTrackOrderSearch();
                }}
              >
                <div className="track-search-field">
                  <label htmlFor="track-order-input" className="field-label">
                    ENTER TRACKING NUMBER OR ORDER ID
                  </label>
                  <div className="track-search-input-wrap">
                    <input
                      id="track-order-input"
                      type="text"
                      className="field-input track-search-input"
                      placeholder="e.g. RNR-SPT-167954 or RNT-98124801"
                      value={trackOrderQuery}
                      onChange={(e) => setTrackOrderQuery(e.target.value)}
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="track-search-btn"
                    >
                      Track Order →
                    </button>
                  </div>
                  <div className="track-helper-text">
                    Provide your tracking code to review payment verification and live courier delivery status.
                  </div>
                </div>
              </form>

              {/* Not found state */}
              {trackSearched && !trackedOrder && (
                <div className="track-not-found-card">
                  <div className="track-not-found-icon">⚠️</div>
                  <div className="track-not-found-content">
                    <h3 className="track-not-found-title">No Order Found</h3>
                    <p className="track-not-found-desc">
                      No order found matching <code className="track-code-quote">"{trackOrderQuery}"</code>.
                    </p>
                    <ul className="track-not-found-tips">
                      <li>Check for typos in your Order ID (starts with <code>RNR-SPT-</code>).</li>
                      <li>If dispatched, you can also enter your courier waybill (e.g. <code>RNT-...</code>).</li>
                      <li>Payment verification is reviewed directly by the store administrator.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Found order state */}
              {trackedOrder && (
                <div className="track-order-result-card">
                  <div className="track-result-header">
                    <div>
                      <div className="track-result-ord-id">ORDER #{trackedOrder.orderId}</div>
                      <div className="track-result-date">
                        Placed on {new Date(trackedOrder.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="track-result-total">
                      ₱{trackedOrder.total?.toLocaleString()}
                    </div>
                  </div>

                  {/* Stepper Timeline */}
                  <div className="track-status-stepper">
                    <div className="stepper-step step-done">
                      <div className="stepper-dot">✓</div>
                      <div className="stepper-label">
                        <strong>Order Placed</strong>
                        <span>Recorded in System</span>
                      </div>
                    </div>

                    <div className={`stepper-connector ${trackedOrder.receipt || trackedOrder.dispatch ? 'connector-done' : ''}`} />

                    <div className={`stepper-step ${trackedOrder.receipt || trackedOrder.dispatch ? 'step-done' : 'step-current'}`}>
                      <div className="stepper-dot">
                        {trackedOrder.receipt || trackedOrder.dispatch ? '✓' : '⏳'}
                      </div>
                      <div className="stepper-label">
                        <strong>Admin Verification</strong>
                        <span>
                          {trackedOrder.receipt || trackedOrder.dispatch
                            ? 'Payment Verified'
                            : 'Pending Admin Review'}
                        </span>
                      </div>
                    </div>

                    <div className={`stepper-connector ${trackedOrder.dispatch ? 'connector-done' : ''}`} />

                    <div className={`stepper-step ${trackedOrder.dispatch ? 'step-done' : 'step-upcoming'}`}>
                      <div className="stepper-dot">
                        {trackedOrder.dispatch ? '🚚' : '3'}
                      </div>
                      <div className="stepper-label">
                        <strong>Courier Dispatch</strong>
                        <span>
                          {trackedOrder.dispatch
                            ? `Dispatched via ${trackedOrder.dispatch.courier}`
                            : 'Awaiting Handover'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Banner */}
                  <div className="track-verification-banner">
                    {trackedOrder.dispatch ? (
                      <div className="track-alert track-alert-dispatched">
                        <div className="track-alert-heading">
                          <span>🚚</span> <strong>PACKAGE DISPATCHED // LIVE COURIER TRACKING ACTIVE</strong>
                        </div>
                        <div className="track-alert-body">
                          <div>Courier: <strong>{trackedOrder.dispatch.courier}</strong></div>
                          <div>Waybill / Tracking No.: <strong className="track-waybill-text">{trackedOrder.dispatch.trackingNumber}</strong></div>
                          {trackedOrder.dispatch.trackingUrl && (
                            <a
                              href={trackedOrder.dispatch.trackingUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="track-live-external-btn"
                            >
                              Track Live on {trackedOrder.dispatch.courier} Portal →
                            </a>
                          )}
                        </div>
                      </div>
                    ) : trackedOrder.receipt ? (
                      <div className="track-alert track-alert-verified">
                        <div className="track-alert-heading">
                          <span>✓</span> <strong>PAYMENT VERIFIED BY ADMIN // RECEIPT ISSUED</strong>
                        </div>
                        <div className="track-alert-body">
                          <div>Receipt Number: <strong>{trackedOrder.receipt.receiptNumber}</strong></div>
                          <div>Verified Date: <strong>{new Date(trackedOrder.receipt.sentAt).toLocaleDateString()}</strong></div>
                          <div style={{ marginTop: '4px' }}>
                            Your sportswear garments are currently in fulfillment and being prepared for courier pickup.
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="track-alert track-alert-pending">
                        <div className="track-alert-heading">
                          <span>⏳</span> <strong>AWAITING ADMIN PAYMENT VERIFICATION</strong>
                        </div>
                        <div className="track-alert-body">
                          <div>Payment Method: <strong>{trackedOrder.payment.method?.toUpperCase()}</strong></div>
                          {trackedOrder.payment.gcashRefNumber && (
                            <div>GCash Ref #: <strong>{trackedOrder.payment.gcashRefNumber}</strong></div>
                          )}
                          {trackedOrder.payment.bankRefNumber && (
                            <div>Bank Ref #: <strong>{trackedOrder.payment.bankRefNumber}</strong></div>
                          )}
                          <div className="admin-responsibility-note">
                            ℹ <strong>Verification Responsibility:</strong> Official payment verification is conducted exclusively by RNR administrators. Please allow admin time to verify the reference number with GCash/Bank records. Status will update here once approved.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Details Grid */}
                  <div className="track-details-grid">
                    <div className="track-detail-box">
                      <div className="track-detail-title">DELIVERY DESTINATION</div>
                      <div className="track-detail-line"><strong>Recipient:</strong> {trackedOrder.customer.name}</div>
                      <div className="track-detail-line"><strong>Contact:</strong> {trackedOrder.customer.phone}</div>
                      <div className="track-detail-line"><strong>Address:</strong> {trackedOrder.customer.address}, {trackedOrder.customer.city}</div>
                      <div className="track-detail-line"><strong>Region:</strong> {trackedOrder.customer.region?.replace(/_/g, ' ')?.toUpperCase()}</div>
                    </div>

                    <div className="track-detail-box">
                      <div className="track-detail-title">ORDER SUMMARY</div>
                      <div className="track-items-mini-list">
                        {trackedOrder.items?.map((it, idx) => (
                          <div key={idx} className="track-item-mini-row">
                            <img
                              src={it.image || '/Photocards/1.jpeg'}
                              alt={it.title}
                              className="track-item-mini-img"
                            />
                            <div className="track-item-mini-info">
                              <span className="track-item-mini-title">{it.title}</span>
                              <span className="track-item-mini-sub">
                                Size: {it.size} {it.color ? `• ${it.color}` : ''} × {it.quantity}
                              </span>
                            </div>
                            <span className="track-item-mini-price">
                              ₱{(it.price * it.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="track-subtotal-row">
                        <span>Shipping Fee:</span>
                        <span>₱{trackedOrder.shippingFee || 0}</span>
                      </div>
                      <div className="track-total-row">
                        <span>Grand Total:</span>
                        <span style={{ color: 'var(--rnr-coral)', fontWeight: 800 }}>
                          ₱{trackedOrder.total?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="track-actions-row">
                    <button
                      type="button"
                      className="track-another-btn"
                      onClick={() => {
                        setTrackedOrder(null);
                        setTrackOrderQuery('');
                        setTrackSearched(false);
                      }}
                    >
                      ← Track Another Order
                    </button>
                    <button
                      type="button"
                      className="track-close-action-btn"
                      onClick={() => setIsTrackOrderOpen(false)}
                    >
                      Close Tracker
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Product Confirmation Modal */}
      {productToDelete && (
        <div className="modal-overlay" onClick={() => setProductToDelete(null)}>
          <div className="confirm-modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--status-red)' }}>
                CONFIRM DELETION // CATALOG
              </span>
              <button className="close-btn" onClick={() => setProductToDelete(null)}>[CLOSE]</button>
            </div>
            <div className="confirm-modal-body">
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                {productToDelete.image && (
                  <img
                    src={productToDelete.image}
                    alt={productToDelete.title}
                    style={{ width: '60px', height: '60px', objectFit: 'cover', border: '1px solid var(--border-light)' }}
                  />
                )}
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
                    Delete "{productToDelete.title}"?
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {productToDelete.category} // ₱{productToDelete.price.toLocaleString()}
                  </p>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5', marginTop: '14px' }}>
                This item will be permanently removed from the store catalog, inventory records, and active customer bags.
              </p>
              <div className="confirm-modal-actions">
                <button
                  type="button"
                  className="admin-cancel-btn"
                  onClick={() => setProductToDelete(null)}
                >
                  Keep Product
                </button>
                <button
                  type="button"
                  className="admin-delete-btn confirm"
                  onClick={() => {
                    handleDeleteProduct(productToDelete.id, productToDelete.title);
                  }}
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Courier Dispatch Modal */}
      {dispatchModalOrder && (
        <div className="modal-overlay" onClick={() => setDispatchModalOrder(null)}>
          <div className="checkout-modal-card" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Dispatch &amp; Email Tracking</h2>
              <button className="close-btn" onClick={() => setDispatchModalOrder(null)}>[CLOSE]</button>
            </div>
            <form onSubmit={handleConfirmDispatch} className="modal-body">
              <div style={{ background: '#EFF6FF', border: '1px solid #3B82F6', padding: '12px', fontSize: '12px', fontFamily: 'var(--font-mono)', color: '#1E40AF' }}>
                Dispatching Order <strong>#{dispatchModalOrder.orderId}</strong> for <strong>{dispatchModalOrder.customer.name}</strong>.<br />
                Tracking details will be automatically emailed to <strong>{dispatchModalOrder.customer.email}</strong>.
              </div>

              <div className="form-field">
                <label className="field-label">Courier Service</label>
                <select
                  className="field-select"
                  value={dispatchCourier}
                  onChange={e => {
                    setDispatchCourier(e.target.value);
                    const prefix = e.target.value.includes('RNT') ? 'RNT' : e.target.value.includes('LBC') ? 'LBC' : 'LLM';
                    setDispatchTrackingNum(`${prefix}-${Date.now().toString().slice(-8)}`);
                  }}
                >
                  <option value="RNT Express">RNT Express (Official Store Logistics)</option>
                  <option value="LBC Express">LBC Express (Door to Door / Branch Pick-up)</option>
                  <option value="Lalamove">Lalamove (Same-Day Express)</option>
                  <option value="2GO Express">2GO Express Delivery</option>
                </select>
              </div>

              <div className="form-field">
                <label className="field-label">Waybill / Tracking Number</label>
                <input
                  type="text"
                  className="field-input"
                  value={dispatchTrackingNum}
                  onChange={e => setDispatchTrackingNum(e.target.value)}
                  required
                  placeholder="e.g. RNT-98214810"
                />
              </div>

              <div className="form-field">
                <label className="field-label">Customer Email Address</label>
                <input
                  type="email"
                  className="field-input"
                  value={dispatchModalOrder.customer.email}
                  disabled
                  style={{ opacity: 0.85, background: 'var(--surface-alt)' }}
                />
              </div>

              <button type="submit" className="checkout-action-btn">
                Confirm Dispatch &amp; Send Tracking Email →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Customer Email Notification Preview Modal */}
      {activeEmailModal && (
        <div className="modal-overlay" onClick={() => setActiveEmailModal(null)}>
          <div className="checkout-modal-card email-preview-card" style={{ maxWidth: '620px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header" style={{ background: '#141312', color: '#FAF9F6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '15px' }}>✉</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em' }}>
                  CUSTOMER EMAIL NOTIFICATION // DISPATCH SIMULATION
                </span>
              </div>
              <button className="close-btn" style={{ color: '#FFF', borderColor: '#444' }} onClick={() => setActiveEmailModal(null)}>[CLOSE]</button>
            </div>

            <div className="modal-body email-preview-body" style={{ padding: '20px' }}>
              {/* Email Header Details */}
              <div className="email-meta-box">
                <div className="email-meta-row">
                  <span className="email-meta-key">FROM:</span>
                  <span>RNR OnlineShop Dispatch &lt;orders@rnr-onlineshop.ph&gt;</span>
                </div>
                <div className="email-meta-row">
                  <span className="email-meta-key">TO:</span>
                  <strong>{activeEmailModal.to}</strong>
                </div>
                <div className="email-meta-row">
                  <span className="email-meta-key">SUBJECT:</span>
                  <strong>{activeEmailModal.subject}</strong>
                </div>
                <div className="email-meta-row">
                  <span className="email-meta-key">DATE:</span>
                  <span>{new Date(activeEmailModal.timestamp).toLocaleString()}</span>
                </div>
              </div>

              {/* Email Content Body */}
              <div className="email-letterhead">
                <div className="email-brand-row">
                  <img src="/Photocards/RNR.jpg" alt="RNR Logo" className="rnr-brand-logo-img" style={{ width: '36px', height: '36px' }} />
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800 }}>RNR OnlineShop</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--rnr-coral)', letterSpacing: '0.08em' }}>HIGH-PERFORMANCE SPORTSWEAR &amp; CYCLING APPAREL</div>
                  </div>
                </div>

                {activeEmailModal.type === 'RECEIPT' && (
                  <div className="email-receipt-section">
                    <div style={{ background: '#D1FAE5', border: '1px solid #10B981', color: '#065F46', padding: '10px 14px', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700 }}>
                      ✓ Official Payment Receipt #{activeEmailModal.receiptNumber} — Verified
                    </div>

                    <p style={{ fontSize: '13px', lineHeight: '1.5', marginTop: '12px' }}>
                      Dear <strong>{activeEmailModal.order?.customer?.name || 'Customer'}</strong>,<br />
                      Thank you for your order! Your payment has been confirmed and verified by our fulfillment team. Your sportswear garments are now being prepared for dispatch.
                    </p>

                    <div className="receipt-items-table-wrap">
                      <table className="receipt-table">
                        <thead>
                          <tr>
                            <th>Item Description</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeEmailModal.order?.items?.map((it, idx) => (
                            <tr key={idx}>
                              <td>
                                <strong>{it.title}</strong>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                  Size: {it.size} {it.color ? `• Color: ${it.color}` : ''}
                                </div>
                              </td>
                              <td>{it.quantity}</td>
                              <td>₱{it.price.toLocaleString()}</td>
                              <td>₱{(it.price * it.quantity).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan="3" style={{ textAlign: 'right' }}>Shipping:</td>
                            <td>₱{activeEmailModal.order?.shippingFee}</td>
                          </tr>
                          <tr style={{ fontWeight: 800, fontSize: '14px' }}>
                            <td colSpan="3" style={{ textAlign: 'right' }}>Total Paid:</td>
                            <td style={{ color: 'var(--rnr-coral)' }}>₱{activeEmailModal.order?.total?.toLocaleString()}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', background: 'var(--surface-alt)', padding: '10px', marginTop: '10px' }}>
                      Delivery Address: {activeEmailModal.order?.customer?.address}, {activeEmailModal.order?.customer?.city}<br />
                      Contact: {activeEmailModal.order?.customer?.phone}
                    </div>
                  </div>
                )}

                {activeEmailModal.type === 'DISPATCH_TRACKING' && (
                  <div className="email-dispatch-section">
                    <div style={{ background: '#DBEAFE', border: '1px solid #3B82F6', color: '#1E40AF', padding: '10px 14px', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700 }}>
                      🚚 Package Dispatched — Live Courier Tracking Activated
                    </div>

                    <p style={{ fontSize: '13px', lineHeight: '1.5', marginTop: '12px' }}>
                      Dear <strong>{activeEmailModal.order?.customer?.name || 'Customer'}</strong>,<br />
                      Great news! Your sportswear package has been dispatched via <strong>{activeEmailModal.courier}</strong> for delivery to your address.
                    </p>

                    <div className="tracking-info-card">
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>COURIER PARTNER</div>
                      <div style={{ fontSize: '16px', fontWeight: 800 }}>{activeEmailModal.courier}</div>
                      
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>WAYBILL / TRACKING NUMBER</div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--rnr-coral)', letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>
                        {activeEmailModal.trackingNumber}
                      </div>

                      <div style={{ marginTop: '14px' }}>
                        <a
                          href={activeEmailModal.trackingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="track-live-btn"
                        >
                          Track Your Parcel Online →
                        </a>
                      </div>
                    </div>

                    <div className="tracking-guide-box">
                      <h4 style={{ fontSize: '12px', fontWeight: 800, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '6px' }}>
                        How to Track Your Order:
                      </h4>
                      <ol style={{ paddingLeft: '18px', fontSize: '12px', lineHeight: '1.6', color: 'var(--text-muted)' }}>
                        <li>Click the <strong>Track Your Parcel Online</strong> button above.</li>
                        <li>Waybill number: <code>{activeEmailModal.trackingNumber}</code>.</li>
                        <li>View real-time courier checkpoints from sorting hub to out-for-delivery rider.</li>
                        <li>Keep your mobile phone active ({activeEmailModal.order?.customer?.phone}) for delivery dispatch SMS/call.</li>
                      </ol>
                    </div>
                  </div>
                )}

                {activeEmailModal.type === 'ORDER_PLACED' && (
                  <div style={{ fontSize: '13px', lineHeight: '1.5' }}>
                    <div style={{ background: '#FEF3C7', border: '1px solid #F59E0B', color: '#92400E', padding: '10px 14px', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, marginBottom: '10px' }}>
                      ⏳ Order Placed — Payment Verification in Progress
                    </div>
                    <p>Your order has been registered in the RNR OnlineShop system. Once your payment is verified by our team, an official receipt will be generated and dispatched to this email.</p>
                  </div>
                )}
              </div>

              {/* Direct Real Email Transmission Button — ADMIN EXCLUSIVE */}
              {isAdminLoggedIn ? (
                <div style={{ marginTop: '4px', paddingTop: '14px', borderTop: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      REAL GMAIL TRANSMISSION (EMAILJS) // ADMIN VERIFICATION ONLY:
                    </span>
                    {emailConfig.serviceId && emailConfig.publicKey ? (
                      <span style={{ fontSize: '10px', color: '#065F46', background: '#D1FAE5', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                        ✓ Service Configured
                      </span>
                    ) : (
                      <span style={{ fontSize: '10px', color: '#92400E', background: '#FEF3C7', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                        ⚠️ Setup Required in Admin
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="admin-action-btn"
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#10B981',
                      color: '#FFFFFF',
                      borderColor: '#059669',
                      fontWeight: 800,
                      fontSize: '11px',
                      letterSpacing: '0.05em',
                      marginBottom: '8px'
                    }}
                    disabled={isSendingTestEmail}
                    onClick={async () => {
                      const recipient = activeEmailModal.to;
                      const tId = activeEmailModal.type === 'RECEIPT' 
                        ? (emailConfig.receiptTemplateId?.trim() || emailConfig.dispatchTemplateId?.trim())
                        : (emailConfig.dispatchTemplateId?.trim() || emailConfig.receiptTemplateId?.trim());

                      if (!emailConfig.serviceId || !emailConfig.publicKey || !tId) {
                        showToast('Please configure your EmailJS credentials in the Admin Portal -> Email Delivery tab first!');
                        return;
                      }

                      const itemsList = activeEmailModal.order?.items || [];
                      const ordersArray = itemsList.map(it => ({
                        name: `${it.title}${it.size ? ` (${it.size})` : ''}${it.color ? ` • ${it.color}` : ''}`,
                        units: it.quantity,
                        price: it.price?.toLocaleString(),
                        image_url: it.image?.startsWith('http') ? it.image : (window.location.origin + (it.image || '/Photocards/1.jpeg'))
                      }));

                      const params = {
                        email: recipient,
                        to_email: recipient,
                        to_name: activeEmailModal.order?.customer?.name || 'Valued Athlete',
                        subject: activeEmailModal.subject,
                        order_id: activeEmailModal.order?.orderId || 'RNR-ORDER',
                        receipt_number: activeEmailModal.receiptNumber || `RCPT-${activeEmailModal.order?.orderId || '001'}`,
                        payment_method: activeEmailModal.order?.payment?.method?.toUpperCase() || 'GCASH',
                        payment_ref: activeEmailModal.order?.payment?.gcashRefNumber || activeEmailModal.order?.payment?.bankRefNumber || 'N/A',
                        orders: ordersArray,
                        cost: {
                          shipping: activeEmailModal.order?.shippingFee ? activeEmailModal.order.shippingFee.toLocaleString() : '0',
                          tax: '0 (VAT Inclusive)',
                          total: activeEmailModal.order?.total ? activeEmailModal.order.total.toLocaleString() : '0',
                        },
                        total_amount: activeEmailModal.order ? `₱${activeEmailModal.order.total?.toLocaleString()}` : '',
                        customer_address: `${activeEmailModal.order?.customer?.address || ''}, ${activeEmailModal.order?.customer?.city || ''}`,
                        items_summary: itemsList.map(it => `${it.title} (${it.size}) x${it.quantity}`).join(', ') || '',
                        courier: activeEmailModal.courier || '',
                        tracking_number: activeEmailModal.trackingNumber || '',
                        tracking_url: activeEmailModal.trackingUrl || '',
                        date: new Date().toLocaleDateString(),
                        message: activeEmailModal.type === 'RECEIPT'
                          ? `Your official payment receipt for order #${activeEmailModal.order?.orderId} has been verified by RNR OnlineShop.`
                          : `Your order #${activeEmailModal.order?.orderId} has been dispatched via ${activeEmailModal.courier}. Tracking: ${activeEmailModal.trackingNumber}`
                      };

                      const res = await sendRealEmail({ templateId: tId, templateParams: params });
                      setIsSendingTestEmail(false);
                      if (res.success) {
                        showToast(`✓ Real email successfully delivered to ${recipient}! Check Gmail inbox.`);
                      } else {
                        showToast(`❌ EmailJS Error: ${res.error}`);
                      }
                    }}
                  >
                    {isSendingTestEmail ? 'Transmitting to Gmail...' : `🚀 Send Real Email to Customer's Gmail (${activeEmailModal.to})`}
                  </button>
                </div>
              ) : (
                <div style={{ marginTop: '12px', padding: '12px 14px', background: 'var(--surface-alt)', border: '1px solid var(--border-light)', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  🔒 <strong>Verification Responsibility Notice:</strong> Official receipt transmission and payment verification are restricted to authenticated RNR Administrators only. Customers can review live order status anytime using the <strong>Track Order</strong> portal with their Order ID.
                </div>
              )}

              <button className="checkout-action-btn" onClick={() => setActiveEmailModal(null)}>
                Close Email Notification Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Quick Support / Track Order Button (matches reference image bottom right) */}
      {!isAdminView && (
        <button
          type="button"
          className="floating-help-btn"
          onClick={() => {
            setIsTrackOrderOpen(true);
            setTrackSearched(false);
            setTrackedOrder(null);
          }}
          title="Track your order or get help"
        >
          💬
        </button>
      )}
    </div>
  );
}
