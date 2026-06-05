"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Client, ClientPart } from "@/lib/types"
import Header from "@/components/Header"
import NavBar from "@/components/NavBar"
import SearchBar from "@/components/SearchBar"
import ClientCard from "@/components/ClientCard"
import PartsList from "@/components/PartsList"

export default function Home() {
  const [searchCode, setSearchCode] = useState("")
  const [client, setClient] = useState<Client | null>(null)
  const [parts, setParts] = useState<ClientPart[]>([])
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!searchCode) {
      setClient(null)
      setParts([])
      setNotFound(false)
      return
    }

    const code = parseInt(searchCode)
    if (isNaN(code)) return

    setLoading(true)
    setNotFound(false)

    const fetchData = async () => {
      const { data: c } = await supabase.from("clients").select("*").eq("speed_code", code).single()
      if (!c) {
        setClient(null)
        setParts([])
        setNotFound(true)
      } else {
        setClient(c)
        const { data: p } = await supabase.from("client_parts").select("*").eq("client_id", c.id)
        setParts(p || [])
        setNotFound(false)
      }
      setLoading(false)
    }

    fetchData()
  }, [searchCode])

  return (
    <>
      <Header />
      <NavBar />
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
          <SearchBar onSearch={setSearchCode} />
        </div>

        {loading && (
          <div className="text-center text-muted py-10 text-lg">جاري البحث...</div>
        )}

        {notFound && (
          <div className="bg-panel border border-line rounded-[var(--radius)] p-6 text-center">
            <p className="text-muted text-lg mb-3">⚠️ لا يوجد زبون بهذا الكود</p>
            <a
              href="/clients"
              className="inline-block px-5 py-2.5 bg-acc text-white rounded-lg font-semibold hover:bg-acc2 transition-colors"
            >
              ➕ إضافة زبون جديد
            </a>
          </div>
        )}

        {client && (
          <div className="space-y-4">
            <ClientCard client={client} />
            <div className="bg-panel border border-line rounded-[var(--radius)] p-5">
              <h2 className="text-base font-bold text-txt mb-4 flex items-center gap-2">
                <span>⚙️</span> قطعه المفضلة
              </h2>
              <PartsList parts={parts} />
            </div>
          </div>
        )}

        {!searchCode && !loading && (
          <div className="text-center text-muted py-16">
            <div className="text-6xl mb-4">🔧</div>
            <p className="text-lg">أدخل كود الزبون للبحث السريع</p>
            <p className="text-sm mt-2">مثال: 48</p>
          </div>
        )}
      </main>
    </>
  )
}
