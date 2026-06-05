"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Client, CatalogPart } from "@/lib/types"
import Header from "@/components/Header"
import NavBar from "@/components/NavBar"

interface CartItem {
  part_name: string
  quantity: number
  unit_price: number
}

export default function SalesPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [catalog, setCatalog] = useState<CatalogPart[]>([])
  const [clientId, setClientId] = useState("")
  const [date, setDate] = useState("")
  const [search, setSearch] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from("clients").select("*").order("name").then(({ data }) => {
      if (data) setClients(data)
    })
    supabase.from("catalog_parts").select("*").order("name").then(({ data }) => {
      if (data) setCatalog(data)
    })
    setDate(new Date().toISOString().slice(0, 10))
  }, [])

  const addToCart = (part: CatalogPart) => {
    setCart((prev) => {
      const ex = prev.find((i) => i.part_name === part.name)
      if (ex) return prev.map((i) => (i.part_name === part.name ? { ...i, quantity: i.quantity + 1 } : i))
      return [...prev, { part_name: part.name, quantity: 1, unit_price: part.price }]
    })
  }

  const removeFromCart = (idx: number) => {
    setCart((prev) => prev.filter((_, i) => i !== idx))
  }

  const updateQty = (idx: number, qty: number) => {
    setCart((prev) => prev.map((i, ix) => (ix === idx ? { ...i, quantity: Math.max(1, qty) } : i)))
  }

  const total = cart.reduce((s, i) => s + i.quantity * i.unit_price, 0)

  const validateSale = async () => {
    if (!clientId || cart.length === 0) return
    setSaving(true)
    const { data: sale, error } = await supabase
      .from("sales")
      .insert({ client_id: parseInt(clientId), total, date })
      .select()
      .single()

    if (sale) {
      await supabase.from("sale_items").insert(
        cart.map((i) => ({
          sale_id: sale.id,
          part_name: i.part_name,
          quantity: i.quantity,
          unit_price: i.unit_price,
        }))
      )
      setCart([])
      alert("✅ Vente enregistrée !")
    }
    setSaving(false)
  }

  const filteredCatalog = catalog.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Header />
      <NavBar />
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-6">
        <h2 className="text-lg font-bold text-txt mb-4">🛒 تسجيل بيع جديد</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="px-3 py-2.5 bg-panel2 border border-line rounded-lg text-txt outline-none focus:border-acc"
          >
            <option value="">-- اختر العميل --</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                ★{c.speed_code} — {c.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2.5 bg-panel2 border border-line rounded-lg text-txt outline-none focus:border-acc"
          />
        </div>

        <input
          placeholder="🔍 بحث في الكتالوج..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 bg-panel2 border border-line rounded-[var(--radius)] text-txt outline-none focus:border-acc mb-4"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
          {filteredCatalog.map((p) => (
            <div
              key={p.id}
              onClick={() => addToCart(p)}
              className="bg-panel2 border border-line rounded-lg p-3 cursor-pointer hover:border-acc transition-colors"
            >
              <div className="text-xs text-chip uppercase font-semibold">{p.category}</div>
              <div className="font-semibold text-txt text-sm mt-1">{p.name}</div>
              <div className="text-ok font-bold text-sm mt-1">{p.price} DH</div>
            </div>
          ))}
        </div>

        <div className="bg-panel border border-line rounded-[var(--radius)] p-4">
          <h3 className="text-base font-bold text-txt mb-3">🧾 السلة ({cart.length})</h3>

          {cart.length === 0 ? (
            <p className="text-muted text-sm text-center py-4">السلة فارغة — اختر قطعاً من الأعلى</p>
          ) : (
            <div className="space-y-2">
              {cart.map((item, idx) => {
                const lineTotal = item.quantity * item.unit_price
                return (
                  <div key={idx} className="flex items-center gap-2 bg-panel2 rounded-lg px-3 py-2">
                    <span className="flex-1 text-txt text-sm">{item.part_name}</span>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateQty(idx, parseInt(e.target.value) || 1)}
                      className="w-16 px-2 py-1 bg-bg border border-line rounded text-txt text-sm text-center"
                    />
                    <span className="text-muted text-sm w-20 text-right">{lineTotal} DH</span>
                    <button onClick={() => removeFromCart(idx)} className="text-danger hover:text-red-300 text-sm">
                      ✕
                    </button>
                  </div>
                )
              })}
              <div className="flex justify-between items-center pt-3 border-t border-line">
                <span className="text-txt font-bold">المجموع:</span>
                <span className="text-ok font-bold text-lg">{total} DH</span>
              </div>
            </div>
          )}

          <button
            onClick={validateSale}
            disabled={saving || !clientId || cart.length === 0}
            className="w-full mt-4 px-4 py-3 bg-ok text-white rounded-lg font-bold hover:brightness-110 transition-all disabled:opacity-50"
          >
            {saving ? "جاري الحفظ..." : "✅ تأكيد البيع"}
          </button>
        </div>
      </main>
    </>
  )
}
