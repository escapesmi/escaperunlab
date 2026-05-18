// src/app/(app)/shoes/ShoesClient.tsx
"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { EmptyState } from "@/components/ui";
import type { Shoe } from "@/types";

const COLORS = ["#00E5A0","#4D9EFF","#A855F7","#FFB347","#FF4D6A","#EC4899"];

interface Props { initialShoes: Shoe[]; userId: string; }

export default function ShoesClient({ initialShoes, userId }: Props) {
  const supabase = createClient();
  const [shoes, setShoes] = useState<Shoe[]>(initialShoes);
  const [adding, setAdding] = useState(false);
  const [retiring, setRetiring] = useState<string | null>(null);
  const [form, setForm] = useState({ brand: "", model: "", mileage: "", max_mileage: "500", color: COLORS[0], notes: "" });
  const [saving, setSaving] = useState(false);

  const addShoe = async () => {
    if (!form.brand || !form.model) return;
    setSaving(true);
    const { data, error } = await supabase.from("shoes").insert({
      user_id: userId,
      brand: form.brand, model: form.model,
      color: form.color,
      mileage: parseFloat(form.mileage) || 0,
      max_mileage: parseFloat(form.max_mileage) || 500,
      notes: form.notes || null,
      status: "active",
    }).select().single();
    if (!error && data) {
      setShoes((s) => [data as Shoe, ...s]);
      setForm({ brand: "", model: "", mileage: "", max_mileage: "500", color: COLORS[0], notes: "" });
      setAdding(false);
    }
    setSaving(false);
  };

  const retireShoe = async (id: string) => {
    await supabase.from("shoes").update({ status: "retired" }).eq("id", id);
    setShoes((s) => s.map((x) => x.id === id ? { ...x, status: "retired" } : x));
    setRetiring(null);
  };

  const activeShoes = shoes.filter((s) => s.status === "active");
  const retiredShoes = shoes.filter((s) => s.status === "retired");

  const ShoeCard = ({ shoe }: { shoe: Shoe }) => {
    const pct = shoe.mileage / shoe.max_mileage;
    const isWarning = pct > 0.8;
    const isRetired = shoe.status === "retired";
    return (
      <div className="rounded-2xl p-5 relative overflow-hidden border transition-all"
        style={{
          background: "#161A22", borderColor: isWarning && !isRetired ? "rgba(255,77,106,0.3)" : "#1E2330",
          opacity: isRetired ? 0.6 : 1,
        }}>
        {/* Accent blob */}
        <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-20"
          style={{ background: shoe.color }} />

        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: shoe.color }} />
              <span className="font-bold text-base">{shoe.model}</span>
            </div>
            <div className="text-text-secondary text-sm mt-0.5">{shoe.brand}</div>
          </div>
          <div className="flex items-center gap-2">
            {isWarning && !isRetired && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(255,77,106,0.1)", color: "#FF4D6A" }}>
                ⚠️ Ganti Segera
              </span>
            )}
            {isRetired && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(107,114,128,0.15)", color: "#6B7280" }}>
                Pensiun
              </span>
            )}
          </div>
        </div>

        {/* Mileage bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-text-muted font-semibold uppercase tracking-wide">Mileage</span>
            <span className="font-mono font-bold" style={{ color: isWarning ? "#FF4D6A" : shoe.color }}>
              {shoe.mileage.toFixed(0)} / {shoe.max_mileage} km
            </span>
          </div>
          <div className="h-2 bg-border rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${Math.min(pct * 100, 100)}%`,
                background: isWarning ? "#FF4D6A" : shoe.color,
              }} />
          </div>
          <div className="text-[11px] text-text-muted mt-1.5">
            {Math.round((1 - pct) * shoe.max_mileage)} km tersisa
          </div>
        </div>

        {shoe.notes && (
          <p className="text-xs text-text-muted mb-3 italic">{shoe.notes}</p>
        )}

        {!isRetired && (
          <button onClick={() => setRetiring(shoe.id)} className="btn-danger text-xs py-2 px-4">
            Pensiun Sepatu
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="px-5 py-4 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="text-2xl font-bold">Shoe Tracker</h1>
          <p className="text-text-secondary text-sm mt-0.5">Pantau mileage sepatumu</p>
        </div>
        <button className="btn-primary py-2.5 px-4 text-sm" onClick={() => setAdding(true)}>
          + Tambah
        </button>
      </div>

      {/* Active Shoes */}
      {activeShoes.length === 0 && !adding ? (
        <EmptyState icon="👟" title="Belum ada sepatu" subtitle="Tambahkan sepatu larimu untuk mulai tracking mileage dan mendapat notifikasi penggantian." />
      ) : (
        <div className="flex flex-col gap-3 animate-fade-up-1">
          {activeShoes.map((shoe) => <ShoeCard key={shoe.id} shoe={shoe} />)}
        </div>
      )}

      {/* Retired */}
      {retiredShoes.length > 0 && (
        <div className="animate-fade-up-2">
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">Sepatu Pensiun</h3>
          <div className="flex flex-col gap-3">
            {retiredShoes.map((shoe) => <ShoeCard key={shoe.id} shoe={shoe} />)}
          </div>
        </div>
      )}

      {/* Retire confirmation */}
      {retiring && (
        <div className="modal-overlay" onClick={() => setRetiring(null)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-2">Pensiun Sepatu? 👟</h3>
            <p className="text-text-secondary text-sm mb-6">Sepatu ini akan dipindah ke arsip. Data mileage tetap tersimpan.</p>
            <div className="flex gap-3">
              <button className="btn-ghost flex-1" onClick={() => setRetiring(null)}>Batal</button>
              <button className="btn-danger flex-[2]" onClick={() => retireShoe(retiring)}>Ya, Pensiun</button>
            </div>
          </div>
        </div>
      )}

      {/* Add shoe modal */}
      {adding && (
        <div className="modal-overlay" onClick={() => setAdding(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl">Tambah Sepatu Baru 👟</h3>
              <button onClick={() => setAdding(false)} className="text-text-muted hover:text-text-primary transition-colors">
                <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Brand</label>
                  <input className="input-field" placeholder="Nike, Adidas, Asics..."
                    value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Model</label>
                  <input className="input-field" placeholder="Pegasus 41..."
                    value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Mileage Awal (km)</label>
                  <input className="input-field" type="number" placeholder="0"
                    value={form.mileage} onChange={(e) => setForm({ ...form, mileage: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Max Mileage (km)</label>
                  <input className="input-field" type="number" placeholder="500"
                    value={form.max_mileage} onChange={(e) => setForm({ ...form, max_mileage: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wide">Warna Sepatu</label>
                <div className="flex gap-2">
                  {COLORS.map((c) => (
                    <button key={c} onClick={() => setForm({ ...form, color: c })}
                      className="w-8 h-8 rounded-full transition-all border-2"
                      style={{ background: c, borderColor: form.color === c ? "white" : "transparent", transform: form.color === c ? "scale(1.2)" : "scale(1)" }} />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Catatan (opsional)</label>
                <input className="input-field" placeholder="e.g. Khusus race day"
                  value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>

              <button className="btn-primary w-full mt-2 disabled:opacity-50" disabled={saving || !form.brand || !form.model}
                onClick={addShoe}>
                {saving ? "Menyimpan..." : "Tambah Sepatu ✓"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
