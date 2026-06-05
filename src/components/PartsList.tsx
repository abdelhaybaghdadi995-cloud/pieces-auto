"use client"

import type { ClientPart } from "@/lib/types"

export default function PartsList({ parts, onDelete }: { parts: ClientPart[]; onDelete?: (id: number) => void }) {
  if (parts.length === 0) {
    return <p className="text-muted text-sm py-4 text-center">لا توجد قطع مرتبطة بعد</p>
  }

  return (
    <div className="space-y-2">
      {parts.map((p) => (
        <div
          key={p.id}
          className="flex items-center justify-between bg-panel2 border border-line rounded-lg px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <span className="text-chip">🔹</span>
            <div>
              <span className="font-medium text-txt">{p.part_name}</span>
              {p.reference && (
                <span className="ml-2 px-2 py-0.5 bg-acc/10 text-chip text-xs rounded-full font-mono">
                  {p.reference}
                </span>
              )}
              {p.category && (
                <span className="ml-2 text-muted text-xs">{p.category}</span>
              )}
            </div>
          </div>
          {p.notes && <span className="text-muted text-xs italic">{p.notes}</span>}
          {onDelete && (
            <button
              onClick={() => onDelete(p.id)}
              className="text-danger hover:text-red-300 text-sm ml-2"
            >
              ✕
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
