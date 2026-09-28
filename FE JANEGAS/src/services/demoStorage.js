/**
 * Elpis Interactive Demo Session Storage & Mathematical State Engine
 * 
 * Manages an isolated, reactive in-browser demo state stored in sessionStorage.
 * All mutations (sales, restocks, B2B order status, events) execute exact
 * mathematical formulas for HPP (65.2%), revenue, gross profit, inventory deduction,
 * and balance sheet updates, persisting seamlessly across user refreshes during their demo session.
 */

const STORAGE_KEY = 'elpis_demo_persistent_data';
const LEGACY_STORAGE_KEY = 'elpis_demo_session_data';

export const INITIAL_PRODUCTS = [
  {
    id: 1,
    sku: "DEPIK-ORI-150",
    name: "Basreng Ikan Depik Original 150g",
    price: 30000,
    stock_quantity: 2, // Sisa persediaan akhir per Juni 2026 sesuai Neraca Excel (Total 5 unit = Rp 97.815)
    tagline: "Sumber Protein Rendah Minyak",
    description: "Camilan lokal renyah olahan Ikan Depik khas Danau Laut Tawar Aceh Tengah dengan bumbu original gurih. Sumber protein tinggi dan rendah minyak.",
    legality_nib: "1234567890123",
    legality_hki: "IDS000012345",
    legality_sppirt: "P-IRT 2021104010123-26",
    legality_halal: "ID112100009882540924",
    image: "/basreng-ikan-depik.png",
    nutrition_info: "Kalori: 320kkal, Protein: 42g, Lemak: 12g, Karbohidrat: 0g, Kalsium: 150mg",
    origin: "Danau Laut Tawar, Takengon, Aceh Tengah"
  },
  {
    id: 2,
    sku: "DEPIK-SPD-150",
    name: "Basreng Ikan Depik Pedas Daun Jeruk 150g",
    price: 30000,
    stock_quantity: 2,
    tagline: "Sumber Protein Rendah Minyak",
    description: "Camilan lokal renyah olahan Ikan Depik khas Danau Laut Tawar Aceh Tengah dengan bumbu pedas daun jeruk aromatik gurih.",
    legality_nib: "1234567890123",
    legality_hki: "IDS000012345",
    legality_sppirt: "P-IRT 2021104010123-26",
    legality_halal: "ID112100009882540924",
    image: "/basreng-ikan-depik.png",
    nutrition_info: "Kalori: 340kkal, Protein: 40g, Lemak: 14g, Karbohidrat: 2g, Kalsium: 145mg",
    origin: "Danau Laut Tawar, Takengon, Aceh Tengah"
  },
  {
    id: 3,
    sku: "DEPIK-BLD-150",
    name: "Basreng Ikan Depik Balado 150g",
    price: 30000,
    stock_quantity: 1,
    tagline: "Sumber Protein Rendah Minyak",
    description: "Camilan lokal renyah olahan Ikan Depik khas Danau Laut Tawar Aceh Tengah dengan racikan bumbu balado pedas gurih.",
    legality_nib: "1234567890123",
    legality_hki: "IDS000012345",
    legality_sppirt: "P-IRT 2021104010123-26",
    legality_halal: "ID112100009882540924",
    image: "/basreng-ikan-depik.png",
    nutrition_info: "Kalori: 350kkal, Protein: 39g, Lemak: 15g, Karbohidrat: 3g, Kalsium: 140mg",
    origin: "Danau Laut Tawar, Takengon, Aceh Tengah"
  }
];

export const INITIAL_RAW_MATERIALS = [
  { id: 1, name: "Ikan Depik Kering", stock_quantity: 15.5, unit: "kg", min_threshold: 10.0 },
  { id: 2, name: "Kemasan Standing Pouch 150g", stock_quantity: 320.0, unit: "pcs", min_threshold: 50.0 },
  { id: 3, name: "Bumbu Tradisional & Garam Gayo", stock_quantity: 12.0, unit: "kg", min_threshold: 4.0 }
];

export const INITIAL_EVENTS = [
  { id: 1, name: "Car Free Day Banda Aceh", start_date: "2025-08-01", end_date: "2026-06-30", event_type: "CFD", coefficient: 1.8 },
  { id: 2, name: "Expo Mahasiswa 2025", start_date: "2025-10-20", end_date: "2025-10-25", event_type: "expo", coefficient: 2.0 },
  { id: 3, name: "Meuseuraya Festival", start_date: "2025-11-12", end_date: "2025-11-15", event_type: "bazar", coefficient: 1.5 },
  { id: 4, name: "Aceh UMKM Expo", start_date: "2026-02-05", end_date: "2026-02-08", event_type: "expo", coefficient: 1.6 }
];

// 11 Bulan Traksi Pelanggan Resmi (Agustus 2025 - Juni 2026) dari Sheet 'traction (2)'
export const INITIAL_TRACTION_DATA = [
  { month: 'Agustus 2025', shortMonth: 'Agu 25', totalCustomers: 22, repeatCustomers: 3, crp: 0.14, crpPercent: 14, analysis: 'Produk mulai dikenal di lingkungan sekitar' },
  { month: 'September 2025', shortMonth: 'Sep 25', totalCustomers: 30, repeatCustomers: 6, crp: 0.20, crpPercent: 20, analysis: 'Promosi media sosial mulai digencarkan sehingga penjualan meningkat' },
  { month: 'Oktober 2025', shortMonth: 'Okt 25', totalCustomers: 38, repeatCustomers: 10, crp: 0.26, crpPercent: 26, analysis: 'Produk mendapat respon positif' },
  { month: 'November 2025', shortMonth: 'Nov 25', totalCustomers: 45, repeatCustomers: 15, crp: 0.33, crpPercent: 33, analysis: 'Konsumen puas dan mulai melakukan pembelian kembali' },
  { month: 'Desember 2025', shortMonth: 'Des 25', totalCustomers: 43, repeatCustomers: 16, crp: 0.37, crpPercent: 37, analysis: 'Pelanggan mulai merekomendasikan produk (word of mouth)' },
  { month: 'Januari 2026', shortMonth: 'Jan 26', totalCustomers: 40, repeatCustomers: 17, crp: 0.43, crpPercent: 43, analysis: 'Loyalitas terbentuk' },
  { month: 'Februari 2026', shortMonth: 'Feb 26', totalCustomers: 37, repeatCustomers: 17, crp: 0.46, crpPercent: 46, analysis: 'Pelanggan mulai stabil' },
  { month: 'Maret 2026', shortMonth: 'Mar 26', totalCustomers: 34, repeatCustomers: 16, crp: 0.47, crpPercent: 47, analysis: 'Loyalitas pelanggan terjaga dan meningkat' },
  { month: 'April 2026', shortMonth: 'Apr 26', totalCustomers: 32, repeatCustomers: 16, crp: 0.50, crpPercent: 50, analysis: 'Retensi pembeli stabil' },
  { month: 'Mei 2026', shortMonth: 'Mei 26', totalCustomers: 26, repeatCustomers: 14, crp: 0.54, crpPercent: 54, analysis: 'Retensi pembeli meningkat' },
  { month: 'Juni 2026', shortMonth: 'Jun 26', totalCustomers: 28, repeatCustomers: 16, crp: 0.57, crpPercent: 57, analysis: 'Loyalitas tinggi dan repeat order konsisten' }
];

// Perbandingan Kompetitor dari Sheet 'traction (2)' (Aspek, Elpis, PT Kim Manufaktur, Basthreng)
export const COMPETITOR_COMPARISON = [
  {
    aspek: 'Bahan Baku',
    elpis: 'Ikan Depik kering dari Danau Laut Tawar, Aceh Tengah',
    kim: 'Ikan olahan umum, dominan tepung dan perasa buatan',
    basthreng: 'Ikan tenggiri, dominan tepung dan bumbu pedas'
  },
  {
    aspek: 'Nilai Gizi',
    elpis: 'Tinggi (protein, omega-3, mikronutrien)',
    kim: 'Cenderung rendah karena tidak disebutkan jenis ikan dan banyak perasa buatan',
    basthreng: 'Cenderung rendah karena banyak mengandung perasa buatan'
  },
  {
    aspek: 'Rasa',
    elpis: 'Autentik, gurih, alami',
    kim: 'Dominasi perasa buatan',
    basthreng: 'Dominasi perasa buatan'
  },
  {
    aspek: 'Harga / Berat',
    elpis: 'Rp 30.000 / 150 gram',
    kim: 'Rp 14.000 / 100 gram',
    basthreng: 'Rp 50.000 / 250 gram'
  },
  {
    aspek: 'Target Pasar',
    elpis: 'Remaja dan keluarga sehat sadar gizi',
    kim: 'Masyarakat umum yang sensitif terhadap harga tinggi',
    basthreng: 'Remaja dan dewasa penggemar camilan pedas'
  }
];


export const INITIAL_SALES = [
  { id: 1, product_id: 1, quantity: 5, sale_date: "2025-08-10", channel: "CFD", revenue: 150000 },
  { id: 2, product_id: 2, quantity: 5, sale_date: "2025-08-15", channel: "Shopee", revenue: 150000 },
  { id: 3, product_id: 3, quantity: 5, sale_date: "2025-08-20", channel: "WhatsApp", revenue: 150000 },
  { id: 4, product_id: 1, quantity: 10, sale_date: "2025-09-05", channel: "TikTok Shop", revenue: 300000 },
  { id: 5, product_id: 2, quantity: 10, sale_date: "2025-09-18", channel: "Instagram", revenue: 300000 },
  { id: 6, product_id: 1, quantity: 15, sale_date: "2025-10-22", channel: "Bazar/Expo", revenue: 450000 },
  { id: 7, product_id: 3, quantity: 10, sale_date: "2025-10-24", channel: "WhatsApp", revenue: 300000 },
  { id: 8, product_id: 1, quantity: 20, sale_date: "2025-11-13", channel: "Bazar/Expo", revenue: 600000 },
  { id: 9, product_id: 2, quantity: 15, sale_date: "2025-11-14", channel: "Shopee", revenue: 450000 },
  { id: 10, product_id: 1, quantity: 15, sale_date: "2025-12-10", channel: "CFD", revenue: 450000 },
  { id: 11, product_id: 3, quantity: 15, sale_date: "2025-12-25", channel: "Shopee", revenue: 450000 },
  { id: 12, product_id: 1, quantity: 20, sale_date: "2026-01-05", channel: "TikTok Shop", revenue: 600000 },
  { id: 13, product_id: 2, quantity: 12, sale_date: "2026-01-20", channel: "WhatsApp", revenue: 360000 },
  { id: 14, product_id: 1, quantity: 25, sale_date: "2026-02-06", channel: "Bazar/Expo", revenue: 750000 },
  { id: 15, product_id: 3, quantity: 15, sale_date: "2026-02-08", channel: "Shopee", revenue: 450000 },
  { id: 16, product_id: 1, quantity: 28, sale_date: "2026-03-12", channel: "TikTok Shop", revenue: 840000 },
  { id: 17, product_id: 2, quantity: 20, sale_date: "2026-03-24", channel: "WhatsApp", revenue: 600000 },
  { id: 18, product_id: 1, quantity: 20, sale_date: "2026-04-10", channel: "CFD", revenue: 600000 },
  { id: 19, product_id: 3, quantity: 15, sale_date: "2026-04-22", channel: "Instagram", revenue: 450000 },
  { id: 20, product_id: 1, quantity: 25, sale_date: "2026-05-21", channel: "Bazar/Expo", revenue: 750000 },
  { id: 21, product_id: 2, quantity: 20, sale_date: "2026-05-22", channel: "Shopee", revenue: 600000 },
  { id: 22, product_id: 1, quantity: 30, sale_date: "2026-06-15", channel: "TikTok Shop", revenue: 900000 },
  { id: 23, product_id: 3, quantity: 20, sale_date: "2026-06-25", channel: "WhatsApp", revenue: 600000 }
];

export const INITIAL_ORDERS = [
  {
    id: 1,
    partner_id: 1,
    partner: { name: 'Swalayan Pante Pirak Takengon', partner_type: 'swalayan' },
    order_date: "2026-06-15T10:00:00",
    status: "completed",
    total_price: 2400000,
    items: [{ id: 1, product: { name: "Depik Kering Original 150g" }, quantity: 80 }]
  },
  {
    id: 2,
    partner_id: 2,
    partner: { name: 'Koperasi MBG (Makan Bergizi Gratis)', partner_type: 'SPPG' },
    order_date: "2026-06-28T14:00:00",
    status: "pending",
    total_price: 3000000,
    items: [{ id: 2, product: { name: "Depik Kering Pedas 150g" }, quantity: 100 }]
  }
];

export const DEFAULT_FINANCIAL_CONFIG = {
  hpp_ratio: 0.652,                 // 65.2% (19.563 / 30.000)
  unit_hpp: 19563,                  // Rp 19.563 / pcs (sesuai Sheet HPP)
  unit_price: 30000,                // Rp 30.000 / pcs
  supplies_ratio: 0.016,            // 1.6%
  fixed_supplies: 185000,           // Rp 185.000 beban pemakaian perlengkapan (sesuai Sheet LABA RUGI)
  fixed_depreciation: 130540,       // Rp 130.540
  fixed_op_other: 500000,           // Rp 500.000
  fixed_equipment: 2127000,         // Rp 2.127.000
  fixed_ip: 750000,                 // Rp 750.000
  fixed_initial_capital: 2844275,   // Rp 2.844.275
  fish_per_pouch_kg: 0.075,         // 0.075 kg (75g sesuai Sheet HPP)
  spice_per_pouch_kg: 0.02,         // 0.02 kg
  weekly_capacity: 200,             // 200 pcs
  safety_buffer: 1.1                // 10%
};

export const calculateAIProductionForecast = (salesData, rmData, config = DEFAULT_FINANCIAL_CONFIG) => {
  const safeSales = Array.isArray(salesData) ? salesData : [];
  const safeRM = Array.isArray(rmData) ? rmData : [];

  const totalWeeklySales = safeSales.slice(0, 15).reduce((sum, s) => sum + (Number(s?.quantity) || 0), 0);
  const avgWeeklySales = Math.round(totalWeeklySales / 2) || 25;

  const rOriginal = Math.round(avgWeeklySales * 0.5) + 5;
  const rSpicy = Math.round(avgWeeklySales * 0.3) + 3;
  const rBalado = Math.round(avgWeeklySales * 0.2) + 2;
  const totalRecommend = Math.min(rOriginal + rSpicy + rBalado, config?.weekly_capacity || 200);

  // Rasio konversi dinamis dari konfigurasi (0.075 kg = 75 gram ikan per bungkus)
  const fishRatio = config?.fish_per_pouch_kg || 0.075;
  const spiceRatio = config?.spice_per_pouch_kg || 0.02;

  const requiredFish = parseFloat((totalRecommend * fishRatio).toFixed(2));
  const requiredPouch = totalRecommend;
  const requiredSpice = parseFloat((totalRecommend * spiceRatio).toFixed(2));

  const fishRM = safeRM.find(rm => rm?.name && (rm.name.toLowerCase().includes("ikan") || rm.name.toLowerCase().includes("depik"))) || {
    name: "Ikan Depik Kering",
    stock_quantity: 15.5,
    unit: "kg"
  };
  const pouchRM = safeRM.find(rm => rm?.name && (rm.name.toLowerCase().includes("kemasan") || rm.name.toLowerCase().includes("pouch"))) || {
    name: "Kemasan Standing Pouch 150g",
    stock_quantity: 320,
    unit: "pcs"
  };
  const spiceRM = safeRM.find(rm => rm?.name && (rm.name.toLowerCase().includes("bumbu") || rm.name.toLowerCase().includes("garam"))) || {
    name: "Bumbu Tradisional & Garam Gayo",
    stock_quantity: 12.0,
    unit: "kg"
  };

  const netMargin = Math.max(0.0, 1.0 - (config?.hpp_ratio || 0.652));

  return {
    predicted_demand_pcs: totalRecommend,
    recommended_raw_material_kg: requiredFish,
    explanation: `Target produksi ${totalRecommend} pcs untuk memenuhi estimasi pasar. Butuh ${requiredFish} kg Ikan Depik dari Danau Laut Tawar (Rasio: ${fishRatio} kg/kemasan).`,
    recommendations: [
      { name: "Depik Kering Original 150g", qty: rOriginal, revenue: rOriginal * 30000 },
      { name: "Depik Kering Pedas 150g", qty: rSpicy, revenue: rSpicy * 30000 },
      { name: "Depik Kering Balado 150g", qty: rBalado, revenue: rBalado * 30000 }
    ],
    requirements: [
      {
        name: fishRM.name,
        needed: requiredFish,
        stock: Number(fishRM.stock_quantity) || 0,
        unit: fishRM.unit || "kg",
        lowStock: (Number(fishRM.stock_quantity) || 0) < requiredFish
      },
      {
        name: pouchRM.name,
        needed: requiredPouch,
        stock: Number(pouchRM.stock_quantity) || 0,
        unit: pouchRM.unit || "pcs",
        lowStock: (Number(pouchRM.stock_quantity) || 0) < requiredPouch
      },
      {
        name: spiceRM.name,
        needed: requiredSpice,
        stock: Number(spiceRM.stock_quantity) || 0,
        unit: spiceRM.unit || "kg",
        lowStock: (Number(spiceRM.stock_quantity) || 0) < requiredSpice
      }
    ],
    projected_revenue: totalRecommend * 30000,
    projected_profit: (totalRecommend * 30000) * netMargin
  };
};

export const demoStorage = {
  /**
   * Retrieves the current demo state. If nonexistent, initializes with default template.
   * Uses persistent localStorage so changes are not lost when closing the tab/browser.
   */
  getState: () => {
    try {
      const deletedOrderIds = JSON.parse(localStorage.getItem('elpis_deleted_order_ids') || '[]');
      const filterDeleted = (ordersList) => {
        if (!Array.isArray(ordersList)) return [];
        return ordersList.filter(o => !deletedOrderIds.includes(o.id) && !deletedOrderIds.includes(parseInt(o.id)));
      };

      const stored = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(LEGACY_STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed.financialConfig) {
          parsed.financialConfig = { ...DEFAULT_FINANCIAL_CONFIG };
        }
        if (!parsed.traction) {
          parsed.traction = JSON.parse(JSON.stringify(INITIAL_TRACTION_DATA));
        }
        if (Array.isArray(parsed.orders)) {
          parsed.orders = filterDeleted(parsed.orders);
        }
        return parsed;
      }

      // Check if elpis_persistent_* has data from a previous session
      const pSales = localStorage.getItem('elpis_persistent_sales');
      const pProducts = localStorage.getItem('elpis_persistent_products');
      const pMaterials = localStorage.getItem('elpis_persistent_rawMaterials');
      const pOrders = localStorage.getItem('elpis_persistent_orders');
      const pEvents = localStorage.getItem('elpis_persistent_events');
      const pFin = localStorage.getItem('elpis_financial_config');

      if (pSales || pProducts || pMaterials || pOrders) {
        const unifiedState = {
          products: pProducts ? JSON.parse(pProducts) : JSON.parse(JSON.stringify(INITIAL_PRODUCTS)),
          rawMaterials: pMaterials ? JSON.parse(pMaterials) : JSON.parse(JSON.stringify(INITIAL_RAW_MATERIALS)),
          events: pEvents ? JSON.parse(pEvents) : JSON.parse(JSON.stringify(INITIAL_EVENTS)),
          sales: pSales ? JSON.parse(pSales) : JSON.parse(JSON.stringify(INITIAL_SALES)),
          orders: pOrders ? filterDeleted(JSON.parse(pOrders)) : filterDeleted(JSON.parse(JSON.stringify(INITIAL_ORDERS))),
          traction: JSON.parse(JSON.stringify(INITIAL_TRACTION_DATA)),
          financialConfig: pFin ? JSON.parse(pFin) : { ...DEFAULT_FINANCIAL_CONFIG },
          lastUpdated: new Date().toISOString()
        };
        demoStorage.saveState(unifiedState);
        return unifiedState;
      }
    } catch {
      // Ignore parse/storage errors
    }

    const deletedOrderIds = JSON.parse(localStorage.getItem('elpis_deleted_order_ids') || '[]');
    const initialState = {
      products: JSON.parse(JSON.stringify(INITIAL_PRODUCTS)),
      rawMaterials: JSON.parse(JSON.stringify(INITIAL_RAW_MATERIALS)),
      events: JSON.parse(JSON.stringify(INITIAL_EVENTS)),
      sales: JSON.parse(JSON.stringify(INITIAL_SALES)),
      orders: JSON.parse(JSON.stringify(INITIAL_ORDERS)).filter(o => !deletedOrderIds.includes(o.id) && !deletedOrderIds.includes(parseInt(o.id))),
      traction: JSON.parse(JSON.stringify(INITIAL_TRACTION_DATA)),
      financialConfig: { ...DEFAULT_FINANCIAL_CONFIG },
      lastUpdated: new Date().toISOString()
    };

    demoStorage.saveState(initialState);
    return initialState;
  },

  /**
   * Persists updated state to localStorage (and mirrors across persistent keys for 100% cross-role synchrony).
   */
  saveState: (state) => {
    try {
      state.lastUpdated = new Date().toISOString();
      const serialized = JSON.stringify(state);
      localStorage.setItem(STORAGE_KEY, serialized);
      sessionStorage.setItem(STORAGE_KEY, serialized);
      sessionStorage.setItem(LEGACY_STORAGE_KEY, serialized);

      // Mirror directly to individual persistent keys so founder and demo modes share identical state
      if (Array.isArray(state.sales) && state.sales.length > 0) {
        localStorage.setItem('elpis_persistent_sales', JSON.stringify(state.sales));
      }
      if (Array.isArray(state.products) && state.products.length > 0) {
        localStorage.setItem('elpis_persistent_products', JSON.stringify(state.products));
      }
      if (Array.isArray(state.rawMaterials) && state.rawMaterials.length > 0) {
        localStorage.setItem('elpis_persistent_rawMaterials', JSON.stringify(state.rawMaterials));
      }
      if (Array.isArray(state.orders)) {
        const deletedOrderIds = JSON.parse(localStorage.getItem('elpis_deleted_order_ids') || '[]');
        const cleanedOrders = state.orders.filter(o => !deletedOrderIds.includes(o.id) && !deletedOrderIds.includes(parseInt(o.id)));
        state.orders = cleanedOrders;
        localStorage.setItem('elpis_persistent_orders', JSON.stringify(cleanedOrders));
      }
      if (Array.isArray(state.events) && state.events.length > 0) {
        localStorage.setItem('elpis_persistent_events', JSON.stringify(state.events));
      }
      if (state.financialConfig) {
        localStorage.setItem('elpis_financial_config', JSON.stringify(state.financialConfig));
      }
    } catch (e) {
      console.warn("Failed to persist demo session data to storage:", e);
    }
  },

  /**
   * Resets demo session back to pristine startup template across all storage namespaces.
   */
  resetState: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(LEGACY_STORAGE_KEY);
      localStorage.removeItem('elpis_persistent_sales');
      localStorage.removeItem('elpis_persistent_products');
      localStorage.removeItem('elpis_persistent_rawMaterials');
      localStorage.removeItem('elpis_persistent_orders');
      localStorage.removeItem('elpis_persistent_events');
      localStorage.removeItem('elpis_financial_config');
      localStorage.removeItem('elpis_order_status_overrides');
      localStorage.removeItem('elpis_deleted_order_ids');
    } catch {
      // Ignore
    }
    return demoStorage.getState();
  },

  /**
   * Record a new sale with complete mathematical recalculation:
   * - Deducts finished product stock
   * - Computes revenue
   * - Appends to sales history
   */
  recordSale: (salePayload) => {
    const state = demoStorage.getState();
    const product = state.products.find(p => p.id === parseInt(salePayload.product_id));
    const unitPrice = product ? product.price : 30000;
    const qty = parseInt(salePayload.quantity) || 1;
    const revenue = salePayload.revenue ? parseFloat(salePayload.revenue) : qty * unitPrice;

    // 1. Deduct finished product stock
    if (product) {
      product.stock_quantity = Math.max(0, product.stock_quantity - qty);
    }

    // 2. Append new sale record
    const newSale = {
      id: Date.now(),
      product_id: parseInt(salePayload.product_id),
      quantity: qty,
      sale_date: salePayload.sale_date || new Date().toISOString().split('T')[0],
      channel: salePayload.channel || 'CFD',
      revenue: revenue
    };

    state.sales = [newSale, ...state.sales];
    demoStorage.saveState(state);

    return {
      ok: true,
      sale: newSale,
      updatedProducts: state.products,
      updatedSales: state.sales
    };
  },

  /**
   * Record raw material restock:
   * - Increases material physical stock safely
   */
  recordRestock: (materialId, addQty) => {
    const state = demoStorage.getState();
    const matId = parseInt(materialId);
    const material = state.rawMaterials.find(m => m.id === matId);
    if (!material) {
      return {
        ok: false,
        message: `Bahan baku dengan ID ${materialId} tidak ditemukan.`,
        updatedRawMaterials: state.rawMaterials
      };
    }
    const qty = parseFloat(addQty);
    if (isNaN(qty) || qty <= 0) {
      return {
        ok: false,
        message: 'Kuantitas pasokan harus berupa angka positif lebih dari 0.',
        updatedRawMaterials: state.rawMaterials
      };
    }
    const currentStock = parseFloat(material.stock_quantity) || 0;
    material.stock_quantity = parseFloat((currentStock + qty).toFixed(2));
    demoStorage.saveState(state);
    return {
      ok: true,
      material,
      updatedRawMaterials: state.rawMaterials
    };
  },

  /**
   * Update B2B order status (e.g. pending -> processing -> completed)
   */
  recordOrderStatus: (orderId, newStatus) => {
    const state = demoStorage.getState();
    const order = state.orders.find(o => o.id === parseInt(orderId));
    if (order) {
      order.status = newStatus;
      // If completed, verify product stock deduction
      if (newStatus === 'completed' && order.items) {
        order.items.forEach(item => {
          const prod = state.products.find(p => p.name === item.product?.name);
          if (prod) {
            prod.stock_quantity = Math.max(0, prod.stock_quantity - item.quantity);
          }
        });
      }
    }
    demoStorage.saveState(state);
    return {
      ok: true,
      updatedOrders: state.orders,
      updatedProducts: state.products
    };
  },

  /**
   * Record new marketing event (CFD, Expo, Bazar)
   */
  recordEvent: (eventPayload) => {
    const state = demoStorage.getState();
    const newEvent = {
      id: Date.now(),
      name: eventPayload.name,
      start_date: eventPayload.start_date,
      end_date: eventPayload.end_date,
      event_type: eventPayload.event_type || 'CFD',
      coefficient: parseFloat(eventPayload.coefficient) || 1.5
    };
    state.events = [...state.events, newEvent];
    demoStorage.saveState(state);
    return {
      ok: true,
      event: newEvent,
      updatedEvents: state.events
    };
  },

  /**
   * Edit product details
   */
  recordProductEdit: (prodId, updatedPayload) => {
    const state = demoStorage.getState();
    state.products = state.products.map(p => (
      p.id === parseInt(prodId) ? { ...p, ...updatedPayload } : p
    ));
    demoStorage.saveState(state);
    return {
      ok: true,
      updatedProducts: state.products
    };
  },

  /**
   * Create a new product
   */
  createProduct: (productPayload) => {
    const state = demoStorage.getState();
    const newProduct = {
      id: Date.now(),
      sku: productPayload.sku || `DEPIK-${Date.now().toString().slice(-4)}`,
      name: productPayload.name,
      price: parseFloat(productPayload.price) || 30000,
      stock_quantity: parseInt(productPayload.stock_quantity) || 0,
      description: productPayload.description || '',
      legality_nib: productPayload.legality_nib || '1234567890123',
      legality_hki: productPayload.legality_hki || 'IDS000012345',
      legality_sppirt: productPayload.legality_sppirt || 'P-IRT 2021104010123-26',
      legality_halal: productPayload.legality_halal || 'ID112100009882540924',
      nutrition_info: productPayload.nutrition_info || 'Kalori: 320kkal, Protein: 42g, Lemak: 12g',
      origin: productPayload.origin || 'Danau Laut Tawar, Takengon, Aceh Tengah'
    };
    state.products = [...state.products, newProduct];
    demoStorage.saveState(state);
    return {
      ok: true,
      product: newProduct,
      updatedProducts: state.products
    };
  },

  /**
   * Delete a product
   */
  deleteProduct: (productId) => {
    const state = demoStorage.getState();
    state.products = state.products.filter(p => p.id !== parseInt(productId));
    demoStorage.saveState(state);
    return {
      ok: true,
      updatedProducts: state.products
    };
  },

  /**
   * Create a new raw material safely
   */
  createRawMaterial: (materialPayload) => {
    const state = demoStorage.getState();
    const cleanName = (materialPayload?.name || '').trim();
    if (!cleanName) {
      return { ok: false, message: 'Nama bahan baku tidak boleh kosong.' };
    }
    const duplicate = state.rawMaterials.find(m => m.name.toLowerCase() === cleanName.toLowerCase());
    if (duplicate) {
      return { ok: false, message: `Bahan baku "${cleanName}" sudah terdaftar.` };
    }
    const stockQty = Math.max(0, parseFloat(materialPayload.stock_quantity) || 0);
    const minThresh = Math.max(0.1, parseFloat(materialPayload.min_threshold) || 5.0);
    const newMaterial = {
      id: Date.now(),
      name: cleanName,
      stock_quantity: parseFloat(stockQty.toFixed(2)),
      unit: materialPayload.unit || 'kg',
      min_threshold: parseFloat(minThresh.toFixed(2))
    };
    state.rawMaterials = [...state.rawMaterials, newMaterial];
    demoStorage.saveState(state);
    return {
      ok: true,
      rawMaterial: newMaterial,
      updatedRawMaterials: state.rawMaterials
    };
  },

  /**
   * Edit raw material details or physical stock adjustment safely
   */
  editRawMaterial: (materialId, updatedPayload) => {
    const state = demoStorage.getState();
    const matId = parseInt(materialId);
    const exists = state.rawMaterials.some(m => m.id === matId);
    if (!exists) {
      return { ok: false, message: 'Bahan baku tidak ditemukan.' };
    }
    state.rawMaterials = state.rawMaterials.map(m => {
      if (m.id === matId) {
        let newStock = m.stock_quantity;
        if (updatedPayload.stock_quantity !== undefined) {
          const parsedStock = parseFloat(updatedPayload.stock_quantity);
          if (!isNaN(parsedStock)) newStock = Math.max(0, parseFloat(parsedStock.toFixed(2)));
        }
        let newThreshold = m.min_threshold;
        if (updatedPayload.min_threshold !== undefined) {
          const parsedThresh = parseFloat(updatedPayload.min_threshold);
          if (!isNaN(parsedThresh)) newThreshold = Math.max(0.1, parseFloat(parsedThresh.toFixed(2)));
        }
        return {
          ...m,
          ...updatedPayload,
          name: updatedPayload.name !== undefined ? updatedPayload.name.trim() : m.name,
          stock_quantity: newStock,
          min_threshold: newThreshold
        };
      }
      return m;
    });
    demoStorage.saveState(state);
    return {
      ok: true,
      updatedRawMaterials: state.rawMaterials
    };
  },

  /**
   * Delete raw material safely
   */
  deleteRawMaterial: (materialId) => {
    const state = demoStorage.getState();
    const matId = parseInt(materialId);
    state.rawMaterials = state.rawMaterials.filter(m => m.id !== matId);
    demoStorage.saveState(state);
    return {
      ok: true,
      updatedRawMaterials: state.rawMaterials
    };
  },

  /**
   * Edit an existing sale transaction and adjust stock difference
   */
  editSale: (saleId, updatedPayload) => {
    const state = demoStorage.getState();
    const sale = state.sales.find(s => s.id === parseInt(saleId));
    if (!sale) return { ok: false, message: 'Transaksi tidak ditemukan' };

    const oldQty = sale.quantity;
    const oldProdId = sale.product_id;
    const newProdId = parseInt(updatedPayload.product_id) || oldProdId;
    const newQty = parseInt(updatedPayload.quantity) || oldQty;

    // Adjust finished stock
    if (oldProdId === newProdId) {
      const prod = state.products.find(p => p.id === newProdId);
      if (prod) {
        const diff = newQty - oldQty;
        prod.stock_quantity = Math.max(0, prod.stock_quantity - diff);
      }
    } else {
      const oldProd = state.products.find(p => p.id === oldProdId);
      if (oldProd) oldProd.stock_quantity += oldQty;
      const newProd = state.products.find(p => p.id === newProdId);
      if (newProd) newProd.stock_quantity = Math.max(0, newProd.stock_quantity - newQty);
    }

    const prod = state.products.find(p => p.id === newProdId);
    const unitPrice = prod?.price || 30000;
    const revenue = updatedPayload.revenue !== undefined && parseFloat(updatedPayload.revenue) > 0
      ? parseFloat(updatedPayload.revenue)
      : newQty * unitPrice;

    state.sales = state.sales.map(s => {
      if (s.id === parseInt(saleId)) {
        return {
          ...s,
          ...updatedPayload,
          product_id: newProdId,
          quantity: newQty,
          revenue: revenue
        };
      }
      return s;
    });

    demoStorage.saveState(state);
    return {
      ok: true,
      updatedSales: state.sales,
      updatedProducts: state.products
    };
  },

  /**
   * Delete a sale transaction and restore finished product stock
   */
  deleteSale: (saleId) => {
    const state = demoStorage.getState();
    const sale = state.sales.find(s => s.id === parseInt(saleId));
    if (!sale) return { ok: false };

    // Restore stock
    const prod = state.products.find(p => p.id === sale.product_id);
    if (prod) {
      prod.stock_quantity += sale.quantity;
    }

    state.sales = state.sales.filter(s => s.id !== parseInt(saleId));
    demoStorage.saveState(state);
    return {
      ok: true,
      updatedSales: state.sales,
      updatedProducts: state.products
    };
  },

  /**
   * Edit an event
   */
  editEvent: (eventId, updatedPayload) => {
    const state = demoStorage.getState();
    state.events = state.events.map(ev => {
      if (ev.id === parseInt(eventId)) {
        return {
          ...ev,
          ...updatedPayload,
          coefficient: updatedPayload.coefficient ? parseFloat(updatedPayload.coefficient) : ev.coefficient
        };
      }
      return ev;
    });
    demoStorage.saveState(state);
    return {
      ok: true,
      updatedEvents: state.events
    };
  },

  /**
   * Delete an event
   */
  deleteEvent: (eventId) => {
    const state = demoStorage.getState();
    state.events = state.events.filter(ev => ev.id !== parseInt(eventId));
    demoStorage.saveState(state);
    return {
      ok: true,
      updatedEvents: state.events
    };
  },

  /**
   * Delete / Cancel an order
   */
  deleteOrder: (orderId) => {
    const parsedId = parseInt(orderId);

    // Record tombstone first so it can never reappear
    try {
      const deletedIds = JSON.parse(localStorage.getItem('elpis_deleted_order_ids') || '[]');
      if (!deletedIds.includes(orderId)) deletedIds.push(orderId);
      if (!isNaN(parsedId) && !deletedIds.includes(parsedId)) deletedIds.push(parsedId);
      localStorage.setItem('elpis_deleted_order_ids', JSON.stringify(deletedIds));

      const overrides = JSON.parse(localStorage.getItem('elpis_order_status_overrides') || '{}');
      delete overrides[orderId];
      if (!isNaN(parsedId)) delete overrides[parsedId];
      localStorage.setItem('elpis_order_status_overrides', JSON.stringify(overrides));
    } catch {}

    const state = demoStorage.getState();
    const order = state.orders.find(o => o.id === parsedId || o.id === orderId);
    if (order && ['shipped', 'completed'].includes(order.status) && order.items) {
      order.items.forEach(item => {
        const prod = state.products.find(p => p.name === item.product?.name || p.id === item.product_id);
        if (prod) prod.stock_quantity += item.quantity;
      });
    }
    state.orders = state.orders.filter(o => o.id !== parsedId && o.id !== orderId);
    demoStorage.saveState(state);
    return {
      ok: true,
      updatedOrders: state.orders,
      updatedProducts: state.products
    };
  },

  /**
   * Edit historical or active B2B order details
   */
  editOrder: (orderId, updatedPayload) => {
    const state = demoStorage.getState();
    const order = state.orders.find(o => o.id === parseInt(orderId));
    if (!order) return { ok: false, message: 'Pesanan tidak ditemukan' };

    const oldStatus = order.status;
    const newStatus = updatedPayload.status || oldStatus;

    // Handle stock changes if status shifts
    if (!['shipped', 'completed'].includes(oldStatus) && ['shipped', 'completed'].includes(newStatus)) {
      if (order.items) {
        order.items.forEach(item => {
          const prod = state.products.find(p => p.name === item.product?.name);
          if (prod) prod.stock_quantity = Math.max(0, prod.stock_quantity - item.quantity);
        });
      }
    } else if (['shipped', 'completed'].includes(oldStatus) && !['shipped', 'completed'].includes(newStatus)) {
      if (order.items) {
        order.items.forEach(item => {
          const prod = state.products.find(p => p.name === item.product?.name);
          if (prod) prod.stock_quantity += item.quantity;
        });
      }
    }

    state.orders = state.orders.map(o => {
      if (o.id === parseInt(orderId)) {
        return {
          ...o,
          ...updatedPayload,
          total_price: updatedPayload.total_price !== undefined ? parseFloat(updatedPayload.total_price) : o.total_price,
          order_date: updatedPayload.order_date || o.order_date,
          status: newStatus
        };
      }
      return o;
    });

    demoStorage.saveState(state);
    return {
      ok: true,
      updatedOrders: state.orders,
      updatedProducts: state.products
    };
  },

  /**
   * Update startup financial & operational configuration
   */
  updateFinancialConfig: (newConfig) => {
    const state = demoStorage.getState();
    state.financialConfig = {
      ...(state.financialConfig || DEFAULT_FINANCIAL_CONFIG),
      ...newConfig
    };
    demoStorage.saveState(state);
    return {
      ok: true,
      updatedConfig: state.financialConfig
    };
  },

  /**
   * Get current financial configuration
   */
  getFinancialConfig: () => {
    const state = demoStorage.getState();
    return state.financialConfig || { ...DEFAULT_FINANCIAL_CONFIG };
  },

  /**
   * Execute closed-loop production batch (sesuai Sheet HPP Excel):
   * 1 pack (150g) = 0.075 kg Ikan Depik Kering + 1 Pouch + 0.02 kg Bumbu
   */
  executeBatchProduction: (productId, quantity) => {
    const state = demoStorage.getState();
    const prod = state.products.find(p => p.id === parseInt(productId));
    if (!prod) return { ok: false, message: 'Produk tidak ditemukan' };

    const qty = parseInt(quantity);
    if (qty <= 0) return { ok: false, message: 'Jumlah batch harus > 0' };

    const reqFish = parseFloat((qty * 0.075).toFixed(2));
    const reqPouch = qty;
    const reqSpice = parseFloat((qty * 0.02).toFixed(2));

    const fishRM = state.rawMaterials.find(rm => rm.name.toLowerCase().includes('ikan') || rm.name.toLowerCase().includes('depik'));
    const pouchRM = state.rawMaterials.find(rm => rm.name.toLowerCase().includes('kemasan') || rm.name.toLowerCase().includes('pouch'));
    const spiceRM = state.rawMaterials.find(rm => rm.name.toLowerCase().includes('bumbu') || rm.name.toLowerCase().includes('garam'));

    if (!fishRM || fishRM.stock_quantity < reqFish) {
      const avail = fishRM ? fishRM.stock_quantity : 0;
      return { ok: false, message: `Bahan baku Ikan Depik Kering kurang (${avail} kg ada, butuh ${reqFish} kg)` };
    }
    if (!pouchRM || pouchRM.stock_quantity < reqPouch) {
      const avail = pouchRM ? pouchRM.stock_quantity : 0;
      return { ok: false, message: `Bahan baku Kemasan Standing Pouch kurang (${avail} pcs ada, butuh ${reqPouch} pcs)` };
    }
    if (!spiceRM || spiceRM.stock_quantity < reqSpice) {
      const avail = spiceRM ? spiceRM.stock_quantity : 0;
      return { ok: false, message: `Bahan baku Bumbu & Garam Gayo kurang (${avail} kg ada, butuh ${reqSpice} kg)` };
    }

    // Deduct raw materials
    fishRM.stock_quantity = parseFloat(Math.max(0, fishRM.stock_quantity - reqFish).toFixed(2));
    pouchRM.stock_quantity = Math.max(0, pouchRM.stock_quantity - reqPouch);
    spiceRM.stock_quantity = parseFloat(Math.max(0, spiceRM.stock_quantity - reqSpice).toFixed(2));

    // Add finished product stock
    prod.stock_quantity += qty;

    demoStorage.saveState(state);
    return {
      ok: true,
      message: `Batch produksi ${qty} pcs berhasil diproses! Stok bahan baku Takengon telah dipotong otomatis.`,
      updatedProducts: state.products,
      updatedRawMaterials: state.rawMaterials
    };
  }
};


