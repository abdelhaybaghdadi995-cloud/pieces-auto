"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Client } from "@/lib/types"
import Header from "@/components/Header"
import NavBar from "@/components/NavBar"
import ClientCard from "@/components/ClientCard"

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: "", phone: "", car_model: "" })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    const { data } = await supabase.from("clients").select("*").order("name")
    if (data) setClients(data)
  }

  const getNextCode = async (): Promise<number> => {
    const { data } = await supabase.from("clients").select("speed_code").order("speed_code")
    if (!data || data.length === 0) return 1
    const existing = new Set(data.map((c) => c.speed_code))
    let code = 1
    while (existing.has(code)) code++
    return code
  }

  const addClient = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    const code = await getNextCode()
    await supabase.from("clients").insert({
      speed_code: code,
      name: form.name.trim(),
      phone: form.phone.trim() || null,
      car_model: form.car_model.trim() || null,
    })
    setForm({ name: "", phone: "", car_model: "" })
    setShowForm(false)
    setSaving(false)
    loadClients()
  }

  const deleteClient = async (id: number) => {
    if (!confirm("Supprimer ce client et tout son historique ?")) return
    await supabase.from("clients").delete().eq("id", id)
    loadClients()
  }

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.speed_code.toString().includes(search) ||
      (c.phone || "").includes(search) ||
      (c.car_model || "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Header />
      <NavBar />
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-txt">👤 العملاء</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-acc text-white rounded-lg font-semibold hover:bg-acc2 transition-colors text-sm"
          >
            {showForm ? "✕ إلغاء" : "➕ إضافة عميل"}
          </button>
        </div>

        {showForm && (
          <div className="bg-panel border border-line rounded-[var(--radius)] p-4 mb-4 space-y-3">
            <input
              placeholder="الاسم الكامل *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2.5 bg-panel2 border border-line rounded-lg text-txt outline-none focus:border-acc"
            />
            <input
              placeholder="رقم الهاتف"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2.5 bg-panel2 border border-line rounded-lg text-txt outline-none focus:border-acc"
            />
            <input
              placeholder="نوع السيارة (مثال: Dacia Logan)"
              value={form.car_model}
              onChange={(e) => setForm({ ...form, car_model: e.target.value })}
              className="w-full px-3 py-2.5 bg-panel2 border border-line rounded-lg text-txt outline-none focus:border-acc"
            />
            <button
              onClick={addClient}
              disabled={saving || !form.name.trim()}
              className="w-full px-4 py-2.5 bg-ok text-white rounded-lg font-semibold hover:brightness-110 transition-all disabled:opacity-50"
            >
              {saving ? "جاري الحفظ..." : "💾 حفظ العميل"}
            </button>
          </div>
        )}

        <input
          placeholder="🔍 بحث باسم أو كود أو هاتف..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 bg-panel2 border border-line rounded-[var(--radius)] text-txt outline-none focus:border-acc mb-4"
        />

        {filtered.length === 0 ? (
          <div className="text-center text-muted py-10">
            {search ? "لا توجد نتائج" : "لا يوجد عملاء بعد"}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((c) => (
              <div key={c.id} className="relative">
                <ClientCard client={c} />
                <button
                  onClick={() => deleteClient(c.id)}
                  className="absolute top-3 right-3 text-danger hover:text-red-300 text-sm bg-panel2/80 rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
