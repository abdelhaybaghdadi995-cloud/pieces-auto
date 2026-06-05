"use client"

import Link from "next/link"
import type { Client } from "@/lib/types"

export default function ClientCard({ client }: { client: Client }) {
  return (
    <Link href={`/clients/${client.id}`}>
      <div className="bg-panel border border-line rounded-[var(--radius)] p-5 hover:border-acc transition-all cursor-pointer hover:-translate-y-0.5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-txt">{client.name}</h3>
            <span className="inline-block mt-1 px-3 py-0.5 bg-acc/20 text-chip text-sm rounded-full font-semibold">
              ★ كود {client.speed_code}
            </span>
          </div>
          <div className="text-3xl">👤</div>
        </div>
        {client.car_model && (
          <p className="text-muted text-sm flex items-center gap-2 mt-2">
            <span>🚗</span> {client.car_model}
          </p>
        )}
        {client.phone && (
          <p className="text-muted text-sm flex items-center gap-2 mt-1">
            <span>📞</span> {client.phone}
          </p>
        )}
      </div>
    </Link>
  )
}
