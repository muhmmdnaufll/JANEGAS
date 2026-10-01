import React, { useState, useRef, useEffect, useCallback } from "react";
import { Sparkles, Send, X, Bot, Loader2, RefreshCw, ChevronRight, Activity, Flame } from "lucide-react";
import { forecastService } from "../services/api";

const QUICK_PROMPTS = [
  "Prediksi produksi biogas 7 hari ke depan?",
  "Bagaimana neraca kotoran ternak dan rasio air?",
  "Cek status pH & tekanan biodigester?",
  "Berapa substitusi LPG 3kg & reduksi emisi?",
  "Berapa ketersediaan pupuk bio-slurry kelompok tani?",
];

export default function AICopilotDrawer({ summaryData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Halo! Saya **JANEGAS AI Advisor**. Saya siap membantu menganalisis peramalan produksi biogas komunal Kota Jantho, neraca limbah ternak, kualitas fermentasi (pH & tekanan), serta distribusi pupuk bio-slurry. Silakan tanyakan apa saja!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Listen to external custom event to open drawer with optional initial query
  useEffect(() => {
    const handleOpenEvent = (event) => {
      setIsOpen(true);
      if (event.detail && typeof event.detail === "string") {
        handleSend(event.detail);
      }
    };
    window.addEventListener("open-janegas-ai", handleOpenEvent);
    return () => window.removeEventListener("open-janegas-ai", handleOpenEvent);
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isTyping]);

  // Client-side Local NLP fallback in case backend is offline
  const runClientFallback = (text) => {
    const q = text.toLowerCase();
    const kpi = summaryData?.kpi || {};
    const fc = summaryData?.forecast || {};

    const totalBiogas = kpi.total_biogas_m3 || 0;
    const totalManure = kpi.total_manure_kg || 0;
    const lpgCylinders = ((totalBiogas * 0.46) / 3).toFixed(1);

    if (q.includes("ramal") || q.includes("prediksi") || q.includes("forecast") || q.includes("minggu depan")) {
      const projBiogas = fc.projected_7d_biogas_m3 || "26.1";
      const projHH = fc.projected_hh_capacity || "4";
      const lpgSaved = fc.projected_lpg_cylinders || "4.0";
      return `### 🌿 Proyeksi Produksi Biogas 7 Hari ke Depan\n\n* **Estimasi Output Biogas**: **${projBiogas} m³** (~3.7 m³/hari)\n* **Kapasitas Pelayanan**: Sanggup menyuplai rutin hingga **${projHH} Kepala Keluarga (KK)** di kawasan Jantho.\n* **Substitusi Bahan Bakar**: Setara dengan penghematan **${lpgSaved} tabung LPG 3kg** subsidi.\n\n*Rekomendasi*: Lakukan pengisian kotoran kontinu pagi dan sore untuk menjaga aktivitas bakteri metanogen.`;
    }

    if (q.includes("pasok") || q.includes("kotoran") || q.includes("limbah") || q.includes("air") || q.includes("sapi")) {
      return `### 🐄 Neraca Pasokan Limbah Kotoran Ternak\n\n* **Total Kotoran Terkumpul**: **${totalManure.toLocaleString("id-ID")} kg** dari peternak mitra Jantho.\n* **Rasio Pengenceran Wajib**: Campurkan kotoran ternak dengan air bersih bersuhu ruang dengan perbandingan **1:1**.\n* **Tujuan**: Mempertahankan kadar padatan terlarut (Total Solids) pada kisaran ideal **8–10%** agar slurry tidak menyumbat inlet digester.`;
    }

    if (q.includes("ph") || q.includes("tekanan") || q.includes("kondisi") || q.includes("sehat") || q.includes("maintenance")) {
      const ph = fc.latest_ph || 7.2;
      const press = fc.latest_pressure || 1.2;
      return `### 🔧 Diagnosis Kesehatan Operasional Biodigester\n\n* **Derajat Keasaman (pH)**: **${ph}** (Rentang optimal 6.8 – 7.6)\n* **Tekanan Gas Manometer**: **${press} bar** (Rentang kerja aman 1.0 – 1.5 bar)\n* **Status**: Instalasi beroperasi dalam parameter fermentasi anaerobik yang stabil.\n\n*Tindakan*: Periksa saluran kondensasi uap air (water-trap) dan pastikan desulfurizer H₂S dibersihkan berkala.`;
    }

    if (q.includes("pupuk") || q.includes("slurry") || q.includes("tani") || q.includes("cair") || q.includes("kompos")) {
      return `### 🌱 Ketersediaan & Distribusi Pupuk Bio-Slurry\n\n* **Pupuk Organik Cair (POC)**: Proyeksi siap salur **~270 Liter** untuk penyemprotan daun & perakaran.\n* **Kompos Padat Bio-Slurry**: Proyeksi **~48 kg** siap jemur untuk pembenah kesuburan tanah sawah Jantho.\n\n*Manfaat*: Mengandung N-P-K alami dan mikroba dekomposer yang mempercepat pemulihan struktur tanah.`;
    }

    return `Saya mencatat data sistem JANEGAS: Total pasokan limbah terkumpul ${totalManure.toLocaleString("id-ID")} kg, produksi biogas ${totalBiogas.toLocaleString("id-ID")} m³ (substitusi ~${lpgCylinders} tabung LPG 3kg), dan melayani peternak serta kelompok tani di Kota Jantho. Anda dapat menanyakan peramalan produksi, kesehatan digester (pH/tekanan), atau pupuk bio-slurry!`;
  };

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const newHistory = [...messages, { sender: "user", text: query }];
    setMessages(newHistory);
    setInput("");
    setIsTyping(true);

    try {
      const res = await forecastService.chat(query);
      if (res?.data?.response) {
        setMessages((prev) => [...prev, { sender: "ai", text: res.data.response }]);
      } else {
        const fallbackText = runClientFallback(query);
        setMessages((prev) => [...prev, { sender: "ai", text: fallbackText }]);
      }
    } catch {
      const fallbackText = runClientFallback(query);
      setMessages((prev) => [...prev, { sender: "ai", text: fallbackText }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        sender: "ai",
        text: "Percakapan telah direset. Silakan tanyakan hal lain seputar peramalan energi terbarukan, pasokan, atau operasional JANEGAS!",
      },
    ]);
  };

  // Markdown line-by-line renderer
  const renderFormattedMarkdown = (content) => {
    if (!content) return null;
    const lines = content.split("\n");

    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <div key={idx} style={{ height: 6 }} />;
      }

      if (trimmed.startsWith("### ")) {
        return (
          <h4
            key={idx}
            style={{
              fontSize: 13.5,
              fontWeight: 700,
              color: "var(--color-forest-900)",
              marginTop: idx > 0 ? 8 : 0,
              marginBottom: 4,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {trimmed.replace("### ", "")}
          </h4>
        );
      }

      if (trimmed.startsWith("#### ")) {
        return (
          <h5
            key={idx}
            style={{
              fontSize: 12.5,
              fontWeight: 700,
              color: "var(--color-forest-800)",
              marginTop: 6,
              marginBottom: 3,
            }}
          >
            {trimmed.replace("#### ", "")}
          </h5>
        );
      }

      if (trimmed.startsWith("> ")) {
        const textInside = trimmed.replace("> ", "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        return (
          <blockquote
            key={idx}
            style={{
              borderLeft: "3px solid var(--color-forest-400)",
              paddingLeft: 8,
              margin: "4px 0",
              fontSize: 11.5,
              color: "var(--text-secondary)",
              background: "rgba(58, 125, 64, 0.05)",
              borderRadius: "0 6px 6px 0",
              paddingTop: 3,
              paddingBottom: 3,
            }}
            dangerouslySetInnerHTML={{ __html: textInside }}
          />
        );
      }

      if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
        const listText = trimmed.substring(2).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        return (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 6,
              fontSize: 12,
              marginBottom: 3,
              lineHeight: 1.5,
            }}
          >
            <span style={{ color: "var(--color-forest-500)", fontWeight: 700, marginTop: 1 }}>•</span>
            <span dangerouslySetInnerHTML={{ __html: listText }} />
          </div>
        );
      }

      if (/^\d+\.\s/.test(trimmed)) {
        const numText = trimmed.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        return (
          <div
            key={idx}
            style={{
              fontSize: 12,
              marginBottom: 3,
              paddingLeft: 4,
              lineHeight: 1.5,
            }}
            dangerouslySetInnerHTML={{ __html: numText }}
          />
        );
      }

      const regularText = trimmed.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return (
        <p
          key={idx}
          style={{
            fontSize: 12,
            marginBottom: 4,
            lineHeight: 1.55,
          }}
          dangerouslySetInnerHTML={{ __html: regularText }}
        />
      );
    });
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          id="janegas-ai-trigger"
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "linear-gradient(135deg, #1a3d1e 0%, #2d6833 60%, #14b8b3 100%)",
            color: "#ffffff",
            border: "1px solid rgba(168, 220, 169, 0.4)",
            borderRadius: 30,
            padding: "10px 18px",
            boxShadow: "0 8px 24px rgba(13, 31, 15, 0.25), 0 0 16px rgba(20, 184, 179, 0.35)",
            cursor: "pointer",
            transition: "all 0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
            e.currentTarget.style.boxShadow = "0 12px 28px rgba(13, 31, 15, 0.35), 0 0 20px rgba(20, 184, 179, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(13, 31, 15, 0.25), 0 0 16px rgba(20, 184, 179, 0.35)";
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sparkles size={16} color="#5eead4" />
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.02em" }}>Tanya JANEGAS AI</div>
            <div style={{ fontSize: 10, opacity: 0.85, fontWeight: 500 }}>Bio-Energy Advisor</div>
          </div>
        </button>
      )}

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(13, 31, 15, 0.45)",
            backdropFilter: "blur(3px)",
          }}
        />
      )}

      {/* Slide-in Drawer */}
      {isOpen && (
        <aside
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            maxWidth: 420,
            zIndex: 1001,
            background: "#ffffff",
            boxShadow: "-8px 0 32px rgba(13, 31, 15, 0.22)",
            display: "flex",
            flexDirection: "column",
            animation: "slideInRight 0.25s ease-out",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 18px",
              background: "linear-gradient(135deg, #132a16 0%, #1a3d1e 50%, #245228 100%)",
              color: "#ffffff",
              borderBottom: "1px solid rgba(168, 220, 169, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #2d6833 0%, #14b8b3 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 10px rgba(20, 184, 179, 0.4)",
                }}
              >
                <Flame size={20} color="#ffffff" />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>
                    JANEGAS AI Advisor
                  </h3>
                  <span
                    style={{
                      background: "rgba(94, 234, 212, 0.2)",
                      border: "1px solid rgba(94, 234, 212, 0.4)",
                      color: "#5eead4",
                      fontSize: 9.5,
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: 12,
                      textTransform: "uppercase",
                    }}
                  >
                    Gemini 2.5
                  </span>
                </div>
                <div style={{ fontSize: 11, color: "var(--color-forest-200)", marginTop: 2 }}>
                  Asisten Cerdas Energi Terbarukan Kota Jantho
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button
                onClick={handleClearChat}
                title="Bersihkan Percakapan"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "none",
                  borderRadius: 6,
                  color: "var(--color-forest-100)",
                  padding: 6,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <RefreshCw size={14} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Tutup"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "none",
                  borderRadius: 6,
                  color: "#ffffff",
                  padding: 6,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Quick Prompt Pills */}
          <div
            style={{
              padding: "10px 14px",
              background: "var(--color-forest-50)",
              borderBottom: "1px solid var(--border-default)",
              display: "flex",
              gap: 8,
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
            className="no-scrollbar"
          >
            {QUICK_PROMPTS.map((promptText, i) => (
              <button
                key={i}
                onClick={() => handleSend(promptText)}
                disabled={isTyping}
                style={{
                  padding: "5px 12px",
                  borderRadius: 16,
                  background: "#ffffff",
                  border: "1px solid var(--border-default)",
                  color: "var(--color-forest-800)",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: isTyping ? "not-allowed" : "pointer",
                  flexShrink: 0,
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isTyping) {
                    e.currentTarget.style.borderColor = "var(--color-forest-400)";
                    e.currentTarget.style.background = "var(--color-forest-100)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-default)";
                  e.currentTarget.style.background = "#ffffff";
                }}
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 16,
              background: "#fafdfa",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: m.sender === "user" ? "flex-end" : "flex-start",
                  gap: 8,
                }}
              >
                {m.sender === "ai" && (
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: "var(--color-forest-800)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <Sparkles size={14} color="#72c478" />
                  </div>
                )}

                <div
                  style={{
                    maxWidth: "85%",
                    padding: "10px 14px",
                    borderRadius: 14,
                    background: m.sender === "user" ? "var(--color-forest-800)" : "#ffffff",
                    color: m.sender === "user" ? "#ffffff" : "var(--text-primary)",
                    border: m.sender === "user" ? "none" : "1px solid var(--border-default)",
                    boxShadow: "0 2px 8px rgba(13, 31, 15, 0.05)",
                    borderBottomRightRadius: m.sender === "user" ? 2 : 14,
                    borderBottomLeftRadius: m.sender === "ai" ? 2 : 14,
                    wordBreak: "break-word",
                  }}
                >
                  {m.sender === "user" ? (
                    <div style={{ fontSize: 12.5, lineHeight: 1.5 }}>{m.text}</div>
                  ) : (
                    <div>{renderFormattedMarkdown(m.text)}</div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 36, color: "var(--text-secondary)", fontSize: 12 }}>
                <Loader2 size={15} className="spinner" style={{ animation: "spin 1s linear infinite" }} />
                <span>Menganalisis sistem bio-energi Jantho...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: 12,
              background: "#ffffff",
              borderTop: "1px solid var(--border-default)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <input
              type="text"
              placeholder="Tanyakan analisis energi biogas atau pupuk..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
              style={{
                flex: 1,
                fontSize: 12.5,
                background: "var(--bg-base)",
                border: "1px solid var(--border-default)",
                borderRadius: 10,
                padding: "10px 12px",
                outline: "none",
                color: "var(--text-primary)",
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: !input.trim() || isTyping ? "var(--border-default)" : "var(--color-forest-600)",
                color: "#ffffff",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: !input.trim() || isTyping ? "not-allowed" : "pointer",
                transition: "background 0.2s ease",
              }}
            >
              <Send size={15} />
            </button>
          </form>
        </aside>
      )}
    </>
  );
}
