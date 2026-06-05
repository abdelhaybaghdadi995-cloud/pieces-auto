"use client"

import { useState } from "react"

export default function SearchBar({ onSearch }: { onSearch: (code: string) => void }) {
  const [value, setValue] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, "")
    setValue(v)
    onSearch(v)
  }

  return (
    <div className="relative">
      <div className="flex items-center bg-panel2 border border-line rounded-[var(--radius)] px-4 py-3 focus-within:border-acc transition-colors">
        <span className="text-xl mr-3">🔍</span>
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={handleChange}
          placeholder="أدخل كود الزبون..."
          className="flex-1 bg-transparent text-txt text-lg outline-none placeholder:text-muted/50"
          autoFocus
        />
        {value && (
          <button
            onClick={() => { setValue(""); onSearch("") }}
            className="text-muted hover:text-txt ml-2 text-lg"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
