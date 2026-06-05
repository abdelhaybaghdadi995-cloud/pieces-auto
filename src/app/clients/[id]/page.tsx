"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import type { Client, ClientPart } from "@/lib/types"
import Header from "@/components/Header"
import NavBar from "@/components/NavBar"
import PartsList from "@/components/PartsList"

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [client, setClient] = useState<Client | null>(null)
  const [parts, setParts] = useState<ClientPart[]>([])
  const [newPart, setNewPart] = useState({ part_name: "", reference: "", category: "", notes: "" })

  useEffect(() => {
    if (!id) return
    supabase.from("clients").select("*").eq("id", id).single().then(({ data }) => {
      if (!data) router.push("/clients")
      else setClient(data)
    })
    loadParts()
  }, [id])

  const loadParts = async () => {
    const { data } = await supabase.from("client_parts").select("*").eq("client_id", id).order("part_name")
    if (data) setParts(data)
  }

  const addPart = async () => {
    if (!newPart.part_name.trim()) return
    await supabase.from("client_parts").insert({
      client_id: parseInt(id),
      part_name: newPart.part_name.trim(),
      reference: newPart.reference.trim() || null,
      category: newPart.category.trim() || null,
      notes: newPart.notes.trim() || null,
    })
    setNewPart({ part_name: "", reference: "", category: "", notes: "" })
    loadParts()
  }

  const deletePart = async (partId: number) => {
    await supabase.from("client_parts").delete().eq("id", partId)
    loadParts()
  }

  if (!client) return null

  return (
    <>
      <Header />
      <NavBar />
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6">
        <button
          onClick={() => router.back()}
          className="text-muted hover:text-txt text-sm mb-4 flex items-center gap-1"
        >
          ← رجوع
        </button>

        <div className="bg-panel border border-line rounded-[var(--radius)] p-5 mb-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-txt">{client.name}</h2>
              <p className="text-chip font-semibold mt-1">★ كود {client.speed_code}</p>
            </div>
            <div className="text-4xl">👤</div>
          </div>
          {client.car_model && (
            <p className="text-muted mt-3 flex items-center gap-2">
              <span>🚗</span> {client.car_model}
            </p>
          )}
          {client.phone && (
            <p className="text-muted mt-1 flex items-center gap-2">
              <span>📞</span> {client.phone}
            </p>
          )}
        </div>

        <div className="bg-panel border border-line rounded-[var(--radius)] p-5">
          <h3 className="text-base font-bold text-txt mb-4">⚙️ القطع المرتبطة</h3>
          <PartsList parts={parts} onDelete={deletePart} />

          <div className="mt-4 pt-4 border-t border-line">
            <h4 className="text-sm font-semibold text-muted mb-3">➕ إضافة قطعة جديدة</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                placeholder="اسم القطعة *"
                value={newPart.part_name}
                onChange={(e) => setNewPart({ ...newPart, part_name: e.target.value })}
                className="w-full px-3 py-2 bg-panel2 border border-line rounded-lg text-txt outline-none focus:border-acc text-sm"
              />
              <input
                placeholder="المرجع (مثال: OC 123)"
                value={newPart.reference}
                onChange={(e) => setNewPart({ ...newPart, reference: e.target.value })}
                className="w-full px-3 py-2 bg-panel2 border border-line rounded-lg text-txt outline-none focus:border-acc text-sm"
              />
              <input
                placeholder="التصنيف"
                value={newPart.category}
                onChange={(e) => setNewPart({ ...newPart, category: e.target.value })}
                className="w-full px-3 py-2 bg-panel2 border border-line rounded-lg text-txt outline-none focus:border-acc text-sm"
              />
              <input
                placeholder="ملاحظات"
                value={newPart.notes}
                onChange={(e) => setNewPart({ ...newPart, notes: e.target.value })}
                className="w-full px-3 py-2 bg-panel2 border border-line rounded-lg text-txt outline-none focus:border-acc text-sm"
              />
            </div>
            <button
              onClick={addPart}
              disabled={!newPart.part_name.trim()}
              className="mt-3 px-4 py-2 bg-acc text-white rounded-lg font-semibold hover:bg-acc2 transition-colors text-sm disabled:opacity-50"
            >
              ➕ إضافة
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
