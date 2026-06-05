"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { CatalogPart, TopPart } from "@/lib/types"
import Header from "@/components/Header"
import NavBar from "@/components/NavBar"

export default function CatalogPage() {
  const [parts, setParts] = useState<CatalogPart[]>([])
  const [search, setSearch] = useState("")
  const [newPart, setNewPart] = useState({ name: "", category: "Divers", price: 0, reference: "" })
  const [topParts, setTopParts] = useState<TopPart[]>([])

  useEffect(() => {
    loadParts()
    loadTopParts()
  }, [])

  const loadParts = async () => {
    const { data } = await supabase.from("catalog_parts").select("*").order("category").order("name")
    if (data) setParts(data)
  }

  const loadTopParts = async () => {
    const { data } = await supabase
      .from("sale_items")
      .select("part_name, quantity")
    if (!data) return
    const counts: Record<string, number> = {}
    data.forEach((i) => {
      counts[i.part_name] = (counts[i.part_name] || 0) + i.quantity
    })
    setTopParts(
      Object.entries(counts)
        .map(([part_name, total_qty]) => ({ part_name, total_qty }))
        .sort((a, b) => b.total_qty - a.total_qty)
        .slice(0, 10)
    )
  }

  const addPart = async () => {
    if (!newPart.name.trim()) return
    await supabase.from("catalog_parts").insert({
      name: newPart.name.trim(),
      category: newPart.category.trim() || "Divers",
      price: newPart.price || 0,
      reference: newPart.reference.trim() || null,
    })
    setNewPart({ name: "", category: "Divers", price: 0, reference: "" })
    loadParts()
  }

  const deletePart = async (id: number) => {
    await supabase.from("catalog_parts").delete().eq("id", id)
    loadParts()
  }

  const filtered = parts.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  )

  const grouped: Record<string, CatalogPart[]> = {}
  filtered.forEach((p) => {
    if (!grouped[p.category]) grouped[p.category] = []
    grouped[p.category].push(p)
  })

  const maxTop = topParts.length > 0 ? topParts[0].total_qty : 1

  return (
    <>
      <Header />
      <NavBar />
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-6">
        <div className="bg-panel border border-line rounded-[var(--radius)] p-4 mb-4">
          <h3 className="text-sm font-bold text-txt mb-3">➕ إضافة قطعة جديدة للكتالوج</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <input
              placeholder="الاسم *"
              value={newPart.name}
              onChange={(e) => setNewPart({ ...newPart, name: e.target.value })}
              className="px-3 py-2 bg-panel2 border border-line rounded-lg text-txt text-sm outline-none focus:border-acc"
            />
            <input
              placeholder="التصنيف"
              value={newPart.category}
              onChange={(e) => setNewPart({ ...newPart, category: e.target.value })}
              className="px-3 py-2 bg-panel2 border border-line rounded-lg text-txt text-sm outline-none focus:border-acc"
            />
            <input
              type="number"
              placeholder="السعر (DH)"
              value={newPart.price || ""}
              onChange={(e) => setNewPart({ ...newPart, price: parseFloat(e.target.value) || 0 })}
              className="px-3 py-2 bg-panel2 border border-line rounded-lg text-txt text-sm outline-none focus:border-acc"
            />
            <input
              placeholder="المرجع"
              value={newPart.reference}
              onChange={(e) => setNewPart({ ...newPart, reference: e.target.value })}
              className="px-3 py-2 bg-panel2 border border-line rounded-lg text-txt text-sm outline-none focus:border-acc"
            />
          </div>
          <button
            onClick={addPart}
            disabled={!newPart.name.trim()}
            className="mt-3 px-4 py-2 bg-acc text-white rounded-lg font-semibold hover:bg-acc2 transition-colors text-sm disabled:opacity-50"
          >
            ➕ إضافة
          </button>
        </div>

        <input
          placeholder="🔍 بحث في الكتالوج..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 bg-panel2 border border-line rounded-[var(--radius)] text-txt outline-none focus:border-acc mb-4"
        />

        {Object.keys(grouped).length === 0 ? (
          <div className="text-center text-muted py-10">الكتالوج فارغ</div>
        ) : (
          <div className="space-y-4">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="bg-panel border border-line rounded-[var(--radius)] p-4">
                <h3 className="text-sm font-bold text-chip mb-3">📂 {category}</h3>
                <div className="space-y-1">
                  {items.map((p) => (
                    <div key={p.id} className="flex items-center justify-between py-2 border-b border-line last:border-0">
                      <div>
                        <span className="text-txt font-medium text-sm">{p.name}</span>
                        {p.reference && (
                          <span className="ml-2 px-2 py-0.5 bg-acc/10 text-chip text-xs rounded-full font-mono">
                            {p.reference}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-ok font-bold text-sm">{p.price} DH</span>
                        <button onClick={() => deletePart(p.id)} className="text-danger hover:text-red-300 text-xs">
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {topParts.length > 0 && (
          <div className="bg-panel border border-line rounded-[var(--radius)] p-4 mt-6">
            <h3 className="text-sm font-bold text-txt mb-3">🏆 أكثر القطع مبيعاً</h3>
            <div className="space-y-2">
              {topParts.map((p) => (
                <div key={p.part_name}>
                  <div className="flex justify-between text-sm">
                    <span className="text-txt">{p.part_name}</span>
                    <span className="text-muted">{p.total_qty} مباع</span>
                  </div>
                  <div className="h-2 bg-panel2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-acc rounded-full transition-all"
                      style={{ width: `${(p.total_qty / maxTop) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  )
}
