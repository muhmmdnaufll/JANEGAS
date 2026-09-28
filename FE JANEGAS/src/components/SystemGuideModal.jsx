import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  Workflow,
  Users,
  HelpCircle,
  CheckCircle2,
  Play,
  TrendingUp,
  Package,
  Fish,
  DollarSign,
  X,
  Compass,
  Award,
  Lightbulb,
  RotateCcw
} from 'lucide-react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

export const SystemGuideModal = ({ isOpen, onClose, user, onStartInteractiveTour }) => {
  const [activeTab, setActiveTab] = useState('intro');
  const [selectedRoleGuide, setSelectedRoleGuide] = useState(user?.role || 'ceo');

  // Interactive Checklist State persisted in localStorage
  const storageKey = `elpis_checklist_${user?.username || 'guest'}`;
  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      checkKpi: false,
      inspectOrders: false,
      reviewFinance: false,
      viewPackagingQr: false,
      chatCopilot: false
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(checklist));
    } catch {
      // ignore
    }
  }, [checklist, storageKey]);

  if (!isOpen) return null;

  const toggleChecklistItem = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const checklistCompletedCount = Object.values(checklist).filter(Boolean).length;
  const checklistPercent = Math.round((checklistCompletedCount / 5) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-[#F2F6EE] via-white to-[#E9EFE0] border-b border-slate-200/80 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#3D5A2B] text-white flex items-center justify-center shadow-sm shrink-0">
              <Compass size={20} className="animate-pulse" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-lg font-bold text-slate-900 tracking-tight truncate">
                  Pusat Panduan & Akademi Sistem Elpis
                </h2>
                <Badge variant="brand" size="xs" className="hidden sm:inline-flex shrink-0">
                  Smart Supply-Demand
                </Badge>
              </div>
              <p className="text-xs text-slate-500 truncate hidden sm:block">
                Panduan praktis bagi pemula untuk memahami logika, alur kerja data, dan operasional startup Elpis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              icon={Play}
              onClick={() => {
                onClose();
                if (onStartInteractiveTour) onStartInteractiveTour();
              }}
              className="hidden sm:inline-flex shadow-xs"
            >
              Mulai Tur Layar (Driver.js)
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Tutup Panduan"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-3 sm:px-6 pt-2 sm:pt-3 border-b border-slate-200 bg-slate-50/70 overflow-x-auto no-scrollbar shrink-0 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('intro')}
            className={`px-3.5 py-2.5 rounded-t-lg transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap border-b-2 ${
              activeTab === 'intro'
                ? 'bg-white text-[#3D5A2B] border-[#3D5A2B] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100/50'
            }`}
          >
            <BookOpen size={14} />
            <span>1. Pengenalan & Misi Elpis</span>
          </button>

          <button
            onClick={() => setActiveTab('lifecycle')}
            className={`px-3.5 py-2.5 rounded-t-lg transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap border-b-2 ${
              activeTab === 'lifecycle'
                ? 'bg-white text-[#3D5A2B] border-[#3D5A2B] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100/50'
            }`}
          >
            <Workflow size={14} />
            <span>2. Peta Alur Logika Data</span>
          </button>

          <button
            onClick={() => setActiveTab('roles')}
            className={`px-3.5 py-2.5 rounded-t-lg transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap border-b-2 ${
              activeTab === 'roles'
                ? 'bg-white text-[#3D5A2B] border-[#3D5A2B] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100/50'
            }`}
          >
            <Users size={14} />
            <span>3. Panduan Peran (Role Playbook)</span>
          </button>

          <button
            onClick={() => setActiveTab('faq')}
            className={`px-3.5 py-2.5 rounded-t-lg transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap border-b-2 ${
              activeTab === 'faq'
                ? 'bg-white text-[#3D5A2B] border-[#3D5A2B] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100/50'
            }`}
          >
            <Lightbulb size={14} />
            <span>4. Glosarium & FAQ Pemula</span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-3.5 py-2.5 rounded-t-lg transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap border-b-2 ${
              activeTab === 'checklist'
                ? 'bg-white text-[#3D5A2B] border-[#3D5A2B] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100/50'
            }`}
          >
            <CheckCircle2 size={14} />
            <span>5. Checklist 5 Menit Mahir ({checklistCompletedCount}/5)</span>
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-sm leading-relaxed">

          {/* TAB 1: INTRO & MISI */}
          {activeTab === 'intro' && (
            <div className="space-y-6 animate-fade-in">
              {/* Highlight Hero */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#3D5A2B]/10 via-[#7E9C64]/10 to-transparent border border-[#CAD8BC] flex flex-col md:flex-row items-center gap-6">
                <div className="w-28 h-36 bg-white rounded-xl p-2 border border-[#CAD8BC]/60 shadow-sm flex items-center justify-center shrink-0">
                  <img
                    src="/basreng-ikan-depik.png"
                    alt="ELPIS Basreng Ikan Depik"
                    className="max-h-32 w-auto object-contain drop-shadow-sm"
                  />
                </div>
                <div className="space-y-2 text-center md:text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E2EBD5] text-[#2E4420] text-xs font-semibold">
                    <Sparkles size={12} />
                    <span>Inovasi Agritech Khas Gayo & Takengon</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Kenapa Sistem Smart Supply-Demand Elpis Ini Ada?
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Ikan Depik (<em>Rasbora tawarensis</em>)</strong> adalah ikan danau endemik bernutrisi tinggi yang hanya hidup di <strong>Danau Laut Tawar, Takengon</strong>. Tangkapannya sangat dipengaruhi oleh cuaca dingin dan musim. 
                    Elpis mengolahnya menjadi <strong>Basreng Ikan Depik kemasan 150g</strong> (Sumber Protein Rendah Minyak, Halal ID112100009882540924).
                  </p>
                </div>
              </div>

              {/* 3 Core Problems Solved */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Fish size={18} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">1. Fluktuasi Pasokan Nelayan</h4>
                  <p className="text-xs text-slate-600">
                    Nelayan tidak bisa menangkap ikan dalam jumlah sama setiap hari. Sistem memonitor stok bahan baku basah & kering agar pabrik tidak pernah berhenti beroperasi.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Package size={18} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">2. Keseimbangan Batch & Permintaan</h4>
                  <p className="text-xs text-slate-600">
                    Mencegah over-stock (kemasan melempem) atau under-stock (pesanan swalayan & ritel ditolak). AI Forecaster merekomendasikan jumlah batch yang pas tiap minggu.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <DollarSign size={18} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">3. Transparansi Finansial & HPP</h4>
                  <p className="text-xs text-slate-600">
                    Setiap kilogram ikan yang dibeli dan setiap bungkus basreng yang terjual langsung tercatat di Laporan Laba Rugi dengan rasio HPP terukur (default 65.2%).
                  </p>
                </div>
              </div>

              {/* Call to Action Banner */}
              <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-white">Ingin Panduan Langsung di Layar?</h4>
                  <p className="text-xs text-slate-300">
                    Jalankan tur interaktif langsung yang menyoroti tombol dan card sesuai peran Anda.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Play}
                  onClick={() => {
                    onClose();
                    if (onStartInteractiveTour) onStartInteractiveTour();
                  }}
                >
                  Mulai Tur Layar Sekarang
                </Button>
              </div>
            </div>
          )}

          {/* TAB 2: ALUR LOGIKA DATA */}
          {activeTab === 'lifecycle' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Peta Siklus Data Elpis: Dari Hulu ke Hilir
                </h3>
                <p className="text-xs text-slate-500">
                  Semua modul di sistem ini saling terhubung secara tertutup (closed-loop). Berikut adalah alur perjalanannya:
                </p>
              </div>

              <div className="space-y-3">
                {/* Step 1 */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-start gap-3 sm:gap-4 min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                      <h4 className="font-bold text-sm text-slate-900 break-words">
                        Penerimaan Pasokan Bahan Baku Nelayan Danau Laut Tawar
                      </h4>
                      <Badge variant="info" size="xs" className="self-start sm:self-auto shrink-0">Hulu Operasional</Badge>
                    </div>
                    <p className="text-xs text-slate-600">
                      Tim operasional mencatat setoran ikan depik (kg dan harga beli) di tab <strong>Rantai Pasok</strong> atau via tombol aksi cepat <em>"+ Pasok Ikan Depik"</em>.
                    </p>
                    <div className="text-[11px] bg-slate-50 p-2 rounded-lg text-slate-600 font-mono break-words">
                      ↳ Efek Data: Stok Bahan Baku (kg) bertambah. Modal kerja kas tercatat keluar sesuai nilai pembelian.
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-start gap-3 sm:gap-4 min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                      <h4 className="font-bold text-sm text-slate-900 break-words">
                        Eksekusi Batch Produksi & Penggorengan Basreng
                      </h4>
                      <Badge variant="warning" size="xs" className="self-start sm:self-auto shrink-0">Pabrik & QC</Badge>
                    </div>
                    <p className="text-xs text-slate-600">
                      Ikan depik diolah menjadi adonan basreng, dipotong, digoreng renyah rendah minyak, lalu dikemas dalam standing pouch 150g di tab <strong>Kelola Data → Batch Produksi</strong>.
                    </p>
                    <div className="text-[11px] bg-slate-50 p-2 rounded-lg text-slate-600 font-mono break-words">
                      ↳ Efek Data: Stok Ikan Depik berkurang sesuai formula susut (1.8 kg ikan segar/kering per batch), dan Stok Produk Jadi (pcs) bertambah otomatis.
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-start gap-3 sm:gap-4 min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#3D5A2B] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                      <h4 className="font-bold text-sm text-slate-900 break-words">
                        Pemesanan Mitra B2B & Penjualan Ritel CFD
                      </h4>
                      <Badge variant="brand" size="xs" className="self-start sm:self-auto shrink-0">Distribusi Pasar</Badge>
                    </div>
                    <p className="text-xs text-slate-600">
                      Mitra toko oleh-oleh memesan via Portal Mitra, atau tim mencatat penjualan langsung CFD Banda Aceh. CEO meninjau dan menyetujui pesanan di tab <strong>Pesanan B2B</strong>.
                    </p>
                    <div className="text-[11px] bg-slate-50 p-2 rounded-lg text-slate-600 font-mono break-words">
                      ↳ Efek Data: Saat pesanan disetujui, Stok Produk Jadi berkurang seketika, dan Piutang/Kas Omzet bertambah.
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-start gap-3 sm:gap-4 min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    4
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                      <h4 className="font-bold text-sm text-slate-900 break-words">
                        Otomasi Finansial, HPP & Laba Rugi
                      </h4>
                      <Badge variant="success" size="xs" className="self-start sm:self-auto shrink-0">CFO & Keuangan</Badge>
                    </div>
                    <p className="text-xs text-slate-600">
                      Tab <strong>Laporan Finansial</strong> secara otomatis mengkalkulasi Laba Rugi, HPP standar 65.2%, laba kotor, beban operasional, dan laba bersih 34.8%. CFO dapat menyetel asumsi matematis via modal <em>"⚙️ Sesuaikan Asumsi Finansial & HPP"</em>.
                    </p>
                    <div className="text-[11px] bg-slate-50 p-2 rounded-lg text-slate-600 font-mono break-words">
                      ↳ Efek Data: Neraca dan AI Forecaster langsung tersinkronisasi mengikuti penyesuaian HPP.
                    </div>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-start gap-3 sm:gap-4 min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    5
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                      <h4 className="font-bold text-sm text-slate-900 break-words">
                        Transparansi & Traceability QR Konsumen
                      </h4>
                      <Badge variant="purple" size="xs" className="self-start sm:self-auto shrink-0">Hilir & Konsumen</Badge>
                    </div>
                    <p className="text-xs text-slate-600">
                      Tab <strong>QR Kemasan</strong> menyediakan QR code dinamis untuk dicetak pada standing pouch fisik. Konsumen yang scan QR dapat memverifikasi keaslian Ikan Depik Danau Laut Tawar dan sertifikat resmi Halal ID112100009882540924.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ROLE PLAYBOOK */}
          {activeTab === 'roles' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Buku Panduan Khusus Peran (Role Playbook)
                </h3>
                <p className="text-xs text-slate-500">
                  Setiap pendiri dan pengguna memiliki hak akses dan fokus kerja yang berbeda. Pilih peran untuk melihat panduannya:
                </p>
              </div>

              {/* Role Selector Pills */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'ctoo', label: 'Muhammad Naufal (CTOO / Tech & Ops)', icon: Fish, variant: 'info' },
                  { id: 'ceo', label: 'Bintang Najwa (CEO / Business)', icon: TrendingUp, variant: 'purple' },
                  { id: 'cfo', label: 'Siti Khairani (CFO / Finance)', icon: DollarSign, variant: 'success' },
                  { id: 'partner', label: 'Mitra B2B Toko Oleh-oleh', icon: Package, variant: 'brand' },
                  { id: 'demo', label: 'Tamu Akun Demo', icon: Sparkles, variant: 'neutral' }
                ].map(r => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRoleGuide(r.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedRoleGuide === r.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <r.icon size={13} />
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>

              {/* Content for CTOO */}
              {selectedRoleGuide === 'ctoo' && (
                <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-4 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-blue-200/60">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base break-words">
                        Peran: Muhammad Naufal (CTOO / Tech & Operations)
                      </h4>
                      <span className="text-xs text-blue-700 font-medium block">
                        Penjaga Ketersediaan Bahan Baku, Mutu Produksi & Logistik Takengon
                      </span>
                    </div>
                    <Badge variant="info" className="self-start sm:self-auto shrink-0">Operasional & Gudang</Badge>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Rutinitas Harian yang Wajib Dilakukan:
                    </h5>
                    <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                      <li><strong>Pagi:</strong> Buka tab <em>Overview</em> dan periksa <strong>Action Center</strong> untuk melihat apakah ada stok ikan depik yang kritis (&lt; 10 kg).</li>
                      <li><strong>Siang:</strong> Saat pasokan nelayan tiba, catat di tab <strong>Rantai Pasok</strong> (jumlah kg & harga beli per kg).</li>
                      <li><strong>Sore:</strong> Eksekusi batch penggorengan di tab <strong>Kelola Data → Batch Produksi</strong> untuk mengubah stok ikan menjadi stok kemasan basreng 150g siap jual.</li>
                      <li><strong>Berkala:</strong> Buka tab <strong>QR Kemasan</strong> untuk mengunduh label QR batch sebelum standing pouch disegel.</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-blue-200 text-xs text-slate-600 flex items-center gap-2">
                    <Lightbulb size={16} className="text-amber-500 shrink-0" />
                    <span><strong>Pro-Tip Tech:</strong> Gunakan asisten AI Copilot di pojok kanan bawah untuk menghitung kebutuhan bahan baku sebelum menerima pesanan grosir skala besar.</span>
                  </div>
                </div>
              )}

              {/* Content for CEO */}
              {selectedRoleGuide === 'ceo' && (
                <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/50 border border-purple-200/80 space-y-4 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-purple-200/60">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base break-words">
                        Peran: Bintang Najwa (CEO / Business Lead)
                      </h4>
                      <span className="text-xs text-purple-700 font-medium block">
                        Pengarah Strategi Bisnis, Pertumbuhan Omzet & Kemitraan Toko Ritel
                      </span>
                    </div>
                    <Badge variant="purple" className="self-start sm:self-auto shrink-0">Pemimpin Bisnis</Badge>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Rutinitas Harian yang Wajib Dilakukan:
                    </h5>
                    <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                      <li><strong>Pagi:</strong> Cek metrik <strong>Total Omzet</strong> dan <strong>Pesanan Menunggu</strong> di KPI Cards.</li>
                      <li><strong>Validasi Pesanan:</strong> Buka tab <strong>Pesanan B2B</strong>. Klik <em>"Setujui Pesanan"</em> untuk toko oleh-oleh yang sudah mengonfirmasi jadwal pengiriman.</li>
                      <li><strong>Koreksi Data Historis:</strong> Jika ada perubahan kesepakatan harga grosir atau tanggal pesanan terdahulu, gunakan tombol <em>"Sunting Pesanan"</em>.</li>
                      <li><strong>Analisis Pasar:</strong> Buka tab <strong>Analisis</strong> untuk melihat tren varian terlaris (Original vs Pedas vs Balado) guna menentukan promosi mingguan.</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-purple-200 text-xs text-slate-600 flex items-center gap-2">
                    <Lightbulb size={16} className="text-amber-500 shrink-0" />
                    <span><strong>Pro-Tip CEO:</strong> Rekomendasi produksi AI di Overview membaca kalender CFD dan libur nasional di Aceh untuk memprediksi lonjakan pembeli wisatawan.</span>
                  </div>
                </div>
              )}

              {/* Content for CFO */}
              {selectedRoleGuide === 'cfo' && (
                <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-4 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-200/60">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base break-words">
                        Peran: Siti Khairani (CFO / Finance & Accounting)
                      </h4>
                      <span className="text-xs text-emerald-700 font-medium block">
                        Pengendali Rasio HPP, Arus Kas Bersih, Piutang & Kesehatan Finansial
                      </span>
                    </div>
                    <Badge variant="success" className="self-start sm:self-auto shrink-0">Keuangan & Akuntansi</Badge>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Rutinitas Harian yang Wajib Dilakukan:
                    </h5>
                    <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                      <li><strong>Pagi:</strong> Buka tab <strong>Laporan Finansial</strong>. Pantau Laporan Laba Rugi real-time dan rasio laba bersih (~34.8%).</li>
                      <li><strong>Penyesuaian Matematis:</strong> Jika ada kenaikan harga beli ikan nelayan atau minyak nabati, klik tombol <em>"⚙️ Sesuaikan Asumsi Finansial & HPP"</em> untuk merevisi formula HPP, persentase bumbu, atau penyusutan mesin.</li>
                      <li><strong>Verifikasi Pelunasan:</strong> Pantau piutang pesanan kemitraan di tab Pesanan B2B dan tandai sebagai selesai/lunas jika dana telah masuk rekening startup.</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs text-slate-600 flex items-center gap-2">
                    <Lightbulb size={16} className="text-amber-500 shrink-0" />
                    <span><strong>Pro-Tip CFO:</strong> Setiap perubahan rasio HPP di modal pengaturan akan secara dinamis memperbarui Neraca, Arus Kas, dan proyeksi AI Forecaster secara bersamaan.</span>
                  </div>
                </div>
              )}

              {/* Content for Partner */}
              {selectedRoleGuide === 'partner' && (
                <div className="p-4 sm:p-5 rounded-2xl bg-[#F2F6EE] border border-[#CAD8BC] space-y-4 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#CAD8BC]/60">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base break-words">
                        Peran: Mitra B2B (Swalayan, Toko Oleh-oleh & Distributor)
                      </h4>
                      <span className="text-xs text-[#2E4420] font-medium block">
                        Pemesanan Grosir Mandiri dengan Harga Kemitraan Spesial
                      </span>
                    </div>
                    <Badge variant="brand" className="self-start sm:self-auto shrink-0">Mitra Usaha</Badge>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Langkah Pemesanan Cepat:
                    </h5>
                    <ol className="text-xs text-slate-700 space-y-1.5 list-decimal list-inside">
                      <li>Pilih varian Basreng Ikan Depik 150g (Original, Pedas Daun Jeruk, Balado).</li>
                      <li>Tentukan jumlah kuantitas. Total harga grosir akan otomatis terhitung.</li>
                      <li>Klik <strong>"Kirim Pesanan Grosir"</strong>. Pesanan langsung masuk ke antrean pabrik Elpis.</li>
                      <li>Pantau status proses pengiriman Anda di tabel Riwayat Pesanan.</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* Content for Demo */}
              {selectedRoleGuide === 'demo' && (
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-4 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-amber-200/60">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base break-words">
                        Peran: Tamu Akun Demo (Evaluasi & Eksplorasi Aman)
                      </h4>
                      <span className="text-xs text-amber-800 font-medium block">
                        Eksplorasi Penuh Fitur Tanpa Khawatir Merusak Data Asli
                      </span>
                    </div>
                    <Badge variant="neutral" className="self-start sm:self-auto shrink-0">Sesi Demo</Badge>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    Sebagai tamu demo, semua perubahan data (seperti input pasokan baru, edit pesanan, setujui pesanan, atau sunting angka HPP) <strong>disimpan secara aman di browser Anda selama sesi berlangsung</strong>.
                  </p>

                  <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs text-slate-600 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <RotateCcw size={16} className="text-amber-600 shrink-0" />
                      <span>Ingin mengembalikan data demo ke kondisi awal? Klik tombol <strong>"Reset"</strong> di bilah atas kapan saja.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: GLOSARIUM & FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Glosarium Istilah & Pertanyaan Umum (FAQ)
                </h3>
                <p className="text-xs text-slate-500">
                  Penjelasan sederhana untuk konsep-konsep agritech dan bisnis yang digunakan dalam platform Elpis:
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <HelpCircle size={15} className="text-[#3D5A2B]" />
                    Apa itu HPP dan mengapa default-nya 65.2%?
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>HPP (Harga Pokok Penjualan)</strong> adalah biaya langsung yang dikeluarkan untuk menghasilkan 1 bungkus Basreng Ikan Depik 150g (meliputi pembelian ikan dari nelayan Danau Laut Tawar, tepung tapioka, minyak goreng, racikan bumbu, dan kemasan standing pouch bersegel). Sisanya (<strong>34.8%</strong>) adalah margin kotor sebelum dipotong biaya sewa, listrik, dan gaji tim.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <HelpCircle size={15} className="text-[#3D5A2B]" />
                    Berapa rasio susut ikan depik basah menjadi basreng kering?
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Dalam proses pengolahan dan penggorengan rendah minyak, ikan depik mengalami penyusutan kadar air. Di sistem Elpis, rasio konversi standar adalah <strong>1.8 kg ikan depik</strong> menghasilkan sekitar <strong>10 pcs kemasan basreng 150g</strong> (atau 0.18 kg ikan per bungkus). Angka ini dapat disesuaikan di formula batch.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <HelpCircle size={15} className="text-[#3D5A2B]" />
                    Apa arti nomor sertifikat Halal ID112100009882540924?
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Ini adalah nomor registrasi sertifikasi resmi <strong>Halal Indonesia (BPJPH Kementerian Agama RI)</strong> yang tercetak langsung pada kemasan fisik produk Elpis. Nomor ini menjamin seluruh rantai pasok dari penangkapan di danau hingga penggorengan higienis memenuhi syariat halal.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <HelpCircle size={15} className="text-[#3D5A2B]" />
                    Bagaimana cara kerja Elpis AI Copilot & Forecaster?
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    AI Elpis menggunakan model regresi permintaan yang menganalisis riwayat penjualan mingguan, event CFD Banda Aceh, tren kunjungan wisata Danau Laut Tawar, dan kapasitas stok gudang untuk memprediksi berapa bungkus yang sebaiknya digoreng minggu ini agar tidak kekurangan barang saat lonjakan pembeli.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <HelpCircle size={15} className="text-[#3D5A2B]" />
                    Mengapa stok otomatis berkurang saat pesanan mitra disetujui?
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Untuk mencegah <em>double-booking</em> stok. Ketika CEO menyetujui pesanan grosir (misal 50 pcs), barang tersebut langsung di-reserve dari gudang sehingga tidak bisa dijual lagi di CFD. Jika pesanan dibatalkan atau diedit, sistem otomatis mengembalikan stok ke gudang.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CHECKLIST 5 MENIT MAHIR */}
          {activeTab === 'checklist' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Misi Eksplorasi: 5 Menit Mahir Sistem Elpis
                  </h3>
                  <span className="text-xs font-bold text-[#3D5A2B]">
                    {checklistPercent}% Selesai
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-[#3D5A2B] transition-all duration-300 rounded-full"
                    style={{ width: `${checklistPercent}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Tandai setiap langkah yang telah Anda coba langsung di dashboard. Checklist ini otomatis tersimpan di perangkat Anda.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    key: 'checkKpi',
                    title: 'Misi 1: Cek Stok Ikan Nelayan & Kemasan di KPI Cards',
                    desc: 'Lihat kartu "Stok Cadangan Depik" (kg) dan "Volume Terjual" (pcs) di bilah atas Overview.',
                    actionLabel: 'Lihat KPI Cards'
                  },
                  {
                    key: 'inspectOrders',
                    title: 'Misi 2: Buka Tab Pesanan B2B & Simulasikan Approval',
                    desc: 'Lihat daftar pesanan toko oleh-oleh, periksa total tagihan, dan coba tombol "Setujui Pesanan" atau "Sunting Pesanan".',
                    actionLabel: 'Buka Pesanan B2B'
                  },
                  {
                    key: 'reviewFinance',
                    title: 'Misi 3: Eksplorasi Laba Rugi & Sesuaikan Asumsi HPP',
                    desc: 'Buka tab Laporan Finansial dan coba klik tombol "⚙️ Sesuaikan Asumsi Finansial & HPP" untuk melihat dinamika laba bersih.',
                    actionLabel: 'Buka Finansial'
                  },
                  {
                    key: 'viewPackagingQr',
                    title: 'Misi 4: Lihat Label QR Traceability Kemasan 150g',
                    desc: 'Buka tab QR Kemasan untuk melihat foto kemasan fisik standing pouch berdampingan dengan kode QR siap cetak.',
                    actionLabel: 'Buka QR Kemasan'
                  },
                  {
                    key: 'chatCopilot',
                    title: 'Misi 5: Tanya Sesuatu ke Asisten Elpis AI Copilot',
                    desc: 'Klik tombol bulat hijau zaitun AI Copilot di pojok kanan bawah, dan coba ketik pertanyaan seputar stok atau strategi penjualan.',
                    actionLabel: 'Buka AI Copilot'
                  }
                ].map(item => {
                  const isChecked = checklist[item.key];
                  return (
                    <div
                      key={item.key}
                      onClick={() => toggleChecklistItem(item.key)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                        isChecked
                          ? 'bg-emerald-50/50 border-emerald-300 shadow-2xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isChecked
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}>
                        {isChecked && <CheckCircle2 size={14} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-bold ${isChecked ? 'text-emerald-950 line-through' : 'text-slate-900'}`}>
                            {item.title}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {checklistPercent === 100 && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center gap-3 text-emerald-900 text-xs font-semibold animate-fade-in">
                  <Award size={24} className="text-emerald-600 shrink-0" />
                  <span>
                    🎉 Luar biasa! Anda telah menyelesaikan seluruh misi eksplorasi dan kini menguasai logika operasional platform Elpis.
                  </span>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Fish size={14} className="text-[#3D5A2B]" />
            <span>ELPIS • Basreng Ikan Depik 150g Danau Laut Tawar</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Tutup
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Play}
              onClick={() => {
                onClose();
                if (onStartInteractiveTour) onStartInteractiveTour();
              }}
            >
              Jalankan Tur Layar (Driver.js)
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
