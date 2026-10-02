import React from "react";
import { Calendar, X } from "lucide-react";

/**
 * DateRangeFilter — Compact date range picker
 *
 * Props:
 *   dateFrom  {string}   ISO date string "YYYY-MM-DD" or ""
 *   dateTo    {string}   ISO date string "YYYY-MM-DD" or ""
 *   onChange  {fn}       ({ from, to }) => void
 *   label     {string}   optional label prefix (default "Periode")
 */
export default function DateRangeFilter({ dateFrom = "", dateTo = "", onChange, label = "Periode" }) {
  const hasFilter = dateFrom || dateTo;

  const handleFrom = (e) => onChange({ from: e.target.value, to: dateTo });
  const handleTo   = (e) => onChange({ from: dateFrom, to: e.target.value });
  const handleReset = () => onChange({ from: "", to: "" });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: hasFilter ? "var(--color-forest-50)" : "transparent",
        border: `1px solid ${hasFilter ? "var(--border-strong)" : "var(--border-default)"}`,
        borderRadius: 10,
        padding: "4px 10px",
        transition: "all 0.2s ease",
        flexWrap: "wrap",
      }}
    >
      {/* Calendar icon + label */}
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          fontSize: 12,
          fontWeight: 600,
          color: hasFilter ? "var(--color-forest-700)" : "var(--text-muted)",
          whiteSpace: "nowrap",
          userSelect: "none",
        }}
      >
        <Calendar size={13} />
        {label}:
      </span>

      {/* From date */}
      <input
        type="date"
        value={dateFrom}
        onChange={handleFrom}
        max={dateTo || undefined}
        aria-label="Tanggal mulai"
        style={{
          border: "none",
          outline: "none",
          background: "transparent",
          fontSize: 12.5,
          fontFamily: "var(--font-mono)",
          color: "var(--text-primary)",
          cursor: "pointer",
          padding: "2px 0",
          width: 126,
        }}
      />

      <span style={{ fontSize: 12, color: "var(--text-muted)", userSelect: "none" }}>–</span>

      {/* To date */}
      <input
        type="date"
        value={dateTo}
        onChange={handleTo}
        min={dateFrom || undefined}
        aria-label="Tanggal akhir"
        style={{
          border: "none",
          outline: "none",
          background: "transparent",
          fontSize: 12.5,
          fontFamily: "var(--font-mono)",
          color: "var(--text-primary)",
          cursor: "pointer",
          padding: "2px 0",
          width: 126,
        }}
      />

      {/* Reset button — only shown when a filter is active */}
      {hasFilter && (
        <button
          onClick={handleReset}
          aria-label="Reset filter tanggal"
          title="Hapus filter tanggal"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--color-danger)",
            border: "none",
            borderRadius: "50%",
            width: 18,
            height: 18,
            cursor: "pointer",
            padding: 0,
            flexShrink: 0,
            transition: "opacity 0.15s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = "0.75")}
          onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <X size={10} color="#fff" strokeWidth={3} />
        </button>
      )}
    </div>
  );
}

/**
 * Utility: Filter an array of records by a date field within [from, to].
 * Both from and to are inclusive. Empty string means no bound.
 *
 * @param {Object[]} records
 * @param {string}   dateField  — key on each record, e.g. "supply_date"
 * @param {string}   from       — "YYYY-MM-DD" or ""
 * @param {string}   to         — "YYYY-MM-DD" or ""
 * @returns {Object[]}
 */
export function filterByDateRange(records, dateField, from, to) {
  if (!from && !to) return records;
  return records.filter((r) => {
    const d = r[dateField] || "";
    if (from && d < from) return false;
    if (to   && d > to)   return false;
    return true;
  });
}
